"""Parabolic Radon with an exact discrete adjoint and damped least-squares fit."""
import numpy as np
from scipy.sparse.linalg import LinearOperator, lsqr
from seismic_processing import require, finite_number, complete


def radon_operator(offsets, curvatures, samples, dt):
    offsets, curvatures = np.asarray(offsets, float), np.asarray(curvatures, float)
    require(offsets.ndim == curvatures.ndim == 1 and len(offsets) > 0 and len(curvatures) > 0
            and np.all(np.isfinite(offsets)) and np.all(np.isfinite(curvatures)), "Supply finite offset/curvature axes.")
    require(type(samples) is int and samples >= 2, "Provide a positive sample count.")
    dt = finite_number(dt, "Radon sample interval", np.finfo(float).eps)
    def bins(curvature):
        x = np.arange(samples)[None, :] + curvature * offsets[:, None]**2 / dt
        low = np.floor(x).astype(np.int64); valid = (x >= 0) & (x <= samples-1)
        return np.clip(low, 0, samples-1), x-low, valid
    traces = np.broadcast_to(np.arange(len(offsets))[:, None], (len(offsets), samples))
    def forward(model):
        model = np.asarray(model).reshape(len(curvatures), samples); data = np.zeros((len(offsets), samples))
        for i, curvature in enumerate(curvatures):
            low, fraction, valid = bins(curvature)
            values = model[i][None, :] * valid
            np.add.at(data, (traces, low), values * (1-fraction))
            np.add.at(data, (traces, np.minimum(low+1, samples-1)), values * fraction)
        return data.ravel()
    def adjoint(data):
        data = np.asarray(data).reshape(len(offsets), samples); model = np.zeros((len(curvatures), samples))
        for i, curvature in enumerate(curvatures):
            low, fraction, valid = bins(curvature)
            model[i] = np.sum(valid * ((1-fraction)*data[traces, low]
                + fraction*data[traces, np.minimum(low+1, samples-1)]), axis=0)
        return model.ravel()
    return LinearOperator((len(offsets)*samples, len(curvatures)*samples), matvec=forward,
                          rmatvec=adjoint, dtype=float)


def radon_demultiple(block, offsets, curvatures, multiple_cut, *, regularization=.01, iterations=100):
    complete(block)
    require(block.domain == "TWT" and len(offsets) == len(block.samples), "Provide one offset per TWT trace.")
    regularization = finite_number(regularization, "Radon regularization", np.finfo(float).eps)
    require(type(iterations) is int and 1 <= iterations <= 500, "Use 1–500 Radon iterations.")
    curvatures = np.asarray(curvatures, float)
    multiple_cut = finite_number(multiple_cut, "multiple curvature cut")
    op = radon_operator(offsets, curvatures, block.samples.shape[1], block.dt)
    fit = lsqr(op, block.samples.ravel(), damp=regularization, atol=1e-8, btol=1e-8, iter_lim=iterations)
    model = fit[0].reshape(len(curvatures), block.samples.shape[1])
    multiples_model = np.where(curvatures[:, None] >= multiple_cut, model, 0.)
    multiples = (op @ multiples_model.ravel()).reshape(block.samples.shape)
    output = block.derive(block.samples - multiples, "regularised-parabolic-radon-demultiple",
        dict(regularization=regularization, iterations=int(fit[2]), stopCode=int(fit[1]),
             curvatures=curvatures.tolist(), multipleCut=multiple_cut, residualNorm=float(fit[3])))
    return output, dict(model=model, multiples=multiples, forwardResidual=(op @ fit[0]).reshape(block.samples.shape)-block.samples)
