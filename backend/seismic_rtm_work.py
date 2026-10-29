"""Acoustic RTM/FWI orchestration wrappers. Not field-qualified."""
from __future__ import annotations

import numpy as np
import hashlib
import json

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
    image, illumination = session.correlation_image(observed, forward)
    return dict(
        image=image,
        predicted=predicted,
        residual=residual,
        illumination=illumination,
        provenance=session.provenance | dict(imagingCondition="zero-lag-correlation", fieldScaleQualified=False),
    )


def _band_filter(values, dt, band):
    if band is None:
        return np.asarray(values, float)
    low, high = float(band["lowHz"]), float(band["highHz"])
    require(0 < low < high < .5 / dt, "FWI frequency band must lie below Nyquist.")
    frequencies = np.fft.rfftfreq(values.shape[-1], dt)
    mask = (frequencies >= low) & (frequencies <= high)
    require(np.any(mask), "Recording duration cannot resolve the requested frequency band.")
    return np.fft.irfft(np.fft.rfft(values, axis=-1) * mask, n=values.shape[-1], axis=-1)


def _objective(session, observed, band, gradient=False):
    if isinstance(session, AcousticSurvey):
        return session.evaluate(observed, band, gradient)
    predicted, wavefield = session.forward(save=gradient)
    require(predicted.shape == observed.shape and np.all(np.isfinite(observed)),
            "Observations must match the exact receiver/time grid.")
    residual = _band_filter(predicted - observed, session.dt, band)
    value = .5 * float(np.vdot(residual, residual))
    if gradient:
        return value, session.mass_adjoint(_band_filter(residual, session.dt, band), wavefield), predicted
    return value


