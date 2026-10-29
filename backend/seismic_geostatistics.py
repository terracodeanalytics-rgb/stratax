"""Bounded 2D/3D variograms, local ordinary kriging, SGS and SIS."""
import numpy as np
from scipy.spatial.distance import cdist, pdist

from seismic_processing import finite_number, require


def _points(values, name):
    values = np.asarray(values, float)
    require(values.ndim == 2 and values.shape[1] in (2, 3) and 0 < len(values) <= 10000
            and np.all(np.isfinite(values)), f"Provide 1–10000 finite 2D/3D {name} coordinates.")
    return values


def empirical_variogram(points, values, edges):
    points = _points(points, "conditioning")
    require(len(points) <= 2000, "Use at most 2000 conditioning samples per variogram.")
    values, edges = np.asarray(values, float), np.asarray(edges, float)
    require(values.shape == (len(points),) and np.all(np.isfinite(values)), "One finite value per point is required.")
    require(edges.ndim == 1 and len(edges) >= 3 and np.all(np.isfinite(edges))
            and edges[0] >= 0 and np.all(np.diff(edges) > 0), "Provide increasing nonnegative lag-bin edges.")
    distances, semivariance = pdist(points), .5 * pdist(values[:, None], metric="sqeuclidean")
    bins = np.searchsorted(edges, distances, side="right") - 1
    counts = np.array([np.sum(bins == i) for i in range(len(edges) - 1)])
    gamma = np.array([np.mean(semivariance[bins == i]) if counts[i] else np.nan for i in range(len(counts))])
    return dict(lags=(edges[:-1]+edges[1:])/2, semivariance=gamma, counts=counts)


def _covariance(a, b, ranges, sill):
    return sill * np.exp(-cdist(a / ranges, b / ranges))


def fit_variogram(points, values, edges):
    """Weighted bounded exponential variogram fit, retaining empirical pair counts."""
    from scipy.optimize import least_squares
    empirical = empirical_variogram(points, values, edges)
    selected = (empirical["counts"] > 0) & np.isfinite(empirical["semivariance"])
    require(selected.sum() >= 3, "At least three populated lag bins are required to fit range, sill and nugget.")
    lag, gamma, count = (empirical[key][selected] for key in ("lags","semivariance","counts"))
    require(np.max(gamma) > 0, "Constant conditioning values cannot identify a variogram.")
    def residual(p):
        nugget,sill,scale = np.exp(p)
        return (nugget+sill*(1-np.exp(-lag/scale))-gamma)*np.sqrt(count/count.max())
    initial = np.log([max(np.max(gamma)*.05,1e-12),np.max(gamma),max(np.median(lag),1e-12)])
    fitted = least_squares(residual,initial,bounds=(initial-12,initial+12),max_nfev=200)
    require(fitted.success, "Variogram fit did not converge; review lags and conditioning support.")
    nugget,sill,scale = np.exp(fitted.x)
    return dict(**empirical, nugget=float(nugget), sill=float(sill), range=float(scale),
                fitCost=float(fitted.cost), model="isotropic-exponential", identifiable=bool(np.linalg.matrix_rank(fitted.jac)==3))


def ordinary_kriging(points, values, targets, *, ranges, sill, nugget=0., neighbours=32):
    points, targets = _points(points, "conditioning"), _points(targets, "target")
    require(points.shape[1] == targets.shape[1], "Coordinate dimensions must match.")
    ranges = np.asarray(ranges, float)
    values = np.asarray(values, float)
    require(ranges.shape == (points.shape[1],) and np.all(np.isfinite(ranges)) and np.all(ranges > 0),
            "Supply one positive covariance range per physical axis.")
    require(values.shape == (len(points),) and np.all(np.isfinite(values)), "One finite value per conditioning point is required.")
    require(len(np.unique(points, axis=0)) == len(points), "Resolve duplicate conditioning positions.")
    sill = finite_number(sill, "covariance sill", np.finfo(float).eps)
    nugget = finite_number(nugget, "covariance nugget", 0)
    require(type(neighbours) is int and 1 <= neighbours <= 128, "Use 1–128 local neighbours.")
    mean, variance = np.empty(len(targets)), np.empty(len(targets))
    for i, target in enumerate(targets):
        distances = np.linalg.norm((points - target) / ranges, axis=1)
        exact = np.flatnonzero(distances < 1e-12)
        if len(exact):
            mean[i], variance[i] = values[exact[0]], 0
            continue
        indices = np.argsort(distances, kind="stable")[:neighbours]
        selected = points[indices]; n = len(indices)
        matrix = np.ones((n+1, n+1)); matrix[-1, -1] = 0
        matrix[:n, :n] = _covariance(selected, selected, ranges, sill) + np.eye(n) * nugget
        target_covariance = _covariance(selected, target[None], ranges, sill).ravel()
        solution = np.linalg.solve(matrix, np.r_[target_covariance, 1.])
        mean[i] = np.dot(solution[:n], values[indices])
        uncertainty = sill + nugget - np.dot(solution[:n], target_covariance) - solution[-1]
        require(uncertainty >= -1e-8 * sill, "Covariance produced negative kriging variance.")
        variance[i] = max(0., uncertainty)
    return dict(mean=mean, variance=variance, covariance="anisotropic-exponential")


def sequential_simulation(points, values, targets, *, ranges, sill=1., nugget=0.,
                          neighbours=32, seed, categories=None, gaussian_confirmed=False):
    """Random-path conditional draws; SGS values must already be Gaussian scores.

    Indicator kriging probabilities are explicitly clipped/renormalised for SIS.
    A back-transform/trend belongs to the reviewed property calibration contract.
    """
    points, targets = _points(points, "conditioning"), _points(targets, "target")
    values = np.asarray(values, float)
    require(values.shape == (len(points),) and np.all(np.isfinite(values)), "One value per conditioning point is required.")
    require(type(seed) is int and 0 <= seed <= 2**32-1, "Provide a reproducible uint32 seed.")
    require(len(points) + len(targets) <= 10000, "Bound sequential paths to 10000 conditioning plus target points.")
    require(categories is not None or gaussian_confirmed is True,
            "SGS requires reviewed Gaussian scores; no normal-score calibration was inferred.")
    if categories is not None:
        categories = np.asarray(categories, float)
        require(categories.ndim == 1 and len(categories) >= 2 and len(np.unique(categories)) == len(categories)
                and np.all(np.isfinite(categories)) and np.all(np.isin(values, categories)), "Supply distinct finite categories containing all conditioning values.")
    rng = np.random.default_rng(seed); path = rng.permutation(len(targets)); output = np.empty(len(targets))
    for index in path:
        target = targets[index:index+1]
        exact = np.flatnonzero(np.all(points == target, axis=1))
        if len(exact):
            output[index] = values[exact[0]]
            continue
        settings = dict(ranges=ranges, sill=sill, nugget=nugget, neighbours=neighbours)
        if categories is None:
            krige = ordinary_kriging(points, values, target, **settings)
            output[index] = rng.normal(krige["mean"][0], np.sqrt(krige["variance"][0]))
        else:
            probabilities = np.clip([ordinary_kriging(points, (values == c).astype(float), target, **settings)["mean"][0]
                                     for c in categories], 0, 1)
            require(probabilities.sum() > 0, "Indicator probabilities have no support.")
            output[index] = rng.choice(categories, p=probabilities/probabilities.sum())
        points = np.vstack([points, target]); values = np.r_[values, output[index]]
    return dict(values=output, seed=seed, path=path, method="SIS" if categories is not None else "SGS")
