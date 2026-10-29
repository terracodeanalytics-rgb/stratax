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
    operator = 1.0 / (1.0 + reflection_coeff * np.exp(-2j * np.pi * freq * delay) + 1e-6)
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
    t0 = block.axis
    # Forward parabolic Radon
    radon = np.zeros((p_count, len(t0)))
    for ip, p in enumerate(curvatures):
        for i, offset in enumerate(offsets):
            t = t0 + p * (offset ** 2)
            radon[ip] += np.interp(t0, t, block.samples[i], left=0.0, right=0.0)
    multiples = radon.copy()
    multiples[curvatures < cut] = 0.0 if mute_primary else multiples[curvatures < cut]
    # Adjoint model multiples back and subtract
    modeled = np.zeros_like(block.samples)
    for ip, p in enumerate(curvatures):
        if not np.any(multiples[ip]):
            continue
        for i, offset in enumerate(offsets):
            t = t0 + p * (offset ** 2)
            modeled[i] += np.interp(t, t0, multiples[ip], left=0.0, right=0.0)
    primary = block.samples - modeled / max(1, p_count)
    return block.derive(primary, "parabolic-radon-demultiple",
                        dict(pMin=p_min, pMax=p_max, pCount=p_count, multiplePCut=cut,
                             limitations=["Sparse parabolic Radon; not SRME."]))


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


def kirchhoff_psdm_constant_velocity(block, offsets, midpoint_spacing, velocity):
    """Depth-domain companion to constant-velocity PSTM; still not field-qualified."""
    image = kirchhoff_pstm_constant_velocity(block, offsets, midpoint_spacing, velocity)
    return TraceBlock(image.samples, image.dt, image.start, "depth", image.mask,
                      [*image.history, {"method": "kirchhoff-psdm-constant-v-proxy",
                                        "parameters": dict(limitations=["Constant-v depth proxy from PSTM times; true PSDM needs interval-velocity depth model."])}])


def kirchhoff_pstm_constant_velocity(block, offsets, midpoint_spacing, velocity):
    """Simple 2D Kirchhoff PSTM for constant velocity; explicit dx/offsets/v required."""
    complete(block)
    require(block.domain == "TWT", "PSTM expects TWT gathers ordered by midpoint.")
    offsets = np.asarray(offsets, float)
    require(offsets.shape == (len(block.samples),), "One offset per midpoint-ordered trace.")
    dx = finite_number(midpoint_spacing, "midpoint spacing", np.finfo(float).eps)
    velocity = finite_number(velocity, "migration velocity", np.finfo(float).eps)
    n_mid = len(block.samples)
    image = np.zeros((n_mid, block.samples.shape[1]))
    weight = np.zeros_like(image)
    t0 = block.axis
    for i, offset in enumerate(offsets):
        for j, tau in enumerate(t0):
            # Double-square-root travel time for constant v.
            half = offset / 2.0
            t = np.sqrt(tau ** 2 / 4.0 + (half / velocity) ** 2) * 2.0
            if t > t0[-1]:
                continue
            amp = np.interp(t, t0, block.samples[i], left=np.nan, right=np.nan)
            if not np.isfinite(amp):
                continue
            image[i, j] += amp
            weight[i, j] += 1
            # Spread to neighbouring midpoints within one spacing.
            for k, w in ((i - 1, 0.5), (i + 1, 0.5)):
                if 0 <= k < n_mid:
                    image[k, j] += w * amp
                    weight[k, j] += w
    result = np.divide(image, weight, out=np.full_like(image, np.nan), where=weight > 0)
    return TraceBlock(result, block.dt, block.start, block.domain, np.isfinite(result),
                      [*block.history, {"method": "kirchhoff-pstm-constant-v",
                                        "parameters": dict(velocity=velocity, midpointSpacing=dx,
                                                          limitations=["Constant-velocity 2D PSTM foundation; PSDM/field QC pending."])}])
