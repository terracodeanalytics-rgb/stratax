import io
import json
import os
import sys
from pathlib import Path
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
from fastapi.testclient import TestClient

import main
import seismic_api
import seismic_runs_api as runs
import seismic_batch_worker as worker
from scientific_api import fingerprint
from test_scientific_api import Database, Reference, ROOT
from test_seismic_api import fixture
from test_seismic_store import segy_bytes
from test_seismic_execution import graph, profile


class Db(Database):
    def document(self, path): return Ref(self, path)
    def collection(self, name): return Ref(self, name)


class Ref(Reference):
    def collection(self, name): return Ref(self.db, self.path+'/'+name)
    def document(self, name): return Ref(self.db, self.path+'/'+name)
    def set(self, data): self.db.set(self, data)


class Store:
    def __init__(self): self.files={}
    def bucket(self, name): return Bucket(self, name)
    def list_blobs(self, bucket, prefix):
        return [Blob(self, bucket, key) for b,key in self.files if b==bucket and key.startswith(prefix)]


class Bucket:
    def __init__(self, store, name): self.store,self.name=store,name
    def blob(self, name, generation=None): return Blob(self.store,self.name,name)


class Blob:
    generation=7
    def __init__(self, store, bucket, name): self.store,self.bucket,self.name=store,bucket,name
    @property
    def size(self): return len(self.store.files[self.bucket,self.name])
    def reload(self): pass
    def download_as_bytes(self): return self.store.files[self.bucket,self.name]
    def open(self, *a, **kw): return io.BytesIO(self.download_as_bytes())
    def upload_from_string(self, data, **kw):
        assert (self.bucket,self.name) not in self.store.files
        self.store.files[self.bucket,self.name]=bytes(data)


def test_graph_preview_admission_worker_review_and_downstream_source():
    base, ds=fixture();db=Db();db.records=base.records
    raw=segy_bytes(traces=3,samples=128)
    db.records[ROOT]['workspace']['files'][0]['size']=len(raw)
    store=Store();store.files['raw','owners/owner/projects/project/originals/original']=raw
    store.files['derived',ds['manifest']]=b'{"metadata":{"endian":"big"}}'
    client=TestClient(main.app)
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
    provider=Mock();provider.post.return_value.status_code=201
    try:
        with patch.object(main,'_db',db), patch.object(seismic_api.firestore,'transactional',lambda f:f), patch.object(seismic_api.storage,'Client',return_value=store), patch.object(runs,'provider',return_value=provider), patch.object(worker.firestore,'Client',return_value=db), patch.dict(os.environ,STRATAX_PROJECT_BUCKET='raw',STRATAX_DERIVED_BUCKET='derived',STRATAX_SEISMIC_BATCH_ACCOUNT='worker@project.iam.gserviceaccount.com',STRATAX_SEISMIC_BATCH_PROFILE=json.dumps(profile())):
            body=graph()|dict(sourceVersion=fingerprint(ds))
            assert client.put('/api/projects/project/seismic/graphs/g',json=body).status_code==200
            request=dict(graphId='g',revision=1,selection=dict(firstTrace=0,traceCount=3,firstSample=0,sampleCount=128))
            quoted=client.post('/api/projects/project/seismic/estimates',json=request)
            assert quoted.status_code==200,quoted.text
            value=quoted.json();submission=dict(estimateId=value['id'],estimateFingerprint=value['fingerprint'],idempotencyKey='preview-001',reviewed=True)
            assert client.post('/api/projects/project/seismic/runs',json=submission|dict(reviewed=False)).status_code==400
            result=client.post('/api/projects/project/seismic/runs',json=submission)
            assert result.status_code==202,result.text
            run=result.json();rid=run['id'];assert 'input' not in run and 'batchRequest' not in run
            assert client.post('/api/projects/project/seismic/runs',json=submission).json()['id']==rid
            assert provider.post.call_count==1
            assert db.records[ROOT]['importQuota']['reservedBytes']>0
            with patch.dict(os.environ,STRATAX_SEISMIC_RUN=ROOT+'/seismicRuns/'+rid):worker.main()
            current=client.get('/api/projects/project/seismic/runs/'+rid).json()
            assert current['status']=='completed' and current['hasCheckpoint']
            assert db.records[ROOT]['importQuota']['reservedBytes']==0
            proposed=client.get('/api/projects/project/seismic/runs/'+rid+'/result?trace_count=3&sample_count=64')
            assert proposed.status_code==200,proposed.text
            values=proposed.json()['samples'];assert len(values)==3 and len(values[0])==64
            accepted=client.post('/api/projects/project/seismic/runs/'+rid+'/review',json=dict(revision=current['revision'],decision='accept',comment='Reviewed generated fixture only'))
            assert accepted.status_code==200,accepted.text
            did=accepted.json()['datasetId']
            section=client.get('/api/projects/project/seismic/sources/'+did+'/section?trace_count=3&sample_count=64')
            assert section.status_code==200,section.text
            np.testing.assert_array_equal(section.json()['samples'],values)
            assert section.json()['sourceDomain']=='TWT' and '_identity' not in section.json()
            assert db.records[ROOT+'/datasets/source']['active'] is True
            main.app.dependency_overrides[main.current_user]=lambda:dict(uid='other')
            assert client.get('/api/projects/project/seismic/runs/'+rid).status_code==404
    finally:
        main.app.dependency_overrides.clear()
