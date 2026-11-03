"""Revisioned, owner-scoped review checkpoints on the existing science worker.

Definitions contain bindings, never sample arrays. The science lease and artifact
reservation cover the entire segment, including its private intermediate results.
"""
import hashlib
import json
import re
import math
from fastapi import Depends
from pydantic import Field
from google.cloud import firestore
from scientific_catalog import METHODS, MAX_ROWS, MAX_CELLS, allowed

CHECKPOINTS = ("conditioning", "calibration", "evaluation")


def check_definition(value, fail):
    zones=value.get("zones", [])
    for i,zone in enumerate(zones):
        if not isinstance(zone,dict) or not zone.get("id") or not zone.get("name") or not zone.get("wellId") or zone.get("reference") not in ("MD","TVD","TVDSS") or any(type(zone.get(k)) not in (int,float) or not math.isfinite(zone[k]) for k in ("top","base")) or zone["base"]<=zone["top"]:
            fail(400,"workflow_zones","Each zone needs a name, well, confirmed depth reference and finite ordered metre boundaries.")
        if any(z.get("id")==zone["id"] or z.get("wellId")==zone["wellId"] and z.get("reference")==zone["reference"] and z["top"]<zone["base"] and z["base"]>zone["top"] for z in zones[:i]):
            fail(400,"workflow_zones","Zone identifiers must be unique and intervals in the same well/reference cannot overlap.")
    steps = value.get("steps", [])
    if not 1 <= len(steps) <= 100:
        fail(400, "workflow_steps", "Define 1–100 explicitly bound workflow steps.")
    seen, previous = {}, -1
    for step in steps:
        if not isinstance(step, dict) or not isinstance(step.get("bindings"), dict) or not isinstance(step.get("parameters", {}), dict):
            fail(400, "workflow_step", "Each step requires an object with bindings and parameters.")
        sid = step.get("id", "")
        method = METHODS.get(step.get("method"))
        if not isinstance(step.get("wellId"),str) or not step["wellId"].strip():
            fail(400,"workflow_well","Resolve each step to one well before saving this study.")
        if step.get("reviewRequired") and step.get("reviewed") is not True:
            fail(400,"workflow_review","Review each well's model applicability and assumptions before saving its proposed mappings.")
        if not re.fullmatch(r"[\w-]{1,100}", sid, re.ASCII) or sid in seen or not method:
            fail(400, "workflow_step", "Each step needs a unique identifier and an available scientific method.")
        stage = step.get("checkpoint")
        if stage not in CHECKPOINTS or CHECKPOINTS.index(stage) < previous:
            fail(400, "workflow_order", "Order steps by conditioning, calibration, then evaluation.")
        previous = CHECKPOINTS.index(stage)
        bindings = step.get("bindings", {})
        if set(bindings) != {item["role"] for item in method["inputs"]}:
            fail(400, "workflow_bindings", f"Resolve every required input for {method['name']}.")
        for binding in bindings.values():
            if not isinstance(binding, dict):
                fail(400, "workflow_binding", "Each curve binding must be an object.")
            if any(not isinstance(binding.get(k), str) or not re.fullmatch(r"[\w-]{1,100}", binding[k], re.ASCII) for k in ("datasetId", "columnId", "stepId") if k in binding):
                fail(400, "workflow_binding", "Use retained dataset, column and step identifiers.")
            if binding.get("confirmed") is not True or not binding.get("unit"):
                fail(400, "workflow_mapping", "Review each curve mapping and unit before saving a workflow.")
            if binding.get("stepId"):
                if binding["stepId"] not in seen or not binding.get("output"):
                    fail(400, "workflow_dependency", "A step can consume only a named output from an earlier step.")
                if seen[binding["stepId"]].get("wellId") != step.get("wellId"):
                    fail(400, "workflow_well", "Resolve calculations independently for each well.")
            elif not binding.get("datasetId") or not binding.get("columnId"):
                fail(400, "workflow_mapping", "Bind a retained dataset/column or an earlier step output.")
        if set(step.get("parameters", {}))-set(method["parameters"]):
            fail(400, "workflow_parameters", "Remove parameters outside the selected method contract.")
        seen[sid] = step
    missing = set(CHECKPOINTS)-{s["checkpoint"] for s in steps}
    if missing:
        fail(400, "workflow_checkpoints", "Include explicit work at all three review checkpoints.")
    selected=value.get("outputSelections", [])
    if set(selected)-set(seen):
        fail(400,"workflow_outputs","Output selections must name workflow step identifiers.")
    for well in {s["wellId"] for s in steps}:
        if {s["checkpoint"] for s in steps if s["wellId"]==well}!=set(CHECKPOINTS):
            fail(400,"workflow_well_checkpoints","Every well must have all three checkpoints; resolve each exception before starting.")
        if selected and {s["checkpoint"] for s in steps if s["wellId"]==well and s["id"] in selected}!=set(CHECKPOINTS):
            fail(400,"workflow_outputs","Select at least one published output step per well and checkpoint.")
    if selected:
        for step in steps:
            for binding in step["bindings"].values():
                dependency=seen.get(binding.get("stepId"))
                if dependency and dependency["checkpoint"]!=step["checkpoint"] and dependency["id"] not in selected:
                    fail(400,"workflow_outputs","Publish every output step needed by a later checkpoint.")
    return value


