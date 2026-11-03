"""One Cloud Run Job execution inspects one owner-scoped import, using bucket mounts."""
import json
import logging
import os
import re
import time
from pathlib import Path

from google.cloud import firestore, storage
from ingestion_core import ImportProblem, digest, parse, validate_mapping, set_cancel_check, set_progress_callback

logger = logging.getLogger("stratax-import")


def run():
    inspect_started = time.monotonic()
    uid, pid, iid, dispatch = [os.environ[k] for k in ("IMPORT_UID", "IMPORT_PROJECT", "IMPORT_ID", "IMPORT_DISPATCH")]
    if any(not re.fullmatch(r'[A-Za-z0-9_-]{1,128}', value) for value in (uid, pid, iid, dispatch)):
        raise ValueError('Invalid worker scope')
    db = firestore.Client(project=os.environ.get("GOOGLE_CLOUD_PROJECT", "project-9afac"))
    project = db.collection("stratax_projects").document(uid).collection("records").document(pid)
    ref = project.collection("imports").document(iid)
    known_wells = project.get().to_dict().get('workspace', {}).get('wellDrafts', [])
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
    completed_asset_keys, asset_rows = [], {}
    last_progress = [0.0]
    active_asset = [None]
    def publish_progress(phase, asset=None, force=True, **detail):
        now = time.monotonic()
        if not force and now-last_progress[0] < 1.5:
            return
        progress = {'phase':phase, 'updatedAt':time.time(), 'totalAssets':len(data['assets']), 'completedAssets':len(completed_asset_keys), 'completedAssetKeys':list(completed_asset_keys), **detail}
        if asset:
            progress.update(assetKey=asset.get('clientId', asset['id']), assetName=asset['name'])
        @firestore.transactional
        def update_progress(transaction):
            current = ref.get(transaction=transaction).to_dict()
            if current.get('dispatchToken') == dispatch and current.get('status') == 'inspecting':
                transaction.update(ref, {'progress':progress})
        update_progress(db.transaction())
        last_progress[0] = now

    def reader_progress(detail):
        values = dict(detail)
        phase = values.pop('phase', 'parsing')
        dataset_id = values.pop('datasetId', None)
        if dataset_id:
            asset_rows[dataset_id] = values.get('records', 0)
            values['records'] = sum(asset_rows.values())
        try:
            publish_progress(phase, active_asset[0], force=False, **values)
        except Exception:
            logger.warning(json.dumps({'event':'progress_update_delayed','import_id':iid}))

    set_progress_callback(reader_progress)

    try:
        publish_progress('starting')
        with tempfile.TemporaryDirectory() as scratch:
            paths, companions, counts, scopes = {}, {}, {}, {}
            for asset in data['assets']:
                settings = {**data.get('options', {}).get('perFile', {}).get(asset['name'], {}), **data.get('options', {}).get('perAsset', {}).get(asset.get('clientId', asset['id']), {})}
                archive = settings.get('archive') or {}
                scope = (archive.get('rootId'), archive.get('directoryKey')) if archive else (None, None)
                scopes[asset.get('clientId',asset['id'])] = scope
                counts[(scope, asset['name'])] = counts.get((scope, asset['name']), 0) + 1
            for index, asset in enumerate(data['assets']):
                directory = Path(scratch) / str(index)
                directory.mkdir()
                target = directory / asset['name']
                if target.name != asset['name'] or target.name in ('.', '..'):
                    raise ImportProblem('unsafe_name', 'A companion filename is unsafe.')
                scope = scopes[asset.get('clientId',asset['id'])]
                group = [other for other in data['assets'] if scopes[other.get('clientId',other['id'])] == scope]
                for other in group:
                    if counts[(scope,other['name'])] == 1 or other is asset:
                        link = directory / other['name']
                        if not link.exists():
                            link.symlink_to(raw_root / other['id'])
                paths[asset.get('clientId', asset['id'])] = target
                companions[asset.get('clientId', asset['id'])] = {other['name']: directory / other['name'] for other in group if counts[(scope,other['name'])] == 1}
            for index, asset in enumerate(data['assets']):
                current = ref.get().to_dict()
                if current.get('status') == 'cancelled' or current.get('dispatchToken') != dispatch:
                    return
                active_asset[0] = asset
                asset_rows.clear()
                path = paths[asset.get('clientId', asset['id'])]
                publish_progress('hashing', asset)
                checksum = fingerprints.get(asset['id']) or digest(path)
                fingerprints[asset['id']] = checksum
                settings = {**data.get('options', {}).get('perFile', {}).get(asset['name'], {}), **data.get('options', {}).get('perAsset', {}).get(asset.get('clientId',asset['id']), {})}
                if settings.get('retainOnly'):
                    completed_asset_keys.append(asset.get('clientId',asset['id']))
                    publish_progress('complete', asset)
                    continue
                # Companion components are read by their owning dataset, not as standalone datasets.
                suffix = path.suffix.lower()
                if suffix in (".shx", ".dbf", ".prj", ".cpg", ".h5", ".hdf5") and any(p.suffix.lower() in (".shp", ".epc") for p in companions[asset.get('clientId',asset['id'])].values()):
                    completed_asset_keys.append(asset.get('clientId',asset['id']))
                    publish_progress('complete', asset)
                    continue
                out_prefix = prefix + "/" + asset["id"] + "-" + str(index)
                output = Path(os.environ.get("DERIVED_MOUNT", "/derived")) / out_prefix
                output.mkdir(parents=True, exist_ok=True)
                try:
                    options = dict(data.get("options", {}))
                    options.update(options.get("perFile", {}).get(asset["name"], {}))
                    options.update(options.get("perAsset", {}).get(asset.get("clientId", asset["id"]), {}))
                    family = asset.get("family", data["family"])
                    options["_knownWells"] = known_wells
                    options["assetId"] = asset.get("clientId", asset["id"])
                    options['_sourceSha256']=checksum
                    publish_progress('parsing', asset)
                    scope = scopes[asset.get('clientId',asset['id'])]
                    if path.suffix.lower() in ('.shp','.epc') and counts[(scope,asset['name'])] > 1:
                        raise ImportProblem('ambiguous_bundle','Repeated bundle filenames in the same archive folder require selective exclusion or separate imports.')
                    datasets = parse(path, output, family, options, companions[asset.get("clientId", asset["id"])])
                    publish_progress('saving', asset, records=sum(d['rowCount'] for d in datasets))
                    for original in datasets:
                        if options.get('archive'):
                            original.setdefault('metadata', {})['archive'] = options['archive']
                        original.update(sourceId=asset["id"], sourceSha256=checksum, importId=iid)
                        original_id = original["id"]
                        manifest = out_prefix + "/" + original_id + ".json"
                        # Rewrite the complete reviewed manifest after mapping validation.
                        (output / (original_id + ".json")).write_text(json.dumps(original, allow_nan=False), encoding="utf-8")
                        did = "ds-" + dispatch[:12] + "-" + asset["id"][:10] + "-" + str(len(summaries))
                        if len(summaries) >= 100:
                            raise ImportProblem('dataset_limit', 'Select fewer logical files or frames per import; this import supports up to 100 datasets.')
                        summaries.append({"id": did, "name": original["name"], "family": family, "assetKey": asset.get("clientId", asset["id"]), "sourceId": asset["id"], "sourceSha256": checksum, "manifest": manifest, "rowCount": original["rowCount"], "columns": original["columns"][:200], "columnCount": len(original['columns']), "status": original["status"], "issues": original["issues"][:40], "well": original["well"], "references": original["references"], "mapping": original["mapping"], "parserVersion": original["parserVersion"], "schemaVersion": 1})
                        summaries[-1].update(wellRecords=original.get('wellRecords',[]),markerPicks=original.get('markerPicks',[]),surveyMethod=original.get('surveyMethod','angles'))
                        if family!='seismic':
                            summaries[-1]['metadata']={k:v for k,v in original.get('metadata',{}).items() if k in ('format','well','wellName','rowUwi','rowWell','surveyMethod','archive')}
                        if family=='seismic':
                            summaries[-1]['metadata']={k:v for k,v in original.get('metadata',{}).items() if k in ('format','traceCount','sampleCount','sampleCountRange','sampleInterval','sampleIntervalRange','sampleOriginRange','endian','headerBytes','inlineRange','crosslineRange')}
                            summaries[-1]['metadata']['traceIndexAvailable']=bool(original.get('metadata',{}).get('traceIndex'))
                        issues.extend({**note, "source": asset["name"], 'sourceId':asset['id']} for note in original["issues"])
                    derived_bytes += sum(p.stat().st_size for p in output.glob("*") if p.is_file())
                except ImportProblem as error:
                    issues.append({"code": error.code, "severity": "blocking", 'sourceId':asset['id'], 'source':asset['name'], "message": f"{asset['name']}: {str(error)}"})
                except Exception as error:
                    logger.error(json.dumps({"event": "parser_failed", "kind": type(error).__name__, "import_id": iid, "source_id": asset["id"]}))
                    issues.append({"code": "parser_failed", "severity": "blocking", 'sourceId':asset['id'], 'source':asset['name'], "message": f"{asset['name']}: the reader could not validate this file. Check the format/companions or export a supported interchange file."})

                completed_asset_keys.append(asset.get('clientId', asset['id']))
                publish_progress('complete', asset, records=sum(asset_rows.values()))

        publish_progress('finalizing')
        derived_root = Path(os.environ.get('DERIVED_MOUNT', '/derived')) / prefix
        derived_bytes = sum(p.stat().st_size for p in derived_root.rglob('*') if p.is_file()) if derived_root.exists() else 0
        @firestore.transactional
        def finish(transaction):
            current = ref.get(transaction=transaction).to_dict()
            record = project.get(transaction=transaction).to_dict()
            if current.get("status") == "cancelled" or current.get("dispatchToken") != dispatch:
                return
            from well_ingestion import cross_well_issues
            final_issues = [*issues, *cross_well_issues(record.get('workspace', {}), summaries)]
            if len(final_issues) > 149:
                final_issues = sorted(final_issues, key=lambda note: note['severity'] != 'blocking')[:148] + [{'code': 'issue_limit', 'severity': 'blocking', 'message': 'Inspection found more than 149 issues. Review smaller batches before activation; all originals remain retained.'}]
            quota = record.setdefault("importQuota", {})
            used = sum(f.get("size", 0) for f in record.get("workspace", {}).get("files", []))
            if used + quota.get("reservedBytes", 0) - current.get('artifactReservation',0) + quota.get("derivedBytes", 0) + derived_bytes > 50 * 1024**3:
                final_issues.append({"code": "derived_quota", "severity": "blocking", "message": "Derived artifacts would exceed the project quota. Originals are retained."})
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
            current.update(datasets=summaries, issues=final_issues[:150], timings={'inspectMs': round((time.monotonic()-inspect_started)*1000)}, status="retained/unresolved" if any(i["severity"] == "blocking" for i in final_issues) else "awaiting confirmation", revision=current["revision"]+1, derivedBytes=derived_bytes)
            transaction.set(project, record)
            transaction.set(ref, current)
        finish(db.transaction())
    except Exception as error:
        logger.error(json.dumps({"event": "import_failed", "kind": type(error).__name__, "import_id": iid}))
        if ref.get().to_dict().get("status") != "cancelled":
            ref.update({"status": "failed", "issues": [{"code": "inspection_failed", "severity": "blocking", "message": "Inspection did not finish. Your originals are retained; retry inspection."}]})
    finally:
        set_progress_callback(None)
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
