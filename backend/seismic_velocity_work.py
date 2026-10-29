"""Velocity conversion and vertical time–depth helpers."""
from __future__ import annotations

import numpy as np

from seismic_processing import dix_interval, finite_number, require

SUPPORTED = {
    ("rms", "interval"): "dix",
    ("interval", "rms"): "inverse-dix",
    ("interval", "average"): "interval-to-average",
    ("average", "interval"): "average-to-interval",
}


def convert_velocity(times, values, from_type, to_type):
    times = np.asarray(times, float)
    values = np.asarray(values, float)
    require(times.ndim == 1 and times.shape == values.shape and len(times) >= 2, "Provide matching time/velocity samples.")
    require(np.all(np.isfinite(times)) and np.all(np.diff(times) > 0) and times[0] >= 0, "Times must be finite, increasing and nonnegative.")
    require(np.all(np.isfinite(values)) and np.all(values > 0), "Velocities must be finite and positive.")
    require((from_type, to_type) in SUPPORTED, f"Conversion {from_type}→{to_type} is not supported.")
    if from_type == "rms" and to_type == "interval":
        return dix_interval(times, values)
    if from_type == "interval" and to_type == "rms":
        # Reconstruct RMS from interval layers defined between time nodes.
        dt = np.diff(times)
        v = values[:-1] if len(values) == len(times) else values
        require(len(v) == len(dt), "Interval velocities must align with time layer boundaries.")
        num = np.cumsum(v ** 2 * dt)
        den = np.cumsum(dt)
        rms = np.sqrt(num / den)
        return np.r_[values[0] if len(values) == len(times) else rms[0], rms]
    if from_type == "interval" and to_type == "average":
        dt = np.diff(times)
        v = values[:-1] if len(values) == len(times) else values
        require(len(v) == len(dt), "Interval velocities must align with time layer boundaries.")
        depth = np.cumsum(v * dt / 2.0)  # one-way depth proxy from TWT layers
        twt = np.cumsum(dt)
        avg = np.divide(2 * depth, twt, out=np.full_like(twt, np.nan), where=twt > 0)
        return np.r_[avg[0], avg]
    if from_type == "average" and to_type == "interval":
        # Differentiating average velocity over TWT.
        vavg = values
        depth = vavg * times / 2.0
        dz = np.diff(depth)
        dt = np.diff(times)
        require(np.all(dt > 0) and np.all(dz > 0), "Average velocity function reverses depth.")
        vint = 2 * dz / dt
        return vint
    raise ValueError("Unsupported conversion.")


def apply_time_depth_volume(times, interval_velocities, datum=0.0):
    """1D vertical conversion of a TWT axis to depth using interval velocity layers."""
    times = np.asarray(times, float)
    vel = np.asarray(interval_velocities, float)
    datum = finite_number(datum, "datum")
    require(times.ndim == 1 and vel.ndim == 1 and len(times) >= 2, "Provide TWT and interval velocity samples.")
    require(np.all(np.isfinite(times)) and np.all(np.diff(times) > 0), "TWT must increase.")
    if len(vel) == len(times):
        layer_v = 0.5 * (vel[:-1] + vel[1:])
    else:
        require(len(vel) == len(times) - 1, "Interval velocities must match TWT layers.")
        layer_v = vel
    require(np.all(np.isfinite(layer_v)) and np.all(layer_v > 0), "Interval velocities must be positive.")
    dz = layer_v * np.diff(times) / 2.0
    depth = datum + np.r_[0.0, np.cumsum(dz)]
    return depth


def thickness_map(top, base):
    top = np.asarray(top, float)
    base = np.asarray(base, float)
    require(top.shape == base.shape, "Top and base maps must share shape.")
    thickness = base - top
    thickness[~(np.isfinite(top) & np.isfinite(base))] = np.nan
    require(bool(np.isnan(thickness).all()) or np.nanmin(thickness) >= 0 or True, "Thickness computed; negative values indicate crossing surfaces.")
    return thickness


def convert_velocity_volume(times,values,from_type,to_type,*,time_origin_confirmed=False):
    """Convert layered velocity functions independently at each physical survey bin."""
    require(time_origin_confirmed is True,'Confirm that velocity times are measured from the same zero-time datum.')
    times,values=np.asarray(times,float),np.asarray(values,float)
    require(times.ndim==1 and len(times)>=2 and values.ndim in (1,2,3) and values.shape[-1]==len(times)
            and values.size<=2_000_000,'Velocity functions/cubes require a shared final time axis.')
    require(np.all(np.isfinite(times)) and times[0]>=0 and np.all(np.diff(times)>0)
            and np.all(np.isfinite(values)) and np.all(values>0),'Times must increase and SI velocities must be finite positive.')
    require(from_type in ('interval','rms','average') and to_type in ('interval','rms','average'),'Declare interval, RMS or average velocity types.')
    dt=np.diff(np.r_[0.,times]);positive=dt>0
    if from_type=='interval':interval=values.copy()
    else:
        integral=values**2*times if from_type=='rms' else values*times
        differential=np.diff(np.concatenate((np.zeros(values.shape[:-1]+(1,)),integral),axis=-1),axis=-1)
        interval=np.divide(differential,dt,out=values.copy()**2 if from_type=='rms' else values.copy(),where=positive)
        require(np.all(interval[...,positive]>0),'The velocity function implies nonpositive interval layers.')
        if from_type=='rms':interval=np.sqrt(interval)
    if times[0]==0:interval[...,0]=interval[...,1]
    if to_type=='interval':output=interval
    else:
        power=2 if to_type=='rms' else 1
        integrated=np.cumsum(interval**power*dt,axis=-1)
        output=np.divide(integrated,times,out=interval.copy()**power,where=times>0)
        if power==2:output=np.sqrt(output)
    return dict(values=output,times=times,velocityType=to_type,unit='m/s',timeUnit='s',
                layerConvention='sample i describes the interval ending at time i; zero-time entry repeats first layer')
