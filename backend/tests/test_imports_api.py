import copy
import sys
import os
from pathlib import Path
from unittest.mock import Mock,patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
import main
import imports_api
from policies import POLICY_VERSIONS


class Reference:
    def __init__(self,db,path):self.db,self.path=db,path
    def collection(self,name):return Reference(self.db,self.path+'/'+name)
    def document(self,name):return Reference(self.db,self.path+'/'+name)
    def get(self,transaction=None):return self
    def to_dict(self):return copy.deepcopy(self.db.records.get(self.path))
    def update(self,fields):self.db.records[self.path].update(copy.deepcopy(fields))


class Database:
    def __init__(self):
        self.records={'stratax_legal_acceptance/owner':{'versions':POLICY_VERSIONS},'stratax_legal_acceptance/other':{'versions':POLICY_VERSIONS},'stratax_projects/owner/records/project':{'project':{'id':'project','name':'Study','workflows':['petrophysics','seismic'],'storage':'cloud'},'revision':4,'workspace':{'files':[{'id':'old','name':'existing.las','size':3}],'audit':[]}}}
    def collection(self,name):return Reference(self,name)
    def transaction(self):return self
    def set(self,ref,data):self.records[ref.path]=copy.deepcopy(data)
    def update(self,ref,data):self.records[ref.path].update(copy.deepcopy(data))


def setup():
    os.environ.setdefault('STRATAX_PROJECT_BUCKET','unit-test-bucket')
    db=Database();main.app.dependency_overrides[main.current_user]=lambda:{'uid':'owner'}
    return db,TestClient(main.app)


def test_reservation_attachment_and_idempotent_completion():
    db,client=setup()
    try:
        with patch.object(main,'_db',db),patch.object(imports_api.firestore,'transactional',lambda f:f),patch.object(imports_api.storage,'Client') as storage:
            result=client.post('/api/projects/project/imports',json={'family':'logs','files':[{'name':'well.las','size':10}]} )
            assert result.status_code==201
            record=result.json();iid=record['id'];aid=record['assets'][0]['id'];root='stratax_projects/owner/records/project'
            assert db.records[root]['importQuota']['reservedBytes']==10
            blob=storage.return_value.bucket.return_value.get_blob.return_value;blob.size=10;blob.crc32c='verified-crc';blob.generation='1'
            result=client.post(f'/api/projects/project/imports/{iid}/complete/{aid}',json={})
            assert result.status_code==200
            assert db.records[root]['importQuota']['reservedBytes']==0
            assert len(db.records[root]['workspace']['files'])==2
            assert client.post(f'/api/projects/project/imports/{iid}/complete/{aid}',json={}).status_code==200
            assert len(db.records[root]['workspace']['files'])==2
            main.app.dependency_overrides[main.current_user]=lambda:{'uid':'other'}
            assert client.get(f'/api/projects/project/imports/{iid}').status_code==404
    finally:main.app.dependency_overrides.clear()


def test_quotas_validation_and_cancel_release():
    db,client=setup()
    try:
        with patch.object(main,'_db',db),patch.object(imports_api.firestore,'transactional',lambda f:f),patch.object(imports_api.storage,'Client') as storage:
            assert client.post('/api/projects/project/imports',json={'family':'wrong','files':[{'name':'a','size':1}]}).status_code==400
            assert client.post('/api/projects/project/imports',json={'family':'logs','files':[{'name':'../a','size':1}]}).status_code==400
            assert client.post('/api/projects/project/imports',json={'family':'logs','files':[{'name':'a','size':11*1024**3}]}).status_code==400
            result=client.post('/api/projects/project/imports',json={'family':'seismic','files':[{'name':f'{i}.sgy','size':10*1024**3} for i in range(4)]})
            assert result.status_code==201;iid=result.json()['id']
            assert client.post('/api/projects/project/imports',json={'family':'seismic','files':[{'name':'extra.sgy','size':10*1024**3}]}).status_code==413
            storage.return_value.bucket.return_value.get_blob.return_value=None
            assert client.post(f'/api/projects/project/imports/{iid}/cancel',json={}).status_code==200
            assert db.records['stratax_projects/owner/records/project']['importQuota']['reservedBytes']==0
            assert client.post(f'/api/projects/project/imports/{iid}/cancel',json={}).status_code==200
    finally:main.app.dependency_overrides.clear()


