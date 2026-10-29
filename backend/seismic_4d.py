"""4D association, matching and QC. Stable-region params never invent reservoir change."""
from __future__ import annotations

import numpy as np
from scipy import signal

from seismic_processing import TraceBlock, equalise, finite_number, repeatability, require, static_shift
from seismic_resources import FourDPairResource


def associate_vintages(baseline_source_id, baseline_version, monitor_source_id, monitor_version,
                      coordinates, domain, amplitude_unit, geometry_qualified=False, common_support=False):
    return FourDPairResource(
        id=f"{baseline_source_id}-{monitor_source_id}",
        label=f"{baseline_source_id}→{monitor_source_id}",
        revision=0,
        coordinates=coordinates,
        domain=domain,
        amplitudeUnit=amplitude_unit,
        baselineSourceId=baseline_source_id,
        monitorSourceId=monitor_source_id,
        baselineVersion=baseline_version,
        monitorVersion=monitor_version,
        geometryQualifiedForProcessing=geometry_qualified,
        commonSupportConfirmed=common_support and geometry_qualified,
    )


def require_common_support(baseline, monitor, support_mask=None):
    """Confirm co-registered grids and optional common-support mask before 4D ops."""
    require(isinstance(baseline, TraceBlock) and isinstance(monitor, TraceBlock), "Provide TraceBlock vintages.")
    require(
        baseline.samples.shape == monitor.samples.shape
        and baseline.dt == monitor.dt
        and baseline.start == monitor.start
        and baseline.domain == monitor.domain,
        "Baseline and monitor must share shape, sample interval, start and domain before association.",
    )
    common = baseline.mask & monitor.mask
    if support_mask is not None:
        support = np.asarray(support_mask, bool)
        require(support.shape == baseline.samples.shape, "Common-support mask must match the vintages.")
        common = common & support
    require(bool(np.any(common)), "No common finite support remains between the vintages.")
    return dict(
        traceCount=int(baseline.samples.shape[0]),
        sampleCount=int(baseline.samples.shape[1]),
        commonSamples=int(common.sum()),
        commonFraction=float(common.sum() / common.size),
        domain=baseline.domain,
        dt=baseline.dt,
        start=baseline.start,
    )


def difference_volume(baseline, monitor, mask=None):
    require_common_support(baseline, monitor, mask)
    metrics = repeatability(baseline.samples, monitor.samples, mask=mask)
    diff = monitor.samples - baseline.samples
    if mask is not None:
        diff = np.where(mask, diff, np.nan)
    return TraceBlock(
        diff, baseline.dt, baseline.start, baseline.domain, np.isfinite(diff),
        [*baseline.history, {"method": "4d-difference", "parameters": metrics}],
    ), metrics


