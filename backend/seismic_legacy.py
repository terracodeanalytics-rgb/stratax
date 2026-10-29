"""Legacy seismic shortcut / configuration remapping on explicit Cloud copy."""
from __future__ import annotations

from seismic_processing import require


def remap_references(config: dict, id_map: dict[str, str], sha_map: dict[str, str] | None = None):
    """
    Rewrite dataset/source identifiers after an explicit Local→Cloud copy.
    Unmapped references raise rather than silently dropping lineage.
    """
    require(isinstance(config, dict), "Provide a configuration object.")
    require(isinstance(id_map, dict) and id_map, "Provide the explicit source-id remapping from the Cloud copy.")
    sha_map = sha_map or {}
    out = dict(config)
    for key in ("datasetId", "sourceId", "baselineSourceId", "monitorSourceId"):
        if key in out and out[key] is not None:
            require(out[key] in id_map, f"Legacy reference {key}={out[key]} has no Cloud copy mapping.")
            out[key] = id_map[out[key]]
    if "sourceVersion" in out and out.get("datasetId") in sha_map:
        # Optional integrity: when the Cloud copy publishes a new content SHA, bind it.
        out["sourceVersion"] = sha_map[out["datasetId"]]
    if "nodes" in out and isinstance(out["nodes"], list):
        remapped = []
        for node in out["nodes"]:
            remapped.append(remap_references(node, id_map, sha_map) if isinstance(node, dict) else node)
        out["nodes"] = remapped
    return out


def migration_report(before: dict, after: dict):
    return dict(
        beforeKeys=sorted(before),
        afterKeys=sorted(after),
        limitations=["Only explicitly mapped identifiers were rewritten; scientific results were not recomputed."],
    )
