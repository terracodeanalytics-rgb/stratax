"""Authenticated import state, direct resumable transfers and native job dispatch."""
import base64
import json
import os
import re
import time
import uuid
from datetime import datetime, timezone

from fastapi import Depends
from google.cloud import firestore, storage
from pydantic import BaseModel, ConfigDict, Field

MAX_FILE = 10 * 1024**3
MAX_PROJECT = 50 * 1024**3
FAMILIES = {"logs", "deviation", "well_headers", "tops", "checkshots", "core", "pressure", "fluids", "geochemistry", "production", "arrays", "seismic", "surfaces", "spatial", "models", "documents"}


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Asset(Strict):
    name: str = Field(min_length=1, max_length=240)
    size: int = Field(gt=0, le=MAX_FILE)
    existing_id: str | None = None


class Begin(Strict):
    family: str
    files: list[Asset] = Field(min_length=1, max_length=100)
    options: dict = Field(default_factory=dict)


class Configure(Strict):
    revision: int = Field(ge=1)
    options: dict


class Commit(Strict):
    revision: int = Field(ge=1)
    acknowledge_warnings: bool = False
    replace_dataset_id: str | None = None
    template_name: str | None = Field(default=None, max_length=100)
    selected_dataset_ids: list[str] | None = None
    selected_columns: dict[str, list[str]] = Field(default_factory=dict)


