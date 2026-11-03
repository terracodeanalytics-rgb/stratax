"""Admitted Google Batch analytical indexing; no infrastructure is created on import."""
import hashlib
import json
import logging
import os
import re
import time

from google.cloud import firestore, storage

from scientific_api import restore_value, firestore_value, now
from seismic_processing import require
from seismic_artifact_ranges import ArtifactReader
from seismic_field_artifacts import FieldPublisher, directory_tree, json_bytes, geometry_bounds
from seismic_field_profiles import fingerprint
from seismic_runs_api import settle


def load_payload(client,run,project_id):
    source = run['input']
    require(source['path'].startswith(f'owners/{run["ownerUid"]}/projects/{project_id}/seismic/tool-inputs/')
            and '..' not in source['path'].split('/'), 'Field input leaves the admitted project.')
    blob = client.bucket(source['bucket']).blob(source['path'],generation=source['generation'])
    blob.reload()
    require(blob.size <= 8*1024**2, 'Field metadata exceeds its admitted read budget.')
    raw = blob.download_as_bytes(if_generation_match=int(source['generation']))
    require(hashlib.sha256(raw).hexdigest() == source['sha256'], 'Field input checksum changed.')
    return json.loads(raw)


def execute_headers(db,client,run_path,attempt):
    from seismic_native_directory import native_directory
    require(re.fullmatch(r'stratax_projects/[\w-]{1,128}/records/[\w-]{1,100}/seismicRuns/sx-[a-f0-9]{32}',run_path),
            'Invalid native header run scope.')
    ref = db.document(run_path)
    project_id = run_path.split('/')[3]
    run = restore_value(ref.get().to_dict())
    require(run and run.get('providerKind') == 'google-batch' and run.get('fieldPhase') == 'headers'
            and not run.get('settled') and not run.get('cancelRequested'), 'Native header phase is unavailable.')
    plan = run['estimate']['fieldPlan']
    require(0 <= attempt < plan['maximumAttempts'] and plan['fingerprint'] == fingerprint(
        {key:value for key,value in plan.items() if key != 'fingerprint'}), 'Native header approval changed.')
    if run.get('nativeIndexDocument'):
        return
    previous=None
    if run.get('restartRunId'):
        parent=db.document('/'.join(run_path.split('/')[:4])).collection('seismicRuns').document(run['restartRunId'])
        previous=restore_value(parent.get().to_dict())
        require(previous and previous['estimate']['parameterSha256']==run['estimate']['parameterSha256'],
                'The native restart inputs changed.')
    cursor=run.get('nativeCheckpoint') or (previous or {}).get('nativeCheckpoint')
    segments=list(run.get('nativeChunkRanges') or (previous or {}).get('nativeChunkRanges',[]))
    require(len(segments) <= 64 and (not cursor or cursor['chunkCount'] == 0 or segments),
            'Native restart directory provenance is missing or exceeds its metadata budget.')
    payload = load_payload(client,run,project_id)
    binding = next(value for value in payload['bindings'].values() if value['kind'] == 'index-source')
    require(binding['sourceVersion'] == plan['sourceVersion'], 'Native header source version changed.')
    prefix = f'owners/{run["ownerUid"]}/projects/{project_id}/seismic/runs/{ref.id}/headers/'
    last_check,cancel_state = [0],[False]
    def cancelled():
        if time.monotonic()-last_check[0] >= 1:
            value = restore_value(ref.get().to_dict())
            cancel_state[0] = not value or value.get('cancelRequested') or value.get('settled')
            last_check[0] = time.monotonic()
        return cancel_state[0]
    publisher = FieldPublisher(client.bucket(run['input']['bucket']),prefix,run['reservation'],cancelled=cancelled)
    def save_chunk(index,entry,cursor):
        if segments and segments[-1]['runId']==ref.id:
            segments[-1]=segments[-1]|dict(lastChunk=index+1)
        else:
            segments.append(dict(runId=ref.id,firstChunk=index,lastChunk=index+1))
        require(len(segments)<=64, 'The native restart chain requires explicit metadata consolidation.')
        @firestore.transactional
        def write(tx):
            current = restore_value(ref.get(transaction=tx).to_dict())
            require(not current.get('cancelRequested') and not current.get('settled'), 'Native indexing stopped.')
            if current.get('nativeCheckpoint',{}).get('nextTrace',0)>cursor['nextTrace']:
                return
            current.update(nativeCheckpoint=cursor,nativeChunkRanges=list(segments),status='running',
                checkpoint=dict(kind='native-headers',runId=ref.id,planFingerprint=plan['fingerprint']),
                progress=dict(phase='headers',bytesIndexed=cursor['nextByte'],totalBytes=binding['identity']['size']))
            tx.set(ref.collection('headerChunks').document(f'{index:09d}'),firestore_value(entry))
            tx.set(ref,firestore_value(current))
        write(db.transaction())
    def load_chunk(index):
        segment=next((s for s in segments if s['firstChunk']<=index<s['lastChunk']),None)
        require(segment and re.fullmatch(r'sx-[a-f0-9]{32}',segment['runId']), 'Native locator page has no admitted checkpoint provenance.')
        source_ref=db.document('/'.join(run_path.split('/')[:4])).collection('seismicRuns').document(segment['runId'])
        value = restore_value(source_ref.collection('headerChunks').document(f'{index:09d}').get().to_dict())
        require(value is not None, 'Native checkpoint has a missing locator page.')
        return value
    document = native_directory(client,binding,publisher.put,load_chunk=load_chunk,save_chunk=save_chunk,
        cursor=cursor,cancelled=cancelled)
    artifact = publisher.put('manifest.json',json_bytes(document))
    indexed = dict(bucket=run['input']['bucket'],object=artifact['path'],generation=artifact['generation'],
                   sha256=artifact['sha256'],sourceVersion=binding['sourceVersion'],bytes=artifact['bytes'])
    actual = sum(blob.size or 0 for blob in client.list_blobs(run['input']['bucket'],prefix=prefix))
    ref.update(dict(nativeIndexDocument=indexed,nativeArtifactBytes=actual,
        checkpoint=dict(kind='native-headers',runId=ref.id,planFingerprint=plan['fingerprint'])))


