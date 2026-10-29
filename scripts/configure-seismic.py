"""Provision only the on-demand StrataX seismic Cloud Run job and scoped identity.

No Google Batch VMs, no min instances, no standby disks. Storage stays on GCS.
Does not submit paid job executions. Pass --apply to mutate Cloud resources;
default is a dry-run that writes the reviewed Cloud Run pricing profile JSON.
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT = "project-9afac"
REGION = "us-central1"
JOB = "stratax-seismic-worker"
WORKER = "stratax-seismic-worker@project-9afac.iam.gserviceaccount.com"
API = "stratax-auth-runtime@project-9afac.iam.gserviceaccount.com"
IMAGE_PREFIX = "us-central1-docker.pkg.dev/project-9afac/stratax/stratax-seismic-worker@"
RAW = "project-9afac-stratax-raw"
DERIVED = "project-9afac-stratax-derived"
GCLOUD = shutil.which("gcloud.cmd") or shutil.which("gcloud")

# On-demand Cloud Run Jobs sketch (us-central1 list-price order of magnitude).
DEFAULT_PROFILE = dict(
    cpu=4,
    memoryMib=16384,
    maxSeconds=1800,
    # Placeholders replaced by CLI rates before approval.
    vcpuSecondUsd=None,
    memoryGibSecondUsd=None,
    priceAsOf=None,
    priceSource=None,
    provider="cloud-run-jobs",
    minInstances=0,
    standby=False,
)


def run(*args, allow_missing=False, dry_run=False):
    if dry_run:
        print("DRY-RUN gcloud", " ".join(args))
        return ""
    if not GCLOUD:
        raise RuntimeError("gcloud is not available on PATH.")
    result = subprocess.run([GCLOUD, *args], capture_output=True, text=True)
    if result.returncode:
        if allow_missing and ("NOT_FOUND" in result.stderr or "Cannot find" in result.stderr):
            return None
        raise RuntimeError(result.stderr or result.stdout)
    return result.stdout


def digest_ok(image: str) -> bool:
    return bool(re.search(r"^" + re.escape(IMAGE_PREFIX) + r"sha256:[a-f0-9]{64}$", image))


def build_profile(image: str, rates: dict) -> dict:
    profile = dict(DEFAULT_PROFILE)
    profile["image"] = image
    profile.update(rates)
    required = (
        "image",
        "cpu",
        "memoryMib",
        "maxSeconds",
        "vcpuSecondUsd",
        "memoryGibSecondUsd",
        "priceAsOf",
        "priceSource",
    )
    missing = [k for k in required if profile.get(k) in (None, "", [])]
    if missing:
        raise ValueError("Incomplete pricing profile; supply " + ", ".join(missing))
    if not digest_ok(image):
        raise ValueError("Use an immutable stratax-seismic-worker digest tag (@sha256:…).")
    for name in ("cpu", "memoryMib", "maxSeconds"):
        if type(profile[name]) is not int or profile[name] <= 0:
            raise ValueError(f"{name} must be a positive integer.")
    for name in ("vcpuSecondUsd", "memoryGibSecondUsd"):
        if type(profile[name]) not in (int, float) or profile[name] < 0:
            raise ValueError(f"{name} must be a finite nonnegative reviewed rate.")
    profile["minInstances"] = 0
    profile["standby"] = False
    profile["provider"] = "cloud-run-jobs"
    return profile


def write_env_snippet(profile: dict, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "STRATAX_SEISMIC_JOB": JOB,
        "STRATAX_SEISMIC_WORKER_ACCOUNT": WORKER,
        "STRATAX_SEISMIC_REGION": REGION,
        "STRATAX_SEISMIC_MAX_CONCURRENT": "2",
        "STRATAX_SEISMIC_BATCH_ACCOUNT": WORKER,  # compatibility alias used by current API env checks
        "STRATAX_SEISMIC_BATCH_REGION": REGION,
        "STRATAX_SEISMIC_BATCH_PROFILE": profile,
        "limitations": [
            "On-demand Cloud Run Jobs only; min instances stay zero.",
            "Artifacts and originals remain on GCS; no standby disks or reserved VMs.",
            "Do not dispatch paid executions without a version-bound estimate and explicit approval.",
        ],
    }
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return path


def apply_job(image: str, dry_run: bool):
    if run("iam", "service-accounts", "describe", WORKER, "--project", PROJECT, allow_missing=True, dry_run=dry_run) is None:
        run(
            "iam",
            "service-accounts",
            "create",
            "stratax-seismic-worker",
            "--project",
            PROJECT,
            "--display-name=StrataX seismic Cloud Run worker",
            dry_run=dry_run,
        )
    run(
        "projects",
        "add-iam-policy-binding",
        PROJECT,
        "--member=serviceAccount:" + WORKER,
        "--role=roles/datastore.user",
        "--condition=None",
        "--quiet",
        dry_run=dry_run,
    )
    for bucket, role in ((RAW, "roles/storage.objectViewer"), (DERIVED, "roles/storage.objectUser")):
        run(
            "storage",
            "buckets",
            "add-iam-policy-binding",
            "gs://" + bucket,
            "--member=serviceAccount:" + WORKER,
            "--role=" + role,
            dry_run=dry_run,
        )
    exists = run("run", "jobs", "describe", JOB, "--project", PROJECT, "--region=" + REGION, allow_missing=True, dry_run=dry_run)
    command = "deploy" if exists is None else "update"
    flags = [
        "--project",
        PROJECT,
        "--region=" + REGION,
        "--image=" + image,
        "--service-account=" + WORKER,
        "--cpu=4",
        "--memory=16Gi",
        "--tasks=1",
        "--parallelism=1",
        "--max-retries=0",
        "--task-timeout=1800s",
        "--set-env-vars=GOOGLE_CLOUD_PROJECT=project-9afac,STRATAX_PROJECT_BUCKET=project-9afac-stratax-raw,STRATAX_DERIVED_BUCKET=project-9afac-stratax-derived",
    ]
    if exists is None:
        flags += [
            "--add-volume=name=raw,type=cloud-storage,bucket=project-9afac-stratax-raw,readonly=true",
            "--add-volume-mount=volume=raw,mount-path=/raw",
            "--add-volume=name=derived,type=cloud-storage,bucket=project-9afac-stratax-derived",
            "--add-volume-mount=volume=derived,mount-path=/derived",
        ]
    run("run", "jobs", command, JOB, *flags, "--quiet", dry_run=dry_run)
    for role in ("roles/run.jobsExecutorWithOverrides", "roles/run.viewer"):
        run(
            "run",
            "jobs",
            "add-iam-policy-binding",
            JOB,
            "--project",
            PROJECT,
            "--region=" + REGION,
            "--member=serviceAccount:" + API,
            "--role=" + role,
            dry_run=dry_run,
        )


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", required=True, help="Immutable stratax-seismic-worker@sha256:… digest")
    parser.add_argument("--vcpu-second-usd", type=float, required=True, help="Reviewed Cloud Run vCPU-second USD")
    parser.add_argument("--memory-gib-second-usd", type=float, required=True, help="Reviewed Cloud Run GiB-second USD")
    parser.add_argument("--price-source", required=True, help="URL or calculator export identifying the rates")
    parser.add_argument("--price-as-of", default=date.today().isoformat(), help="ISO date of the pricing review")
    parser.add_argument("--apply", action="store_true", help="Create/update Cloud Run job + IAM (default: dry-run)")
    parser.add_argument(
        "--write-profile",
        default=str(ROOT / ".release" / "seismic-batch-profile.json"),
        help="Where to write the reviewed env profile JSON",
    )
    args = parser.parse_args(argv)

    rates = dict(
        vcpuSecondUsd=args.vcpu_second_usd,
        memoryGibSecondUsd=args.memory_gib_second_usd,
        priceAsOf=args.price_as_of,
        priceSource=args.price_source,
    )
    profile = build_profile(args.image, rates)
    out_path = Path(args.write_profile)
    if not out_path.is_absolute():
        out_path = ROOT / out_path
    out = write_env_snippet(profile, out_path)
    print(json.dumps(profile, indent=2))
    print("Wrote reviewed Cloud Run profile snippet to", out.resolve())

    dry_run = not args.apply
    if dry_run:
        print("Dry-run only. Re-run with --apply after reviewing the profile and IAM/job changes.")
    apply_job(args.image, dry_run=dry_run)
    if not dry_run:
        print(
            "Configured on-demand seismic Cloud Run job, worker identity and scoped grants.",
            "Set STRATAX_SEISMIC_* on an API candidate from",
            str(out.resolve()),
            "No job execution was submitted. Min instances remain zero.",
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
