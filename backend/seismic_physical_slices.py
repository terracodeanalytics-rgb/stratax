"""Physical-axis bounded sections; missing support never becomes invented amplitudes."""
import numpy as np

from seismic_processing import require
from seismic_slices import extract_inline,extract_crossline,extract_time_slice,extract_arbitrary_section,linked_triad
from seismic_resources import DomainFrame,CoordinateFrame


def line_view(view):
    rows=view['traces']
    require(rows and sum(len(row['samples']) for row in rows)<=2_000_000, 'Choose a bounded retained line section.')
    require(len({row['traceId'] for row in rows})==len(rows), 'Line traces must have distinct source identities.')
    return dict(kind='line-section',traces=rows,sourceVersion=view['sourceVersion'],
        axisUnit=view['axisUnit'],sampleDomain=view.get('domain','unconfirmed'),
        ragged=len({(row['sampleInterval'],row['sampleStart'],len(row['samples'])) for row in rows})>1,
        analytical=True,displayOnly=False,interpolation='none')


def _physical_path(view,body):
    from scipy.spatial import Delaunay,QhullError,cKDTree
    from seismic_crs import transform_xy
    path=np.asarray(body['path'],float)
    require(path.ndim==2 and path.shape[1]==2 and 2<=len(path)<=512 and np.all(np.isfinite(path)),
            'Provide a bounded physical XY polyline.')
    require(len(path)*view['volume'].shape[2]<=2_000_000, 'The requested path exceeds the output sample budget.')
    frame=CoordinateFrame(**body['pathFrame']).model_dump()
    target=view['coordinateFrame']
    path=np.asarray(transform_xy(path,frame,target,engine='pyproj'),float)
    maximum=body['maximumInterpolationDistanceMetres']
    require(type(maximum) in (int,float) and np.isfinite(maximum) and maximum>0,
            'Declare a positive physical interpolation support distance in metres.')
    method=body['interpolation']
    require(method in ('linear','nearest'), 'Choose explicit linear or nearest physical interpolation.')
    coordinates=np.asarray(view['coordinates'],float)
    valid=np.all(np.isfinite(coordinates),axis=-1)
    nodes=np.argwhere(valid);xy=coordinates[valid]
    require(len(xy)>0 and len(np.unique(xy,axis=0))==len(xy), 'Resolve coincident physical bin coordinates first.')
    mapped=np.full((len(path),2),np.nan)
    samples=np.full((len(path),view['volume'].shape[2]),np.nan)
    support=np.zeros_like(samples,dtype=bool)
    support_nodes=[]
    def blend(index,ids,weights):
        selected=nodes[ids]
        values=view['volume'][selected[:,0],selected[:,1]]
        masks=view['mask'][selected[:,0],selected[:,1]]
        relevant=np.asarray(weights)>1e-12
        good=np.all(masks[relevant],axis=0) & np.all(np.isfinite(values[relevant]),axis=0)
        combined=np.asarray(weights)@np.where(masks & np.isfinite(values),values,0)
        samples[index]=np.where(good,combined,np.nan);support[index]=good
        mapped[index]=np.asarray(weights)@selected
        support_nodes.append(dict(pathIndex=index,bins=selected.tolist(),weights=np.asarray(weights).tolist()))
    if method=='nearest':
        distance,indices=cKDTree(xy).query(path)
        good=distance<=maximum
        for index in np.flatnonzero(good):blend(index,[indices[index]],[1.])
    elif view.get('geometryDimension')!=2 and min(view['volume'].shape[:2])>1 and len(xy)>=3 and np.linalg.matrix_rank(xy-xy.mean(axis=0))==2:
        try:triangulation=Delaunay(xy)
        except QhullError as error:raise ValueError('Physical bin geometry cannot support a 2D interpolation mesh.') from error
        simplexes=triangulation.find_simplex(path)
        for index,simplex in enumerate(simplexes):
            if simplex<0:continue
            ids=triangulation.simplices[simplex];vertices=xy[ids]
            if np.max(np.linalg.norm(vertices[:,None,:]-vertices[None,:,:],axis=-1))>maximum:continue
            matrix=triangulation.transform[simplex]
            barycentric=matrix[:2]@(path[index]-matrix[2])
            weights=np.r_[barycentric,1-barycentric.sum()]
            if np.any(weights < -1e-10):continue
            weights=np.maximum(weights,0);weights/=weights.sum()
            blend(index,ids,weights)
    else:
        require(min(view['volume'].shape[:2])==1 and len(xy)>=2,
                'Linear interpolation requires a supported plane or an explicit single-bin-axis line.')
        # A 2D seismic line uses its actual ordered segment coordinates, not an invented plane.
        order=np.lexsort((nodes[:,1],nodes[:,0]));xy=xy[order];nodes=nodes[order]
        for index,point in enumerate(path):
            best=None
            for segment,(a,b) in enumerate(zip(xy[:-1],xy[1:])):
                vector=b-a;length=np.linalg.norm(vector)
                if not 0<length<=maximum:continue
                fraction=np.dot(point-a,vector)/length**2
                if not 0<=fraction<=1:continue
                distance=np.linalg.norm(point-(a+fraction*vector))
                if distance<=maximum and (best is None or distance<best[0]):best=(distance,segment,fraction)
            if best is not None:blend(index,[best[1],best[1]+1],[1-best[2],best[2]])
    result=dict(samples=samples,mask=support,path=mapped,interpolationSupport=support_nodes)
    result.update(physicalPath=path,coordinateFrame=target,interpolation=method,
                  maximumInterpolationDistanceMetres=maximum,axes=[np.arange(len(path)),view['axes'][2]])
    return result


