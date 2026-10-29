"""Download/checksum helpers for programme reference candidates.

Stores fixtures under ignored .release/seismic-fixtures/. Does not close
acceptance cases by itself — record evidence bundles in SEISMIC_EVIDENCE.md.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / ".release" / "seismic-fixtures"

CANDIDATES = {
    "stratton-swath1": dict(
        url="https://s3.amazonaws.com/open.source.geoscience/open_data/stratton/segy/navmerged/swath_1_geometry.sgy",
        relative="stratton/swath_1_geometry.sgy",
        expected_sha256="3fa51c2609d3c2e000bd14827816976df7d0e6fdc0baaa409d1ce36f4b124808",
        kind="land-3d-raw",
        notes="Geometry-loaded Stratton swath; see SEISMIC_REFERENCES.md",
    ),
    "stratton-report": dict(
        url="https://s3.amazonaws.com/open.source.geoscience/open_data/stratton/stratton_acqui_proc.pdf",
        relative="stratton/stratton_acqui_proc.pdf",
        expected_bytes=1416031,
        kind="land-3d-report",
        notes="Acquisition/processing report",
    ),
    "mobil-viking-line12": dict(
        url="https://s3.amazonaws.com/open.source.geoscience/open_data/Mobil_Avo_Viking_Graben_Line_12/seismic.segy",
        relative="mobil_viking/seismic.segy",
        kind="marine-2d-raw-candidate",
        notes="Candidate Mobil Viking Graben Line 12; verify licence and amplitude history before acceptance.",
    ),
}


def sha256_file(path: Path, chunk=1024 * 1024):
    h = hashlib.sha256()
    with path.open("rb") as fh:
        while True:
            block = fh.read(chunk)
            if not block:
                break
            h.update(block)
    return h.hexdigest()


def fetch(name: str, force=False):
    if name not in CANDIDATES:
        raise SystemExit(f"Unknown candidate {name}. Choose from: {', '.join(CANDIDATES)}")
    meta = CANDIDATES[name]
    target = FIXTURES / meta["relative"]
    target.parent.mkdir(parents=True, exist_ok=True)
    receipt = target.with_suffix(target.suffix + ".receipt.json")
    if target.exists() and not force:
        digest = sha256_file(target)
        payload = dict(name=name, path=str(target), bytes=target.stat().st_size, sha256=digest, **{k: meta[k] for k in meta if k != "url"})
        if meta.get("expected_sha256") and digest != meta["expected_sha256"]:
            raise SystemExit(f"Checksum mismatch for existing {target}")
        receipt.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(payload, indent=2))
        return payload
    print(f"Downloading {meta['url']} -> {target}")
    urllib.request.urlretrieve(meta["url"], target)
    digest = sha256_file(target)
    if meta.get("expected_sha256") and digest != meta["expected_sha256"]:
        raise SystemExit(f"Checksum mismatch after download: {digest}")
    if meta.get("expected_bytes") and target.stat().st_size != meta["expected_bytes"]:
        raise SystemExit(f"Byte-length mismatch after download: {target.stat().st_size}")
    payload = dict(name=name, path=str(target), bytes=target.stat().st_size, sha256=digest, url=meta["url"],
                   **{k: meta[k] for k in meta if k not in ("url",)})
    receipt.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=2))
    return payload


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("name", nargs="?", help="Candidate key")
    parser.add_argument("--list", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args(argv)
    if args.list or not args.name:
        print(json.dumps({k: dict(kind=v["kind"], notes=v["notes"]) for k, v in CANDIDATES.items()}, indent=2))
        return 0
    fetch(args.name, force=args.force)
    return 0


if __name__ == "__main__":
    sys.exit(main())
