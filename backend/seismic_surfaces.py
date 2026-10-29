"""Horizon grids and fault surfaces from reviewed picks/sticks."""
from __future__ import annotations

import numpy as np

from seismic_processing import require


def horizon_grid_from_picks(picks, inline_range, crossline_range):
    """Rasterise picks onto a regular grid; missing cells stay NaN."""
    require(isinstance(picks, list) and picks, "Provide at least one horizon pick.")
    il0, il1 = inline_range
    xl0, xl1 = crossline_range
    require(type(il0) is int and type(il1) is int and il1 >= il0, "inline_range must be inclusive integers.")
    require(type(xl0) is int and type(xl1) is int and xl1 >= xl0, "crossline_range must be inclusive integers.")
    ni, nj = il1 - il0 + 1, xl1 - xl0 + 1
    require(ni * nj <= 2_000_000, "Horizon grid exceeds the two-million-cell metadata budget.")
    grid = np.full((ni, nj), np.nan)
    counts = np.zeros((ni, nj), dtype=np.int32)
    for pick in picks:
        require(isinstance(pick, dict) and {"inline", "crossline", "value"} <= set(pick), "Each pick needs inline, crossline and value.")
        i = int(pick["inline"]) - il0
        j = int(pick["crossline"]) - xl0
        if not (0 <= i < ni and 0 <= j < nj):
            continue
        value = float(pick["value"])
        require(np.isfinite(value), "Pick values must be finite.")
        if counts[i, j] == 0:
            grid[i, j] = value
        else:
            # Identical repeats are allowed; conflicting duplicates are rejected.
            require(grid[i, j] == value, "Conflicting picks share a bin; resolve before gridding.")
        counts[i, j] += 1
    return dict(grid=grid, inlineRange=list(inline_range), crosslineRange=list(crossline_range), populated=int(np.isfinite(grid).sum()))


def fault_surface_from_sticks(sticks):
    """
    Build a triangle strip surface only when consecutive sticks share compatible node counts.
    Refuses to smooth or invent topology across mismatched sticks.
    """
    require(isinstance(sticks, list) and len(sticks) >= 2, "Provide at least two ordered fault sticks.")
    nodes = []
    for stick in sticks:
        require(isinstance(stick, list) and len(stick) >= 2, "Each stick needs at least two nodes.")
        pts = []
        for node in stick:
            require(isinstance(node, dict) and {"inline", "crossline", "value"} <= set(node), "Nodes need inline, crossline and value.")
            pt = (float(node["inline"]), float(node["crossline"]), float(node["value"]))
            require(all(np.isfinite(pt)), "Fault nodes must be finite.")
            pts.append(pt)
        nodes.append(np.asarray(pts, float))
    counts = {len(s) for s in nodes}
    require(len(counts) == 1, "Fault sticks have incompatible node counts; refusing to invent bridging topology.")
    n = len(nodes[0])
    vertices = np.vstack(nodes)
    faces = []
    for s in range(len(nodes) - 1):
        for i in range(n - 1):
            a = s * n + i
            b = a + 1
            c = (s + 1) * n + i
            d = c + 1
            faces.append((a, c, b))
            faces.append((b, c, d))
    return dict(vertices=vertices, faces=np.asarray(faces, dtype=np.int64), stickCount=len(sticks), nodesPerStick=n)


def mistie_residuals(values_by_line):
    require(isinstance(values_by_line, dict) and values_by_line, "Provide per-line value maps keyed by shared pick ids.")
    keys = None
    for line, values in values_by_line.items():
        require(isinstance(values, dict) and values, f"Line {line} has no picks.")
        keys = set(values) if keys is None else keys & set(values)
    require(keys, "No common pick identities across lines.")
    table = {}
    for key in sorted(keys):
        vals = {line: float(values_by_line[line][key]) for line in values_by_line}
        require(all(np.isfinite(v) for v in vals.values()), "Mistie values must be finite.")
        mean = float(np.mean(list(vals.values())))
        table[key] = dict(mean=mean, residuals={line: vals[line] - mean for line in vals})
    return dict(commonPicks=len(keys), picks=table)
