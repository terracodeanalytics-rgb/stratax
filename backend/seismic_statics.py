"""Surface-consistent source/receiver delay fitting from reviewed timing residuals."""
import numpy as np
from scipy.sparse import coo_matrix, eye, vstack
from scipy.sparse.linalg import lsqr
from seismic_processing import finite_number, require


def fit_surface_statics(observed_times, predicted_times, source_ids, receiver_ids, *,
                        regularization=1e-3, maximum_shift_seconds, iterations=200):
    observed, predicted = np.asarray(observed_times, float), np.asarray(predicted_times, float)
    sources, receivers = np.asarray(source_ids), np.asarray(receiver_ids)
    require(observed.ndim == 1 and observed.shape == predicted.shape == sources.shape == receivers.shape
            and 3 <= len(observed) <= 250000, "Supply matching reviewed observed/predicted timing and acquisition identities.")
    require(np.all(np.isfinite(observed)) and np.all(np.isfinite(predicted)), "Timing observations/predictions must be finite seconds.")
    regularization = finite_number(regularization, "statics damping", np.finfo(float).eps)
    limit = finite_number(maximum_shift_seconds, "maximum permitted statics", np.finfo(float).eps)
    require(type(iterations) is int and 1 <= iterations <= 2000, "Use a bounded statics iteration count.")
    source_names, source_index = np.unique(sources, return_inverse=True)
    receiver_names, receiver_index = np.unique(receivers, return_inverse=True)
    columns = len(source_names)+len(receiver_names); rows = np.arange(len(observed))
    design = coo_matrix((np.ones(2*len(rows)), (np.r_[rows, rows],
        np.r_[source_index, len(source_names)+receiver_index])), shape=(len(rows), columns)).tocsr()
    residual = observed-predicted
    solution = lsqr(vstack([design, regularization*eye(columns)]), np.r_[residual, np.zeros(columns)],
                    atol=1e-10, btol=1e-10, iter_lim=iterations)
    delays = solution[0]; fitted = design @ delays
    require(np.max(np.abs(fitted)) <= limit, "Fitted statics exceed the reviewed limit; no values were silently clipped.")
    return dict(sourceIds=source_names.tolist(), receiverIds=receiver_names.tolist(),
                sourceDelays=delays[:len(source_names)], receiverDelays=delays[len(source_names):],
                correctionShifts=-fitted, residualAfter=residual-fitted,
                iterations=int(solution[2]), stopCode=int(solution[1]),
                conditionEstimate=float(solution[6]), gauge="minimum-norm damped source/receiver decomposition",
                correctionConvention="negative observed-minus-predicted delay; apply to original traces")
