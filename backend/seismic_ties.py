"""Well-seismic calibration helpers. Units/datums stay explicit; no guessed ties."""
from __future__ import annotations

import numpy as np
from scipy.interpolate import PchipInterpolator

from seismic_processing import require, finite_number


def wavelet_extract_wiener(seismic_trace, reflectivity, noise_floor=1e-3):
    seismic = np.asarray(seismic_trace, float)
    refl = np.asarray(reflectivity, float)
    require(seismic.ndim == 1 and seismic.shape == refl.shape and len(seismic) >= 8, "Supply matching finite seismic and reflectivity traces.")
    require(np.all(np.isfinite(seismic)) and np.all(np.isfinite(refl)), "Resolve missing samples before wavelet extraction.")
    noise_floor = finite_number(noise_floor, "noise floor", np.finfo(float).eps)
    S = np.fft.rfft(seismic)
    R = np.fft.rfft(refl)
    power = np.abs(R) ** 2
    require(power.max() > 0, "Reflectivity has no energy for wavelet extraction.")
    wavelet = np.fft.irfft(S * np.conj(R) / (power + noise_floor * power.max()), n=len(seismic))
    centred = np.fft.fftshift(wavelet)
    zero = len(centred) // 2
    half = min(zero, len(centred) - 1 - zero, 64)
    extracted = centred[zero - half: zero + half + 1]
    return extracted, dict(peakSample=int(np.argmax(np.abs(extracted))), zeroLagSample=half,
                          noiseFloor=noise_floor, length=len(extracted))


def tie_bulk_shift(seismic, synthetic, max_lag_samples=50):
    seismic = np.asarray(seismic, float)
    synth = np.asarray(synthetic, float)
    require(seismic.ndim == 1 and seismic.shape == synth.shape and len(seismic) >= 4, "Supply matching seismic and synthetic traces.")
    require(type(max_lag_samples) is int and 0 <= max_lag_samples <= len(seismic) // 2, "Lag search must fit inside the traces.")
    require(np.all(np.isfinite(seismic)) and np.all(np.isfinite(synth)), "Resolve gaps before bulk-shift correlation.")
    seismic = seismic - seismic.mean()
    synth = synth - synth.mean()
    best = None
    for lag in range(-max_lag_samples, max_lag_samples + 1):
        if lag < 0:
            a, b = seismic[-lag:], synth[: len(synth) + lag]
        elif lag > 0:
            a, b = seismic[: len(seismic) - lag], synth[lag:]
        else:
            a, b = seismic, synth
        if len(a) < 3 or a.std() == 0 or b.std() == 0:
            continue
        corr = float(np.corrcoef(a, b)[0, 1])
        candidate = (corr, -abs(lag), lag)
        if best is None or candidate > best:
            best = candidate
    require(best is not None, "Insufficient overlap for bulk-shift correlation.")
    return dict(lagSamples=best[2], correlation=best[0])


def stretch_squeeze_piecewise(twt, control_from, control_to):
    """Map TWT through reviewed control points only; reject reversals and extrapolation."""
    twt = np.asarray(twt, float)
    src = np.asarray(control_from, float)
    dst = np.asarray(control_to, float)
    require(twt.ndim == 1 and np.all(np.isfinite(twt)), "Provide a finite TWT axis.")
    require(src.ndim == 1 and src.shape == dst.shape and len(src) >= 2, "Provide matching reviewed control points.")
    require(np.all(np.isfinite(src)) and np.all(np.isfinite(dst)), "Control points must be finite.")
    order = np.argsort(src)
    src, dst = src[order], dst[order]
    require(np.all(np.diff(src) > 0) and np.all(np.diff(dst) > 0), "Control points must remain strictly increasing on both axes.")
    require(twt.min() >= src[0] and twt.max() <= src[-1], "Stretch/squeeze does not extrapolate beyond reviewed controls.")
    mapped = PchipInterpolator(src, dst, extrapolate=False)(twt)
    require(np.all(np.isfinite(mapped)) and np.all(np.diff(mapped) > 0), "Mapped TWT reverses or leaves support; review controls.")
    return mapped


def mistie_table(line_ties):
    """Summarise per-line bulk shifts relative to the network mean."""
    require(isinstance(line_ties, dict) and line_ties, "Provide a mapping of line id → lag samples.")
    lags = {str(k): float(v) for k, v in line_ties.items()}
    require(all(np.isfinite(v) for v in lags.values()), "Mistie lags must be finite.")
    mean = float(np.mean(list(lags.values())))
    return dict(
        networkMeanLagSamples=mean,
        residuals={k: v - mean for k, v in lags.items()},
        limitations=["Misties are software residuals on supplied ties; no automatic datum correction was applied."],
    )


def calibrated_synthetic(depth, sonic, density, checkshot_depth, checkshot_twt,
                         sample_times, wavelet, wavelet_dt, *, references_confirmed=False):
    """Calibrate independent checkshots then resample logs onto an explicit seismic axis."""
    from seismic_processing import time_depth, synthetic
    require(references_confirmed is True, "Confirm TVD/depth datum, TWT and SI log units before tying.")
    depth, sonic, density, axis, wavelet = (np.asarray(a, float) for a in (depth, sonic, density, sample_times, wavelet))
    require(depth.shape == sonic.shape == density.shape and depth.ndim == 1 and len(depth) <= 250000,
            "Sonic seconds/metre and density kg/m³ must share reviewed depth metres.")
    require(np.all(np.isfinite(density)) and np.all(density > 0), "Density must be finite positive kg/m³.")
    require(axis.ndim == 1 and 3 <= len(axis) <= 250000 and np.all(np.isfinite(axis)) and np.all(np.diff(axis) > 0),
            "Supply a bounded increasing uniform seismic TWT axis.")
    dt = finite_number(wavelet_dt, "wavelet sample interval", np.finfo(float).eps)
    require(np.allclose(np.diff(axis), dt, atol=1e-12, rtol=1e-10), "Wavelet and seismic axes require identical sampling.")
    calibrated = time_depth(depth, sonic, checkshot_depth, checkshot_twt)
    valid = np.isfinite(calibrated)
    require(valid.sum() >= 2, "Checkshots leave insufficient calibrated sonic coverage.")
    require(axis[0] >= calibrated[valid][0] and axis[-1] <= calibrated[valid][-1],
            "Restrict the synthetic axis to calibrated log/checkshot support; no extrapolation is performed.")
    slowness = np.interp(axis, calibrated[valid], sonic[valid])
    rho = np.interp(axis, calibrated[valid], density[valid])
    reflectivity, calculated = synthetic(1/slowness, rho, wavelet)
    return dict(logTwt=calibrated, sampleTwt=axis, velocity=1/slowness, density=rho,
                reflectivity=reflectivity, synthetic=calculated, wavelet=wavelet,
                calibration="sonic integration with reviewed monotonic checkshot drift", extrapolated=False)
