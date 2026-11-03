"""SI velocity integrals with explicit interval posting and reference moments."""
import numpy as np

from seismic_processing import require,finite_number


def axis(values,name):
    result=np.asarray(values,float)
    require(result.ndim==1 and 2<=len(result)<=250000 and np.all(np.isfinite(result))
            and np.all(np.diff(result)>0),f'{name} must be a bounded strictly increasing finite axis.')
    return result


def velocity_function(body):
    require(body.get('referencesConfirmed') is True and body.get('velocityUnit')=='m/s' and body.get('timeUnit')=='s',
            'Confirm velocity m/s, time seconds and the model reference datum.')
    require(isinstance(body.get('referenceDatum'),str) and body['referenceDatum'].strip().lower()
            not in ('','unknown','unconfirmed','none'),'Identify the velocity/time reference datum.')
    times=axis(body['timeBounds'],'Velocity times')
    require(times[0]>=0,'Velocity times must be measured from the declared nonnegative time origin.')
    convention=body['timeConvention'];require(convention in ('TWT','one-way'),'Declare TWT versus one-way velocity time.')
    factor=2 if convention=='TWT' else 1
    values=np.asarray(body['values'],float)
    require(1<=values.ndim<=3 and values.size<=2_000_000,'Provide a bounded function,2D line or3D velocity volume.')
    valid=np.asarray(body.get('validity',np.isfinite(values)),bool)
    require(valid.shape==values.shape and np.all(np.isfinite(values[valid])) and np.all(values[valid]>0),
            'Supported velocity observations must be finite and positive; invalid intervals are never clipped.')
    source,target=body['fromType'],body['toType']
    require(source in ('interval','rms','average') and target in ('interval','rms','average'),
            'Specify interval, RMS or average velocity types.')
    shape=values.shape[:-1];width=np.diff(times)
    supplied=body.get('initialIntegrals',{})
    def initial(key,known=None):
        if known is not None:
            if key in supplied:
                declared=np.broadcast_to(np.asarray(supplied[key],float),shape)
                require(np.allclose(declared,known,rtol=1e-9,atol=1e-9,equal_nan=True),'Initial moments conflict with the supplied cumulative velocity.')
            return known
        if times[0]==0:
            if key in supplied:require(np.all(np.asarray(supplied[key])==0),'Zero-time cumulative moments must be zero.')
            return np.zeros(shape)
        require(key in supplied,'A truncated interval model needs the reviewed overburden integral for this conversion.')
        declared=np.broadcast_to(np.asarray(supplied[key],float),shape)
        require(np.all(np.isfinite(declared)) and np.all(declared>0),'Overburden moments must be finite and positive.')
        return declared
    if source=='interval':
        posting=body['intervalPosting']
        require(posting in ('layer','top','bottom','linear'),'Declare layer, top, bottom or linear interval posting.')
        require(values.shape[-1]==len(times)-(posting=='layer'),'Interval values do not match the declared posting.')
        if posting=='layer':left=right=values;support=valid
        elif posting=='linear':left,right=values[...,:-1],values[...,1:];support=valid[...,:-1]&valid[...,1:]
        elif posting=='top':left=right=values[...,:-1];support=valid[...,:-1]
        else:left=right=values[...,1:];support=valid[...,1:]
        first_known=second_known=None
    else:
        require(values.shape[-1]==len(times),'Cumulative velocities must identify every time boundary.')
        power=2 if source=='rms' else 1
        cumulative=np.where(valid,values,0)**power*times
        if times[0]==0:cumulative[...,0]=0
        support=valid[...,1:]&(valid[...,:-1]|(times[:-1]==0))
        layer=np.diff(cumulative,axis=-1)/width
        require(np.all(np.isfinite(layer[support])) and np.all(layer[support]>0),
                'Cumulative velocities imply invalid interval layers; no Dix radicands or depth reversals were clipped.')
        left=right=np.sqrt(np.where(support,layer,np.nan)) if power==2 else np.where(support,layer,np.nan)
        first_known=cumulative[...,0] if source=='average' else None
        second_known=cumulative[...,0] if source=='rms' else None
        posting='layer-inferred-from-'+source
    mean=(left+right)/2;squared=(left*left+left*right+right*right)/3
    require(np.all(np.isfinite(squared[support])),'Velocity moments overflow; review units and conditioning.')
    first=np.where(support,mean*width,0);second=np.where(support,squared*width,0)
    prefix=np.concatenate((np.ones(shape+(1,),bool),np.logical_and.accumulate(support,axis=-1)),axis=-1)
    relative=np.concatenate((np.zeros(shape+(1,)),np.cumsum(first,axis=-1)),axis=-1)
    anchor=np.broadcast_to(np.asarray(body['depthAtFirstTimeMetres'],float),shape)
    require(np.all(np.isfinite(anchor)),'Declare finite depth anchors at the first model time.')
    depth=np.where(prefix,anchor[...,None]+relative/factor,np.nan)
    if target=='interval':
        output=np.where(support,mean,np.nan);output_valid=support;output_posting='layer'
        if source=='interval' and posting=='linear':output=np.where(valid,values,np.nan);output_valid=valid;output_posting='linear'
    else:
        key='squaredVelocityTime' if target=='rms' else 'meanVelocityTime'
        moment=initial(key,second_known if target=='rms' else first_known)
        increments=second if target=='rms' else first
        integral=moment[...,None]+np.concatenate((np.zeros(shape+(1,)),np.cumsum(increments,axis=-1)),axis=-1)
        output=np.divide(integral,times,out=np.full_like(integral,np.nan),where=times>0)
        if target=='rms':output=np.sqrt(output)
        output_valid=prefix&np.isfinite(output);output_posting=None
    return dict(values=output,validity=output_valid,timeBounds=times,velocityType=target,intervalPosting=output_posting,
        intervalVelocity=np.where(support,mean,np.nan),intervalRmsVelocity=np.where(support,np.sqrt(squared),np.nan),
        layerLeftVelocity=np.where(support,left,np.nan),layerRightVelocity=np.where(support,right,np.nan),
        layerValidity=support,depthBounds=depth,depthAtFirstTimeMetres=anchor,sourcePosting=posting,
        timeConvention=convention,timeUnit='s',depthUnit='m',velocityUnit='m/s',referenceDatum=body['referenceDatum'],
        zeroTimeCumulativeVelocityDefined=False,assumptions=['isotropic vertical velocity integrals','piecewise-constant Dix layers for cumulative inputs'])


def sample_integral(function,target):
    """Exact first moment inside constant or linearly varying interval layers."""
    times=function['timeBounds'];target=np.asarray(target,float)
    require(target.ndim==1 and np.all(np.isfinite(target)) and np.all((target>=times[0])&(target<=times[-1])),
            'Requested times leave the measured velocity support.')
    left=np.asarray(function['layerLeftVelocity']);right=np.asarray(function['layerRightVelocity'])
    require(left.ndim==1,'Sample an individual conditioning function.')
    index=np.minimum(np.searchsorted(times,target,side='right')-1,len(times)-2)
    width=np.diff(times);distance=target-times[index]
    layer=(left+right)*width/2
    cumulative=np.r_[0,np.cumsum(layer)]
    return cumulative[index]+left[index]*distance+(right[index]-left[index])*distance**2/(2*width[index])
