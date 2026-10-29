"""Owner-scoped admission and private artifacts for bounded seismic tool jobs."""
import hashlib
import json
import os
import re
import time
import uuid

from fastapi import Depends
from google.cloud import firestore, storage
from pydantic import BaseModel, ConfigDict, Field
from scientific_api import fingerprint, firestore_value, restore_value, now, MAX_PROJECT, Review
from seismic_profiles import validate_batch_profile, estimate_ceiling_usd
from seismic_runs_api import provider, public_run, settle

TOOLS = {"tie", "velocity", "attributes", "surfaces", "models", "4d", "qi", "imaging", "travel-times", "marine", "regularise", "statics", "geostatistics", "acoustic"}


class ToolEstimate(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    tool: str
    parameters: dict
    sources: list[str] = Field(min_length=1, max_length=32)
    outputLimitBytes: int = Field(default=64*1024**2, ge=1024, le=256*1024**2)


class ToolSubmission(BaseModel):
    model_config = ConfigDict(extra="forbid")
    estimateId: str = Field(pattern=r"^[a-f0-9]{32}$")
    fingerprint: str = Field(pattern=r"^[a-f0-9]{64}$")
    idempotencyKey: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    reviewed: bool
    restartRunId: str | None = Field(default=None,pattern=r'^sx-[a-f0-9]{32}$')


def install_tool_jobs(app, database, owner, project, source, fail):
    def load(ref, rid):
        if not re.fullmatch(r"sx-[a-f0-9]{32}", rid): fail(400,"run_identity","Invalid seismic run identity.")
        item=ref.collection("seismicRuns").document(rid)
        value=restore_value(item.get().to_dict())
        if not value or value.get("kind") != "seismic-tool": fail(404,"tool_run_missing","This tool run could not be found.")
        return item,value

    @app.post('/api/projects/{pid}/seismic/tool-estimates')
    def tool_estimate(pid:str, body:ToolEstimate, user=Depends(owner)):
        ref,_=project(user['uid'],pid)
        if body.tool not in TOOLS: fail(400,"tool_unavailable","Choose an available seismic engine.")
        try:
            profiles=json.loads(os.environ.get('STRATAX_SEISMIC_TOOL_PROFILES','{}'))
            kind='acoustic' if body.tool=='acoustic' else 'models' if body.tool in ('models','qi') else 'seismic'
            configured=profiles[kind]
            profile=validate_batch_profile(configured['resources'],require_account=False)
        except (ValueError,KeyError,TypeError):
            fail(503,"tool_profile_unavailable","This engine job profile has not been commissioned. No compute was started.")
        versions={}
        for did in sorted(set(body.sources)):
            if not re.fullmatch(r'[A-Za-z0-9_-]{1,100}',did):fail(400,'source_identity','Invalid source identity.')
            ds=ref.collection('datasets').document(did).get().to_dict()
            if not ds or not ds.get('active'):fail(404,'source_missing','Select an activated source from this project.')
            versions[did]=fingerprint(ds)
        raw=json.dumps(dict(tool=body.tool,parameters=body.parameters,sources=versions),sort_keys=True,allow_nan=False).encode()
        if len(raw)>8*1024**2: fail(413,"tool_input_budget","Use a smaller bounded input or an indexed field workflow.")
        eid=uuid.uuid4().hex
        quote=dict(id=eid,tool=body.tool,sources=versions,parameterSha256=hashlib.sha256(raw).hexdigest(),
            engineVersion='stratax-seismic/2.0',job=configured['job'],resources=profile,
            computeCeilingUsd=estimate_ceiling_usd(profile),inputBytes=len(raw),outputLimitBytes=body.outputLimitBytes,
            maximumRetries=0,taskCount=1,createdAt=now(),expiresAtEpoch=int(time.time())+3600,
            limitations=['Bounded CPU job; storage/network charges excluded. No automatic retry or parameter changes.'])
        quote['fingerprint']=hashlib.sha256(json.dumps(quote,sort_keys=True).encode()).hexdigest()
        # Private arrays remain in GCS, not Firestore. Reserve their bytes first.
        reservation=len(raw)
        @firestore.transactional
        def reserve(tx):
            record=ref.get(transaction=tx).to_dict();quota=record.setdefault('importQuota',{})
            used=sum(f.get('size',0) for f in record.get('workspace',{}).get('files',[]))
            if used+quota.get('derivedBytes',0)+quota.get('reservedBytes',0)+reservation>MAX_PROJECT:
                fail(413,'project_quota','Insufficient project storage for the immutable tool request.')
            quota['derivedBytes']=quota.get('derivedBytes',0)+reservation;tx.set(ref,record)
        reserve(database().transaction())
        path=f'owners/{user["uid"]}/projects/{pid}/seismic/tool-inputs/{eid}.json'
        bucket=os.environ['STRATAX_DERIVED_BUCKET'];blob=storage.Client().bucket(bucket).blob(path)
        blob.upload_from_string(raw,content_type='application/json',if_generation_match=0);blob.reload()
        saved=quote|dict(input=dict(bucket=bucket,path=path,generation=blob.generation,sha256=hashlib.sha256(raw).hexdigest()))
        ref.collection('seismicToolEstimates').document(eid).set(firestore_value(saved))
        return quote

    @app.post('/api/projects/{pid}/seismic/tool-runs',status_code=202)
    def submit_tool(pid:str,body:ToolSubmission,user=Depends(owner)):
        ref,_=project(user['uid'],pid)
        rid='sx-'+hashlib.sha256(f'{user["uid"]}:{pid}:tool:{body.idempotencyKey}'.encode()).hexdigest()[:32]
        item=ref.collection('seismicRuns').document(rid);runtime_ref=database().collection('stratax_seismic_runtime').document('capacity')
        @firestore.transactional
        def admit(tx):
            existing=restore_value(item.get(transaction=tx).to_dict())
            if existing:
                if existing['estimateFingerprint']!=body.fingerprint or existing.get('restartRunId')!=body.restartRunId: fail(409,'submission_conflict','This key belongs to a different estimate.')
                return existing,False
            quote=restore_value(ref.collection('seismicToolEstimates').document(body.estimateId).get(transaction=tx).to_dict())
            if not quote or not body.reviewed or quote['fingerprint']!=body.fingerprint or quote['expiresAtEpoch']<time.time():
                fail(409,'estimate_review','Review a current exact engine estimate before scheduling.')
            current_sources={did:ref.collection('datasets').document(did).get(transaction=tx).to_dict() for did in quote['sources']}
            previous=restore_value(ref.collection('seismicRuns').document(body.restartRunId).get(transaction=tx).to_dict()) if body.restartRunId else None
            record=ref.get(transaction=tx).to_dict();runtime=runtime_ref.get(transaction=tx).to_dict() or {}
            for did,ds in current_sources.items():
                if not ds or not ds.get('active') or fingerprint(ds)!=quote['sources'][did]: fail(409,'stale_source','A source changed after estimation.')
            if body.restartRunId:
                if not previous or previous.get('kind')!='seismic-tool' or previous.get('status') not in ('cancelled','failed') or not previous.get('checkpoint'):
                    fail(409,'checkpoint_unavailable','Select a stopped acoustic run with a saved checkpoint.')
                if any(previous['estimate'][k]!=quote[k] for k in ('tool','parameterSha256','sources','resources')):
                    fail(409,'checkpoint_incompatible','Restart requires identical inputs, source versions and worker resources.')
            if record.get('seismicActiveRun') or runtime.get('activeCount',0)>=int(os.environ.get('STRATAX_SEISMIC_MAX_CONCURRENT','2')):
                fail(409,'seismic_capacity','Compute capacity is occupied; no extra worker was started.')
            if runtime.get('owners',{}).get(user['uid'],0)>=1: fail(409,'owner_capacity','Wait for your current seismic run to finish.')
            quota=record.setdefault('importQuota',{});limit=quote['outputLimitBytes']*2
            used=sum(f.get('size',0) for f in record.get('workspace',{}).get('files',[]))
            if used+quota.get('derivedBytes',0)+quota.get('reservedBytes',0)+limit>MAX_PROJECT: fail(413,'project_quota','Insufficient storage for this output/checkpoint limit.')
            quota['reservedBytes']=quota.get('reservedBytes',0)+limit;record['seismicActiveRun']=rid
            runtime['activeCount']=runtime.get('activeCount',0)+1
            runtime.setdefault('owners',{})[user['uid']]=1
            value=dict(id=rid,kind='seismic-tool',revision=1,status='queued',dispatchState='scheduling',createdAt=now(),
                estimateId=body.estimateId,estimateFingerprint=body.fingerprint,idempotencyKey=body.idempotencyKey,
                estimate={k:v for k,v in quote.items() if k!='input'},input=quote['input']|dict(outputBucket=quote['input']['bucket']),reservation=limit,
                ownerUid=user['uid'],runtimeReserved=True,settled=False,cancelRequested=False,jobName=quote['job'],
                restartRunId=body.restartRunId,restartCheckpoint=previous.get('checkpoint') if previous else None,
                approval=dict(uid=user['uid'],reviewedAt=now(),fingerprint=body.fingerprint))
            tx.set(ref,record);tx.set(runtime_ref,runtime);tx.set(item,firestore_value(value));return value,True
        run,dispatch=admit(database().transaction())
        if dispatch:
            request_path=f'stratax_projects/{user["uid"]}/records/{pid}/seismicRuns/{rid}'
            try:
                configured=provider().get(f'https://run.googleapis.com/v2/{run["jobName"]}',timeout=20)
                deployed=configured.json().get('template',{}).get('template',{}).get('containers',[]) if configured.status_code==200 else []
                if not deployed or deployed[0].get('image')!=run['estimate']['resources']['image']:
                    settle(database(),ref,item,'failed',0,dict(error='Worker image changed after estimation; review a new profile.'))
                    fail(409,'worker_changed','The worker image changed; refresh the estimate before scheduling.')
                response=provider().post(f'https://run.googleapis.com/v2/{run["jobName"]}:run',json=dict(overrides=dict(
                    taskCount=1,timeout=f'{run["estimate"]["resources"]["maxSeconds"]}s',containerOverrides=[dict(
                    env=[dict(name='STRATAX_SEISMIC_RUN',value=request_path),dict(name='STRATAX_SEISMIC_TOOL_JOB',value='1')])])),timeout=30)
                if response.status_code not in (200,201):
                    run=settle(database(),ref,item,'failed',0,dict(error='Cloud scheduling rejected this run.'))
                else:
                    operation=response.json();item.update(dict(dispatchState='submitted',operation=operation.get('name')))
            except __import__('requests').RequestException:
                item.update(dict(dispatchState='uncertain'))
                fail(503,'scheduling_uncertain','Scheduling confirmation was interrupted. This run is held to avoid duplicate compute charges.')
        return public_run(restore_value(item.get().to_dict()))

    @app.get('/api/projects/{pid}/seismic/tool-runs/{rid}/artifact')
    def artifact(pid:str,rid:str,user=Depends(owner)):
        ref,_=project(user['uid'],pid);_,run=load(ref,rid)
        if run['status'] not in ('completed','accepted','rejected') or not run.get('outputManifest'):
            fail(409,'artifact_pending','Wait for a complete result artifact.')
        reference=run['outputManifest'];prefix=f'owners/{user["uid"]}/projects/{pid}/seismic/runs/{rid}/'
        if reference['path']!=prefix+'result.npz': fail(409,'artifact_scope','Result artifact scope is invalid.')
        # Reuse the existing private signer, never expose a public object.
        blob=storage.Client().bucket(run['input']['bucket']).blob(reference['path'])
        from datetime import timedelta
        import google.auth
        from google.auth.transport.requests import Request
        credentials,_=google.auth.default();credentials.refresh(Request())
        url=blob.generate_signed_url(version='v4',expiration=timedelta(minutes=5),method='GET',
            service_account_email=os.environ.get('STRATAX_SIGNING_IDENTITY','stratax-auth-runtime@project-9afac.iam.gserviceaccount.com'),access_token=credentials.token)
        return dict(url=url,sha256=reference['sha256'],bytes=reference['bytes'],expiresSeconds=300)

    @app.post('/api/projects/{pid}/seismic/tool-runs/{rid}/review')
    def review_tool(pid:str,rid:str,body:Review,user=Depends(owner)):
        ref,_=project(user['uid'],pid);item,run=load(ref,rid)
        if body.decision not in ('accept','reject') or not body.comment.strip() or body.replaceDatasetId:
            fail(400,'review_required','Review this result independently with a comment.')
        @firestore.transactional
        def write(tx):
            current=restore_value(item.get(transaction=tx).to_dict())
            sources={did:ref.collection('datasets').document(did).get(transaction=tx).to_dict() for did in current['estimate']['sources']}
            if current['status']!='completed' or current['revision']!=body.revision: fail(409,'review_conflict','Reload the current run before reviewing.')
            if body.decision=='accept' and any(not ds or fingerprint(ds)!=current['estimate']['sources'][did] for did,ds in sources.items()):
                fail(409,'stale_source','A source changed; retain this result for comparison.')
            current.update(status='accepted' if body.decision=='accept' else 'rejected',revision=current['revision']+1)
            if body.decision=='accept':
                tx.set(ref.collection('seismicResources').document('result-'+rid),firestore_value(dict(
                    id='result-'+rid,kind='engine-result',tool=current['estimate']['tool'],revision=1,
                    sources=current['estimate']['sources'],artifact=current['outputManifest'],runId=rid,
                    status='accepted',scientificApproval=False,createdAt=now())))
            tx.set(ref.collection('scienceReviews').document('seismic-'+rid),dict(runId=rid,decision=body.decision,comment=body.comment,reviewedAt=now(),scientificApproval=False))
            tx.set(item,firestore_value(current));return current
        return public_run(write(database().transaction()))

    @app.get('/api/projects/{pid}/seismic/tool-runs/{rid}/preview')
    def preview_tool(pid:str,rid:str,user=Depends(owner)):
        ref,_=project(user['uid'],pid);_,run=load(ref,rid)
        if run.get('status') not in ('completed','accepted','rejected') or not run.get('outputManifest'):
            fail(409,'result_pending','Wait for a complete result before comparison.')
        from seismic_engine_runner import unpack_result
        artifact=run['outputManifest'];expected=f'owners/{user["uid"]}/projects/{pid}/seismic/runs/{rid}/result.npz'
        if artifact['path']!=expected:fail(409,'artifact_scope','Result scope mismatch.')
        blob=storage.Client().bucket(run['input']['bucket']).blob(expected);blob.reload()
        if blob.size>64*1024**2:fail(413,'preview_budget','Download this larger artifact instead of opening an API preview.')
        raw=blob.download_as_bytes()
        if hashlib.sha256(raw).hexdigest()!=artifact['sha256']:fail(409,'result_checksum','Result checksum changed.')
        output=unpack_result(raw)
        budget=[12000]
        def bounded(value):
            import numpy as np
            if isinstance(value,np.ndarray):
                count=min(value.size,2048,budget[0]);budget[0]-=count
                return dict(shape=list(value.shape),values=value.ravel()[:count].tolist(),truncated=count<value.size)
            if isinstance(value,dict):return {key:bounded(item) for key,item in list(value.items())[:100] if key not in ('epc','hdf5','bytesBase64')}
            if isinstance(value,list):
                count=min(len(value),2048,budget[0]);budget[0]-=count
                return [bounded(v) if isinstance(v,(list,dict)) else v for v in value[:count]]
            return value
        return dict(result=bounded(output),previewOnly=True,scientificApproval=False)
