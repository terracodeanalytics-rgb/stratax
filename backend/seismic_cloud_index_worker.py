"""Resumable lossless analytical partitions published into private Cloud Storage."""
import hashlib
import json
import tempfile
from pathlib import Path

import numpy as np

from seismic_processing import require
from seismic_source_io import indexed_source
from seismic_artifact_ranges import range_checksums
from seismic_field_artifacts import geometry_bounds


class _ShardWriter:
    """Append once per shard instead of recompressing it once per input trace."""
    def __init__(self,array,maximum=1048576):
        self.array=array
        self.buffer=np.empty(min(maximum,array.shape[0]),dtype=array.dtype)
        self.filled=self.written=0

    def append(self,values):
        first=0
        while first<len(values):
            count=min(len(values)-first,len(self.buffer)-self.filled)
            self.buffer[self.filled:self.filled+count]=values[first:first+count]
            self.filled+=count;first+=count
            if self.filled==len(self.buffer):self.flush()

    def flush(self):
        if self.filled:
            self.array[self.written:self.written+self.filled]=self.buffer[:self.filled]
            self.written+=self.filled;self.filled=0


def build_cloud_index(client, binding, parameters, put, *, cancelled=lambda:False,
                      checkpoint=lambda value:None, resumed=None, progress=lambda value:None):
    import zarr
    from zarr.codecs import ZstdCodec
    from seismic_indexed_reader import select_locators
    from seismic_reader import _read
    from seismic_trace_store import decode_array
    from seismic_trace_index import SAMPLE_BYTES

    identity=binding['identity'];manifest,load=indexed_source(client,identity)
    index=manifest['metadata']['traceIndex'];total=manifest['rowCount']
    first=parameters.get('firstTrace',0);count=parameters.get('traceCount',total-first)
    width=parameters.get('tracesPerPartition',64);levels=parameters.get('displayLevels',4)
    require(type(first) is int and type(count) is int and 0<=first<total and count>0 and first+count<=total,
            'Choose a retained trace range for analytical indexing.')
    require(type(width) is int and 1<=width<=512 and type(levels) is int and 0<=levels<=12,
            'Use 1–512 traces per partition and 0–12 display levels.')
    state=dict(sourceVersion=binding['sourceVersion'],firstTrace=first,traceCount=count,
               tracesPerPartition=width,displayLevels=levels,partitions=[],nextTrace=first)
    if resumed is not None:
        require(all(resumed.get(key)==state[key] for key in ('sourceVersion','firstTrace','traceCount','tracesPerPartition','displayLevels')),
                'The index checkpoint belongs to different source/settings.')
        require(type(resumed.get('nextTrace')) is int and first<=resumed['nextTrace']<=first+count,
                'Invalid index checkpoint boundary.')
        state=resumed
    source=client.bucket(identity['bucket']).blob(identity['object'],generation=identity['generation'])
    with source.open('rb',chunk_size=256*1024) as stream:
        for start in range(state['nextTrace'],first+count,width):
            require(not cancelled(),'Analytical indexing cancelled between partitions.')
            ids=list(range(start,min(first+count,start+width)))
            locators=select_locators(manifest,load,index['sourceVersion'],ids)
            offsets=np.r_[0,np.cumsum([r['sampleCount'] for r in locators],dtype=np.int64)]
            fmt=index['layout']['format'];endian=identity['endian']
            objects=[]
            with tempfile.TemporaryDirectory() as directory:
                root=zarr.open_group(directory,mode='w',zarr_format=3)
                root.attrs.update(kind='stratax-ragged-analytical-partition/1',sourceVersion=binding['sourceVersion'],
                    firstTrace=start,traceCount=len(ids),analytical=True,complete=False,axisUnit='s',
                    timeConvention='unconfirmed',displayLevels=levels)
                root.create_array('samples',shape=(int(offsets[-1]),),dtype='float64',chunks=(65536,),shards=(1048576,),
                                  fill_value=np.nan,compressors=[ZstdCodec(level=3)])
                root.create_array('valid',shape=(int(offsets[-1]),),dtype='bool',chunks=(65536,),shards=(1048576,),
                                  fill_value=False,compressors=[ZstdCodec(level=3)])
                root.create_array('offsets',data=offsets)
                root.create_array('intervals',data=np.asarray([r['sampleInterval'] for r in locators],float))
                root.create_array('origins',data=np.asarray([r['sampleStart'] for r in locators],float))
                display_offsets={}
                for level in range(1,levels+1):
                    factor=2**level;boundary=np.r_[0,np.cumsum([(r['sampleCount']+factor-1)//factor for r in locators])]
                    display_offsets[level]=boundary
                    root.create_array(f'display/{level}/offsets',data=boundary)
                    root.create_array(f'display/{level}/samples',shape=(int(boundary[-1]),),dtype='float32',
                                      chunks=(65536,),shards=(1048576,),fill_value=np.nan,compressors=[ZstdCodec(level=3)])
                    root[f'display/{level}/samples'].attrs.update(displayOnly=True,analytical=False,
                        sampleDecimation=factor,aggregation='finite-block-mean')
                analytical_writer=_ShardWriter(root['samples']);valid_writer=_ShardWriter(root['valid'])
                display_writers={level:_ShardWriter(root[f'display/{level}/samples']) for level in display_offsets}
                for position,locator in enumerate(locators):
                    require(not cancelled(),'Analytical indexing cancelled during a partition.')
                    ns=locator['sampleCount'];offset=locator['byteOffset']
                    require(offset+240+ns*SAMPLE_BYTES[fmt]<=identity['size'],'Trace leaves immutable source bounds.')
                    raw=_read(stream,offset+240,ns*SAMPLE_BYTES[fmt]);values=decode_array(raw,fmt,endian)
                    a,b=int(offsets[position]),int(offsets[position+1])
                    analytical_writer.append(values);valid_writer.append(np.isfinite(values))
                    for level,boundary in display_offsets.items():
                        factor=2**level;n=(ns+factor-1)//factor;padded=np.full(n*factor,np.nan)
                        padded[:ns]=values;blocks=padded.reshape(n,factor);support=np.isfinite(blocks)
                        valid=support.sum(axis=1)
                        means=np.divide(np.where(support,blocks,0).sum(axis=1),valid,out=np.full(n,np.nan),where=valid>0)
                        display_writers[level].append(means)
                for writer in (analytical_writer,valid_writer,*display_writers.values()):writer.flush()
                root.attrs['complete']=True
                Path(directory,'headers.json').write_text(json.dumps(locators,allow_nan=False),encoding='utf-8')
                for file in sorted(Path(directory).rglob('*')):
                    if file.is_file():
                        require(not cancelled(),'Analytical indexing cancelled during publication.')
                        name=file.relative_to(directory).as_posix()
                        raw=file.read_bytes()
                        reference=put(f'analytical/{start}/{name}',raw)
                        objects.append(reference if reference.get('ranges') else reference|dict(ranges=range_checksums(raw)))
            part=put(f'analytical/{start}/partition.json',json.dumps(dict(firstTrace=start,traceCount=len(ids),
                sampleCount=int(offsets[-1]),objects=objects,headerBounds=geometry_bounds(locators),
                geometryReviewed=False),allow_nan=False).encode())
            state['partitions'].append(part);state['nextTrace']=start+len(ids)
            checkpoint(dict(state,completedPartitions=len(state['partitions'])))
            progress(dict(completedTraces=state['nextTrace']-first,totalTraces=count))
    return dict(kind='stratax-cloud-analytical-index/1',sourceId=binding['datasetId'],
                sourceVersion=binding['sourceVersion'],firstTrace=first,traceCount=count,
                partitions=state['partitions'],tracesPerPartition=width,zarrFormat=3,sharded=True,lossless=True,
                displayLevels=levels,complete=True,geometryInferred=False)
