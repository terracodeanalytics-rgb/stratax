import copy
import hashlib
import io
import json
import os
import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import pytest
from fastapi.testclient import TestClient
import ingestion_core as core
import main,seismic_api
from seismic_import_index import import_indexed_traces
from seismic_indexed_reader import read_traces,aligned_section,select_locators
from seismic_reader import SectionError
from test_seismic_trace_index import variable_source
from test_seismic_api import fixture


def imported(tmp_path,monkeypatch):
    monkeypatch.setattr(core,'CHUNK_ROWS',2)
    source=tmp_path/'variable.segy';source.write_bytes(variable_source());out=tmp_path/'out'
    manifest=core.parse(source,out,'seismic',{})[0]
    sha=hashlib.sha256(source.read_bytes()).hexdigest()
    assert manifest['metadata']['traceIndex']['sourceVersion']==sha
    return source,out,manifest,sha


def test_import_and_bounded_ragged_reads_preserve_exact_sampling(tmp_path,monkeypatch):
    source,out,manifest,sha=imported(tmp_path,monkeypatch);loaded=[]
    def load(name):loaded.append(name);return (out/name).read_bytes()
    value=read_traces(io.BytesIO(source.read_bytes()),source.stat().st_size,manifest,load,sha,[2],sample_count=4)
    assert len(loaded)==1 and loaded[0]==manifest['chunks'][1]['name']
    assert value['traces'][0]['samples']==[20.,21.] and value['traces'][0]['sampleInterval']==.001
    value=read_traces(io.BytesIO(source.read_bytes()),source.stat().st_size,manifest,load,sha,[0,1,2],first_sample=1,sample_count=4)
    assert [len(t['samples']) for t in value['traces']]==[2,4,1]
    assert value['traces'][0]['samples'][1] is None
    with pytest.raises(SectionError,match='fewer samples'):aligned_section(value,first_trace=0,trace_count=3,first_sample=1,sample_count=4)
    with pytest.raises(SectionError,match='immutable original'):select_locators(manifest,load,'changed',[0])
    with pytest.raises(SectionError,match='distinct'):select_locators(manifest,load,sha,[0,0])


def test_corrupt_chunk_and_unsupported_byte_ranges_fail_without_substitution(tmp_path,monkeypatch):
    source,out,manifest,sha=imported(tmp_path,monkeypatch)
    with pytest.raises(SectionError,match='checksum'):select_locators(manifest,lambda _:b'corrupt',sha,[0])
    with pytest.raises(SectionError,match='source size'):read_traces(io.BytesIO(source.read_bytes()),source.stat().st_size+1,manifest,lambda n:(out/n).read_bytes(),sha,[0])
    bad=copy.deepcopy(manifest);bad['chunks'][0]['name']='../other-owner.gz'
    with pytest.raises(SectionError,match='chunk index'):select_locators(bad,lambda _:pytest.fail('Out-of-scope object read'),sha,[0])


def test_existing_native_import_remains_for_newer_segy_headers(tmp_path):
    import struct
    from test_seismic_store import segy_bytes
    raw=bytearray(segy_bytes());struct.pack_into('>H',raw,3500,512)
    source=tmp_path/'native-revision.sgy';source.write_bytes(raw)
    manifest=core.parse(source,tmp_path/'out','seismic',{})[0]
    assert manifest['rowCount']==3 and manifest['preview'][0][7]==list(range(16))
    assert 'traceIndex' not in manifest['metadata']


def test_owner_scoped_cloud_trace_and_section_routes(tmp_path,monkeypatch):
    source,out,manifest,sha=imported(tmp_path,monkeypatch);db,ds=fixture()
    ds['sourceSha256']=sha
    prefix=ds['manifest'].rsplit('/',1)[0]+'/'
    original=source.read_bytes();objects={ds['manifest']:json.dumps(manifest).encode(),**{prefix+c['name']:(out/c['name']).read_bytes() for c in manifest['chunks']}}
    class Blob:
        generation=1
        def __init__(self,name):self.payload=original if name.endswith('/originals/original') else objects[name];self.size=len(self.payload)
        def reload(self):pass
        def download_as_bytes(self):return self.payload
        def open(self,*args,**kwargs):return io.BytesIO(self.payload)
    class Store:
        def bucket(self,name):return self
        def blob(self,name,**kwargs):return Blob(name)
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
    try:
        with patch.object(main,'_db',db),patch.object(seismic_api.storage,'Client',Store),patch.dict(os.environ,STRATAX_PROJECT_BUCKET='raw',STRATAX_DERIVED_BUCKET='derived'):
            client=TestClient(main.app);path='/api/projects/project/seismic/sources/source/'
            value=client.get(path+'traces?trace_count=3&sample_count=4')
            assert value.status_code==200,value.text
            assert [len(t['samples']) for t in value.json()['traces']]==[3,4,2]
            assert '_identity' not in value.json() and '_locators' not in value.json()
            assert client.get(path+'section?first_trace=1&trace_count=1&sample_count=5').status_code==200
            assert client.get(path+'section?trace_count=3&sample_count=2').status_code==400
            assert client.get(path+'traces?trace_count=999999999').status_code==400
            from test_seismic_geometry import review
            from scientific_api import fingerprint
            with patch.object(seismic_api.firestore,'transactional',lambda f:f):
                geometry=client.post(path+'geometry/preview?trace_count=3',json=review(fingerprint(ds)))
                assert geometry.status_code==200,geometry.text
                assert len(geometry.json()['rows'])==3
            main.app.dependency_overrides[main.current_user]=lambda:dict(uid='other')
            assert client.get(path+'traces').status_code==404
    finally:main.app.dependency_overrides.clear()
