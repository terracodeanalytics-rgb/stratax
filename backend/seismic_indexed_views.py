"""Bounded 2D trace/3D bin selections from field indexes, never inferred stacks."""
import json

import numpy as np
from pydantic import BaseModel, ConfigDict, Field, model_validator

from seismic_processing import require
from seismic_artifact_ranges import ArtifactReader
from seismic_cloud_index_reader import read_cloud_traces
from seismic_native_directory import query_headers, directory_loader
from seismic_source_io import checked_json


class ViewAxis(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    start:int=Field(ge=-2147483648,le=2147483647)
    step:int=Field(ge=1,le=1000000)
    count:int=Field(ge=1,le=512)


class IndexedVolume(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    geometryRevision:int=Field(ge=1)
    inline:ViewAxis
    crossline:ViewAxis
    firstSample:int=Field(ge=0,le=65535)
    sampleCount:int=Field(ge=1,le=4096)
    traceIds:list[int] | None=None
    targetFrame:dict

    @model_validator(mode='after')
    def budget(self):
        require(self.inline.count*self.crossline.count<=512
                and self.inline.count*self.crossline.count*self.sampleCount<=2_000_000,
                'Select at most 512 bins and two million analytical samples.')
        require(self.traceIds is None or 0<len(self.traceIds)<=512 and len(set(self.traceIds))==len(self.traceIds),
                'Explicit duplicate resolution requires distinct retained trace identities.')
        return self


class IndexedTraces(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    traceIds:list[int]=Field(min_length=1,max_length=512)
    firstSample:int=Field(ge=0,le=65535)
    sampleCount:int=Field(ge=1,le=4096)
    geometryRevision:int | None=Field(default=None,ge=1)
    targetFrame:dict | None=None

    @model_validator(mode='after')
    def budget(self):
        require(len(set(self.traceIds))==len(self.traceIds) and min(self.traceIds)>=0
                and len(self.traceIds)*self.sampleCount<=2_000_000, 'Choose distinct, bounded trace identities.')
        require((self.geometryRevision is None)==(self.targetFrame is None), 'Physical line views require both geometry revision and target frame.')
        return self


def index_result(client,binding):
    reader=ArtifactReader(client,binding['bucket'],binding['scope'])
    artifact=binding['artifact']
    require(artifact.get('format')=='json', 'This view requires a completed field analytical index.')
    result=json.loads(reader.read(artifact))
    require(result.get('kind')=='stratax-cloud-analytical-index/2' and result.get('complete') is True,
            'Select a completed field analytical index.')
    native=result['nativeIndex']
    require(native['bucket']==binding['bucket'] and native['object'].startswith(binding['scope']),
            'The native locator directory leaves its admitted project.')
    return result,reader


def indexed_traces(client,binding,cancelled=lambda:False):
    request=IndexedTraces(**binding['selection'])
    result,reader=index_result(client,binding)
    reader.cancelled=cancelled
    rows=read_cloud_traces(client,binding['bucket'],result,binding['scope'],request.traceIds,
        request.firstSample,request.sampleCount,reader=reader)
    if request.geometryRevision is not None:
        from seismic_crs import transform_xy
        from seismic_resources import CoordinateFrame
        review=binding['geometry']
        require(review['dimension']==2 and review['dataKind']=='poststack' and review['reviewed']
                and review['sourceVersion']==result['sourceVersion'], 'A physical line requires matching reviewed2D poststack geometry.')
        native=checked_json(client,result['nativeIndex']);mapping=native['metadata']['headerBytes']
        for role,key,width in [('midpointX','x',4),('midpointY','y',4),('coordinateScalar','coordinateScalar',2)]:
            field=review['roles'].get(role,{})
            require(field.get('byte')==mapping.get(key) and field.get('width')==width and field.get('signed') is True,
                    'Reindex with the reviewed signed coordinate fields before physical line sampling.')
        source=dict(crs=review['crs'],datum=review['datum'],axisOrder=review['axisOrder'],unit=review['coordinateUnit'],confirmed=True)
        target=CoordinateFrame(**request.targetFrame).model_dump()
        require(target['confirmed'] and target['unit']=='m' and target['axisOrder']=='easting-northing',
                'Choose a confirmed projected metre frame.')
        expected=3 if review['coordinateUnit']=='degrees' else 2 if review['coordinateUnit']=='arcseconds' else 1
        require(all(row['geometry'].get('coordinateUnitsCode') in (0,expected) for row in rows), 'Source coordinate-unit codes conflict with the review.')
        xy=np.asarray(transform_xy([[row['geometry']['x'],row['geometry']['y']] for row in rows],source,target,engine='pyproj'))
        dt,start=rows[0]['sampleInterval'],rows[0]['sampleStart']
        require(all(abs(row['sampleInterval']-dt)<=1e-12 and abs(row['sampleStart']-start)<=1e-12 for row in rows),
                'Physical line sampling requires an explicit alignment of incompatible recording axes.')
        volume=np.full((1,len(rows),request.sampleCount),np.nan)
        for index,row in enumerate(rows):volume[0,index,:len(row['samples'])]=np.asarray(row['samples'],float)
        return dict(volume=volume,mask=np.isfinite(volume),coordinates=xy[None,:,:],
            traceIds=np.asarray([request.traceIds],dtype=np.int64),axes=[np.asarray([0]),np.asarray(request.traceIds),
                start+np.arange(request.sampleCount)*dt],coordinateFrame=target,sampleDomain=review['timeConvention'],sampleUnit='s',
            referenceDatum=review['datum'],sourceVersion=result['sourceVersion'],geometryRevision=request.geometryRevision,
            geometryDimension=2,axisKinds=['line-singleton','trace-identity','sample'],analytical=True,displayOnly=False)
    return dict(traces=rows,sourceVersion=result['sourceVersion'],axisUnit='s',
                domain='unconfirmed',analytical=True,displayOnly=False,downloadedBytes=reader.downloaded)


def indexed_volume(client,binding,cancelled=lambda:False):
    from seismic_crs import transform_xy
    from seismic_resources import CoordinateFrame
    request=IndexedVolume(**binding['selection'])
    result,reader=index_result(client,binding)
    reader.cancelled=cancelled
    review=binding['geometry']
    require(review.get('sourceVersion')==result['sourceVersion'], 'The reviewed geometry belongs to another indexed source version.')
    require(review['dimension']==3 and review['dataKind']=='poststack' and review['reviewed'] is True,
            'A volume needs reviewed 3D poststack roles; gathers are not silently stacked.')
    native=checked_json(client,result['nativeIndex'])
    header_map=native['metadata'].get('headerBytes')
    require(header_map is not None, 'Native coordinate/header mapping is missing from this index.')
    for role,key,width in [('inline','inline',4),('crossline','crossline',4),('midpointX','x',4),
                           ('midpointY','y',4),('coordinateScalar','coordinateScalar',2)]:
        field=review['roles'].get(role,{})
        require(field.get('byte')==header_map.get(key) and field.get('width')==width and field.get('signed') is True,
                'Reindex with the reviewed header mapping before constructing physical volumes.')
    source_frame=dict(crs=review['crs'],datum=review['datum'],axisOrder=review['axisOrder'],
                      unit=review['coordinateUnit'],confirmed=True)
    target=CoordinateFrame(**request.targetFrame).model_dump()
    require(target['confirmed'] and target['unit']=='m' and target['axisOrder']=='easting-northing',
            'Choose an explicit projected metre coordinate frame for physical views.')
    ilines=[request.inline.start+i*request.inline.step for i in range(request.inline.count)]
    xlines=[request.crossline.start+i*request.crossline.step for i in range(request.crossline.count)]
    pairs={(i,j) for i in ilines for j in xlines}
    if request.traceIds:
        loader=directory_loader(client,result['nativeIndex'],native)
        headers=loader.trace_locators(request.traceIds)
        require(all((r['geometry']['inline'],r['geometry']['crossline']) in pairs for r in headers),
                'An explicit trace selection leaves the requested bins.')
    else:
        headers=[];after=0
        while True:
            value=query_headers(client,result['nativeIndex'],{},after_trace=after,limit=512,
                bin_pairs=[list(pair) for pair in sorted(pairs)],reader=reader)
            headers.extend(value['rows'])
            require(len(headers)<=len(pairs), 'Duplicate poststack bins require explicit trace selection; no stack was inferred.')
            if value['nextTrace'] is None:break
            after=value['nextTrace']
    chosen={}
    for row in headers:
        key=(row['geometry']['inline'],row['geometry']['crossline'])
        require(key not in chosen, 'Duplicate bin selection is unresolved.')
        chosen[key]=row['trace']
    require(chosen, 'No retained traces support the selected bins.')
    expected_code=3 if review['coordinateUnit']=='degrees' else 2 if review['coordinateUnit']=='arcseconds' else 1
    require(all(row['geometry'].get('coordinateUnitsCode') in (0,expected_code) for row in headers),
            'The native coordinate-unit codes conflict with the reviewed declaration.')
    rows=read_cloud_traces(client,binding['bucket'],result,binding['scope'],list(chosen.values()),
                          request.firstSample,request.sampleCount,reader=reader)
    dt,start=rows[0]['sampleInterval'],rows[0]['sampleStart']
    require(all(abs(row['sampleInterval']-dt)<=1e-12 and abs(row['sampleStart']-start)<=1e-12 for row in rows),
            'Variable sample origins/intervals require an explicit alignment operation before a volume view.')
    shape=(len(ilines),len(xlines),request.sampleCount)
    volume=np.full(shape,np.nan);mask=np.zeros(shape,bool)
    coordinates=np.full(shape[:2]+(2,),np.nan);trace_ids=np.full(shape[:2],-1,dtype=np.int64)
    xy=transform_xy([[row['geometry']['x'],row['geometry']['y']] for row in rows],source_frame,target,engine='pyproj')
    for position,row in enumerate(rows):
        i=ilines.index(row['geometry']['inline']);j=xlines.index(row['geometry']['crossline'])
        values=np.asarray(row['samples'],float)
        volume[i,j,:len(values)]=values;mask[i,j,:len(values)]=np.isfinite(values)
        coordinates[i,j]=xy[position];trace_ids[i,j]=row['traceId']
    return dict(volume=volume,mask=mask,coordinates=coordinates,traceIds=trace_ids,
        axes=[np.asarray(ilines),np.asarray(xlines),start+np.arange(request.sampleCount)*dt],
        coordinateFrame=target,sampleDomain=review['timeConvention'],sampleUnit='s',
        referenceDatum=review['datum'],
        sampleInterval=dt,sampleStart=start,geometryRevision=request.geometryRevision,
        sourceVersion=result['sourceVersion'],analytical=True,displayOnly=False,downloadedBytes=reader.downloaded)
