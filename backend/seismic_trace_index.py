"""Seekable trace locators retain variable lengths, origins and intervals without padding."""
import json
import sqlite3
from pathlib import Path

from seismic_reader import _read, _integer, decode_samples, need

SAMPLE_BYTES = {1:4, 2:4, 3:2, 5:4, 6:8, 8:1}
HEADERS = dict(inline=189, crossline=193, cdp=21, shot=9, offset=37, x=181, y=185,
               sourceX=73, sourceY=77, receiverX=81, receiverY=85, coordinateScalar=71, coordinateUnitsCode=89)
SHORT_HEADERS = {'coordinateScalar', 'coordinateUnitsCode'}


def layout(stream, size, kind, endian):
    need(kind in ('segy','su') and endian in ('big','little'), 'Choose the retained source format and byte order.')
    if kind == 'su':
        _read(stream, 0, 240)
        return dict(begin=0, format=5, ns=0, dt=0)
    binary = _read(stream,3200,400)
    revision, extended = _integer(binary,301,2,endian,False), _integer(binary,305,2,endian)
    need(revision <= 256, 'This indexed decoder certifies SEG-Y rev 0/1; retain newer layouts for a matching native adapter.')
    need(0 <= extended <= 1024, 'Unknown-length extended text headers need a reviewed native layout.')
    fmt = _integer(binary,25,2,endian,False)
    need(fmt in SAMPLE_BYTES, 'This indexed decoder does not support the declared sample encoding.')
    begin = 3600+extended*3200
    need(begin+240 <= size, 'The retained source has no complete first trace header.')
    return dict(begin=begin, format=fmt, ns=_integer(binary,21,2,endian,False),dt=_integer(binary,17,2,endian,False),
                measurementSystemCode=_integer(binary,55,2,endian,False))


