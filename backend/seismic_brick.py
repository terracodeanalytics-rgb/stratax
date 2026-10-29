"""Bounded 3D poststack bins, with explicit missing support and no inferred stacking."""
import gzip
import hashlib
import io
import json
import re

from pydantic import BaseModel,ConfigDict,Field,model_validator
from seismic_reader import need
from seismic_indexed_reader import read_traces


class BinAxis(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    start:int=Field(ge=-2147483648,le=2147483647)
    step:int=Field(ge=1,le=1000000)
    count:int=Field(ge=2,le=64)


class BrickRequest(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    geometryRevision:int=Field(ge=1)
    inline:BinAxis
    crossline:BinAxis
    firstSample:int=Field(ge=0,le=65535)
    sampleCount:int=Field(ge=2,le=1024)

    @model_validator(mode='after')
    def bounded(self):
        if self.inline.count*self.crossline.count>512 or self.inline.count*self.crossline.count*self.sampleCount>500000:
            raise ValueError('Choose at most 512 bins and 500,000 samples per 3D brick.')
        return self


def read_brick(stream,size,manifest,load_chunk,source_version,review,request):
    metadata=manifest.get('metadata',{});index=metadata.get('traceIndex',{})
    need(index.get('sourceVersion')==source_version and index.get('sourceBytes')==size,'The bounded bin index belongs to another source version or byte support.')
    need(index.get('spatialBounds') is True,'Reinspect this original to build the bounded bin index before requesting a 3D brick.')
    need(review.get('dimension')==3 and review.get('dataKind')=='poststack','A seismic volume requires reviewed 3D poststack bin roles. Unstacked observations are not silently stacked.')
    for key in ('inline','crossline'):
        role=review.get('roles',{}).get(key,{})
        need(role.get('byte')==metadata.get('headerBytes',{}).get(key) and role.get('width')==4 and role.get('signed') is True,'Reindex this source with the reviewed signed 4-byte inline/crossline roles; existing header labels were not substituted.')
    ilines=[request.inline.start+i*request.inline.step for i in range(request.inline.count)]
    xlines=[request.crossline.start+i*request.crossline.step for i in range(request.crossline.count)]
    chosen={};cache={};expanded_bytes=0;first=0
    for chunk in manifest.get('chunks',[]):
        count=chunk.get('rows');bounds=chunk.get('indexedHeaderBounds',{});name=chunk.get('name','')
        need(type(count) is int and count>0 and re.fullmatch(r'dataset-[a-f0-9]{20}-[0-9]{6,}\.ndjson\.gz',name),'The bin index has invalid chunk support.')
        pairs=[bounds.get(key) for key in ('inline','crossline')]
        need(all(isinstance(p,list) and len(p)==2 and all(type(v) is int for v in p) and p[0]<=p[1] for p in pairs),'The source has no complete bounded bin index.')
        intersects=all(p[0]<=axis[-1] and p[1]>=axis[0] for p,axis in zip(pairs,[ilines,xlines]))
        if intersects:
            encoded=load_chunk(name)
            need(len(encoded)<=5*1024**2 and hashlib.sha256(encoded).hexdigest()==chunk.get('sha256'),'An indexed bin chunk changed checksum or exceeded its budget.')
            with gzip.GzipFile(fileobj=io.BytesIO(encoded)) as compressed:expanded=compressed.read(5*1024**2+1)
            expanded_bytes+=len(expanded)
            need(len(expanded)<=5*1024**2 and expanded_bytes<=32*1024**2,'This bin selection exceeds bounded index access. Select a smaller area or build a partitioned survey index.')
            cache[name]=encoded;rows=expanded.splitlines();need(len(rows)==count,'An indexed bin chunk changed row count.')
            for position,line in enumerate(rows):
                row=json.loads(line)
                need(isinstance(row,list) and len(row)==9 and isinstance(row[8],dict) and isinstance(row[8].get('geometry'),dict),'The bin index contains an invalid trace locator.')
                locator=row[8];g=locator['geometry'];key=(g.get('inline'),g.get('crossline'))
                need(locator['trace']==first+position,'The bin index changed retained trace identity.')
                if key[0] in ilines and key[1] in xlines:
                    need(key not in chosen,'Duplicate traces occupy a requested poststack bin. Review/resolve duplicates explicitly; no stack was inferred.')
                    chosen[key]=locator['trace']
        first+=count
    need(first==manifest.get('rowCount'),'The bin index has missing trace support.')
    need(len({p[0] for p in chosen})>=2 and len({p[1] for p in chosen})>=2,'This selection does not contain observed samples on at least two inlines and crosslines.')
    selected=read_traces(stream,size,manifest,lambda name:cache[name] if name in cache else load_chunk(name),source_version,chosen.values(),first_sample=request.firstSample,sample_count=request.sampleCount,endian=metadata.get('endian','big'))
    traces=selected['traces'];dt=traces[0]['sampleInterval'];start=traces[0]['sampleStart']
    need(all(abs(t['sampleInterval']-dt)<=1e-12 and abs(t['sampleStart']-start)<=1e-12 for t in traces),'The selected bins have different sampling/origins. Review an alignment operation before constructing this brick.')
    ni,nj,nk=request.inline.count,request.crossline.count,request.sampleCount
    samples=[None]*(ni*nj*nk);trace_ids=[None]*(ni*nj)
    for trace in traces:
        g=trace['geometry'];i=ilines.index(g['inline']);j=xlines.index(g['crossline']);trace_ids[j*ni+i]=trace['traceId']
        for s,value in enumerate(trace['samples']):samples[(s*nj+j)*ni+i]=value
    need(any(v is not None for v in samples),'The selected sample interval has no observed amplitude support.')
    return dict(kind='seismic-brick',shape=[ni,nj,nk],order='inline-fastest-crossline-sample',samples=samples,
                valid=[v is not None for v in samples],traceIds=trace_ids,inlines=ilines,crosslines=xlines,
                firstSample=request.firstSample,sampleStart=start,sampleInterval=dt,axisUnit='s',sourceDomain=review.get('timeConvention','unconfirmed'),
                geometryRevision=request.geometryRevision,sourceVersion=source_version,analytical=True,displayOnly=False,
                spatialCoordinates='inline/crossline bin identities; no physical-coordinate transform',geometryQualifiedForProcessing=False,
                warnings=['Missing bins/samples remain null; duplicate bins require explicit resolution.','This bounded bin-coordinate view does not qualify full survey geometry or field-scale capacity.'])
