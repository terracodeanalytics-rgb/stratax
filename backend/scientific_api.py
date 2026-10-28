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
    data = {k: dataset.get(k) for k in ("id", "manifest", "sourceSha256", "activeColumns", "parserVersion", "scientificRunId")}
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()


def public(record):
    return {k: v for k, v in record.items() if k not in ("dispatch", "operation", "execution", "reservation", "inputSnapshots", "resultPath")}


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
        if set(body.parameters)-set(spec["parameters"]): fail(400, "invalid_parameters", "Remove parameters not defined by this method.")
        parameters = {k: item["default"] for k, item in spec["parameters"].items()} | body.parameters
        for key, definition in spec["parameters"].items():
            value = parameters[key]
            if definition["default"] is None and value is None and not (body.method == "nmr-partition" and key == "coefficient"):
                fail(400, "parameters_required", f"Provide {key} before calculating.")
            if value is not None and definition["type"] == "number" and (type(value) not in (int, float) or not __import__('math').isfinite(value)):
                fail(400, "invalid_parameters", f"Enter a finite number for {key}.")
            if definition["type"] == "text" and (not isinstance(value, str) or not value.strip()):
                fail(400, "parameters_required", f"Provide {key} before calculating.")
            if definition["type"] == "boolean" and type(value) is not bool:
                fail(400, "invalid_parameters", f"Confirm {key} before calculating.")
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
            if ds.get("rowCount", 0) > MAX_ROWS:
                fail(413, "input_budget", "Select a smaller, explicitly prepared dataset (maximum 250,000 rows). No samples were silently discarded.")
            snapshots[binding.datasetId] = {k:ds.get(k) for k in ("id","manifest","sourceSha256","parserVersion","scientificRunId","sourceId","rowCount","well","family","importId")}
            snapshots[binding.datasetId]["fingerprint"] = fingerprint(ds)
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
            if not config or config["revision"] != body.revision:
                fail(409, "configuration_conflict", "Save and reload the current configuration before running it.")
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
                       inputFingerprints={k:v["fingerprint"] for k,v in snapshots.items()},
                       reservation=ARTIFACT_BUDGET, scientificApproval=False)
            tx.set(pr, record); tx.set(global_ref, dict(leases=leases)); tx.set(rr, firestore_value(run))
            return run, True
        run, claimed = claim(database().transaction())
        if not claimed: return public(run)
        try:
            import google.auth
            from google.auth.transport.requests import AuthorizedSession
            credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
            job = os.environ.get("STRATAX_SCIENCE_JOB", "stratax-science-worker")
            response = AuthorizedSession(credentials).post(f"https://run.googleapis.com/v2/projects/{os.environ.get('GOOGLE_CLOUD_PROJECT','project-9afac')}/locations/us-central1/jobs/{job}:run", json={"overrides":{"containerOverrides":[{"env":[{"name":name,"value":value} for name,value in zip(("SCIENCE_UID","SCIENCE_PROJECT","SCIENCE_RUN","SCIENCE_DISPATCH"),(user["uid"],pid,rid,dispatch))]}]}}, timeout=30)
            response.raise_for_status()
            rr.update(dict(operation=response.json().get("name"), execution=response.json().get("metadata",{}).get("name")))
        except Exception:
            settle_run(database(), pr, rr, global_ref, dispatch, "failed", 0, "The calculation worker could not start. Your sources and configuration are retained.")
            fail(503, "science_unavailable", "The calculation worker could not start. Retry from run history.")
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
            if current["revision"]!=body.revision or current["status"]!="completed":fail(409,"review_conflict","Reload the completed result before reviewing it.")
            if body.decision=="accept" and any(not sources[key] or not sources[key].get("active") or fingerprint(sources[key])!=value for key,value in current.get("inputFingerprints",{}).items()):
                fail(409,"stale_inputs","An input version changed. Recalculate before activating this result.")
            datasets=manifest.get("datasets",[])
            if old_ref and (not old or len(datasets)!=1 or body.decision!="accept"):fail(400,"replacement_invalid","Replacement requires one result dataset and an existing version.")
            if body.decision=="accept":
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


def settle_run(db, project, ref, capacity_ref, dispatch, status, actual_bytes, message=None, extra=None):
    @firestore.transactional
    def finish(tx):
        current=ref.get(transaction=tx).to_dict();record=project.get(transaction=tx).to_dict();capacity=capacity_ref.get(transaction=tx).to_dict() or {}
        if not current or current.get("dispatch")!=dispatch or not current.get("reservation"):return
        if current["status"]=="cancelling":status_value="cancelled"
        else:status_value=status
        quota=record.setdefault("importQuota",{});quota["reservedBytes"]=max(0,quota.get("reservedBytes",0)-current["reservation"]);quota["derivedBytes"]=quota.get("derivedBytes",0)+actual_bytes
        if record.get("scienceLease",{}).get("id")==current["id"]:record["scienceLease"]={}
        leases=capacity.get("leases",{});leases.pop(dispatch,None)
        current.update(status=status_value,reservation=0,bytesWritten=actual_bytes,finishedAt=now(),revision=current["revision"]+1)
        if message:current["message"]=message
        if extra:current.update(extra)
        tx.set(project,record);tx.set(ref,current);tx.set(capacity_ref,dict(leases=leases))
    finish(db.transaction())
