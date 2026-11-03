"""Owner-scoped configurations, bounded run dispatch, immutable results and review."""
import hashlib
import json
import os
import re
import time
import uuid
from datetime import datetime, timezone

from fastapi import Depends
from fastapi.responses import Response
from google.cloud import firestore, storage
from pydantic import BaseModel, ConfigDict, Field, field_validator

from scientific_catalog import METHODS, VERSION, ARTIFACT_BUDGET, MAX_ROWS, MAX_CELLS, allowed, capabilities

MAX_PROJECT = 50 * 1024**3


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Binding(Strict):
    datasetId: str = Field(min_length=1, max_length=100)
    columnId: str = Field(min_length=1, max_length=100)
    unit: str = Field(min_length=1, max_length=80)
    confirmed: bool = False


class RowRange(Strict):
    start: int = Field(ge=0)
    end: int = Field(ge=0)


class IndexSelection(Strict):
    halfOpen: bool = False
    datasetId: str = Field(min_length=1, max_length=100)
    columnId: str = Field(min_length=1, max_length=100)
    unit: str = Field(min_length=1, max_length=80)
    reference: str = Field(default="Unconfirmed", max_length=80)
    top: float | None = Field(default=None, allow_inf_nan=False)
    base: float | None = Field(default=None, allow_inf_nan=False)
    rowRanges: list[RowRange] | None = Field(default=None, max_length=1000)

    @field_validator("rowRanges", mode="before")
    @classmethod
    def ranges_as_records(cls, value):
        # Firestore cannot persist arrays nested directly inside arrays.
        if isinstance(value, list):
            return [dict(start=r[0], end=r[1]) if isinstance(r, (list, tuple)) and len(r)==2 else r for r in value]
        return value


class Configuration(Strict):
    revision: int = Field(ge=0)
    method: str
    bindings: dict[str, Binding] = Field(default_factory=dict)
    parameters: dict = Field(default_factory=dict)
    alignmentConfirmed: bool = False
    notes: str = Field(default="", max_length=4000)
    scope: IndexSelection | None = None


class RunRequest(Strict):
    workflowRunId: str | None = None
    configurationId: str
    revision: int = Field(ge=1)
    idempotencyKey: str = Field(min_length=8, max_length=100)


class Review(Strict):
    revision: int = Field(ge=1)
    decision: str
    comment: str = Field(default="", max_length=4000)
    replaceDatasetId: str | None = None


def now(): return datetime.now(timezone.utc).isoformat()


def firestore_value(value, inside_array=False):
    """Keep explicit matrix parameters lossless within Firestore's array rules."""
    if isinstance(value, dict): return {k:firestore_value(v) for k,v in value.items()}
    if isinstance(value, (list, tuple)):
        items=[firestore_value(v, True) for v in value]
        return {"strataxNestedArrayV1":items} if inside_array else items
    return value


def restore_value(value):
    if isinstance(value, dict):
        if set(value)=={"strataxNestedArrayV1"}:return [restore_value(v) for v in value["strataxNestedArrayV1"]]
        return {k:restore_value(v) for k,v in value.items()}
    if isinstance(value, list):return [restore_value(v) for v in value]
    return value


def fingerprint(dataset):
    data = {k: dataset.get(k) for k in ("id", "manifest", "sourceSha256", "activeColumns", "parserVersion", "scientificRunId", "columns", "indexColumnId", "references", "mapping", "well")}
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()


def lineage_fingerprints(project, dataset, transaction, fail):
    pending=[dataset];seen=set();fingerprints={}
    while pending:
        current=pending.pop();rid=current.get("scientificRunId")
        if not rid or rid in seen:continue
        if len(seen)>=100:fail(413,"lineage_budget","This interpretation exceeds the supported provenance depth. Review a bounded study.")
        seen.add(rid)
        run=project.collection("scienceRuns").document(rid).get(transaction=transaction).to_dict()
        if not run or run.get("status")!="accepted":
            fail(409,"unaccepted_source","A calculated input has no accepted scientific run in this project.")
        for did,expected in run.get("inputFingerprints",{}).items():
            source=project.collection("datasets").document(did).get(transaction=transaction).to_dict()
            if not source or not source.get("active") or fingerprint(source)!=expected:
                fail(409,"stale_lineage","An upstream input changed. Recalculate affected checkpoints before continuing.")
            fingerprints[did]=expected;pending.append(source)
    return fingerprints


