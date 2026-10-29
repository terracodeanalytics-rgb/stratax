"""Owner-scoped Batch admission and shared review records for analytical graph previews."""
import json
import os
import time
import uuid
import requests
import hashlib
import re

from fastapi import Depends
from google.cloud import firestore, storage

from scientific_api import fingerprint, firestore_value, restore_value, now, Review, MAX_PROJECT
from seismic_execution import EstimateRequest, RunRequest, batch_request, estimate, digest
from seismic_reader import read_preview, SectionError


def provider():
    import google.auth
    from google.auth.transport.requests import AuthorizedSession
    credentials, _ = google.auth.default(scopes=['https://www.googleapis.com/auth/cloud-platform'])
    return AuthorizedSession(credentials)


def settle(db, project_ref, run_ref, status, actual_bytes, updates=None):
    @firestore.transactional
    def write(tx):
        run = restore_value(run_ref.get(transaction=tx).to_dict())
        if not run or run.get('settled'):
            return run
        record = project_ref.get(transaction=tx).to_dict()
        runtime_ref = db.collection('stratax_seismic_runtime').document('capacity')
        runtime = runtime_ref.get(transaction=tx).to_dict() or {}
        quota = record.setdefault('importQuota', {})
        quota['reservedBytes'] = max(0, quota.get('reservedBytes', 0)-run['reservation'])
        quota['derivedBytes'] = quota.get('derivedBytes', 0)+actual_bytes
        run.update(updates or {})
        run.update(status='cancelled' if run.get('cancelRequested') else status, settled=True,
                   artifactBytes=actual_bytes, finishedAt=now(), revision=run['revision']+1)
        record['seismicActiveRun'] = None if record.get('seismicActiveRun') == run['id'] else record.get('seismicActiveRun')
        if run.get('runtimeReserved'):
            runtime['activeCount'] = max(0, runtime.get('activeCount', 0)-1)
            owners = runtime.setdefault('owners', {})
            uid = run['ownerUid']
            owners[uid] = max(0, owners.get(uid, 0)-1)
            if not owners[uid]:
                owners.pop(uid)
            run['runtimeReserved'] = False
            tx.set(runtime_ref, runtime)
        tx.set(project_ref, record)
        tx.set(run_ref, firestore_value(run))
        return run
    return write(db.transaction())


def public_run(value):
    return {k:v for k,v in value.items() if k not in ('input', 'outputManifest', 'reservation', 'batchRequest', 'checkpoint', 'restartCheckpoint', 'workerClaim', 'ownerUid', 'runtimeReserved')} | dict(hasCheckpoint=bool(value.get('checkpoint')), graphSnapshot=value.get('input',{}).get('graph'))