def fwi_gradient_step(session, observed, max_update_fraction=0.05, *, band=None,
                      minimum_velocity=1.0, maximum_backtracks=16):
    """One bounded FWI velocity update from the existing objective/gradient path."""
    max_update_fraction = finite_number(max_update_fraction, "max update fraction", np.finfo(float).eps, 0.5)
    observed = np.asarray(observed, float)
    minimum_velocity = finite_number(minimum_velocity, "minimum velocity", np.finfo(float).eps)
    require(type(maximum_backtracks) is int and 1 <= maximum_backtracks <= 32, "Use 1–32 line-search evaluations.")
    objective, gradient, predicted = _objective(session, observed, band, gradient=True)
    require(np.all(np.isfinite(gradient)), "Gradient contains non-finite values.")
    # Convert mass-style gradient to a relative velocity step bounded by max_update_fraction.
    vp = np.array(session.model.vp.data[session.crop] * 1000.0, copy=True)
    require(np.all(vp >= minimum_velocity) and minimum_velocity < session.maximum_velocity, "Review velocity bounds against the initial model.")
    velocity_gradient = -2 * gradient / vp**3
    scale = np.max(np.abs(velocity_gradient) / vp)
    require(scale > 0, "Gradient vanishes; no update.")
    # AcousticSession stores velocity in the model; recover SI vp from provenance shape.
    # Caller passes current velocity via session.model; read SI by multiplying km/s back.
    direction = -velocity_gradient / scale * max_update_fraction
    proposed, after, accepted, evaluations = vp.copy(), objective, False, []
    try:
        for iteration in range(maximum_backtracks):
            candidate = np.clip(vp + direction * 0.5**iteration, minimum_velocity, session.maximum_velocity)
            derivative = float(np.vdot(velocity_gradient, candidate - vp))
            if derivative >= 0:
                break
            session.set_velocity(candidate)
            value = _objective(session, observed, band)
            evaluations.append(dict(step=0.5**iteration, objective=value))
            if np.isfinite(value) and value <= objective + 1e-4 * derivative:
                proposed, after, accepted = candidate, value, True
                break
    finally:
        session.set_velocity(vp)
    return dict(
        objective=float(objective),
        gradient=gradient,
        velocityGradient=velocity_gradient,
        objectiveAfter=after,
        accepted=accepted,
        lineSearch=evaluations,
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
    require(np.max(den) > 0, "Green's functions have no energy for source estimation.")
    wavelet = np.fft.irfft(num / (den + noise_floor * np.max(den)), n=g.shape[1])
    return wavelet, dict(noiseFloor=noise_floor)


def multi_scale_fwi_plan(frequency_bands_hz, max_steps_per_band=5):
    """
    Ordered multi-scale FWI schedule. Does not invent bands; caller supplies reviewed corners.
    MPI/OpenACC distribution remains a separate worker profile — this only sequences scales.
    """
    require(isinstance(frequency_bands_hz, list) and 1 <= len(frequency_bands_hz) <= 32, "Provide 1–32 reviewed frequency bands.")
    require(type(max_steps_per_band) is int and 1 <= max_steps_per_band <= 50, "Steps per band must be 1–50.")
    plan = []
    previous_high = None
    for i, band in enumerate(frequency_bands_hz):
        require(isinstance(band, (list, tuple)) and len(band) == 2, "Each band must be [lowHz, highHz].")
        low, high = float(band[0]), float(band[1])
        require(np.isfinite(low) and np.isfinite(high) and 0 < low < high, "Band corners must be finite with low < high.")
        if previous_high is not None:
            require(low >= previous_high * 0.5, "Scales must not jump down aggressively; review band ordering.")
        plan.append(dict(scale=i, lowHz=low, highHz=high, maxSteps=max_steps_per_band))
        previous_high = high
    return dict(
        bands=plan,
        totalSteps=len(plan) * max_steps_per_band,
        limitations=["Schedule only; each step still needs AcousticSession + observed data.", "Not an MPI/OpenACC launcher."],
        fieldScaleQualified=False,
    )


def apply_fwi_plan_step(session, observed, band, max_update_fraction=0.05):
    """One FWI step annotated with the active frequency band metadata."""
    require(isinstance(band, dict) and "lowHz" in band and "highHz" in band, "Provide a band from multi_scale_fwi_plan.")
    step = fwi_gradient_step(session, observed, max_update_fraction=max_update_fraction, band=band)
    step["band"] = dict(lowHz=float(band["lowHz"]), highHz=float(band["highHz"]), scale=band.get("scale"))
    step["provenance"] = step["provenance"] | dict(workflow="multi-scale-fwi-step", band=step["band"])
    return step


def run_multiscale_fwi(session, observed, plan, *, max_update_fraction=0.05,
                       cancelled=lambda: False, checkpoint=lambda value: None, resumed=None):
    """Iterate reviewed bands with descent checks; caller owns checkpoint persistence."""
    require(isinstance(plan, dict) and isinstance(plan.get("bands"), list) and plan["bands"], "Provide a reviewed FWI plan.")
    observed = np.asarray(observed, float)
    initial = np.array(session.model.vp.data[session.crop]*1000, copy=True)
    identity = hashlib.sha256(json.dumps(dict(plan=plan, provenance=session.provenance,
        maximumUpdate=max_update_fraction), sort_keys=True, allow_nan=False).encode()
        + initial.tobytes() + observed.tobytes()).hexdigest()
    history = []; next_scale = next_iteration = 0
    if resumed is not None:
        require(resumed.get("fingerprint") == identity, "FWI checkpoint inputs, plan or initial model changed.")
        next_scale, next_iteration = resumed["nextScale"], resumed["nextIteration"]
        require(type(next_scale) is int and type(next_iteration) is int and 0 <= next_scale <= len(plan["bands"])
                and next_iteration >= 0, "Invalid completed FWI checkpoint position.")
        history = list(resumed["history"]); session.set_velocity(resumed["velocity"])
    for scale, band in enumerate(plan["bands"]):
        if scale < next_scale: continue
        require(type(band.get("maxSteps")) is int and 1 <= band["maxSteps"] <= 50,
                "Each FWI scale requires a bounded iteration count.")
        begin = next_iteration if scale == next_scale else 0
        require(begin <= band["maxSteps"], "Checkpoint iteration exceeds its frequency plan.")
        for iteration in range(begin, band["maxSteps"]):
            require(not cancelled(), "FWI cancelled at a completed iteration boundary.")
            step = apply_fwi_plan_step(session, np.asarray(observed, float), band, max_update_fraction)
            history.append(dict(scale=band["scale"], iteration=iteration, objective=step["objective"],
                                objectiveAfter=step["objectiveAfter"], accepted=step["accepted"]))
            if not step["accepted"]:
                break
            session.set_velocity(step["proposedVelocity"])
            completed_scale = iteration + 1 == band["maxSteps"]
            checkpoint(dict(fingerprint=identity, velocity=step["proposedVelocity"].copy(), history=list(history),
                            nextScale=scale+1 if completed_scale else scale,
                            nextIteration=0 if completed_scale else iteration+1))
    return dict(velocity=np.array(session.model.vp.data[session.crop] * 1000, copy=True), history=history)


class AcousticSurvey:
    """Sequential multishot reduction with one saved shot wavefield at a time."""
    def __init__(self, sessions):
        require(isinstance(sessions, list) and sessions, "Provide reviewed acoustic shot sessions.")
        first = sessions[0]
        require(all(s.shape == first.shape and s.dt == first.dt and s.nt == first.nt
                    and s.maximum_velocity == first.maximum_velocity and s.crop == first.crop
                    and s.provenance["spacingMetres"] == first.provenance["spacingMetres"]
                    and s.provenance["originMetres"] == first.provenance["originMetres"] for s in sessions),
                "All shots must share the exact spatial/time model and reviewed velocity bound.")
        self.sessions = sessions; self.model = first.model; self.crop = first.crop
        self.maximum_velocity = first.maximum_velocity; self.dt = first.dt; self.nt = first.nt
        self.provenance = dict(engine="Devito", shots=[s.provenance for s in sessions], reduction="fixed-shot-order")
    def set_velocity(self, velocity):
        for session in self.sessions: session.set_velocity(velocity)
    def evaluate(self, observed, band, gradient):
        require(observed.ndim == 2 and observed.shape == (sum(s.geometry.nrec for s in self.sessions), self.nt),
                "Concatenate actual shot observations in the declared shot order.")
        value = 0.; total = np.zeros(self.sessions[0].shape); predicted = []; offset = 0
        for session in self.sessions:
            count = session.geometry.nrec; data = observed[offset:offset+count]; offset += count
            if gradient:
                objective, derivative, calculation = _objective(session, data, band, True)
                value += objective; total += derivative; predicted.append(calculation)
            else:
                value += _objective(session, data, band)
        return (value, total, np.concatenate(predicted, axis=0)) if gradient else value


def rtm_survey(sessions, observations, *, cancelled=lambda: False, checkpoint=lambda value: None):
    require(isinstance(sessions, list) and len(sessions) == len(observations) and sessions,
            "Provide observed receiver records for every reviewed shot.")
    AcousticSurvey(sessions)
    image = np.zeros(sessions[0].shape); illumination = np.zeros_like(image)
    for index, (session, observed) in enumerate(zip(sessions, observations)):
        require(not cancelled(), "RTM cancelled at a completed shot boundary.")
        output = rtm_image(session, observed)
        image += output["image"]; illumination += output["illumination"]
        checkpoint(dict(completedShots=index+1, image=image.copy(), illumination=illumination.copy()))
    return dict(image=image, illumination=illumination, shots=len(sessions), reduction="fixed-shot-order")


def rtm_illumination_weight(image, illumination, floor=1e-6):
    """Divide RTM image by source illumination; refuse silent division by zero."""
    img = np.asarray(image, float)
    illum = np.asarray(illumination, float)
    require(img.shape == illum.shape and np.all(np.isfinite(img)), "Image and illumination must match with finite image samples.")
    floor = finite_number(floor, "illumination floor", np.finfo(float).eps)
    require(np.all(np.isfinite(illum)) and np.any(illum > floor), "Illumination must be finite with support above the floor.")
    weighted = np.divide(img, np.maximum(illum, floor))
    return dict(image=weighted, floor=floor, illuminatedCells=int(np.sum(illum > floor)))
