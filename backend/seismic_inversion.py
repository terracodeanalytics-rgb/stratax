"""Matrix-free deterministic inversion; calibrated observations and priors are explicit."""
import numpy as np
from scipy.sparse.linalg import lsqr

from seismic_processing import TraceBlock, complete, finite_number, require


def calibrated(block, wavelet, wavelet_dt, amplitude_review):
    complete(block)
    require(block.domain == "TWT", "Deterministic inversion requires a reviewed TWT axis in seconds.")
    require(amplitude_review is True, "Review the amplitude history before quantitative inversion.")
    forbidden = ("agc", "normalis", "normaliz", "display", "automaticgaincontrol")
    require(not any(any(name in str(h.get("method", "")).lower().replace(" ", "").replace("_", "").replace("-", "") for name in forbidden) or h.get("displayOnly") is True or h.get("amplitudePreserving") is False for h in block.history),
            "AGC, display products and trace-normalised amplitudes are not calibrated inversion observations.")
    wav = np.asarray(wavelet, dtype=float)
    require(wav.ndim == 1 and 3 <= len(wav) <= block.samples.shape[1] and len(wav) % 2 == 1 and np.all(np.isfinite(wav)) and np.max(np.abs(wav)) > 0,
            "Supply a finite, nonzero odd-length wavelet centred on zero lag.")
    finite_number(wavelet_dt, "wavelet sample interval", np.finfo(float).eps)
    require(np.isclose(block.dt, wavelet_dt, rtol=1e-10, atol=0), "Wavelet and observations must have the same sample interval; resample explicitly.")
    return wav


def _solve(operator, data, background, regularization, smoothness, iterations):
    from pylops import Identity, SecondDerivative, VStack
    regularization = finite_number(regularization, "background regularization", 0)
    smoothness = finite_number(smoothness, "smoothness regularization", 0)
    require(type(iterations) is int and 1 <= iterations <= 10000, "Choose 1–10000 solver iterations.")
    b = background.ravel()
    residual = data.ravel() - operator.matvec(b)
    ops, target = [operator], [residual]
    if regularization:
        ops.append(regularization*Identity(operator.shape[1], dtype="float64"))
        target.append(np.zeros(operator.shape[1]))
    if smoothness:
        ops.append(smoothness*SecondDerivative(background.shape, axis=0, dtype="float64"))
        target.append(np.zeros(operator.shape[1]))
    system = VStack(ops)
    solution = lsqr(system, np.concatenate(target), atol=1e-10, btol=1e-10, iter_lim=iterations)
    model = (b+solution[0]).reshape(background.shape)
    prediction = operator.matvec(model.ravel()).reshape(data.shape)
    require(np.all(np.isfinite(model)) and np.all(np.isfinite(prediction)), "The inverse solution is non-finite; review conditioning and regularization.")
    return model, prediction, dict(stopCode=int(solution[1]), iterations=int(solution[2]),
                                  residualNorm=float(np.linalg.norm(data-prediction)),
                                  augmentedResidualNorm=float(solution[3]), conditionEstimate=float(solution[6]),
                                  converged=solution[1] in (0, 1, 2, 4, 5),
                                  regularization=regularization, smoothness=smoothness,
                                  backgroundDependent=True)


def poststack_inversion(block, wavelet, wavelet_dt, background_impedance, *, amplitude_review,
                        regularization=.1, smoothness=0., iterations=200, cancelled=lambda: False):
    """Solve for log acoustic impedance; no missing low frequencies are claimed as observations."""
    from pylops.avo.poststack import PoststackLinearModelling
    wav = calibrated(block, wavelet, wavelet_dt, amplitude_review)
    background = np.asarray(background_impedance, float)
    require(background.shape == block.samples.shape and np.all(np.isfinite(background)) and np.all(background > 0),
            "Supply positive background acoustic impedance (kg/m²/s) at every observation sample.")
    operator = .5*PoststackLinearModelling(wav, block.samples.shape[1], kind="centered")
    models, predictions, diagnostics = [], [], []
    for data, prior in zip(block.samples, background):
        require(not cancelled(), "Inversion cancelled before the next trace.")
        model, predicted, diagnostic = _solve(operator, data, np.log(prior), regularization, smoothness, iterations)
        with np.errstate(over="ignore"):
            impedance = np.exp(model)
        require(np.all(np.isfinite(impedance)), "Impedance overflowed; review amplitude calibration and the background.")
        models.append(impedance)
        predictions.append(predicted)
        diagnostics.append(diagnostic)
    prediction = block.derive(np.asarray(predictions), "poststack-linear-forward", {"waveletDt": wavelet_dt})
    residual = block.derive(block.samples-prediction.samples, "poststack-inversion-residual", {})
    return dict(impedance=np.asarray(models), impedanceUnit="kg/m²/s", predicted=prediction, residual=residual,
                diagnostics=diagnostics, modelling="0.5 × wavelet convolution × centred log-impedance difference",
                warning="Band-limited deterministic estimate; low-frequency impedance depends on the supplied background.")


def prestack_inversion(gather, angles_degrees, wavelet, wavelet_dt, background, *, amplitude_review,
                       regularization=.1, smoothness=0., iterations=300):
    """One calibrated angle gather, with Vp/Vs/density priors. Stacked data cannot supply angles."""
    from pylops.avo.prestack import PrestackLinearModelling
    wav = calibrated(gather, wavelet, wavelet_dt, amplitude_review)
    angles = np.asarray(angles_degrees, float)
    require(angles.ndim == 1 and len(angles) == len(gather.samples) and len(angles) >= 3 and np.all(np.isfinite(angles)) and np.all(np.diff(angles) > 0) and angles[0] >= 0 and angles[-1] <= 45,
            "Supply at least three distinct reviewed incident angles (0–45 degrees), one per observed angle trace.")
    prior = np.asarray(background, float)
    nt = gather.samples.shape[1]
    require(prior.shape == (nt, 3) and np.all(np.isfinite(prior)) and np.all(prior > 0) and np.all(prior[:, 1] < prior[:, 0]),
            "Supply sample-aligned positive Vp (m/s), Vs (m/s) and density (kg/m³), with Vs < Vp.")
    operator = PrestackLinearModelling(wav, angles, vsvp=prior[:, 1]/prior[:, 0], nt0=nt, linearization="akirich", kind="centered")
    model, prediction, diagnostic = _solve(operator, gather.samples.T, np.log(prior), regularization, smoothness, iterations)
    with np.errstate(over="ignore"):
        properties = np.exp(model)
    require(np.all(np.isfinite(properties)) and np.all(properties[:, 1] < properties[:, 0]), "The inferred elastic properties are invalid; review priors, data and regularization.")
    return dict(properties=properties, propertyNames=["Vp", "Vs", "density"], units=["m/s", "m/s", "kg/m³"],
                predicted=gather.derive(prediction.T, "aki-richards-forward", {"anglesDegrees": angles.tolist()}),
                residual=gather.derive(gather.samples-prediction.T, "prestack-inversion-residual", {}), diagnostics=diagnostic,
                warning="Linearised isotropic Aki–Richards approximation; density/Vs separation and low frequencies can be poorly constrained.")