def effective_parameters(definition, step):
    """Parameter values retain their winning level and units for review/reporting."""
    layers = [("method", {k:v["default"] for k,v in METHODS[step["method"]]["parameters"].items()}),
              ("project", definition.get("projectParameters", {}).get(step["method"], {})),
              ("well", definition.get("wellParameters", {}).get(step.get("wellId", ""), {}).get(step["method"], {})),
              ("zone", definition.get("zoneParameters", {}).get(step.get("zoneId", ""), {}).get(step["method"], {})),
              ("step", step.get("parameters", {}))]
    values, origins = {}, {}
    for level, layer in layers:
        for key, item in layer.items():
            if key not in METHODS[step["method"]]["parameters"]:
                raise ValueError("A parameter is not defined by this method.")
            wrapped = isinstance(item, dict) and "value" in item and "unit" in item
            values[key] = item["value"] if wrapped else item
            origins[key] = dict(level=level, unit=item["unit"] if wrapped else "method contract")
            if wrapped and item["unit"] != "method contract":
                dimensions={"porosity-density":{"matrix":("density","kg/m3"),"fluid":("density","kg/m3")},
                            "porosity-sonic":{"matrix":("slowness","s/m"),"fluid":("slowness","s/m")}}
                dimension=dimensions.get(step["method"],{}).get(key)
                if step["method"].startswith("shale-") and key in ("clean","shale"):dimension=("api","gAPI")
                if step["method"].startswith("saturation-") and key in ("rw","rsh"):dimension=("resistivity","ohm.m")
                if key in ("top","base","maxGap","spacing","shift","boundary","bitSize","tolerance"):dimension=("length","m")
                if key in ("shalePorosity","swi"):dimension=("fraction","v/v")
                if dimension:
                    from scientific_core import unit_factor
                    values[key]=item["value"]*unit_factor(dimension[0],item["unit"])
                    origins[key].update(unit=dimension[1],suppliedUnit=item["unit"],suppliedValue=item["value"])
                else:
                    raise ValueError("Use the documented method-contract units for "+key+".")
    return values, origins


