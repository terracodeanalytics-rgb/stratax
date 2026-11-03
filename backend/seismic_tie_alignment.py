"""Reviewed shifts and anchored sparse mistie networks; no implicit datum changes."""
import numpy as np
from scipy import sparse
from scipy.optimize import lsq_linear
from scipy.sparse.csgraph import connected_components

from seismic_processing import require,finite_number
from seismic_tie_calibration import quality,increasing


def shifted_samples(times,values,shift,validity=None):
    times=increasing(times,'Tie sample axis');values=np.asarray(values,float)
    require(values.shape==times.shape,'Shifted values must share the declared time axis.')
    mask=np.isfinite(values) if validity is None else np.asarray(validity,bool)&np.isfinite(values)
    require(mask.shape==values.shape,'Shift validity must match its observations.')
    positions=np.interp(times-shift,times,np.arange(len(times)),left=np.nan,right=np.nan)
    supported=np.isfinite(positions);safe=np.where(supported,positions,0)
    a=np.floor(safe).astype(int);b=np.minimum(a+1,len(times)-1);fraction=safe-a
    supported &= mask[a]&((fraction<=1e-12)|mask[b])
    data=np.where(mask,values,0)
    return np.where(supported,(1-fraction)*data[a]+fraction*data[b],np.nan),supported


def alignment(body,cancelled=lambda:False):
    times=increasing(body['sampleTwt'],'Tie sample axis');dt=np.diff(times)[0]
    require(np.allclose(np.diff(times),dt,rtol=1e-10,atol=1e-12),'Shift search requires explicitly uniform TWT seconds.')
    observed=np.asarray(body['seismic'],float);synthetic=np.asarray(body['synthetic'],float)
    fit=np.asarray(body['fitMask'],bool)
    require(observed.shape==synthetic.shape==fit.shape==times.shape,'Provide matching observations, synthetic and reviewed fit mask.')
    maximum=finite_number(body['maximumShiftSeconds'],'maximum shift',0)
    count=int(np.floor(maximum/dt));minimum=body['minimumOverlapSamples']
    require(type(minimum) is int and 3<=minimum<=len(times) and count<=min(len(times)//2,4096),
            'Bound the lag search and require at least three common fit samples.')
    lags=np.arange(-count,count+1);scores=np.full(len(lags),np.nan);support=np.zeros(len(lags),dtype=np.int64)
    for index,lag in enumerate(lags):
        require(not cancelled(),'Tie alignment cancelled.')
        shifted,valid=shifted_samples(times,synthetic,lag*dt)
        valid &= fit&np.isfinite(observed);support[index]=valid.sum()
        if valid.sum()<minimum:continue
        a,b=observed[valid],shifted[valid]
        if a.std()>0 and b.std()>0:scores[index]=np.corrcoef(a,b)[0,1]
    candidates=np.flatnonzero(np.isfinite(scores))
    require(len(candidates)>0,'No lag has sufficient nonconstant common fit support.')
    best=max(candidates,key=lambda i:(scores[i],-abs(lags[i])))
    minimum_correlation=finite_number(body['minimumCorrelation'],'minimum accepted correlation',-1,1)
    require(scores[best]>=minimum_correlation,'No shift meets the reviewed correlation requirement.')
    shift=float(lags[best]*dt)
    proposal,valid=shifted_samples(times,synthetic,shift)
    return dict(shiftSeconds=shift,shiftConvention='add-to-synthetic-time',sampleTwt=times,proposedSynthetic=proposal,
        validity=valid,quality=quality(observed,proposal,valid),lagsSeconds=lags*dt,correlations=scores,
        commonFitSamples=support,originalsModified=False,proposal=True,scientificApproval=False)


def mistie_network(body,cancelled=lambda:False):
    edges=body['observations'];anchors=body['anchorsSeconds']
    require(isinstance(edges,list) and 1<=len(edges)<=20000 and isinstance(anchors,dict) and anchors,
            'Provide reviewed timing differences and at least one explicit datum anchor per connected network.')
    nodes=sorted({edge[key] for edge in edges for key in ('from','to')})
    require(len(nodes)<=5000 and all(isinstance(node,str) and node for node in nodes) and set(anchors)<=set(nodes),
            'Identify at most5000 network nodes and anchor measured nodes only.')
    ids={name:index for index,name in enumerate(nodes)};rows=[];columns=[];data=[];target=[];weights=[]
    maximum=finite_number(body['maximumCorrectionSeconds'],'maximum mistie correction',np.finfo(float).eps)
    for index,edge in enumerate(edges):
        require(edge['from']!=edge['to'],'A mistie must connect distinct nodes.')
        rows.extend([index,index]);columns.extend([ids[edge['from']],ids[edge['to']]]);data.extend([-1.,1.])
        target.append(finite_number(edge['differenceSeconds'],'measured timing difference'))
        weights.append(np.sqrt(finite_number(edge['weight'],'mistie observation weight',np.finfo(float).eps)))
    matrix=sparse.csr_matrix((data,(rows,columns)),shape=(len(edges),len(nodes)))
    graph=abs(matrix).T@abs(matrix);count,labels=connected_components(graph,directed=False)
    fixed=np.asarray([ids[node] for node in anchors],dtype=int)
    require(set(labels[fixed])==set(range(count)), 'Every disconnected mistie network requires its own explicit anchor.')
    correction=np.zeros(len(nodes))
    for node,value in anchors.items():correction[ids[node]]=finite_number(value,'anchor correction',-maximum,maximum)
    free=np.asarray([index for index in range(len(nodes)) if index not in set(fixed)],dtype=int)
    require(not cancelled(),'Mistie fitting cancelled.')
    diagnostics=dict(iterations=0,optimality=0.)
    if len(free):
        w=np.asarray(weights);rhs=(np.asarray(target)-matrix@correction)*w
        solved=lsq_linear(matrix[:,free].multiply(w[:,None]).tocsr(),rhs,bounds=(-maximum,maximum),
            method='trf',lsmr_tol=1e-10,tol=1e-10,max_iter=200)
        require(solved.success and np.all(np.isfinite(solved.x)),'The constrained mistie network did not converge.')
        correction[free]=solved.x;diagnostics=dict(iterations=int(solved.nit),optimality=float(solved.optimality))
    require(not cancelled(),'Mistie fitting cancelled.')
    prediction=matrix@correction
    return dict(nodes=nodes,correctionsSeconds=correction,anchorsSeconds=anchors,
        observations=edges,predictedDifferencesSeconds=prediction,residualsSeconds=np.asarray(target)-prediction,
        convention='correction[to]-correction[from]=observed-difference',diagnostics=diagnostics,
        originalsModified=False,proposal=True,scientificApproval=False)
