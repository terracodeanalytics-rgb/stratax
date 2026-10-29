"""Independent identities and planted physical cases for the engine audit repairs."""
import io
import struct
import sys
from pathlib import Path
from types import SimpleNamespace

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from seismic_export import export_ieee_segy, export_su_ieee
from seismic_imaging import kirchhoff_operator
from seismic_inversion import calibrated
from seismic_land import amplitude_balance
from seismic_marine import kirchhoff_pstm_constant_velocity
from seismic_processing import TraceBlock
from seismic_reader import read_section
from seismic_rtm_work import fwi_gradient_step, apply_fwi_plan_step
from seismic_srme import predict_surface_multiples


def test_export_standard_headers_and_independent_samples():
    values = np.arange(96, dtype=float).reshape(3, 32) / 8
    block = TraceBlock(values, .002, .12)
    raw = export_ieee_segy(block, inlines=[1, 2, 3], crosslines=[4, 5, 6])
    assert struct.unpack_from(">HHHHH", raw, 3216) == (2000, 2000, 32, 32, 5)
    assert struct.unpack_from(">HHh", raw, 3500) == (256, 1, 0)
    assert struct.unpack_from(">h", raw, 3708)[0] == 120
    np.testing.assert_array_equal(np.frombuffer(raw, dtype=">f4", count=32, offset=3840), values[0])
    out = read_section(io.BytesIO(raw), len(raw), trace_count=3, sample_count=32)
    np.testing.assert_array_equal(out["samples"], values)
    assert out["sampleStart"] == pytest.approx(.12)
    su = export_su_ieee(block)
    out = read_section(io.BytesIO(su), len(su), kind="su", endian="little", trace_count=3, sample_count=32)
    np.testing.assert_array_equal(out["samples"], values)
    assert out["sampleStart"] == pytest.approx(.12)


def test_export_uint16_and_unrepresentable_axes():
    raw = export_ieee_segy(TraceBlock(np.ones((1, 40000)), .04))
    assert struct.unpack_from(">H", raw, 3220)[0] == 40000
    for block in (TraceBlock([[1, 2]], .002, .0005), TraceBlock([[1, 2]], .002, domain="depth")):
        with pytest.raises(ValueError):
            export_ieee_segy(block)


def test_balanced_and_legacy_balanced_inputs_are_rejected():
    b = TraceBlock(np.ones((2, 32)), .002)
    for value in (amplitude_balance(b), TraceBlock(b.samples, b.dt, history=[dict(method="amplitude-balance")])):
        with pytest.raises(ValueError, match="calibrated"):
            calibrated(value, [0, 1, 0], b.dt, True)


@pytest.mark.parametrize("dim", [2, 3])
def test_kirchhoff_analytic_travel_time_and_adjoint(dim):
    points = np.array([[0] * (dim - 1) + [100], [30] * (dim - 1) + [150]], float)
    sources = np.array([[0] * dim, [20] * (dim - 1) + [0]], float)
    receivers = np.array([[0] * dim, [-20] * (dim - 1) + [0]], float)
    op = kirchhoff_operator(points, sources, receivers, samples=300, dt=.001,
                            velocity=2000, aperture_metres=500, point_batch=1)
    impulse = op @ np.array([1., 0.])
    assert impulse.reshape(2, 300)[0, 100] == pytest.approx(1)
    rng = np.random.default_rng(51)
    x, y = rng.normal(size=2), rng.normal(size=600)
    np.testing.assert_allclose(np.vdot(op @ x, y), np.vdot(x, op.rmatvec(y)), rtol=1e-12, atol=1e-12)
    ts = np.linalg.norm(points[:, None] - sources[None], axis=2) / 2000
    tr = np.linalg.norm(points[:, None] - receivers[None], axis=2) / 2000
    table_op = kirchhoff_operator(points, sources, receivers, samples=300, dt=.001,
                                 source_times=ts, receiver_times=tr, aperture_metres=500)
    np.testing.assert_allclose(op @ x, table_op @ x, atol=1e-12)


