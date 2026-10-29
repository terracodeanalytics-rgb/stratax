"""First-order isotropic fast marching on 2D/3D physical velocity grids."""
import heapq
import numpy as np
from seismic_processing import require


def first_arrival_times(velocity, spacing, source_index, *, cancelled=lambda: False):
    velocity, spacing = np.asarray(velocity, float), np.asarray(spacing, float)
    require(velocity.ndim in (2, 3) and min(velocity.shape) >= 2 and velocity.size <= 250000,
            "Provide a bounded genuine 2D/3D velocity grid.")
    require(np.all(np.isfinite(velocity)) and np.all(velocity > 0), "Interval velocity must be finite positive m/s.")
    require(spacing.shape == (velocity.ndim,) and np.all(np.isfinite(spacing)) and np.all(spacing > 0),
            "Provide one positive SI spacing per spatial axis.")
    require(isinstance(source_index, (list, tuple)) and len(source_index) == velocity.ndim
            and all(type(i) is int and 0 <= i < velocity.shape[a] for a, i in enumerate(source_index)),
            "Supply an explicit grid-node source index; off-grid acquisition is not rounded.")
    source = tuple(source_index); accepted = np.zeros(velocity.shape, bool)
    times = np.full(velocity.shape, np.inf); times[source] = 0; queue = [(0., source)]; completed = 0
    offsets = []
    for axis in range(velocity.ndim):
        for sign in (-1, 1):
            value = [0] * velocity.ndim; value[axis] = sign; offsets.append(tuple(value))

    def neighbours(index):
        for offset in offsets:
            other = tuple(i + j for i, j in zip(index, offset))
            if all(0 <= i < velocity.shape[a] for a, i in enumerate(other)):
                yield other

    def update(index):
        available = []
        for axis in range(velocity.ndim):
            best = np.inf
            for sign in (-1, 1):
                neighbour = list(index); neighbour[axis] += sign
                if 0 <= neighbour[axis] < velocity.shape[axis] and accepted[tuple(neighbour)]:
                    best = min(best, times[tuple(neighbour)])
            if np.isfinite(best): available.append((best, spacing[axis]))
        available.sort()
        if not available: return np.inf
        a = b = 0.; c = -1 / velocity[index]**2
        root = np.inf
        for number, (time, step) in enumerate(available):
            weight = 1 / step**2
            a += weight; b += time * weight; c += time*time*weight
            root = (b + np.sqrt(max(0., b*b - a*c))) / a
            if number == len(available)-1 or root <= available[number+1][0]: break
        return root

    while queue:
        time, index = heapq.heappop(queue)
        if accepted[index] or time > times[index]: continue
        accepted[index] = True; completed += 1
        if completed % 1024 == 0:
            require(not cancelled(), "Travel-time calculation cancelled.")
        for other in neighbours(index):
            if accepted[other]: continue
            proposed = update(other)
            if proposed < times[other]:
                times[other] = proposed; heapq.heappush(queue, (proposed, other))
    return times
