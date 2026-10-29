import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
import pytest

from seismic_cloud_index import manifest_document, partition_halo, partition_spec
from seismic_graph import execute_graph, validate_graph
from seismic_land import (
    amplitude_balance,
    mute,
    residual_statics_shifts,
    spiking_deconvolution,
    supplied_sweep_correlation,
)
from seismic_marine import (
    linear_interpolation_gaps,
    simple_deghost,
    source_signature_designature,
    swell_noise_attenuation,
)
from seismic_models_work import refuse_unrepresentable_export, regular_property_grid, well_block_average
from seismic_processing import TraceBlock, attributes, dip_azimuth, semblance_coherence, spectral_decomposition
from seismic_slices import extract_arbitrary_section, extract_inline, extract_time_slice
from seismic_surfaces import fault_surface_from_sticks, horizon_grid_from_picks
from seismic_survey_qc import bin_traces, compute_midpoints, qualify_geometry_for_processing, validate_bin_grid
from seismic_ties import mistie_table, stretch_squeeze_piecewise, tie_bulk_shift, wavelet_extract_wiener
from seismic_velocity_work import apply_time_depth_volume, convert_velocity, thickness_map
from seismic_4d import difference_volume
from seismic_crs import require_confirmed_frame, transform_xy
from seismic_legacy import remap_references


def block(n=8, m=64, dt=0.002):
    t = np.arange(m) * dt
    traces = np.sin(2 * np.pi * 25 * t)[None, :] * np.linspace(0.5, 1.5, n)[:, None]
    return TraceBlock(traces, dt)


def test_survey_qc_and_slices():
    il = np.array([1, 1, 2, 2, 3, 3])
    xl = np.array([10, 11, 10, 11, 10, 11])
    report = validate_bin_grid(il, xl)
    assert report["completeRectangular"] is True and report["duplicateBins"] == []
    mid = compute_midpoints([[0, 0], [2, 0]], [[2, 0], [4, 0]])
    np.testing.assert_allclose(mid, [[1, 0], [3, 0]])
    binned = bin_traces(mid, origin=[0, 0], increment=[1, 1])
    assert list(binned["crossline"]) == [1, 3]
    review = dict(reviewed=True, dataKind="poststack", roles={"midpointX": {}, "midpointY": {}, "coordinateScalar": {}}, crs="EPSG:32615")
    assert qualify_geometry_for_processing(review, report)["geometryQualifiedForProcessing"] is True
    vol = np.arange(24, dtype=float).reshape(2, 3, 4)
    assert extract_inline(vol, 1)["samples"].shape == (3, 4)
    assert extract_time_slice(vol, 2)["samples"].shape == (2, 3)
    section = extract_arbitrary_section(vol, [[0, 0], [0.5, 1.5], [1, 2]])
    assert section["samples"].shape == (3, 4)


def test_ties_surfaces_velocity_models():
    seismic = np.sin(np.linspace(0, 8, 128))
    refl = np.zeros(128); refl[40] = 1; refl[80] = -0.5
    wave, meta = wavelet_extract_wiener(seismic, refl)
    assert len(wave) % 2 == 1 and meta["length"] == len(wave)
    synth = np.roll(seismic, 3)
    assert tie_bulk_shift(seismic, synth, 10)["lagSamples"] in (3, -3) or abs(tie_bulk_shift(seismic, synth, 10)["correlation"]) > 0.5
    mapped = stretch_squeeze_piecewise(np.linspace(0.1, 0.9, 17), [0.0, 0.5, 1.0], [0.0, 0.55, 1.1])
    assert np.all(np.diff(mapped) > 0)
    assert "networkMeanLagSamples" in mistie_table({"A": 2.0, "B": 4.0})
    grid = horizon_grid_from_picks([{"inline": 1, "crossline": 2, "value": 0.3}], (1, 2), (1, 3))
    assert grid["populated"] == 1 and np.isnan(grid["grid"][0, 0])
    sticks = [
        [{"inline": 0, "crossline": 0, "value": 0}, {"inline": 0, "crossline": 0, "value": 1}],
        [{"inline": 1, "crossline": 0, "value": 0}, {"inline": 1, "crossline": 0, "value": 1}],
    ]
    surface = fault_surface_from_sticks(sticks)
    assert len(surface["faces"]) == 2
    with pytest.raises(ValueError, match="incompatible"):
        fault_surface_from_sticks([sticks[0], sticks[0] + [{"inline": 0, "crossline": 0, "value": 2}]])
    times = np.array([0.0, 0.1, 0.2, 0.3])
    rms = np.array([1500.0, 1600.0, 1700.0, 1800.0])
    vint = convert_velocity(times, rms, "rms", "interval")
    assert len(vint) == 3 and np.all(vint > 0)
    depth = apply_time_depth_volume(times, np.r_[vint, vint[-1]])
    assert depth[0] == 0 and depth[-1] > depth[0]
    assert thickness_map([[1.0]], [[2.0]])[0, 0] == 1.0
    g = regular_property_grid([0, 0], [1, 1], (2, 2), np.ones((2, 2)))
    assert g["shape"] == (2, 2)
    blocked = well_block_average([0.5, 1.5], [10.0, 20.0], [0.0, 1.0, 2.0])
    np.testing.assert_allclose(blocked, [10.0, 20.0])
    with pytest.raises(ValueError, match="Y-splits"):
        refuse_unrepresentable_export(True, "GRDECL")


