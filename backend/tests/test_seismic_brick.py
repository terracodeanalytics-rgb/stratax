import io
import struct
import sys
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import pytest
from ingestion_core import parse
from seismic_brick import BrickRequest,read_brick
from seismic_reader import SectionError
from test_seismic_store import segy_bytes


def cube_source(missing=False,duplicate=False):
    ns=12;width=240+ns*4;raw=bytearray(segy_bytes(traces=9,samples=ns));traces=[]
    for trace in range(9):
        i,j=divmod(trace,3);at=3600+trace*width
        struct.pack_into('>i',raw,at+188,10+i);struct.pack_into('>i',raw,at+192,20+j)
        if not missing or (i,j)!=(1,1):traces.append(raw[at:at+width])
    if duplicate:traces.append(traces[0])
    return bytes(raw[:3600]+b''.join(traces))


def loaded(tmp_path,missing=False,duplicate=False):
    source=tmp_path/'cube.sgy';source.write_bytes(cube_source(missing,duplicate));out=tmp_path/'indexed'
    manifest=parse(source,out,'seismic',{})[0]
    review=dict(dimension=3,dataKind='poststack',timeConvention='TWT',roles={key:dict(byte=byte,width=4,signed=True) for key,byte in [('inline',189),('crossline',193)]})
    request=BrickRequest(geometryRevision=1,inline=dict(start=10,step=1,count=3),crossline=dict(start=20,step=1,count=3),firstSample=2,sampleCount=4)
    return source,out,manifest,review,request


@pytest.mark.parametrize('missing',[False,True])
def test_genuine_3d_brick_order_and_explicit_missing_support(tmp_path,missing):
    source,out,manifest,review,request=loaded(tmp_path,missing)
    with source.open('rb') as stream:value=read_brick(stream,source.stat().st_size,manifest,lambda n:(out/n).read_bytes(),manifest['metadata']['traceIndex']['sourceVersion'],review,request)
    assert value['shape']==[3,3,4] and value['sourceDomain']=='TWT'
    for s in range(4):
        for j in range(3):
            for i in range(3):
                at=(s*3+j)*3+i;expected=None if missing and (i,j)==(1,1) else (i*3+j)*100+s+2
                assert value['samples'][at]==expected
                assert value['valid'][at]==(expected is not None)
    assert not value['geometryQualifiedForProcessing']


def test_duplicate_bins_are_never_implicitly_stacked(tmp_path):
    source,out,manifest,review,request=loaded(tmp_path,duplicate=True)
    with source.open('rb') as stream,pytest.raises(SectionError,match='Duplicate traces'):
        read_brick(stream,source.stat().st_size,manifest,lambda n:(out/n).read_bytes(),manifest['metadata']['traceIndex']['sourceVersion'],review,request)


def test_raw_gathers_cannot_be_presented_as_a_poststack_volume(tmp_path):
    source,out,manifest,review,request=loaded(tmp_path)
    review['dataKind']='unstacked'
    with source.open('rb') as stream,pytest.raises(SectionError,match='poststack'):
        read_brick(stream,source.stat().st_size,manifest,lambda n:(out/n).read_bytes(),manifest['metadata']['traceIndex']['sourceVersion'],review,request)
