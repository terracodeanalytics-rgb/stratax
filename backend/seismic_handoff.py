"""Cross-workspace accepted-source handoff and stale-result detection."""
from __future__ import annotations

from seismic_processing import require


def accepted_processing_handoff(
    *,
    run_id: str,
    run_status: str,
    result_dataset_id: str | None,
    source_id: str,
    source_version_at_run: str,
    current_source_version: str,
    graph_fingerprint: str,
    accepted_at: str | None = None,
):
    """
    Build a handoff record from an accepted processing run into Interpretation/QI.
    Stale when the retained source version drifted after the run.
    """
    require(run_status == "accepted", "Only accepted processing versions can hand off as independent seismic sources.")
    require(bool(result_dataset_id), "Acceptance must create an independent result dataset before handoff.")
    require(bool(run_id) and bool(source_id) and bool(graph_fingerprint), "Handoff requires run, source and graph identity.")
    stale = source_version_at_run != current_source_version
    return dict(
        kind="stratax-seismic-handoff/1",
        runId=run_id,
        resultDatasetId=result_dataset_id,
        sourceId=source_id,
        sourceVersionAtRun=source_version_at_run,
        currentSourceVersion=current_source_version,
        graphFingerprint=graph_fingerprint,
        acceptedAt=accepted_at,
        stale=stale,
        usableInInterpretation=not stale,
        message=(
            "Source changed after this accepted result. Keep it for comparison; re-run against the current source before new interpretation."
            if stale
            else "Accepted processing version is current relative to its retained source fingerprint."
        ),
    )


def mark_stale_resources(resources: list[dict], current_versions: dict[str, str]):
    """Annotate resource dicts with stale=True when bound source versions diverge."""
    require(isinstance(resources, list), "Provide a list of resource records.")
    require(isinstance(current_versions, dict), "Provide current sourceId→version map.")
    out = []
    for item in resources:
        require(isinstance(item, dict), "Each resource must be an object.")
        copy = dict(item)
        source_id = copy.get("sourceId") or copy.get("datasetId")
        bound = copy.get("sourceVersion")
        if source_id and bound is not None and source_id in current_versions:
            copy["stale"] = current_versions[source_id] != bound
        else:
            copy["stale"] = copy.get("stale", False)
        out.append(copy)
    return out
