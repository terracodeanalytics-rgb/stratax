"""Marine conditioning and simple prestack imaging. Signatures/delays must be supplied."""
from __future__ import annotations

import numpy as np
from scipy import signal

from seismic_processing import TraceBlock, complete, finite_number, require


def source_signature_designature(block, signature, noise_floor=0.01):
    complete(block)
    signature = np.asarray(signature, float)
    require(signature.ndim == 1 and len(signature) >= 2 and np.all(np.isfinite(signature)), "Supply the measured source signature; none was invented.")
    noise_floor = finite_number(noise_floor, "noise floor", np.finfo(float).eps)
    sig = np.fft.rfft(signature, n=block.samples.shape[1])
    power = np.abs(sig) ** 2
    require(power.max() > 0, "Source signature has no energy for designature.")
    filt = np.conj(sig) / (power + noise_floor * power.max())
    out = np.fft.irfft(np.fft.rfft(block.samples, axis=1) * filt[None, :], n=block.samples.shape[1], axis=1)
    return block.derive(out, "source-signature-designature", dict(signatureSamples=len(signature), noiseFloor=noise_floor))


def simple_deghost(block, ghost_delay_seconds, reflection_coeff=-1.0):
    complete(block)
    delay = finite_number(ghost_delay_seconds, "ghost delay", np.finfo(float).eps)
    reflection_coeff = finite_number(reflection_coeff, "reflection coefficient", -1.0, 1.0)
    lag = delay / block.dt
    require(lag < block.samples.shape[1], "Ghost delay exceeds the trace length.")
    freq = np.fft.rfftfreq(block.samples.shape[1], block.dt)
    ghost = 1.0 + reflection_coeff * np.exp(-2j * np.pi * freq * delay)
    operator = np.conj(ghost) / (np.abs(ghost)**2 + 1e-3)
    out = np.fft.irfft(np.fft.rfft(block.samples, axis=1) * operator[None, :], n=block.samples.shape[1], axis=1)
    return block.derive(out, "simple-deghost", dict(ghostDelaySeconds=delay, reflectionCoeff=reflection_coeff,
                                                   limitations=["Explicit delay required; water depth was not inferred."]))


def swell_noise_attenuation(block, time_highpass_hz, space_highpass_per_trace):
    complete(block)
    require(block.domain == "TWT", "Swell attenuation expects TWT traces.")
    fcut = finite_number(time_highpass_hz, "time high-pass", np.finfo(float).eps, 0.49 / block.dt)
    kcut = finite_number(space_highpass_per_trace, "space high-pass", 0.0, 0.5)
    # Time high-pass
    sos = signal.butter(4, fcut, btype="highpass", fs=1 / block.dt, output="sos")
    timed = signal.sosfiltfilt(sos, block.samples, axis=1)
    # Spatial high-pass along trace axis per sample
    spectrum = np.fft.fft(timed, axis=0)
    k = np.fft.fftfreq(len(timed))
    keep = np.abs(k) >= kcut
    filtered = np.fft.ifft(spectrum * keep[:, None], axis=0).real
    return block.derive(filtered, "swell-noise-attenuation", dict(timeHighpassHz=fcut, spaceHighpass=kcut))


def parabolic_radon_demultiple(block, offsets, p_min, p_max, p_count, multiple_p_cut, mute_primary=True):
    """
    Bounded parabolic Radon demultiple. Offsets and curvature range must be reviewed.
    """
    complete(block)
    require(block.domain == "TWT", "Radon demultiple requires TWT gathers.")
    offsets = np.asarray(offsets, float)
    require(offsets.shape == (len(block.samples),) and np.all(np.isfinite(offsets)), "Provide finite offsets for every trace.")
    p_min = finite_number(p_min, "minimum curvature")
    p_max = finite_number(p_max, "maximum curvature", p_min)
    require(type(p_count) is int and 4 <= p_count <= 256, "Use 4–256 curvature samples.")
    cut = finite_number(multiple_p_cut, "multiple curvature cut", p_min, p_max)
    curvatures = np.linspace(p_min, p_max, p_count)
    require(mute_primary is True, "Demultiple must preserve the primary curvature band; use explicit Radon modelling for other selections.")
    from seismic_radon import radon_demultiple
    result, _ = radon_demultiple(block, offsets, curvatures, cut)
    return result


