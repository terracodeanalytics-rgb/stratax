"""Geometry-aware local interpolation with explicit output coordinates and support."""
import numpy as np
from scipy.interpolate import RBFInterpolator
from scipy.spatial import Delaunay
from seismic_processing import require


def regularise_traces(coordinates, samples, targets, coordinate_scales, *, neighbours=32, smoothing=0.):
    xy, data, target, scales = (np.asarray(a, float) for a in (coordinates, samples, targets, coordinate_scales))
    require(xy.ndim == target.ndim == data.ndim == 2 and 1 <= xy.shape[1] <= 4
            and xy.shape[1] == target.shape[1] and len(xy) == len(data),
            "Supply explicit source and target acquisition coordinates (up to four spatial/offset axes).")
    require(len(xy) > xy.shape[1] and len(xy) <= 10000 and len(target)*data.shape[1] <= 2_000_000,
            "Use bounded trace/target grids spanning the declared acquisition axes.")
    require(scales.shape == (xy.shape[1],) and np.all(scales > 0)
            and all(np.all(np.isfinite(a)) for a in (xy, data, target, scales)), "Supply finite observations and reviewed coordinate scales.")
    require(len(np.unique(xy, axis=0)) == len(xy), "Resolve duplicate acquisition coordinates before regularisation.")
    require(type(neighbours) is int and xy.shape[1]+1 <= neighbours <= 128
            and np.isfinite(smoothing) and smoothing >= 0, "Review local neighbour count and nonnegative smoothing.")
    points, destination = xy/scales, target/scales
    require(np.linalg.matrix_rank(points-points.mean(axis=0)) == xy.shape[1], "Acquisition does not span all declared axes.")
    if xy.shape[1] == 1:
        inside = (destination[:, 0] >= points[:, 0].min()) & (destination[:, 0] <= points[:, 0].max())
    else:
        inside = Delaunay(points).find_simplex(destination) >= 0
    output = np.full((len(target), data.shape[1]), np.nan)
    if np.any(inside):
        interpolator = RBFInterpolator(points, data, neighbours=min(neighbours, len(points)),
                                      kernel="linear", degree=0, smoothing=smoothing)
        output[inside] = interpolator(destination[inside])
    return dict(samples=output, supported=inside, targetCoordinates=target,
                method="local-linear-rbf", extrapolated=False, coordinateScales=scales)
