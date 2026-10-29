import io
import sqlite3
import struct
import sys
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))

import pytest
from seismic_reader import SectionError
from seismic_trace_index import index_traces, indexed_traces


def variable_source():
    binary=bytearray(400);struct.pack_into('>H',binary,24,5);struct.pack_into('>H',binary,300,256)
    value=bytearray(b' '*3200+binary)
    for i,(samples,dt,delay) in enumerate([([1,2,float('nan')],2000,0),([10,11,12,13,14],4000,100),([20,21],1000,-4)]):
        header=bytearray(240)
        for at,n in [(114,len(samples)),(116,dt)]:struct.pack_into('>H',header,at,n)
        struct.pack_into('>h',header,108,delay);struct.pack_into('>h',header,70,-10)
        for at,n in [(188,10 if i<2 else 12),(192,21 if i<2 else 24),(180,1000),(184,2000)]:struct.pack_into('>i',header,at,n)
        value.extend(header);value.extend(struct.pack('>'+str(len(samples))+'f',*samples))
    return bytes(value)


def test_variable_trace_lengths_intervals_origins_and_duplicate_bins_are_retained(tmp_path):
    raw=variable_source();index=tmp_path/'traces.sqlite'
    summary=index_traces(io.BytesIO(raw),len(raw),index,'immutable-source-v1')
    assert summary['sampleCountRange']==[2,5] and summary['intervalRange']==[.001,.004] and summary['originRange']==[-.004,.1]
    assert summary['traceCount']==3 and summary['sourceDomain']=='time-unconfirmed'
    data=indexed_traces(io.BytesIO(raw),index,'immutable-source-v1',[0,1,2],first_sample=1,sample_count=4)
    assert [t['samples'] for t in data['traces']]==[[2,None],[11,12,13,14],[21]]
    assert data['traces'][0]['valid']==[True,False]
    assert data['traces'][1]['sampleStart']==pytest.approx(.104,abs=1e-12) and data['traces'][0]['geometry']['x']==100
    with sqlite3.connect(index) as db:assert db.execute('SELECT id FROM traces WHERE inline=10 AND crossline=21 ORDER BY id').fetchall()==[(0,),(1,)]
    with pytest.raises(SectionError,match='source version'):
        indexed_traces(io.BytesIO(raw),index,'another-source',[0])


def test_header_index_interruption_restarts_at_committed_trace_batch(tmp_path):
    binary=bytearray(400);struct.pack_into('>H',binary,24,5)
    raw=bytearray(b' '*3200+binary)
    for i in range(600):
        header=bytearray(240);struct.pack_into('>H',header,114,1);struct.pack_into('>H',header,116,2000)
        raw.extend(header);raw.extend(struct.pack('>f',i))
    stop=False
    def progress(value):
        nonlocal stop
        stop=True
    index=tmp_path/'restart.sqlite'
    with pytest.raises(SectionError,match='cancelled'):
        index_traces(io.BytesIO(raw),len(raw),index,'v1',cancelled=lambda:stop,progress=progress)
    with sqlite3.connect(index) as db:assert db.execute('SELECT count(*) FROM traces').fetchone()[0]==512
    summary=index_traces(io.BytesIO(raw),len(raw),index,'v1')
    assert summary['traceCount']==600
    assert indexed_traces(io.BytesIO(raw),index,'v1',[599],sample_count=1)['traces'][0]['samples']==[599]
    with pytest.raises(SectionError,match='another source'):
        index_traces(io.BytesIO(raw),len(raw),index,'changed')


def test_truncation_leaves_an_unaccepted_index(tmp_path):
    raw=variable_source()[:-1];index=tmp_path/'truncated.sqlite'
    with pytest.raises(SectionError,match='beyond'):
        index_traces(io.BytesIO(raw),len(raw),index,'truncated')
    with pytest.raises(SectionError,match='complete trace index'):
        indexed_traces(io.BytesIO(raw),index,'truncated',[0])


