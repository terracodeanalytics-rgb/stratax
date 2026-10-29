"""Geological model helpers. Refuse exports that would distort fault topology."""
from __future__ import annotations

import json

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


def corner_point_pillar_grid(nx, ny, nz, x_corners, y_corners, z_tops, z_bases, active=None):
    """
    Bounded corner-point pillar description. Pillars are vertical; Y-splits are refused.
    x_corners/y_corners: (nx+1, ny+1); z_tops/z_bases: (nx, ny, nz)
    """
    require(type(nx) is int and type(ny) is int and type(nz) is int and nx >= 1 and ny >= 1 and nz >= 1, "Grid dimensions must be positive integers.")
    x = np.asarray(x_corners, float)
    y = np.asarray(y_corners, float)
    zt = np.asarray(z_tops, float)
    zb = np.asarray(z_bases, float)
    require(x.shape == (nx + 1, ny + 1) and y.shape == (nx + 1, ny + 1), "Corner XY arrays must be (nx+1, ny+1).")
    require(zt.shape == (nx, ny, nz) and zb.shape == zt.shape, "Top/base Z arrays must be (nx, ny, nz).")
    require(np.all(np.isfinite(x)) and np.all(np.isfinite(y)) and np.all(np.isfinite(zt)) and np.all(np.isfinite(zb)), "Grid coordinates must be finite.")
    require(np.all(zb >= zt), "Cell bases must lie at or below tops.")
    if active is None:
        active = np.ones((nx, ny, nz), dtype=bool)
    else:
        active = np.asarray(active, bool)
        require(active.shape == (nx, ny, nz), "Active mask must match the cell grid.")
    return dict(
        grid="corner-point-vertical-pillars",
        nx=nx, ny=ny, nz=nz,
        xCorners=x, yCorners=y, zTops=zt, zBases=zb, active=active,
        limitations=["Vertical pillars only; non-vertical faults/Y-splits are out of scope for this helper."],
    )


def export_grdecl_regular(grid, property_name="PORO"):
    """Write a minimal GRDECL text for a regular property grid (no fault topology)."""
    require(grid.get("grid") == "regular", "GRDECL helper currently exports regular grids only.")
    check = refuse_unrepresentable_export(False, "GRDECL")
    origin = np.asarray(grid["origin"], float)
    spacing = np.asarray(grid["spacing"], float)
    shape = tuple(grid["shape"])
    values = np.asarray(grid["values"], float)
    require(len(shape) == 3, "GRDECL export expects a 3D regular grid.")
    nx, ny, nz = shape
    lines = [
        f"-- StrataX regular GRDECL export for {property_name}",
        "SPECGRID",
        f"{nx} {ny} {nz} 1 F /",
        "COORD",
    ]
    # Vertical pillars at cell corners using origin/spacing.
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = origin[0] + i * spacing[0]
            y = origin[1] + j * spacing[1]
            z0 = origin[2]
            z1 = origin[2] + nz * spacing[2]
            lines.append(f"{x:.6f} {y:.6f} {z0:.6f} {x:.6f} {y:.6f} {z1:.6f}")
    lines.append("/")
    lines.append("ZCORN")
    # Simplified ZCORN: repeat tops/bases per layer.
    for k in range(nz):
        z_top = origin[2] + k * spacing[2]
        z_base = origin[2] + (k + 1) * spacing[2]
        for _ in range(8 * nx * ny):
            lines.append(f"{z_top:.6f}" if _ < 4 * nx * ny else f"{z_base:.6f}")
    lines.append("/")
    lines.append("ACTNUM")
    lines.extend(["1"] * (nx * ny * nz))
    lines.append("/")
    lines.append(property_name)
    flat = values.reshape(-1, order="F")
    lines.extend(f"{v:.8g}" for v in flat)
    lines.append("/")
    return dict(text="\n".join(lines) + "\n", target=check["target"], cells=int(nx * ny * nz), property=property_name)


def export_resqml_regular_manifest(grid, property_name="PORO", uuid="00000000-0000-0000-0000-000000000001"):
    """Emit a RESQML-oriented JSON manifest for a regular grid (arrays referenced, not embedded as HDF)."""
    require(grid.get("grid") == "regular", "RESQML manifest helper expects a regular grid.")
    check = refuse_unrepresentable_export(False, "RESQML")
    shape = list(grid["shape"])
    manifest = dict(
        kind="stratax-resqml-regular-manifest/1",
        uuid=uuid,
        target=check["target"],
        grid=dict(type="IjkGridRepresentation", ni=shape[0], nj=shape[1], nk=shape[2] if len(shape) > 2 else 1,
                  origin=np.asarray(grid["origin"], float).tolist(),
                  spacing=np.asarray(grid["spacing"], float).tolist()),
        properties=[dict(name=property_name, continuous=True, shape=shape,
                         valuesRef="inline-json",
                         values=np.asarray(grid["values"], float).reshape(-1).tolist())],
        limitations=["Manifest identifies geometry/property; full EPC/HDF5 packaging is a separate writer."],
    )
    return dict(manifest=manifest, json=json.dumps(manifest, allow_nan=False), target="RESQML")


def volumetric_sum(values, cell_volumes, active=None):
    values = np.asarray(values, float)
    vols = np.asarray(cell_volumes, float)
    require(values.shape == vols.shape, "Property and volume arrays must match.")
    require(np.all(np.isfinite(vols)) and np.all(vols >= 0), "Cell volumes must be finite and nonnegative.")
    mask = np.isfinite(values)
    if active is not None:
        active = np.asarray(active, bool)
        require(active.shape == values.shape, "Active mask must match values.")
        mask = mask & active
    return dict(sum=float(np.sum(values[mask] * vols[mask])), activeCells=int(mask.sum()), totalCells=int(values.size))
