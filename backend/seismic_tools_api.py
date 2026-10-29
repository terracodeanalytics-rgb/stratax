"""Analytical seismic tool endpoints (slices, ties, velocity, attributes, surfaces, 4D, models, QI).

Request arrays stay ephemeral; nothing here writes sample payloads into Firestore.
"""
from __future__ import annotations

from typing import Any

import numpy as np
from fastapi import Depends

from seismic_4d import associate_vintages, difference_volume, match_and_difference
from seismic_cloud_index import manifest_document, partition_halo, partition_spec
from seismic_models_work import refuse_unrepresentable_export, regular_property_grid, well_block_average
from seismic_processing import TraceBlock, attributes, avo_fit, dip_azimuth, semblance_coherence, spectral_decomposition
from seismic_resources import CoordinateFrame, DomainFrame
from seismic_rtm_work import source_estimation_least_squares
from seismic_slices import extract_arbitrary_section, extract_crossline, extract_inline, extract_time_slice, linked_triad
from seismic_surfaces import fault_surface_from_sticks, horizon_grid_from_picks
from seismic_ties import mistie_table, stretch_squeeze_piecewise, tie_bulk_shift, wavelet_extract_wiener
from seismic_velocity_work import apply_time_depth_volume, convert_velocity, thickness_map


def _finite_matrix(values, name, ndim=None, max_cells=2_000_000):
    arr = np.asarray(values, dtype=np.float64)
    if ndim is not None and arr.ndim != ndim:
        raise ValueError(f"{name} must have {ndim} dimensions.")
    if arr.size == 0 or arr.size > max_cells:
        raise ValueError(f"{name} must be nonempty and within the two-million-cell analytical budget.")
    if not np.all(np.isfinite(arr)):
        raise ValueError(f"{name} contains non-finite values.")
    return arr


def _pack_array(arr):
    value = np.asarray(arr, float)
    return dict(shape=list(value.shape), values=value.reshape(-1).tolist())


