import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
import pytest

from seismic_inversion import poststack_inversion, prestack_inversion
from seismic_processing import TraceBlock, SeismicError


@pytest.fixture(autouse=True)
def engine_cache(tmp_path, monkeypatch):
    monkeypatch.setenv('MPLCONFIGDIR', str(tmp_path/'matplotlib'))


def centred_difference(values):
    result = np.zeros_like(values)
    result[1:-1] = (values[2:]-values[:-2])/2
    return result


def test_poststack_matches_independent_regularised_matrix_solution():
    n, lam = 32, .03
    wav = np.array([-.1, .3, 1., .3, -.1])
    prior = np.full(n, 4e6)
    truth = prior*np.exp(.1*np.sin(np.arange(n)/4))
    def forward(model): return .5*np.convolve(centred_difference(model), wav, mode='same')
    observations = forward(np.log(truth))
    matrix = np.column_stack([forward(np.eye(n)[:, i]) for i in range(n)])
    background = np.log(prior)
    delta = np.linalg.lstsq(np.vstack([matrix, lam*np.eye(n)]), np.r_[observations-matrix@background, np.zeros(n)], rcond=None)[0]
    expected = np.exp(background+delta)
    result = poststack_inversion(TraceBlock([observations], .002), wav, .002, [prior], amplitude_review=True, regularization=lam, iterations=200)
    np.testing.assert_allclose(result['impedance'][0], expected, rtol=1e-8)
    np.testing.assert_allclose(result['predicted'].samples[0], forward(np.log(expected)), atol=1e-10)
    assert result['diagnostics'][0]['backgroundDependent'] and result['diagnostics'][0]['converged']


def test_prestack_independent_aki_richards_forward_and_residual():
    n, angles = 48, np.array([0., 10., 20., 30., 40.])
    wav = np.array([-.1, .3, 1., .3, -.1])
    prior = np.tile([2400., 1200., 2200.], (n, 1))
    logs = np.log(prior)+.025*np.sin(np.arange(n)[:, None]/5)*np.array([1., .5, -.2])
    derivative = centred_difference(logs)
    theta = np.deg2rad(angles)
    coefficients = np.array([1/(2*np.cos(theta)**2), -4*.5**2*np.sin(theta)**2, .5-2*.5**2*np.sin(theta)**2])
    reflectivity = derivative@coefficients
    observations = np.array([np.convolve(reflectivity[:, j], wav, mode='same') for j in range(len(angles))])
    result = prestack_inversion(TraceBlock(observations, .002), angles, wav, .002, prior, amplitude_review=True, regularization=.001, iterations=1000)
    inferred_derivative = centred_difference(np.log(result['properties']))
    expected = np.array([np.convolve((inferred_derivative@coefficients)[:, j], wav, mode='same') for j in range(len(angles))])
    np.testing.assert_allclose(result['predicted'].samples, expected, atol=1e-10)
    np.testing.assert_allclose(result['residual'].samples, observations-expected, atol=1e-10)
    assert np.linalg.norm(result['residual'].samples)/np.linalg.norm(observations) < .01


def test_quantitative_inputs_require_amplitude_review_and_matched_sampling():
    block = TraceBlock(np.zeros((1, 32)), .002)
    args = (block, [0, 1, 0], .002, np.full((1, 32), 4e6))
    with pytest.raises(SeismicError, match='amplitude history'):
        poststack_inversion(*args, amplitude_review=False)
    for method in ['AGC', 'qc.normalize', 'trace_normalisation', 'display-gain', 'automatic gain control']:
        block.history[:] = [dict(method=method)]
        with pytest.raises(SeismicError, match='AGC'):
            poststack_inversion(*args, amplitude_review=True)
    block.history.clear()
    with pytest.raises(SeismicError, match='same sample interval'):
        poststack_inversion(block, [0, 1, 0], .004, args[3], amplitude_review=True)


def test_pylops_forward_adjoint_pair():
    from pylops.avo.poststack import PoststackLinearModelling
    from pylops.avo.prestack import PrestackLinearModelling
    rng = np.random.default_rng(41)
    wav = np.array([0., .5, 1., .5, 0.])
    for operator in [.5*PoststackLinearModelling(wav, 32), PrestackLinearModelling(wav, np.array([0., 15., 30.]), nt0=32)]:
        x, y = rng.normal(size=operator.shape[1]), rng.normal(size=operator.shape[0])
        lhs, rhs = np.vdot(operator.matvec(x), y), np.vdot(x, operator.rmatvec(y))
        assert abs(lhs-rhs)/max(abs(lhs), abs(rhs), 1e-12) < 1e-8
