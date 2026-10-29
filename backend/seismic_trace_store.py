"""Sharded, lossless ragged trace collections; sampling remains per trace."""
import json
import sqlite3
import time
from pathlib import Path

import numpy as np

from seismic_reader import _read, need
from seismic_trace_index import SAMPLE_BYTES


def write_batch(root,start,first,values,offsets,rows):
    # Windows scanners can briefly lock an atomic-replacement target. Repeat
    # only identical writes; the committed trace boundary advances afterwards.
    for attempt in range(7):
        try:
            root['samples'][start:offsets[-1]]=values
            root['valid'][start:offsets[-1]]=np.isfinite(values)
            root['offsets'][first:first+len(rows)+1]=offsets
            root['intervals'][first:first+len(rows)]=[row[3] for row in rows]
            root['origins'][first:first+len(rows)]=[row[4] for row in rows]
            root.attrs['nextTrace']=first+len(rows)
            return
        except PermissionError as error:
            if getattr(error,'winerror',None) not in (5,32) or attempt==6:raise
            time.sleep(.05*2**attempt)


def decode_array(raw, sample_format, endian):
    order='>' if endian=='big' else '<'
    if sample_format==1:
        words=np.frombuffer(raw,dtype=order+'u4')
        mantissa=(words&0xffffff).astype(np.float64)/2**24
        exponent=((words>>24)&127).astype(np.int16)-64
        return np.where(words&0x80000000,-1.,1.)*mantissa*np.power(16.,exponent)
    codes={2:'i4',3:'i2',5:'f4',6:'f8',8:'i1'}
    need(sample_format in codes,'Unsupported analytical sample encoding.')
    return np.frombuffer(raw,dtype=order+codes[sample_format]).astype(np.float64)


def index_trace_samples(stream, index_path, destination, source_version, *, cancelled=lambda:False, progress=lambda value:None,batch_samples=1048576):
    import zarr
    from zarr.codecs import ZstdCodec

    need(type(batch_samples) is int and 1<=batch_samples<=1048576,'Choose a bounded analytical sample-write batch.')
    with sqlite3.connect(f'file:{Path(index_path).as_posix()}?mode=ro',uri=True) as db:
        metadata=dict(db.execute('SELECT key,value FROM metadata'))
        need(metadata.get('complete')=='true','Complete the header index before analytical sample indexing.')
        source=json.loads(metadata['source'])
        need(source['sourceVersion']==source_version,'The retained index belongs to another source version.')
        traces,total=db.execute('SELECT count(*),sum(sampleCount) FROM traces').fetchone()
        path=Path(destination)
        if path.exists():
            root=zarr.open_group(str(path),mode='r+',zarr_format=3)
            need(root.attrs.get('source')==source and root.attrs.get('traceCount')==traces,'This analytical collection belongs to another source/index. Preserve it and create an independent version.')
        else:
            root=zarr.open_group(str(path),mode='w-',zarr_format=3)
            root.attrs.update(dict(schemaVersion=1,kind='indexed-trace-collection',source=source,traceCount=traces,
                                   sampleCount=total,sourceDomain='time-unconfirmed',axisUnit='s',analytical=True,
                                   displayOnly=False,complete=False,nextTrace=0))
            for name,dtype,size in [('samples','float64',total),('valid','bool',total)]:
                root.create_array(name,shape=(size,),dtype=dtype,chunks=(65536,),shards=(1048576,),
                                  fill_value=np.nan if name=='samples' else False,compressors=[ZstdCodec(level=3)])
            for name,dtype,size in [('offsets','uint64',traces+1),('intervals','float64',traces),('origins','float64',traces)]:
                root.create_array(name,shape=(size,),dtype=dtype,chunks=(4096,),shards=(32768,),compressors=[ZstdCodec(level=3)])
        if root.attrs.get('complete'):
            return dict(root.attrs)
        first=root.attrs['nextTrace']
        need(type(first) is int and 0<=first<=traces,'The analytical checkpoint has an invalid trace boundary.')
        while first<traces:
            need(not cancelled(),'Analytical indexing cancelled at its last committed trace batch.')
            rows=[];sample_budget=0
            for row in db.execute('SELECT id,byteOffset,sampleCount,interval,origin FROM traces WHERE id>=? ORDER BY id LIMIT 512',(first,)):
                rows.append(row);sample_budget+=row[2]
                if sample_budget>=batch_samples:break
            need(rows and all(row[0]==first+i for i,row in enumerate(rows)),'The retained trace index has a missing identity.')
            start=int(root['offsets'][first]);values=[];offsets=[start]
            for _,offset,ns,_,_ in rows:
                width=SAMPLE_BYTES[source['layout']['format']]
                data=decode_array(_read(stream,offset+240,ns*width),source['layout']['format'],source['endian'])
                values.append(data);offsets.append(offsets[-1]+ns)
            array=np.concatenate(values)
            write_batch(root,start,first,array,offsets,rows)
            first+=len(rows)
            progress(dict(traces=first,totalTraces=traces,samples=offsets[-1],totalSamples=total))
        need(int(root['offsets'][traces])==total,'The analytical sample offsets do not cover the retained source.')
        root.attrs['complete']=True
        return dict(root.attrs)


def trace_samples(root, source_version, trace_ids, *, first_sample=0,sample_count=1000):
    ids=list(trace_ids)
    need(root.attrs.get('complete') is True,'Wait for the complete analytical trace collection.')
    need(root.attrs['source']['sourceVersion']==source_version,'The analytical collection does not match this source version.')
    need(0<len(ids)<=512 and all(type(i) is int and 0<=i<root.attrs['traceCount'] for i in ids),'Select bounded retained trace identities.')
    need(type(first_sample) is int and first_sample>=0 and type(sample_count) is int and 1<=sample_count<=4096 and len(ids)*sample_count<=2_000_000,'Choose a bounded sample range.')
    output=[]
    for identity in ids:
        start,end=map(int,root['offsets'][identity:identity+2]);ns=end-start
        count=max(0,min(sample_count,ns-first_sample))
        values=root['samples'][start+first_sample:start+first_sample+count] if count else np.empty(0)
        mask=root['valid'][start+first_sample:start+first_sample+count] if count else np.empty(0,dtype=bool)
        dt=float(root['intervals'][identity]);origin=float(root['origins'][identity])
        output.append(dict(traceId=identity,originalSampleCount=ns,firstSample=first_sample,sampleInterval=dt,
                           sampleStart=origin+first_sample*dt,samples=np.where(mask,values,None).tolist(),valid=mask.tolist()))
    return dict(traces=output,sourceVersion=source_version,sourceDomain=root.attrs['sourceDomain'],axisUnit='s',analytical=True,displayOnly=False)
