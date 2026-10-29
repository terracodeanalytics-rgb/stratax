"""Seismic numerical operators. Inputs are analytical samples in explicit SI axes."""
from dataclasses import dataclass, field

import numpy as np
from scipy import ndimage, signal
from scipy.interpolate import PchipInterpolator


class SeismicError(ValueError):
    """A scientific input problem safe to show with its parameter context."""


def require(condition, message):
    if not condition:
        raise SeismicError(message)


def finite_number(value, name, low=None, high=None):
    require(type(value) in (float, int) and np.isfinite(value), f"Provide a finite {name}.")
    require(low is None or value >= low, f"{name} is below its supported range.")
    require(high is None or value <= high, f"{name} is above its supported range.")
    return float(value)


@dataclass
class TraceBlock:
    """Rectangular processing block; false mask cells are never zero-amplitude observations."""
    samples: np.ndarray
    dt: float
    start: float = 0.0
    domain: str = "TWT"
    mask: np.ndarray | None = None
    history: list = field(default_factory=list)

    def __post_init__(self):
        self.samples = np.asarray(self.samples, dtype=np.float64)
        require(self.samples.ndim == 2 and min(self.samples.shape) > 0, "Supply a nonempty trace-by-sample block.")
        self.dt = finite_number(self.dt, "sample interval", np.finfo(float).eps)
        self.start = finite_number(self.start, "axis start")
        require(self.domain in ("TWT", "depth"), "Confirm TWT seconds or depth metres.")
        finite = np.isfinite(self.samples)
        if self.mask is None:
            self.mask = finite
        else:
            self.mask = np.asarray(self.mask, dtype=bool)
            require(self.mask.shape == self.samples.shape, "Validity mask must match the trace block.")
            self.mask = self.mask & finite
        self.samples = np.where(self.mask, self.samples, np.nan)

    @property
    def axis(self):
        return self.start + np.arange(self.samples.shape[1]) * self.dt

    def derive(self, values, method, parameters, mask=None, dt=None, start=None):
        return TraceBlock(values, self.dt if dt is None else dt, self.start if start is None else start,
                          self.domain, np.isfinite(values) if mask is None else mask,
                          [*self.history, {"method": method, "parameters": parameters}])


def complete(block):
    require(np.all(block.mask), "Resolve or explicitly exclude missing samples before this operator; no gaps were filled.")


def detrend(block, mode="linear"):
    complete(block)
    require(mode in ("linear", "constant"), "Choose linear or constant detrending.")
    return block.derive(signal.detrend(block.samples, axis=1, type=mode), "detrend", {"mode": mode})


def bandpass(block, low, high, order=4):
    complete(block)
    require(block.domain == "TWT", "Frequency filtering requires time-domain samples.")
    low = finite_number(low, "low frequency", np.finfo(float).eps)
    high = finite_number(high, "high frequency", low)
    require(high > low and high < .5 / block.dt, "Choose low < high below Nyquist.")
    require(type(order) is int and 1 <= order <= 12, "Filter order must be 1–12.")
    sos = signal.butter(order, [low, high], btype="bandpass", fs=1 / block.dt, output="sos")
    require(block.samples.shape[1] > 3 * (2 * len(sos) + 1), "Trace is too short for the requested zero-phase filter.")
    return block.derive(signal.sosfiltfilt(sos, block.samples, axis=1), "bandpass", dict(low=low, high=high, order=order, phase="zero"))


def resample(block, up, down):
    complete(block)
    require(type(up) is int and type(down) is int and 1 <= up <= 100 and 1 <= down <= 100, "Use integer resampling factors from 1 to 100.")
    return block.derive(signal.resample_poly(block.samples, up, down, axis=1), "resample-polyphase",
                        dict(up=up, down=down, antiAlias=True), dt=block.dt * down / up)


def static_shift(block, shifts):
    """Positive seconds/metres delay the data; interpolation support remains masked."""
    shifts = np.asarray(shifts, dtype=float)
    require(shifts.shape == (len(block.samples),) and np.all(np.isfinite(shifts)), "Provide one finite shift per trace in the axis unit.")
    output = np.full_like(block.samples, np.nan)
    positions = np.arange(block.samples.shape[1])
    for i, shift in enumerate(shifts):
        output[i] = np.interp(positions - shift / block.dt, positions, block.samples[i], left=np.nan, right=np.nan)
    return block.derive(output, "static-shift", {"shifts": shifts.tolist(), "positive": "delay"})