def finalize_index(db, project_ref, run_ref, client):
    """Only the last committed partition owns metadata assembly; no survey arrays are loaded."""
    actor = os.environ.get('BATCH_TASK_INDEX','local')
    @firestore.transactional
    def claim(tx):
        run = restore_value(run_ref.get(transaction=tx).to_dict())
        if run.get('settled') or run.get('cancelRequested') or run.get('completedPartitions',0) != run['estimate']['fieldPlan']['partitionCount']:
            return None
        if run.get('finalizeLeaseUntil',0) > time.time() and run.get('finalizeOwner') != actor:
            return None
        run['finalizeLeaseUntil'] = time.time()+120
        run['finalizeOwner'] = actor
        tx.set(run_ref,firestore_value(run))
        return run
    run = claim(db.transaction())
    if run is None:
        return
    uid,pid = run['ownerUid'],project_ref.id
    prefix = f'owners/{uid}/projects/{pid}/seismic/runs/{run_ref.id}/'
    plan = run['estimate']['fieldPlan']
    bucket = client.bucket(run['input']['bucket'])
    cancelled = lambda: bool(restore_value(run_ref.get().to_dict()).get('cancelRequested'))
    publisher = FieldPublisher(bucket,prefix,max(1024,run['reservation']-run.get('committedBytes',0)),cancelled=cancelled)
    def entries():
        for index in range(plan['partitionCount']):
            if index % 128 == 0:
                require(not cancelled(), 'Index finalisation cancelled.')
                run_ref.update(dict(finalizeLeaseUntil=time.time()+120))
            part = restore_value(run_ref.collection('fieldPartitions').document(f'{index:09d}').get().to_dict())
            require(part and part.get('status') == 'completed', 'An analytical partition has not committed.')
            yield dict(firstTrace=part['firstTrace'],traceCount=part['traceCount'],reference=part['partition'],
                       headerBounds=part.get('headerBounds',{}))
    try:
        tree = directory_tree(entries(),publisher.put)
        result = dict(kind='stratax-cloud-analytical-index/2',complete=True,partitionTree=tree,
            sourceVersion=plan['sourceVersion'],sourceId=run['estimate']['indexSourceId'],
            firstTrace=plan['firstTrace'],traceCount=plan['traceCount'],partitionCount=plan['partitionCount'],
            tracesPerPartition=plan['tracesPerPartition'],displayLevels=plan['displayLevels'],
            analytical=True,lossless=True,sharded=True,zarrFormat=3,geometryInferred=False,
            nativeIndex=run['nativeIndexDocument'],
            engineVersion=run['estimate']['engineVersion'],estimateFingerprint=run['estimateFingerprint'])
        result['dependencies']=[run['restartRunId']] if run.get('restartRunId') else []
        result['dependencyResolution']='transitive-artifact-references'
        artifact = publisher.put('manifest.json',json_bytes(result)) | dict(format='json')
        actual = sum(blob.size or 0 for blob in client.list_blobs(bucket.name,prefix=prefix))
        require(actual <= run['reservation'], 'The field result exceeds its approved storage allowance.')
        settle(db,project_ref,run_ref,'completed',actual,dict(outputManifest=artifact,
            outputSchema={},usage=dict(billingConfirmed=False,completedPartitions=plan['partitionCount']),
            finalizeLeaseUntil=0))
    except Exception:
        run_ref.update(dict(finalizeLeaseUntil=0))
        raise