def test_land_marine_graph_and_attributes():
    b = block()
    muted = mute(b, top=0.02, taper=0.01)
    assert np.isnan(muted.samples[0, 0]) or muted.samples[0, 0] == 0 or muted.mask is not None
    sweep = np.sin(2 * np.pi * 20 * np.arange(32) * 0.002)
    correlated = supplied_sweep_correlation(b, sweep)
    assert correlated.samples.shape == b.samples.shape
    with pytest.raises(Exception):
        supplied_sweep_correlation(b, np.array([]))
    balanced = amplitude_balance(b)
    assert balanced.samples.shape == b.samples.shape
    decon = spiking_deconvolution(b, operator_length=8)
    assert decon.samples.shape == b.samples.shape
    shifts, _ = residual_statics_shifts(b, max_lag_samples=4)
    assert shifts.shape == (len(b.samples),)
    signed = np.sin(2 * np.pi * 30 * np.arange(64) * 0.002)
    designed = source_signature_designature(b, signed)
    assert designed.samples.shape == b.samples.shape
    deghosted = simple_deghost(b, 0.01)
    assert deghosted.samples.shape == b.samples.shape
    swell = swell_noise_attenuation(b, 5.0, 0.1)
    assert swell.samples.shape == b.samples.shape
    gappy = TraceBlock(b.samples.copy(), b.dt)
    gappy.samples[3, 10:20] = np.nan
    gappy.mask = np.isfinite(gappy.samples)
    filled = linear_interpolation_gaps(gappy)
    assert filled.mask[3, 15]
    attrs = attributes(b)
    assert "envelope" in attrs
    coh = semblance_coherence(b)
    assert coh.shape == (b.samples.shape[1],)
    dip = dip_azimuth(b, 25.0)
    assert dip["dipSecondsPerMetre"].shape == b.samples.shape
    spec = spectral_decomposition(b, [15.0, 25.0])
    assert spec["envelopes"].shape[0] == 2
    graph = dict(
        sourceId="s",
        sourceVersion="v1",
        domain="TWT",
        domainConfirmed=True,
        amplitudeUnit="recorded amplitude",
        nodes=[dict(id="m", operator="mute", input="source", parameters=dict(top=0.01, taper=0.005)),
               dict(id="a", operator="amplitude-balance", input="m", parameters={})],
        output="a",
    )
    validate_graph(graph)
    out, _ = execute_graph(graph, b)
    assert out.samples.shape[0] == b.samples.shape[0]


def test_cloud_index_and_4d_difference():
    parts = partition_spec(100, 32)
    assert parts["partitionCount"] == 4
    halo = partition_halo(1, 4, 1)
    assert halo["leftHaloPartitions"] == 1 and halo["rightHaloPartitions"] == 1
    man = manifest_document(
        source_id="src",
        source_version="1",
        source_sha256="a" * 64,
        trace_count=100,
        samples_per_trace=1000,
        sample_interval=0.002,
        partitions=parts,
        index_object="indexes/src.sqlite",
        array_prefix="arrays/src/",
    )
    assert man["kind"].startswith("stratax-seismic-cloud-index")
    base = block()
    mon = TraceBlock(base.samples * 1.1, base.dt)
    diff, metrics = difference_volume(base, mon)
    assert metrics["validSamples"] > 0 and diff.samples.shape == base.samples.shape


def test_crs_refusal_and_legacy_remap():
    with pytest.raises(Exception):
        require_confirmed_frame(dict(confirmed=False, crs="EPSG:32615", axisOrder="easting-northing", unit="m"))
    frame = dict(confirmed=True, crs="local-projected-A", axisOrder="easting-northing", unit="m")
    other = dict(confirmed=True, crs="local-projected-B", axisOrder="easting-northing", unit="m")
    with pytest.raises(Exception):
        transform_xy([[1.0, 2.0]], frame, other, engine=None)
    out = transform_xy([[1.0, 2.0]], frame, other, engine=lambda xy, s, t: [[10.0, 20.0]])
    assert out == [[10.0, 20.0]]
    remapped = remap_references(dict(datasetId="local-1", notes="x"), {"local-1": "cloud-1"})
    assert remapped["datasetId"] == "cloud-1"
    with pytest.raises(Exception):
        remap_references(dict(datasetId="missing"), {"local-1": "cloud-1"})
