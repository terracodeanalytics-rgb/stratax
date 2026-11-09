"""Loopback only: real science routes/workers, generated data and fake Cloud services."""
import json
import os
import socket
import sys
import threading
from pathlib import Path
from unittest.mock import Mock, patch

ROOT=Path(__file__).resolve().parents[1]
sys.path[:0]=[str(ROOT/'backend'),str(ROOT/'backend/tests')]
import main
import scientific_api as science
import scientific_worker as worker
from test_scientific_api import Database,ROOT as RECORD
from test_science import fixture
from scientific_catalog import METHODS
from ingestion_core import column,output_dataset

ARTIFACTS=ROOT/(os.environ.get('FIXTURE_EVIDENCE','.release/preparation-calibration-20261107'))/'integration-artifacts'
ARTIFACTS.mkdir(parents=True,exist_ok=True)
db=Database();main._db=db
main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
science.firestore.transactional=lambda fn:fn
worker.firestore.Client=lambda **kwargs:db
os.environ.update(STRATAX_DERIVED_BUCKET='fixture-derived',DERIVED_MOUNT=str(ARTIFACTS),STRATAX_SCIENCE_JOB='local-fixture')

class Blob:
    def __init__(self,name):self.path=ARTIFACTS/name
    @property
    def size(self):return self.path.stat().st_size
    def reload(self):pass
    def download_as_bytes(self):return self.path.read_bytes()
    def open(self,mode='rb'):return self.path.open(mode)

class Store:
    def bucket(self,name):
        assert name=='fixture-derived'
        return self
    def blob(self,name):return Blob(name)

science.storage.Client=lambda:Store()
executions=[]
pending={};active={}
import_executions=[]
import_runner=None
if os.environ.get('CLOUD_COPY_FIXTURE'):
    from interpretation_import_fixture import install
    import_runner=install(main.app,db,ARTIFACTS)

class Provider:
    def post(self,url,json,**kwargs):
        environment={item['name']:item['value'] for item in json['overrides']['containerOverrides'][0]['env']}
        if 'IMPORT_ID' in environment:
            assert import_runner and url.endswith('/jobs/local-import-fixture:run');import_runner(environment);import_executions.append(environment['IMPORT_ID'])
            response=Mock(ok=True);response.json.return_value=dict(name='local-native-import');return response
        assert url.endswith('/jobs/local-fixture:run')
        if os.environ.get('MANUAL_FIXTURE_DISPATCH'):pending[environment['SCIENCE_RUN']]=environment
        else:
            with patch.dict(os.environ,environment):worker.run()
        executions.append(environment['SCIENCE_RUN'])
        response=Mock();response.json.return_value=dict(name='projects/project-9afac/locations/us-central1/operations/local-fixture')
        return response
    def get(self,*args,**kwargs):
        response=Mock(ok=True);response.json.return_value=dict(done=False)
        return response

patch('google.auth.default',return_value=(Mock(),None)).start()
patch('google.auth.transport.requests.AuthorizedSession',return_value=Provider()).start()

METHOD_IDS=['qc-integrity','qc-despike','qc-smooth','qc-interpolate','qc-normalize','qc-shift','qc-splice','qc-borehole',
            'depth-match','align-curve','endpoint-proposal','temperature-profile','resistivity-temperature','pickett-fit',
            'permeability-regression','permeability-timur','permeability-coates']
if os.environ.get('EVALUATION_FIXTURE'):
    METHOD_IDS=list(dict.fromkeys(METHOD_IDS+[mid for mid in METHODS if mid.startswith(('shale-','porosity-','saturation-'))]+['cutoff-rules','reservoir-summary','geomechanics-1d','log-upscale','predict-ridge','predict-forest','correction-table']))
