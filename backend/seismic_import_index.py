"""Exact trace locators in the existing bounded import chunks; originals stay authoritative."""
import hashlib
import json
import math
import gzip
import sqlite3
import tempfile
from contextlib import closing
from pathlib import Path

import ingestion_core as core
from seismic_reader import _read,decode_samples,SectionError
from seismic_trace_index import index_traces,SAMPLE_BYTES


def import_indexed_traces(kind,path,output,options):
    path=Path(path);endian=options.get('endian','big')
    version=options.get('_sourceSha256') or core.digest(path)
    keys={'inline':189,'crossline':193,'x':181,'y':185,'scalar':71,'cdp':21,'shot':9,'offset':37}
    supplied=options.get('headerBytes',{})
    if not isinstance(supplied,dict) or not set(supplied)<=set(keys):
        raise core.ImportProblem('header_bytes','Choose supported trace-header roles before indexing.')
    try:keys.update({k:int(v) for k,v in supplied.items() if v is not None and str(v)!=''})
    except (TypeError,ValueError):raise core.ImportProblem('header_bytes','Provide integer header byte positions.')
    mapping={('coordinateScalar' if k=='scalar' else k):v for k,v in keys.items()}
    cancelled=lambda:bool(core._cancel_check and core._cancel_check())
    try:
        with tempfile.TemporaryDirectory(prefix='stratax-trace-index-') as scratch,path.open('rb') as stream:
            index=Path(scratch)/'headers.sqlite'
            summary=index_traces(stream,path.stat().st_size,index,version,kind=kind,endian=endian,header_bytes=mapping,cancelled=cancelled)
            with closing(sqlite3.connect(index)) as db:
                descriptor=json.loads(db.execute("SELECT value FROM metadata WHERE key='source'").fetchone()[0])
                nsmin,nsmax=summary['sampleCountRange'];dtmin,dtmax=summary['intervalRange']
                metadata=dict(format=kind.upper(),traceCount=summary['traceCount'],sampleCount=nsmin if nsmin==nsmax else None,
                              sampleCountRange=[nsmin,nsmax],sampleInterval=round(dtmin*1e6) if dtmin==dtmax else None,
                              sampleIntervalRange=[dtmin,dtmax],sampleOriginRange=summary['originRange'],
                              headerBytes=keys,endian=endian,geometry=options.get('geometry','unclassified'),domain=options.get('references',{}).get('domain',''),originalGeometryPreserved=True,
                              traceIndex=dict(format='import-trace-locators/v1',locatorColumn=8,sourceVersion=version,
                                              sourceBytes=path.stat().st_size,layout=descriptor['layout'],complete=True,spatialBounds=True),
                              sourceDomain='time-unconfirmed')
                if kind=='segy':metadata.update(sampleFormat=descriptor['layout']['format'],textHeader=_read(stream,0,3200).decode('ascii',errors='replace'))
                stride=max(1,math.ceil(summary['traceCount']/100))
                def rows():
                    for identity,offset,ns,dt,start,encoded in db.execute('SELECT id,byteOffset,sampleCount,interval,origin,geometry FROM traces ORDER BY id'):
                        g=json.loads(encoded);samples=[]
                        if identity%stride==0:
                            samples=decode_samples(_read(stream,offset+240,ns*SAMPLE_BYTES[descriptor['layout']['format']]),descriptor['layout']['format'],endian)[::max(1,math.ceil(ns/256))]
                        locator=dict(trace=identity,byteOffset=offset,sampleCount=ns,sampleInterval=dt,sampleStart=start,geometry=g)
                        yield [identity,g['inline'],g['crossline'],g['cdp'],g['x'],g['y'],g['coordinateScalar'],samples,locator]
                columns=[core.column(n,'',i) for i,n in enumerate(['Trace','Inline','Crossline','CDP','X','Y','Coordinate scalar','Sample preview','Retained trace locator'])]
                result=core.output_dataset(output,path.name,columns,rows(),metadata,[core.issue('seismic_preview','Display samples are bounded previews. Exact trace locators retain variable sampling; header roles, domain, CRS and datum still require review.')])
                for chunk in result['chunks']:
                    chunk['sha256']=hashlib.sha256((Path(output)/chunk['name']).read_bytes()).hexdigest()
                    bounds={}
                    with gzip.open(Path(output)/chunk['name'],'rt',encoding='utf-8') as compressed:
                        for line in compressed:
                            geometry=json.loads(line)[8]['geometry']
                            for key in ('inline','crossline'):
                                value=geometry[key];previous=bounds.get(key,[value,value]);bounds[key]=[min(previous[0],value),max(previous[1],value)]
                    chunk['indexedHeaderBounds']=bounds
                for field,col in [('inlineRange',1),('crosslineRange',2)]:
                    stats=result['columnStatistics'][col];metadata[field]=[stats['min'],stats['max']]
                (Path(output)/(result['id']+'.json')).write_text(json.dumps(result,allow_nan=False),encoding='utf-8')
                return [result]
    except SectionError as error:
        raise core.ImportProblem('seismic_trace_index',str(error)) from error