def elevation_statics(source_elevation, receiver_elevation, datum, replacement_velocity):
    source, receiver = np.broadcast_arrays(np.asarray(source_elevation, float), np.asarray(receiver_elevation, float))
    require(np.all(np.isfinite(source)) and np.all(np.isfinite(receiver)), "Supply complete source/receiver elevations in metres, positive up.")
    datum = finite_number(datum, "datum elevation")
    velocity = finite_number(replacement_velocity, "replacement velocity", np.finfo(float).eps)
    return ((source - datum) + (receiver - datum)) / velocity


def nmo(block, offsets, velocity, max_stretch=.3):
    complete(block)
    require(block.domain == "TWT" and block.start >= 0, "NMO requires nonnegative two-way time seconds.")
    offsets = np.asarray(offsets, float)
    require(offsets.shape == (len(block.samples),) and np.all(np.isfinite(offsets)), "Supply one source-receiver offset in metres per trace.")
    velocity = np.broadcast_to(np.asarray(velocity, float), block.axis.shape)
    require(np.all(np.isfinite(velocity)) and np.all(velocity > 0), "Supply positive RMS/stacking velocities in m/s at every output time.")
    max_stretch = finite_number(max_stretch, "maximum stretch", 0, 10)
    t0 = block.axis
    out = np.full_like(block.samples, np.nan)
    for i, offset in enumerate(offsets):
        t = np.sqrt(t0 * t0 + (offset / velocity) ** 2)
        stretch = np.divide(t - t0, t0, out=np.full_like(t0, np.inf), where=t0 > 0)
        if offset == 0:
            stretch[:] = 0
        values = np.interp(t, t0, block.samples[i], left=np.nan, right=np.nan)
        out[i] = np.where(stretch <= max_stretch, values, np.nan)
    return block.derive(out, "nmo", dict(offsets=offsets.tolist(), velocity=velocity.tolist(), maxStretch=max_stretch))


def stack(block, weights=None):
    weights = np.ones(len(block.samples)) if weights is None else np.asarray(weights, float)
    require(weights.shape == (len(block.samples),) and np.all(np.isfinite(weights)) and np.all(weights >= 0) and np.any(weights > 0), "Provide nonnegative finite trace weights with positive support.")
    support = np.sum(block.mask * weights[:, None], axis=0)
    values = np.divide(np.sum(np.where(block.mask, block.samples, 0) * weights[:, None], axis=0), support,
                       out=np.full(block.samples.shape[1], np.nan), where=support > 0)
    return block.derive(values[None, :], "weighted-stack", {"weights": weights.tolist()}), support


def semblance(block, offsets, velocities, window=11, max_stretch=.3):
    require(type(window) is int and window >= 1 and window % 2 == 1, "Use a positive odd semblance window.")
    velocities = np.asarray(velocities, float)
    require(velocities.ndim == 1 and 1 <= len(velocities) <= 500, "Provide 1–500 trial velocities.")
    result = []
    for v in velocities:
        corrected = nmo(block, offsets, v, max_stretch)
        x = np.where(corrected.mask, corrected.samples, 0)
        count = corrected.mask.sum(axis=0)
        numerator = ndimage.uniform_filter1d(x.sum(axis=0) ** 2, window, mode="constant")
        denominator = ndimage.uniform_filter1d(count * (x * x).sum(axis=0), window, mode="constant")
        result.append(np.divide(numerator, denominator, out=np.zeros_like(numerator), where=denominator > 0))
    return np.clip(result, 0, 1)


def fk_filter(block, spacing, minimum_velocity):
    complete(block)
    require(block.domain == "TWT" and len(block.samples) >= 4, "FK filtering needs at least four regularly spaced time traces.")
    spacing = finite_number(spacing, "reviewed trace spacing", np.finfo(float).eps)
    velocity = finite_number(minimum_velocity, "minimum apparent velocity", np.finfo(float).eps)
    f = np.fft.rfftfreq(block.samples.shape[1], block.dt)[None, :]
    k = np.fft.fftfreq(len(block.samples), spacing)[:, None]
    keep = np.abs(k) <= f / velocity
    transformed = np.fft.rfft2(block.samples)
    return block.derive(np.fft.irfft2(transformed * keep, s=block.samples.shape), "fk-high-velocity-pass", dict(spacing=spacing, minimumVelocity=velocity))


