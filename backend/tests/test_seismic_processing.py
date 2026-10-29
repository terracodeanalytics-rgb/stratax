import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
import pytest

from seismic_processing import (TraceBlock, SeismicError, attributes, avo_fit, bandpass,
                                detrend, dix_interval, elevation_statics, equalise,
                                fk_filter, nmo, repeatability, resample, ricker,
                                semblance, stack, static_shift, synthetic, time_depth)


def test_masks_are_not_zero_observations():
    with pytest.raises(SeismicError, match="mask must match"):
        TraceBlock([[1, 2]], .004, mask=[[True]])
    block = TraceBlock([[1, np.nan, 3], [3, np.nan, np.nan]], .004)
    out, support = stack(block)
    np.testing.assert_allclose(out.samples, [[2, np.nan, 3]], equal_nan=True)
    np.testing.assert_array_equal(support, [2, 0, 1])
    with pytest.raises(SeismicError, match="missing"):
        bandpass(block, 5, 50)


def test_static_sign_and_support():
    block = TraceBlock([[0, 1, 0, 0, 0]], .004)
    out = static_shift(block, [.008])
    np.testing.assert_allclose(out.samples, [[np.nan, np.nan, 0, 1, 0]], equal_nan=True)
    assert block.samples[0, 1] == 1
    np.testing.assert_allclose(elevation_statics([100], [200], 0, 1500), [.2])


def test_filter_retains_passband_and_rejects_high_frequency():
    t = np.arange(8000) * .001
    block = TraceBlock([np.sin(2*np.pi*20*t) + np.sin(2*np.pi*200*t)], .001)
    out = bandpass(block, 10, 40)
    np.testing.assert_allclose(out.samples[0, 1000:-1000], np.sin(2*np.pi*20*t)[1000:-1000], atol=.002)
    with pytest.raises(SeismicError, match="Nyquist"):
        bandpass(block, 10, 500)


def test_resampling_suppresses_aliases():
    t = np.arange(8000) * .001
    block = TraceBlock([np.sin(2*np.pi*300*t)], .001)
    out = resample(block, 1, 4)
    assert out.dt == .004 and out.samples.shape == (1, 2000)
    assert np.sqrt(np.mean(out.samples[0, 100:-100] ** 2)) < .002


def test_nmo_recovers_hyperbolic_event_and_semblance_velocity():
    dt, t0, v = .002, .7, 2000.
    times = np.arange(1000) * dt
    offsets = np.arange(0, 1000, 100.)
    data = np.array([np.exp(-((times - np.sqrt(t0*t0+(x/v)**2))/.008)**2) for x in offsets])
    block = TraceBlock(data, dt)
    corrected = nmo(block, offsets, v, .5)
    peaks = np.nanargmax(corrected.samples, axis=1) * dt
    np.testing.assert_allclose(peaks, t0, atol=dt)
    trial = np.array([1500, 1750, 2000, 2250, 2500])
    spectrum = semblance(block, offsets, trial, 11, .5)
    assert trial[np.argmax(spectrum[:, int(t0/dt)])] == 2000
    assert corrected.mask[:, 0].sum() == 1


def test_attributes_on_known_sinusoid():
    t = np.arange(1000) * .001
    result = attributes(TraceBlock([2*np.sin(2*np.pi*20*t)], .001), 51)
    np.testing.assert_allclose(result['envelope'], 2, atol=1e-10)
    np.testing.assert_allclose(result['frequency'], 20, atol=1e-9)
    zero = attributes(TraceBlock(np.zeros((1, 100)), .001))
    assert np.isnan(zero['frequency']).all()


def test_dix_and_invalid_velocity():
    # Two layers: 1500 m/s for 1 s, then 2500 m/s for 1 s.
    np.testing.assert_allclose(dix_interval([0, 1, 2], [1500, 1500, np.sqrt((1500**2+2500**2)/2)]), [1500, 2500])
    with pytest.raises(SeismicError, match="nonpositive"):
        dix_interval([1, 2], [3000, 1000])


def test_checkshot_calibration_has_no_extrapolation():
    d = np.arange(0, 1001, 100.)
    raw = time_depth(d, np.full(len(d), 1/2000.))
    np.testing.assert_allclose(raw, d/1000)
    tied = time_depth(d, np.full(len(d), 1/2000.), [200, 800], [.25, .85])
    np.testing.assert_allclose(tied[2:9], raw[2:9]+.05)
    assert np.isnan(tied[:2]).all() and np.isnan(tied[9:]).all()


def test_synthetic_impedance_reflection():
    _, w = ricker(.002, 25, .08)
    vp, rho = np.r_[np.full(50, 2000), np.full(50, 3000)], np.full(100, 2000)
    r, s = synthetic(vp, rho, w)
    assert r[50] == pytest.approx(.2)
    assert np.count_nonzero(r) == 1
    np.testing.assert_allclose(s[50-len(w)//2:51+len(w)//2], .2*w, atol=1e-12)


@pytest.mark.parametrize('model', ['shuey2', 'shuey3'])
def test_avo_coefficient_recovery(model):
    angles = np.array([0, 10, 20, 30, 40])
    t = np.deg2rad(angles)
    a = .1 + -.2*np.sin(t)**2
    expected = [.1, -.2]
    if model == 'shuey3':
        a += .15*(np.tan(t)**2 - np.sin(t)**2)
        expected.append(.15)
    result = avo_fit(a[:, None], angles, model)
    np.testing.assert_allclose(result['coefficients'][:, 0], expected, atol=1e-12)
    np.testing.assert_allclose(result['residual'], 0, atol=1e-12)


def test_4d_matching_preserves_reservoir_change():
    rng = np.random.default_rng(42)
    baseline = TraceBlock(rng.normal(size=(4, 300)), .004)
    changed = baseline.samples.copy()
    changed[:, 200:220] += 3
    monitor = TraceBlock(changed*2, .004)
    stable = np.ones(changed.shape, bool)
    stable[:, 180:240] = False
    matched, qc = equalise(baseline, monitor, stable, 0)
    assert qc['scale'] == pytest.approx(.5)
    assert qc['after']['nrmsPercent'] < 1e-10
    np.testing.assert_allclose(matched.samples[:, 200:220]-baseline.samples[:, 200:220], 3)
    assert repeatability(baseline.samples, baseline.samples)['nrmsPercent'] == 0


def test_fk_and_detrend_preserve_inputs():
    t = np.arange(256) * .002
    data = np.tile(np.sin(2*np.pi*20*t), (16, 1))
    block = TraceBlock(data, .002)
    np.testing.assert_allclose(fk_filter(block, 25, 1500).samples, data, atol=1e-12)
    ramp = TraceBlock([np.arange(256)*2+7], .002)
    np.testing.assert_allclose(detrend(ramp).samples, 0, atol=1e-10)
    np.testing.assert_array_equal(block.samples, data)
