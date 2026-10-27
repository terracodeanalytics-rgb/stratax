import gzip
import json
import sys
import zipfile
from pathlib import Path

import pytest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from ingestion_core import parse, detect, ImportProblem, validate_mapping
from ingestion_native import safe_members, read_hdf


def las(version='2.0', wrap='NO'):
    return f'''~Version
VERS. {version} : version
WRAP. {wrap} : wrapping
~Well
WELL. TMB-TEST : well
NULL. -999.25 : null
LAT. 4.624668 : latitude
~Curve
DEPT.M : depth
GR.UNKNOWN : gamma ray
GR.GAPI : second run
~ASCII
0 10 -999.25
0.5 11 12
1 12 13
'''


def test_las_real_values_duplicates_and_nulls(tmp_path):
    source=tmp_path/'well.las';source.write_text(las())
    result=parse(source,tmp_path/'out','logs',{})[0]
    assert result['rowCount']==3
    assert [c['mnemonic'] for c in result['columns']]==['DEPT','GR','GR']
    assert len({c['id'] for c in result['columns']})==3
    assert result['preview'][0]==[0,10,None]
    assert result['metadata']['well']=='TMB-TEST'
    assert result['status']=='retained/unresolved'
    assert any(i['code']=='unconfirmed_crs' for i in result['issues'])
    assert json.loads(gzip.open(tmp_path/'out'/result['chunks'][0]['name'],'rt').readline())==[0,10,None]


def test_wrapped_and_las3_sections(tmp_path):
    source=tmp_path/'wrapped.las';source.write_text(las(wrap='YES').replace('0 10 -999.25','0 10\n-999.25'))
    assert parse(source,tmp_path/'wrapped','logs',{})[0]['rowCount']==3
    source.write_text(las('3.0').replace('~Curve','~Log_Definition').replace('~ASCII','~Log_Data'))
    assert parse(source,tmp_path/'three','logs',{})[0]['metadata']['version']=='3.0'
    source.write_text(las('4.0'))
    with pytest.raises(ImportProblem,match='version'):
        parse(source,tmp_path/'bad','logs',{})


def test_las_rejects_bad_rows_and_lidar(tmp_path):
    source=tmp_path/'bad.las';source.write_text(las().replace('0.5 11 12','0.5 11'))
    with pytest.raises(ImportProblem,match='column'):
        parse(source,tmp_path/'out','logs',{})
    source.write_bytes(b'LASF\x00\x00')
    with pytest.raises(ImportProblem,match='LiDAR'):
        detect(source)


def test_table_mapping_units_and_invalid_angles(tmp_path):
    source=tmp_path/'survey.dev';source.write_text('MD INC AZ\n0 0 0\n10 190 370\n')
    result=parse(source,tmp_path/'out','deviation',{'delimiter':'whitespace','mapping':{'md':'0','inclination':'1','azimuth':'2'}})[0]
    assert result['preview'][0]==[0,0,0]
    assert any(i['severity']=='blocking' and i['code']=='range_inclination' for i in result['issues'])
    assert any(i['code']=='north_reference' for i in result['issues'])


def test_excel_and_fixed_width(tmp_path):
    from openpyxl import Workbook
    book=Workbook();sheet=book.active;sheet.title='Core';sheet.append(['Depth','PHI']);sheet.append([100,0.18]);book.save(tmp_path/'core.xlsx')
    result=parse(tmp_path/'core.xlsx',tmp_path/'excel','core',{'sheet':'Core'})[0]
    assert result['preview']==[[100,0.18]]
    source=tmp_path/'fixed.txt';source.write_text('MD  GR  \n0   10  \n1   20  \n')
    assert parse(source,tmp_path/'fixed','logs',{'widths':[4,4]})[0]['preview']==[[0,10],[1,20]]


def test_archive_and_xml_external_reference_protection(tmp_path):
    path=tmp_path/'unsafe.epc'
    with zipfile.ZipFile(path,'w') as archive:archive.writestr('../escape.xml','<x/>')
    with pytest.raises(ImportProblem,match='unsafe'):safe_members(path)
    path=tmp_path/'external.xml';path.write_text('<!DOCTYPE a [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><a>&xxe;</a>')
    with pytest.raises(Exception):parse(path,tmp_path/'xml','production',{})


