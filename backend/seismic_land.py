"""Land processing operators. Required pilots/sweeps must be supplied; never invented."""
from __future__ import annotations

import numpy as np
from scipy import signal

from seismic_processing import TraceBlock, complete, finite_number, require, stack, static_shift


def mute(block, top=None, bottom=None, taper=0):
    complete(block)
    require(top is not None or bottom is not None, "Provide a top and/or bottom mute in axis units.")
    taper = finite_number(taper, "mute taper", 0)
    out = block.samples.copy()
    axis = block.axis
    for i in range(len(out)):
        weights = np.ones(len(axis))
        if top is not None:
            t = finite_number(top if np.isscalar(top) else top[i], "top mute")
            weights *= np.clip((axis - t) / taper, 0, 1) if taper > 0 else (axis >= t).astype(float)
        if bottom is not None:
            b = finite_number(bottom if np.isscalar(bottom) else bottom[i], "bottom mute")
            weights *= np.clip((b - axis) / taper, 0, 1) if taper > 0 else (axis <= b).astype(float)
        out[i] *= weights
    return block.derive(out, "mute", dict(top=top if np.isscalar(top) or top is None else list(map(float, top)),
                                         bottom=bottom if np.isscalar(bottom) or bottom is None else list(map(float, bottom)),
                                         taper=taper))


def supplied_sweep_correlation(block, sweep):
    complete(block)
    sweep = np.asarray(sweep, float)
    require(sweep.ndim == 1 and len(sweep) >= 2 and np.all(np.isfinite(sweep)), "Supply the recorded pilot/sweep; no synthetic sweep was invented.")
    sweep = sweep - sweep.mean()
    out = np.empty_like(block.samples)
    for i, trace in enumerate(block.samples):
        out[i] = signal.correlate(trace - trace.mean(), sweep, mode="same") / (np.dot(sweep, sweep) + np.finfo(float).eps)
    return block.derive(out, "supplied-sweep-correlation", dict(sweepSamples=len(sweep)))


def amplitude_balance(block, window=None):
    complete(block)
    ns = block.samples.shape[1]
    if window is None:
        window = (0, ns)
    start, stop = window
    require(type(start) is int and type(stop) is int and 0 <= start < stop <= ns, "Amplitude window must lie inside the trace.")
    segment = block.samples[:, start:stop]
    rms = np.sqrt(np.mean(segment ** 2, axis=1))
    require(np.all(rms > 0), "Zero-RMS traces cannot be balanced in the selected window.")
    scale = float(np.median(rms)) / rms
    return block.derive(block.samples * scale[:, None], "amplitude-balance", dict(window=[start, stop], scales=scale.tolist()))


def spiking_deconvolution(block, operator_length=32, noise_floor=0.001):
    complete(block)
    require(type(operator_length) is int and 3 <= operator_length <= min(256, block.samples.shape[1]), "Operator length must fit the traces.")
    noise_floor = finite_number(noise_floor, "noise floor", np.finfo(float).eps)
    out = np.empty_like(block.samples)
    for i, trace in enumerate(block.samples):
        autocorr = signal.correlate(trace, trace, mode="full")
        mid = len(autocorr) // 2
        toeplitz = autocorr[mid: mid + operator_length].copy()
        toeplitz[0] *= 1 + noise_floor
        matrix = np.array([np.concatenate([toeplitz[j::-1], np.zeros(operator_length - j - 1)]) if j < operator_length else toeplitz
                           for j in range(operator_length)])
        # Build classic Toeplitz from autocorrelation.
        matrix = np.zeros((operator_length, operator_length))
        for r in range(operator_length):
            for c in range(operator_length):
                matrix[r, c] = autocorr[mid + abs(r - c)]
        matrix[np.diag_indices_from(matrix)] *= 1 + noise_floor
        rhs = np.zeros(operator_length)
        rhs[0] = 1.0
        operator = np.linalg.solve(matrix, rhs)
        out[i] = signal.convolve(trace, operator, mode="same")
    return block.derive(out, "spiking-deconvolution", dict(operatorLength=operator_length, noiseFloor=noise_floor))


def residual_statics_shifts(block, max_lag_samples=16):
    """Cross-correlate each trace to the current stack pilot; returns shifts only."""
    complete(block)
    require(type(max_lag_samples) is int and 0 <= max_lag_samples <= 64, "Lag search must be 0–64 samples.")
    pilot, _ = stack(block)
    pilot = pilot.samples[0]
    pilot = pilot - np.nanmean(pilot)
    shifts = []
    for trace in block.samples:
        t = trace - np.nanmean(trace)
        best = ( -np.inf, 0)
        for lag in range(-max_lag_samples, max_lag_samples + 1):
            if lag < 0:
                a, b = t[-lag:], pilot[: len(pilot) + lag]
            elif lag > 0:
                a, b = t[: len(t) - lag], pilot[lag:]
            else:
                a, b = t, pilot
            if len(a) < 3:
                continue
            corr = float(np.dot(a, b))
            if corr > best[0]:
                best = (corr, lag)
        shifts.append(best[1] * block.dt)
    return np.asarray(shifts, float), dict(maxLagSamples=max_lag_samples, positive="delay")


