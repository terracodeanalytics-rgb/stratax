"""Build Cloud Run env pairs for a seismic Batch-enabled API candidate.

Reads .release/seismic-batch-profile.json. Prints gcloud-ready flags only.
Does not deploy or change traffic.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--profile",
        default=str(ROOT / ".release" / "seismic-batch-profile.json"),
    )
    args = parser.parse_args(argv)
    payload = json.loads(Path(args.profile).read_text(encoding="utf-8"))
    profile = payload["STRATAX_SEISMIC_BATCH_PROFILE"]
    # Compact JSON for Cloud Run env (PowerShell-safe when quoted as one arg).
    compact = json.dumps(profile, separators=(",", ":"), sort_keys=True)
    pairs = [
        f"STRATAX_SEISMIC_JOB={payload.get('STRATAX_SEISMIC_JOB', 'stratax-seismic-worker')}",
        f"STRATAX_SEISMIC_WORKER_ACCOUNT={payload.get('STRATAX_SEISMIC_WORKER_ACCOUNT', payload['STRATAX_SEISMIC_BATCH_ACCOUNT'])}",
        f"STRATAX_SEISMIC_BATCH_ACCOUNT={payload['STRATAX_SEISMIC_BATCH_ACCOUNT']}",
        f"STRATAX_SEISMIC_BATCH_REGION={payload['STRATAX_SEISMIC_BATCH_REGION']}",
        f"STRATAX_SEISMIC_MAX_CONCURRENT={payload['STRATAX_SEISMIC_MAX_CONCURRENT']}",
        f"STRATAX_SEISMIC_BATCH_PROFILE={compact}",
    ]
    print(",".join(pairs))
    print(
        "\n# Review, then update a ZERO-TRAFFIC candidate only, e.g.:\n"
        "# gcloud run services update stratax-api --project=project-9afac --region=us-central1 \\\n"
        "#   --update-env-vars=\"...quoted pairs...\" --no-traffic\n"
        "# On-demand Cloud Run Jobs + GCS only; do not enable min instances.\n"
        "# Do not submit paid job executions without a version-bound estimate approval.\n"
        "# Do not promote production until every acceptance case is closed.",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
