"""Linux-image acceptance tests with generated numeric fixtures and public log samples."""
import json
from pathlib import Path
import struct
import tempfile
import zipfile

from ingestion_core import parse, ImportProblem


def main():
    import numpy as np
    checks=[]
    def check(name,condition):
        if not condition:raise AssertionError(name)
        checks.append(name)
    with tempfile.TemporaryDirectory() as folder:
        root=Path(folder)
        def read(path,family,options=None,companions=None):return parse(path,root/(path.name+'-out'),family,options or {},companions or {})
        las='~Version\nVERS. 2.0 : version\nWRAP. NO : wrap\n~Well\nWELL. Fixture : well\nNULL. -999.25 : null\n~Curve\nDEPT.M : depth\nGR.GAPI : gamma\nGR.GAPI : duplicate\n~ASCII\n0 12 -999.25\n1 13 14\n'
        source=root/'logs.las';source.write_text(las);result=read(source,'logs')[0]
        check('LAS values, nulls and duplicate curve identities',result['preview']==[[0,12,None],[1,13,14]] and result['columns'][1]['id']!=result['columns'][2]['id'])
        source=root/'three.las';source.write_text(las.replace('2.0','3.0').replace('~Curve','~Log_Definition').replace('~ASCII','~Log_Data'));check('LAS 3 data sections',read(source,'logs')[0]['rowCount']==2)
        source=root/'table.csv';source.write_text('MD,INC,AZ\n0,0,0\n1,2,3\n');check('Mapped CSV zero values',read(source,'deviation',{'mapping':{'md':'0','inclination':'1','azimuth':'2'}})[0]['preview'][0]==[0,0,0])
        from openpyxl import Workbook
        source=root/'table.xlsx';book=Workbook();book.active.append(['MD','GR']);book.active.append([0,12]);book.save(source);check('Excel worksheet values',read(source,'logs')[0]['preview']==[[0,12]])
        from dlisio import dlis,lis
        source=Path('test-fixtures/reference.dlis');result=read(source,'arrays');check('Native DLIS frames',sum(d['rowCount'] for d in result)>0)
        source=Path('test-fixtures/reference.lis');result=read(source,'logs');check('Native LIS79 curves',sum(d['rowCount'] for d in result)>0)
        import segyio
        spec=segyio.spec();spec.sorting=2;spec.format=5;spec.samples=[0,2,4];spec.ilines=[1];spec.xlines=[1,2]
        source=root/'survey.sgy'
        with segyio.create(str(source),spec) as file:
            for i in range(2):file.trace[i]=np.array([1,2,3],np.float32)+i;file.header[i]={189:1,193:i+1,181:1000,185:2000,71:-10}
        result=read(source,'seismic')[0];check('SEG-Y samples and coordinate scalars',result['preview'][0][4:7]==[100,200,-10] and result['preview'][0][7]==[1,2,3])
        binary=bytearray(400);struct.pack_into('>H',binary,24,5);struct.pack_into('>H',binary,300,256);variable=bytearray(b' '*3200+binary)
        for values,dt,delay in [([1,2,3],2000,0),([10,11,12,13,14],4000,17)]:
            header=bytearray(240);struct.pack_into('>H',header,114,len(values));struct.pack_into('>H',header,116,dt);struct.pack_into('>h',header,108,delay);variable.extend(header);variable.extend(struct.pack('>'+str(len(values))+'f',*values))
        source=root/'variable.segy';source.write_bytes(variable);result=read(source,'seismic')[0]
        from seismic_indexed_reader import read_traces
        with source.open('rb') as retained:indexed=read_traces(retained,len(variable),result,lambda name:(root/(source.name+'-out')/name).read_bytes(),result['metadata']['traceIndex']['sourceVersion'],[0,1],sample_count=5)
        check('Indexed variable-length SEG-Y exact sampling',indexed['traces'][0]['samples']==[1,2,3] and indexed['traces'][1]['samples']==[10,11,12,13,14] and indexed['traces'][1]['sampleInterval']==.004 and indexed['traces'][1]['sampleStart']==.017)
        source=root/'survey.su';header=bytearray(240);struct.pack_into('>H',header,114,3);struct.pack_into('>H',header,116,2000);source.write_bytes(header+struct.pack('>fff',1,2,3));check('Seismic Unix',read(source,'seismic')[0]['rowCount']==1)
        from pyzgy.write import SeismicWriter
        values=np.arange(128,dtype=np.float32).reshape((4,4,8));source=root/'cube.zgy'
        with SeismicWriter(source,values.shape,0,2,(1,1),(1,1)) as writer:writer.write_volume(values)
        check('ZGY bounded native section',read(source,'seismic')[0]['preview'][0][1][0]==values[0,0].tolist())
        from seismic_zfp.conversion import NumpyConverter
        source=root/'cube.sgz';NumpyConverter(values).run(str(source),bits_per_voxel=16);result=read(source,'seismic')[0];check('SGZ bounded native section',np.allclose(result['preview'][0][1][0],values[0,0],atol=.1))
        import xtgeo
        surface=xtgeo.RegularSurface(ncol=2,nrow=2,xori=0,yori=0,xinc=1,yinc=1,values=[[1.,2.],[3.,4.]])
        for name,fmt in [('binary.gri','irap_binary'),('ascii.irap','irap_ascii'),('map.zmap','zmap_ascii')]:
            source=root/name;surface.to_file(str(source),fformat=fmt);check('Surface '+fmt,read(source,'surfaces',{'surfaceFormat':fmt})[0]['rowCount']==4)
        source=root/'fault.ts';source.write_text('GOCAD TSurf 1\nVRTX 1 1 2 3\nVRTX 2 2 3 4\nVRTX 3 3 4 5\nTRGL 1 2 3\nEND\n');check('GOCAD topology',read(source,'surfaces')[1]['preview']==[['TRGL',[1,2,3]]])
        import fiona
        from fiona.crs import CRS
        schema={'geometry':'Point','properties':{'name':'str'}}
        for name,driver in [('points.geojson','GeoJSON'),('points.gpkg','GPKG'),('points.shp','ESRI Shapefile')]:
            source=root/name
            with fiona.open(str(source),'w',driver=driver,schema=schema,crs=CRS.from_epsg(4326)) as target:target.write({'geometry':{'type':'Point','coordinates':(6.7,4.6)},'properties':{'name':'site'}})
            result=read(source,'spatial')[0];check('Spatial '+driver,result['rowCount']==1 and result['preview'][0][2]['name']=='site')
        import rasterio
        from rasterio.transform import from_origin
        source=root/'raster.tif'
        with rasterio.open(source,'w',driver='GTiff',width=2,height=2,count=1,dtype='float32',crs='EPSG:4326',transform=from_origin(6,5,.1,.1)) as target:target.write(np.array([[1,2],[3,4]],np.float32),1)
        result=read(source,'spatial')[0];check('GeoTIFF values and CRS',result['metadata']['crs']=='EPSG:4326' and result['preview'][0][1]==[[1,2],[3,4]])
        source=root/'site.kml';source.write_text('<kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><name>Site</name><Point><coordinates>6.7,4.6,0</coordinates></Point></Placemark></kml>');check('KML coordinates',read(source,'spatial')[0]['rowCount']==1)
        import h5py
        hdf=root/'model.h5'
        with h5py.File(hdf,'w') as target:target['values']=[1.,2.,3.]
        source=root/'model.epc'
        with zipfile.ZipFile(source,'w') as archive:
            archive.writestr('grid.xml','<obj_Grid2dRepresentation xmlns="http://www.energistics.org/energyml/data/resqmlv2" uuid="grid"><Title>Fixture</Title><PathInHdfFile>/values</PathInHdfFile></obj_Grid2dRepresentation>')
            archive.writestr('_rels/grid.xml.rels','<Relationships><Relationship TargetMode="External" Target="model.h5" /></Relationships>')
        check('RESQML EPC/HDF5 companions',read(source,'models',{}, {'model.h5':hdf})[1]['preview']==[[0,1.],[1,2.],[2,3.]])
        import resfo
        source=root/'model.INIT';resfo.write(str(source),[('PORO    ',np.array([.1,.2],np.float32))]);result=read(source,'models')[0];check('ECLIPSE keyword values',result['rowCount']==1 and abs(result['preview'][0][3][0]-.1)<1e-6)
        source=root/'logs.xml';source.write_text('<logs xmlns="http://www.witsml.org/schemas/1series"><log><logData><mnemonicList>MD,GR</mnemonicList><unitList>m,gAPI</unitList><data>0,12</data></logData></log></logs>');check('WITSML file rows',read(source,'logs')[0]['preview']==[[0,12]])
        from PIL import Image
        source=root/'photo.png';Image.new('RGB',(12,16)).save(source);check('Image metadata',read(source,'documents')[0]['metadata']['width']==12)
        source=root/'doc.docx'
        with zipfile.ZipFile(source,'w') as archive:archive.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Source evidence</w:t></w:r></w:p></w:body></w:document>')
        check('DOCX embedded text',read(source,'documents')[0]['preview'][0][1]=='Source evidence')
        source=root/'blocked.xml';source.write_text('<!DOCTYPE a [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><a>&xxe;</a>')
        try:read(source,'documents');raise AssertionError('XML entity accepted')
        except Exception as error:check('XML external entity blocked','XML entity accepted' not in str(error))
        source=root/'unsafe.epc'
        with zipfile.ZipFile(source,'w') as archive:archive.writestr('../escape.xml','<x/>')
        try:read(source,'models');raise AssertionError('Archive traversal accepted')
        except ImportProblem:check('Archive traversal blocked',True)
    print(json.dumps({'native_selftest_passed':len(checks),'checks':checks}))


if __name__=='__main__':main()