def execute_partition(db, client, run_path, task_index, attempt):
    require(re.fullmatch(r'stratax_projects/[\w-]{1,128}/records/[\w-]{1,100}/seismicRuns/sx-[a-f0-9]{32}',run_path),
            'Invalid admitted field run scope.')
    run_ref = db.document(run_path)
    project_ref = db.document('/'.join(run_path.split('/')[:4]))
    run = restore_value(run_ref.get().to_dict())
    if run and run.get('settled') and run.get('status') in ('completed','accepted'):
        return
    require(run and run.get('providerKind') == 'google-batch' and not run.get('settled'),
            'This field run is unavailable or already settled.')
    plan = run['estimate']['fieldPlan']
    require(plan['fingerprint'] == fingerprint({k:v for k,v in plan.items() if k != 'fingerprint'}),
            'The approved field plan changed.')
    require(type(task_index) is int and 0 <= task_index < plan['partitionCount']
            and type(attempt) is int and 0 <= attempt < plan['maximumAttempts'], 'Task identity leaves the approved plan.')
    prefix = f'owners/{run["ownerUid"]}/projects/{project_ref.id}/seismic/runs/{run_ref.id}/'
    source = run['input']
    require(source['path'].startswith(f'owners/{run["ownerUid"]}/projects/{project_ref.id}/seismic/tool-inputs/'),
            'Field input leaves the admitted project.')
    blob = client.bucket(source['bucket']).blob(source['path'],generation=source['generation'])
    blob.reload()
    require(blob.size <= 8*1024**2, 'Field metadata exceeds its approved read budget.')
    raw = blob.download_as_bytes(if_generation_match=int(source['generation']))
    require(hashlib.sha256(raw).hexdigest() == source['sha256'], 'Field input checksum changed.')
    payload = json.loads(raw)
    require(payload['tool'] == 'index-manifest', 'This worker requires an analytical indexing operation.')
    binding = next(v for v in payload['bindings'].values() if v['kind'] == 'index-source')
    require(binding['sourceVersion'] == plan['sourceVersion'], 'The field source changed after approval.')
    require(run.get('fieldPhase') == 'data' and run.get('nativeIndexDocument'), 'Native indexing must commit before analytical partitions.')
    binding = binding | dict(identity=binding['identity'] | dict(indexManifest=run['nativeIndexDocument']))
    first = plan['firstTrace']+task_index*plan['tracesPerPartition']
    count = min(plan['tracesPerPartition'],plan['firstTrace']+plan['traceCount']-first)
    part_ref = run_ref.collection('fieldPartitions').document(f'{task_index:09d}')
    from seismic_source_io import indexed_source
    from seismic_indexed_reader import select_locators
    manifest,load = indexed_source(client,binding['identity'])
    headers = select_locators(manifest,load,manifest['metadata']['traceIndex']['sourceVersion'],range(first,first+count))
    allowance = sum(h['sampleCount'] for h in headers)*16+count*4096+512*1024
    cache_ref=project_ref.collection('seismicPartitionCache').document(run['estimate']['cacheKey']+f'-{task_index:09d}')
    prior=restore_value(cache_ref.get().to_dict())
    if prior:
        require(prior.get('sourceVersion')==plan['sourceVersion'] and prior['firstTrace']==first and prior['traceCount']==count,
                'A cached analytical partition has incompatible coordinates/source.')
    if not prior and run.get('restartRunId'):
        require(re.fullmatch(r'sx-[a-f0-9]{32}',run['restartRunId']), 'Invalid field restart identity.')
        prior = restore_value(project_ref.collection('seismicRuns').document(run['restartRunId'])
                              .collection('fieldPartitions').document(f'{task_index:09d}').get().to_dict())
        if not prior or prior.get('status') != 'completed':
            prior = None
    @firestore.transactional
    def claim(tx):
        current = restore_value(run_ref.get(transaction=tx).to_dict())
        part = restore_value(part_ref.get(transaction=tx).to_dict())
        require(current and not current.get('cancelRequested') and not current.get('settled'), 'Field run stopped before task claim.')
        if part and part.get('status') == 'completed':
            return False
        if part:
            require(part['firstTrace'] == first and part['traceCount'] == count and attempt >= part['attempt'],
                    'A task retry changed its immutable partition.')
        else:
            reserved = 0 if prior else allowance
            require(current.get('fieldReservedBytes',0)+reserved <= current['reservation']-current.get('nativeArtifactBytes',0)-2*1024**2,
                    'Partition reservations exceed the approved field artifact limit.')
            current['fieldReservedBytes'] = current.get('fieldReservedBytes',0)+reserved
        current['status'] = 'running'
        current.setdefault('startedAt',now())
        tx.set(run_ref,firestore_value(current))
        tx.set(part_ref,firestore_value(dict(firstTrace=first,traceCount=count,attempt=attempt,
            status='running',allowanceBytes=0 if prior else allowance,sourceVersion=plan['sourceVersion'])))
        return True
    claimed = claim(db.transaction())
    if not claimed:
        finalize_index(db,project_ref,run_ref,client)
        return
    last_check,cancel_state = [0],[False]
    def cancelled():
        if time.monotonic()-last_check[0] >= 1:
            value = restore_value(run_ref.get().to_dict())
            cancel_state[0] = not value or value.get('cancelRequested') or value.get('settled')
            last_check[0] = time.monotonic()
        return cancel_state[0]
    if prior:
        reader = ArtifactReader(client,source['bucket'],f'owners/{run["ownerUid"]}/projects/{project_ref.id}/seismic/runs/')
        checked = json.loads(reader.read(prior['partition']))
        require(checked['firstTrace'] == first and checked['traceCount'] == count,
                'A reused partition changed its trace identity.')
        partition,committed = prior['partition'],0
    else:
        from seismic_cloud_index_worker import build_cloud_index
        publisher = FieldPublisher(client.bucket(source['bucket']),prefix,allowance,cancelled=cancelled)
        result = build_cloud_index(client,binding,dict(firstTrace=first,traceCount=count,
            tracesPerPartition=plan['tracesPerPartition'],displayLevels=plan['displayLevels']),publisher.put,
            cancelled=cancelled)
        require(len(result['partitions']) == 1, 'A task must commit exactly its admitted partition.')
        partition = result['partitions'][0]
        committed = publisher.total_bytes
    @firestore.transactional
    def complete(tx):
        current = restore_value(run_ref.get(transaction=tx).to_dict())
        part = restore_value(part_ref.get(transaction=tx).to_dict())
        cached=restore_value(cache_ref.get(transaction=tx).to_dict())
        require(not current.get('cancelRequested') and not current.get('settled'), 'Field run stopped before partition commit.')
        if part.get('status') == 'completed':
            return
        require(part['attempt'] == attempt, 'A superseded task cannot commit over its replacement.')
        part.update(status='completed',partition=partition,artifactBytes=committed,headerBounds=geometry_bounds(headers))
        if cached:
            require(cached['partition']==partition, 'A canonical analytical partition changed during execution.')
        else:
            tx.set(cache_ref,firestore_value(part|dict(runId=run_ref.id)))
        current['completedPartitions'] = current.get('completedPartitions',0)+1
        current['committedBytes'] = current.get('committedBytes',0)+committed
        current['progress'] = dict(completed=current['completedPartitions'],total=plan['partitionCount'])
        current['checkpoint'] = dict(kind='field-partitions',runId=run_ref.id,planFingerprint=plan['fingerprint'])
        tx.set(part_ref,firestore_value(part));tx.set(run_ref,firestore_value(current))
    complete(db.transaction())
    finalize_index(db,project_ref,run_ref,client)


