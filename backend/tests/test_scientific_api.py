import copy
import json
import os
import sys
from pathlib import Path
from unittest.mock import Mock,patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
import main
import scientific_api as science
from policies import POLICY_VERSIONS

ROOT='stratax_projects/owner/records/project'


class Reference:
    def __init__(self,db,path):self.db,self.path=db,path;self.id=path.split('/')[-1]
    def collection(self,name):return Reference(self.db,self.path+'/'+name)
    def document(self,name):return Reference(self.db,self.path+'/'+name)
    def get(self,transaction=None):return self
    def to_dict(self):return copy.deepcopy(self.db.records.get(self.path))
    def update(self,data):self.db.records[self.path].update(copy.deepcopy(data))
    def limit(self,*a,**kw):return self
    def order_by(self,*a,**kw):return self
    def stream(self):return [Reference(self.db,p) for p in self.db.records if p.startswith(self.path+'/') and '/' not in p[len(self.path)+1:]]


class Database:
    def __init__(self):
        self.records={'stratax_legal_acceptance/owner':dict(versions=POLICY_VERSIONS),'stratax_legal_acceptance/other':dict(versions=POLICY_VERSIONS),ROOT:dict(project=dict(id='project',workflows=['petrophysics','seismic'],storage='cloud',status='Active'),revision=1,workspace=dict(files=[])),ROOT+'/datasets/source':dict(id='source',active=True,manifest='owners/owner/projects/project/imports/i/dataset-x.json',rowCount=3,columns=[dict(id='column-0',unit='gAPI')],sourceSha256='abc',parserVersion='fixture')}
    def collection(self,name):return Reference(self,name)
    def transaction(self):return self
    def set(self,ref,value):self.records[ref.path]=copy.deepcopy(value)
    def update(self,ref,value):self.records[ref.path].update(copy.deepcopy(value))


def config(**changes):return dict(revision=0,method='shale-linear',bindings=dict(gr=dict(datasetId='source',columnId='column-0',unit='gAPI',confirmed=True)),parameters=dict(clean=0,shale=100))|changes


def test_configuration_revision_authorization_units_and_alignment():
    db=Database();main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner');client=TestClient(main.app)
    try:
        with patch.object(main,'_db',db),patch.object(science.firestore,'transactional',lambda f:f):
            assert client.get('/api/projects/project/science/capabilities').json()['version']==science.VERSION
            assert client.post('/api/projects/project/science/validate',json=config()).json()['valid'] is True
            bad=config();bad['bindings']['gr']['confirmed']=False
            assert client.post('/api/projects/project/science/validate',json=bad).status_code==400
            assert client.put('/api/projects/project/science/configurations/config',json=config()).json()['revision']==1
            assert client.put('/api/projects/project/science/configurations/config',json=config()).status_code==409
            main.app.dependency_overrides[main.current_user]=lambda:dict(uid='other')
            assert client.get('/api/projects/project/science').status_code==404
            main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner');db.records['stratax_legal_acceptance/owner']={}
            assert client.get('/api/projects/project/science/capabilities').status_code==403
    finally:main.app.dependency_overrides.clear()


def test_idempotency_capacity_cancellation_and_quota_settlement():
    db=Database();main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner');client=TestClient(main.app)
    try:
        with patch.object(main,'_db',db),patch.object(science.firestore,'transactional',lambda f:f),patch('google.auth.default',return_value=(Mock(),None)),patch('google.auth.transport.requests.AuthorizedSession') as session:
            session.return_value.post.return_value.json.return_value={'name':'projects/project-9afac/locations/us-central1/operations/test'}
            client.put('/api/projects/project/science/configurations/config',json=config())
            payload=dict(configurationId='config',revision=1,idempotencyKey='submission-001')
            response=client.post('/api/projects/project/science/runs',json=payload);assert response.status_code==202,response.text
            rid=response.json()['id'];path=ROOT+'/scienceRuns/'+rid;record=db.records[path]
            assert 'dispatch' not in response.json() and 'inputSnapshots' not in response.json()
            assert db.records[ROOT]['importQuota']['reservedBytes']==science.ARTIFACT_BUDGET
            assert client.post('/api/projects/project/science/runs',json=payload).json()['id']==rid
            assert session.return_value.post.call_count==1
            assert client.post('/api/projects/project/science/runs',json=payload|dict(idempotencyKey='submission-002')).status_code==409
            assert client.post(f'/api/projects/project/science/runs/{rid}/cancel',json={}).json()['status']=='cancelling'
            # Reservation remains until the worker has stopped writing.
            assert db.records[ROOT]['importQuota']['reservedBytes']==science.ARTIFACT_BUDGET
            science.settle_run(db,Reference(db,ROOT),Reference(db,path),Reference(db,'stratax_science_runtime/capacity'),record['dispatch'],'completed',123)
            assert db.records[path]['status']=='cancelled'
            assert db.records[ROOT]['importQuota']==dict(reservedBytes=0,derivedBytes=123)
            science.settle_run(db,Reference(db,ROOT),Reference(db,path),Reference(db,'stratax_science_runtime/capacity'),record['dispatch'],'completed',123)
            assert db.records[ROOT]['importQuota']['derivedBytes']==123
    finally:main.app.dependency_overrides.clear()


def test_review_stale_inputs_and_independent_result_activation():
    db=Database();source=db.records[ROOT+'/datasets/source'];rid='run-example';path=ROOT+'/scienceRuns/'+rid
    db.records[path]=dict(id=rid,dispatch='dispatch',revision=2,status='completed',inputFingerprints={'source':science.fingerprint(source)})
    manifest=dict(datasets=[dict(id='derived',manifest='owners/owner/projects/project/science/run-example/dispatch/dataset-result.json',columns=[dict(id='column-0',unit='v/v')],rowCount=3)],summary={})
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner');client=TestClient(main.app)
    try:
        with patch.object(main,'_db',db),patch.object(science.firestore,'transactional',lambda f:f),patch.object(science.storage,'Client') as store,patch.dict(os.environ,{'STRATAX_DERIVED_BUCKET':'test'}):
            blob=store.return_value.bucket.return_value.blob.return_value;blob.size=100;blob.download_as_bytes.return_value=json.dumps(manifest).encode()
            assert client.post(f'/api/projects/project/science/runs/{rid}/review',json=dict(revision=1,decision='accept')).status_code==409
            db.records[ROOT+'/datasets/source']['active']=False
            assert client.post(f'/api/projects/project/science/runs/{rid}/review',json=dict(revision=2,decision='accept')).status_code==409
            db.records[ROOT+'/datasets/source']['active']=True
            response=client.post(f'/api/projects/project/science/runs/{rid}/review',json=dict(revision=2,decision='accept',comment='Reviewed fixture'))
            assert response.status_code==200,response.text
            assert db.records[ROOT+'/datasets/source']['active'] is True
            assert db.records[ROOT+'/datasets/derived']['scientificRunId']==rid
            assert db.records[ROOT+'/datasets/derived']['scientificApproval'] is False
            assert len([k for k in db.records if '/scienceReviews/' in k])==1
            assert client.get(f'/api/projects/project/science/runs/{rid}/artifacts/unsafe.txt').status_code==400
    finally:main.app.dependency_overrides.clear()
