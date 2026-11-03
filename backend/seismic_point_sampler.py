"""Reusable bounded spatial stencils and paired sample queries, without section expansion."""
import numpy as np
from scipy.spatial import cKDTree,Delaunay,QhullError

from seismic_processing import require,finite_number


class PointSampler:
    def __init__(self,view,maximum_distance,method):
        self.volume=np.asarray(view['volume'],float)
        self.mask=np.asarray(view['mask'],bool)
        require(self.volume.ndim==3 and self.volume.shape==self.mask.shape and self.volume.size<=2_000_000,
                'Point sampling requires a bounded analytical volume with a matching validity mask.')
        coordinates=np.asarray(view['coordinates'],float)
        require(coordinates.shape==self.volume.shape[:2]+(2,), 'Physical coordinates must identify every retained bin.')
        valid=np.all(np.isfinite(coordinates),axis=-1)
        self.ids=np.flatnonzero(valid.ravel());self.xy=coordinates[valid]
        require(len(self.xy)>0 and len(np.unique(self.xy,axis=0))==len(self.xy),
                'Resolve missing or coincident physical source coordinates before sampling.')
        self.maximum=finite_number(maximum_distance,'interpolation distance',np.finfo(float).eps)
        require(method in ('nearest','linear'), 'Choose explicit nearest or linear interpolation.')
        self.method=method;self.tree=cKDTree(self.xy);self.triangulation=None
        self.line=view.get('geometryDimension')==2 or min(self.volume.shape[:2])==1
        if method=='linear' and not self.line:
            require(len(self.xy)>=3 and np.linalg.matrix_rank(self.xy-self.xy.mean(axis=0))==2,
                    'Linear volume sampling requires supported two-dimensional physical bin geometry.')
            try:self.triangulation=Delaunay(self.xy)
            except QhullError as error:raise ValueError('Physical geometry does not support a stable interpolation mesh.') from error
        if method=='linear' and self.line:require(len(self.xy)>=2,'A linear line stencil needs at least two observed positions.')

    def stencils(self,points):
        points=np.asarray(points,float)
        require(points.ndim==2 and points.shape[1]==2 and len(points)<=4096 and np.all(np.isfinite(points)),
                'Query finite physical positions in batches of at most4096.')
        ids=np.zeros((len(points),3),dtype=np.int64);weights=np.zeros((len(points),3))
        if self.method=='nearest':
            distance,index=self.tree.query(points);valid=distance<=self.maximum
            ids[valid,0]=self.ids[index[valid]];weights[valid,0]=1
        elif self.line:
            best=np.full(len(points),np.inf)
            for index,(a,b) in enumerate(zip(self.xy[:-1],self.xy[1:])):
                vector=b-a;length2=np.dot(vector,vector)
                if not 0<length2<=self.maximum**2:continue
                fraction=(points-a)@vector/length2
                distance=np.linalg.norm(points-a-fraction[:,None]*vector,axis=1)
                use=(fraction>=0)&(fraction<=1)&(distance<=self.maximum)&(distance<best)
                best[use]=distance[use];ids[use,:2]=self.ids[index:index+2]
                weights[use,0]=1-fraction[use];weights[use,1]=fraction[use]
        else:
            triangles=self.triangulation.find_simplex(points)
            for simplex in np.unique(triangles[triangles>=0]):
                selected=np.flatnonzero(triangles==simplex);vertices=self.triangulation.simplices[simplex]
                xy=self.xy[vertices]
                if np.max(np.linalg.norm(xy[:,None,:]-xy[None,:,:],axis=-1))>self.maximum:continue
                transform=self.triangulation.transform[simplex]
                first=(points[selected]-transform[2])@transform[:2].T
                barycentric=np.c_[first,1-first.sum(axis=1)]
                good=np.all(barycentric>=-1e-10,axis=1);selected=selected[good]
                barycentric=np.maximum(barycentric[good],0);barycentric/=barycentric.sum(axis=1,keepdims=True)
                ids[selected]=self.ids[vertices];weights[selected]=barycentric
        return ids,weights

    def paired(self,points,positions):
        ids,weights=self.stencils(points)
        positions=np.asarray(positions,float)
        require(positions.shape==(len(ids),), 'Provide one sample position for each physical query.')
        inside=np.isfinite(positions)&(positions>=0)&(positions<=self.volume.shape[2]-1)
        safe=np.where(inside,positions,0);a=np.floor(safe).astype(int);b=np.minimum(a+1,self.volume.shape[2]-1)
        fraction=safe-a;volume=self.volume.reshape(-1,self.volume.shape[2]);mask=self.mask.reshape(volume.shape)
        va,vb=volume[ids,a[:,None]],volume[ids,b[:,None]]
        good_a=mask[ids,a[:,None]]&np.isfinite(va);good_b=mask[ids,b[:,None]]&np.isfinite(vb)
        relevant=weights>1e-12
        valid=inside&(weights.sum(axis=1)>0)&np.all(~relevant|good_a,axis=1)
        valid &= (fraction<=1e-12)|np.all(~relevant|good_b,axis=1)
        left=np.sum(weights*np.where(good_a,va,0),axis=1);right=np.sum(weights*np.where(good_b,vb,0),axis=1)
        values=(1-fraction)*left+fraction*right
        return np.where(valid,values,np.nan),valid,ids,weights
