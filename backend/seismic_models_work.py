"""Geological model helpers. Refuse exports that would distort fault topology."""
from __future__ import annotations

import numpy as np

from seismic_processing import require


def regular_property_grid(origin, spacing, shape, values):
    origin = np.asarray(origin, float)
    spacing = np.asarray(spacing, float)
    shape = tuple(int(v) for v in shape)
    values = np.asarray(values, float)
    require(origin.ndim == 1 and spacing.ndim == 1 and len(origin) == len(spacing) == len(shape), "Origin, spacing and shape must share dimensionality.")
    require(np.all(np.isfinite(origin)) and np.all(np.isfinite(spacing)) and np.all(spacing > 0), "Origin/spacing must be finite with positive increments.")
    require(values.shape == shape, "Property values must fill the declared grid.")
    require(np.all(np.isfinite(values)), "Property grids cannot contain non-finite values without an explicit mask resource.")
    return dict(origin=origin, spacing=spacing, shape=shape, values=values, grid="regular")


def well_block_average(depths, properties, cell_edges):
    depths = np.asarray(depths, float)
    props = np.asarray(properties, float)
    edges = np.asarray(cell_edges, float)
    require(depths.ndim == 1 and depths.shape == props.shape and len(depths) >= 1, "Provide matching depth/property samples.")
    require(edges.ndim == 1 and len(edges) >= 2 and np.all(np.diff(edges) > 0), "Cell edges must increase.")
    require(np.all(np.isfinite(depths)) and np.all(np.isfinite(props)), "Well samples must be finite.")
    blocked = np.full(len(edges) - 1, np.nan)
    for i, (lo, hi) in enumerate(zip(edges[:-1], edges[1:])):
        sel = (depths >= lo) & (depths < hi)
        if np.any(sel):
            blocked[i] = float(np.mean(props[sel]))
    return blocked


def refuse_unrepresentable_export(faults_have_y_splits: bool, target: str = "RESQML"):
    """Never distort faults to force an export format."""
    require(target in ("RESQML", "GRDECL"), "Choose RESQML or GRDECL.")
    if faults_have_y_splits and target == "GRDECL":
        raise ValueError("This fault topology has Y-splits that GRDECL cannot represent without distortion; export refused.")
    return dict(exportable=True, target=target)