def public(record):
    return {k: v for k, v in record.items() if k not in ("dispatch", "operation", "execution", "reservation", "inputSnapshots", "resultPath")}


def validate_binding_unit(dimension, column, unit, fail):
    from scientific_core import unit_factor,ScienceProblem
    try:factor=unit_factor(dimension,unit)
    except ScienceProblem as error:fail(400,error.code,str(error))
    source=column.get("effectiveUnit") or column.get("unit") or ""
    if source.strip().lower() in ("", "unknown", "unconfirmed", "none"):return
    if dimension in ("numeric","array","category"):
        matches=source.strip().lower()==unit.strip().lower()
    else:
        try:matches=unit_factor(dimension,source)==factor
        except ScienceProblem:matches=False
    if not matches:
        fail(400,"source_unit_mismatch","The selected unit must describe the retained samples. Correct the source mapping or explicitly convert the data before using a different unit scale.")


def validate_parameters(method, supplied, fail):
    spec=METHODS[method]
    if set(supplied)-set(spec["parameters"]):fail(400,"invalid_parameters","Remove parameters not defined by this method.")
    parameters={k:item["default"] for k,item in spec["parameters"].items()}|supplied
    for key,definition in spec["parameters"].items():
        value=parameters[key]
        optional=(method=="nmr-partition" and key=="coefficient" or method=="pickett-fit" and key=="knownValue" and parameters.get("knownParameter")=="none" or method=="temperature-profile" and key in ("temperatureC","gradientCPerM") and parameters.get("anchors"))
        if definition["default"] is None and value is None and not optional:fail(400,"parameters_required",f"Provide {key} before calculating.")
        if value is not None and definition["type"]=="number" and (type(value) not in (int,float) or not __import__('math').isfinite(value)):fail(400,"invalid_parameters",f"Enter a finite number for {key}.")
        if definition["type"]=="text" and (not isinstance(value,str) or not value.strip()):fail(400,"parameters_required",f"Provide {key} before calculating.")
        if definition["type"]=="boolean" and type(value) is not bool:fail(400,"invalid_parameters",f"Confirm {key} as true or false.")
    if method in ("permeability-timur","permeability-coates"):
        bounds=parameters["applicationBounds"]
        if not isinstance(bounds,dict) or set(bounds)!={"phiLow","phiHigh","swiLow","swiHigh"} or any(type(v) not in (int,float) or not __import__('math').isfinite(v) or not 0<=v<=1 for v in bounds.values()) or bounds["phiHigh"]<=bounds["phiLow"] or bounds["swiHigh"]<=bounds["swiLow"]:
            fail(400,"calibration_bounds","Provide finite ordered core-calibrated porosity and Swi bounds in v/v before running permeability.")
    return parameters