def test_hdf_requires_mapping_and_rejects_external_links(tmp_path):
    import h5py
    source=tmp_path/'array.h5'
    with h5py.File(source,'w') as f:
        f['values']=[[1,2],[3,4]]
        f['external']=h5py.ExternalLink('private.h5','/secret')
    with pytest.raises(ImportProblem,match='Choose'):read_hdf(source,tmp_path/'unmapped',{})
    result=read_hdf(source,tmp_path/'out',{'hdfPaths':['/values']})[0]
    assert result['preview']==[[0,[1,2]],[1,[3,4]]]
    with pytest.raises(ImportProblem,match='references'):read_hdf(source,tmp_path/'unsafe',{'hdfPaths':['external']})


def test_segy_numeric_values_and_scalars(tmp_path):
    import numpy as np
    import segyio
    spec=segyio.spec();spec.sorting=2;spec.format=5;spec.samples=[0,2,4];spec.ilines=[1];spec.xlines=[1,2]
    path=tmp_path/'survey.sgy'
    with segyio.create(str(path),spec) as f:
        for index in range(2):
            f.trace[index]=np.array([1,2,3],dtype='float32')+index
            f.header[index]={189:1,193:index+1,181:1000+index,185:2000,71:-10}
        f.bin[segyio.BinField.Interval]=2000
    result=parse(path,tmp_path/'out','seismic',{})[0]
    assert result['rowCount']==2
    assert result['preview'][0][4:7]==[100,200,-10]
    assert result['preview'][0][7]==[1,2,3]
    assert result['metadata']['traceCount']==2


def test_gocad_topology_and_document_images(tmp_path):
    path=tmp_path/'fault.ts';path.write_text('GOCAD TSurf 1\nVRTX 1 1 2 3\nVRTX 2 2 3 4\nVRTX 3 3 4 5\nTRGL 1 2 3\nEND\n')
    result=parse(path,tmp_path/'gocad','surfaces',{})
    assert result[0]['rowCount']==3 and result[1]['preview']==[['TRGL',[1,2,3]]]
    from PIL import Image
    Image.new('RGB',(12,16)).save(tmp_path/'photo.png')
    result=parse(tmp_path/'photo.png',tmp_path/'photo','documents',{})[0]
    assert result['metadata']['width']==12 and result['metadata']['height']==16


def test_downloads_las_against_reference_reader(tmp_path):
    folder=Path('C:/Users/Tolu/Downloads/las files')
    sources=list(folder.glob('*.las'))
    if not sources:pytest.skip('User acceptance sources are only available on the authorized local computer.')
    import lasio
    import numpy as np
    for source in sources:
        expected=lasio.read(source)
        result=parse(source,tmp_path/source.stem,'logs',{})[0]
        assert result['rowCount']==expected.data.shape[0]
        assert len(result['columns'])==expected.data.shape[1]
        actual=np.array([[float(v) if v is not None else np.nan for v in row] for row in result['preview']])
        np.testing.assert_allclose(actual,expected.data[:len(actual)],equal_nan=True)
        assert any(i['code']=='unconfirmed_crs' for i in result['issues'])


def test_native_zgy_and_sgz_round_trip(tmp_path):
    import numpy as np
    from pyzgy.write import SeismicWriter
    from seismic_zfp.conversion import NumpyConverter
    values=np.arange(4*4*8,dtype=np.float32).reshape((4,4,8))
    zgy=tmp_path/'cube.zgy'
    with SeismicWriter(zgy,values.shape,0,2,(1,1),(1,1)) as writer:writer.write_volume(values)
    result=parse(zgy,tmp_path/'zgy','seismic',{})[0]
    assert result['metadata']['inlineCount']==4
    assert result['preview'][0][1][0]==values[0,0].tolist()
    sgz=tmp_path/'cube.sgz'
    NumpyConverter(values).run(str(sgz),bits_per_voxel=16)
    result=parse(sgz,tmp_path/'sgz','seismic',{})[0]
    assert result['metadata']['sampleCount']==8
    np.testing.assert_allclose(result['preview'][0][1][0],values[0,0],atol=.1)


def test_dlis_and_lis_public_reference_files(tmp_path):
    source=Path('.release/dlisio-reference/python/data')
    if not source.exists():pytest.skip('Optional upstream public binary fixtures not downloaded.')
    from dlisio import dlis,lis
    dlis_file=source/'chap4-7/iflr/various-fdata-in-one-iflr.dlis'
    datasets=parse(dlis_file,tmp_path/'dlis','arrays',{})
    assert datasets and sum(d['rowCount'] for d in datasets)>0
    with dlis.load(str(dlis_file)) as (logical,*_):
        expected=logical.frames[0].curves(strict=False)
        assert datasets[0]['rowCount']==len(expected)
        assert datasets[0]['preview'][0][0]==int(expected[0][0])
    lis_file=source/'lis/MUD_LOG_1.LIS'
    result=parse(lis_file,tmp_path/'lis','logs',{})
    with lis.load(str(lis_file)) as (logical,*_):
        expected=lis.curves(logical,logical.data_format_specs()[0],strict=False)
        assert result[0]['rowCount']==len(expected)