def refraction_statics_linear(first_breaks, source_elev, receiver_elev, weathering_velocity, bedrock_velocity, datum):
    """
    Linear delay model from reviewed first breaks and velocities.
    Limitation: single-layer weathering; not a field refraction solution.
    """
    fb = np.asarray(first_breaks, float)
    s = np.asarray(source_elev, float)
    r = np.asarray(receiver_elev, float)
    require(fb.shape == s.shape == r.shape and fb.ndim == 1, "Provide matching first-break and elevation vectors.")
    require(np.all(np.isfinite(fb)) and np.all(fb >= 0), "First breaks must be finite nonnegative seconds.")
    vw = finite_number(weathering_velocity, "weathering velocity", np.finfo(float).eps)
    vb = finite_number(bedrock_velocity, "bedrock velocity", vw)
    datum = finite_number(datum, "datum elevation")
    # Delay to datum using replacement through weathering/bedrock contrast on elevations only.
    elev_term = ((s - datum) + (r - datum)) / vb
    weathering_term = fb * (1 - vw / vb)
    return elev_term + weathering_term, dict(model="single-layer-linear", limitations=["Not a tomographic refraction solution."])


def dmo_approximate(block, offsets, midpoint_spacing, velocity):
    """Approximate time-domain DMO for regularly spaced midpoints; explicit geometry required."""
    complete(block)
    require(block.domain == "TWT", "DMO requires TWT seconds.")
    offsets = np.asarray(offsets, float)
    require(offsets.shape == (len(block.samples),) and np.all(np.isfinite(offsets)), "Provide one finite offset per midpoint trace.")
    dx = finite_number(midpoint_spacing, "midpoint spacing", np.finfo(float).eps)
    velocity = finite_number(velocity, "constant DMO velocity", np.finfo(float).eps)
    out = np.zeros_like(block.samples)
    weight = np.zeros_like(block.samples)
    t0 = block.axis
    for i, offset in enumerate(offsets):
        # Hale-style approximate time shift magnitude for small dips; gathers energy to zero-offset time.
        shift = (offset ** 2) / (2 * (velocity ** 2) * np.maximum(t0, block.dt))
        samples = np.interp(t0 + shift, t0, block.samples[i], left=np.nan, right=np.nan)
        valid = np.isfinite(samples)
        out[i, valid] += samples[valid]
        weight[i, valid] += 1
        # Mild lateral mix with neighbours using explicit spacing identity only.
        for j, w in ((i - 1, 0.25), (i + 1, 0.25)):
            if 0 <= j < len(out):
                out[j, valid] += w * samples[valid]
                weight[j, valid] += w
    result = np.divide(out, weight, out=np.full_like(out, np.nan), where=weight > 0)
    return block.derive(result, "approximate-dmo", dict(midpointSpacing=dx, velocity=velocity, offsets=offsets.tolist(),
                                                        limitations=["Approximate constant-velocity DMO; not a field imaging product."]))


def poststack_phase_shift_migration(block, velocity, trace_spacing):
    """Stolt/Gazdag-style constant-velocity poststack phase-shift migration foundation."""
    complete(block)
    require(block.domain == "TWT" and len(block.samples) >= 4, "Phase-shift migration needs a regularly sampled TWT section.")
    velocity = finite_number(velocity, "migration velocity", np.finfo(float).eps)
    dx = finite_number(trace_spacing, "trace spacing", np.finfo(float).eps)
    nt = block.samples.shape[1]
    freq = np.fft.rfftfreq(nt, block.dt)[None, :]
    kx = np.fft.fftfreq(len(block.samples), dx)[:, None]
    spectrum = np.fft.fft(np.fft.rfft(block.samples, axis=1), axis=0)
    # Map temporal frequency to vertical wavenumber for constant velocity (Stolt mapping).
    inside = (2 * freq / velocity) ** 2 - kx ** 2
    kz = np.sqrt(np.where(inside > 0, inside, 0.0))
    # Phase-shift each (kx,f) component to imaging time using kz.
    phase = np.exp(-1j * kz * block.start)
    migrated = spectrum * phase * (inside > 0)
    image = np.fft.irfft(np.fft.ifft(migrated, axis=0), n=nt, axis=1).real
    return block.derive(image, "phase-shift-migration", dict(velocity=velocity, traceSpacing=dx,
                                                            limitations=["Constant-velocity phase-shift foundation; field qualification still required."]))


def apply_residual_statics(block, shifts):
    return static_shift(block, shifts)
