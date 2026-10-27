"""Owner-scoped project records and private original-file storage."""
import json
import os
import re
import tempfile
import uuid
from datetime import datetime, timezone

from fastapi import Depends, Request
from fastapi.responses import StreamingResponse
from google.cloud import firestore, storage
from pydantic import BaseModel, ConfigDict, Field
from starlette.concurrency import run_in_threadpool

MAX_FILE = 64 * 1024 * 1024


class ProjectWrite(BaseModel):
    model_config = ConfigDict(extra="forbid")
    revision: int = Field(ge=0)
    project: dict
    workspace: dict = Field(default_factory=dict)


def install_projects(app, database, current_user, fail, acceptance_current):
    def owner(user=Depends(current_user)):
        if not acceptance_current(database().collection("stratax_legal_acceptance").document(user["uid"]).get().to_dict()):
            fail(403, "policies_required", "Accept the current policies before opening projects.")
        return user

    def collection(uid):
        return database().collection("stratax_projects").document(uid).collection("records")

    def reference(uid, project_id):
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,100}", project_id):
            fail(400, "invalid_project", "Choose a valid project.")
        return collection(uid).document(project_id)

    def existing(uid, project_id):
        ref = reference(uid, project_id)
        data = ref.get().to_dict()
        if not data:
            fail(404, "project_missing", "This project could not be found.")
        return ref, data

    def bucket():
        name = os.environ.get("STRATAX_PROJECT_BUCKET")
        if not name:
            fail(503, "storage_unavailable", "Project file storage is temporarily unavailable.")
        return storage.Client().bucket(name)

    @app.get("/api/projects")
    def list_projects(user=Depends(owner), cursor: str | None = None):
        query = collection(user["uid"]).order_by("__name__").limit(50)
        if cursor:
            query = query.start_after({"__name__": reference(user["uid"], cursor)})
        docs = list(query.stream())
        return {"projects": [{**d.to_dict()["project"], "revision": d.to_dict()["revision"], "sourceCount": len(d.to_dict().get("workspace", {}).get("files", [])), "wellCount": len(d.to_dict().get("workspace", {}).get("wellDrafts", []))} for d in docs], "next_cursor": docs[-1].id if len(docs) == 50 else None}

    @app.get("/api/projects/{project_id}")
    def get_project(project_id: str, user=Depends(owner)):
        return existing(user["uid"], project_id)[1]

    @app.put("/api/projects/{project_id}")
    def put_project(project_id: str, body: ProjectWrite, user=Depends(owner)):
        project = body.project
        name = project.get("name", "")
        workflows = project.get("workflows", [])
        if not isinstance(name, str) or not name.strip() or len(name) > 100 or not isinstance(workflows, list) or not workflows or any(w not in ("petrophysics", "seismic") for w in workflows):
            fail(400, "invalid_project", "Enter a project name and choose a workflow.")
        if project.get("storage") != "cloud" or project.get("status") not in ("Active", "Archived", "Trash"):
            fail(400, "invalid_project", "Check the project storage and status.")
        position = project.get("coordinates")
        if position is not None:
            try:
                lat, lng = position["lat"], position["lng"]
                valid = type(lat) in (int, float) and type(lng) in (int, float) and -90 <= lat <= 90 and -180 <= lng <= 180
            except (KeyError, TypeError):
                valid = False
            if not valid:
                fail(400, "invalid_coordinates", "Enter valid WGS84 latitude and longitude.")
        # Client paths, identity and storage object names never determine access.
        clean = {k: v for k, v in project.items() if k not in ("uid", "owner", "revision", "directory", "handle")}
        clean.update(id=project_id, name=name.strip(), schemaVersion=1)
        ref = reference(user["uid"], project_id)

        @firestore.transactional
        def write(transaction):
            old = ref.get(transaction=transaction).to_dict()
            if (old or {}).get("revision", 0) != body.revision:
                fail(409, "project_conflict", "This project changed elsewhere. Reopen it before saving; your pending changes remain on this device.")
            workspace = dict(body.workspace)
            # Stored source metadata can only be added by the upload endpoint.
            workspace["files"] = (old or {}).get("workspace", {}).get("files", [])
            result = {**(old or {}), "project": clean, "workspace": workspace, "revision": body.revision + 1, "updatedAt": datetime.now(timezone.utc).isoformat()}
            transaction.set(ref, result)
            return result

        return write(database().transaction())

    @app.put("/api/projects/{project_id}/files/{file_id}")
    async def upload_file(project_id: str, file_id: str, request: Request, user=Depends(owner)):
        ref, record = existing(user["uid"], project_id)
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,100}", file_id):
            fail(400, "invalid_file", "Choose a valid source file.")
        name = request.headers.get("x-file-name", "source")
        from urllib.parse import unquote
        name = unquote(name)
        if len(name) > 240 or any(c in name for c in ("/", "\\", "\x00")):
            fail(400, "invalid_file", "Use a file name without directory paths.")
        if len(record.get("workspace", {}).get("files", [])) >= 500:
            fail(400, "file_limit", "This project has reached its 500-source limit.")
        object_name = f"owners/{user['uid']}/projects/{project_id}/originals/{file_id}"
        blob = bucket().blob(object_name)
        with tempfile.TemporaryFile() as target:
            size = 0
            async for chunk in request.stream():
                size += len(chunk)
                if size > MAX_FILE:
                    fail(413, "file_too_large", "Choose a source file smaller than 64 MiB.")
                if size + sum(f.get("size", 0) for f in record.get("workspace", {}).get("files", [])) > 128 * 1024 * 1024:
                    fail(413, "project_storage_limit", "This project has reached its 128 MiB source-storage limit.")
                target.write(chunk)
            if not size:
                fail(400, "empty_file", "Choose a non-empty source file.")
            target.seek(0)
            await run_in_threadpool(blob.upload_from_file, target, content_type="application/octet-stream", if_generation_match=0)
        metadata = {"id": file_id, "name": name, "size": size, "type": "Source file", "well": "", "status": "Stored · not parsed", "local": True, "uploadedAt": datetime.now(timezone.utc).isoformat()}

        @firestore.transactional
        def attach(transaction):
            current = ref.get(transaction=transaction).to_dict()
            files = current.get("workspace", {}).get("files", [])
            if sum(f.get("size", 0) for f in files) + size > 128 * 1024 * 1024 or len(files) >= 500:
                fail(413, "project_storage_limit", "This project has reached its source-storage limit.")
            current.setdefault("workspace", {})["files"] = files + [metadata]
            current["revision"] += 1
            transaction.set(ref, current)
            return current

        try:
            return attach(database().transaction())
        except Exception:
            await run_in_threadpool(blob.delete)
            raise

    @app.get("/api/projects/{project_id}/files/{file_id}")
    def download_file(project_id: str, file_id: str, user=Depends(owner)):
        _, record = existing(user["uid"], project_id)
        if not any(f.get("id") == file_id for f in record.get("workspace", {}).get("files", [])):
            fail(404, "file_missing", "This source file could not be found.")
        blob = bucket().blob(f"owners/{user['uid']}/projects/{project_id}/originals/{file_id}")

        def chunks():
            with blob.open("rb") as source:
                while data := source.read(1024 * 1024):
                    yield data

        return StreamingResponse(chunks(), media_type="application/octet-stream", headers={"Content-Disposition": "attachment", "Cache-Control": "no-store"})

    @app.get('/api/projects/{project_id}/files/{file_id}/download-link')
    def download_link(project_id: str, file_id: str, user=Depends(owner)):
        import google.auth
        from google.auth.transport.requests import Request as GoogleRequest
        from urllib.parse import quote
        _, record = existing(user['uid'], project_id)
        source = next((f for f in record.get('workspace', {}).get('files', []) if f.get('id') == file_id), None)
        if not source:
            fail(404, 'file_missing', 'This original could not be found.')
        credentials, _ = google.auth.default(scopes=['https://www.googleapis.com/auth/cloud-platform'])
        credentials.refresh(GoogleRequest())
        blob = bucket().blob(f"owners/{user['uid']}/projects/{project_id}/originals/{file_id}")
        url = blob.generate_signed_url(version='v4', expiration=300, method='GET', service_account_email=os.environ.get('STRATAX_SIGNING_IDENTITY','stratax-auth-runtime@project-9afac.iam.gserviceaccount.com'), access_token=credentials.token, response_type='application/octet-stream', response_disposition="attachment; filename*=UTF-8''" + quote(source['name'], safe=''))
        return {'url':url,'expires_in':300}
