"""Bounded multidimensional seismic views. Out-of-range samples stay null."""
from __future__ import annotations

import numpy as np

from seismic_processing import require


def _as_volume(volume, mask=None):
    vol = np.asarray(volume, dtype=np.float64)
    require(vol.ndim == 3 and min(vol.shape) > 0, "Supply a nonempty inline×crossline×sample volume.")
    if mask is None:
        mask = np.isfinite(vol)
    else:
        mask = np.asarray(mask, dtype=bool)
        require(mask.shape == vol.shape, "Mask must match the volume shape.")
        mask = mask & np.isfinite(vol)
    return vol, mask


def extract_inline(volume, inline_index, inline_axis=0, mask=None):
    vol, mask = _as_volume(volume, mask)
    require(inline_axis == 0, "This helper expects inline along axis 0.")
    require(type(inline_index) is int and 0 <= inline_index < vol.shape[0], "Inline index leaves the retained volume.")
    return dict(samples=vol[inline_index], mask=mask[inline_index], inline=inline_index)


def extract_crossline(volume, crossline_index, crossline_axis=1, mask=None):
    vol, mask = _as_volume(volume, mask)
    require(crossline_axis == 1, "This helper expects crossline along axis 1.")
    require(type(crossline_index) is int and 0 <= crossline_index < vol.shape[1], "Crossline index leaves the retained volume.")
    return dict(samples=vol[:, crossline_index], mask=mask[:, crossline_index], crossline=crossline_index)


def extract_time_slice(volume, sample_index, sample_axis=2, mask=None):
    vol, mask = _as_volume(volume, mask)
    require(sample_axis == 2, "This helper expects samples along axis 2.")
    require(type(sample_index) is int and 0 <= sample_index < vol.shape[2], "Sample index leaves the retained volume.")
    return dict(samples=vol[:, :, sample_index], mask=mask[:, :, sample_index], sample=sample_index)


def extract_arbitrary_section(volume, ij_path, mask=None):
    """Sample a polyline of (inline_index, crossline_index) with bilinear weights; OOB → NaN."""
    vol, mask = _as_volume(volume, mask)
    path = np.asarray(ij_path, float)
    require(path.ndim == 2 and path.shape[1] == 2 and len(path) >= 2, "Provide at least two (i,j) path nodes.")
    ni, nj, ns = vol.shape
    out = np.full((len(path), ns), np.nan)
    out_mask = np.zeros((len(path), ns), dtype=bool)
    for t, (i, j) in enumerate(path):
        if not (np.isfinite(i) and np.isfinite(j)):
            continue
        i0, j0 = int(np.floor(i)), int(np.floor(j))
        i1, j1 = i0 + 1, j0 + 1
        if i0 < 0 or j0 < 0 or i1 >= ni or j1 >= nj:
            continue
        wi, wj = i - i0, j - j0
        weights = ((1 - wi) * (1 - wj), wi * (1 - wj), (1 - wi) * wj, wi * wj)
        corners = ((i0, j0), (i1, j0), (i0, j1), (i1, j1))
        acc = np.zeros(ns)
        wsum = np.zeros(ns)
        for w, (ii, jj) in zip(weights, corners):
            m = mask[ii, jj]
            acc = acc + w * np.where(m, vol[ii, jj], 0.0)
            wsum = wsum + w * m
        valid = wsum > 0
        out[t] = np.divide(acc, wsum, out=np.full(ns, np.nan), where=valid)
        out_mask[t] = valid
    return dict(samples=out, mask=out_mask, path=path)


def linked_triad(volume, inline_index, crossline_index, sample_index, mask=None):
    """Linked inline / crossline / time-slice triad sharing one cursor; missing samples stay null."""
    inline = extract_inline(volume, inline_index, mask=mask)
    crossline = extract_crossline(volume, crossline_index, mask=mask)
    time_slice = extract_time_slice(volume, sample_index, mask=mask)
    return dict(
        cursor=dict(inline=inline_index, crossline=crossline_index, sample=sample_index),
        inlineSlice=inline,
        crosslineSlice=crossline,
        timeSlice=time_slice,
        limitations=["Bin indices only; physical-coordinate maps require a confirmed CRS transform."],
    )
