"""Explicit sampled wavelet import, creation and phase rotation."""
import numpy as np
from scipy.signal import hilbert
from seismic_processing import ricker,require,finite_number


def wavelet_operation(body):
    dt=finite_number(body['dt'],'wavelet interval',np.finfo(float).eps)
    operation=body['operation']
    if operation=='wavelet-create':
        frequency=finite_number(body['frequencyHz'],'wavelet frequency',np.finfo(float).eps,.5/dt)
        duration=finite_number(body['durationSeconds'],'wavelet duration',3*dt,4095*dt)
        _,wavelet=ricker(dt,frequency,duration)
    else:
        wavelet=np.asarray(body['wavelet'],float)
    require(wavelet.ndim==1 and 3<=len(wavelet)<=4095 and len(wavelet)%2==1 and np.all(np.isfinite(wavelet))
            and np.max(np.abs(wavelet))>0,'Provide a nonzero finite odd-length wavelet centred at zero lag.')
    phase=finite_number(body.get('phaseDegrees',0),'wavelet phase',-360,360)
    if phase:wavelet=np.real(hilbert(wavelet)*np.exp(1j*np.deg2rad(phase)))
    if body.get('normalisation','none')=='peak':wavelet=wavelet/np.max(np.abs(wavelet))
    else:require(body.get('normalisation','none')=='none','Choose none or explicit peak normalisation.')
    frequency=np.fft.rfftfreq(len(wavelet),dt);spectrum=np.fft.rfft(np.fft.ifftshift(wavelet))
    return dict(wavelet=wavelet,dt=dt,lags=(np.arange(len(wavelet))-len(wavelet)//2)*dt,
                phaseDegrees=phase,frequenciesHz=frequency,amplitudeSpectrum=np.abs(spectrum),
                phaseSpectrum=np.angle(spectrum),normalisation=body.get('normalisation','none'))
