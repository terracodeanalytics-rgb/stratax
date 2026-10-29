"""Explicit cube conversion and fault-block structural calculations in SI units."""
import heapq
import numpy as np
from scipy.integrate import cumulative_trapezoid
from scipy.interpolate import griddata
from seismic_processing import require


def convert_cube(volume, source_axis, interval_velocity, target_axis, *, direction,
                 datum_at_axis_start, reference_confirmed=False):
    require(reference_confirmed is True, "Confirm velocity type, datum and reference at the first source sample.")
    data, axis, velocity, target = (np.asarray(a, float) for a in (volume, source_axis, interval_velocity, target_axis))
    require(data.ndim == 3 and data.shape == velocity.shape and data.shape[-1] == len(axis)
            and data.size <= 2_000_000, "Provide matching genuine 3D amplitudes and interval velocities.")
    require(axis.ndim == target.ndim == 1 and len(axis) >= 2 and len(target) >= 2
            and np.all(np.isfinite(axis)) and np.all(np.diff(axis) > 0)
            and np.all(np.isfinite(target)) and np.all(np.diff(target) > 0), "Supply increasing explicit source and target axes.")
    require(np.all(np.isfinite(velocity)) and np.all(velocity > 0) and np.isfinite(datum_at_axis_start),
            "Supply positive SI interval velocities and a finite destination reference.")
    require(direction in ("twt-to-depth", "depth-to-twt"), "Choose twt-to-depth or depth-to-twt.")
    require(data.shape[0]*data.shape[1]*len(target) <= 2_000_000, "Converted cube exceeds the bounded cell budget.")
    output = np.full(data.shape[:2]+(len(target),), np.nan)
    for index in np.ndindex(data.shape[:2]):
        integrand = velocity[index]/2 if direction == "twt-to-depth" else 2/velocity[index]
        mapped = datum_at_axis_start + cumulative_trapezoid(integrand, axis, initial=0)
        lower = np.searchsorted(mapped, target, side="right")-1
        lower = np.clip(lower, 0, len(mapped)-2)
        valid = (target >= mapped[0]) & (target <= mapped[-1])
        valid &= np.isfinite(data[index][lower]) & np.isfinite(data[index][lower+1])
        fraction = (target-mapped[lower])/(mapped[lower+1]-mapped[lower])
        values = data[index][lower]*(1-fraction)+data[index][lower+1]*fraction
        output[index] = np.where(valid, values, np.nan)
    return dict(volume=output, targetAxis=target, domain="depth" if direction == "twt-to-depth" else "TWT",
                unit="m" if direction == "twt-to-depth" else "s", velocityType="interval")


def fault_block_surface(points, values, point_blocks, target_xy, target_blocks):
    """Interpolate only within explicitly reviewed fault blocks; no boundary smoothing."""
    points, values, blocks, xy, assigned = (np.asarray(a) for a in (points, values, point_blocks, target_xy, target_blocks))
    points, values, xy = points.astype(float), values.astype(float), xy.astype(float)
    require(points.ndim == xy.ndim == 2 and points.shape[1] == xy.shape[1] == 2
            and values.shape == blocks.shape == (len(points),) and assigned.shape == (len(xy),),
            "Assign conditioning and target XY points to reviewed fault blocks.")
    require(len(points) <= 10000 and len(xy) <= 100000 and all(np.all(np.isfinite(a)) for a in (points, values, xy)),
            "Supply bounded finite surface conditioning/target points.")
    result = np.full(len(xy), np.nan)
    for block in np.unique(assigned):
        observed = blocks == block; target = assigned == block
        require(observed.sum() >= 3 and np.linalg.matrix_rank(points[observed]-points[observed].mean(axis=0)) == 2,
                f"Fault block {block} needs at least three noncollinear reviewed points.")
        result[target] = griddata(points[observed], values[observed], xy[target], method="linear")
    return dict(values=result, blocks=assigned, extrapolated=False)


def layer_framework(top, base, fractions, blocks):
    top, base, fractions, blocks = (np.asarray(a) for a in (top, base, fractions, blocks))
    require(top.ndim == 2 and top.shape == base.shape == blocks.shape, "Top, base and block maps must align.")
    require(fractions.ndim == 1 and len(fractions) >= 2 and fractions[0] == 0 and fractions[-1] == 1
            and np.all(np.diff(fractions) > 0), "Declare increasing proportional layer fractions from zero to one.")
    valid = np.isfinite(top) & np.isfinite(base)
    require(np.all(base[valid] >= top[valid]), "Resolve crossing top/base surfaces before layering.")
    boundaries = top[..., None]+(base-top)[..., None]*fractions
    return dict(boundaries=boundaries, blocks=blocks, thickness=base-top,
                active=valid[..., None] & (np.diff(boundaries, axis=-1) > 0), pinchout=valid & (base == top))


def closure_map(depth_surface, spacing):
    """Priority-flood spill depths on a reviewed depth map, with open missing-data edges."""
    depth = np.asarray(depth_surface, float); spacing = np.asarray(spacing, float)
    require(depth.ndim == 2 and min(depth.shape) >= 2 and depth.size <= 1_000_000,
            "Provide a bounded 2D depth surface.")
    require(spacing.shape == (2,) and np.all(np.isfinite(spacing)) and np.all(spacing > 0), "Declare map grid spacing in metres.")
    valid = np.isfinite(depth); visited = ~valid; spill = depth.copy(); queue = []
    ni, nj = depth.shape
    def adjacent(i, j):
        for a, b in ((i-1,j),(i+1,j),(i,j-1),(i,j+1)):
            if 0 <= a < ni and 0 <= b < nj: yield a,b
    for i,j in np.ndindex(depth.shape):
        if valid[i,j] and (i in (0,ni-1) or j in (0,nj-1) or any(not valid[a,b] for a,b in adjacent(i,j))):
            visited[i,j] = True; heapq.heappush(queue, (depth[i,j], i, j))
    while queue:
        level,i,j = heapq.heappop(queue)
        for a,b in adjacent(i,j):
            if visited[a,b]: continue
            visited[a,b] = True; spill[a,b] = max(level,depth[a,b]); heapq.heappush(queue,(spill[a,b],a,b))
    thickness = spill-depth
    return dict(spillDepth=spill, closureHeight=thickness,
                grossClosureVolume=float(np.nansum(thickness)*np.prod(spacing)), unit="m3",
                limitations=["Structural gross closure only; no contacts, net-to-gross or fluid properties inferred."])
