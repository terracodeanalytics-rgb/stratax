"""Physical-coordinate horizon meshes and source-coordinate flattening."""
import numpy as np
from seismic_processing import require


def horizon_mesh(surface,xy,blocks,*,domain,unit):
    surface=np.asarray(surface,float);xy=np.asarray(xy,float);blocks=np.asarray(blocks)
    require(surface.ndim==2 and surface.size<=250000 and xy.shape==surface.shape+(2,) and blocks.shape==surface.shape,
            'Provide matching horizon values, physical XY coordinates and reviewed fault-block labels.')
    require((domain,unit) in (('TWT','s'),('depth','m')),'Declare TWT seconds or depth metres for the mesh vertical axis.')
    valid=np.isfinite(surface)&np.isfinite(xy).all(axis=-1)
    indices=np.full(surface.shape,-1,int);indices[valid]=np.arange(valid.sum())
    vertices=np.column_stack((xy[valid],surface[valid]));faces=[]
    for i in range(surface.shape[0]-1):
        for j in range(surface.shape[1]-1):
            for nodes in (((i,j),(i+1,j),(i,j+1)),((i+1,j),(i+1,j+1),(i,j+1))):
                if all(valid[node] for node in nodes) and len({str(blocks[node]) for node in nodes})==1:
                    face=[indices[node] for node in nodes]
                    a=vertices[face[1],:2]-vertices[face[0],:2];b=vertices[face[2],:2]-vertices[face[0],:2]
                    area=a[0]*b[1]-a[1]*b[0]
                    if abs(area)>np.finfo(float).eps:faces.append(face)
    require(len(faces)>0,'No supported triangles exist inside reviewed fault blocks.')
    return dict(vertices=vertices,faces=np.asarray(faces,int),domain=domain,verticalUnit=unit,horizontalUnit='m',
                faultBlocksBridged=False)


def flatten_volume(volume,horizon,reference_sample):
    data=np.asarray(volume,float);horizon=np.asarray(horizon,float)
    require(data.ndim==3 and data.size<=2_000_000 and horizon.shape==data.shape[:2],
            'Horizon sample coordinates must match the source inline/crossline grid.')
    require(np.isfinite(reference_sample) and 0<=reference_sample<data.shape[-1],'Choose a retained reference sample.')
    output=np.full_like(data,np.nan);axis=np.arange(data.shape[-1])
    for position in np.ndindex(data.shape[:2]):
        if not np.isfinite(horizon[position]):continue
        query=axis+horizon[position]-reference_sample
        lower=np.floor(query).astype(int);valid=(query>=0)&(query<=len(axis)-1)
        lower=np.clip(lower,0,len(axis)-1);upper=np.minimum(lower+1,len(axis)-1);fraction=query-lower
        support=np.isfinite(data[position][lower])&((fraction==0)|np.isfinite(data[position][upper]))
        values=(1-fraction)*data[position][lower]+np.where(fraction==0,0,fraction*data[position][upper])
        output[position]=np.where(valid&support,values,np.nan)
    return dict(volume=output,valid=np.isfinite(output),referenceSample=reference_sample,
                horizonSamples=horizon,sourceCoordinatesPreserved=True,operation='explicit-horizon-flattening')


def mesh_export(vertices,faces,format):
    vertices,faces=np.asarray(vertices,float),np.asarray(faces)
    require(vertices.ndim==2 and vertices.shape[1]==3 and np.all(np.isfinite(vertices)), 'Provide finite XYZ or XY/TWT vertices.')
    require(faces.ndim==2 and faces.shape[1]==3 and np.issubdtype(faces.dtype,np.integer) and np.all((faces>=0)&(faces<len(vertices))),
            'Provide triangular faces with retained vertex indices.')
    if format=='obj':
        lines=['# StrataX reviewed interpretation mesh']
        lines.extend('v '+' '.join(format_value(v) for v in point) for point in vertices)
        lines.extend('f '+' '.join(str(int(v)+1) for v in face) for face in faces)
        return dict(text='\n'.join(lines)+'\n',format='obj',vertices=len(vertices),triangles=len(faces))
    if format=='json':return dict(vertices=vertices,faces=faces,format='indexed-triangle-mesh')
    raise ValueError('Choose obj or json for interpretation meshes.')


def format_value(value):return f'{value:.17g}'