def attributes(block, window=11):
    complete(block)
    require(type(window) is int and 1 <= window <= block.samples.shape[1], "RMS window must fit inside each trace.")
    analytic = signal.hilbert(block.samples, axis=1)
    envelope = np.abs(analytic)
    phase = np.angle(analytic)
    frequency = np.gradient(np.unwrap(phase, axis=1), block.dt, axis=1) / (2 * np.pi)
    frequency[envelope <= np.finfo(float).eps * max(1, envelope.max())] = np.nan
    return dict(envelope=envelope, phase=phase, frequency=frequency,
                rms=np.sqrt(ndimage.uniform_filter1d(block.samples ** 2, window, axis=1, mode="nearest")))


def dix_interval(times, rms):
    times, rms = np.asarray(times, float), np.asarray(rms, float)
    require(times.ndim == 1 and times.shape == rms.shape and len(times) >= 2, "Provide matching time/RMS velocity functions.")
    require(np.all(np.isfinite(times)) and np.all(np.diff(times) > 0) and times[0] >= 0 and np.all(np.isfinite(rms)) and np.all(rms > 0), "Times must increase and RMS velocities must be positive SI values.")
    v2 = np.diff(times * rms ** 2) / np.diff(times)
    require(np.all(v2 > 0), "Dix conversion gives nonpositive interval velocity; review the RMS function.")
    return np.sqrt(v2)


def time_depth(depth, sonic, checkshot_depth=None, checkshot_twt=None):
    """Integrate seconds/metre to TWT and apply reviewed checkshot drift, without extrapolation."""
    depth, sonic = np.asarray(depth, float), np.asarray(sonic, float)
    require(depth.ndim == 1 and depth.shape == sonic.shape and len(depth) >= 2 and np.all(np.isfinite(depth)) and np.all(np.diff(depth) > 0), "Provide increasing depth metres and matching sonic seconds/metre.")
    require(np.all(np.isfinite(sonic)) and np.all(sonic > 0), "Sonic coverage must be complete and positive.")
    twt = np.r_[0, np.cumsum(np.diff(depth) * (sonic[:-1] + sonic[1:]))]
    require((checkshot_depth is None) == (checkshot_twt is None), "Provide both checkshot depths and TWT seconds.")
    if checkshot_depth is not None:
        d, t = np.asarray(checkshot_depth, float), np.asarray(checkshot_twt, float)
        require(d.ndim == 1 and d.shape == t.shape and len(d) >= 2 and np.all(np.isfinite(d)) and np.all(np.isfinite(t)) and np.all(np.diff(d) > 0) and np.all(np.diff(t) > 0), "Checkshot depths and TWT must be finite and increasing.")
        require(d[0] >= depth[0] and d[-1] <= depth[-1], "Checkshots must lie inside the sonic support.")
        drift = t - np.interp(d, depth, twt)
        corrected = twt + PchipInterpolator(d, drift, extrapolate=False)(depth)
        valid = np.isfinite(corrected)
        require(np.all(np.diff(corrected[valid]) > 0), "Calibration reverses time; review checkshots and sonic drift.")
        return corrected
    return twt


def ricker(dt, frequency, duration):
    dt = finite_number(dt, "sample interval", np.finfo(float).eps)
    frequency = finite_number(frequency, "frequency", np.finfo(float).eps, .5 / dt)
    duration = finite_number(duration, "wavelet duration", 2 * dt, 10)
    half = int(np.ceil(duration / (2 * dt)))
    t = np.arange(-half, half + 1) * dt
    z = (np.pi * frequency * t) ** 2
    return t, (1 - 2 * z) * np.exp(-z)


