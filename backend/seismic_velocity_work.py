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