def install_science(app, database, current_user, fail, acceptance_current):
    def owner(user=Depends(current_user)):
        if not acceptance_current(database().collection("stratax_legal_acceptance").document(user["uid"]).get().to_dict()):
            fail(403, "policies_required", "Accept the current StrataX policies before processing data.")
        return user

    def valid(value):
        if not isinstance(value, str) or not re.fullmatch(r"[\w-]{1,100}", value, re.ASCII):
            fail(400, "invalid_reference", "Choose a valid project, dataset or run.")
        return value

    def project(uid, pid):
        ref = database().collection("stratax_projects").document(uid).collection("records").document(valid(pid))
        record = ref.get().to_dict()
        if not record: fail(404, "project_missing", "This project could not be found.")
        if record["project"].get("status") in ("Archived", "Trash"):
            fail(409, "project_inactive", "Restore this project before processing its data.")
        return ref, record

    def scoped(uid, pid, rid):
        pr, record = project(uid, pid)
        rr = pr.collection("scienceRuns").document(valid(rid))
        run = restore_value(rr.get().to_dict())
        if not run: fail(404, "run_missing", "This calculation could not be found.")
        return pr, rr, run

    def validate(pr, record, body, transaction=None):
        spec = METHODS.get(body.method)
        if not spec or not allowed(spec, record["project"]["workflows"]):
            fail(400, "method_unavailable", "Enable the required project workflows before using this method.")
        if set(body.bindings) != {i["role"] for i in spec["inputs"]}:
            fail(400, "input_mapping", "Select every required input and remove unrelated mappings.")
        parameters = validate_parameters(body.method, body.parameters, fail)
        snapshots = {}
        for role, binding in body.bindings.items():
            ds = pr.collection("datasets").document(valid(binding.datasetId)).get(transaction=transaction).to_dict()
            if not ds or ds.get("active") is not True or not ds.get("manifest"):
                fail(400, "dataset_unavailable", f"Choose a retained, active dataset for {role}.")
            col = next((c for c in ds.get("columns", []) if c["id"] == binding.columnId), None)
            if not col or ds.get("activeColumns") and binding.columnId not in ds["activeColumns"]:
                fail(400, "column_unavailable", f"Choose an active column for {role}.")
            if not binding.confirmed or binding.unit.lower() in ("unknown", "unconfirmed", "none"):
                fail(400, "units_required", f"Explicitly confirm the unit and scientific meaning of {role}.")
            validate_binding_unit(next(item["dimension"] for item in spec["inputs"] if item["role"]==role),col,binding.unit,fail)
            if ds.get("rowCount", 0) > MAX_ROWS:
                fail(413, "input_budget", "Select a smaller, explicitly prepared dataset (maximum 250,000 rows). No samples were silently discarded.")
            snapshots[binding.datasetId] = {k:ds.get(k) for k in ("id","manifest","sourceSha256","parserVersion","scientificRunId","sourceId","rowCount","well","family","importId","columns","indexColumnId","references","mapping")}
            snapshots[binding.datasetId]["fingerprint"] = fingerprint(ds)
            snapshots[binding.datasetId]["lineageFingerprints"] = lineage_fingerprints(pr,ds,transaction,fail)
        if body.method=="depth-match" and (len(snapshots)!=1 or parameters["sourceRun"] not in snapshots):
            fail(400,"depth_match_run","Bind the anchors to this retained dataset's run identity and explicitly select curves from that same run.")
        if body.method in ("cutoff-rules","reservoir-summary","temperature-profile"):
            source=snapshots[body.bindings["depth"].datasetId]
            reference=(source.get("references") or {}).get("depthReference")
            if reference not in ("MD","TVD","TVDSS") or reference!=parameters["depthReference"]:
                fail(400,"depth_reference","Confirm a source depth reference matching the cutoff/summary parameters; no implicit MD/TVD conversion is made.")
        if len(snapshots) > 1 and not body.alignmentConfirmed:
            fail(400, "alignment_required", "Confirm common row alignment after an explicit join/resampling before combining datasets.")
        if body.scope:
            scope = body.scope
            if set(snapshots) != {scope.datasetId}:
                fail(400, "scope_alignment", "Selected-interval calculations need one aligned dataset. Disable canvas scope for an independently mapped calculation.")
            dataset = pr.collection("datasets").document(valid(scope.datasetId)).get(transaction=transaction).to_dict()
            if not dataset or not any(c["id"] == scope.columnId for c in dataset.get("columns", [])) or dataset.get("activeColumns") and scope.columnId not in dataset["activeColumns"]:
                fail(400, "scope_index", "Choose an active source index for the canvas interval.")
            if scope.unit.strip().lower() not in ("m", "metres", "meters", "ft", "feet", "km"):
                fail(400, "scope_unit", "Confirm a supported length unit for the selected index.")
            validate_binding_unit("length",next(c for c in dataset["columns"] if c["id"]==scope.columnId),scope.unit,fail)
            if (scope.top is None) != (scope.base is None) or scope.top is not None and scope.base <= scope.top:
                fail(400, "scope_interval", "Select an interval with a base deeper than its top, in metres.")
            if scope.rowRanges is not None and (not scope.rowRanges or any(r.end<r.start or r.end>=dataset["rowCount"] for r in scope.rowRanges) or any(scope.rowRanges[i].start<=scope.rowRanges[i-1].end for i in range(1,len(scope.rowRanges)))):
                fail(400, "scope_rows", "Choose nonoverlapping ordered source-row ranges inside this dataset.")
        return spec, snapshots, parameters

    @app.get("/api/projects/{pid}/science/capabilities")
    def methods(pid: str, user=Depends(owner)):
        _, record = project(user["uid"], pid)
        return capabilities(record["project"]["workflows"])

    @app.get("/api/projects/{pid}/science/datasets/{did}/rows")
    def dataset_rows(pid: str, did: str, start: int = 0, limit: int = 2000, user=Depends(owner)):
        import gzip
        pr,_=project(user["uid"],pid)
        ds=pr.collection("datasets").document(valid(did)).get().to_dict()
        if not ds or not ds.get("manifest"):fail(404,"dataset_missing","This dataset could not be found.")
        if not 0<=start<MAX_ROWS or not 1<=limit<=5000:fail(400,"preview_range","Choose a preview of 1–5000 rows within the first 250,000 records.")
        prefix=f"owners/{user['uid']}/projects/{pid}/"
        path=ds["manifest"]
        if not path.startswith(prefix) or ".." in path.split("/"):fail(400,"invalid_artifact","Invalid stored dataset reference.")
        bucket=storage.Client().bucket(os.environ["STRATAX_DERIVED_BUCKET"])
        blob=bucket.blob(path);blob.reload()
        if blob.size>2*1024**2:fail(413,"preview_budget","The stored manifest exceeds its budget.")
        manifest=json.loads(blob.download_as_bytes());rows=[];position=0;expanded=0
        for chunk in manifest.get("chunks",[]):
            count=chunk["rows"]
            if position+count<=start:position+=count;continue
            name=chunk["name"]
            if not re.fullmatch(r"[\w.-]{1,180}",name) or name in (".",".."):fail(400,"invalid_artifact","Invalid stored chunk reference.")
            cb=bucket.blob(path.rsplit("/",1)[0]+"/"+name);cb.reload()
            if cb.size>8*1024**2:fail(413,"preview_budget","This chunk exceeds the bounded preview limit.")
            with cb.open("rb") as source, gzip.open(source,"rt",encoding="utf-8") as stream:
                for line in stream:
                    expanded+=len(line)
                    if expanded>32*1024**2:fail(413,"preview_budget","Select fewer rows or a smaller array channel.")
                    if position>=start:rows.append(json.loads(line))
                    position+=1
                    if len(rows)>=limit:break
            if len(rows)>=limit:break
        return dict(columns=manifest["columns"],rows=rows,start=start,rowCount=manifest["rowCount"],metadata=manifest.get("metadata",{}),references=ds.get("references",{}),well=ds.get("well",""),preview=True)

    @app.post("/api/projects/{pid}/science/validate")
    def preflight(pid: str, body: Configuration, user=Depends(owner)):
        pr, record = project(user["uid"], pid)
        spec, snapshots, _ = validate(pr, record, body)
        return dict(valid=True, method=spec["id"], datasets=len(snapshots),
                    warnings=["Numerical applicability and row alignment are checked again by the worker before any result can be reviewed."],
                    artifactReservation=ARTIFACT_BUDGET, limits=spec["limits"])

    @app.get("/api/projects/{pid}/science")
    def list_science(pid: str, user=Depends(owner)):
        pr, record = project(user["uid"], pid)
        configs = [restore_value(d.to_dict()) for d in pr.collection("scienceConfigurations").limit(200).stream()]
        runs = [public(restore_value(d.to_dict())) for d in pr.collection("scienceRuns").order_by("createdAt", direction=firestore.Query.DESCENDING).limit(100).stream()]
        sources = {d.id: d.to_dict() for d in pr.collection("datasets").limit(1000).stream()}
        for run in runs:
            run["stale"] = any(sources.get(key, {}).get("active") is not True or fingerprint(sources.get(key, {})) != value for key, value in run.get("inputFingerprints", {}).items())
        return dict(configurations=configs, runs=runs)

    @app.get("/api/projects/{pid}/science/calibrations")
    def calibrations(pid: str, user=Depends(owner)):
        pr,_=project(user["uid"],pid)
        records=[restore_value(d.to_dict()) for d in pr.collection("scienceCalibrations").limit(200).stream()]
        return dict(records=records)

    @app.put("/api/projects/{pid}/science/configurations/{cid}")
    def save_configuration(pid: str, cid: str, body: Configuration, user=Depends(owner)):
        pr, _ = project(user["uid"], pid); cr = pr.collection("scienceConfigurations").document(valid(cid))
        if body.method not in METHODS: fail(400, "method_unavailable", "Choose an available method.")

        @firestore.transactional
        def write(tx):
            record = pr.get(transaction=tx).to_dict(); old = cr.get(transaction=tx).to_dict()
            if not allowed(METHODS[body.method], record["project"]["workflows"]): fail(400, "method_unavailable", "Enable this workflow first.")
            if (old or {}).get("revision", 0) != body.revision:
                fail(409, "configuration_conflict", "This configuration changed elsewhere. Reload it before saving; your draft is retained.")
            result = body.model_dump() | dict(id=cid, revision=body.revision+1, updatedAt=now(), methodVersion=VERSION)
            tx.set(cr, firestore_value(result)); return result
        return write(database().transaction())

    @app.post("/api/projects/{pid}/science/runs", status_code=202)
    def start(pid: str, body: RunRequest, user=Depends(owner)):
        pr, _ = project(user["uid"], pid)
        valid(body.idempotencyKey)
        rid = "run-"+hashlib.sha256(body.idempotencyKey.encode()).hexdigest()[:32]
        rr = pr.collection("scienceRuns").document(rid)
        cr = pr.collection("scienceConfigurations").document(valid(body.configurationId))
        global_ref = database().collection("stratax_science_runtime").document("capacity")
        dispatch = uuid.uuid4().hex

        @firestore.transactional
        def claim(tx):
            record = pr.get(transaction=tx).to_dict(); existing = restore_value(rr.get(transaction=tx).to_dict()); config = restore_value(cr.get(transaction=tx).to_dict()); capacity = global_ref.get(transaction=tx).to_dict() or {}
            if existing:
                if existing["configurationId"] != body.configurationId or existing["configurationRevision"] != body.revision:
                    fail(409, "idempotency_conflict", "Use a new submission identifier for this changed configuration.")
                return existing, False
            if not body.workflowRunId and (not config or config["revision"] != body.revision):
                fail(409, "configuration_conflict", "Save and reload the current configuration before running it.")
            parent_ref = None
            if body.workflowRunId:
                from scientific_workflows import prepare_segment
                parent_ref = pr.collection("scienceWorkflowRuns").document(valid(body.workflowRunId))
                config, snapshots, parameters, parent = prepare_segment(pr, parent_ref, body.revision, tx, record, validate, Configuration, fail, restore_value, fingerprint)
            else:
                cb = Configuration(**{k:v for k,v in config.items() if k in Configuration.model_fields})
                spec, snapshots, parameters = validate(pr, record, cb, tx)
            leases = {k:v for k,v in capacity.get("leases", {}).items() if v["until"] > time.time()}
            if len(leases) >= 2: fail(429, "science_busy", "Both calculation slots are in use. Retry when a run finishes.")
            if record.get("scienceLease", {}).get("until", 0) > time.time():
                fail(409, "project_busy", "Another calculation is already running in this project.")
            quota = record.setdefault("importQuota", {})
            used = sum(f.get("size", 0) for f in record.get("workspace", {}).get("files", []))
            if used+quota.get("derivedBytes",0)+quota.get("reservedBytes",0)+ARTIFACT_BUDGET > MAX_PROJECT:
                fail(413, "artifact_quota", "Leave 256 MiB of project capacity available for calculation artifacts.")
            lease = dict(id=rid, until=time.time()+2100)
            leases[dispatch] = lease; record["scienceLease"] = lease
            quota["reservedBytes"] = quota.get("reservedBytes",0)+ARTIFACT_BUDGET
            run = dict(id=rid, schemaVersion=1, revision=1, status="queued", createdAt=now(),
                       method=config["method"], methodVersion=VERSION, configurationId=body.configurationId,
                       configurationRevision=body.revision, configuration=config, parameters=parameters,
                       dispatch=dispatch, inputSnapshots=snapshots,
                       inputFingerprints={**{did:value for snapshot in snapshots.values() for did,value in snapshot.get("lineageFingerprints",{}).items()},**{k:v["fingerprint"] for k,v in snapshots.items()}},
                       reservation=ARTIFACT_BUDGET, scientificApproval=False)
            if len(json.dumps(firestore_value(run)).encode())>768*1024:
                fail(413,"workflow_metadata_budget","This study's frozen metadata exceeds its record budget. Use fewer explicitly selected steps or curves; samples belong in chunked artifacts.")
            if parent_ref:
                parent.update(activeRunId=rid, status="queued", revision=parent["revision"]+1)
                parent["inputFingerprints"]=run["inputFingerprints"]
                tx.set(parent_ref, firestore_value(parent))
            tx.set(pr, record); tx.set(global_ref, dict(leases=leases)); tx.set(rr, firestore_value(run))
            return run, True
        run, claimed = claim(database().transaction())
        if not claimed: return public(run)
        request_started=False
        try:
            import google.auth
            from google.auth.transport.requests import AuthorizedSession
            credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
            job = os.environ.get("STRATAX_SCIENCE_JOB", "stratax-science-worker")
            request_started=True
            response = AuthorizedSession(credentials).post(f"https://run.googleapis.com/v2/projects/{os.environ.get('GOOGLE_CLOUD_PROJECT','project-9afac')}/locations/us-central1/jobs/{job}:run", json={"overrides":{"containerOverrides":[{"env":[{"name":name,"value":value} for name,value in zip(("SCIENCE_UID","SCIENCE_PROJECT","SCIENCE_RUN","SCIENCE_DISPATCH"),(user["uid"],pid,rid,dispatch))]}]}}, timeout=30)
            response.raise_for_status()
            rr.update(dict(operation=response.json().get("name"), execution=response.json().get("metadata",{}).get("name")))
        except Exception as error:
            code=getattr(getattr(error,"response",None),"status_code",None)
            if not request_started or code in (400,401,403,404):
                settle_run(database(), pr, rr, global_ref, dispatch, "failed", 0, "The calculation worker could not start. Your sources and configuration are retained.")
                fail(503, "science_unavailable", "The calculation worker could not start. Retry from run history.")
            # A timeout does not establish that Cloud Run rejected the job. Keep
            # its reservation and idempotency record while the worker can write.
            rr.update(dict(dispatchUnconfirmed=True,message="Worker dispatch confirmation was interrupted. Refresh this run; its inputs, reservation and submission identifier are retained."))
        return public(rr.get().to_dict())

    @app.get("/api/projects/{pid}/science/runs/{rid}")
    def get_run(pid: str, rid: str, user=Depends(owner)):
        pr, rr, run = scoped(user["uid"], pid, rid)
        if run["status"] in ("queued", "running") and time.time()-__import__('datetime').datetime.fromisoformat(run["createdAt"]).timestamp()>2100:
            # Do not release quota while an unknown execution can still write; reconcile the operation first.
            try:
                import google.auth
                from google.auth.transport.requests import AuthorizedSession
                credentials,_=google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
                op=run.get("operation","")
                if re.fullmatch(r"projects/[\w-]+/locations/[\w-]+/operations/[\w-]+",op or ""):
                    response=AuthorizedSession(credentials).get("https://run.googleapis.com/v2/"+op,timeout=15)
                    if response.ok and response.json().get("done"):
                        settle_run(database(),pr,rr,database().collection("stratax_science_runtime").document("capacity"),run["dispatch"],"failed",run.get("bytesWritten",0),"The calculation execution ended without a complete result. Retry explicitly.")
                        run=rr.get().to_dict()
            except Exception: pass
        return public(run)

    @app.post("/api/projects/{pid}/science/runs/{rid}/cancel")
    def cancel(pid: str, rid: str, user=Depends(owner)):
        _, rr, run = scoped(user["uid"], pid, rid)
        @firestore.transactional
        def mark(tx):
            current=rr.get(transaction=tx).to_dict()
            if current["status"] in ("queued","running"):
                current.update(status="cancelling",revision=current["revision"]+1);tx.set(rr,firestore_value(current))
            return public(current)
        return mark(database().transaction())

    def result_blob(uid,pid,rid,run,name):
        valid(rid)
        if name not in ("manifest.json","result.json") and not re.fullmatch(r"dataset-[\w-]+(?:-\d{6}\.ndjson\.gz|\.json)",name):
            fail(400,"invalid_artifact","Choose a valid result artifact.")
        expected=f"owners/{uid}/projects/{pid}/science/{rid}/{run['dispatch']}/"
        return storage.Client().bucket(os.environ["STRATAX_DERIVED_BUCKET"]).blob(expected+name)

    @app.get("/api/projects/{pid}/science/runs/{rid}/result")
    def result(pid: str, rid: str, user=Depends(owner)):
        _,_,run=scoped(user["uid"],pid,rid)
        if run["status"] not in ("completed","accepted","rejected"): fail(409,"result_unavailable","Wait for a complete calculation result.")
        blob=result_blob(user["uid"],pid,rid,run,"manifest.json");blob.reload()
        if blob.size>2*1024**2:fail(413,"preview_budget","The result manifest exceeds the preview budget.")
        return json.loads(blob.download_as_bytes())

    @app.get("/api/projects/{pid}/science/runs/{rid}/artifacts/{name}")
    def artifact(pid: str, rid: str, name: str, user=Depends(owner)):
        _,_,run=scoped(user["uid"],pid,rid)
        if run["status"] not in ("completed","accepted","rejected"):fail(409,"result_unavailable","This result is not complete.")
        blob=result_blob(user["uid"],pid,rid,run,name);blob.reload()
        if blob.size>8*1024**2:fail(413,"preview_budget","Use the bounded chunk artifacts for this result.")
        return Response(blob.download_as_bytes(),media_type="application/gzip" if name.endswith(".gz") else "application/json")

    @app.post("/api/projects/{pid}/science/runs/{rid}/review")
    def review(pid: str, rid: str, body: Review, user=Depends(owner)):
        pr,rr,run=scoped(user["uid"],pid,rid)
        if run.get("status")!="completed":fail(409,"review_conflict","Reload a completed, unreviewed result before recording a decision.")
        if body.decision not in ("accept","reject"):fail(400,"review_decision","Choose Accept or Reject.")
        # Worker supplies only validated bounded manifests; clients cannot submit artifact paths.
        blob=result_blob(user["uid"],pid,rid,run,"manifest.json");blob.reload()
        if blob.size>2*1024**2:fail(413,"preview_budget","The result manifest exceeds its budget.")
        manifest=json.loads(blob.download_as_bytes())
        review_id=uuid.uuid4().hex
        @firestore.transactional
        def activate(tx):
            current=rr.get(transaction=tx).to_dict();record=pr.get(transaction=tx).to_dict()
            sources={key:pr.collection("datasets").document(key).get(transaction=tx).to_dict() for key in current.get("inputFingerprints",{})}
            old_ref=pr.collection("datasets").document(valid(body.replaceDatasetId)) if body.replaceDatasetId else None
            old=old_ref.get(transaction=tx).to_dict() if old_ref else None
            workflow_id=current.get("configuration",{}).get("workflowRunId")
            parent_ref=pr.collection("scienceWorkflowRuns").document(workflow_id) if workflow_id else None
            parent=restore_value(parent_ref.get(transaction=tx).to_dict()) if parent_ref else None
            if current["revision"]!=body.revision or current["status"]!="completed":fail(409,"review_conflict","Reload the completed result before reviewing it.")
            if body.decision=="accept" and any(not sources[key] or not sources[key].get("active") or fingerprint(sources[key])!=value for key,value in current.get("inputFingerprints",{}).items()):
                fail(409,"stale_inputs","An input version changed. Recalculate before activating this result.")
            datasets=manifest.get("datasets",[])
            if old_ref and (not old or len(datasets)!=1 or body.decision!="accept"):fail(400,"replacement_invalid","Replacement requires one result dataset and an existing version.")
            if parent_ref:
                if not parent or parent.get("activeRunId")!=rid:
                    fail(409,"workflow_conflict","This checkpoint is no longer the active review. Reload run history.")
                parent.setdefault("checkpoints",[]).append(dict(checkpoint=current["configuration"]["checkpoint"],runId=rid,decision=body.decision,comment=body.comment,reviewedAt=now()))
                parent.update(revision=parent["revision"]+1,status="rejected")
                if body.decision=="accept":
                    for dataset in datasets:
                        outputs=parent.setdefault("outputs",{}).setdefault(dataset["workflowStepId"],{})
                        for column in dataset["columns"]:
                            outputs[column["mnemonic"]]=dict(datasetId=dataset["id"],columnId=column["id"])
                    parent["checkpointIndex"]+=1
                    parent["status"]="completed" if parent["checkpointIndex"]==3 else "ready"
                    parent.pop("activeRunId",None)
                tx.set(parent_ref,firestore_value(parent))
            if body.decision=="accept":
                configuration=restore_value(current.get("configuration",{}))
                steps=configuration.get("steps",[dict(id=rid,method=current.get("method"),parameters=current.get("parameters",{}),bindings=configuration.get("bindings",{}),scope=configuration.get("scope"))])
                for step in steps:
                    if step["method"] in ("depth-match","align-curve","qc-splice","endpoint-proposal","temperature-profile","resistivity-temperature","pickett-fit","permeability-regression","permeability-timur","permeability-coates") or step.get("alignment"):
                        identifier="cal-"+hashlib.sha256((rid+step["id"]).encode()).hexdigest()[:32]
                        calibration=dict(id=identifier,runId=rid,workflowRunId=workflow_id,method=step["method"],kind="logging-run-depth-match" if step["method"]=="depth-match" else "alignment" if step.get("alignment") or step["method"]=="align-curve" else "calibration",parameters=step.get("parameters",{}),parameterOrigins=step.get("parameterOrigins",{}),alignment=step.get("alignment"),scope=step.get("scope"),bindings=step.get("bindings",{}),inputFingerprints=current.get("inputFingerprints",{}),wellId=step.get("wellId"),reviewedAt=now(),reviewedBy=user["uid"])
                        tx.set(pr.collection("scienceCalibrations").document(identifier),firestore_value(calibration))
                for dataset in datasets:
                    entry={k:v for k,v in dataset.items() if k not in ("preview","chunks")}
                    entry.update(active=True,scientificApproval=False,scientificRunId=rid,parserVersion=VERSION,status="ready",family="derived",sourceSha256=hashlib.sha256(json.dumps(current["inputFingerprints"],sort_keys=True).encode()).hexdigest())
                    if old_ref:entry["previousVersion"]=old["id"]
                    tx.set(pr.collection("datasets").document(entry["id"]),entry)
                if old_ref:tx.update(old_ref,dict(active=False,supersededBy=datasets[0]["id"]))
            current.update(status="accepted" if body.decision=="accept" else "rejected",revision=current["revision"]+1,reviewedAt=now())
            tx.set(rr,firestore_value(current));tx.set(pr.collection("scienceReviews").document(review_id),dict(id=review_id,runId=rid,decision=body.decision,comment=body.comment,createdAt=firestore.SERVER_TIMESTAMP,uid=user["uid"]))
            return public(current)
        return activate(database().transaction())

    from scientific_workflows import install_workflows
    install_workflows(app,database,owner,project,valid,fail,start,get_run,cancel,review,
                      RunRequest,Review,Strict,now,firestore_value,restore_value)


