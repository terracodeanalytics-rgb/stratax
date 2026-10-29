"""Loopback-only generated fixture: real routes/worker, in-memory cloud/provider adapters."""
import json
import os
import socket
import sys
import threading
import tempfile
from pathlib import Path
from unittest.mock import Mock

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT/'backend'), str(ROOT/'backend/tests')]

import main
import seismic_api
import seismic_runs_api
import seismic_batch_worker
from policies import POLICY_VERSIONS
from test_seismic_runs_api import Db, Store
from test_seismic_store import segy_bytes
from test_seismic_execution import profile

uid, pid = 'ui-test-user', 'seismic-cloud-test'
path = f'stratax_projects/{uid}/records/{pid}'
db, store = Db(), Store()
db.records = {f'stratax_legal_acceptance/{uid}':dict(versions=POLICY_VERSIONS)}
raw = segy_bytes(traces=32, samples=128)
from ingestion_core import parse
with tempfile.TemporaryDirectory(prefix='stratax-cloud-source-fixture-') as scratch:
    source=Path(scratch)/'generated-section.segy';source.write_bytes(raw)
    parsed=parse(source,Path(scratch)/'out','seismic',{})[0]
    import_artifacts={p.name:p.read_bytes() for p in (Path(scratch)/'out').iterdir() if p.is_file()}
original = dict(id='fixture-original', name='generated-section.segy', size=len(raw))
ds = dict(id='survey', name='Generated analytic survey', family='seismic', active=True, sourceId=original['id'],
          sourceSha256=parsed['metadata']['traceIndex']['sourceVersion'], parserVersion=parsed['parserVersion'], metadata=dict(traceCount=32, sampleCount=128),
          manifest=f'owners/{uid}/projects/{pid}/imports/fixture/{parsed["id"]}.json', references={})
db.records[path] = dict(project=dict(id=pid, name='Seismic acceptance', workflows=['petrophysics','seismic'], storage='cloud', status='Active'),
                        revision=1, workspace=dict(files=[original]))
db.records[path+'/datasets/survey'] = ds
store.files['fixture-raw', f'owners/{uid}/projects/{pid}/originals/{original["id"]}'] = raw
for name,payload in import_artifacts.items():store.files['fixture-derived',ds['manifest'].rsplit('/',1)[0]+'/'+name]=payload
from test_seismic_brick import cube_source
cube=cube_source(missing=True)
with tempfile.TemporaryDirectory(prefix='stratax-cube-fixture-') as scratch:
    source=Path(scratch)/'generated-cube.segy';source.write_bytes(cube)
    parsed_cube=parse(source,Path(scratch)/'out','seismic',{})[0]
    cube_artifacts={p.name:p.read_bytes() for p in (Path(scratch)/'out').iterdir() if p.is_file()}
cube_original=dict(id='fixture-cube',name='generated-cube.segy',size=len(cube))
cube_dataset=dict(id='cube',name='Generated 3D poststack fixture',family='seismic',active=True,sourceId=cube_original['id'],sourceSha256=parsed_cube['metadata']['traceIndex']['sourceVersion'],parserVersion=parsed_cube['parserVersion'],metadata=parsed_cube['metadata'],manifest=f'owners/{uid}/projects/{pid}/imports/cube/{parsed_cube["id"]}.json',references={})
db.records[path]['workspace']['files'].append(cube_original);db.records[path+'/datasets/cube']=cube_dataset
store.files['fixture-raw',f'owners/{uid}/projects/{pid}/originals/{cube_original["id"]}']=cube
for name,payload in cube_artifacts.items():store.files['fixture-derived',cube_dataset['manifest'].rsplit('/',1)[0]+'/'+name]=payload
os.environ.update(STRATAX_PROJECT_BUCKET='fixture-raw', STRATAX_DERIVED_BUCKET='fixture-derived',
                  STRATAX_SEISMIC_BATCH_ACCOUNT='fixture@project.iam.gserviceaccount.com',
                  STRATAX_SEISMIC_BATCH_PROFILE=json.dumps(profile()))
main._db = db
main.app.dependency_overrides[main.current_user] = lambda:dict(uid=uid)
seismic_api.firestore.transactional = lambda f:f
seismic_api.storage.Client = lambda:store
seismic_batch_worker.firestore.Client = lambda:db


class Provider:
    def post(self, url, json, **kwargs):
        environment = json['overrides']['containerOverrides'][0]['env']
        run_path = next(item['value'] for item in environment if item['name'] == 'STRATAX_SEISMIC_RUN')
        def run():
            os.environ['STRATAX_SEISMIC_RUN'] = run_path
            seismic_batch_worker.main()
        threading.Thread(target=run, daemon=False).start()
        response = Mock(status_code=200)
        response.json.return_value = dict(name='projects/project-9afac/locations/us-central1/operations/fixture')
        return response

    def get(self, *args, **kwargs):
        value = Mock(status_code=200)
        value.json.return_value = dict(status=dict(state='RUNNING'))
        return value

    def delete(self, *args, **kwargs):
        return Mock(status_code=404)


seismic_runs_api.provider = Provider
if __name__ == '__main__':
    import uvicorn
    listener = socket.socket()
    listener.bind(('127.0.0.1', 0))
    port = listener.getsockname()[1]
    print(json.dumps(dict(port=port)), flush=True)
    uvicorn.Server(uvicorn.Config(main.app, log_level='error')).run(sockets=[listener])
