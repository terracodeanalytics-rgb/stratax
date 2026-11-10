"""Constrained, support-limited checkshot/sonic calibration and reviewed time edits."""
import numpy as np
from scipy.interpolate import PchipInterpolator

from seismic_processing import require,finite_number


def vector(values,name,minimum=2):
    value=np.asarray(values,float)
    require(value.ndim==1 and minimum<=len(value)<=250000 and np.all(np.isfinite(value)),
            f'{name} requires bounded finite observations.')
    return value


def increasing(values,name):
    result=vector(values,name)
    require(np.all(np.diff(result)>0),f'{name} must be strictly increasing.')
    return result


def calibration(body):
    require(body.get('referencesConfirmed') is True and body.get('depthDomain')=='TVD',
            'Confirm SI TVD and the reference datum before sonic/checkshot calibration.')
    require(body.get('units')==dict(depth='m',sonic='s/m',time='s'), 'Declare depth m, sonic s/m and checkshot s.')
    require(isinstance(body.get('referenceDatum'),str) and body['referenceDatum'].strip().lower()
            not in ('','unknown','none','unconfirmed'), 'Declare the calibrated depth/time reference datum.')
    depth=increasing(body['depth'],'Log TVD')
    sonic=vector(body['sonic'],'Sonic slowness')
    checks=increasing(body['checkshotDepth'],'Checkshot TVD')
    times=increasing(body['checkshotTwt'],'Checkshot times')
    require(sonic.shape==depth.shape and np.all(sonic>0) and checks.shape==times.shape,
            'Sonic/depth and checkshot depth/time observations must match and remain positive.')
    convention=body['checkshotTimeConvention']
    require(convention in ('TWT','one-way'), 'Declare checkshot TWT versus one-way time explicitly.')
    if convention=='one-way':times=times*2
    require(checks[0]>=depth[0] and checks[-1]<=depth[-1], 'Checkshots leave the measured sonic support.')
    gap=finite_number(body['maximumLogGapMetres'],'maximum log spacing',np.finfo(float).eps)
    used=(depth[:-1]<checks[-1]) & (depth[1:]>checks[0])
    require(np.all(np.diff(depth)[used]<=gap), 'The calibration crosses an unsupported log gap; review log QC first.')
    bounds=vector(body['velocityBoundsMps'],'Reviewed velocity bounds')
    require(len(bounds)==2 and 0<bounds[0]<bounds[1], 'Declare increasing positive interval-velocity bounds.')
    grid=np.unique(np.r_[depth[(depth>=checks[0]) & (depth<=checks[-1])],checks])
    slowness=np.interp(grid,depth,sonic)
    raw=np.r_[0,np.cumsum(np.diff(grid)*(slowness[:-1]+slowness[1:]))]
    raw_checks=np.interp(checks,grid,raw)
    scale=np.diff(times)/np.diff(raw_checks)
    interval=np.minimum(np.searchsorted(checks,grid,side='right')-1,len(checks)-2)
    calibrated=times[interval]+scale[interval]*(raw-raw_checks[interval])
    calibrated[-1]=times[-1]
    velocities=2*np.diff(grid)/np.diff(calibrated)
    require(np.all(np.isfinite(velocities)) and np.all((velocities>=bounds[0]) & (velocities<=bounds[1])),
            'Checkshot-calibrated interval velocity leaves the reviewed bounds; no values were clipped.')
    return dict(depth=grid,twt=calibrated,intervalVelocity=velocities,rawIntegratedTwt=raw,
        checkshotDepth=checks,checkshotTwt=times,checkshotResidual=np.interp(checks,grid,calibrated)-times,
        originalCheckshotConvention=convention,depthDomain='TVD',domain='TWT',depthUnit='m',timeUnit='s',
        referenceDatum=body['referenceDatum'],extrapolated=False,method='piecewise-checkshot-constrained-sonic-drift')


