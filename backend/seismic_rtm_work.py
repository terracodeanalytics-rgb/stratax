"""Acoustic RTM/FWI orchestration wrappers. Not field-qualified."""
from __future__ import annotations

import numpy as np

from seismic_processing import finite_number, require


def rtm_image(session, observed):
    """
    Zero-lag cross-correlation RTM imaging condition using saved forward wavefields
    and the adjoint residual. Requires AcousticSession with approved save budget.
    """
    observed = np.asarray(observed, float)
    predicted, forward = session.forward(save=True)
    require(predicted.shape == observed.shape and np.all(np.isfinite(observed)), "Observations must match the receiver/time grid.")
    residual = predicted - observed
    # Adjoint source is the data residual; imaging uses mass_adjoint against saved forward.
    image = session.mass_adjoint(residual, forward)
    return dict(
        image=image,
        predicted=predicted,
        residual=residual,
        provenance=session.provenance | dict(imagingCondition="zero-lag-correlation", fieldScaleQualified=False),
    )


def fwi_gradient_step(session, observed, max_update_fraction=0.05):
    """One bounded FWI velocity update from the existing objective/gradient path."""
    max_update_fraction = finite_number(max_update_fraction, "max update fraction", np.finfo(float).eps, 0.5)
    observed = np.asarray(observed, float)
    objective, gradient, predicted = session.objective_gradient(observed)
    require(np.all(np.isfinite(gradient)), "Gradient contains non-finite values.")
    # Convert mass-style gradient to a relative velocity step bounded by max_update_fraction.
    scale = np.max(np.abs(gradient))
    require(scale > 0, "Gradient vanishes; no update.")
    # AcousticSession stores velocity in the model; recover SI vp from provenance shape.
    # Caller passes current velocity via session.model; read SI by multiplying km/s back.
    vp = np.array(session.model.vp.data[session.crop] * 1000.0, copy=True)
    step = -gradient / scale * max_update_fraction
    proposed = vp * (1.0 + step)
    proposed = np.clip(proposed, np.finfo(float).eps, session.maximum_velocity)
    return dict(
        objective=float(objective),
        gradient=gradient,
        predicted=predicted,
        proposedVelocity=proposed,
        maxUpdateFraction=max_update_fraction,
        provenance=session.provenance | dict(workflow="single-scale-fwi-step", fieldScaleQualified=False),
    )


def source_estimation_least_squares(predicted_green, observed, noise_floor=1e-6):
    """Estimate a source wavelet given Green's function traces and observations."""
    g = np.asarray(predicted_green, float)
    d = np.asarray(observed, float)
    require(g.shape == d.shape and g.ndim == 2, "Green's function and observations must share shape.")
    noise_floor = finite_number(noise_floor, "noise floor", np.finfo(float).eps)
    G = np.fft.rfft(g, axis=1)
    D = np.fft.rfft(d, axis=1)
    num = np.sum(np.conj(G) * D, axis=0)
    den = np.sum(np.abs(G) ** 2, axis=0)
    wavelet = np.fft.irfft(num / (den + noise_floor * np.max(den)), n=g.shape[1])
    return wavelet, dict(noiseFloor=noise_floor)