def main():
    db,client = firestore.Client(),storage.Client()
    run_path = os.environ['STRATAX_SEISMIC_RUN']
    require(re.fullmatch(r'stratax_projects/[\w-]{1,128}/records/[\w-]{1,100}/seismicRuns/sx-[a-f0-9]{32}',run_path),
            'Invalid field worker scope.')
    index = int(os.environ['BATCH_TASK_INDEX'])
    attempt = int(os.environ.get('BATCH_TASK_RETRY_ATTEMPT','0'))
    if os.environ['STRATAX_SEISMIC_FIELD_PHASE'] == 'headers':
        require(index == 0, 'Only the admitted sequential header task may construct native locators.')
        execute_headers(db,client,run_path,attempt)
    else:
        require(os.environ['STRATAX_SEISMIC_FIELD_PHASE'] == 'data', 'Unknown field execution phase.')
        run=restore_value(db.document(run_path).get().to_dict())
        plan=run['estimate']['fieldPlan']
        require(0<=index<plan['taskCount'], 'Batch task leaves the reviewed allocation.')
        first=index*plan['partitionsPerTask']
        for partition in range(first,min(first+plan['partitionsPerTask'],plan['partitionCount'])):
            execute_partition(db,client,run_path,partition,attempt)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        logging.exception('Admitted field partition stopped')
        from google.api_core.exceptions import ServiceUnavailable, TooManyRequests, GatewayTimeout, DeadlineExceeded
        if isinstance(error,(ServiceUnavailable,TooManyRequests,GatewayTimeout,DeadlineExceeded)):
            raise SystemExit(75) from error
        raise
