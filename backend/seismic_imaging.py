"""Matrix-free Kirchhoff scattering and its exact discrete adjoint in SI units."""
import numpy as np
from scipy.sparse.linalg import LinearOperator

from seismic_processing import finite_number, require


def kirchhoff_operator(points, sources, receivers, *, samples, dt, start=0.0,
                       velocity=None, source_times=None, receiver_times=None,
                       aperture_metres, point_batch=1024):
    """One source/receiver pair per trace; homogeneous or reviewed one-way tables.

    The kinematic operator uses linear time interpolation with zero support outside
    the recording. Its transpose uses exactly the same weights. Apply an assessed
    wavelet separately; this operator does not invent amplitude calibration.
    """
    points, sources, receivers = (np.asarray(x, float) for x in (points, sources, receivers))
    require(points.ndim == sources.ndim == receivers.ndim == 2 and points.shape[1] in (2, 3),
            "Supply image and acquisition coordinates in genuine 2D or 3D.")
    require(sources.shape == receivers.shape and sources.shape[1] == points.shape[1]
            and len(points) > 0 and len(sources) > 0, "One source and receiver coordinate per trace is required.")
    require(all(np.all(np.isfinite(a)) for a in (points, sources, receivers)), "Coordinates must be finite SI metres.")
    require(type(samples) is int and samples >= 2 and type(point_batch) is int and point_batch > 0,
            "Provide positive bounded sample and point-batch sizes.")
    dt = finite_number(dt, "sample interval", np.finfo(float).eps)
    start = finite_number(start, "recording start")
    aperture = finite_number(aperture_metres, "migration aperture", np.finfo(float).eps)
    tables = source_times is not None or receiver_times is not None
    if tables:
        require(velocity is None and source_times is not None and receiver_times is not None,
                "Use both reviewed one-way time tables or a homogeneous velocity, not both.")
        source_times, receiver_times = (np.asarray(x, float) for x in (source_times, receiver_times))
        require(source_times.shape == receiver_times.shape == (len(points), len(sources)),
                "Travel-time tables must be image-point by trace.")
        require(np.all(np.isfinite(source_times)) and np.all(source_times >= 0)
                and np.all(np.isfinite(receiver_times)) and np.all(receiver_times >= 0),
                "One-way travel times must be finite nonnegative seconds.")
    else:
        velocity = finite_number(velocity, "homogeneous velocity", np.finfo(float).eps)
    midpoints = (sources + receivers) / 2

    def weights(first, stop):
        p = points[first:stop]
        travel = (source_times[first:stop] + receiver_times[first:stop]) if tables else (
            np.linalg.norm(p[:, None] - sources[None], axis=2)
            + np.linalg.norm(p[:, None] - receivers[None], axis=2)) / velocity
        coordinate = (travel - start) / dt
        lower = np.floor(coordinate).astype(np.int64)
        fraction = coordinate - lower
        valid = (coordinate >= 0) & (coordinate <= samples - 1)
        valid &= np.linalg.norm(p[:, None, :-1] - midpoints[None, :, :-1], axis=2) <= aperture
        return np.clip(lower, 0, samples - 1), fraction, valid

    def forward(model):
        model = np.asarray(model).reshape(len(points))
        data = np.zeros((len(sources), samples))
        for first in range(0, len(points), point_batch):
            stop = min(first + point_batch, len(points))
            lower, frac, valid = weights(first, stop)
            trace = np.broadcast_to(np.arange(len(sources)), lower.shape)
            amplitude = model[first:stop, None] * valid
            np.add.at(data, (trace, lower), amplitude * (1 - frac))
            np.add.at(data, (trace, np.minimum(lower + 1, samples - 1)), amplitude * frac)
        return data.ravel()

    def adjoint(data):
        data = np.asarray(data).reshape(len(sources), samples)
        model = np.zeros(len(points))
        for first in range(0, len(points), point_batch):
            stop = min(first + point_batch, len(points))
            lower, frac, valid = weights(first, stop)
            trace = np.broadcast_to(np.arange(len(sources)), lower.shape)
            model[first:stop] = np.sum(valid * ((1 - frac) * data[trace, lower]
                + frac * data[trace, np.minimum(lower + 1, samples - 1)]), axis=1)
        return model

    return LinearOperator((len(sources) * samples, len(points)), matvec=forward,
                          rmatvec=adjoint, dtype=np.float64)


def migrate_points(block, points, sources, receivers, **settings):
    from seismic_processing import complete
    complete(block)
    require(block.domain == "TWT", "Migration observations require TWT seconds.")
    operator = kirchhoff_operator(points, sources, receivers, samples=block.samples.shape[1],
                                  dt=block.dt, start=block.start, **settings)
    require(len(sources) == len(block.samples), "Acquisition must match every input trace.")
    return operator.rmatvec(block.samples.ravel())
