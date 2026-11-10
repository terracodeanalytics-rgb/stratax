"""Execute one frozen checkpoint with private, depth-checked intermediate curves."""
import hashlib
import json
import numpy as np
from scientific_catalog import MAX_CELLS, ARTIFACT_BUDGET
from scientific_core import evaluate, require, unit_factor, clean, require_geomechanics_tvd, retained_selection, validate_preparation_sources


def execute_segment(record, project_root, output, prefix, cancelled, progress):
    from scientific_worker import read_inputs, scoped_inputs, write_result
    results, axes, lineages, manifests, cells = {}, {}, {}, [], 0
    steps = record["configuration"]["steps"]
    all_sources = record["inputSnapshots"]
    for ordinal, step in enumerate(steps):
        require(not cancelled(), "Checkpoint cancelled. Completed artifacts are retained.", "cancelled")
        progress(dict(stepId=step["id"], current=ordinal, total=len(steps), status="running"))
        external = {role:b for role,b in step["bindings"].items() if not b.get("stepId")}
        sources = {b["datasetId"]:all_sources[b["datasetId"]] for b in external.values()}
        source_runs=set(sources)
        bindings = dict(external)
        selection = step.get("scope")
        validate_preparation_sources(step["method"],step["parameters"],step["bindings"],all_sources,selection,step.get("wellId"))
        if not step.get("alignment"):selection = selection or retained_selection(sources,external)
        if selection:
            bindings["__canvas_index"] = {k:selection[k] for k in ("datasetId", "columnId", "unit")}
            sources[selection["datasetId"]] = all_sources[selection["datasetId"]]
        alignment = step.get("alignment")
        require(len(sources) <= 1 or alignment, "Align curves onto one reviewed dataset before using them together. Row position is not an alignment.", "alignment_required")
        relative_sources = {k:dict(s, manifest=s["manifest"].split("/projects/", 1)[1].split("/", 1)[1]) for k,s in sources.items()}
        if alignment:
            require(alignment.get("reviewed") is True, "Review the axis, spacing, interpolation and gap rules before alignment.", "alignment_required")
            inputs, units, axis, reference = {}, {}, None, alignment.get("depthReference")
            alignment_parameters = {k:v for k,v in alignment.items() if k != "reviewed"}
            for role, binding in external.items():
                ds = sources[binding["datasetId"]]
                require(ds.get("references", {}).get("depthReference") == reference, "Alignment requires the same confirmed source depth reference; it cannot convert MD into TVD.", "alignment_reference")
                columns = ds.get("columns", [])
                indices = [c for c in columns if c["id"] == ds.get("indexColumnId")] or [c for c in columns if c.get("mnemonic", "").upper() in ("DEPT", "DEPTH", reference)]
                require(len(indices) == 1, "Confirm one source depth index before resampling.", "alignment_index")
                index = indices[0]
                values, input_units = read_inputs(project_root, {ds["id"]:relative_sources[ds["id"]]}, dict(curve=binding, depth=dict(datasetId=ds["id"], columnId=index["id"], unit=index.get("effectiveUnit") or index.get("unit"))), cancelled)
                aligned = evaluate("align-curve", values, alignment_parameters, input_units)
                inputs[role], units[role] = aligned["series"]["curve"], binding["unit"]
                axis = np.asarray(aligned["series"]["depth"], float)
        else:
            inputs, units = read_inputs(project_root, relative_sources, bindings, cancelled) if bindings else ({}, {})
            inputs, units, axis = scoped_inputs(inputs, units, selection)
            reference = selection.get("reference") if selection else None
        from scientific_evaluation import validate_bindings, validate_basis, retain_semantics
        metadata=validate_bindings(step["method"],step["parameters"],step["bindings"],all_sources)
        for role, binding in step["bindings"].items():
            if not binding.get("stepId"): continue
            previous = results.get(binding["stepId"])
            source_runs.update(lineages.get(binding["stepId"],set()))
            require(previous and binding["output"] in previous["series"], "A private dependency did not produce the selected output.", "workflow_output")
            actual_unit = previous["units"].get(binding["output"])
            basis=validate_basis(step["method"],role,binding,previous.get("seriesMetadata",{}).get(binding["output"],{}),step["parameters"])
            if basis:metadata[role]=dict(porosityBasis=basis)
            require(actual_unit == binding["unit"], "A private output unit differs from its reviewed binding.", "workflow_unit")
            candidate, candidate_reference = axes[binding["stepId"]]
            require(candidate is not None, "A chained curve requires a retained depth index.", "alignment_required")
            values = previous["series"][binding["output"]]
            if alignment:
                require(candidate_reference == reference, "A private curve uses another depth reference. Review its transformation first.", "alignment_reference")
                aligned = evaluate("align-curve", dict(depth=candidate, curve=values), alignment_parameters, dict(depth="m", curve=actual_unit))
                candidate = np.asarray(aligned["series"]["depth"], float)
                values = aligned["series"]["curve"]
            if axis is None:
                require(not external, "Select the retained source depth index before combining private and imported curves.", "alignment_required")
                axis, reference = candidate, candidate_reference
            else:
                require(reference == candidate_reference and np.array_equal(axis, candidate, equal_nan=True), "Source and private curves have different depth axes. Align and review them explicitly.", "alignment_required")
            inputs[role] = values
            units[role] = actual_unit
        cells += sum(np.asarray(x).size for x in inputs.values())
        require(cells <= MAX_CELLS, "This checkpoint exceeds the cumulative shared input-cell budget.", "workflow_budget")
        if step["method"]=="depth-match":
            require(source_runs=={step["parameters"]["sourceRun"]},"Depth-match anchors can be reused only for explicitly selected curves from their bound logging run.","depth_match_run")
        if step["method"]=="geomechanics-1d":
            depth=step["bindings"]["depth"]
            depth_reference=axes[depth["stepId"]][1] if depth.get("stepId") else (sources[depth["datasetId"]].get("references") or {}).get("depthReference")
            require_geomechanics_tvd(depth_reference,step["parameters"])
            depth_sources=lineages[depth["stepId"]] if depth.get("stepId") else {depth["datasetId"]}
            require(depth_sources and all((all_sources[did].get("references") or {}).get("depthReference")=="TVD" for did in depth_sources),
                    "The geomechanics depth lineage must retain reviewed TVD source references; a display or scope label cannot convert MD or TVDSS.","depth_reference")
            require(reference in (None,"TVD"),"Geomechanics requires matching TVD scope and alignment references.","depth_reference")
            reference="TVD"
        if step["method"] in ("cutoff-rules","reservoir-summary","temperature-profile"):
            require(reference in ("MD","TVD","TVDSS") and reference==step["parameters"].get("depthReference","MD"),"Confirm matching depth references for these cutoff/summary axes; no implicit MD/TVD conversion is made.","depth_reference")
        if step["method"]=="align-curve":
            require(reference==step["parameters"]["depthReference"],"Resampling requires the same retained depth reference; no MD/TVD/TVDSS conversion is inferred.","depth_reference")
        result = retain_semantics(evaluate(step["method"], inputs, step["parameters"], units),metadata)
        if "depth" in result["series"]:
            axis = np.asarray(result["series"]["depth"], float)
            reference = result["summary"].get("depthReference", reference)
        elif axis is not None and any(len(x) == len(axis) for x in result["series"].values()):
            result["series"] = dict(depth=clean(axis), **result["series"])
            result["units"]["depth"] = "m"
        results[step["id"]], axes[step["id"]] = result, (axis, reference)
        lineages[step["id"]]=source_runs
        rid = "run-"+hashlib.sha256((record["id"]+step["id"]).encode()).hexdigest()[:32]
        context = dict(step, scope=dict(reference=reference) if axis is not None else None)
        # Sources for a wholly private step still identify its well and immutable lineage.
        lineage = sources or {k:v for k,v in all_sources.items() if v.get("well") == step.get("wellId")}
        write_result(output, prefix, rid, result, lineage, context)
        manifest = json.loads((output/"manifest.json").read_text(encoding="utf-8"))
        for dataset in manifest["datasets"]:
            dataset["workflowStepId"] = step["id"]
            dataset["well"] = step.get("wellId") or dataset.get("well", "")
            # Persist the same metadata to the dataset manifest as to the package.
            (output/dataset["manifest"].rsplit("/", 1)[-1]).write_text(json.dumps(dataset, allow_nan=False), encoding="utf-8")
        manifests.append(manifest)
        progress(dict(stepId=step["id"], current=ordinal+1, total=len(steps), status="completed"))
        require(sum(p.stat().st_size for p in output.iterdir() if p.is_file()) <= ARTIFACT_BUDGET, "Checkpoint artifacts exceed the shared reservation.")
    selected=record["configuration"].get("outputSelections", [])
    package = dict(schemaVersion=1, method="workflow-segment", methodVersion=record["methodVersion"],
                   datasets=[d for m in manifests for d in m["datasets"] if not selected or d["workflowStepId"] in selected], preview={},
                   summary={s["id"]:m["summary"] for s,m in zip(steps, manifests)},
                   warnings=list(dict.fromkeys(w for m in manifests for w in m.get("warnings", []))),
                   steps=manifests, provenance=dict(configuration=record["configuration"], sources=list(all_sources.values())),
                   scientificApproval=False)
    payload = json.dumps(package, allow_nan=False)
    require(len(payload.encode()) <= 2*1024**2, "Checkpoint evidence exceeds the manifest budget; reduce the study segment.")
    (output/"manifest.json").write_text(payload, encoding="utf-8")
    summary=package["summary"] if len(json.dumps(package["summary"]).encode())<=64*1024 else dict(notice="Open the complete checkpoint artifact for zonal/calibration tables.")
    return dict(summary=summary, warnings=package["warnings"][:100], datasetCount=len(package["datasets"]))
