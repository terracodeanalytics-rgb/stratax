"""One Cloud Run Job execution inspects one owner-scoped import, using bucket mounts."""
import json
import logging
import os
import re
import time
from pathlib import Path

from google.cloud import firestore, storage
from ingestion_core import ImportProblem, digest, parse, validate_mapping, set_cancel_check

logger = logging.getLogger("stratax-import")


def run():
    uid, pid, iid, dispatch = [os.environ[k] for k in ("IMPORT_UID", "IMPORT_PROJECT", "IMPORT_ID", "IMPORT_DISPATCH")]
    if any(not re.fullmatch(r'[A-Za-z0-9_-]{1,128}', value) for value in (uid, pid, iid, dispatch)):
        raise ValueError('Invalid worker scope')
    db = firestore.Client(project=os.environ.get("GOOGLE_CLOUD_PROJECT", "project-9afac"))
    project = db.collection("stratax_projects").document(uid).collection("records").document(pid)
    ref = project.collection("imports").document(iid)
    data = ref.get().to_dict()
    if not data or data.get("dispatchToken") != dispatch or data["status"] != "inspecting":
        return
    def settle_remaining(actual_bytes):
        @firestore.transactional
        def settle(transaction):
            current = ref.get(transaction=transaction).to_dict()
            record = project.get(transaction=transaction).to_dict()
            if current.get('dispatchToken') != dispatch or not current.get('artifactReservation'):
                return
            quota = record.setdefault('importQuota', {})
            quota['reservedBytes'] = max(0, quota.get('reservedBytes',0)-current['artifactReservation'])
            quota['derivedBytes'] = quota.get('derivedBytes',0)+actual_bytes
            current.update(artifactReservation=0,derivedBytes=actual_bytes)
            transaction.set(project,record)
            transaction.set(ref,current)
        settle(db.transaction())
    global_ref = db.collection("stratax_import_runtime").document("capacity")

    @firestore.transactional
    def capacity(transaction, take=True):
        state = global_ref.get(transaction=transaction).to_dict() or {"leases": {}}
        leases = {k: v for k, v in state.get("leases", {}).items() if v > time.time()}
        if take:
            if len(leases) >= 2:
                return False
            leases[dispatch] = time.time()+2100
        else:
            leases.pop(dispatch, None)
        transaction.set(global_ref, {"leases": leases})
        return True

    if not capacity(db.transaction()):
        ref.update({"status": "failed", "issues": [{"code": "worker_capacity", "severity": "blocking", "message": "Both parser slots are in use. Your originals are retained; retry shortly."}]})
        project.update({"parserLease": {}})
        settle_remaining(0)
        return
    prefix = f"owners/{uid}/projects/{pid}/imports/{iid}/{dispatch}"
    raw_root = Path(os.environ.get("RAW_MOUNT", "/raw")) / "owners" / uid / "projects" / pid / "originals"
    # Mount sources by immutable ID; restore only safe display names in a private scratch bundle.
    import tempfile
    issues, summaries, fingerprints = [], [], {}
    derived_bytes = 0
    os.environ['IMPORT_ARTIFACT_BUDGET'] = str(max(1024**2, int(data.get('artifactReservation', 1024**3)*0.9)))
    last_check = [0, False]
    def cancelled():
        if time.time() - last_check[0] > 2:
            current = ref.get().to_dict()
            last_check[:] = [time.time(), current.get('status') == 'cancelled' or current.get('dispatchToken') != dispatch]
        return last_check[1]
    set_cancel_check(cancelled)
    try:
        with tempfile.TemporaryDirectory() as scratch:
            paths = {}
            for asset in data["assets"]:
                target = Path(scratch) / asset["name"]
                if target.name != asset["name"] or target.name in (".", ".."):
                    raise ImportProblem("unsafe_name", "A companion filename is unsafe.")
                target.symlink_to(raw_root / asset["id"])
                paths[asset["name"]] = target
            seen = set()
            for index, asset in enumerate(data["assets"]):
                current = ref.get().to_dict()
                if current.get("status") == "cancelled" or current.get("dispatchToken") != dispatch:
                    return
                path = paths[asset["name"]]
                checksum = digest(path)
                fingerprints[asset["id"]] = checksum
                if checksum in seen:
                    issues.append({"code": "exact_duplicate", "severity": "warning", "message": f"{asset['name']}: identical content in this batch was skipped."})
                    continue
                seen.add(checksum)
                # Companion components are read by their owning dataset, not as standalone datasets.
                suffix = path.suffix.lower()
                if suffix in (".shx", ".dbf", ".prj", ".cpg", ".h5", ".hdf5") and any(p.suffix.lower() in (".shp", ".epc") for p in paths.values()):
                    continue
                out_prefix = prefix + "/" + asset["id"]
                output = Path(os.environ.get("DERIVED_MOUNT", "/derived")) / out_prefix
                output.mkdir(parents=True, exist_ok=True)
                try:
                    options = dict(data.get("options", {}))
                    options.update(options.get("perFile", {}).get(asset["name"], {}))
                    datasets = parse(path, output, data["family"], options, paths)
                    for original in datasets:
                        original.update(sourceId=asset["id"], sourceSha256=checksum, importId=iid)
                        original_id = original["id"]
                        manifest = out_prefix + "/" + original_id + ".json"
                        # Rewrite the complete reviewed manifest after mapping validation.
                        (output / (original_id + ".json")).write_text(json.dumps(original, allow_nan=False), encoding="utf-8")
                        did = "ds-" + dispatch[:12] + "-" + asset["id"][:10] + "-" + str(len(summaries))
                        if len(summaries) >= 100:
                            raise ImportProblem('dataset_limit', 'Select fewer logical files or frames per import; this import supports up to 100 datasets.')
                        summaries.append({"id": did, "name": original["name"], "family": data["family"], "sourceId": asset["id"], "sourceSha256": checksum, "manifest": manifest, "rowCount": original["rowCount"], "columns": original["columns"][:200], "columnCount": len(original['columns']), "status": original["status"], "issues": original["issues"][:40], "well": original["well"], "references": original["references"], "mapping": original["mapping"], "parserVersion": original["parserVersion"], "schemaVersion": 1})
                        issues.extend({**note, "source": asset["name"], 'sourceId':asset['id']} for note in original["issues"])
                    derived_bytes += sum(p.stat().st_size for p in output.glob("*") if p.is_file())
                except ImportProblem as error:
                    issues.append({"code": error.code, "severity": "blocking", 'sourceId':asset['id'], 'source':asset['name'], "message": f"{asset['name']}: {str(error)}"})
                except Exception as error:
                    logger.error(json.dumps({"event": "parser_failed", "kind": type(error).__name__, "import_id": iid, "source_id": asset["id"]}))
                    issues.append({"code": "parser_failed", "severity": "blocking", 'sourceId':asset['id'], 'source':asset['name'], "message": f"{asset['name']}: the reader could not validate this file. Check the format/companions or export a supported interchange file."})

        derived_root = Path(os.environ.get('DERIVED_MOUNT', '/derived')) / prefix
        derived_bytes = sum(p.stat().st_size for p in derived_root.rglob('*') if p.is_file()) if derived_root.exists() else 0
        @firestore.transactional
        def finish(transaction):
            current = ref.get(transaction=transaction).to_dict()
            record = project.get(transaction=transaction).to_dict()
            if current.get("status") == "cancelled" or current.get("dispatchToken") != dispatch:
                return
            quota = record.setdefault("importQuota", {})
            used = sum(f.get("size", 0) for f in record.get("workspace", {}).get("files", []))
            if used + quota.get("reservedBytes", 0) - current.get('artifactReservation',0) + quota.get("derivedBytes", 0) + derived_bytes > 50 * 1024**3:
                issues.append({"code": "derived_quota", "severity": "blocking", "message": "Derived artifacts would exceed the project quota. Originals are retained."})
            quota["derivedBytes"] = quota.get("derivedBytes", 0) + derived_bytes
            quota['reservedBytes'] = max(0, quota.get('reservedBytes', 0) - current.get('artifactReservation', 0))
            current['artifactReservation'] = 0
            for asset in current["assets"]:
                asset["sha256"] = fingerprints.get(asset["id"])
            for source in record.get("workspace", {}).get("files", []):
                if source["id"] in fingerprints:
                    source["sha256"] = fingerprints[source["id"]]
            record["parserLease"] = {}
            record["revision"] += 1
            current.update(datasets=summaries, issues=issues[:150], status="retained/unresolved" if any(i["severity"] == "blocking" for i in issues) else "awaiting confirmation", revision=current["revision"]+1, derivedBytes=derived_bytes)
            transaction.set(project, record)
            transaction.set(ref, current)
        finish(db.transaction())
    except Exception as error:
        logger.error(json.dumps({"event": "import_failed", "kind": type(error).__name__, "import_id": iid}))
        if ref.get().to_dict().get("status") != "cancelled":
            ref.update({"status": "failed", "issues": [{"code": "inspection_failed", "severity": "blocking", "message": "Inspection did not finish. Your originals are retained; retry inspection."}]})
    finally:
        derived_root = Path(os.environ.get('DERIVED_MOUNT','/derived')) / prefix
        actual = sum(p.stat().st_size for p in derived_root.rglob('*') if p.is_file()) if derived_root.exists() else 0
        settle_remaining(actual)
        capacity(db.transaction(), False)
        record = project.get().to_dict()
        if record.get("parserLease", {}).get("id") == iid:
            project.update({"parserLease": {}})


if __name__ == "__main__":
    if os.environ.get('STRATAX_IMPORT_SELFTEST') == '1':
        from native_selftest import main
        main()
    else:
        run()