def test_stored_source_classification_and_private_fields():
    db,client=setup()
    try:
        with patch.object(main,'_db',db),patch.object(imports_api.firestore,'transactional',lambda f:f):
            result=client.post('/api/projects/project/imports',json={'family':'logs','files':[{'name':'existing.las','size':3,'existing_id':'old'}]})
            assert result.status_code==201;iid=result.json()['id'];root='stratax_projects/owner/records/project/imports/'+iid
            assert result.json()['status']=='stored'
            db.records[root]['uploadSessions']={'x':'secret-session-url'};db.records[root]['dispatchToken']='private-dispatch'
            data=client.get(f'/api/projects/project/imports/{iid}').json()
            assert 'uploadSessions' not in data and 'dispatchToken' not in data
            assert client.put(f'/api/projects/project/imports/{iid}/configuration',json={'revision':99,'options':{}}).status_code==409
    finally:main.app.dependency_overrides.clear()


def test_commit_requires_revision_acknowledgement_and_preserves_lineage():
    db,client=setup();root='stratax_projects/owner/records/project'
    db.records[root+'/imports/review']={'id':'review','revision':2,'status':'awaiting confirmation','family':'logs','assets':[{'id':'old','name':'existing.las'}],'options':{'perFile':{'existing.las':{'well':'Confirmed well','createWell':True}}},'issues':[{'severity':'warning','code':'units','message':'Source units unconfirmed'}],'datasets':[{'id':'dataset-1','name':'Logs','sourceId':'old','columns':[{'id':'x'}],'well':'Confirmed well'}]}
    try:
        with patch.object(main,'_db',db),patch.object(imports_api.firestore,'transactional',lambda f:f):
            assert client.post('/api/projects/project/imports/review/commit',json={'revision':1,'acknowledge_warnings':True}).status_code==409
            assert client.post('/api/projects/project/imports/review/commit',json={'revision':2}).status_code==400
            result=client.post('/api/projects/project/imports/review/commit',json={'revision':2,'acknowledge_warnings':True})
            assert result.status_code==200
            assert db.records[root+'/datasets/dataset-1']['scientificApproval'] is False
            assert db.records[root]['workspace']['wellDrafts'][0]['id']=='Confirmed well'
            assert db.records[root]['workspace']['files'][0]['status']=='Imported · references unresolved'
    finally:main.app.dependency_overrides.clear()


def test_dispatch_failure_releases_worker_reservation():
    db,client=setup();root='stratax_projects/owner/records/project'
    db.records[root+'/imports/start']={'id':'start','revision':1,'status':'stored','family':'logs','assets':[{'id':'old','name':'existing.las','size':3,'state':'stored'}],'options':{},'issues':[]}
    try:
        with patch.object(main,'_db',db),patch.object(imports_api.firestore,'transactional',lambda f:f),patch('google.auth.default',return_value=(Mock(),None)),patch('google.auth.transport.requests.AuthorizedSession') as http:
            http.return_value.post.return_value.ok=False
            assert client.post('/api/projects/project/imports/start/inspect',json={}).status_code==503
            assert db.records[root]['importQuota']['reservedBytes']==0
            assert db.records[root+'/imports/start']['status']=='failed'
    finally:main.app.dependency_overrides.clear()


def test_partial_commit_column_selection_and_immutable_commits():
    db,client=setup();root='stratax_projects/owner/records/project'
    record={'id':'partial','revision':1,'status':'retained/unresolved','family':'logs','assets':[{'id':'old','name':'existing.las'}],'options':{},'issues':[{'severity':'blocking','sourceId':'broken','message':'Invalid separate source'}],'datasets':[{'id':'good','sourceId':'old','columns':[{'id':'column-0'},{'id':'column-1'}],'issues':[]}]}
    db.records[root+'/imports/partial']=record
    try:
        with patch.object(main,'_db',db),patch.object(imports_api.firestore,'transactional',lambda f:f):
            body={'revision':1,'acknowledge_warnings':True,'selected_dataset_ids':['good'],'selected_columns':{'good':['column-0']}}
            assert client.post('/api/projects/project/imports/partial/commit',json={**body,'selected_columns':{'good':['missing']}}).status_code==400
            assert client.post('/api/projects/project/imports/partial/commit',json=body).status_code==200
            assert db.records[root+'/datasets/good']['activeColumns']==['column-0']
            assert client.put('/api/projects/project/imports/partial/configuration',json={'revision':2,'options':{}}).status_code==409
    finally:main.app.dependency_overrides.clear()