def install_seismic_runs(app, database, owner, project, source, retained_section, valid, fail):
    def profile():
        try:
            value = json.loads(os.environ.get('STRATAX_SEISMIC_BATCH_PROFILE', '{}'))
        except ValueError:
            fail(503, 'batch_profile', 'The seismic compute profile requires administrator review.')
        if not isinstance(value, dict) or not os.environ.get('STRATAX_SEISMIC_BATCH_ACCOUNT'):
            fail(503, 'batch_unavailable', 'The seismic Batch service identity has not been commissioned. No job was submitted.')
        return value

    def load_run(ref, rid):
        item = ref.collection('seismicRuns').document(valid(rid))
        value = restore_value(item.get().to_dict())
        if not value:
            fail(404, 'run_missing', 'This seismic run could not be found.')
        return item, value

    def result_manifest(uid, pid, rid, run):
        value = run.get('outputManifest')
        prefix = f'owners/{uid}/projects/{pid}/seismic/runs/{rid}/'
        if run['status'] not in ('completed', 'accepted', 'rejected') or not value or value['path'] != prefix+'manifest.json':
            fail(409, 'result_unavailable', 'Wait for the complete scientific result before opening or reviewing it.')
        bucket = storage.Client().bucket(run['input']['outputBucket'])
        blob = bucket.blob(value['path'])
        blob.reload()
        if blob.size > 2*1024**2:
            fail(413, 'manifest_budget', 'Calculated metadata exceeds its read budget.')
        raw = blob.download_as_bytes()
        if hashlib.sha256(raw).hexdigest() != value['sha256']:
            fail(409, 'result_checksum', 'The calculated manifest checksum changed; the result was not activated.')
        return json.loads(raw), bucket, prefix

    @app.post('/api/projects/{pid}/seismic/estimates')
    def create_estimate(pid: str, body: EstimateRequest, user=Depends(owner)):
        ref, record = project(user['uid'], pid)
        saved = restore_value(ref.collection('seismicGraphs').document(body.graphId).get().to_dict())
        if not saved or saved['revision'] != body.revision:
            fail(409, 'graph_revision', 'Save and reload the current graph before estimating its execution.')
        graph = saved['graph']
        if graph['domain'] != 'TWT':
            fail(400, 'source_axis_required', 'Register a reviewed depth-domain source before executing depth processing. SEG-Y time sampling was not converted to metres.')
        ds = source(ref, graph['sourceId'])
        if fingerprint(ds) != graph['sourceVersion']:
            fail(409, 'stale_source', 'This graph uses an older input version. Your draft is retained.')
        value = retained_section(user['uid'], pid, record, ds, first_trace=body.selection.firstTrace, trace_count=body.selection.traceCount, first_sample=0, sample_count=1)
        # Geometry-coupled previews need reviewed survey resources, not guessed gather identities.
        if any(n['operator'] in ('nmo', 'stack', 'fk-filter') for n in graph['nodes']):
            fail(400, 'geometry_review_required', 'Register reviewed gather/metric geometry before hosted NMO, stacking or FK execution. No geometry was inferred.')
        dimensions = {k:value[k] for k in ('traceCount', 'samplesPerTrace', 'sampleInterval')}
        dimensions['historyBytes'] = len(json.dumps(value.get('history', [])).encode())
        try:
            quotation = estimate(graph, body.selection, dimensions, profile())
        except ValueError as error:
            fail(400, 'estimate_input', str(error))
        eid = uuid.uuid4().hex
        result = quotation | dict(id=eid, graphId=body.graphId, graphRevision=body.revision,
                                 graphSnapshot=graph, createdAt=now(), expiresAtEpoch=int(time.time())+3600)
        result['fingerprint'] = digest(result)
        stored = result | dict(input=dict(datasetId=ds['id'], datasetVersion=fingerprint(ds), original=value['_identity'], graph=graph,
                                         outputBucket=os.environ['STRATAX_DERIVED_BUCKET']))
        ref.collection('seismicEstimates').document(eid).set(firestore_value(stored))
        return result

    @app.post('/api/projects/{pid}/seismic/runs', status_code=202)
    def submit(pid: str, body: RunRequest, user=Depends(owner)):
        ref, _ = project(user['uid'], pid)
        rid = 'sx-'+digest(dict(uid=user['uid'], project=pid, key=body.idempotencyKey))[:32]
        item = ref.collection('seismicRuns').document(rid)
        existing = restore_value(item.get().to_dict())
        if existing:
            if existing['estimateFingerprint'] != body.estimateFingerprint or existing['estimateId'] != body.estimateId or existing.get('restartRunId') != body.restartRunId:
                fail(409, 'idempotency_conflict', 'This submission key belongs to a different reviewed estimate.')
            if existing.get('settled') or existing.get('cancelRequested') or existing.get('dispatchState') != 'pending':
                return public_run(existing)
        quotation = restore_value(ref.collection('seismicEstimates').document(body.estimateId).get().to_dict())
        if not quotation or quotation['fingerprint'] != body.estimateFingerprint or not body.reviewed:
            fail(400, 'estimate_review', 'Review the exact current estimate before submitting a paid job.')
        if not existing and quotation['expiresAtEpoch'] < time.time():
            fail(409, 'estimate_expired', 'Refresh the resource estimate before approval.')
        project_id = os.environ.get('GOOGLE_CLOUD_PROJECT', 'project-9afac')
        region = os.environ.get('STRATAX_SEISMIC_BATCH_REGION', 'us-central1')
        account = os.environ.get('STRATAX_SEISMIC_BATCH_ACCOUNT', '')
        if not account:
            fail(503, 'batch_unavailable', 'The seismic Batch service identity is unavailable.')
        request_path = f'stratax_projects/{user["uid"]}/records/{pid}/seismicRuns/{rid}'

        @firestore.transactional
        def admit(tx):
            old = restore_value(item.get(transaction=tx).to_dict())
            if old:
                if old['estimateFingerprint'] != body.estimateFingerprint:
                    fail(409, 'idempotency_conflict', 'The submission key already identifies another estimate.')
                return old
            record = ref.get(transaction=tx).to_dict()
            graph = restore_value(ref.collection('seismicGraphs').document(quotation['graphId']).get(transaction=tx).to_dict())
            ds = ref.collection('datasets').document(quotation['input']['datasetId']).get(transaction=tx).to_dict()
            runtime_ref = database().collection('stratax_seismic_runtime').document('capacity')
            runtime = runtime_ref.get(transaction=tx).to_dict() or {}
            if not graph or graph['revision'] != quotation['graphRevision'] or not ds or not ds.get('active') or fingerprint(ds) != quotation['sourceVersion']:
                fail(409, 'stale_estimate', 'The graph or input changed after estimation. Review a new estimate.')
            if record.get('seismicActiveRun'):
                fail(409, 'seismic_capacity', 'Wait for this project’s current seismic run to settle before submitting another.')
            if runtime.get('activeCount', 0) >= int(os.environ.get('STRATAX_SEISMIC_MAX_CONCURRENT', '2')) or runtime.get('owners', {}).get(user['uid'], 0) >= 1:
                fail(409, 'seismic_capacity', 'The seismic compute slots are occupied. Your estimate remains available within its validity period.')
            quota = record.setdefault('importQuota', {})
            checkpoint = None
            if body.restartRunId:
                previous = restore_value(ref.collection('seismicRuns').document(body.restartRunId).get(transaction=tx).to_dict())
                if not previous or not previous.get('settled') or previous.get('status') not in ('failed', 'cancelled') or not previous.get('checkpoint'):
                    fail(409, 'checkpoint_unavailable', 'Choose a stopped run with a committed checkpoint.')
                if previous['estimate']['graphFingerprint'] != quotation['graphFingerprint'] or previous['selection'] != quotation['selection'] or previous['estimate']['resources']['image'] != quotation['resources']['image']:
                    fail(409, 'checkpoint_incompatible', 'Checkpoint restart requires the exact graph, source selection and worker image.')
                checkpoint = previous['checkpoint']
            reservation = quotation['outputReservationBytes']+quotation['checkpointReservationBytes']
            used = sum(f.get('size', 0) for f in record.get('workspace', {}).get('files', []))
            if used+quota.get('reservedBytes', 0)+quota.get('derivedBytes', 0)+reservation > MAX_PROJECT:
                fail(413, 'project_quota', 'This preview exceeds the remaining project storage quota. Existing limits were not raised.')
            quota['reservedBytes'] = quota.get('reservedBytes', 0)+reservation
            record['seismicActiveRun'] = rid
            runtime['activeCount'] = runtime.get('activeCount', 0)+1
            runtime.setdefault('owners', {})[user['uid']] = runtime.get('owners', {}).get(user['uid'], 0)+1
            value = dict(id=rid, revision=1, status='queued', dispatchState='pending', createdAt=now(),
                         estimateId=body.estimateId, estimateFingerprint=body.estimateFingerprint, reservation=reservation,
                         idempotencyKey=body.idempotencyKey,
                         approval=dict(uid=user['uid'], reviewedAt=now(), fingerprint=body.estimateFingerprint),
                         input=quotation['input'], estimate={k:v for k,v in quotation.items() if k!='input'},
                         selection=quotation['selection'], cancelRequested=False, settled=False,
                         restartRunId=body.restartRunId, restartCheckpoint=checkpoint,
                         runtimeReserved=True, ownerUid=user['uid'],
                         jobName=f'projects/{project_id}/locations/{region}/jobs/{rid}',
                         batchRequest=batch_request(project_id, region, account, request_path, rid, quotation))
            tx.set(ref, record)
            tx.set(runtime_ref, runtime)
            tx.set(item, firestore_value(value))
            return value
        run = admit(database().transaction())
        if run.get('settled') or run.get('cancelRequested') or run.get('dispatchState') != 'pending':
            return public_run(run)
        try:
            response = provider().post(f'https://batch.googleapis.com/v1/projects/{project_id}/locations/{region}/jobs', params=dict(jobId=rid), json=run['batchRequest'], timeout=30)
            if response.status_code not in (200, 201, 409):
                fail(503, 'batch_submission', 'Scheduling could not be confirmed. Retry this same submission key or cancel it; no duplicate job will be created.')
            item.update(dict(dispatchState='submitted'))
            run['dispatchState'] = 'submitted'
        except requests.RequestException:
            fail(503, 'batch_submission', 'Scheduling is not confirmed. Retry this same submission key; the deterministic job identity prevents duplicate execution.')
        return public_run(run)

    @app.get('/api/projects/{pid}/seismic/runs')
    def runs(pid: str, user=Depends(owner)):
        ref, _ = project(user['uid'], pid)
        return dict(runs=[public_run(restore_value(d.to_dict())) for d in ref.collection('seismicRuns').order_by('createdAt', direction=firestore.Query.DESCENDING).limit(50).stream()])

    @app.get('/api/projects/{pid}/seismic/runs/{rid}')
    def run_read(pid: str, rid: str, user=Depends(owner)):
        ref, _ = project(user['uid'], pid)
        item, run = load_run(ref, rid)
        if not run.get('settled'):
            try:
                response = provider().get('https://batch.googleapis.com/v1/'+run['jobName'], timeout=20)
                state = response.json().get('status', {}).get('state') if response.status_code == 200 else None
                if state in ('FAILED', 'CANCELLED', 'SUCCEEDED') or response.status_code == 404 and run.get('cancelRequested'):
                    prefix = f'owners/{user["uid"]}/projects/{pid}/seismic/runs/{rid}/'
                    actual = sum(blob.size or 0 for blob in storage.Client().list_blobs(run['input']['outputBucket'], prefix=prefix))
                    run = settle(database(), ref, item, 'failed', actual, dict(error='The provider stopped before a complete scientific result was committed.'))
            except requests.RequestException:
                fail(503, 'run_status_pending', 'The provider status is temporarily unavailable; your run and storage reservation are retained.')
        return public_run(run)

    @app.post('/api/projects/{pid}/seismic/runs/{rid}/cancel')
    def cancel(pid: str, rid: str, user=Depends(owner)):
        ref, _ = project(user['uid'], pid)
        item, run = load_run(ref, rid)
        if run.get('settled'):
            return public_run(run)
        @firestore.transactional
        def record_cancel(tx):
            current = restore_value(item.get(transaction=tx).to_dict())
            if not current.get('settled'):
                current.update(cancelRequested=True, status='cancelling', revision=current['revision']+1)
                tx.set(item, firestore_value(current))
            return current
        run = record_cancel(database().transaction())
        if run.get('settled'):
            return public_run(run)
        try:
            response = provider().delete('https://batch.googleapis.com/v1/'+run['jobName'], timeout=30)
        except requests.RequestException:
            fail(503, 'cancellation_pending', 'Cancellation is recorded; provider shutdown is not yet confirmed.')
        if response.status_code not in (200, 202, 404):
            fail(503, 'cancellation_pending', 'Cancellation is recorded; provider shutdown is not yet confirmed.')
        # A missing provider job cannot write new artifacts; a live job settles on confirmed shutdown.
        if response.status_code == 404:
            prefix = f'owners/{user["uid"]}/projects/{pid}/seismic/runs/{rid}/'
            actual = sum(blob.size or 0 for blob in storage.Client().list_blobs(run['input']['outputBucket'], prefix=prefix))
            return public_run(settle(database(), ref, item, 'cancelled', actual))
        return public_run(restore_value(item.get().to_dict()))

    @app.get('/api/projects/{pid}/seismic/runs/{rid}/result')
    def result(pid: str, rid: str, first_trace: int = 0, trace_count: int = 128,
               first_sample: int = 0, sample_count: int = 1000, user=Depends(owner)):
        ref, _ = project(user['uid'], pid)
        _, run = load_run(ref, rid)
        manifest, bucket, prefix = result_manifest(user['uid'], pid, rid, run)
        def load(path):
            if not re.fullmatch(re.escape(prefix)+r'preview/[0-9]+\.json\.gz', path):
                fail(400, 'invalid_artifact', 'The calculated chunk leaves its run scope.')
            blob = bucket.blob(path)
            blob.reload()
            if blob.size > 2*1024**2:
                fail(413, 'chunk_budget', 'The analytical chunk exceeds its read budget.')
            return blob.download_as_bytes()
        try:
            section = read_preview(manifest, load, first_trace=first_trace, trace_count=min(trace_count, manifest['traceCount']-first_trace),
                                   first_sample=first_sample, sample_count=min(sample_count, manifest['samplesPerTrace']-first_sample))
        except SectionError as error:
            fail(400, 'result_section', str(error))
        return section | dict(sourceVersion=run['estimateFingerprint'], provenance=dict(graphFingerprint=manifest['graphFingerprint'],
                                 sourceId=manifest['sourceId'], sourceVersion=manifest['sourceVersion'], history=manifest['history']), scientificApproval=False)

    @app.post('/api/projects/{pid}/seismic/runs/{rid}/review')
    def review(pid: str, rid: str, body: Review, user=Depends(owner)):
        ref, _ = project(user['uid'], pid)
        item, run = load_run(ref, rid)
        if body.decision not in ('accept', 'reject') or not body.comment.strip() or body.replaceDatasetId:
            fail(400, 'review_required', 'Record an acceptance/rejection comment. Seismic results activate independent versions.')
        manifest, _, _ = result_manifest(user['uid'], pid, rid, run)
        did = 'processed-'+rid

        @firestore.transactional
        def write(tx):
            current = restore_value(item.get(transaction=tx).to_dict())
            ds = ref.collection('datasets').document(run['input']['datasetId']).get(transaction=tx).to_dict()
            if current['revision'] != body.revision or current['status'] != 'completed':
                fail(409, 'review_conflict', 'The run changed. Reload its current result before reviewing.')
            if body.decision == 'accept' and (not ds or not ds.get('active') or fingerprint(ds) != run['input']['datasetVersion']):
                fail(409, 'stale_source', 'The source changed; keep this result for comparison and run against the current source before activation.')
            current.update(status='accepted' if body.decision == 'accept' else 'rejected', revision=current['revision']+1, reviewedAt=now())
            tx.set(ref.collection('scienceReviews').document('seismic-'+rid), dict(runId=rid, kind='seismic-processing', decision=body.decision,
                                                                              comment=body.comment, reviewedAt=now(), scientificApproval=False))
            if body.decision == 'accept':
                dataset = dict(id=did, family='seismic', name='Processed '+ds['name'], active=True, status='Accepted processing version',
                               seismicRunId=rid, manifest=run['outputManifest']['path'], sourceSha256=run['outputManifest']['sha256'],
                               parserVersion='stratax-seismic/1.0', references=ds.get('references', {}) | dict(domain=manifest['domain']),
                               metadata=dict(traceCount=manifest['traceCount'], sampleCount=manifest['samplesPerTrace'], sampleInterval=manifest['sampleInterval']),
                               lineage=dict(sourceId=ds['id'], sourceVersion=run['input']['datasetVersion'], graphFingerprint=manifest['graphFingerprint']),
                               scientificApproval=False, createdAt=now())
                tx.set(ref.collection('datasets').document(did), dataset)
                current['datasetId'] = did
            tx.set(item, firestore_value(current))
            return current
        return public_run(write(database().transaction()))