def prepare_segment(pr, parent_ref, expected_revision, tx, record, validate, Configuration, fail, restore, fingerprint):
    parent = restore(parent_ref.get(transaction=tx).to_dict())
    if not parent or parent["revision"] != expected_revision or parent["status"] not in ("ready", "failed", "cancelled"):
        fail(409, "workflow_conflict", "Reload the workflow run before starting this checkpoint.")
    stage = CHECKPOINTS[parent["checkpointIndex"]]
    definition = parent["definition"]
    steps = [dict(s) for s in definition["steps"] if s["checkpoint"] == stage]
    snapshots, resolved = {}, []
    for did, expected in parent.get("inputFingerprints", {}).items():
        source = pr.collection("datasets").document(did).get(transaction=tx).to_dict()
        if not source or not source.get("active") or fingerprint(source) != expected:
            fail(409, "stale_inputs", "An earlier checkpoint source changed. Start a new study run; accepted evidence is retained.")
        snapshots[did] = dict(source, fingerprint=expected)
    for step in steps:
        bindings = {}
        for role, original in step["bindings"].items():
            binding = dict(original)
            if binding.get("stepId") and binding["stepId"] in parent.get("outputs", {}):
                output = parent["outputs"][binding["stepId"]].get(binding["output"])
                if not output:
                    fail(409, "workflow_output", "An earlier checkpoint did not publish the requested output.")
                binding = dict(output, unit=binding["unit"], confirmed=True)
            bindings[role] = binding
        if (step.get("scope") or {}).get("stepId"):
            selection=step["scope"]
            index=parent.get("outputs",{}).get(selection["stepId"],{}).get(selection.get("output","depth"))
            if not index:
                fail(409,"workflow_index","Select a published, reviewed depth output from an earlier checkpoint for this scope.")
            step["scope"]={k:v for k,v in selection.items() if k not in ("stepId","output")}|index
        try:
            parameters, origins = effective_parameters(definition, step)
        except (ValueError,TypeError) as error:
            fail(400,"workflow_parameters",str(error))
        from scientific_api import validate_parameters
        parameters = validate_parameters(step["method"],parameters,fail)
        if step.get("zoneId"):
            zone = next((z for z in definition.get("zones", []) if z.get("id") == step["zoneId"]), None)
            if not zone or zone.get("wellId") != step.get("wellId") or not step.get("scope"):
                fail(400, "workflow_zone", "Bind this zone to its well and an explicit source depth index.")
            if zone.get("reference") != step["scope"].get("reference") or not isinstance(zone.get("top"), (int,float)) or not isinstance(zone.get("base"), (int,float)) or zone["base"] <= zone["top"]:
                fail(400, "workflow_zone", "Review the zone's boundaries and matching source depth reference.")
            step["scope"] = dict(step["scope"], top=zone["top"], base=zone["base"], halfOpen=True)
        if step.get("alignment") and step.get("scope"):
            fail(400, "alignment_scope", "Use the explicit alignment bounds instead of a source-row selection when resampling.")
        # Full existing validation applies to externally bound steps. Private
        # dependencies are validated numerically against the same catalog by the worker.
        external = {k:v for k,v in bindings.items() if not v.get("stepId")}
        if len(external) == len(bindings):
            cb = Configuration(revision=0, method=step["method"], bindings=external, parameters=parameters,
                               scope=step.get("scope"), alignmentConfirmed=bool(step.get("alignment")))
            _, sources, parameters = validate(pr, record, cb, tx)
            snapshots.update(sources)
        else:
            spec = METHODS[step["method"]]
            if not allowed(spec, record["project"]["workflows"]):
                fail(400, "method_unavailable", "Enable the petrophysics workflow first.")
            from scientific_core import unit_factor, ScienceProblem
            for item in spec["inputs"]:
                binding = bindings[item["role"]]
                try: unit_factor(item["dimension"], binding["unit"])
                except ScienceProblem as error: fail(400, error.code, str(error))
                if not binding.get("stepId"):
                    ds = pr.collection("datasets").document(binding["datasetId"]).get(transaction=tx).to_dict()
                    if not ds or not ds.get("active") or not ds.get("manifest"):
                        fail(409, "workflow_source", "A selected workflow source is no longer active.")
                    column = next((c for c in ds.get("columns", []) if c["id"] == binding["columnId"]), None)
                    if not column or binding["columnId"] not in ds.get("activeColumns", [c["id"] for c in ds["columns"]]):
                        fail(400, "workflow_column", "Select an active source curve.")
                    from scientific_api import validate_binding_unit
                    validate_binding_unit(item["dimension"],column,binding["unit"],fail)
                    snapshots[ds["id"]] = dict(ds, fingerprint=fingerprint(ds))
        if step.get("wellId") and any(s.get("well") != step["wellId"] for key,s in snapshots.items() if key in {b.get("datasetId") for b in external.values()}):
            fail(400, "workflow_well", "A curve binding belongs to another well. Resolve the exception before running.")
        resolved.append(dict(step, bindings=bindings, parameters=parameters, parameterOrigins=origins))
    for did, snapshot in snapshots.items():
        from scientific_api import lineage_fingerprints
        ds = pr.collection("datasets").document(did).get(transaction=tx).to_dict()
        snapshots[did] = {k:ds.get(k) for k in ("id", "manifest", "sourceSha256", "parserVersion", "scientificRunId", "sourceId", "rowCount", "well", "family", "importId", "columns", "indexColumnId", "references", "mapping")}
        snapshots[did]["fingerprint"] = fingerprint(ds)
        snapshots[did]["lineageFingerprints"] = lineage_fingerprints(pr,ds,tx,fail)
    # Cumulative, not a per-step allowance. Repeated uses count as processing work.
    rows = sum(snapshots[b["datasetId"]].get("rowCount", 0) for s in resolved for b in s["bindings"].values() if not b.get("stepId"))
    if rows > MAX_CELLS or any(s.get("rowCount", 0) > MAX_ROWS for s in snapshots.values()):
        fail(413, "workflow_budget", "This checkpoint exceeds the shared row/cell budget. Use a smaller explicit study segment.")
    configuration = dict(method="workflow-segment", workflowRunId=parent["id"], checkpoint=stage,
                         checkpointIndex=parent["checkpointIndex"], steps=resolved, bindings={},outputSelections=definition.get("outputSelections", []))
    return configuration, snapshots, {}, parent