def test_sharded_analytical_ragged_collection_roundtrip_and_restart(tmp_path):
    import zarr
    from seismic_trace_store import index_trace_samples,trace_samples
    raw=variable_source();index=tmp_path/'source.sqlite';destination=tmp_path/'samples.zarr'
    index_traces(io.BytesIO(raw),len(raw),index,'v1')
    stop=False
    def progress(value):
        nonlocal stop
        stop=True
    # The committed final batch can be restarted even if the caller loses its acknowledgement.
    result=index_trace_samples(io.BytesIO(raw),index,destination,'v1',cancelled=lambda:stop,progress=progress)
    assert result['complete'] and result['sampleCount']==10
    assert index_trace_samples(io.BytesIO(raw),index,destination,'v1')==result
    root=zarr.open_group(str(destination),mode='r',zarr_format=3)
    assert root['offsets'][:].tolist()==[0,3,8,10]
    assert root['samples'].shards==(1048576,)
    actual=trace_samples(root,'v1',[0,1,2],first_sample=1,sample_count=4)
    expected=indexed_traces(io.BytesIO(raw),index,'v1',[0,1,2],first_sample=1,sample_count=4)
    for a,b in zip(actual['traces'],expected['traces']):
        assert a=={k:v for k,v in b.items() if k!='geometry'}
    with pytest.raises(SectionError,match='source version'):
        trace_samples(root,'changed',[0])


def test_interrupted_analytical_collection_is_unreadable_until_resumed(tmp_path):
    import zarr
    from seismic_trace_store import index_trace_samples,trace_samples
    fixture=variable_source();raw=fixture[:3600]+fixture[3600:]*7
    index=tmp_path/'source.sqlite';destination=tmp_path/'samples.zarr'
    index_traces(io.BytesIO(raw),len(raw),index,'v1')
    stop=False
    def progress(value):
        nonlocal stop
        stop=True
    with pytest.raises(SectionError,match='cancelled'):
        index_trace_samples(io.BytesIO(raw),index,destination,'v1',cancelled=lambda:stop,progress=progress,batch_samples=20)
    root=zarr.open_group(str(destination),mode='r',zarr_format=3)
    assert root.attrs['nextTrace']==6 and not root.attrs['complete']
    with pytest.raises(SectionError,match='complete'):
        trace_samples(root,'v1',[0])
    index_trace_samples(io.BytesIO(raw),index,destination,'v1')
    root=zarr.open_group(str(destination),mode='r',zarr_format=3)
    assert trace_samples(root,'v1',[20],sample_count=4)['traces'][0]['samples']==[20,21]


@pytest.mark.parametrize('endian',['big','little'])
def test_vectorised_analytical_decoder_matches_independent_scalar_words(endian):
    import numpy as np
    from seismic_trace_store import decode_array
    from seismic_reader import decode_samples
    words=[0,0x41100000,0xc1200000,0x407fffff,0x7fffffff,0x80100000]
    raw=b''.join(w.to_bytes(4,endian) for w in words)
    np.testing.assert_array_equal(decode_array(raw,1,endian),decode_samples(raw,1,endian))


@pytest.mark.parametrize('winerror',[5,32,None])
def test_only_transient_windows_write_locks_retry_before_checkpoint(monkeypatch,winerror):
    import numpy as np
    import seismic_trace_store as store
    arrays={name:np.zeros(4) for name in ('samples','valid','offsets','intervals','origins')}
    calls=[]
    class Root:
        attrs={'nextTrace':0}
        failed=False
        def __getitem__(self,key):
            if key=='intervals' and not self.failed:
                self.failed=True
                assert self.attrs['nextTrace']==0
                error=PermissionError('fixture write lock');error.winerror=winerror
                raise error
            return arrays[key]
    monkeypatch.setattr(store.time,'sleep',calls.append)
    root=Root();args=(root,0,0,np.array([4.,5.]),[0,2],[(0,0,2,.002,0)])
    if winerror is None:
        with pytest.raises(PermissionError):store.write_batch(*args)
        assert not calls and root.attrs['nextTrace']==0
    else:
        store.write_batch(*args)
        assert calls==[.05] and root.attrs['nextTrace']==1
        assert arrays['samples'][:2].tolist()==[4.,5.] and arrays['offsets'][:2].tolist()==[0.,2.]
