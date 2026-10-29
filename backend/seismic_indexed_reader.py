"""Bounded reads through immutable import locators, including ragged source records."""
import gzip
import hashlib
import io
import json
import math
import re

from seismic_reader import _read,_integer,decode_samples,need
from seismic_trace_index import SAMPLE_BYTES


def select_locators(manifest,load_chunk,source_version,trace_ids):
    index=manifest.get('metadata',{}).get('traceIndex',{})
    ids=list(trace_ids);total=manifest.get('rowCount')
    need(index.get('format')=='import-trace-locators/v1' and index.get('complete') is True and index.get('sourceVersion')==source_version,'The retained trace index does not match this immutable original.')
    need(type(total) is int and total>0 and 0<len(ids)<=512 and len(set(ids))==len(ids) and all(type(i) is int and 0<=i<total for i in ids),'Choose up to 512 distinct retained trace identities.')
    need(index.get('locatorColumn')==8,'Unsupported trace-locator schema.')
    found={};first=0
    for chunk in manifest.get('chunks',[]):
        count=chunk.get('rows');name=chunk.get('name','')
        need(type(count) is int and count>0 and first+count<=total and re.fullmatch(r'dataset-[a-f0-9]{20}-[0-9]{6,}\.ndjson\.gz',name),'The retained trace chunk index is invalid.')
        selected={i for i in ids if first<=i<first+count}
        if selected:
            encoded=load_chunk(name)
            need(len(encoded)<=5*1024**2 and hashlib.sha256(encoded).hexdigest()==chunk.get('sha256'),'A retained trace chunk changed checksum or exceeded its read budget.')
            with gzip.GzipFile(fileobj=io.BytesIO(encoded)) as stream:expanded=stream.read(5*1024**2+1)
            need(len(expanded)<=5*1024**2,'A retained trace chunk exceeded its expanded budget.')
            rows=expanded.splitlines();need(len(rows)==count,'A retained trace chunk changed row count.')
            for identity in selected:
                row=json.loads(rows[identity-first])
                need(isinstance(row,list) and len(row)==9 and row[0]==identity and isinstance(row[8],dict) and row[8].get('trace')==identity,'A trace locator changed identity.')
                found[identity]=row[8]
        first+=count
    need(first==total and len(found)==len(ids),'The retained trace chunk index has missing support.')
    return [found[i] for i in ids]


def read_traces(stream,size,manifest,load_chunk,source_version,trace_ids,*,first_sample=0,sample_count=1000,endian='big'):
    ids=list(trace_ids)
    need(type(first_sample) is int and 0<=first_sample<=65535 and type(sample_count) is int and 1<=sample_count<=4096 and len(ids)*sample_count<=2_000_000 and endian in ('big','little'),'Choose a bounded retained sample range and byte order.')
    index=manifest.get('metadata',{}).get('traceIndex',{})
    need(index.get('sourceBytes')==size,'The retained source size does not match its trace index.')
    fmt=index.get('layout',{}).get('format');need(fmt in SAMPLE_BYTES,'Unsupported indexed sample encoding.')
    result=[];locators=select_locators(manifest,load_chunk,source_version,ids)
    for locator in locators:
        offset=locator.get('byteOffset');ns=locator.get('sampleCount');dt=locator.get('sampleInterval');start=locator.get('sampleStart')
        need(type(offset) is int and offset>=index['layout']['begin'] and type(ns) is int and 1<=ns<=65535 and offset+240+ns*SAMPLE_BYTES[fmt]<=size,'A retained trace locator leaves the original byte support.')
        need(type(dt) in (int,float) and math.isfinite(dt) and dt>0 and type(start) in (int,float) and math.isfinite(start),'A retained trace has no finite declared sampling.')
        header=_read(stream,offset,240)
        actual_ns=_integer(header,115,2,endian,False) or index['layout']['ns']
        actual_dt=(_integer(header,117,2,endian,False) or index['layout']['dt'])*1e-6
        need(actual_ns==ns and abs(actual_dt-dt)<=1e-12 and abs(_integer(header,109,2,endian)*.001-start)<=1e-12,'The source header no longer agrees with its retained locator.')
        count=max(0,min(sample_count,ns-first_sample))
        values=decode_samples(_read(stream,offset+240+first_sample*SAMPLE_BYTES[fmt],count*SAMPLE_BYTES[fmt]),fmt,endian) if count else []
        result.append(dict(traceId=locator['trace'],samples=values,valid=[v is not None for v in values],sampleInterval=dt,
                           sampleStart=start+first_sample*dt,originalSampleCount=ns,firstSample=first_sample,geometry=locator['geometry']))
    return dict(traces=result,traceCount=manifest['rowCount'],sourceVersion=source_version,axisUnit='s',sourceDomain='time-unconfirmed',analytical=True,displayOnly=False,adapter='indexed-import-traces/v1',_locators=locators)


def aligned_section(value,*,first_trace,trace_count,first_sample,sample_count):
    traces=value['traces'];first=traces[0]
    need(all(len(t['samples'])==sample_count for t in traces),'Some selected traces have fewer samples. Select a smaller interval or use individual indexed traces; no padding was invented.')
    need(all(abs(t['sampleInterval']-first['sampleInterval'])<=1e-12 and abs(t['sampleStart']-first['sampleStart'])<=1e-12 for t in traces),'Selected traces have different sampling or origins. Use individual indexed traces or an explicit reviewed alignment operation.')
    return dict(samples=[t['samples'] for t in traces],traceHeaders=[t['geometry']|dict(trace=t['traceId']) for t in traces],
                traceCount=value['traceCount'],samplesPerTrace=min(t['originalSampleCount'] for t in traces),
                sampleInterval=first['sampleInterval'],sampleStart=first['sampleStart'],sampleStarts=[t['sampleStart'] for t in traces],
                firstTrace=first_trace,firstSample=first_sample,axisUnit='s',sourceDomain='time-unconfirmed',analytical=True,displayOnly=False,level=0,adapter=value['adapter'])