def synthetic(vp, density, wavelet):
    vp, density, wavelet = np.asarray(vp, float), np.asarray(density, float), np.asarray(wavelet, float)
    require(vp.ndim == 1 and vp.shape == density.shape and len(vp) >= 2 and np.all(np.isfinite(vp)) and np.all(vp > 0) and np.all(np.isfinite(density)) and np.all(density > 0), "Use complete positive velocity/density logs resampled to uniform TWT.")
    require(wavelet.ndim == 1 and len(wavelet) % 2 == 1 and np.all(np.isfinite(wavelet)), "Supply a finite odd-length centred wavelet.")
    impedance = vp * density
    reflectivity = np.r_[0, np.diff(impedance) / (impedance[1:] + impedance[:-1])]
    return reflectivity, signal.convolve(reflectivity, wavelet, mode="same")


def avo_fit(amplitudes, angles, model="shuey2"):
    a, angles = np.asarray(amplitudes, float), np.asarray(angles, float)
    require(a.ndim == 2 and a.shape[0] == len(angles), "Supply angle-by-sample amplitudes.")
    require(np.all(np.isfinite(a)) and np.all(np.isfinite(angles)) and np.all((angles >= 0) & (angles < 60)), "Supply finite amplitudes and incidence angles from 0 to below 60 degrees.")
    theta = np.deg2rad(angles)
    columns = [np.ones_like(theta), np.sin(theta) ** 2]
    require(model in ("shuey2", "shuey3"), "Choose shuey2 or shuey3.")
    if model == "shuey3":
        columns.append(np.tan(theta) ** 2 - np.sin(theta) ** 2)
    matrix = np.column_stack(columns)
    require(np.linalg.matrix_rank(matrix) == len(columns), "Angles do not constrain the requested AVO fit.")
    coefficients, _, _, singular = np.linalg.lstsq(matrix, a, rcond=None)
    return dict(coefficients=coefficients, predicted=matrix @ coefficients, residual=a - matrix @ coefficients,
                condition=float(singular[0] / singular[-1]))


def repeatability(baseline, monitor, mask=None):
    b, m = np.asarray(baseline, float), np.asarray(monitor, float)
    require(b.shape == m.shape and b.ndim == 2, "Use co-registered baseline/monitor trace blocks.")
    valid = np.isfinite(b) & np.isfinite(m)
    if mask is not None:
        require(np.shape(mask) == b.shape, "Stable-region mask must match both vintages.")
        valid &= np.asarray(mask, bool)
    require(np.any(valid), "Select a common valid comparison region.")
    x, y = b[valid], m[valid]
    rms = lambda a: float(np.sqrt(np.mean(a * a)))
    denominator = rms(x) + rms(y)
    correlation = float(np.corrcoef(x, y)[0, 1]) if x.std() > 0 and y.std() > 0 else None
    return dict(nrmsPercent=200 * rms(x - y) / denominator if denominator else 0., correlation=correlation, validSamples=int(valid.sum()))


def equalise(baseline, monitor, stable_mask, max_lag=10):
    """Fit a single lag and scalar only on stable support, then apply to the monitor."""
    require(baseline.dt == monitor.dt and baseline.start == monitor.start and baseline.domain == monitor.domain and baseline.samples.shape == monitor.samples.shape, "Explicitly co-register the vintages first.")
    require(type(max_lag) is int and 0 <= max_lag <= 1000, "Lag search must be 0–1000 samples.")
    mask = np.asarray(stable_mask, bool)
    require(mask.shape == baseline.samples.shape, "Select an explicit stable-region mask.")
    candidates = []
    for lag in range(-max_lag, max_lag + 1):
        shifted = static_shift(monitor, np.full(len(monitor.samples), lag * monitor.dt))
        valid = mask & baseline.mask & shifted.mask
        if valid.sum() < 3:
            continue
        x, y = shifted.samples[valid], baseline.samples[valid]
        norm = np.dot(x, x)
        if norm <= 0:
            continue
        scale = float(np.dot(x, y) / norm)
        candidates.append((float(np.mean((scale * x - y) ** 2)), abs(lag), lag, scale, shifted))
    require(bool(candidates), "Stable region has insufficient common signal for matching.")
    _, _, lag, scale, shifted = min(candidates, key=lambda c: (c[0], c[1]))
    result = shifted.derive(shifted.samples * scale, "stable-global-equalisation", dict(lagSamples=lag, scale=scale))
    return result, dict(lagSamples=lag, scale=scale, before=repeatability(baseline.samples, monitor.samples, mask), after=repeatability(baseline.samples, result.samples, mask))