def linear_interpolation_gaps(block):
    """Fill only interior False-mask samples from neighbouring traces; never extend support."""
    require(block.mask is not None, "A validity mask is required.")
    out = block.samples.copy()
    mask = block.mask.copy()
    for j in range(out.shape[1]):
        col = out[:, j]
        valid = mask[:, j]
        if valid.all() or not valid.any():
            continue
        idx = np.arange(len(col))
        known = idx[valid]
        missing = idx[~valid]
        # Only interpolate strictly inside the convex hull of known traces.
        interior = missing[(missing > known.min()) & (missing < known.max())]
        if len(interior) == 0:
            continue
        col[interior] = np.interp(interior, known, col[known])
        mask[interior, j] = True
        out[:, j] = col
    return TraceBlock(out, block.dt, block.start, block.domain, mask,
                      [*block.history, {"method": "linear-gap-interpolation", "parameters": {}}])


def _retag(block, method, parameters):
    return TraceBlock(block.samples, block.dt, block.start, block.domain, block.mask,
                      [*block.history, {"method": method, "parameters": parameters}])


def receiver_side_deghost(block, ghost_delay_seconds, reflection_coeff=-1.0):
    """Receiver-side deghost using an explicit delay; water depth is never inferred."""
    out = simple_deghost(block, ghost_delay_seconds, reflection_coeff)
    return _retag(out, "receiver-deghost", dict(
        ghostDelaySeconds=float(ghost_delay_seconds), reflectionCoeff=float(reflection_coeff),
        limitations=["Explicit receiver delay required; not a designature substitute."],
    ))

def debubble(block, bubble_period_seconds, damp=0.6):
    """Subtract a delayed, damped copy to attenuate bubble reverberation; period must be supplied."""
    complete(block)
    period = finite_number(bubble_period_seconds, "bubble period", np.finfo(float).eps)
    damp = finite_number(damp, "bubble damp", 0.0, 1.0)
    lag = period / block.dt
    require(lag < block.samples.shape[1], "Bubble period exceeds the trace length.")
    freq = np.fft.rfftfreq(block.samples.shape[1], block.dt)
    bubble = 1.0 + damp * np.exp(-2j * np.pi * freq * period)
    operator = np.conj(bubble) / (np.abs(bubble)**2 + 1e-3)
    out = np.fft.irfft(np.fft.rfft(block.samples, axis=1) * operator[None, :], n=block.samples.shape[1], axis=1)
    return block.derive(out, "debubble", dict(bubblePeriodSeconds=period, damp=damp,
                                             limitations=["Single-period bubble model; not a full designature suite."]))


def srme_prediction_requires_geometry(shot_count, receiver_count, multiples_model=None):
    """
    SRME needs reviewed shot/receiver geometry and a multiples prediction model.
    This gate refuses silent execution without those inputs.
    """
    require(type(shot_count) is int and shot_count >= 1 and type(receiver_count) is int and receiver_count >= 1,
            "Provide reviewed shot and receiver counts.")
    require(multiples_model is not None, "Geometry-aware SRME requires an explicit multiples prediction model; none was invented.")
    return dict(available=True, shotCount=shot_count, receiverCount=receiver_count,
                limitations=["Prediction model must be supplied separately; primary preservation QC is not implied."])


def srme_subtract(block, multiples_model, scale=1.0):
    """Subtract a supplied multiples prediction; geometry-aware prediction itself is not invented here."""
    complete(block)
    multiples = np.asarray(multiples_model, float)
    require(multiples.shape == block.samples.shape and np.all(np.isfinite(multiples)),
            "Provide a finite multiples model matching the gather shape.")
    scale = finite_number(scale, "multiples scale")
    primary = block.samples - scale * multiples
    return block.derive(primary, "srme-subtract", dict(scale=scale,
                                                       limitations=["Uses a supplied multiples model only; prediction/engineered SRME is separate."]))


def kirchhoff_psdm_constant_velocity(block, offsets, midpoint_spacing, velocity):
    """Depth-domain companion to constant-velocity PSTM; still not field-qualified."""
    image = kirchhoff_pstm_constant_velocity(block, offsets, midpoint_spacing, velocity)
    return TraceBlock(image.samples, image.dt * velocity / 2, image.start * velocity / 2, "depth", image.mask,
                      [*image.history, {"method": "kirchhoff-depth-homogeneous",
                                        "parameters": dict(velocity=velocity, travelTimes="analytic homogeneous source/image/receiver paths")}])