def settle_run(db, project, ref, capacity_ref, dispatch, status, actual_bytes, message=None, extra=None):
    @firestore.transactional
    def finish(tx):
        current=ref.get(transaction=tx).to_dict();record=project.get(transaction=tx).to_dict();capacity=capacity_ref.get(transaction=tx).to_dict() or {}
        if not current or current.get("dispatch")!=dispatch or not current.get("reservation"):return
        workflow_id=current.get("configuration",{}).get("workflowRunId")
        parent_ref=project.collection("scienceWorkflowRuns").document(workflow_id) if workflow_id else None
        parent=parent_ref.get(transaction=tx).to_dict() if parent_ref else None
        if current["status"]=="cancelling":status_value="cancelled"
        else:status_value=status
        quota=record.setdefault("importQuota",{});quota["reservedBytes"]=max(0,quota.get("reservedBytes",0)-current["reservation"]);quota["derivedBytes"]=quota.get("derivedBytes",0)+actual_bytes
        if record.get("scienceLease",{}).get("id")==current["id"]:record["scienceLease"]={}
        leases=capacity.get("leases",{});leases.pop(dispatch,None)
        current.update(status=status_value,reservation=0,bytesWritten=actual_bytes,finishedAt=now(),revision=current["revision"]+1)
        if message:current["message"]=message
        elif status_value=="completed":current.pop("message",None)
        if extra:current.update(extra)
        if parent and parent.get("activeRunId")==current["id"]:
            parent.update(status="awaiting-review" if status_value=="completed" else status_value,revision=parent["revision"]+1)
            tx.set(parent_ref,parent)
        tx.set(project,record);tx.set(ref,current);tx.set(capacity_ref,dict(leases=leases))
    finish(db.transaction())