def nrms_map(baseline, monitor, window=11, mask=None):
    """Per-trace sliding NRMS map; missing windows stay NaN."""
    require_common_support(baseline, monitor, mask)
    require(type(window) is int and window >= 1 and window % 2 == 1, "Use a positive odd NRMS window.")
    b = baseline.samples
    m = monitor.samples
    valid = baseline.mask & monitor.mask
    if mask is not None:
        valid = valid & np.asarray(mask, bool)
    half = window // 2
    out = np.full(b.shape, np.nan)
    for i in range(b.shape[0]):
        for j in range(b.shape[1]):
            lo, hi = max(0, j - half), min(b.shape[1], j + half + 1)
            sel = valid[i, lo:hi]
            if sel.sum() < max(3, window // 2):
                continue
            x, y = b[i, lo:hi][sel], m[i, lo:hi][sel]
            denom = np.sqrt(np.mean(x * x)) + np.sqrt(np.mean(y * y))
            if denom <= 0:
                continue
            out[i, j] = 200.0 * np.sqrt(np.mean((x - y) ** 2)) / denom
    return TraceBlock(
        out, baseline.dt, baseline.start, baseline.domain, np.isfinite(out),
        [*baseline.history, {"method": "4d-nrms-map", "parameters": dict(window=window)}],
    )


def correlation_map(baseline, monitor, window=21, mask=None):
    require_common_support(baseline, monitor, mask)
    require(type(window) is int and window >= 3 and window % 2 == 1, "Use an odd correlation window ≥3.")
    b, m = baseline.samples, monitor.samples
    valid = baseline.mask & monitor.mask
    if mask is not None:
        valid = valid & np.asarray(mask, bool)
    half = window // 2
    out = np.full(b.shape, np.nan)
    for i in range(b.shape[0]):
        for j in range(b.shape[1]):
            lo, hi = max(0, j - half), min(b.shape[1], j + half + 1)
            sel = valid[i, lo:hi]
            if sel.sum() < 3:
                continue
            x, y = b[i, lo:hi][sel], m[i, lo:hi][sel]
            if x.std() == 0 or y.std() == 0:
                continue
            out[i, j] = float(np.corrcoef(x, y)[0, 1])
    return TraceBlock(
        out, baseline.dt, baseline.start, baseline.domain, np.isfinite(out),
        [*baseline.history, {"method": "4d-correlation-map", "parameters": dict(window=window)}],
    )


def time_shift_map(baseline, monitor, max_lag_samples=8, window=31, mask=None):
    """Local cross-correlation lag map in seconds; positive = monitor delayed."""
    require_common_support(baseline, monitor, mask)
    require(type(max_lag_samples) is int and 0 <= max_lag_samples <= 64, "Lag search must be 0–64 samples.")
    require(type(window) is int and window >= 5 and window % 2 == 1, "Use an odd shift window ≥5.")
    b, m = baseline.samples, monitor.samples
    valid = baseline.mask & monitor.mask
    if mask is not None:
        valid = valid & np.asarray(mask, bool)
    half = window // 2
    out = np.full(b.shape, np.nan)
    for i in range(b.shape[0]):
        for j in range(b.shape[1]):
            lo, hi = max(0, j - half), min(b.shape[1], j + half + 1)
            if not valid[i, lo:hi].any():
                continue
            ref = np.where(valid[i, lo:hi], b[i, lo:hi], 0.0)
            obs = np.where(valid[i, lo:hi], m[i, lo:hi], 0.0)
            if np.dot(ref, ref) <= 0 or np.dot(obs, obs) <= 0:
                continue
            corr = signal.correlate(obs, ref, mode="full")
            mid = len(ref) - 1
            band = corr[mid - max_lag_samples: mid + max_lag_samples + 1]
            lag = int(np.argmax(band) - max_lag_samples)
            out[i, j] = lag * baseline.dt
    return TraceBlock(
        out, baseline.dt, baseline.start, baseline.domain, np.isfinite(out),
        [*baseline.history, {"method": "4d-time-shift-map", "parameters": dict(maxLagSamples=max_lag_samples, window=window)}],
    )


def phase_match_equalise(baseline, monitor, stable_mask, max_lag=10, phase_samples=None):
    """
    Stable-region lag + scalar + optional constant phase rotation, then apply to full monitor.
    Reservoir/unstable samples are transformed with the same operators — not muted or invented.
    """
    require_common_support(baseline, monitor, stable_mask)
    matched, report = equalise(baseline, monitor, stable_mask, max_lag=max_lag)
    phase_deg = 0.0
    if phase_samples is not None:
        phase_deg = finite_number(phase_samples, "phase degrees", -180.0, 180.0)
        radians = np.deg2rad(phase_deg)
        analytic = signal.hilbert(matched.samples, axis=1)
        rotated = (analytic * np.exp(1j * radians)).real
        matched = matched.derive(rotated, "stable-phase-rotation", dict(phaseDegrees=phase_deg))
        # Re-fit scale after rotation on the stable mask only.
        mask = np.asarray(stable_mask, bool) & baseline.mask & matched.mask
        require(mask.sum() >= 3, "Stable region has insufficient support after phase rotation.")
        x, y = matched.samples[mask], baseline.samples[mask]
        norm = float(np.dot(x, x))
        require(norm > 0, "Rotated monitor vanishes on the stable region.")
        scale = float(np.dot(x, y) / norm)
        matched = matched.derive(matched.samples * scale, "stable-phase-amplitude", dict(scale=scale, phaseDegrees=phase_deg))
        report = dict(report) | dict(
            phaseDegrees=phase_deg,
            scaleAfterPhase=scale,
            after=repeatability(baseline.samples, matched.samples, mask=stable_mask),
        )
    else:
        report = dict(report) | dict(phaseDegrees=0.0)
    diff, metrics = difference_volume(baseline, matched, mask=None)
    return matched, diff, dict(equalisation=report, difference=metrics, limitations=[
        "Phase/lag/scale were estimated on the stable mask only.",
        "Outside the stable mask, the same operators are applied; reservoir signal is not forced to zero.",
    ])


def match_and_difference(baseline, monitor, stable_mask, max_lag=10, phase_degrees=None):
    if phase_degrees is None:
        matched, report = equalise(baseline, monitor, stable_mask, max_lag=max_lag)
        # Difference over full support so planted unstable changes remain visible after match.
        diff, metrics = difference_volume(baseline, matched, mask=None)
        stable_metrics = repeatability(baseline.samples, matched.samples, mask=stable_mask)
        return matched, diff, dict(
            equalisation=report,
            difference=metrics,
            stableAfter=stable_metrics,
            limitations=["Gain/lag from stable mask; full-volume difference retains non-stable changes."],
        )
    return phase_match_equalise(baseline, monitor, stable_mask, max_lag=max_lag, phase_samples=phase_degrees)


def qc_bundle(baseline, monitor, stable_mask=None, window=21, max_lag_samples=8):
    """NRMS, correlation and time-shift maps plus global repeatability."""
    support = require_common_support(baseline, monitor, stable_mask)
    global_metrics = repeatability(baseline.samples, monitor.samples, mask=stable_mask)
    return dict(
        support=support,
        globalRepeatability=global_metrics,
        nrms=_pack_block(nrms_map(baseline, monitor, window=window if window % 2 else window + 1, mask=stable_mask)),
        correlation=_pack_block(correlation_map(baseline, monitor, window=window if window % 2 else window + 1, mask=stable_mask)),
        timeShift=_pack_block(time_shift_map(
            baseline, monitor, max_lag_samples=max_lag_samples,
            window=(window if window % 2 else window + 1) if window >= 31 else 31,
            mask=stable_mask,
        )),
    )


def _pack_block(block: TraceBlock):
    return dict(
        samples=block.samples.tolist(),
        mask=block.mask.tolist(),
        dt=block.dt,
        start=block.start,
        domain=block.domain,
        history=block.history[-1:],
    )


def cross_equalise_fir(baseline, monitor, stable_mask, *, taps=5, regularization=1e-3):
    """Fit a global FIR only where its entire support lies in reviewed stable data."""
    require_common_support(baseline, monitor, stable_mask)
    require(type(taps) is int and 1 <= taps <= 65 and taps % 2 == 1,
            "Use an odd FIR length from 1 to 65 samples.")
    require(taps <= baseline.samples.shape[1], "FIR length exceeds the recording.")
    regularization = finite_number(regularization, "cross-equalisation regularization", np.finfo(float).eps)
    stable = np.asarray(stable_mask, bool) & baseline.mask & monitor.mask
    windows = np.lib.stride_tricks.sliding_window_view(monitor.samples, taps, axis=1)
    support = np.lib.stride_tricks.sliding_window_view(stable, taps, axis=1).all(axis=-1)
    half = taps // 2
    target = baseline.samples[:, half:baseline.samples.shape[1]-half or None]
    require(int(support.sum()) >= 3 * taps, "Stable regions provide too few complete FIR windows.")
    # Accumulate normal equations by trace instead of materialising a volume design matrix.
    normal = np.zeros((taps, taps)); rhs = np.zeros(taps)
    for trace in range(len(windows)):
        design = windows[trace, support[trace]]
        values = target[trace, support[trace]]
        normal += design.T @ design; rhs += design.T @ values
    ridge = regularization * np.trace(normal) / taps
    require(ridge > 0, "Stable monitor has no energy for cross-equalisation.")
    coefficients = np.linalg.solve(normal + np.eye(taps) * ridge, rhs)
    matched = np.full_like(monitor.samples, np.nan)
    validity = np.lib.stride_tricks.sliding_window_view(monitor.mask, taps, axis=1).all(axis=-1)
    for trace in range(len(windows)):
        values = np.where(validity[trace], windows[trace] @ coefficients, np.nan)
        matched[trace, half:monitor.samples.shape[1]-half or None] = values
    out = TraceBlock(matched, monitor.dt, monitor.start, monitor.domain, np.isfinite(matched),
        [*monitor.history, dict(method="stable-window-fir-cross-equalisation",
                              parameters=dict(coefficients=coefficients.tolist(), regularization=regularization,
                                              fittedWindows=int(support.sum()), sampleInterval=monitor.dt))])
    difference, metrics = difference_volume(baseline, out)
    return out, difference, dict(coefficients=coefficients.tolist(), fittedWindows=int(support.sum()),
                                 stableAfter=repeatability(baseline.samples, out.samples, mask=stable),
                                 fullDifference=metrics)
