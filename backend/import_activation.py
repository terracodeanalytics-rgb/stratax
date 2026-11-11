"""Shared activation of inspected evidence inside the caller's transaction."""
from datetime import datetime, timezone

from import_scope import WELL_FAMILIES, workflow_allows

INFORMATIONAL = {'workflow_skipped', 'duplicate_location', 'duplicate_header_row', 'large_manifest', 'unknown_units'}


def needs_review(issue, dataset):
    if issue.get('severity') == 'blocking':
        return True
    code = issue.get('code')
    return code not in INFORMATIONAL and not (code == 'unconfirmed_crs' and dataset['family'] in {'logs', 'well_headers'})


def scoped_issues(record, dataset):
    source = next((asset for asset in record['assets'] if asset['id'] == dataset.get('sourceId')), {})
    return [issue for issue in record.get('issues', []) if (
        issue.get('datasetId') == dataset['id'] if issue.get('datasetId') else
        issue.get('sourceId') == dataset.get('sourceId') if issue.get('sourceId') else
        not issue.get('source') or issue['source'] == source.get('name')
    )] + dataset.get('issues', [])


def automatic_selection(record, project):
    workspace = project.get('workspace', {})
    workflows = project.get('project', {}).get('workflows', [])
    trashed = {source['id'] for source in workspace.get('files', []) if source.get('trashed')}
    candidates = [dataset for dataset in record['datasets'] if (
        not dataset.get('active') and dataset.get('sourceId') not in trashed
        and workflow_allows(dataset['family'], workflows)
        and not any(needs_review(issue, dataset) for issue in scoped_issues(record, dataset))
    )]
    wells = {w['id'] for w in workspace.get('wellDrafts', [])}
    wells.update(w['id'] for d in candidates for w in d.get('wellRecords', []))
    candidates.sort(key=lambda d: not bool(d.get('wellRecords')))
    for dataset in candidates[:]:
        if dataset['family'] in WELL_FAMILIES - {'well_headers'} and dataset.get('well') not in wells:
            record['issues'].append({'code':'well_match_required', 'severity':'blocking', 'datasetId':dataset['id'],
                                     'message':'Confirm the owning well before importing this dataset.'})
            candidates.remove(dataset)
    return candidates


def source_group_overlaps(first, second):
    if first.get('sourceId') != second.get('sourceId'):
        return False
    left, right = first.get('metadata', {}), second.get('metadata', {})
    if left.get('sheet') and right.get('sheet') and left['sheet'] != right['sheet']:
        return False
    if left.get('rowWell') and right.get('rowWell'):
        mappings = [item.get('mapping', {}) for item in (first, second)]
        columns = [mapping.get('uwi') or mapping.get('well') for mapping in mappings]
        if all(col is not None for col in columns) and str(columns[0]) != str(columns[1]):
            return True  # Changing the grouping column can overlap previously activated rows.
        return str(left.get('well') or '').strip().casefold() == str(right.get('well') or '').strip().casefold()
    return True


def accepted_groups(parent):
    return [d for d in parent.get('datasets', []) if d.get('active')] + parent.get('followUpAccepted', [])


def automatic_result(record):
    skipped = {}
    unlisted = 0
    for item in record.get('archiveEntries', []):
        if item.get('excluded'):
            skipped[item['path']] = item.get('reason', '')
    for asset in record['assets']:
        transfer = record.get('options', {}).get('perAsset', {}).get(asset.get('clientId', asset['id']), {}).get('archiveTransfer', {})
        for item in transfer.get('excluded', []):
            skipped[item['path']] = item['message']
        unlisted += max(0, transfer.get('excludedCount', 0) - len(transfer.get('excluded', [])))
    for issue in record.get('issues', []):
        if issue.get('code') == 'workflow_skipped':
            asset = next((a for a in record['assets'] if a['id'] == issue.get('sourceId')), {})
            skipped[asset.get('archive', {}).get('path') or issue.get('source', '')] = issue['message']
    resolved = record.get('followUpAccepted', [])
    pending = [d for d in record['datasets'] if not d.get('active') and not any(source_group_overlaps(d, r) for r in resolved)]
    source_ids = {d.get('sourceId') for d in record['datasets']}
    pending_sources = list(dict.fromkeys(
        issue['sourceId'] for issue in record.get('issues', [])
        if issue.get('sourceId') and issue['sourceId'] not in source_ids and issue.get('code') != 'workflow_skipped'
        and not any(r['sourceId'] == issue['sourceId'] for r in resolved)
    ))
    return {'accepted': sum(bool(d.get('active')) for d in record['datasets']) + len(resolved),
            'pending': len(pending) + len(pending_sources), 'pendingSourceIds': pending_sources,
            'skipped': [{'path': path, 'reason': reason} for path, reason in skipped.items()],
            'skippedCount': len(skipped) + unlisted}


def activate_datasets(transaction, ref, ir, current, project_data, selected, selected_columns,
                      old_ref=None, old=None, *, bump_project=True, write_records=True):
    """Register already validated selections without making any additional reads."""
    iid = current['id']
    sources = {d.get('sourceId') for d in selected}
    source_names = {a['name'] for a in current['assets'] if a['id'] in sources}
    status = "retained/unresolved" if current.get("issues") else "ready"
    for dataset in selected:
        columns = selected_columns.get(dataset['id'])
        if columns is not None:
            dataset['activeColumns'] = columns
        dataset.update(active=True, status='retained/unresolved' if dataset.get('issues') else 'ready', importId=iid, scientificApproval=False)
        if old:
            dataset["previousVersion"] = old["id"]
        transaction.set(ref.collection("datasets").document(dataset["id"]), dataset)
    if old_ref:
        transaction.update(old_ref, {"active": False, "supersededBy": selected[0]["id"]})
    current.update(status=status, revision=current["revision"]+1, committedAt=datetime.now(timezone.utc).isoformat())
    current['acceptedDatasetIds']=[d['id'] for d in selected]
    current['pendingDatasetIds']=[d['id'] for d in current.get('datasets',[]) if not d.get('active')]
    workspace = project_data.setdefault("workspace", {})
    workspace.setdefault("audit", []).insert(0, {"action": "Imported " + current["family"] + " evidence", "time": current["committedAt"]})
    workspace["audit"] = workspace["audit"][:200]
    from well_ingestion import register_evidence
    register_evidence(workspace, selected)
    # Legacy per-file registrations remain compatible.
    wells = workspace.setdefault("wellDrafts", [])
    for filename, selection in current.get("options", {}).get("perFile", {}).items():
        if filename not in source_names:
            continue
        selected_well = str(selection.get("well", "")).strip()[:100]
        if selected_well and selection.get("createWell") and not any(w["id"] == selected_well for w in wells):
            wells.append({"id": selected_well, "source": iid, "status": "Imported registration", "curves": sum(len(d.get("columns", [])) for d in current["datasets"] if d.get("well") == selected_well), "depth": "Source reference"})
    for source in workspace.get('files',[]):
        if source['id'] in sources:
            source['status']='Imported · references unresolved' if status!='ready' else 'Imported'
            source['type']=next((a.get('family',current['family']) for a in current['assets'] if a['id']==source['id']),current['family'])
            associations = list({d.get('well') for d in selected if d.get('sourceId') == source['id'] and d.get('well')})
            source['well'] = associations[0] if len(associations) == 1 else ''
            source['wellIds'] = associations
    if bump_project:
        project_data["revision"] += 1
    current['projectRevision']=project_data['revision']
    if write_records:
        transaction.set(ref, project_data)
        transaction.set(ir, current)