def kirchhoff_pstm_constant_velocity(block, offsets, midpoint_spacing, velocity):
    """Simple 2D Kirchhoff PSTM for constant velocity; explicit dx/offsets/v required."""
    return _kirchhoff_pstm(block, offsets, midpoint_spacing, velocity_field=None, constant_velocity=velocity)


def kirchhoff_pstm_velocity_field(block, offsets, midpoint_spacing, velocity_times, velocity_values):
    """2D Kirchhoff PSTM with a reviewed 1D RMS/interval velocity function vs TWT."""
    times = np.asarray(velocity_times, float)
    values = np.asarray(velocity_values, float)
    require(times.ndim == 1 and times.shape == values.shape and len(times) >= 2, "Provide matching velocity times and values.")
    require(np.all(np.diff(times) > 0) and np.all(values > 0), "Velocity times must increase with positive velocities.")
    return _kirchhoff_pstm(block, offsets, midpoint_spacing, velocity_field=(times, values), constant_velocity=None)


def _kirchhoff_pstm(block, offsets, midpoint_spacing, velocity_field, constant_velocity):
    complete(block)
    require(block.domain == "TWT", "PSTM expects TWT gathers ordered by midpoint.")
    offsets = np.asarray(offsets, float)
    require(offsets.shape == (len(block.samples),) and np.all(np.isfinite(offsets)), "One finite offset per midpoint-ordered trace.")
    dx = finite_number(midpoint_spacing, "midpoint spacing", np.finfo(float).eps)
    n_mid = len(block.samples)
    image = np.zeros((n_mid, block.samples.shape[1]))
    t0 = block.axis
    if velocity_field is None:
        velocity = finite_number(constant_velocity, "migration velocity", np.finfo(float).eps)
        v_at = lambda tau: velocity
        method = "kirchhoff-pstm-constant-v"
        params = dict(velocity=velocity, midpointSpacing=dx, limitations=["Constant-velocity 2D PSTM foundation; field QC pending."])
    else:
        times, values = velocity_field
        v_at = lambda tau: float(np.interp(tau, times, values, left=values[0], right=values[-1]))
        method = "kirchhoff-pstm-velocity-field"
        params = dict(midpointSpacing=dx, velocityTimes=times.tolist(), velocityValues=values.tolist(),
                      limitations=["1D velocity-field 2D PSTM foundation; not a 3D/anisotropic migration."])
    midpoint = np.arange(n_mid) * dx
    sources, receivers = midpoint - offsets / 2, midpoint + offsets / 2
    velocities = np.asarray([v_at(t) for t in t0])
    require(np.all(t0 >= 0), "PSTM output TWT must be nonnegative.")
    depth = t0 * velocities / 2
    for i, x in enumerate(midpoint):
        for trace in range(n_mid):
            travel = (np.sqrt((x - sources[trace]) ** 2 + depth ** 2)
                      + np.sqrt((x - receivers[trace]) ** 2 + depth ** 2)) / velocities
            image[i] += np.interp(travel, t0, block.samples[trace], left=0, right=0)
    params["apertureMetres"] = float(midpoint[-1] - midpoint[0])
    params["amplitudeModel"] = "kinematic unweighted diffraction sum"
    return TraceBlock(image, block.dt, block.start, block.domain, np.isfinite(image),
                      [*block.history, {"method": method, "parameters": params}])


def residual_moveout_scan(block, offsets, velocities, window=11, max_stretch=0.3):
    """Bounded RMO semblance scan for prestack velocity revision; returns a TraceBlock panel (velocity × time)."""
    from seismic_processing import semblance
    panel = np.asarray(semblance(block, offsets, velocities, window=window, max_stretch=max_stretch), float)
    return TraceBlock(
        panel, block.dt, block.start, block.domain, np.isfinite(panel),
        [*block.history, {"method": "residual-moveout-scan",
                          "parameters": dict(velocities=list(map(float, np.asarray(velocities, float))),
                                            window=window, maxStretch=max_stretch,
                                            limitations=["Semblance panel only; picks are not auto-accepted."])}],
    )