def constrained_edit(twt,control_from,control_to,minimum_stretch,maximum_stretch):
    times=increasing(twt,'Calibrated TWT')
    source=increasing(control_from,'Original control times');target=increasing(control_to,'Edited control times')
    require(source.shape==target.shape and times[0]>=source[0] and times[-1]<=source[-1],
            'Time edit controls must match and cover the entire calibrated support.')
    low=finite_number(minimum_stretch,'minimum stretch ratio',np.finfo(float).eps)
    high=finite_number(maximum_stretch,'maximum stretch ratio',low)
    spline=PchipInterpolator(source,target,extrapolate=False)
    # Check extrema of the exact quadratic derivative in every cubic segment.
    for index,width in enumerate(np.diff(source)):
        a,b,c=spline.c[0,index],spline.c[1,index],spline.c[2,index]
        positions=[0.,width]
        if a!=0:
            critical=-b/(3*a)
            if 0<critical<width:positions.append(critical)
        derivative=np.asarray([3*a*x*x+2*b*x+c for x in positions])
        tolerance=1e-10*max(1.,abs(low),abs(high))
        require(np.all((derivative>=low-tolerance) & (derivative<=high+tolerance)),
                'The proposed time edit violates its reviewed stretch bounds between controls.')
    return np.asarray(spline(times))


def trajectory_logs(body,target_frame):
    from seismic_crs import transform_xy
    depth=increasing(body['depth'],'Log depth')
    trajectory=body['trajectory']
    md=increasing(trajectory['measuredDepth'],'Trajectory MD')
    xyz=np.asarray(trajectory['coordinates'],float)
    require(xyz.shape==(len(md),3) and np.all(np.isfinite(xyz)) and np.all(np.diff(xyz[:,2])>0),
            'A conventional TVD tie requires a complete monotonic-TVD trajectory; overturned paths need an explicit 3D time model.')
    require(trajectory.get('depthUnit')=='m' and trajectory.get('positive')=='down'
            and trajectory.get('referenceDatum')==body['referenceDatum'],
            'Trajectory depth must be SI positive-down in the declared tie datum.')
    horizontal=np.asarray(transform_xy(xyz[:,:2],trajectory['coordinateFrame'],target_frame,engine='pyproj'))
    domain=body['logDepthDomain']
    require(domain in ('MD','TVD'), 'Declare log depth as MD or TVD.')
    axis=md if domain=='MD' else xyz[:,2]
    require(depth[0]>=axis[0] and depth[-1]<=axis[-1], 'Logs leave the measured trajectory support.')
    tvd=np.interp(depth,axis,xyz[:,2])
    xy=np.column_stack([np.interp(depth,axis,horizontal[:,i]) for i in range(2)])
    return depth,tvd,xy


def quality(seismic,synthetic,mask=None):
    observed,calculated=np.asarray(seismic,float),np.asarray(synthetic,float)
    require(observed.ndim==1 and observed.shape==calculated.shape, 'Tie comparison arrays must share one sampled axis.')
    valid=np.isfinite(observed) & np.isfinite(calculated)
    if mask is not None:
        require(np.shape(mask)==valid.shape, 'Tie comparison mask must match the sampled axis.')
        valid &= np.asarray(mask,bool)
    require(valid.sum()>=3, 'The tie has insufficient common valid support.')
    a,b=observed[valid],calculated[valid]
    residual=np.where(valid,observed-calculated,np.nan)
    correlation=float(np.corrcoef(a,b)[0,1]) if a.std()>0 and b.std()>0 else None
    denominator=np.dot(b,b)
    return dict(correlation=correlation,residual=residual,validity=valid,validSamples=int(valid.sum()),
        rmsResidual=float(np.sqrt(np.mean((a-b)**2))),
        diagnosticGain=float(np.dot(a,b)/denominator) if denominator>0 else None,
        gainApplied=False,scientificApproval=False)
