"""Analytical seismic tool endpoints (slices, ties, velocity, attributes, surfaces, 4D, models, QI).

Request arrays stay ephemeral; nothing here writes sample payloads into Firestore.
"""
from __future__ import annotations

from typing import Any

import numpy as np
from fastapi import Depends

import base64

from seismic_4d import associate_vintages, difference_volume, match_and_difference, qc_bundle, cross_equalise_fir
from seismic_cloud_index import manifest_document, partition_halo, partition_spec
from seismic_export import describe_export, export_ieee_segy, export_su_ieee
from seismic_handoff import accepted_processing_handoff, mark_stale_resources
from seismic_models_work import (
    corner_point_pillar_grid,
    export_grdecl_regular,
    export_resqml_regular_manifest,
    refuse_unrepresentable_export,
    regular_property_grid,
    volumetric_sum,
    well_block_average,
)
from seismic_processing import TraceBlock, attributes, avo_fit, dip_azimuth, semblance_coherence, spectral_decomposition
from seismic_resources import CoordinateFrame, DomainFrame
from seismic_rtm_work import multi_scale_fwi_plan, rtm_illumination_weight, source_estimation_least_squares
from seismic_slices import extract_arbitrary_section, extract_crossline, extract_inline, extract_time_slice, linked_triad
from seismic_surfaces import fault_surface_from_sticks, horizon_grid_from_picks
from seismic_ties import mistie_table, stretch_squeeze_piecewise, tie_bulk_shift, wavelet_extract_wiener
from seismic_velocity_work import apply_time_depth_volume, convert_velocity, thickness_map


def _finite_matrix(values, name, ndim=None, max_cells=2_000_000, allow_missing=False):
    arr = np.asarray(values, dtype=np.float64)
    if ndim is not None and arr.ndim != ndim:
        raise ValueError(f"{name} must have {ndim} dimensions.")
    if arr.size == 0 or arr.size > max_cells:
        raise ValueError(f"{name} must be nonempty and within the two-million-cell analytical budget.")
    if np.any(np.isinf(arr)) or not allow_missing and not np.all(np.isfinite(arr)):
        raise ValueError(f"{name} contains non-finite values.")
    return arr


def _pack_array(arr):
    value = np.asarray(arr, float)
    return dict(shape=list(value.shape), values=np.where(np.isfinite(value), value, None).reshape(-1).tolist())


