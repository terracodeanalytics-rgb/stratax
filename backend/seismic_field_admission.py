"""Field estimates and Google Batch lifecycle, behind existing owner-scoped tool APIs."""
import json
import os
import re

from google.cloud import storage

from seismic_field_profiles import FieldProfile, index_plan, batch_job
from seismic_processing import require


def native_source_identity(uid,pid,record,dataset):
    """Admit a field source using bounded catalog metadata, without reading survey samples."""
    import hashlib
    from seismic_trace_index import HEADERS
    source_id = dataset.get('sourceId','')
    require(re.fullmatch(r'[A-Za-z0-9_-]{1,128}',source_id), 'Invalid original source identity.')
    original = next((f for f in record.get('workspace',{}).get('files',[]) if f['id'] == source_id),None)
    require(original and original.get('generation'), 'Field indexing requires a generation-pinned Cloud original.')
    extension = original['name'].lower().rsplit('.',1)[-1]
    require(extension in ('sgy','segy','su'), 'Select a supported native SEG-Y/SU field source.')
    metadata = dataset.get('metadata',{})
    require(set(metadata.get('headerBytes',{})) == set(HEADERS),
            'Reinspect the native source to retain its complete header mapping before field indexing.')
    client = storage.Client()
    bucket_name = os.environ['STRATAX_PROJECT_BUCKET']
    path = f'owners/{uid}/projects/{pid}/originals/{source_id}'
    blob = client.bucket(bucket_name).blob(path,generation=original['generation'])
    blob.reload()
    require(blob.size == original['size'], 'The stored native original changed size.')
    retained = None
    manifest_path = dataset.get('manifest','')
    require(manifest_path.startswith(f'owners/{uid}/projects/{pid}/') and '..' not in manifest_path.split('/')
            and '\\' not in manifest_path, 'The source metadata leaves its admitted project.')
    meta = client.bucket(os.environ['STRATAX_DERIVED_BUCKET']).blob(manifest_path)
    meta.reload()
    if meta.size <= 2*1024**2:
        raw = meta.download_as_bytes(if_generation_match=int(meta.generation))
        manifest = json.loads(raw)
        if manifest.get('metadata',{}).get('traceIndex',{}).get('complete'):
            retained = dict(bucket=meta.bucket.name,object=meta.name,generation=str(meta.generation),
                sha256=hashlib.sha256(raw).hexdigest(),sourceVersion=dataset['sourceSha256'])
    return dict(bucket=bucket_name,object=path,generation=str(blob.generation),size=blob.size,
        kind='su' if extension == 'su' else 'segy',endian=metadata.get('endian','big'),
        headerBytes=metadata['headerBytes'],indexHeaderBytes=metadata['headerBytes'],indexManifest=retained,
        storageClass=blob.storage_class)


def field_configuration(body, bindings):
    require(body.tool == 'index-manifest', 'This field implementation currently admits analytical indexing only.')
    profiles = json.loads(os.environ.get('STRATAX_SEISMIC_FIELD_PROFILES','{}'))
    require(body.execution.profileId in profiles, 'This field profile has not been configured; no compute was started.')
    profile = FieldProfile(**profiles[body.execution.profileId])
    profile.require_current_pricing()
    require(set(body.parameters) <= {'firstTrace','traceCount','tracesPerPartition','displayLevels','$inputs'},
            'Field indexing does not accept ignored algorithm parameters.')
    policy = json.loads(os.environ.get('STRATAX_SEISMIC_STORAGE_POLICY','{}'))
    binding = next(v for v in bindings.values() if v['kind'] == 'index-source')
    require(len(bindings) == 1, 'Field indexing requires exactly one admitted native source.')
    client = storage.Client()
    source_bucket = client.get_bucket(binding['identity']['bucket'])
    output_bucket = client.get_bucket(os.environ['STRATAX_DERIVED_BUCKET'])
    source_location = source_bucket.location.lower()
    output_location = output_bucket.location.lower()
    require(output_bucket.storage_class == 'STANDARD', 'Field analytical output requires an explicitly configured Standard bucket.')
    if binding['identity'].get('storageClass') != 'STANDARD' and not source_bucket.autoclass_enabled:
        require(profile.retrievalGiBUsd > 0, 'Include cold-source retrieval pricing before approving this run.')
    policy = policy | dict(sourceLocation=source_location,location=output_location)
    manifest = dict(rowCount=binding['traceCount'])
    plan = index_plan(binding,manifest,body.parameters,body.execution,profile,policy)
    return profile,plan,policy,binding['datasetId']


def reusable_index(project_ref,cache_key):
    from google.cloud.firestore_v1.base_query import FieldFilter
    from scientific_api import restore_value
    for document in project_ref.collection('seismicRuns').where(filter=FieldFilter('cacheKey','==',cache_key)).limit(20).stream():
        run = restore_value(document.to_dict())
        if (run.get('status') == 'accepted' and run.get('settled') and run.get('outputManifest',{}).get('format') == 'json'
                and not run.get('reusedFromRunId')):
            return dict(id=run['id'],artifact=run['outputManifest'])
    return None