def install_imports(app, database, current_user, fail, acceptance_current):
    def owner(user=Depends(current_user)):
        if not acceptance_current(database().collection("stratax_legal_acceptance").document(user["uid"]).get().to_dict()):
            fail(403, "policies_required", "Accept the current policies before importing project data.")
        return user

    def valid(value):
        if not re.fullmatch(r"[\w-]{1,100}", value, re.ASCII):
            fail(400, "invalid_reference", "Choose a valid project or import.")
        return value

    def project(uid, pid):
        ref = database().collection("stratax_projects").document(uid).collection("records").document(valid(pid))
        data = ref.get().to_dict()
        if not data:
            fail(404, "project_missing", "This project could not be found.")
        return ref, data

    def session(uid, pid, iid):
        ref, record = project(uid, pid)
        ir = ref.collection("imports").document(valid(iid))
        data = ir.get().to_dict()
        if not data:
            fail(404, "import_missing", "This import could not be found.")
        return ref, ir, data

    def raw_bucket():
        return storage.Client().bucket(os.environ["STRATAX_PROJECT_BUCKET"])

    def public(data):
        return {k: v for k, v in data.items() if k not in ("uploadSessions", "dispatchToken")}

    @app.get("/api/projects/{pid}/imports")
    def list_imports(pid: str, user=Depends(owner)):
        ref, record = project(user["uid"], pid)
        imports = [public(d.to_dict()) for d in ref.collection("imports").order_by("createdAt", direction=firestore.Query.DESCENDING).limit(100).stream()]
        datasets = [d.to_dict() for d in ref.collection("datasets").limit(1000).stream()]
        templates = [d.to_dict() for d in ref.collection("import_templates").limit(100).stream()]
        quota = record.get("importQuota", {})
        used = sum(f.get("size", 0) for f in record.get("workspace", {}).get("files", [])) + quota.get("derivedBytes", 0)
        return {"imports": imports, "datasets": datasets, "templates": templates, "quota": {"used": used, "reserved": quota.get("reservedBytes", 0), "projectLimit": MAX_PROJECT, "fileLimit": MAX_FILE}}

    @app.post("/api/projects/{pid}/imports", status_code=201)
    def begin(pid: str, body: Begin, user=Depends(owner)):
        if body.family not in FAMILIES:
            fail(400, "data_type", "Choose a supported data type.")
        for asset in body.files:
            if any(c in asset.name for c in ("/", "\\", "\x00")) or asset.name in (".", ".."):
                fail(400, "file_name", "Select files with names that do not contain paths.")
        ref, record = project(user["uid"], pid)
        selected = record.get('project', {}).get('workflows', [])
        if body.family == 'seismic' and 'seismic' not in selected or body.family in {'logs','deviation','well_headers','tops','checkshots','core','pressure','fluids','geochemistry','production','arrays'} and 'petrophysics' not in selected:
            fail(400,'workflow_required','Enable the relevant project workflow before importing this data type.')
        iid = uuid.uuid4().hex
        assets = []
        names = set()
        for asset in body.files:
            if asset.name.casefold() in names:
                fail(400, "companion_names", "Files in a bundle must have distinct names. Import conflicting names separately.")
            names.add(asset.name.casefold())
            existing = next((f for f in record.get("workspace", {}).get("files", []) if f["id"] == asset.existing_id), None) if asset.existing_id else None
            if asset.existing_id and (not existing or existing["size"] != asset.size):
                fail(400, "source_missing", "The selected stored original could not be matched.")
            assets.append({"id": asset.existing_id or uuid.uuid4().hex, "name": asset.name, "size": asset.size, "existing": bool(existing), "state": "stored" if existing else "awaiting upload"})
        reserved = sum(a["size"] for a in assets if not a["existing"])
        ir = ref.collection("imports").document(iid)

        @firestore.transactional
        def reserve(transaction):
            current = ref.get(transaction=transaction).to_dict()
            quota = current.get("importQuota", {})
            used = sum(f.get("size", 0) for f in current.get("workspace", {}).get("files", []))
            if used + quota.get("reservedBytes", 0) + quota.get("derivedBytes", 0) + reserved > MAX_PROJECT:
                fail(413, "project_quota", "This upload exceeds the project's 50 GiB storage allowance.")
            quota["reservedBytes"] = quota.get("reservedBytes", 0) + reserved
            current["importQuota"] = quota
            result = {"schemaVersion": 1, "id": iid, "family": body.family, "assets": assets, "options": body.options, "revision": 1, "status": "uploading" if reserved else "stored", "reservedBytes": reserved, "createdAt": datetime.now(timezone.utc).isoformat(), "datasets": [], "issues": []}
            transaction.set(ref, current)
            transaction.set(ir, result)
            return result

        return public(reserve(database().transaction()))

    @app.get("/api/projects/{pid}/imports/{iid}")
    def get_import(pid: str, iid: str, user=Depends(owner)):
        ref, ir, data = session(user["uid"], pid, iid)
        if data['status'] == 'inspecting' and (data.get('execution') or data.get('operation')) and time.time()-data.get('operationCheckedAt',0)>10:
            try:
                import google.auth
                from google.auth.transport.requests import AuthorizedSession
                credentials, _ = google.auth.default(scopes=['https://www.googleapis.com/auth/cloud-platform'])
                response = AuthorizedSession(credentials).get('https://run.googleapis.com/v2/'+(data.get('execution') or data['operation']),timeout=10)
                operation = response.json() if response.ok else {}
                execution = operation if data.get('execution') else operation.get('response', {})
                failed = operation.get('error') or execution.get('failedCount',0) or any(c.get('type')=='Completed' and c.get('state')=='CONDITION_FAILED' for c in execution.get('conditions',[]))
                @firestore.transactional
                def checked(transaction):
                    current=ir.get(transaction=transaction).to_dict()
                    record=ref.get(transaction=transaction).to_dict()
                    if current.get('status')!='inspecting' or current.get('dispatchToken')!=data.get('dispatchToken'):
                        return
                    current['operationCheckedAt']=time.time()
                    if failed:
                        current.update(status='failed',revision=current['revision']+1,issues=[{'code':'worker_startup_failed','severity':'blocking','message':'The Cloud parser could not finish this execution. Your originals are retained; retry inspection.'}])
                        if record.get('parserLease',{}).get('id')==iid:
                            record['parserLease']={}
                            transaction.set(ref,record)
                    transaction.set(ir,current)
                checked(database().transaction())
                data=ir.get().to_dict()
            except Exception:
                # A transient control-plane outage must not cancel a running parser.
                pass
        if data['status'] == 'inspecting' and ref.get().to_dict().get('parserLease', {}).get('until', 0) < time.time():
            ir.update({'status':'failed','issues':[{'code':'inspection_timeout','severity':'blocking','message':'Inspection timed out. Originals are retained; retry the import.'}]})
            data = ir.get().to_dict()
        return public(data)

    @app.post("/api/projects/{pid}/imports/{iid}/upload/{aid}")
    def upload_session(pid: str, iid: str, aid: str, user=Depends(owner)):
        _, ir, data = session(user["uid"], pid, iid)
        asset = next((a for a in data["assets"] if a["id"] == valid(aid)), None)
        if not asset or data["status"] not in ("uploading", "stored"):
            fail(409, "import_state", "This import is not waiting for file transfers.")
        if asset["state"] == "stored":
            return {"stored": True}
        sessions = data.get("uploadSessions", {})
        if aid not in sessions:
            obj = raw_bucket().blob(f"owners/{user['uid']}/projects/{pid}/originals/{aid}")
            sessions[aid] = obj.create_resumable_upload_session(content_type="application/octet-stream", size=asset["size"], origin=os.environ["STRATAX_SITE_ORIGIN"], if_generation_match=0)
            ir.update({"uploadSessions": sessions})
        return {"upload_url": sessions[aid], "size": asset["size"]}

    @app.post("/api/projects/{pid}/imports/{iid}/complete/{aid}")
    def complete_upload(pid: str, iid: str, aid: str, user=Depends(owner)):
        ref, ir, data = session(user["uid"], pid, iid)
        asset = next((a for a in data["assets"] if a["id"] == valid(aid)), None)
        if not asset:
            fail(404, "source_missing", "This source does not belong to the import.")
        obj = raw_bucket().get_blob(f"owners/{user['uid']}/projects/{pid}/originals/{aid}")
        if not obj or obj.size != asset["size"] or not obj.crc32c:
            fail(409, "upload_incomplete", "The stored file size/checksum is not confirmed. Resume the upload before continuing.")

        @firestore.transactional
        def attach(transaction):
            current = ref.get(transaction=transaction).to_dict()
            result = ir.get(transaction=transaction).to_dict()
            if result["status"] == "cancelled":
                fail(409, "import_cancelled", "This import was cancelled.")
            files = current.setdefault("workspace", {}).setdefault("files", [])
            a = next(a for a in result["assets"] if a["id"] == aid)
            if not any(f["id"] == aid for f in files):
                files.append({"id": aid, "name": a["name"], "size": a["size"], "type": result["family"], "well": "", "status": "Stored original · classification pending", "local": False, "crc32c": obj.crc32c, "generation": obj.generation, "importId": iid})
                current["revision"] += 1
            if a["state"] != "stored" and not a["existing"]:
                result["reservedBytes"] -= a["size"]
                quota = current.setdefault("importQuota", {})
                quota["reservedBytes"] = max(0, quota.get("reservedBytes", 0) - a["size"])
            a.update(state="stored", crc32c=obj.crc32c, generation=obj.generation)
            result["status"] = "stored" if all(a["state"] == "stored" for a in result["assets"]) else "uploading"
            result["revision"] += 1
            transaction.set(ref, current)
            transaction.set(ir, result)
            return public(result)

        return attach(database().transaction())

    @app.put("/api/projects/{pid}/imports/{iid}/configuration")
    def configure(pid: str, iid: str, body: Configure, user=Depends(owner)):
        _, ir, _ = session(user["uid"], pid, iid)

        @firestore.transactional
        def write(transaction):
            current = ir.get(transaction=transaction).to_dict()
            if current.get('committedAt') or current["revision"] != body.revision or current["status"] in ("inspecting", "importing", "ready", "cancelled"):
                fail(409, "import_conflict", "Reload the current import before editing its configuration.")
            current.update(options=body.options, status="stored", revision=current["revision"]+1)
            transaction.set(ir, current)
            return public(current)

        return write(database().transaction())

    @app.post("/api/projects/{pid}/imports/{iid}/inspect", status_code=202)
    def inspect(pid: str, iid: str, user=Depends(owner)):
        import google.auth
        from google.auth.transport.requests import AuthorizedSession
        ref, ir, data = session(user["uid"], pid, iid)
        dispatch = uuid.uuid4().hex
        old_artifacts = 0
        if data.get('artifactReservation') and data.get('status') != 'inspecting' and data.get('dispatchToken'):
            prefix = f"owners/{user['uid']}/projects/{pid}/imports/{iid}/{data['dispatchToken']}/"
            old_artifacts = sum(b.size for b in storage.Client().list_blobs(os.environ['STRATAX_DERIVED_BUCKET'],prefix=prefix))

        @firestore.transactional
        def claim(transaction):
            current = ir.get(transaction=transaction).to_dict()
            project_data = ref.get(transaction=transaction).to_dict()
            if current["status"] in ("inspecting", "importing"):
                return False
            if current.get('committedAt') or current["status"] not in ("stored", "failed", "awaiting confirmation", "retained/unresolved") or not all(a["state"] == "stored" for a in current["assets"]):
                fail(409, "import_state", "Finish the file transfers before inspecting this import.")
            lease = project_data.get("parserLease", {})
            if lease.get("until", 0) > time.time() and lease.get("id") != iid:
                fail(409, "parser_busy", "Another import is being inspected in this project. Retry when it finishes.")
            quota = project_data.setdefault('importQuota', {})
            if current.get('artifactReservation'):
                quota['reservedBytes'] = max(0,quota.get('reservedBytes',0)-current['artifactReservation'])
                quota['derivedBytes'] = quota.get('derivedBytes',0)+old_artifacts
            used = sum(f.get('size',0) for f in project_data.get('workspace',{}).get('files',[]))
            available = MAX_PROJECT-used-quota.get('reservedBytes',0)-quota.get('derivedBytes',0)
            reservation = min(1100*1024**2, available)
            if reservation < 8*1024**2:
                fail(413,'artifact_quota','Leave at least 8 MiB of project quota available for inspected artifacts.')
            quota['reservedBytes'] = quota.get('reservedBytes',0)+reservation
            project_data["parserLease"] = {"id": iid, "until": time.time()+2100}
            transaction.set(ref, project_data)
            transaction.update(ir, {"status": "inspecting", "dispatchToken": dispatch, "artifactReservation": reservation, "revision": current["revision"]+1, "startedAt": datetime.now(timezone.utc).isoformat()})
            return True

        if not claim(database().transaction()):
            return public(ir.get().to_dict())
        try:
            creds, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
            job = os.environ.get("STRATAX_IMPORT_JOB", "stratax-import-worker")
            response = AuthorizedSession(creds).post(f"https://run.googleapis.com/v2/projects/{os.environ.get('GOOGLE_CLOUD_PROJECT','project-9afac')}/locations/us-central1/jobs/{job}:run", json={"overrides": {"containerOverrides": [{"env": [{"name": "IMPORT_UID", "value": user["uid"]}, {"name": "IMPORT_PROJECT", "value": pid}, {"name": "IMPORT_ID", "value": iid}, {"name": "IMPORT_DISPATCH", "value": dispatch}]}]}}, timeout=30)
            if not response.ok:
                raise RuntimeError("dispatch")
            operation = response.json().get('name')
            if operation and re.fullmatch(r'projects/[\w-]+/locations/[\w-]+/operations/[\w-]+',operation):
                ir.update({'operation':operation,'operationCheckedAt':time.time()})
            execution = response.json().get('metadata',{}).get('name')
            if execution and re.fullmatch(r'projects/[\w-]+/locations/[\w-]+/jobs/[\w-]+/executions/[\w-]+',execution):
                ir.update({'execution':execution,'operationCheckedAt':time.time()})
        except Exception:
            @firestore.transactional
            def unclaim(transaction):
                current=ir.get(transaction=transaction).to_dict()
                record=ref.get(transaction=transaction).to_dict()
                if current.get('dispatchToken') != dispatch:
                    return
                quota=record.setdefault('importQuota',{})
                quota['reservedBytes']=max(0,quota.get('reservedBytes',0)-current.get('artifactReservation',0))
                current.update(status='failed',artifactReservation=0,issues=[{'severity':'blocking','code':'worker_unavailable','message':'The parser worker could not start. Originals are retained; retry inspection.'}])
                record['parserLease']={}
                transaction.set(ref,record)
                transaction.set(ir,current)
            unclaim(database().transaction())
            fail(503, "worker_unavailable", "The parser worker could not start. Your originals are retained.")
        return public(ir.get().to_dict())

    @app.get("/api/projects/{pid}/imports/{iid}/preview/{did}")
    def preview(pid: str, iid: str, did: str, user=Depends(owner)):
        _, _, data = session(user["uid"], pid, iid)
        entry = next((d for d in data.get("datasets", []) if d["id"] == valid(did)), None)
        if not entry:
            fail(404, "dataset_missing", "This dataset could not be found.")
        obj = storage.Client().bucket(os.environ["STRATAX_DERIVED_BUCKET"]).blob(entry["manifest"])
        obj.reload()
        if obj.size > 2 * 1024 * 1024:
            fail(413, "preview_size", "This dataset preview exceeds the inline limit.")
        return json.loads(obj.download_as_bytes())

    @app.post("/api/projects/{pid}/imports/{iid}/commit")
    def commit(pid: str, iid: str, body: Commit, user=Depends(owner)):
        ref, ir, data = session(user["uid"], pid, iid)

        @firestore.transactional
        def activate(transaction):
            current = ir.get(transaction=transaction).to_dict()
            project_data = ref.get(transaction=transaction).to_dict()
            if current["revision"] != body.revision or current["status"] not in ("awaiting confirmation", "retained/unresolved"):
                fail(409, "import_conflict", "Reload and review this import before committing it.")
            selected = [d for d in current.get('datasets',[]) if body.selected_dataset_ids is None or d['id'] in body.selected_dataset_ids]
            if not selected or body.selected_dataset_ids is not None and set(body.selected_dataset_ids)-{d['id'] for d in selected}:
                fail(400,'dataset_selection','Select at least one inspected dataset from this import.')
            sources = {d.get('sourceId') for d in selected}
            source_names = {a['name'] for a in current['assets'] if a['id'] in sources}
            applicable_issues = [i for i in current.get('issues',[]) if not i.get('sourceId') and not i.get('source') or i.get('sourceId') in sources or i.get('source') in source_names]
            if any(i["severity"] == "blocking" for i in applicable_issues):
                fail(400, "validation_blocked", "Resolve the blocking import issues before activating datasets. Originals remain retained.")
            if current.get("issues") and not body.acknowledge_warnings:
                fail(400, "warnings_required", "Review and acknowledge the remaining import warnings.")
            old_ref = ref.collection("datasets").document(valid(body.replace_dataset_id)) if body.replace_dataset_id else None
            old = old_ref.get(transaction=transaction).to_dict() if old_ref else None
            if old_ref and not old:
                fail(404, "dataset_missing", "The dataset selected for replacement is not in this project.")
            if old_ref and len(selected) != 1:
                fail(400, "replacement_selection", "Replace one dataset at a time; import the remaining datasets as independent versions.")
            status = "retained/unresolved" if current.get("issues") else "ready"
            for dataset in selected:
                columns = body.selected_columns.get(dataset['id'])
                if columns is not None:
                    available = {c['id'] for c in dataset.get('columns',[])}
                    if dataset.get('columnCount', 0) > len(available):
                        available.update('column-' + str(i) for i in range(dataset['columnCount']))
                    if not columns or set(columns)-available:
                        fail(400,'column_selection','Choose inspected columns from this dataset.')
                    dataset['activeColumns']=columns
                dataset.update(active=True, status='retained/unresolved' if dataset.get('issues') else 'ready', importId=iid, scientificApproval=False)
                if old:
                    dataset["previousVersion"] = old["id"]
                transaction.set(ref.collection("datasets").document(dataset["id"]), dataset)
            if old_ref:
                transaction.update(old_ref, {"active": False, "supersededBy": selected[0]["id"]})
            current.update(status=status, revision=current["revision"]+1, committedAt=datetime.now(timezone.utc).isoformat())
            workspace = project_data.setdefault("workspace", {})
            workspace.setdefault("audit", []).insert(0, {"action": "Imported " + current["family"] + " evidence", "time": current["committedAt"]})
            workspace["audit"] = workspace["audit"][:200]
            # Confirmed well matching is explicit; header coordinates are not activated here.
            wells = workspace.setdefault("wellDrafts", [])
            for filename, selection in current.get("options", {}).get("perFile", {}).items():
                if filename not in source_names:
                    continue
                selected_well = str(selection.get("well", "")).strip()[:100]
                if selected_well and selection.get("createWell") and not any(w["id"] == selected_well for w in wells):
                    wells.append({"id": selected_well, "source": iid, "status": "Imported registration", "curves": sum(len(d.get("columns", [])) for d in current["datasets"] if d.get("well") == selected_well), "depth": "Source reference"})
            for source in workspace.get('files',[]):
                if any(a['id']==source['id'] for a in current['assets']):
                    source['status']='Imported · references unresolved' if status!='ready' else 'Imported'
                    source['type']=current['family']
                    source['well']=current.get('options',{}).get('perFile',{}).get(source['name'],{}).get('well','')
            project_data["revision"] += 1
            transaction.set(ref, project_data)
            transaction.set(ir, current)
            if body.template_name:
                template = {"id": uuid.uuid4().hex, "name": body.template_name, "family": current["family"], "options": current["options"], "schemaVersion": 1}
                transaction.set(ref.collection("import_templates").document(template["id"]), template)
            return public(current)

        return activate(database().transaction())

    @app.post("/api/projects/{pid}/imports/{iid}/cancel")
    def cancel(pid: str, iid: str, user=Depends(owner)):
        ref, ir, data = session(user["uid"], pid, iid)
        if data["status"] in ("ready", "retained/unresolved") and data.get("committedAt"):
            fail(409, "already_committed", "This import is already committed. Its original/version history is retained.")
        import requests
        for asset in data["assets"]:
            if asset["state"] == "stored":
                continue
            upload_url = data.get("uploadSessions", {}).get(asset["id"])
            if upload_url:
                # Sessions are generated by GCS, never accepted from request JSON.
                requests.delete(upload_url, timeout=15)
            blob = raw_bucket().get_blob(f"owners/{user['uid']}/projects/{pid}/originals/{asset['id']}")
            if blob and blob.size == asset["size"]:
                complete_upload(pid, iid, asset["id"], user)
        @firestore.transactional
        def release(transaction):
            current = ir.get(transaction=transaction).to_dict()
            record = ref.get(transaction=transaction).to_dict()
            if current["status"] == "cancelled":
                return public(current)
            quota = record.setdefault("importQuota", {})
            quota["reservedBytes"] = max(0, quota.get("reservedBytes", 0) - current.get("reservedBytes", 0))
            current.update(status="cancelled", reservedBytes=0, revision=current["revision"]+1)
            transaction.set(ref, record)
            transaction.set(ir, current)
            return public(current)
        return release(database().transaction())