def install_seismic_tools(app, owner, project, fail, *, cancelled=lambda:False, progress=lambda value:None):
    def pack(value):
        if isinstance(value,np.ndarray):return _pack_array(value)
        if isinstance(value,dict):return {key:pack(item) for key,item in value.items()}
        if isinstance(value,list):return [pack(item) for item in value]
        if isinstance(value,np.generic):return value.item()
        return value

    @app.post('/api/projects/{pid}/seismic/tools/geometry')
    def tool_geometry(pid:str,body:dict[str,Any],user=Depends(owner)):
        project(user['uid'],pid)
        try:
            from seismic_survey_qc import compute_midpoints,bin_traces,validate_bin_grid
            from seismic_crs import transform_xy
            operation=body['operation']
            if operation=='transform':return dict(coordinates=transform_xy(body['coordinates'],body['sourceFrame'],body['targetFrame'],engine='pyproj'),frame=body['targetFrame'])
            if operation=='bin':
                midpoint=compute_midpoints(body['sources'],body['receivers'])
                return pack(bin_traces(midpoint,body['origin'],body['increment'],body.get('azimuthRadians',0)))
            if operation=='bin-qc':return validate_bin_grid(body['inlines'],body['crosslines'])
            raise ValueError('Choose transform, bin or bin-qc.')
        except (ValueError,TypeError,KeyError) as error:fail(400,'geometry_input',str(error))

    @app.post('/api/projects/{pid}/seismic/tools/land')
    def tool_land(pid:str,body:dict[str,Any],user=Depends(owner)):
        project(user['uid'],pid)
        try:
            from seismic_field_ops import land_operation
            return pack(land_operation(body,cancelled=cancelled))
        except (ValueError,TypeError,KeyError) as error:fail(400,'land_input',str(error))

    @app.get("/api/projects/{pid}/seismic/tools/capabilities")
    def tools_capabilities(pid: str, user=Depends(owner)):
        project(user["uid"], pid)
        from seismic_engine_catalog import engine_catalog
        return engine_catalog()

    @app.post("/api/projects/{pid}/seismic/tools/slice")
    def tool_slice(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            kind = body.get("kind")
            volume = _finite_matrix(body.get("volume"), "volume", ndim=3,allow_missing=True)
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
            if op in ('wavelet-import','wavelet-create','wavelet-phase'):
                from seismic_wavelets import wavelet_operation
                return pack(wavelet_operation(body))
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
            if op == "calibrated-synthetic":
                from seismic_ties import calibrated_synthetic
                out = calibrated_synthetic(body["depth"], body["sonic"], body["density"], body["checkshotDepth"],
                    body["checkshotTwt"], body["sampleTimes"], body["wavelet"], body["waveletDt"],
                    references_confirmed=body.get("referencesConfirmed") is True)
                return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
            fail(400, "tie_operation", "Choose wavelet, bulk-shift, stretch-squeeze or mistie.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "tie_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/velocity")
    def tool_velocity(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op=='convert-volume-functions':
                from seismic_velocity_work import convert_velocity_volume
                return pack(convert_velocity_volume(body['times'],body['values'],body['fromType'],body['toType'],time_origin_confirmed=body.get('timeOriginConfirmed') is True))
            if op == "convert":
                out = convert_velocity(body["times"], body["values"], body["fromType"], body["toType"])
                return dict(values=np.asarray(out, float).tolist())
            if op == "time-depth":
                depth = apply_time_depth_volume(body["times"], body["intervalVelocities"], body.get("datum", 0.0))
                return dict(depth=np.asarray(depth, float).tolist())
            if op == "thickness":
                return dict(thickness=_pack_array(thickness_map(body["top"], body["base"])))
            if op == "convert-cube":
                from seismic_depth_model import convert_cube
                out = convert_cube(body["volume"], body["sourceAxis"], body["intervalVelocity"], body["targetAxis"],
                    direction=body["direction"], datum_at_axis_start=body["datumAtAxisStart"],
                    reference_confirmed=body.get("referenceConfirmed") is True)
                return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
            fail(400, "velocity_operation", "Choose convert, time-depth or thickness.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "velocity_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/attributes")
    def tool_attributes(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            if body.get('kind')=='basic-3d':
                from seismic_volume_workflows import volume_attributes
                return pack(volume_attributes(body['volume'],body['dt'],body.get('window',11)))
            if body.get("kind") == "structure-3d":
                from seismic_volume_attributes import structure_attributes
                out = structure_attributes(_finite_matrix(body["volume"], "volume", ndim=3), body["spacing"],
                                           domain=body["domain"], sigma=float(body.get("sigma", 1.)))
                return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
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
            if kind in ('horizon-mesh','flatten','mesh-export'):
                from seismic_interpretation_ops import horizon_mesh,flatten_volume,mesh_export
                if kind=='horizon-mesh':return pack(horizon_mesh(body['surface'],body['xy'],body['blocks'],domain=body['domain'],unit=body['unit']))
                if kind=='flatten':return pack(flatten_volume(body['volume'],body['horizon'],body['referenceSample']))
                return pack(mesh_export(body['vertices'],body['faces'],body['format']))
            if kind == "track-3d":
                from seismic_horizon_tracking import track_volume
                return track_volume(body["volume"], body["seeds"], event=body["event"],
                    search_samples=body["searchSamples"], correlation_window=body["correlationWindow"],
                    minimum_correlation=body["minimumCorrelation"], barriers=body.get("barriers"),
                    maximum_picks=body.get("maximumPicks",100000))
            if kind == "horizon":
                out = horizon_grid_from_picks(body["picks"], tuple(body["inlineRange"]), tuple(body["crosslineRange"]))
                return dict(grid=_pack_array(out["grid"]), inlineRange=out["inlineRange"], crosslineRange=out["crosslineRange"], populated=out["populated"])
            if kind == "fault":
                out = fault_surface_from_sticks(body["sticks"])
                return dict(vertices=_pack_array(out["vertices"]), faces=np.asarray(out["faces"]).tolist(), stickCount=out["stickCount"], nodesPerStick=out["nodesPerStick"])
            if kind in ("fault-block", "layers", "closure"):
                from seismic_depth_model import fault_block_surface, layer_framework, closure_map
                if kind == "fault-block":
                    out = fault_block_surface(body["points"], body["values"], body["pointBlocks"], body["targetXY"], body["targetBlocks"])
                elif kind == "layers":
                    out = layer_framework(body["top"], body["base"], body["fractions"], body["blocks"])
                else:
                    out = closure_map(body["depthSurface"], body["spacing"])
                return {key: _pack_array(value) if isinstance(value, np.ndarray) and value.dtype.kind in "fbiu" else value.tolist() if isinstance(value, np.ndarray) else value for key, value in out.items()}
            fail(400, "surface_kind", "Choose horizon, fault, fault-block, layers or closure.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "surface_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/models")
    def tool_models(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op == "implicit":
                from seismic_implicit_model import compute_implicit_model
                out = compute_implicit_model(body["extent"], body["resolution"], body["groups"],
                    geometry_confirmed=body.get("geometryConfirmed") is True)
                return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
            if op == "export-corner-resqml":
                from seismic_model_exchange import export_corner_resqml
                out = export_corner_resqml(body["corners"], body["active"], body["properties"],
                    crs_epsg=body["crsEpsg"], z_increases_down=body["zIncreasesDown"],
                    split_tolerance=body["splitTolerance"], geometry_confirmed=body.get("geometryConfirmed") is True)
                return {key: base64.b64encode(value).decode("ascii") if isinstance(value, bytes) else value for key, value in out.items()}
            if op == "grid":
                out = regular_property_grid(body["origin"], body["spacing"], body["shape"], body["values"])
                return dict(origin=np.asarray(out["origin"], float).tolist(), spacing=np.asarray(out["spacing"], float).tolist(), shape=list(out["shape"]), values=_pack_array(out["values"]), grid=out["grid"])
            if op == "well-block":
                return dict(blocked=np.asarray(well_block_average(body["depths"], body["properties"], body["cellEdges"]), float).tolist())
            if op == "export-check":
                return refuse_unrepresentable_export(bool(body.get("faultsHaveYSplits")), body.get("target", "RESQML"))
            if op == "corner-point":
                out = corner_point_pillar_grid(
                    int(body["nx"]), int(body["ny"]), int(body["nz"]),
                    body["xCorners"], body["yCorners"], body["zTops"], body["zBases"], body.get("active"),
                )
                return dict(
                    grid=out["grid"], nx=out["nx"], ny=out["ny"], nz=out["nz"],
                    xCorners=_pack_array(out["xCorners"]), yCorners=_pack_array(out["yCorners"]),
                    zTops=_pack_array(out["zTops"]), zBases=_pack_array(out["zBases"]),
                    active=_pack_array(np.asarray(out["active"], float)), limitations=out["limitations"],
                )
            if op == "export-grdecl":
                grid = regular_property_grid(body["origin"], body["spacing"], body["shape"], body["values"])
                out = export_grdecl_regular(grid, body.get("propertyName", "PORO"))
                return dict(text=out["text"], target=out["target"], cells=out["cells"], property=out["property"])
            if op == "export-resqml":
                from seismic_model_exchange import export_regular_resqml
                grid = regular_property_grid(body["origin"], body["spacing"], body["shape"], body["values"])
                out = export_regular_resqml(grid, property_name=body["propertyName"], property_unit=body["propertyUnit"],
                    property_kind=body["propertyKind"], crs_epsg=body["crsEpsg"],
                    z_increases_down=body["zIncreasesDown"], crs_confirmed=body.get("crsConfirmed") is True)
                return {key: base64.b64encode(value).decode("ascii") if isinstance(value, bytes) else value for key, value in out.items()}
            if op == "volume-sum":
                return volumetric_sum(body["values"], body["cellVolumes"], body.get("active"))
            fail(400, "model_operation", "Choose grid, well-block, export-check, corner-point, export-grdecl, export-resqml or volume-sum.")
        except ImportError:
            fail(503, "model_engine_unavailable", "This operation requires the pinned geological-model worker runtime.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "model_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/4d")
    def tool_4d(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation")
            if op in ('difference-volume','match-volume','cross-equalise-volume','qc-volume'):
                from seismic_volume_workflows import four_d_volume
                return pack(four_d_volume(body))
            if op == "register-3d":
                from seismic_4d_registration import register_vintages
                out = register_vintages(body["baseline"], body["monitor"], body["baselineAxes"], body["monitorAxes"],
                    body["stableMask"], body["maximumShift"], references_confirmed=body.get("referencesConfirmed") is True,
                    maximum_evaluations=body.get("maximumEvaluations", 50))
                return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
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
                matched, diff, report = match_and_difference(
                    baseline, monitor, np.asarray(body["stableMask"], bool),
                    int(body.get("maxLag", 10)), body.get("phaseDegrees"),
                )
                return dict(matched=_pack_array(matched.samples), difference=_pack_array(diff.samples), report=report)
            if op == "qc":
                mask = None if body.get("stableMask") is None else np.asarray(body["stableMask"], bool)
                bundle = qc_bundle(baseline, monitor, stable_mask=mask, window=int(body.get("window", 21)), max_lag_samples=int(body.get("maxLagSamples", 8)))
                return dict(
                    support=bundle["support"], globalRepeatability=bundle["globalRepeatability"],
                    nrms=_pack_array(np.asarray(bundle["nrms"]["samples"], float)),
                    correlation=_pack_array(np.asarray(bundle["correlation"]["samples"], float)),
                    timeShift=_pack_array(np.asarray(bundle["timeShift"]["samples"], float)),
                )
            if op == "cross-equalise":
                matched, difference, report = cross_equalise_fir(baseline, monitor, body["stableMask"],
                    taps=body.get("taps", 5), regularization=body.get("regularization", .001))
                return dict(matched=_pack_array(matched.samples), difference=_pack_array(difference.samples), report=report)
            fail(400, "four_d_operation", "Choose associate, difference, match or qc.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "four_d_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/export")
    def tool_export(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            samples = _finite_matrix(body["samples"], "samples", ndim=2)
            block = TraceBlock(samples, float(body["dt"]), float(body.get("start", 0.0)), body.get("domain", "TWT"))
            fmt = body.get("format", "segy-ieee")
            meta = describe_export(block, fmt)
            if fmt == "segy-ieee":
                blob = export_ieee_segy(block, text_header=body.get("textHeader", ""), inlines=body.get("inlines"), crosslines=body.get("crosslines"), offsets=body.get("offsets"))
            else:
                blob = export_su_ieee(block)
            return dict(**meta, bytesBase64=base64.b64encode(blob).decode("ascii"), byteLength=len(blob))
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "export_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/handoff")
    def tool_handoff(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            op = body.get("operation", "accepted")
            if op == "accepted":
                return accepted_processing_handoff(
                    run_id=body["runId"], run_status=body["runStatus"], result_dataset_id=body.get("resultDatasetId"),
                    source_id=body["sourceId"], source_version_at_run=body["sourceVersionAtRun"],
                    current_source_version=body["currentSourceVersion"], graph_fingerprint=body["graphFingerprint"],
                    accepted_at=body.get("acceptedAt"),
                )
            if op == "mark-stale":
                return dict(resources=mark_stale_resources(body["resources"], body["currentVersions"]))
            fail(400, "handoff_operation", "Choose accepted or mark-stale.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "handoff_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/imaging")
    def tool_imaging(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            from seismic_imaging import kirchhoff_operator
            points = _finite_matrix(body["points"], "image points", ndim=2)
            sources = _finite_matrix(body["sources"], "source coordinates", ndim=2)
            receivers = _finite_matrix(body["receivers"], "receiver coordinates", ndim=2)
            if len(points) * len(sources) > 2_000_000:
                raise ValueError("Use at most two million image-point/trace pairs per analytical request.")
            count = body["sampleCount"]
            if type(count) is not int or not 2 <= count <= 4096 or len(sources) * count > 2_000_000:
                raise ValueError("Use a bounded receiver/time grid within two million samples.")
            op = kirchhoff_operator(points, sources, receivers, samples=count, dt=float(body["dt"]),
                start=float(body.get("start", 0)), velocity=body.get("velocity"),
                source_times=body.get("sourceTimes"), receiver_times=body.get("receiverTimes"),
                aperture_metres=body["apertureMetres"])
            if body.get("operation") == "model":
                model = _finite_matrix(body["reflectivity"], "reflectivity", ndim=1)
                if len(model) != len(points):
                    raise ValueError("One reflectivity value is required per image point.")
                out = (op @ model).reshape(len(sources), count)
            elif body.get("operation") == "migrate":
                data = _finite_matrix(body["samples"], "samples", ndim=2)
                if data.shape != (len(sources), count):
                    raise ValueError("Observations must match the declared acquisition and time grid.")
                out = op.rmatvec(data.ravel())
            else:
                raise ValueError("Choose model or migrate.")
            return dict(result=_pack_array(out), dimension=points.shape[1],
                        amplitudeModel="kinematic", travelTimes="reviewed-tables" if body.get("sourceTimes") is not None else "homogeneous-analytic")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "imaging_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/travel-times")
    def tool_travel_times(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            from seismic_travel_times import first_arrival_times
            velocity = _finite_matrix(body["velocity"], "interval velocity", max_cells=50000)
            times = first_arrival_times(velocity, body["spacing"], body["sourceIndex"])
            return dict(times=_pack_array(times), unit="s", dimension=velocity.ndim,
                        method="isotropic-first-order-fast-marching", sourceIndex=body["sourceIndex"])
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "travel_time_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/marine")
    def tool_marine(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            from seismic_srme import predict_surface_multiples
            if body.get("operation") != "srme-predict":
                raise ValueError("Choose srme-predict with a reviewed common surface response.")
            response = _finite_matrix(body["response"], "reflection response", ndim=3)
            if response.shape[0] > 64 or response.shape[-1] > 4096:
                raise ValueError("Bound analytical SRME to 64 surface points and 4096 time samples.")
            out = predict_surface_multiples(response, float(body["dt"]), body["surfaceCoordinates"],
                body["quadratureWeights"], body["sourceWavelet"], geometry_confirmed=body.get("geometryConfirmed") is True,
                reflection_coefficient=body.get("reflectionCoefficient", -1.), regularization=body.get("regularization", .001))
            return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "marine_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/regularise")
    def tool_regularise(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            from seismic_regularization import regularise_traces
            out = regularise_traces(body["coordinates"], body["samples"], body["targets"], body["coordinateScales"],
                neighbours=body.get("neighbours", 32), smoothing=body.get("smoothing", 0.))
            return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "regularisation_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/statics")
    def tool_statics(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            from seismic_statics import fit_surface_statics
            out = fit_surface_statics(body["observedTimes"], body["predictedTimes"], body["sourceIds"], body["receiverIds"],
                regularization=body.get("regularization", .001), maximum_shift_seconds=body["maximumShiftSeconds"],
                iterations=body.get("iterations", 200))
            return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "statics_input", str(error))

    @app.post("/api/projects/{pid}/seismic/tools/geostatistics")
    def tool_geostatistics(pid: str, body: dict[str, Any], user=Depends(owner)):
        project(user["uid"], pid)
        try:
            from seismic_geostatistics import empirical_variogram, fit_variogram, ordinary_kriging, sequential_simulation
            operation = body.get("operation")
            if operation == "variogram":
                out = empirical_variogram(body["points"], body["values"], body["edges"])
            elif operation == "fit-variogram":
                out = fit_variogram(body["points"], body["values"], body["edges"])
            else:
                settings = dict(ranges=body["ranges"], sill=body.get("sill", 1.),
                                nugget=body.get("nugget", 0.), neighbours=body.get("neighbours", 32))
                if operation == "kriging":
                    out = ordinary_kriging(body["points"], body["values"], body["targets"], **settings)
                elif operation in ("sgs", "sis"):
                    if operation == "sis" and body.get("categories") is None:
                        raise ValueError("Indicator simulation requires explicit categories.")
                    out = sequential_simulation(body["points"], body["values"], body["targets"], seed=body["seed"],
                        categories=body.get("categories") if operation == "sis" else None,
                        gaussian_confirmed=body.get("gaussianConfirmed") is True, **settings)
                else:
                    raise ValueError("Choose variogram, kriging, sgs or sis.")
            return {key: _pack_array(value) if isinstance(value, np.ndarray) else value for key, value in out.items()}
        except (TypeError, ValueError, KeyError, np.linalg.LinAlgError) as error:
            fail(400, "geostatistics_input", str(error))

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
            if op in ('poststack-volume','prestack-volume'):
                from seismic_volume_workflows import invert_volume
                return pack(invert_volume(body,cancelled=cancelled,progress=progress))
            if op=='reflectivity-model':
                from seismic_volume_workflows import reflectivity_model
                return pack(reflectivity_model(body['vp'],body['vs'],body['density'],body['angles'],body.get('method','aki-richards')))
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
            if op == "prestack-inversion":
                from seismic_inversion import prestack_inversion
                block = TraceBlock(_finite_matrix(body["samples"], "samples", 2), float(body["dt"]),
                    float(body.get("start", 0)), "TWT", history=list(body.get("history", [])))
                out = prestack_inversion(block, body["angles"], body["wavelet"], body["waveletDt"], body["background"],
                    amplitude_review=body.get("amplitudeReview") is True, regularization=body.get("regularization", .1),
                    smoothness=body.get("smoothness", 0.), iterations=body.get("iterations", 300))
                return dict(properties=_pack_array(out["properties"]), propertyNames=out["propertyNames"], units=out["units"],
                    predicted=_pack_array(out["predicted"].samples), residual=_pack_array(out["residual"].samples),
                    diagnostics=out["diagnostics"], warning=out["warning"])
            if op == "source-estimate":
                wavelet, meta = source_estimation_least_squares(body["greens"], body["observed"], float(body.get("noiseFloor", 1e-6)))
                return dict(wavelet=np.asarray(wavelet, float).tolist(), **meta)
            if op == "property-prediction":
                from seismic_prediction import calibrated_prediction
                out = calibrated_prediction(body["features"], body["targets"], body["wellIds"], body["predictionFeatures"],
                    blind_wells=body["blindWells"], feature_names=body["featureNames"], target_unit=body["targetUnit"],
                    task=body["task"], seed=body.get("seed", 42), trees=body.get("trees", 100))
                return pack(out)
            if op == "fwi-plan":
                return multi_scale_fwi_plan(body["frequencyBandsHz"], int(body.get("maxStepsPerBand", 5)))
            if op == "illumination-weight":
                out = rtm_illumination_weight(body["image"], body["illumination"], float(body.get("floor", 1e-6)))
                return dict(image=_pack_array(out["image"]), floor=out["floor"], illuminatedCells=out["illuminatedCells"])
            fail(400, "qi_operation", "Choose avo, poststack-inversion, source-estimate, fwi-plan or illumination-weight.")
        except ImportError:
            fail(503, "qi_engine_unavailable", "This operation requires the pinned quantitative worker runtime.")
        except (TypeError, ValueError, KeyError) as error:
            fail(400, "qi_input", str(error))