def install_workflows(app, database, owner, project, valid, fail, start, get_run, cancel, review,
                      RunRequest, Review, Strict, now, encode, restore):
    class Definition(Strict):
        revision: int = Field(default=0, ge=0)
        name: str = Field(min_length=1, max_length=200)
        steps: list[dict] = Field(max_length=100)
        projectParameters: dict = {}
        wellParameters: dict = {}
        zoneParameters: dict = {}
        zones: list[dict] = Field(default=[], max_length=1000)
        outputSelections: list[str] = Field(default=[], max_length=100)

    class Start(Strict):
        workflowId: str
        revision: int = Field(ge=1)
        idempotencyKey: str

    class Segment(Strict):
        revision: int = Field(ge=1)
        idempotencyKey: str

    def scoped(uid, pid, rid):
        pr, _ = project(uid, pid)
        ref = pr.collection("scienceWorkflowRuns").document(valid(rid))
        run = restore(ref.get().to_dict())
        if not run: fail(404, "workflow_missing", "This workflow run is unavailable in the current project.")
        return pr, ref, run

    def mark_stale(pr,run,sources=None):
        from scientific_api import fingerprint
        run["stale"]=False
        for did,expected in run.get("inputFingerprints",{}).items():
            source=sources.get(did) if sources is not None else pr.collection("datasets").document(did).get().to_dict()
            if not source or not source.get("active") or fingerprint(source)!=expected:
                run["stale"]=True;break
        return run

    @app.get("/api/projects/{pid}/science/workflows")
    def listing(pid: str, user=Depends(owner)):
        pr, _ = project(user["uid"], pid)
        return dict(workflows=[restore(d.to_dict()) for d in pr.collection("scienceWorkflows").limit(200).stream()])

    @app.post("/api/projects/{pid}/science/workflows/validate")
    def validate_definition(pid: str, body: Definition, user=Depends(owner)):
        project(user["uid"], pid)
        definition=check_definition(body.model_dump(), fail)
        from scientific_api import validate_parameters
        effective={}
        for step in definition["steps"]:
            try:values,origins=effective_parameters(definition,step)
            except (ValueError,TypeError) as error:fail(400,"workflow_parameters",str(error))
            effective[step["id"]]=dict(values=validate_parameters(step["method"],values,fail),origins=origins)
        return dict(valid=True, definition=definition,effectiveParameters=effective)

    @app.put("/api/projects/{pid}/science/workflows/{wid}")
    def save(pid: str, wid: str, body: Definition, user=Depends(owner)):
        pr, _ = project(user["uid"], pid)
        ref = pr.collection("scienceWorkflows").document(valid(wid))
        value = check_definition(body.model_dump(), fail)
        if len(json.dumps(encode(value)).encode())>384*1024:
            fail(413,"workflow_metadata_budget","Reduce this workflow definition's metadata. Keep sampled arrays in retained dataset artifacts.")
        @firestore.transactional
        def write(tx):
            old = restore(ref.get(transaction=tx).to_dict()) or {}
            if old.get("revision", 0) != body.revision:
                fail(409, "workflow_conflict", "This definition changed elsewhere. Reload it; your draft is retained.")
            value.update(id=wid, revision=body.revision+1, updatedAt=now())
            tx.set(ref, encode(value))
        write(database().transaction())
        return value

    @app.get("/api/projects/{pid}/science/workflows/{wid}")
    def get_definition(pid: str, wid: str, user=Depends(owner)):
        pr, _ = project(user["uid"], pid)
        value = restore(pr.collection("scienceWorkflows").document(valid(wid)).get().to_dict())
        if not value: fail(404, "workflow_missing", "This workflow definition is unavailable.")
        return value

    @app.delete("/api/projects/{pid}/science/workflows/{wid}")
    def remove(pid: str, wid: str, revision: int, user=Depends(owner)):
        pr, _ = project(user["uid"], pid)
        ref = pr.collection("scienceWorkflows").document(valid(wid))
        @firestore.transactional
        def write(tx):
            value = restore(ref.get(transaction=tx).to_dict())
            if not value or value["revision"] != revision:
                fail(409, "workflow_conflict", "Reload the definition before removing it.")
            tx.delete(ref)
        write(database().transaction())
        return dict(deleted=True)

    @app.post("/api/projects/{pid}/science/workflow-runs", status_code=201)
    def create(pid: str, body: Start, user=Depends(owner)):
        pr, _ = project(user["uid"], pid)
        rid = "workflow-"+hashlib.sha256(valid(body.idempotencyKey).encode()).hexdigest()[:32]
        ref = pr.collection("scienceWorkflowRuns").document(rid)
        @firestore.transactional
        def write(tx):
            old = restore(ref.get(transaction=tx).to_dict())
            definition = restore(pr.collection("scienceWorkflows").document(valid(body.workflowId)).get(transaction=tx).to_dict())
            if old:
                if old["workflowId"] != body.workflowId or old["definition"]["revision"] != body.revision:
                    fail(409, "idempotency_conflict", "Use a new submission identifier for this definition.")
                return old
            if not definition or definition["revision"] != body.revision:
                fail(409, "workflow_conflict", "Reload the saved definition before starting.")
            value = dict(id=rid, workflowId=body.workflowId, definition=definition, revision=1,
                         status="ready", checkpointIndex=0, checkpoints=[], outputs={}, createdAt=now())
            tx.set(ref, encode(value))
            return value
        return write(database().transaction())

    @app.get("/api/projects/{pid}/science/workflow-runs")
    def runs(pid: str, user=Depends(owner)):
        pr, _ = project(user["uid"], pid)
        sources={d.id:d.to_dict() for d in pr.collection("datasets").limit(1000).stream()}
        return dict(runs=[mark_stale(pr,restore(d.to_dict()),sources) for d in pr.collection("scienceWorkflowRuns").order_by("createdAt", direction=firestore.Query.DESCENDING).limit(100).stream()])

    @app.get("/api/projects/{pid}/science/workflow-runs/{rid}")
    def status(pid: str, rid: str, user=Depends(owner)):
        pr, _, run = scoped(user["uid"], pid, rid)
        if run.get("activeRunId"):
            child = get_run(pid, run["activeRunId"], user)
            run["segment"] = child
            run["status"] = child["status"] if child["status"] not in ("accepted", "rejected") else run["status"]
        return mark_stale(pr,run)

    @app.post("/api/projects/{pid}/science/workflow-runs/{rid}/start", status_code=202)
    def segment(pid: str, rid: str, body: Segment, user=Depends(owner)):
        scoped(user["uid"], pid, rid)
        return start(pid, RunRequest(configurationId=rid, revision=body.revision, idempotencyKey=body.idempotencyKey, workflowRunId=rid), user)

    @app.post("/api/projects/{pid}/science/workflow-runs/{rid}/cancel")
    def stop(pid: str, rid: str, user=Depends(owner)):
        _, _, run = scoped(user["uid"], pid, rid)
        if not run.get("activeRunId"): fail(409, "workflow_idle", "No checkpoint is currently running.")
        return cancel(pid, run["activeRunId"], user)

    @app.post("/api/projects/{pid}/science/workflow-runs/{rid}/checkpoint-review")
    def decide(pid: str, rid: str, body: Review, user=Depends(owner)):
        _, _, run = scoped(user["uid"], pid, rid)
        if not run.get("activeRunId"): fail(409, "workflow_idle", "Run this checkpoint before reviewing its outputs.")
        if body.replaceDatasetId: fail(400, "workflow_replacement", "Checkpoint acceptance publishes independent datasets.")
        return review(pid, run["activeRunId"], body, user)
