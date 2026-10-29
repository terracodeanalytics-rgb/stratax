"""Private asynchronous analytical tool execution through existing seismic run records."""
import hashlib
import json
import logging
import os
import re
import tempfile
from pathlib import Path

import numpy as np
from fastapi import FastAPI, HTTPException
from google.cloud import firestore, storage
from scientific_api import restore_value, firestore_value, now
from seismic_engine_runner import pack_result, _atomic_npz
from seismic_processing import require
from seismic_runs_api import settle


def main():
    path=os.environ.get('STRATAX_SEISMIC_RUN','')
    require(re.fullmatch(r'stratax_projects/([A-Za-z0-9_-]{1,128})/records/([A-Za-z0-9_-]{1,100})/seismicRuns/(sx-[a-f0-9]{32})',path),'Invalid tool run scope.')
    _,uid,_,pid,_,rid=path.split('/');db=firestore.Client();ref=db.document('/'.join(path.split('/')[:4]));item=db.document(path)
    @firestore.transactional
    def claim(tx):
        run=restore_value(item.get(transaction=tx).to_dict())
        require(run and run.get('kind')=='seismic-tool','Tool run missing.')
        if run.get('workerClaim') or run.get('settled'): return None
        run.update(workerClaim=rid,status='running',startedAt=now());tx.set(item,firestore_value(run));return run
    run=claim(db.transaction())
    if run is None:return
    client=storage.Client();bucket=client.bucket(run['input']['bucket']);actual=0
    prefix=f'owners/{uid}/projects/{pid}/seismic/runs/{rid}/'
    def cancelled():
        current=restore_value(item.get().to_dict())
        return not current or current.get('cancelRequested') or current.get('settled')
    def put(name,raw):
        nonlocal actual
        require(not cancelled(),'Engine calculation cancelled.')
        require(actual+len(raw)<=run['reservation'],'Approved artifact storage limit exceeded.')
        target=bucket.blob(prefix+name);target.upload_from_string(raw,if_generation_match=0);actual+=len(raw)
        return dict(path=prefix+name,sha256=hashlib.sha256(raw).hexdigest(),bytes=len(raw))
    try:
        source=run['input'];require(source['path'].startswith(f'owners/{uid}/projects/{pid}/seismic/tool-inputs/'),'Input scope mismatch.')
        blob=bucket.blob(source['path'],generation=source['generation']);blob.reload()
        require(blob.size<=8*1024**2,'Tool input exceeds read budget.')
        raw=blob.download_as_bytes();require(hashlib.sha256(raw).hexdigest()==source['sha256'],'Input checksum changed.')
        payload=json.loads(raw);parameters=payload['parameters'];tool=payload['tool']
        require(not cancelled(),'Engine run cancelled before computation.')
        if tool=='acoustic':
            from seismic_acoustic_engine import execute_acoustic
            resumed=None
            if run.get('restartCheckpoint'):
                from seismic_engine_runner import unpack_result
                previous=run['restartCheckpoint']
                require(re.fullmatch(re.escape(f'owners/{uid}/projects/{pid}/seismic/runs/')+r'sx-[a-f0-9]{32}/checkpoints/[0-9]+\.npz',previous['path']), 'Checkpoint scope mismatch.')
                blob=bucket.blob(previous['path']);blob.reload();require(blob.size<=run['reservation'],'Checkpoint exceeds approved limit.')
                saved=blob.download_as_bytes();require(hashlib.sha256(saved).hexdigest()==previous['sha256'],'Checkpoint checksum changed.')
                resumed=unpack_result(saved)
            def checkpoint(value):
                with tempfile.TemporaryDirectory() as directory:
                    file=Path(directory)/'checkpoint.npz';_atomic_npz(file,pack_result(value))
                    reference=put(f'checkpoints/{value.get("completedShots",len(value.get("history",[])))}.npz',file.read_bytes())
                    item.update(dict(checkpoint=reference))
            result=execute_acoustic(parameters['configuration'],parameters.get('observed'),cancelled=cancelled,checkpoint=checkpoint,resumed=resumed)
        else:
            from seismic_tools_api import install_seismic_tools
            app=FastAPI()
            def owner():return dict(uid=uid)
            def project(user,project_id):require(user==uid and project_id==pid,'Tool project scope mismatch.')
            def fail(status,code,message):raise HTTPException(status,dict(code=code,message=message))
            install_seismic_tools(app,owner,project,fail)
            route=next((r for r in app.routes if r.path==f'/api/projects/{{pid}}/seismic/tools/{tool}' and 'POST' in r.methods),None)
            require(route is not None,'Engine handler is unavailable in this pinned worker.')
            result=route.endpoint(pid=pid,body=parameters,user=dict(uid=uid))
        require(not cancelled(),'Engine run cancelled before artifact commit.')
        with tempfile.TemporaryDirectory() as directory:
            output=Path(directory)/'result.npz';_atomic_npz(output,pack_result(dict(result=result,
                sources=payload['sources'],engineVersion='stratax-seismic/2.0',estimateFingerprint=run['estimateFingerprint'])))
            reference=put('result.npz',output.read_bytes())
        settle(db,ref,item,'completed',actual,dict(outputManifest=reference))
    except Exception:
        logging.exception('Engine job %s stopped',rid)
        settle(db,ref,item,'failed',actual,dict(error='The engine stopped; review input, resource and worker diagnostics. No parameters were changed.'))
        raise