def test_migration_focuses_planted_diffraction_and_uses_spacing():
    n, dt, nt, dx, velocity, depth = 25, .001, 400, 10, 2000, 150
    x = np.arange(n) * dx
    traces = np.zeros((n, nt))
    travel = 2 * np.sqrt((x - x[n // 2])**2 + depth**2) / velocity
    for i, t in enumerate(travel):
        k = t / dt; j = int(k)
        traces[i, j] = 1 - (k - j); traces[i, j + 1] = k - j
    b = TraceBlock(traces, dt)
    image = kirchhoff_pstm_constant_velocity(b, np.zeros(n), dx, velocity).samples
    peak = np.unravel_index(np.argmax(image), image.shape)
    assert peak == (n // 2, 150)
    wrong = kirchhoff_pstm_constant_velocity(b, np.zeros(n), dx * 10, velocity).samples
    assert not np.array_equal(image, wrong)


@pytest.mark.parametrize("dimension", [2, 3])
def test_surface_integral_matches_causal_convolution(dimension):
    response = np.zeros((2, 2, 32))
    response[0, 0, 2] = 1; response[0, 1, 3] = 2
    response[1, 0, 4] = 3; response[1, 1, 5] = 4
    q = np.array([2., 3.]); dt = .002; regularization = 1e-8
    xy = np.zeros((2, dimension - 1)); xy[1, 0] = 10
    out = predict_surface_multiples(response, dt, xy, q, [1.], geometry_confirmed=True,
                                    regularization=regularization)["multiples"]
    expected = np.zeros_like(response)
    for source in range(2):
        for receiver in range(2):
            for point in range(2):
                expected[source, receiver] -= dt * q[point] * np.convolve(
                    response[source, point], response[point, receiver])[:32] / (1 + regularization)
    np.testing.assert_allclose(out, expected, atol=1e-12)


class AnalyticSession:
    """Scalar squared-slowness response: independent objective/derivative truth."""
    def __init__(self):
        self.model = SimpleNamespace(vp=SimpleNamespace(data=np.array([2.])))
        self.crop = slice(None); self.maximum_velocity = 3000; self.dt = .002
        self.provenance = {}; self.nt = 128
    def set_velocity(self, value):
        self.model.vp.data[:] = value / 1000
    def forward(self, save=False):
        v = self.model.vp.data[0] * 1000
        t = np.arange(self.nt) * self.dt
        return ((1e6 / v**2) * (np.sin(2*np.pi*15.625*t) + np.sin(2*np.pi*62.5*t)))[None], None
    def mass_adjoint(self, residual, wavefield):
        t = np.arange(self.nt) * self.dt
        derivative = 1e6 * (np.sin(2*np.pi*15.625*t) + np.sin(2*np.pi*62.5*t))
        return np.array([np.sum(residual * derivative)])


def test_fwi_step_descends_correct_velocity_direction_and_restores_session():
    s = AnalyticSession(); s.set_velocity(np.array([2200.])); observed, _ = s.forward()
    s.set_velocity(np.array([2000.])); step = fwi_gradient_step(s, observed)
    assert step["accepted"] and step["objectiveAfter"] < step["objective"]
    assert step["proposedVelocity"][0] > 2000
    assert s.model.vp.data[0] == pytest.approx(2)
    step = apply_fwi_plan_step(s, observed, dict(lowHz=10, highHz=25, scale=0))
    full = fwi_gradient_step(s, observed)
    assert step["objective"] < full["objective"]
    assert step["objectiveAfter"] < step["objective"]


def test_geostatistical_conditioning_constants_and_seeded_paths():
    from seismic_geostatistics import empirical_variogram, ordinary_kriging, sequential_simulation
    points = np.array([[0, 0, 0], [10, 0, 0], [0, 10, 0]], float)
    targets = np.vstack([points, [[3, 3, 0], [5, 5, 5]]])
    settings = dict(ranges=[10, 10, 10], sill=1., neighbours=3)
    out = ordinary_kriging(points, [2, 2, 2], targets, **settings)
    np.testing.assert_allclose(out["mean"], 2., atol=1e-12)
    np.testing.assert_array_equal(out["variance"][:3], 0.)
    assert np.all(out["variance"][3:] > 0)
    variogram = empirical_variogram(points, [0, 2, 4], [0, 11, 20])
    np.testing.assert_array_equal(variogram["counts"], [2, 1])
    np.testing.assert_allclose(variogram["semivariance"], [5, 2])
    first = sequential_simulation(points, [0, 1, -1], targets, seed=4, gaussian_confirmed=True, **settings)
    second = sequential_simulation(points, [0, 1, -1], targets, seed=4, gaussian_confirmed=True, **settings)
    np.testing.assert_array_equal(first["values"], second["values"])
    np.testing.assert_array_equal(first["values"][:3], [0, 1, -1])
    indicator = sequential_simulation(points, [0, 1, 0], targets, seed=4, categories=[0, 1], **settings)
    assert np.all(np.isin(indicator["values"], [0, 1]))
    np.testing.assert_array_equal(indicator["values"][:3], [0, 1, 0])


def test_genuine_3d_structure_recovers_plane_dip_and_azimuth():
    from seismic_volume_attributes import structure_attributes
    spacing = [10, 10, 2]
    x, y, z = np.meshgrid(np.arange(17)*10, np.arange(17)*10, np.arange(49)*2, indexing="ij")
    volume = np.sin(.08 * (z - .1*x - .2*y))
    out = structure_attributes(volume, spacing, domain="depth", sigma=1.)
    region = (slice(4, -4), slice(4, -4), slice(10, -10))
    assert np.nanmedian(out["dipX"][region]) == pytest.approx(.1, abs=.003)
    assert np.nanmedian(out["dipY"][region]) == pytest.approx(.2, abs=.003)
    assert np.nanmedian(out["azimuthDegrees"][region]) == pytest.approx(np.degrees(np.arctan2(.1, .2)), abs=.5)
    assert np.nanmedian(out["coherence"][region]) > .99
    volume[8, 8, 24] = np.nan
    out = structure_attributes(volume, spacing, domain="depth")
    assert not out["valid"][8, 8, 24]


def test_resqml_real_epc_hdf5_geometry_and_property_roundtrip(tmp_path):
    from seismic_model_exchange import export_regular_resqml
    from seismic_models_work import regular_property_grid
    from resqpy.model import Model
    from resqpy.grid import any_grid
    from resqpy.property import Property
    values = np.arange(24, dtype=float).reshape(2, 3, 4) / 100
    grid = regular_property_grid([100, 200, 300], [10, 20, 5], values.shape, values)
    out = export_regular_resqml(grid, property_name="PORO", property_unit="m3/m3", property_kind="porosity",
        crs_epsg="32631", z_increases_down=True, crs_confirmed=True)
    (tmp_path / "model.epc").write_bytes(out["epc"])
    (tmp_path / "model.h5").write_bytes(out["hdf5"])
    model = Model(str(tmp_path / "model.epc"))
    try:
        loaded = any_grid(model, uuid=out["gridUuid"])
        np.testing.assert_array_equal(loaded.extent_kji, [4, 3, 2])
        assert np.sum(loaded.volume()) == pytest.approx(24 * 10 * 20 * 5)
        prop = Property(model, uuid=out["propertyUuid"])
        np.testing.assert_array_equal(prop.array_ref(), np.transpose(values, (2, 1, 0)))
    finally:
        model.h5_release()


def test_stable_fir_reduces_repeatability_error_and_keeps_reservoir_change():
    from seismic_4d import cross_equalise_fir
    rng = np.random.default_rng(95)
    base = rng.normal(size=(4, 256))
    monitor = base * 1.5
    monitor[:, 170:190] += 3.
    stable = np.ones_like(base, bool); stable[:, 150:210] = False
    matched, difference, report = cross_equalise_fir(TraceBlock(base, .002), TraceBlock(monitor, .002), stable,
                                                   taps=3, regularization=1e-8)
    assert report["stableAfter"]["nrmsPercent"] < .001
    assert np.nanmean(difference.samples[:, 173:187]) == pytest.approx(2., abs=.001)
    assert np.isnan(matched.samples[:, 0]).all()


def test_faulted_corner_grid_preserves_split_geometry_and_volume(tmp_path):
    from seismic_model_exchange import export_corner_resqml
    from resqpy.model import Model
    from resqpy.grid import any_grid
    corners = np.empty((1, 1, 2, 2, 2, 2, 3))
    for i in range(2):
        for k in range(2):
            for j in range(2):
                for ii in range(2):
                    corners[0, 0, i, k, j, ii] = [(i+ii)*10, j*10, k*10+i*4]
    out = export_corner_resqml(corners, np.ones((1, 1, 2), bool),
        [dict(name="PORO", kind="porosity", unit="m3/m3", values=[[[.1, .2]]])],
        crs_epsg="32631", z_increases_down=True, split_tolerance=.001, geometry_confirmed=True)
    assert out["splitPillars"]
    (tmp_path / "model.epc").write_bytes(out["epc"]); (tmp_path / "model.h5").write_bytes(out["hdf5"])
    model = Model(str(tmp_path / "model.epc"))
    try:
        loaded = any_grid(model, uuid=out["gridUuid"])
        assert loaded.has_split_coordinate_lines
        np.testing.assert_allclose(loaded.corner_points(), corners, atol=1e-10)
        np.testing.assert_allclose(loaded.volume(), [[[1000, 1000]]], rtol=1e-10)
    finally:
        model.h5_release()


def test_prediction_holds_out_entire_well_and_reports_extrapolation():
    from seismic_prediction import calibrated_prediction
    x = np.arange(60, dtype=float)[:, None] / 60
    wells = ["training"] * 40 + ["blind"] * 20
    out = calibrated_prediction(x, x[:, 0] * 2, wells, [[.25], [2.]], blind_wells=["blind"],
        feature_names=["calibrated-AI"], target_unit="fraction", task="regression", trees=10)
    assert out["trainingWells"] == ["training"] and len(out["blindPrediction"]) == 20
    assert out["validation"]["rmse"] > 0
    np.testing.assert_array_equal(out["extrapolation"], [False, True])


def test_radon_scatter_time_and_exact_discrete_adjoint():
    from seismic_radon import radon_operator
    op = radon_operator([0, 100], [0, 1e-6], 64, .001)
    impulse = np.zeros((2, 64)); impulse[1, 20] = 1
    data = (op @ impulse.ravel()).reshape(2, 64)
    assert data[0, 20] == pytest.approx(1)
    assert data[1, 30] == pytest.approx(1)
    rng = np.random.default_rng(58); x = rng.normal(size=128); y = rng.normal(size=128)
    np.testing.assert_allclose(np.vdot(op @ x, y), np.vdot(x, op.rmatvec(y)), rtol=1e-12, atol=1e-12)


@pytest.mark.parametrize("dimension", [2, 3])
def test_fast_marching_homogeneous_axial_and_refracted_symmetric_times(dimension):
    from seismic_travel_times import first_arrival_times
    shape = (13,)*dimension; velocity = np.full(shape, 2000.)
    times = first_arrival_times(velocity, [10.]*dimension, [0]*dimension)
    axis = (slice(None),) + (0,)*(dimension-1)
    np.testing.assert_allclose(times[axis], np.arange(13)*.005, atol=1e-12)
    point = (12,)*dimension
    analytic = np.linalg.norm(np.array(point)*10)/2000
    assert abs(times[point]-analytic) <= .012
    assert times[(12,)+(0,)*(dimension-1)] == pytest.approx(times[(0,12)+(0,)*(dimension-2)])
    velocity[(slice(None),)*(dimension-1)+(slice(6,None),)] = 3000
    layered = first_arrival_times(velocity, [10.]*dimension, [0]*dimension)
    assert layered[point] < times[point]


def test_elliptic_dmo_kinematics_and_nmo_contract():
    from seismic_land import elliptic_dmo
    values = np.zeros((21, 300)); values[10, 200] = 1
    b = TraceBlock(values, .001)
    with pytest.raises(ValueError, match="NMO"):
        elliptic_dmo(b, np.full(21, 200), 10, 1500)
    out = elliptic_dmo(b, np.full(21, 200), 10, 1500, nmo_confirmed=True)
    expected = int(.2 * np.sqrt(1-(40/100)**2) / .001)
    assert np.max(out.samples[14, expected:expected+2]) > 0
    zero = elliptic_dmo(b, np.zeros(21), 10, 1500, nmo_confirmed=True)
    np.testing.assert_allclose(zero.samples, b.samples)