def install_seismic_tools(app, owner, project, fail):
    @app.post("/api/projects/{pid}/seismic/tools/slice")
    def tool_slice(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            kind = body.get("kind")
            volume = _finite_matrix(body.get("volume"), "volume", ndim=3)
            mask = body.get("mask")
            if kind == "inline":
                out = extract_inline(volume, int(body["index"]), mask=mask)
            elif kind == "crossline":
                out = extract_crossline(volume, int(body["index"]), mask=mask)
            elif kind == "time":
                out = extract_time_slice(volume, int(body["index"]), mask=mask)
            elif kind == "arbitrary":
                out = extract_arbitrary_section(volume, body["path"], mask=mask)
            elif kind == "linked":
                out = linked_triad(volume, int(body["inline"]), int(body["crossline"]), int(body["sample"]), mask=mask)
            else:
                fail(400, "slice_kind", "Choose inline, crossline, time, arbitrary or linked.")
            if kind == "linked":
                payload = dict(cursor=out["cursor"], limitations=out["limitations"])
                for key in ("inlineSlice", "crosslineSlice", "timeSlice"):
                    part = out[key]
                    payload[key] = dict(
                        samples=_pack_array(part["samples"]),
                        mask=_pack_array(np.asarray(part["mask"], float)),
                        **{k: v for k, v in part.items() if k not in ("samples", "mask")},
                    )
                return payload
            return dict(
                samples=_pack_array(out["samples"]),
                mask=_pack_array(np.asarray(out["mask"], float)),
                **{k: (np.asarray(v).tolist() if isinstance(v, np.ndarray) else v)
                   for k, v in out.items() if k not in ("samples", "mask")},
            )
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "slice_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/tie")
    def tool_tie(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op == "wavelet":
                wavelet, meta = wavelet_extract_wiener(body["seismic"], body["reflectivity"], body.get("noiseFloor", 1e-3))
                return dict(wavelet=np.asarray(wavelet, float).tolist(), **meta)
            if op == "bulk-shift":
                return tie_bulk_shift(body["seismic"], body["synthetic"], int(body.get("maxLagSamples", 50)))
            if op == "stretch-squeeze":
                mapped = stretch_squeeze_piecewise(body["twt"], body["controlFrom"], body["controlTo"])
                return dict(mappedTwt=np.asarray(mapped, float).tolist())
            if op == "mistie":
                return mistie_table(body["lineTies"])
            fail(400, "tie_operation", "Choose wavelet, bulk-shift, stretch-squeeze or mistie.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "tie_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/velocity")
    def tool_velocity(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op == "convert":
                out = convert_velocity(body["times"], body["values"], body["fromType"], body["toType"])
                return dict(values=np.asarray(out, float).tolist())
            if op == "time-depth":
                depth = apply_time_depth_volume(body["times"], body["intervalVelocities"], body.get("datum", 0.0))
                return dict(depth=np.asarray(depth, float).tolist())
            if op == "thickness":
                return dict(thickness=_pack_array(thickness_map(body["top"], body["base"])))
            fail(400, "velocity_operation", "Choose convert, time-depth or thickness.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "velocity_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/attributes")
    def tool_attributes(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            samples = _finite_matrix(body["samples"], "samples", ndim=2)
            block = TraceBlock(samples, float(body["dt"]), float(body.get("start", 0.0)), body.get("domain", "TWT"))
            kind = body.get("kind", "basic")
            if kind == "basic":
                return {k: _pack_array(v) for k, v in attributes(block, int(body.get("window", 11))).items()}
            if kind == "coherence":
                return dict(coherence=_pack_array(semblance_coherence(block, int(body.get("window", 5)))))
            if kind == "dip":
                return {k: _pack_array(v) for k, v in dip_azimuth(block, float(body["traceSpacing"])).items()}
            if kind == "spectral":
                specs = spectral_decomposition(block, body["frequencies"])
                return dict(frequencies=specs["frequencies"], envelopes=_pack_array(specs["envelopes"]))
            fail(400, "attribute_kind", "Choose basic, coherence, dip or spectral.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "attribute_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/surfaces")
    def tool_surfaces(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            kind = body.get("kind")
            if kind == "horizon":
                out = horizon_grid_from_picks(body["picks"], tuple(body["inlineRange"]), tuple(body["crosslineRange"]))
                return dict(grid=_pack_array(out["grid"]), inlineRange=out["inlineRange"], crosslineRange=out["crosslineRange"], populated=out["populated"])
            if kind == "fault":
                out = fault_surface_from_sticks(body["sticks"])
                return dict(vertices=_pack_array(out["vertices"]), faces=np.asarray(out["faces"]).tolist(), stickCount=out["stickCount"], nodesPerStick=out["nodesPerStick"])
            fail(400, "surface_kind", "Choose horizon or fault.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "surface_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/models")
    def tool_models(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op == "grid":
                out = regular_property_grid(body["origin"], body["spacing"], body["shape"], body["values"])
                return dict(origin=np.asarray(out["origin"], float).tolist(), spacing=np.asarray(out["spacing"], float).tolist(), shape=list(out["shape"]), values=_pack_array(out["values"]), grid=out["grid"])
            if op == "well-block":
                return dict(blocked=np.asarray(well_block_average(body["depths"], body["properties"], body["cellEdges"]), float).tolist())
            if op == "export-check":
                return refuse_unrepresentable_export(bool(body.get("faultsHaveYSplits")), body.get("target", "RESQML"))
            fail(400, "model_operation", "Choose grid, well-block or export-check.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "model_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/4d")
    def tool_4d(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op == "associate":
                pair = associate_vintages(
                    body["baselineSourceId"], body["baselineVersion"], body["monitorSourceId"], body["monitorVersion"],
                    CoordinateFrame(**body["coordinates"]), DomainFrame(**body["domain"]), body["amplitudeUnit"],
                    bool(body.get("geometryQualified", False)), bool(body.get("commonSupport", False)),
                )
                return pair.model_dump()
            baseline = TraceBlock(_finite_matrix(body["baseline"], "baseline", 2), float(body["dt"]), float(body.get("start", 0.0)), body.get("domainName", "TWT"))
            monitor = TraceBlock(_finite_matrix(body["monitor"], "monitor", 2), float(body["dt"]), float(body.get("start", 0.0)), body.get("domainName", "TWT"))
            if op == "difference":
                diff, metrics = difference_volume(baseline, monitor, mask=body.get("mask"))
                return dict(difference=_pack_array(diff.samples), metrics=metrics)
            if op == "match":
                matched, diff, report = match_and_difference(baseline, monitor, np.asarray(body["stableMask"], bool), int(body.get("maxLag", 10)))
                return dict(matched=_pack_array(matched.samples), difference=_pack_array(diff.samples), report=report)
            fail(400, "four_d_operation", "Choose associate, difference or match.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "four_d_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/index-manifest")
    def tool_index_manifest(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            parts = partition_spec(int(body["traceCount"]), int(body["tracesPerPartition"]))
            halo = partition_halo(int(body.get("partitionIndex", 0)), parts["partitionCount"], int(body.get("halo", 0)))
            manifest = manifest_document(
                source_id=body["sourceId"], source_version=body["sourceVersion"], source_sha256=body["sourceSha256"],
                trace_count=int(body["traceCount"]), samples_per_trace=int(body["samplesPerTrace"]),
                sample_interval=float(body["sampleInterval"]), partitions=parts,
                index_object=body["indexObject"], array_prefix=body["arrayPrefix"],
                geometry_revision=body.get("geometryRevision"),
            )
            return dict(manifest=manifest, halo=halo)
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "index_manifest_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/qi")
    def tool_qi(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op == "avo":
                fit = avo_fit(body["amplitudes"], body["angles"], body.get("model", "shuey2"))
                return dict(coefficients=_pack_array(fit["coefficients"]), predicted=_pack_array(fit["predicted"]), residual=_pack_array(fit["residual"]), condition=fit["condition"])
            if op == "poststack-inversion":
                try:
                    from seismic_inversion import poststack_inversion
                except Exception as error:
                    fail(503, "inversion_unavailable", "Poststack inversion requires the PyLops worker image; it is not installed on the API.")
                block = TraceBlock(
                    _finite_matrix(body["samples"], "samples", 2), float(body["dt"]), float(body.get("start", 0.0)), "TWT",
                    history=list(body.get("history", [])),
                )
                out = poststack_inversion(
                    block, body["wavelet"], float(body.get("waveletDt", body["dt"])), body["backgroundImpedance"],
                    amplitude_review=bool(body.get("amplitudeReview", False)),
                    regularization=float(body.get("regularization", 0.1)),
                    smoothness=float(body.get("smoothness", 0.0)),
                    iterations=int(body.get("iterations", 200)),
                )
                return dict(
                    impedance=_pack_array(out["impedance"]), impedanceUnit=out["impedanceUnit"],
                    predicted=_pack_array(out["predicted"].samples), residual=_pack_array(out["residual"].samples),
                    diagnostics=out["diagnostics"], modelling=out["modelling"], warning=out["warning"],
                )
            if op == "source-estimate":
                wavelet, meta = source_estimation_least_squares(body["greens"], body["observed"], float(body.get("noiseFloor", 1e-6)))
                return dict(wavelet=np.asarray(wavelet, float).tolist(), **meta)
            fail(400, "qi_operation", "Choose avo, poststack-inversion or source-estimate.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "qi_input", str(error))
