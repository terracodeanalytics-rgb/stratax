"""Surface-related first-order multiple prediction on reviewed common surface grids."""
import numpy as np
from scipy.fft import next_fast_len

from seismic_processing import finite_number, require


def predict_surface_multiples(response, dt, surface_coordinates, quadrature_weights,
                             source_wavelet, *, reflection_coefficient=-1.0,
                             regularization=1e-3, geometry_confirmed=False):
    """Predict R * W^-1 * R by surface integration, without circular convolution.

    response[source, receiver, time] must be complete, deghosted and collocated on
    the same reviewed surface grid. In 3D supply area weights, in 2D line weights.
    Irregular/missing acquisition must be explicitly regularised before this call.
    Source signature, reflection sign and integration normalization are caller data.
    """
    require(geometry_confirmed is True, "Review collocated source/receiver surface geometry first.")
    r = np.asarray(response, float)
    xy = np.asarray(surface_coordinates, float)
    q = np.asarray(quadrature_weights, float)
    wavelet = np.asarray(source_wavelet, float)
    require(r.ndim == 3 and r.shape[0] == r.shape[1] and r.shape[2] >= 2,
            "Supply a complete source-by-receiver-by-time reflection response.")
    n, _, nt = r.shape
    require(xy.shape in ((n, 1), (n, 2)) and len(np.unique(xy, axis=0)) == n,
            "Use distinct common surface points (one horizontal axis for 2D, two for 3D).")
    require(q.shape == (n,) and np.all(q > 0), "Supply one positive surface quadrature weight per point.")
    require(wavelet.ndim == 1 and 1 <= len(wavelet) <= nt and np.any(wavelet != 0),
            "Supply the sampled causal source signature, with its origin at sample zero.")
    require(all(np.all(np.isfinite(a)) for a in (r, xy, q, wavelet)), "Resolve non-finite reflection/geometry/signature samples.")
    dt = finite_number(dt, "sample interval", np.finfo(float).eps)
    regularization = finite_number(regularization, "signature regularization", np.finfo(float).eps)
    reflection_coefficient = finite_number(reflection_coefficient, "surface reflection coefficient", -1, 1)
    nfft = next_fast_len(2 * nt + len(wavelet) - 2)
    spectrum = np.fft.rfft(r, n=nfft, axis=2)
    signature = np.fft.rfft(wavelet, n=nfft)
    power = np.abs(signature) ** 2
    inverse = np.conj(signature) / (power + regularization * power.max())
    prediction = np.empty_like(spectrum)
    for frequency in range(spectrum.shape[2]):
        matrix = spectrum[:, :, frequency]
        prediction[:, :, frequency] = (matrix * q[None, :]) @ matrix * inverse[frequency]
    multiples = reflection_coefficient * dt * np.fft.irfft(prediction, n=nfft, axis=2)[:, :, :nt]
    return dict(multiples=multiples, dimension=xy.shape[1] + 1,
                method="surface-integral-first-order-srme", sampleIntervalSeconds=dt,
                limitations=["Complete collocated deghosted response required; first-order prediction, not adaptive subtraction."])
