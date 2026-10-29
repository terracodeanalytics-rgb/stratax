"""Seismic resources use the existing verified identity, project and policy boundary."""
import json
import os
import re
import logging
import math
import hashlib
from typing import Literal

from fastapi import Depends
from google.cloud import firestore, storage
from google.api_core.exceptions import GoogleAPICallError
from pydantic import BaseModel, ConfigDict, Field

from scientific_api import fingerprint, firestore_value, now, restore_value
from seismic_graph import Graph, OPERATORS, VERSION, validate_graph
from seismic_reader import SectionError, read_section, read_preview
from seismic_execution import execution_capabilities


class TrackingSettings(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    event: Literal["peak", "trough", "zero"]
    radius: int = Field(ge=1, le=32)
    window: int = Field(ge=2, le=32)
    minimumCorrelation: float = Field(ge=0, le=1)
    barriers: list[int] = Field(max_length=512)


class TrackingBounds(BaseModel):
    model_config = ConfigDict(extra="forbid")
    firstTrace: int = Field(ge=0)
    traceCount: int = Field(ge=1, le=512)
    firstSample: int = Field(ge=0)
    sampleCount: int = Field(ge=1, le=4096)


class TrackingAssistance(BaseModel):
    model_config = ConfigDict(extra="forbid")
    method: Literal["bounded-section-event-correlation/v1"]
    sourceVersion: str = Field(min_length=1, max_length=100)
    settings: TrackingSettings
    seeds: list[dict] = Field(min_length=1, max_length=512)
    bounds: TrackingBounds
    acceptedPicks: int = Field(ge=1, le=512)
    acceptedAt: str = Field(max_length=64)


class Interpretation(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    revision: int = Field(ge=0)
    datasetId: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    sourceVersion: str = Field(min_length=1, max_length=100)
    kind: str
    label: str = Field(min_length=1, max_length=120)
    points: list[dict] = Field(default_factory=list, max_length=2000)
    notes: str = Field(default="", max_length=4000)
    assistance: TrackingAssistance | None = None


def install_seismic(app, database, current_user, fail, acceptance_current):
    def owner(user=Depends(current_user)):
        if not acceptance_current(database().collection("stratax_legal_acceptance").document(user["uid"]).get().to_dict()):
            fail(403, "policies_required", "Accept the current StrataX policies before opening seismic data.")
        return user

    def valid(value):
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,100}", value):
            fail(400, "invalid_reference", "Choose a valid seismic project or resource.")
        return value

    def project(uid, pid):
        ref = database().collection("stratax_projects").document(uid).collection("records").document(valid(pid))
        record = ref.get().to_dict()
        if not record:
            fail(404, "project_missing", "This project could not be found.")
        if record["project"].get("status") in ("Archived", "Trash"):
            fail(409, "project_inactive", "Restore this project before editing seismic work.")
        if "seismic" not in record["project"].get("workflows", []):
            fail(400, "workflow_required", "Enable the seismic workflow in project settings.")
        return ref, record

    def source(ref, did):
        ds = ref.collection("datasets").document(valid(did)).get().to_dict()
        if not ds or ds.get("active") is not True or ds.get("family") != "seismic":
            fail(404, "dataset_missing", "Choose an active retained seismic dataset.")
        return ds

    @app.get("/api/projects/{pid}/seismic/capabilities")
    def capabilities(pid: str, user=Depends(owner)):
        project(user["uid"], pid)
        execution = execution_capabilities()
        return dict(version=VERSION, sectionAdapters=["fixed-length-segy-rev0-1", "su-ieee", "processed-analytical-traces/v1"],
                    sectionLimits=dict(traces=512, samples=4096, cells=2_000_000),
                    processingOperators=OPERATORS, hostedGraphExecution=execution['available'], executionProfiles=[execution],
                    capacityQualification="Not yet field-scale qualified",
                    restrictions=["ZGY/SGZ and variable-layout sections require the indexed worker adapter.",
                                  "RTM/FWI, inversion and geological-grid execution are not connected to this API version."])

    @app.get("/api/projects/{pid}/seismic")
    def resources(pid: str, user=Depends(owner)):
        ref, _ = project(user["uid"], pid)
        sources = [s.to_dict() for s in ref.collection("datasets").limit(1000).stream()]
        sources = [dict(id=d["id"], name=d["name"], sourceId=d.get("sourceId"), references=d.get("references", {}),
                        sourceVersion=fingerprint(d), sourceSha256=d.get('sourceSha256'), status=d.get("status", "Imported"))
                   for d in sources if d.get("active") is True and d.get("family") == "seismic"]
        interpretations = [restore_value(d.to_dict()) for d in ref.collection("seismicInterpretations").limit(200).stream()]
        versions = {s["id"]: s["sourceVersion"] for s in sources}
        for item in interpretations:
            item["stale"] = versions.get(item["datasetId"]) != item["sourceVersion"]
        return dict(sources=sources, interpretations=interpretations)

    def fetch_section(uid, pid, record, ds, **bounds):
        if ds.get('seismicRunId'):
            prefix = f'owners/{uid}/projects/{pid}/seismic/runs/{valid(ds["seismicRunId"])}/'
            if ds.get('manifest') != prefix+'manifest.json':
                fail(400, 'invalid_artifact', 'The calculated seismic reference is invalid.')
            bucket = storage.Client().bucket(os.environ['STRATAX_DERIVED_BUCKET'])
            manifest_blob = bucket.blob(ds['manifest'])
            manifest_blob.reload()
            if manifest_blob.size > 2*1024**2:
                fail(413, 'manifest_budget', 'This calculated metadata exceeds its budget.')
            encoded = manifest_blob.download_as_bytes()
            if hashlib.sha256(encoded).hexdigest() != ds['sourceSha256']:
                fail(409, 'source_checksum', 'This calculated source changed checksum. No replacement data was substituted.')
            manifest = json.loads(encoded)
            def load(path):
                if not re.fullmatch(re.escape(prefix)+r'preview/[0-9]+\.json\.gz', path):
                    fail(400, 'invalid_artifact', 'A calculated chunk leaves its run scope.')
                blob = bucket.blob(path)
                blob.reload()
                if blob.size > 2*1024**2:
                    fail(413, 'chunk_budget', 'This analytical chunk exceeds its read budget.')
                return blob.download_as_bytes()
            try:
                value = read_preview(manifest, load, **bounds)
            except SectionError as error:
                fail(400, 'result_section', str(error))
            return value | dict(_identity=dict(bucket=os.environ['STRATAX_DERIVED_BUCKET'], object=ds['manifest'], generation=manifest_blob.generation, sha256=ds['sourceSha256'],
                                               size=manifest_blob.size, kind='trace-preview', endian='big', headerBytes={}))
        original = next((f for f in record["workspace"].get("files", []) if f["id"] == ds.get("sourceId")), None)
        if not original:
            fail(404, "source_missing", "The immutable original is not attached to this project.")
        extension = original["name"].lower().rsplit(".", 1)[-1]
        if extension not in ("sgy", "segy", "su"):
            fail(400, "indexed_adapter_required", "Use the indexed worker adapter for this format; no decimated preview was substituted.")
        prefix = f"owners/{uid}/projects/{pid}/"
        path = ds.get("manifest", "")
        if not path.startswith(prefix) or ".." in path.split("/") or "\\" in path:
            fail(400, "invalid_artifact", "The dataset artifact reference is invalid.")
        client = storage.Client()
        blob = client.bucket(os.environ["STRATAX_DERIVED_BUCKET"]).blob(path)
        blob.reload()
        if blob.size > 2*1024**2:
            fail(413, "manifest_budget", "The seismic manifest exceeds its metadata budget.")
        metadata = json.loads(blob.download_as_bytes()).get("metadata", {})
        allowed = {k: v for k, v in metadata.get("headerBytes", {}).items() if k in ("inline", "crossline", "cdp", "shot", "offset", "x", "y", "scalar")}
        raw = client.bucket(os.environ["STRATAX_PROJECT_BUCKET"]).blob(prefix+"originals/"+valid(original["id"]))
        raw.reload()
        try:
            with raw.open("rb", chunk_size=256*1024) as stream:
                result = read_section(stream, raw.size, kind="su" if extension == "su" else "segy", endian=metadata.get("endian", "big"),
                                      header_bytes=allowed, **bounds)
        except SectionError as error:
            fail(400, "section_input", str(error))
        return result | dict(_identity=dict(bucket=os.environ["STRATAX_PROJECT_BUCKET"], object=prefix+"originals/"+valid(original["id"]),
                                            generation=getattr(raw, "generation", None), size=raw.size, kind="su" if extension == "su" else "segy",
                                            endian=metadata.get("endian", "big"), headerBytes=allowed))

    def retained_section(uid, pid, record, ds, **bounds):
        try:
            return fetch_section(uid, pid, record, ds, **bounds)
        except (GoogleAPICallError, OSError, json.JSONDecodeError):
            logging.getLogger("stratax").exception("Retained seismic source unavailable for project %s dataset %s", pid, ds.get("id"))
            fail(503, "seismic_source_unavailable", "The retained source is currently unavailable. Retry or reconnect its original; your interpretation draft is preserved.")

    @app.get("/api/projects/{pid}/seismic/sources/{did}/section")
    def read(pid: str, did: str, first_trace: int = 0, trace_count: int = 128,
             first_sample: int = 0, sample_count: int = 1000, user=Depends(owner)):
        ref, record = project(user["uid"], pid)
        ds = source(ref, did)
        result = retained_section(user["uid"], pid, record, ds, first_trace=first_trace,
                                  trace_count=trace_count, first_sample=first_sample, sample_count=sample_count)
        result.pop('_identity', None)
        return result | dict(datasetId=did, sourceVersion=fingerprint(ds), references=ds.get("references", {}))

    @app.put("/api/projects/{pid}/seismic/interpretations/{iid}")
    def save_interpretation(pid: str, iid: str, body: Interpretation, user=Depends(owner)):
        ref, record = project(user["uid"], pid)
        ds = source(ref, body.datasetId)
        if body.kind not in ("horizon", "fault"):
            fail(400, "interpretation_kind", "Choose a horizon or fault interpretation.")
        for point in body.points:
            if set(point) != {"trace", "sample", "locked"} or type(point["trace"]) is not int or point["trace"] < 0 or type(point["sample"]) not in (int, float) or not math.isfinite(point["sample"]) or point["sample"] < 0 or type(point["locked"]) is not bool:
                fail(400, "pick_coordinates", "Use retained nonnegative trace/sample coordinates and explicit pick locks.")
        if body.sourceVersion != fingerprint(ds):
            fail(409, "stale_source", "The source version changed. Reload it before saving; keep your interpretation draft.")
        if body.assistance and body.assistance.sourceVersion != body.sourceVersion:
            fail(400, "assistance_source", "Tracking provenance must identify this interpretation's source version.")
        if body.assistance:
            for seed in body.assistance.seeds:
                if set(seed) != {"trace", "sample"} or type(seed["trace"]) is not int or seed["trace"] < 0 or type(seed["sample"]) not in (int, float) or not math.isfinite(seed["sample"]) or seed["sample"] < 0:
                    fail(400, "tracking_seeds", "Tracking provenance requires finite retained seed coordinates.")
        if body.points or body.assistance:
            dimensions = retained_section(user["uid"], pid, record, ds, first_trace=0,
                                          trace_count=1, first_sample=0, sample_count=1)
            if any(p["trace"] >= dimensions["traceCount"] or p["sample"] > dimensions["samplesPerTrace"]-1 for p in body.points):
                fail(400, "pick_bounds", "A pick is outside the retained source trace/sample bounds. Your draft is retained.")
            if body.assistance:
                bounds = body.assistance.bounds
                if bounds.firstTrace+bounds.traceCount > dimensions["traceCount"] or bounds.firstSample+bounds.sampleCount > dimensions["samplesPerTrace"] or any(s["trace"] < bounds.firstTrace or s["trace"] >= bounds.firstTrace+bounds.traceCount or s["sample"] < bounds.firstSample or s["sample"] > bounds.firstSample+bounds.sampleCount-1 for s in body.assistance.seeds):
                    fail(400, "tracking_bounds", "Tracking seeds and the retained section must remain inside the source bounds.")
            if body.kind == "horizon" and len({p["trace"] for p in body.points}) != len(body.points):
                fail(400, "duplicate_picks", "Keep one pick per source trace in this section interpretation.")
            if body.kind == "fault" and len({(p["trace"], p["sample"]) for p in body.points}) != len(body.points):
                fail(400, "duplicate_picks", "Remove duplicate fault-stick points while preserving their interpretation order.")
        if len(json.dumps(body.model_dump(), allow_nan=False).encode()) > 128*1024:
            fail(413, "interpretation_budget", "Split this interpretation into smaller source-bound objects.")
        item = ref.collection("seismicInterpretations").document(valid(iid))

        @firestore.transactional
        def write(tx):
            old = item.get(transaction=tx).to_dict() or {}
            current_source = ref.collection("datasets").document(body.datasetId).get(transaction=tx).to_dict()
            if not current_source or current_source.get("active") is not True or fingerprint(current_source) != body.sourceVersion:
                fail(409, "stale_source", "The source version changed before this save.")
            if old.get("revision", 0) != body.revision:
                fail(409, "interpretation_conflict", "This interpretation changed elsewhere. Your draft is retained; reload before merging.")
            data = body.model_dump() | dict(id=iid, revision=body.revision+1, updatedAt=now(), scientificApproval=False)
            tx.set(item, firestore_value(data))
            return data
        return write(database().transaction())

    from seismic_runs_api import install_seismic_runs
    install_seismic_runs(app, database, owner, project, source, retained_section, valid, fail)

    @app.post("/api/projects/{pid}/seismic/graphs/validate")
    def graph_validation(pid: str, body: Graph, user=Depends(owner)):
        ref, _ = project(user["uid"], pid)
        ds = source(ref, body.sourceId)
        if fingerprint(ds) != body.sourceVersion:
            fail(409, "stale_source", "Reload the current seismic source before validating its graph.")
        try:
            nodes, digest = validate_graph(body)
        except ValueError as error:
            fail(400, "graph_input", str(error))
        available = execution_capabilities()['available']
        return dict(valid=True, fingerprint=digest, steps=[n.id for n in nodes],
                    executionAvailable=available, message="Graph validated. Estimate and review the exact analytical selection before execution." if available else "Graph validated. The Batch worker image/resource profile has not been commissioned; no job was submitted.")

    @app.get("/api/projects/{pid}/seismic/graphs")
    def graph_list(pid: str, user=Depends(owner)):
        ref, _ = project(user["uid"], pid)
        return dict(graphs=[restore_value(d.to_dict()) for d in ref.collection("seismicGraphs").limit(100).stream()])

    @app.get("/api/projects/{pid}/seismic/graphs/{gid}")
    def graph_read(pid: str, gid: str, user=Depends(owner)):
        ref, _ = project(user["uid"], pid)
        saved = ref.collection("seismicGraphs").document(valid(gid)).get().to_dict()
        if not saved:
            fail(404, "graph_missing", "This processing graph could not be found.")
        return restore_value(saved)

    @app.put("/api/projects/{pid}/seismic/graphs/{gid}")
    def graph_save(pid: str, gid: str, body: Graph, user=Depends(owner)):
        ref, _ = project(user["uid"], pid)
        ds = source(ref, body.sourceId)
        if fingerprint(ds) != body.sourceVersion:
            fail(409, "stale_source", "Reload this source before saving its graph. Your local draft is retained.")
        try:
            _, digest = validate_graph(body)
        except ValueError as error:
            fail(400, "graph_input", str(error))
        item = ref.collection("seismicGraphs").document(valid(gid))

        @firestore.transactional
        def write(tx):
            old = restore_value(item.get(transaction=tx).to_dict() or {})
            current = ref.collection("datasets").document(body.sourceId).get(transaction=tx).to_dict()
            if not current or current.get("active") is not True or fingerprint(current) != body.sourceVersion:
                fail(409, "stale_source", "The input changed before this graph save. Your draft is retained.")
            if old.get("revision", 0) != body.revision:
                fail(409, "graph_conflict", "This graph changed elsewhere. Keep your draft and reload before merging.")
            graph = body.model_dump() | dict(revision=body.revision+1)
            data = dict(id=gid, revision=body.revision+1, graph=graph, fingerprint=digest, updatedAt=now())
            tx.set(item, firestore_value(data))
            return data
        return write(database().transaction())