def test_resqml_companion_arrays_and_unsafe_reference(tmp_path):
    import h5py
    hdf=tmp_path/'model.h5'
    with h5py.File(hdf,'w') as f:f['values']=[1.,2.,3.]
    epc=tmp_path/'model.epc'
    xml='<obj_Grid2dRepresentation xmlns="http://www.energistics.org/energyml/data/resqmlv2" uuid="test-grid"><Title>Grid evidence</Title><PathInHdfFile>/values</PathInHdfFile></obj_Grid2dRepresentation>'
    rel='<Relationships><Relationship TargetMode="External" Target="model.h5" /></Relationships>'
    with zipfile.ZipFile(epc,'w') as archive:archive.writestr('grid.xml',xml);archive.writestr('_rels/grid.xml.rels',rel)
    result=parse(epc,tmp_path/'out','models',{}, {'model.h5':hdf})
    assert result[0]['preview'][0][0]=='test-grid'
    assert result[1]['preview']==[[0,1.],[1,2.],[2,3.]]
    with pytest.raises(ImportProblem,match='companion'):parse(epc,tmp_path/'missing','models',{})


def test_energyml_text_and_kml_files(tmp_path):
    path=tmp_path/'logs.xml';path.write_text('<logs xmlns="http://www.witsml.org/schemas/1series"><log><logData><mnemonicList>MD,GR</mnemonicList><unitList>m,gAPI</unitList><data>0,12</data><data>1,13</data></logData></log></logs>')
    assert parse(path,tmp_path/'witsml','logs',{})[0]['preview']==[[0,12],[1,13]]
    path=tmp_path/'location.kml';path.write_text('<kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><name>Site</name><Point><coordinates>6.7,4.6,0</coordinates></Point></Placemark></kml>')
    assert parse(path,tmp_path/'kml','spatial',{})[0]['preview']==[['Site',['6.7,4.6,0']]]


def test_irap_surface_and_cps_dialect(tmp_path):
    import xtgeo
    surface=xtgeo.RegularSurface(ncol=2,nrow=2,xori=0,yori=0,xinc=1,yinc=1,values=[[1.,2.],[3.,4.]])
    path=tmp_path/'grid.gri';surface.to_file(str(path),fformat='irap_binary')
    assert parse(path,tmp_path/'surface','surfaces',{})[0]['rowCount']==4
    path=tmp_path/'grid.cps';path.write_text('FSASCI\nFSNROW 2 2\nFSLIMI 0 1 0 1\n1 2 3 4\n')
    assert parse(path,tmp_path/'cps','surfaces',{})[0]['preview']==[[0,1],[1,2],[2,3],[3,4]]
    path.write_text('unsupported vendor dialect')
    with pytest.raises(ImportProblem):parse(path,tmp_path/'bad-cps','surfaces',{})


def test_eclipse_streaming_records_against_reference(tmp_path):
    import numpy as np
    import resfo
    path=tmp_path/'values.INIT';values=np.arange(5001,dtype=np.float32)
    resfo.write(str(path),[('PORO    ',values)])
    result=parse(path,tmp_path/'eclipse','models',{})[0]
    blocks=[]
    for chunk in result['chunks']:
        with gzip.open(tmp_path/'eclipse'/chunk['name'],'rt') as source:
            blocks.extend(json.loads(line)[3] for line in source)
    np.testing.assert_allclose(np.concatenate(blocks),resfo.read(str(path))[0][1])


def test_ranges_validate_all_rows_not_only_preview(tmp_path):
    path=tmp_path/'stations.csv'
    path.write_text('MD,INC,AZ\n'+''.join(f'{i},0,0\n' for i in range(100))+'101,200,0\n')
    result=parse(path,tmp_path/'all-rows','deviation',{'mapping':{'md':'0','inclination':'1','azimuth':'2'}})[0]
    assert len(result['preview'])==60
    assert any(i['code']=='range_inclination' and i['severity']=='blocking' for i in result['issues'])
