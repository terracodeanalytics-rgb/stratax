"""Matrix-free deterministic wavelet estimation and explicit spectral assessment."""
import numpy as np
from scipy.signal import fftconvolve,correlate
from scipy.sparse.linalg import LinearOperator,lsmr

from seismic_processing import require,finite_number
from seismic_wavelets import wavelet_operation


def estimate_wavelet(wells,dt,length,regularization,iterations=500,cancelled=lambda:False):
    dt=finite_number(dt,'wavelet interval',np.finfo(float).eps)
    damp=finite_number(regularization,'wavelet regularization',np.finfo(float).eps)
    require(type(length) is int and 3<=length<=4095 and length%2==1,
            'Choose an odd wavelet length from3 to4095 samples.')
    require(type(iterations) is int and 1<=iterations<=5000 and isinstance(wells,list) and 1<=len(wells)<=64,
            'Provide a bounded wavelet solve and reviewed well traces.')
    records=[];total=0
    for well in wells:
        reflection=np.asarray(well['reflectivity'],float);data=np.asarray(well['seismic'],float)
        require(reflection.ndim==1 and reflection.shape==data.shape and length<=len(data)<=250000
                and np.all(np.isfinite(reflection)), 'Wavelet estimation needs complete reflectivity on each matching seismic axis.')
        require(np.isclose(well['dt'],dt,rtol=1e-10,atol=1e-12), 'Multiwell wavelet traces require explicitly matched sampling.')
        mask=np.asarray(well.get('validity',np.isfinite(data)),bool)
        require(mask.shape==data.shape, 'Wavelet fit mask must match its observations.')
        mask &= np.isfinite(data)
        require(mask.sum()>=length, 'A wavelet fit has insufficient measured support.')
        weight=np.sqrt(finite_number(well['weight'],'reviewed well weight',np.finfo(float).eps))*mask
        records.append((reflection,np.where(mask,data,0),weight));total+=len(data)
    require(total<=2_000_000, 'Wavelet estimation exceeds the admitted observation budget.')
    center=length//2
    def forward(wavelet):
        require(not cancelled(), 'Wavelet estimation cancelled.')
        return np.concatenate([weight*fftconvolve(r,wavelet,mode='same') for r,data,weight in records])
    def adjoint(values):
        require(not cancelled(), 'Wavelet estimation cancelled.')
        output=np.zeros(length);offset=0
        for reflection,data,weight in records:
            count=len(data)
            covariance=correlate(weight*values[offset:offset+count],reflection,mode='full',method='fft')
            output+=covariance[count-1+np.arange(length)-center]
            offset+=count
        return output
    operator=LinearOperator((total,length),matvec=forward,rmatvec=adjoint,dtype=np.float64)
    data=np.concatenate([weight*values for reflection,values,weight in records])
    solved=lsmr(operator,data,damp=np.sqrt(damp),maxiter=iterations,atol=1e-8,btol=1e-8)
    require(solved[1] in (0,1,2,4,5) and np.all(np.isfinite(solved[0])) and np.any(solved[0]!=0),
            'Wavelet estimation did not converge to a nonzero model; review conditioning/iteration diagnostics.')
    assessment=wavelet_operation(dict(operation='wavelet-import',dt=dt,wavelet=solved[0],normalisation='none'))
    residuals=[]
    for reflection,observed,weight in records:
        prediction=fftconvolve(reflection,solved[0],mode='same')
        residuals.append(dict(predicted=prediction,residual=np.where(weight>0,observed-prediction,np.nan),validity=weight>0))
    return assessment|dict(method='multiwell-weighted-convolution-lsmr',regularization=damp,
        diagnostics=dict(stopCode=int(solved[1]),iterations=int(solved[2]),residualNorm=float(solved[3]),
            normalResidualNorm=float(solved[4]),conditionEstimate=float(solved[6]) if np.isfinite(solved[6]) else None),wellFits=residuals)


def assess_wavelet(wavelet,dt):
    result=wavelet_operation(dict(operation='wavelet-import',wavelet=wavelet,dt=dt,normalisation='none'))
    energy=np.asarray(wavelet,float)**2
    cumulative=np.cumsum(energy)/energy.sum()
    result.update(energy=float(energy.sum()),peakLagSeconds=float(result['lags'][np.argmax(np.abs(wavelet))]),
        energyCenterLagSeconds=float(np.sum(result['lags']*energy)/energy.sum()),
        central90PercentEnergySeconds=[float(result['lags'][np.searchsorted(cumulative,.05)]),
                                      float(result['lags'][min(len(energy)-1,np.searchsorted(cumulative,.95))])],
        absolutePhaseAssumed=False)
    return result