def index_traces(stream, size, index_path, source_version, *, kind='segy', endian='big', header_bytes=None,
                 cancelled=lambda:False, progress=lambda value:None):
    need(isinstance(source_version,str) and source_version, 'Bind the trace index to an immutable source version.')
    mapping = HEADERS | (header_bytes or {})
    need(set(mapping)==set(HEADERS) and all(type(v) is int and 1<=v<=(239 if k in SHORT_HEADERS else 237) for k,v in mapping.items()), 'Review supported trace-header mappings and their field widths.')
    source = layout(stream,size,kind,endian)
    descriptor = dict(sourceVersion=source_version,size=size,kind=kind,endian=endian,headerBytes=mapping,layout=source)
    connection = sqlite3.connect(index_path)
    try:
        connection.execute('CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)')
        connection.execute('CREATE TABLE IF NOT EXISTS traces (id INTEGER PRIMARY KEY, byteOffset INTEGER NOT NULL, sampleCount INTEGER NOT NULL, interval REAL NOT NULL, origin REAL NOT NULL, inline INTEGER, crossline INTEGER, cdp INTEGER, shot INTEGER, geometry TEXT NOT NULL)')
        stored = connection.execute("SELECT value FROM metadata WHERE key='source'").fetchone()
        if stored:
            need(json.loads(stored[0]) == descriptor, 'This index belongs to another source/version or header mapping; create an independent index.')
        else:
            connection.execute("INSERT INTO metadata VALUES ('source',?)", (json.dumps(descriptor),))
            connection.execute("INSERT INTO metadata VALUES ('complete','false')")
            connection.commit()
        complete = connection.execute("SELECT value FROM metadata WHERE key='complete'").fetchone()[0]=='true'
        if complete:
            return json.loads(connection.execute("SELECT value FROM metadata WHERE key='summary'").fetchone()[0])
        last = connection.execute('SELECT id,byteOffset,sampleCount FROM traces ORDER BY id DESC LIMIT 1').fetchone()
        trace, offset = (last[0]+1,last[1]+240+last[2]*SAMPLE_BYTES[source['format']]) if last else (0,source['begin'])
        count = 0
        while offset < size:
            need(not cancelled(), 'Trace indexing cancelled at its last committed batch.')
            need(offset+240 <= size, 'A retained trace header is truncated.')
            h = _read(stream,offset,240)
            ns = _integer(h,115,2,endian,False) or source['ns']
            dt = _integer(h,117,2,endian,False) or source['dt']
            need(ns>0 and dt>0, 'A trace has no declared sample count/interval; no values were invented.')
            stop = offset+240+ns*SAMPLE_BYTES[source['format']]
            need(stop<=size, 'A trace ends beyond the retained original; the incomplete index was not accepted.')
            geometry = {k:_integer(h,byte,2 if k in SHORT_HEADERS else 4,endian,k!='coordinateUnitsCode') for k,byte in mapping.items()}
            scalar = geometry['coordinateScalar']
            factor = 1/abs(scalar) if scalar<0 else scalar or 1
            for key in ('x','y','sourceX','sourceY','receiverX','receiverY'):
                geometry[key] *= factor
            origin = _integer(h,109,2,endian)*.001
            connection.execute('INSERT INTO traces VALUES (?,?,?,?,?,?,?,?,?,?)', (trace,offset,ns,dt*1e-6,origin,
                               geometry['inline'],geometry['crossline'],geometry['cdp'],geometry['shot'],json.dumps(geometry)))
            trace+=1;count+=1;offset=stop
            if count==512:
                connection.commit();progress(dict(traces=trace,bytesIndexed=offset,totalBytes=size));count=0
        need(trace>0, 'The retained source contains no traces.')
        for field in ('inline','crossline','cdp','shot'):
            connection.execute(f'CREATE INDEX IF NOT EXISTS by_{field} ON traces ({field},id)')
        summary = dict(traceCount=trace,sampleCountRange=list(connection.execute('SELECT min(sampleCount),max(sampleCount) FROM traces').fetchone()),
                       intervalRange=list(connection.execute('SELECT min(interval),max(interval) FROM traces').fetchone()),
                       originRange=list(connection.execute('SELECT min(origin),max(origin) FROM traces').fetchone()),
                       sourceVersion=source_version,sourceDomain='time-unconfirmed',geometryReference='Unconfirmed; source scalars retained',complete=True)
        connection.execute("INSERT OR REPLACE INTO metadata VALUES ('summary',?)", (json.dumps(summary),))
        connection.execute("UPDATE metadata SET value='true' WHERE key='complete'")
        connection.commit();progress(dict(traces=trace,bytesIndexed=size,totalBytes=size))
        return summary
    finally:
        connection.close()


def indexed_traces(stream,index_path,source_version,trace_ids,*,first_sample=0,sample_count=1000):
    ids = list(trace_ids)
    need(0<len(ids)<=512 and all(type(i) is int and i>=0 for i in ids) and type(first_sample) is int and first_sample>=0 and type(sample_count) is int and 1<=sample_count<=4096 and len(ids)*sample_count<=2_000_000,
         'Choose bounded indexed trace identities and sample ranges.')
    with sqlite3.connect(f'file:{Path(index_path).as_posix()}?mode=ro',uri=True) as connection:
        meta = dict(connection.execute('SELECT key,value FROM metadata'))
        need(meta.get('complete')=='true','Wait for the complete trace index.')
        source = json.loads(meta['source'])
        need(source['sourceVersion']==source_version,'The trace index does not match this source version.')
        output=[]
        for identity in ids:
            row=connection.execute('SELECT byteOffset,sampleCount,interval,origin,geometry FROM traces WHERE id=?',(identity,)).fetchone()
            need(row is not None,'A selected trace identity is absent from the retained index.')
            offset,ns,dt,start,geometry=row
            count=max(0,min(sample_count,ns-first_sample));width=SAMPLE_BYTES[source['layout']['format']]
            values=decode_samples(_read(stream,offset+240+first_sample*width,count*width),source['layout']['format'],source['endian']) if count else []
            output.append(dict(traceId=identity,samples=values,valid=[v is not None for v in values],
                               originalSampleCount=ns,firstSample=first_sample,sampleInterval=dt,
                               sampleStart=start+first_sample*dt,geometry=json.loads(geometry)))
        return dict(traces=output,sourceVersion=source_version,analytical=True,displayOnly=False,sourceDomain='time-unconfirmed')
