"""Physical-coordinate structure attributes for genuine 3D analytical cubes."""
import numpy as np
from scipy.ndimage import gaussian_filter

from seismic_processing import finite_number, require


def structure_attributes(volume, spacing, *, domain, sigma=1.0, minimum_energy=1e-12):
    """Axes are x, y, vertical; time dip is s/m and depth dip is m/m.

    Azimuth is the down-increasing-vertical direction from +y towards +x.
    Time cubes yield time-surface curvature, not depth/geometric curvature.
    Missing-data footprints are invalidated rather than silently zero-filled.
    """
    values = np.asarray(volume, float)
    spacing = np.asarray(spacing, float)
    require(values.ndim == 3 and min(values.shape) >= 3 and values.size <= 2_000_000,
            "Provide a bounded genuine 3D cube with at least three samples per axis.")
    require(spacing.shape == (3,) and np.all(np.isfinite(spacing)) and np.all(spacing > 0),
            "Provide explicit x/y metres and vertical seconds or metres per sample.")
    require(domain in ("TWT", "depth"), "Confirm time or depth domain.")
    sigma = finite_number(sigma, "structure smoothing sigma", .25, 8)
    minimum_energy = finite_number(minimum_energy, "minimum structure energy", np.finfo(float).eps)
    finite = np.isfinite(values)
    safe = np.where(finite, values, 0)
    gradients = np.gradient(safe, *spacing, edge_order=2)
    tensor = np.empty(values.shape + (3, 3))
    for i in range(3):
        for j in range(i, 3):
            tensor[..., i, j] = tensor[..., j, i] = gaussian_filter(
                gradients[i] * gradients[j], sigma, mode="nearest", truncate=3)
    eigenvalues, eigenvectors = np.linalg.eigh(tensor)
    normal = eigenvectors[..., :, -1]
    nz = normal[..., 2]
    valid = (gaussian_filter(finite.astype(float), sigma, mode="nearest", truncate=3) > 1 - 1e-10)
    valid &= eigenvalues[..., -1] > minimum_energy
    valid &= np.abs(nz) > 1e-8
    p = np.divide(-normal[..., 0], nz, out=np.full_like(nz, np.nan), where=valid)
    q = np.divide(-normal[..., 1], nz, out=np.full_like(nz, np.nan), where=valid)
    # Differentiation needs its own validity footprint beyond the tensor footprint.
    px, py = np.gradient(p, spacing[0], spacing[1], axis=(0, 1))
    qx, qy = np.gradient(q, spacing[0], spacing[1], axis=(0, 1))
    mixed = .5 * (py + qx)
    mean = ((1 + q*q) * px - 2*p*q*mixed + (1+p*p)*qy) / (2*(1+p*p+q*q)**1.5)
    gaussian = (px*qy - mixed*mixed) / (1+p*p+q*q)**2
    azimuth = np.mod(np.degrees(np.arctan2(p, q)), 360)
    azimuth[~valid | (np.hypot(p, q) < 1e-10)] = np.nan
    coherence = np.divide(eigenvalues[..., -1] - eigenvalues[..., -2], eigenvalues[..., -1],
                          out=np.full_like(nz, np.nan), where=valid)
    return dict(dipX=p, dipY=q, azimuthDegrees=azimuth, coherence=coherence,
                meanCurvature=mean, gaussianCurvature=gaussian, valid=valid,
                dipUnit="s/m" if domain == "TWT" else "m/m",
                curvatureInterpretation="time-surface" if domain == "TWT" else "depth-surface")