def indexed_view(view,body):
    if 'traces' in view:return line_view(view)
    volume=np.asarray(view['volume'],float);mask=np.asarray(view['mask'],bool)
    require(volume.ndim==3 and volume.shape==mask.shape and volume.size<=2_000_000,
            'Provide a bounded analytical volume and matching validity mask.')
    view=dict(view,volume=volume,mask=mask & np.isfinite(volume))
    kind=body['viewKind']
    def index(key,axis):
        value=body[key]
        require(type(value) is int and 0<=value<volume.shape[axis], 'The requested view index leaves the retained selection.')
        return value
    if kind=='inline':
        at=index('index',0);result=extract_inline(volume,at,mask=mask)
        result.update(axes=[view['axes'][1],view['axes'][2]],coordinates=view['coordinates'][at],traceIds=view['traceIds'][at])
        result['fixedCoordinate']=float(view['axes'][0][at])
    elif kind=='crossline':
        at=index('index',1);result=extract_crossline(volume,at,mask=mask)
        result.update(axes=[view['axes'][0],view['axes'][2]],coordinates=view['coordinates'][:,at],traceIds=view['traceIds'][:,at])
        result['fixedCoordinate']=float(view['axes'][1][at])
    elif kind in ('time','depth'):
        require((kind=='depth')==(view['sampleDomain']=='depth'), 'Choose a time/depth slice matching the declared analytical domain.')
        at=index('index',2);result=extract_time_slice(volume,at,mask=mask)
        result.update(axes=view['axes'][:2],coordinates=view['coordinates'],traceIds=view['traceIds'],sampleCoordinate=view['axes'][2][at])
    elif kind=='arbitrary':
        result=_physical_path(view,body)
    elif kind=='linked':
        i,j,k=index('inline',0),index('crossline',1),index('sample',2)
        result=linked_triad(volume,i,j,k,mask=mask)
        result.update(axes=view['axes'],coordinates=view['coordinates'],traceIds=view['traceIds'])
        result['limitations']=[]
    else:raise ValueError('Choose inline, crossline, time, depth, arbitrary or linked.')
    return result|dict(sampleDomain=view['sampleDomain'],sampleUnit=view['sampleUnit'],coordinateFrame=view['coordinateFrame'],
        referenceDatum=view.get('referenceDatum'),sourceAxes=dict(first=view['axes'][0],second=view['axes'][1],sample=view['axes'][2]),
        sourceVersion=view.get('sourceVersion'),geometryRevision=view.get('geometryRevision'),analytical=True,displayOnly=False)


def physical_view(body):
    volume=np.asarray(body['volume'],float)
    require(volume.ndim==3 and min(volume.shape)>0 and volume.size<=2_000_000,
            'Provide a bounded genuine 3D analytical volume.')
    axes=[np.asarray(axis,float) for axis in body['axes']]
    require(len(axes)==3 and all(axis.ndim==1 and len(axis)==size and np.all(np.isfinite(axis))
            and (len(axis)==1 or np.all(np.diff(axis)>0) or np.all(np.diff(axis)<0)) for axis,size in zip(axes,volume.shape)),
            'Provide explicit monotonic physical axes matching each volume dimension.')
    sample=DomainFrame(**body['sampleFrame']).model_dump()
    frame=CoordinateFrame(**body['coordinateFrame']).model_dump()
    require(sample['confirmed'] and sample['unit'] in ('s','m') and frame['confirmed'] and frame['unit']=='m'
            and frame['axisOrder']=='easting-northing', 'Confirm SI sample and projected spatial frames.')
    require(sample['start'] is not None and np.isclose(axes[2][0],sample['start'],rtol=0,atol=1e-10)
            and (len(axes[2])==1 or np.allclose(np.diff(axes[2]),sample['interval'],rtol=1e-10,atol=1e-12)),
            'Sample coordinates differ from the reviewed origin/positive interval.')
    require(isinstance(body.get('referenceDatum'),str) and body['referenceDatum'].strip().lower()
            not in ('','unknown','none','unconfirmed'), 'Declare the sample reference datum.')
    xy=np.stack(np.meshgrid(axes[0],axes[1],indexing='ij'),axis=-1)
    mask=np.asarray(body.get('mask',np.isfinite(volume)),bool)
    return indexed_view(dict(volume=volume,mask=mask,axes=axes,coordinates=xy,
        traceIds=np.full(volume.shape[:2],-1,dtype=np.int64),coordinateFrame=frame,
        sampleDomain=sample['domain'],sampleUnit=sample['unit'],sourceVersion=body.get('sourceVersion')),
        body)|dict(referenceDatum=body['referenceDatum'])
