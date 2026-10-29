"""Bounded physical-axis vintage matching fitted only on reviewed stable regions."""
import numpy as np
from scipy.interpolate import RegularGridInterpolator
from scipy.optimize import least_squares
from seismic_processing import require


def register_vintages(baseline, monitor, baseline_axes, monitor_axes, stable_mask, maximum_shift,
                       *, references_confirmed=False, maximum_evaluations=50):
    require(references_confirmed is True, "Confirm shared CRS, domain, units and datum before vintage matching.")
    baseline, monitor, stable = np.asarray(baseline, float), np.asarray(monitor, float), np.asarray(stable_mask, bool)
    require(baseline.ndim == monitor.ndim == 3 and baseline.shape == stable.shape
            and baseline.size <= 2_000_000 and monitor.size <= 2_000_000,
            "Provide bounded genuine 3D vintages and a baseline-grid stable mask.")
    require(np.all(np.isfinite(baseline)) and np.all(np.isfinite(monitor)), "Resolve vintage invalid support before registration.")
    require(isinstance(baseline_axes, list) and isinstance(monitor_axes, list)
            and len(baseline_axes) == len(monitor_axes) == 3, "Supply each vintage's three physical axes.")
    axes = []
    for raw, shape in ((baseline_axes, baseline.shape), (monitor_axes, monitor.shape)):
        converted = [np.asarray(a, float) for a in raw]
        require(all(a.ndim == 1 and len(a) == n and np.all(np.isfinite(a)) and np.all(np.diff(a) > 0)
                    for a,n in zip(converted, shape)), "Vintage axes must be increasing and match their actual cubes.")
        axes.append(converted)
    shift = np.asarray(maximum_shift, float)
    require(shift.shape == (3,) and np.all(np.isfinite(shift)) and np.all(shift > 0), "Review positive physical shift bounds on all axes.")
    require(type(maximum_evaluations) is int and 1 <= maximum_evaluations <= 200, "Use bounded registration evaluations.")
    indices = np.argwhere(stable)
    require(len(indices) >= 30, "Review at least 30 stable cells spanning the survey.")
    indices = indices[::max(1, int(np.ceil(len(indices)/5000)))]
    coordinates = np.column_stack([axes[0][a][indices[:, a]] for a in range(3)])
    # Retain stable points valid for the entire approved search box.
    safe = np.ones(len(coordinates), bool)
    for a in range(3):
        safe &= coordinates[:, a]-shift[a] >= axes[1][a][0]
        safe &= coordinates[:, a]+shift[a] <= axes[1][a][-1]
    indices, coordinates = indices[safe], coordinates[safe]
    require(len(coordinates) >= 30 and np.linalg.matrix_rank(coordinates-coordinates.mean(axis=0)) == 3,
            "Stable common support must span three axes throughout the shift search box.")
    observed = baseline[tuple(indices.T)]
    interpolator = RegularGridInterpolator(tuple(axes[1]), monitor, bounds_error=False, fill_value=np.nan)
    scale = np.sqrt(np.mean(observed**2))
    require(scale > 0, "Stable baseline has no energy for geometry matching.")
    def residual(parameters):
        return (interpolator(coordinates+parameters)-observed)/scale
    fitted = least_squares(residual, np.zeros(3), bounds=(-shift, shift),
                           x_scale=shift, max_nfev=maximum_evaluations)
    require(fitted.success and np.all(np.isfinite(fitted.x)), "Vintage registration did not converge; review diagnostics and bounds.")
    output = np.full(baseline.shape, np.nan)
    # Bound interpolation workspace to one inline.
    yy, zz = np.meshgrid(axes[0][1], axes[0][2], indexing="ij")
    for i, x in enumerate(axes[0][0]):
        points = np.column_stack([np.full(yy.size, x), yy.ravel(), zz.ravel()])
        output[i] = interpolator(points+fitted.x).reshape(yy.shape)
    return dict(matched=output, difference=output-baseline, physicalShift=fitted.x,
                stableSamples=len(coordinates), evaluations=int(fitted.nfev), cost=float(fitted.cost),
                commonSupport=np.isfinite(output), method="stable-region-bounded-translation")