def submit_field(run, run_path, session):
    plan = run['estimate']['fieldPlan']
    p = FieldProfile(**plan['profile'])
    parent = f'projects/{p.project}/locations/{p.region}'
    phase = run.get('fieldPhase','headers')
    require(phase in ('headers','data'), 'Invalid field execution phase.')
    require(run['jobName'] == parent+'/jobs/'+run['id']+'-'+phase, 'Field provider identity changed after admission.')
    document = batch_job(plan,run_path,run['input'])
    document['taskGroups'][0]['taskSpec']['environment']['variables']['STRATAX_SEISMIC_FIELD_PHASE'] = phase
    if phase == 'headers':
        document['taskGroups'][0].update(taskCount=1,parallelism=1)
    document['labels'] = dict(stratax_run=run['id'],stratax_plan=plan['fingerprint'][:63],stratax_phase=phase)
    response = session.post('https://batch.googleapis.com/v1/'+parent+'/jobs',
                            params=dict(jobId=run['id']+'-'+phase),json=document,timeout=30)
    if response.status_code == 409:
        response = session.get('https://batch.googleapis.com/v1/'+run['jobName'],timeout=20)
    if response.status_code in (200,201):
        require(all(response.json().get('labels',{}).get(key) == value for key,value in document['labels'].items()),
                'A provider job already exists with a different approval identity.')
    return response


def field_usage(client, run, uid, pid):
    prefix = f'owners/{uid}/projects/{pid}/seismic/runs/{run["id"]}/'
    return sum(blob.size or 0 for blob in client.list_blobs(run['input']['bucket'],prefix=prefix))


def reconcile_field(db, ref, item, run, session):
    from scientific_api import restore_value
    from google.cloud import firestore
    from seismic_runs_api import settle, public_run
    require(re.fullmatch(r'projects/[\w-]+/locations/[\w-]+/jobs/sx-[a-f0-9]{32}-(headers|data)',run['jobName']),
            'Invalid field provider identity.')
    if run.get('cancelOperation'):
        operation = run['cancelOperation']
        require(re.fullmatch(r'projects/[\w-]+/locations/[\w-]+/operations/[\w-]+',operation),
                'Invalid field cancellation identity.')
        response = session.get('https://batch.googleapis.com/v1/'+operation,timeout=20)
        if response.status_code == 200 and response.json().get('done') and not response.json().get('error'):
            return public_run(settle(db,ref,item,'cancelled',field_usage(storage.Client(),run,run['ownerUid'],ref.id)))
        return public_run(run)
    response = session.get('https://batch.googleapis.com/v1/'+run['jobName'],timeout=20)
    if response.status_code == 404 and run.get('dispatchState') in ('scheduling','uncertain') and not run.get('cancelRequested'):
        # A deterministic Batch job ID makes retrying an ambiguous create idempotent.
        response = submit_field(run,item.path,session)
        if response.status_code in (200,201):
            item.update(dict(dispatchState='submitted',execution=run['jobName']))
        return public_run(restore_value(item.get().to_dict()))
    if response.status_code != 200:
        return public_run(run)
    value = response.json()
    expected = run['estimate']['fieldPlan']['fingerprint'][:63]
    require(value.get('labels',{}).get('stratax_plan') == expected, 'Field job approval identity changed.')
    state = value.get('status',{}).get('state')
    if state == 'SUCCEEDED' and run.get('fieldPhase') == 'headers' and not run.get('cancelRequested'):
        @firestore.transactional
        def advance(tx):
            latest=restore_value(item.get(transaction=tx).to_dict())
            if latest.get('settled') or latest.get('cancelRequested') or latest.get('fieldPhase')!='headers':
                return None
            if not latest.get('nativeIndexDocument'):
                return latest
            latest.update(fieldPhase='data',jobName=run['jobName'].removesuffix('-headers')+'-data',dispatchState='scheduling')
            tx.set(item,{key:latest[key] for key in ('fieldPhase','jobName','dispatchState')},merge=True)
            return latest
        latest=advance(db.transaction())
        if latest is None:
            return public_run(restore_value(item.get().to_dict()))
        if not latest.get('nativeIndexDocument'):
            actual=field_usage(storage.Client(),latest,latest['ownerUid'],ref.id)
            return public_run(settle(db,ref,item,'failed',actual,dict(error='Native indexing ended without committing its directory.')))
        response = submit_field(latest,item.path,session)
        if response.status_code in (200,201):
            item.update(dict(dispatchState='submitted',execution=latest['jobName']))
        elif response.status_code in (400,403,422):
            actual = field_usage(storage.Client(),latest,latest['ownerUid'],ref.id)
            return public_run(settle(db,ref,item,'failed',actual,dict(error='Analytical partition scheduling was rejected.')))
        else:
            item.update(dict(dispatchState='uncertain'))
        return public_run(restore_value(item.get().to_dict()))
    if state in ('FAILED','SUCCEEDED'):
        latest = restore_value(item.get().to_dict())
        if latest.get('settled'):
            return public_run(latest)
        actual = field_usage(storage.Client(),run,run['ownerUid'],ref.id)
        return public_run(settle(db,ref,item,'failed',actual,dict(
            error='The field job ended without committing a complete analytical manifest. Retain its partitions for reviewed restart.')))
    item.update(dict(providerState=state,dispatchState='submitted'))
    return public_run(restore_value(item.get().to_dict()))


def cancel_field(item, run, session):
    require(re.fullmatch(r'projects/[\w-]+/locations/[\w-]+/jobs/sx-[a-f0-9]{32}-(headers|data)',run['jobName']),
            'Invalid field cancellation scope.')
    if run.get('cancelOperation'):
        return
    response = session.delete('https://batch.googleapis.com/v1/'+run['jobName'],timeout=30)
    if response.status_code == 200:
        operation = response.json().get('name')
        require(isinstance(operation,str) and '/operations/' in operation, 'Field shutdown was not confirmed.')
        item.update(dict(cancelOperation=operation))
    else:
        require(response.status_code == 404, 'Field shutdown is pending; its reservation is retained.')
