"""Whole-brick quantitative and repeatability workflows with explicit spatial axes."""
import numpy as np
from scipy import signal

from seismic_processing import TraceBlock, attributes, require


def volume_attributes(volume, dt, window=11):
    data=np.asarray(volume,float)
    require(data.ndim==3 and data.size<=2_000_000,'Provide an inline/crossline/time volume within the admitted budget.')
    rows=data.reshape(-1,data.shape[-1])
    block=TraceBlock(rows,dt)
    output=attributes(block,window)
    return dict(attributes={key:value.reshape(data.shape) for key,value in output.items()},
                shape=list(data.shape),axes=['inline','crossline','time'],sampleInterval=dt)


def invert_volume(body, *, cancelled=lambda:False, progress=lambda value:None):
    from seismic_inversion import poststack_inversion,prestack_inversion
    data=np.asarray(body['volume'],float);prestack=body['operation']=='prestack-volume'
    require(data.ndim==(4 if prestack else 3) and data.size<=2_000_000 and np.all(np.isfinite(data)),
            'Provide complete inline/crossline/(angle)/time observations within the admitted budget.')
    ni,nj=data.shape[:2];nt=data.shape[-1]
    background=np.asarray(body['background'],float)
    expected=(ni,nj,nt,3) if prestack else (ni,nj,nt)
    require(background.shape==expected,'Background models must match the declared volume axes.')
    prediction=np.empty_like(data);residual=np.empty_like(data);properties=np.empty(expected);diagnostics=[]
    settings=dict(amplitude_review=body.get('amplitudeReview') is True,regularization=body.get('regularization',.1),
                  smoothness=body.get('smoothness',0.),iterations=body.get('iterations',300))
    for i in range(ni):
        for j in range(nj):
            require(not cancelled(),'Volume inversion cancelled between spatial locations.')
            rows=data[i,j] if prestack else data[i,j][None,:]
            block=TraceBlock(rows,body['dt'],body.get('start',0),history=list(body.get('history',[])))
            if prestack:
                output=prestack_inversion(block,body['angles'],body['wavelet'],body['waveletDt'],background[i,j],**settings)
                properties[i,j]=output['properties']
            else:
                output=poststack_inversion(block,body['wavelet'],body['waveletDt'],background[i,j][None,:],**settings)
                properties[i,j]=output['impedance'][0]
            prediction[i,j]=output['predicted'].samples if prestack else output['predicted'].samples[0]
            residual[i,j]=output['residual'].samples if prestack else output['residual'].samples[0]
            diagnostics.append(dict(inlineIndex=i,crosslineIndex=j,solver=output['diagnostics']))
            progress(dict(completed=i*nj+j+1,total=ni*nj))
    return dict(properties=properties,predicted=prediction,residual=residual,diagnostics=diagnostics,
                axes=['inline','crossline','time','property'] if prestack else ['inline','crossline','time'],
                spatialCoupling='independent vertical inversions; no lateral regularisation assumed')


def four_d_volume(body):
    from seismic_4d import difference_volume,match_and_difference,cross_equalise_fir,qc_bundle
    baseline,monitor=(np.asarray(body[key],float) for key in ('baseline','monitor'))
    require(baseline.ndim==3 and baseline.shape==monitor.shape and baseline.size<=2_000_000,
            'Baseline and monitor must share a reviewed inline/crossline/time grid.')
    shape=baseline.shape
    b=TraceBlock(baseline.reshape(-1,shape[-1]),body['dt'],body.get('start',0))
    m=TraceBlock(monitor.reshape(-1,shape[-1]),body['dt'],body.get('start',0))
    stable=None
    if body.get('stableMask') is not None:
        stable=np.asarray(body['stableMask'],bool)
        require(stable.shape==shape,'Stable-region mask must match the volume, including reservoir exclusions.')
        stable=stable.reshape(b.samples.shape)
    operation=body['operation']
    if operation=='difference-volume':
        out,metrics=difference_volume(b,m)
        return dict(difference=out.samples.reshape(shape),metrics=metrics)
    require(stable is not None and stable.any(),'Review stable regions before fitting or repeatability calculation.')
    if operation=='match-volume':
        matched,difference,report=match_and_difference(b,m,stable,body.get('maxLag',10),body.get('phaseDegrees'))
    elif operation=='cross-equalise-volume':
        matched,difference,report=cross_equalise_fir(b,m,stable,taps=body.get('taps',5),regularization=body.get('regularization',.001))
    elif operation=='qc-volume':
        bundle=qc_bundle(b,m,stable_mask=stable,window=body.get('window',21),max_lag_samples=body.get('maxLagSamples',8))
        return dict(globalRepeatability=bundle['globalRepeatability'],**{key:np.asarray(bundle[key]['samples']).reshape(shape)
                    for key in ('nrms','correlation','timeShift')})
    else:raise ValueError('Choose a supported 3D difference, matching, cross-equalisation or QC operation.')
    return dict(matched=matched.samples.reshape(shape),difference=difference.samples.reshape(shape),report=report,
                fittingSupport='reviewed stable regions only',shape=list(shape))


def reflectivity_model(vp,vs,density,angles,method='aki-richards'):
    vp,vs,density=(np.asarray(v,float) for v in (vp,vs,density));angle=np.asarray(angles,float)
    require(vp.ndim==vs.ndim==density.ndim==1 and vp.shape==vs.shape==density.shape and len(vp)>=2,
            'Provide matching P/S velocity and density layer properties.')
    require(all(np.all(np.isfinite(v)) and np.all(v>0) for v in (vp,vs,density)) and np.all(vp>vs),
            'Layer velocities/densities must be positive with Vp greater than Vs.')
    require(angle.ndim==1 and len(angle)>0 and np.all(np.isfinite(angle)) and np.all((angle>=0)&(angle<60)),
            'Provide reviewed incidence angles from zero to below 60 degrees.')
    mean=lambda a:(a[:-1]+a[1:])/2
    dvp=np.diff(vp)/mean(vp);dvs=np.diff(vs)/mean(vs);drho=np.diff(density)/mean(density)
    k=mean(vs)/mean(vp);theta=np.deg2rad(angle)[:,None];s2=np.sin(theta)**2
    intercept=.5*(dvp+drho);gradient=.5*dvp-2*k*k*(drho+2*dvs)
    if method=='aki-richards':
        reflectivity=.5/np.cos(theta)**2*dvp-4*k*k*s2*dvs+(.5-2*k*k*s2)*drho
    elif method=='shuey3':reflectivity=intercept+gradient*s2+.5*dvp*(np.tan(theta)**2-s2)
    elif method=='shuey2':reflectivity=intercept+gradient*s2
    else:raise ValueError('Choose aki-richards, shuey2 or shuey3.')
    return dict(reflectivity=reflectivity,intercept=intercept,gradient=gradient,anglesDegrees=angle,
                method=method,assumptions=['isotropic elastic contrasts','linearised reflectivity','reviewed incidence angles'])
