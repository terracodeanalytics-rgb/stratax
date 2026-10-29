"""Survey geometry QC and binning. Never invents bins, CRS or coordinates."""
from __future__ import annotations

import math

import numpy as np

from seismic_processing import require


def validate_bin_grid(inlines, crosslines):
    """Report duplicates, missing expected bins and irregular steps without filling gaps."""
    il = np.asarray(inlines)
    xl = np.asarray(crosslines)
    require(il.ndim == 1 and il.shape == xl.shape and len(il) > 0, "Provide matching inline/crossline identity vectors.")
    require(np.issubdtype(il.dtype, np.integer) and np.issubdtype(xl.dtype, np.integer), "Bin identities must be integers.")
    pairs = np.column_stack([il, xl])
    unique, counts = np.unique(pairs, axis=0, return_counts=True)
    duplicates = unique[counts > 1]
    il_step = _dominant_step(il)
    xl_step = _dominant_step(xl)
    expected = None
    missing = []
    if il_step and xl_step and unique.size:
        il_min, il_max = int(unique[:, 0].min()), int(unique[:, 0].max())
        xl_min, xl_max = int(unique[:, 1].min()), int(unique[:, 1].max())
        if (il_max - il_min) % il_step == 0 and (xl_max - xl_min) % xl_step == 0:
            full_il = np.arange(il_min, il_max + 1, il_step)
            full_xl = np.arange(xl_min, xl_max + 1, xl_step)
            expected = int(len(full_il) * len(full_xl))
            have = set(map(tuple, unique.tolist()))
            missing = [
                dict(inline=int(i), crossline=int(x))
                for i in full_il
                for x in full_xl
                if (int(i), int(x)) not in have
            ]
            if len(missing) > 10_000:
                missing = missing[:10_000]
    return dict(
        traceCount=int(len(il)),
        uniqueBins=int(len(unique)),
        duplicateBins=[dict(inline=int(a), crossline=int(b), count=int(c)) for (a, b), c in zip(duplicates, counts[counts > 1])],
        inlineStep=il_step,
        crosslineStep=xl_step,
        expectedRectangularBins=expected,
        missingBinCount=len(missing) if expected is not None else None,
        missingBinsSample=missing[:64],
        completeRectangular=bool(expected is not None and len(missing) == 0 and len(duplicates) == 0),
        limitations=["Missing bins are reported, never interpolated.", "CRS/unit conversion is not performed here."],
    )


def _dominant_step(values):
    uniq = np.unique(values)
    if len(uniq) < 2:
        return None
    diffs = np.diff(np.sort(uniq.astype(np.int64)))
    diffs = diffs[diffs > 0]
    if len(diffs) == 0:
        return None
    # Mode of positive differences.
    vals, counts = np.unique(diffs, return_counts=True)
    return int(vals[np.argmax(counts)])


def compute_midpoints(source_xy, receiver_xy):
    source = np.asarray(source_xy, float)
    receiver = np.asarray(receiver_xy, float)
    require(source.ndim == 2 and source.shape == receiver.shape and source.shape[1] == 2, "Supply N×2 source and receiver XY arrays.")
    require(np.all(np.isfinite(source)) and np.all(np.isfinite(receiver)), "Source/receiver coordinates must be finite; no positions were fabricated.")
    return 0.5 * (source + receiver)


def bin_traces(midpoints, origin, increment, azimuth_radians=0.0):
    """Assign inline/crossline indices in an already-projected working frame."""
    mid = np.asarray(midpoints, float)
    origin = np.asarray(origin, float)
    increment = np.asarray(increment, float)
    require(mid.ndim == 2 and mid.shape[1] == 2 and np.all(np.isfinite(mid)), "Provide finite midpoint XY values.")
    require(origin.shape == (2,) and increment.shape == (2,) and np.all(np.isfinite(origin)) and np.all(increment != 0), "Provide finite origin and nonzero increments.")
    require(np.isfinite(azimuth_radians), "Provide a finite grid azimuth in radians.")
    c, s = math.cos(azimuth_radians), math.sin(azimuth_radians)
    delta = mid - origin
    local_x = delta[:, 0] * c + delta[:, 1] * s
    local_y = -delta[:, 0] * s + delta[:, 1] * c
    inline = np.rint(local_y / increment[1]).astype(np.int64)
    crossline = np.rint(local_x / increment[0]).astype(np.int64)
    return dict(
        inline=inline,
        crossline=crossline,
        residualMetres=np.column_stack([local_x - crossline * increment[0], local_y - inline * increment[1]]),
        limitations=["Coordinates must already share the reviewed projected working CRS; no reprojection was applied."],
    )


def qualify_geometry_for_processing(review, qc_report):
    """Flip processing qualification only when review and QC both pass explicit gates."""
    reasons = []
    if not isinstance(review, dict) or not review.get("reviewed"):
        reasons.append("Header roles, units, axes, CRS and datum must be explicitly reviewed.")
    roles = set((review or {}).get("roles", {}))
    data_kind = (review or {}).get("dataKind")
    if data_kind == "unstacked":
        required = {"sourceX", "sourceY", "receiverX", "receiverY", "coordinateScalar"}
    elif data_kind == "poststack":
        required = {"midpointX", "midpointY", "coordinateScalar"}
    else:
        required = set()
        reasons.append("Declare unstacked or poststack data kind.")
    missing_roles = sorted(required - roles)
    if missing_roles:
        reasons.append("Missing required header roles: " + ", ".join(missing_roles))
    if (review or {}).get("crs", "").strip().lower() in ("", "unknown", "unconfirmed", "none"):
        reasons.append("CRS remains unconfirmed.")
    if not isinstance(qc_report, dict):
        reasons.append("Survey QC report is required.")
    else:
        if qc_report.get("duplicateBins"):
            reasons.append("Duplicate bins remain.")
        if qc_report.get("completeRectangular") is not True and not qc_report.get("allowIncomplete"):
            reasons.append("Rectangular bin completeness is not established (set allowIncomplete only after reviewed sparse-survey justification).")
        if qc_report.get("inlineStep") is None or qc_report.get("crosslineStep") is None:
            reasons.append("Dominant inline/crossline steps are unresolved.")
    qualified = not reasons
    return dict(geometryQualifiedForProcessing=qualified, reasons=reasons)