project=db.records[RECORD]['project']
if os.environ.get('INTERPRETATION_FIXTURE'):METHOD_IDS=[mid for mid in METHODS if mid!='log-view']
if os.environ.get('MAP_ONLY_FIXTURE'):METHOD_IDS=[]
project.update(name='Local preparation and calibration acceptance',createdAt='2026-11-07T00:00:00Z',updatedAt='2026-11-07T00:00:00Z')
scenarios=[];datasets=[]
for mid in METHOD_IDS:
    inputs,parameters,units=fixture(mid)
    if mid=='qc-smooth' and os.environ.get('LONG_EVIDENCE_ROWS'):
        size=int(os.environ['LONG_EVIDENCE_ROWS']);inputs=dict(depth=list(range(size)),curve=list(range(1,size+1)))
        if size>2501:inputs['curve'][2500]=None
    count=len(next(iter(inputs.values()))) if inputs else 1
    reference=parameters.get('depthReference') or 'MD'
    if mid.startswith('qc-') or mid in ('depth-match','align-curve','endpoint-proposal'):
        if mid!='qc-borehole':units['curve']='gAPI'
        if mid=='qc-splice':units['alternate']='gAPI'
    values=dict(depth=inputs['depth']) if 'depth' in inputs else dict(depth=list(range(count)))
    values.update(inputs)
    column_units=dict(depth='m')|units
    columns=[column(role,column_units[role],i) for i,role in enumerate(values)]
    for col,role in zip(columns,values):
        if role in ('porosity','total','estimates'):col['porosityBasis']='total'
    rows=[[value[i].tolist() if hasattr(value[i],'tolist') else value[i] for value in values.values()] for i in range(count)]
    folder=ARTIFACTS/'owners/owner/projects/project/imports'/mid
    ds=output_dataset(folder,mid+' controlled source',columns,rows)
    ds.update(active=True,manifest='owners/owner/projects/project/imports/'+mid+'/'+ds['id']+'.json',well='A',family='logs',indexColumnId=columns[0]['id'],references=dict(depthReference=reference),sourceSha256='generated-'+mid,parserVersion='fixture')
    db.records[RECORD+'/datasets/'+ds['id']]=ds;datasets.append(ds)
    if mid=='seismic-attributes':
        import segyio
        import numpy as np
        raw_root=ARTIFACTS/'raw';os.environ['RAW_MOUNT']=str(raw_root)
        raw=raw_root/'owners/owner/projects/project/originals/fixture-seismic';raw.parent.mkdir(parents=True,exist_ok=True)
        spec=segyio.spec();spec.sorting=2;spec.format=5;spec.samples=list(range(128));spec.ilines=[1];spec.xlines=list(range(count))
        with segyio.create(str(raw),spec) as handle:
            for i in range(count):handle.header[i]={189:1,193:i,21:i};handle.trace[i]=np.asarray(inputs['traces'][i],np.float32)
        db.records[RECORD]['workspace']['files'].append(dict(id='fixture-seismic',name='controlled.sgy'))
        ds.update(family='seismic',sourceId='fixture-seismic',importId='fixture-seismic-import')
        db.records[RECORD+'/imports/fixture-seismic-import']=dict(options={})
        parameters.update(firstTrace=0,traceCount=count,firstSample=0,sampleCount=128)
    bindings={role:dict(datasetId=ds['id'],columnId=columns[list(values).index(role)]['id'],unit=units[role],confirmed=False) for role in inputs}
    if mid=='depth-match':parameters['sourceRun']=ds['id']
    window=dict(id='view-'+mid,tool=METHODS[mid]['tool'],method=mid,datasetId=ds['id'],bindings=bindings,parameters=parameters)
    tab='QC' if mid.startswith('qc-') or mid in ('depth-match','align-curve','correction-table') else 'Drilling' if mid=='geomechanics-1d' else 'Modeling' if mid=='log-upscale' else 'Workflows' if mid.startswith('predict-') else 'Petrophysics'
    action='integrity' if mid=='qc-integrity' else 'cutoffs' if mid=='cutoff-rules' else 'summary' if mid=='reservoir-summary' else 'method:'+mid
    scenarios.append(dict(method=mid,window=window,source=ds,tab=tab,action=action))
datasets=[ds for ds in datasets if ds['id']!='source']
db.records.pop(RECORD+'/datasets/source',None)
workflow=None
if os.environ.get('MANUAL_FIXTURE_DISPATCH'):
    from interpretation_workflow_fixture import study
    workflow=study(db,RECORD,ARTIFACTS)
    db.delete=lambda ref:db.records.pop(ref.path,None)

@main.app.get('/__fixture')
def info():return dict(project=project,datasets=[science.restore_value(value) for key,value in db.records.items() if key.startswith(RECORD+'/datasets/') and value.get('active')],scenarios=scenarios,workflow=workflow,pending=list(pending),executions=len(executions))

@main.app.post('/__fixture/control')
def control(body:dict):
    action=body['action'];rid=body.get('runId')
    if action in ('begin','release'):assert os.environ.get('MANUAL_FIXTURE_DISPATCH')
    if action=='begin':
        assert rid in pending and not any(item['thread'].is_alive() for item in active.values())
        gate=threading.Event();entered=threading.Event();fault=body.get('fail',False)
        original=worker.read_inputs
        def read(*args,**kwargs):
            entered.set();assert gate.wait(180),'Fixture gate timed out'
            if fault:raise worker.ScienceProblem('fixture_read_failure','Controlled local fixture read failure; retry this checkpoint.')
            return original(*args,**kwargs)
        def execute():
            with patch.dict(os.environ,pending[rid]),patch.object(worker,'read_inputs',read):worker.run()
        thread=threading.Thread(target=execute,daemon=True);active[rid]=dict(thread=thread,gate=gate);thread.start();entered.wait(5)
    elif action=='release':
        item=active[rid];item['gate'].set();item['thread'].join(20);assert not item['thread'].is_alive()
    elif action=='stale':
        ds=db.records[RECORD+'/datasets/'+body['datasetId']];ds['sourceSha256']='controlled-revised-source-version'
    elif action=='conflict':
        definition=db.records[RECORD+'/scienceWorkflows/'+body['workflowId']];definition['revision']+=1
    return dict(ok=True,status=science.restore_value(db.records.get(RECORD+'/scienceRuns/'+str(rid),{})).get('status'))

if __name__=='__main__':
    import uvicorn
    listener=socket.socket();listener.bind(('127.0.0.1',0))
    main.app.state.fixture_origin='http://127.0.0.1:'+str(listener.getsockname()[1])
    print(json.dumps(dict(port=listener.getsockname()[1])),flush=True)
    uvicorn.Server(uvicorn.Config(main.app,log_level='error',access_log=False)).run(sockets=[listener])
