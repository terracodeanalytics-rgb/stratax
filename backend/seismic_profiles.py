"""Reviewed on-demand Cloud Run Jobs / acoustic resource profiles (M0.08 / M0.09).

No standby capacity: min instances stay zero; artifacts live on GCS.
"""
from __future__ import annotations

import json
import math
import os
import re
from typing import Any


PREVIEW_PROFILE_ID = "analytical-preview"
FIELD_PROFILE_ID = "field-scale"
ACOUSTIC_CPU_PROFILE_ID = "acoustic-cpu"
ACOUSTIC_MPI_PROFILE_ID = "acoustic-mpi"
ACOUSTIC_OPENACC_PROFILE_ID = "acoustic-openacc"

IMAGE_DIGEST = re.compile(r"@sha256:[a-f0-9]{64}$")

REQUIRED_JOB_KEYS = (
    "image",
    "cpu",
    "memoryMib",
    "maxSeconds",
    "vcpuSecondUsd",
    "memoryGibSecondUsd",
    "priceAsOf",
    "priceSource",
)


def load_batch_profile(env: dict | None = None) -> dict | None:
    """Compatibility name: profile is the Cloud Run Jobs pricing/resource document."""
    env = os.environ if env is None else env
    raw = env.get("STRATAX_SEISMIC_BATCH_PROFILE", "")
    if not raw:
        return None
    try:
        value = json.loads(raw)
    except (TypeError, ValueError):
        return None
    return value if isinstance(value, dict) else None


def validate_batch_profile(profile: dict[str, Any], *, require_account=True, env: dict | None = None) -> dict:
    env = os.environ if env is None else env
    if not isinstance(profile, dict):
        raise ValueError("The seismic Cloud Run profile must be a reviewed JSON object.")
    missing = [k for k in REQUIRED_JOB_KEYS if k not in profile]
    if missing:
        raise ValueError("Incomplete Cloud Run profile; missing " + ", ".join(missing))
    if not IMAGE_DIGEST.search(str(profile.get("image", ""))):
        raise ValueError("Worker image must be an immutable digest (@sha256:…).")
    for name in ("cpu", "memoryMib", "maxSeconds"):
        if type(profile[name]) is not int or profile[name] <= 0:
            raise ValueError(f"{name} must be a positive integer.")
    for name in ("vcpuSecondUsd", "memoryGibSecondUsd"):
        value = profile[name]
        if type(value) not in (int, float) or not math.isfinite(value) or value < 0:
            raise ValueError(f"{name} must be a finite nonnegative reviewed rate.")
    if not str(profile.get("priceAsOf", "")).strip() or not str(profile.get("priceSource", "")).strip():
        raise ValueError("Record priceAsOf and priceSource for the reviewed rates.")
    if profile.get("minInstances", 0) not in (0, None):
        raise ValueError("Seismic workers must not reserve standby capacity; minInstances must be 0.")
    if require_account and not (
        env.get("STRATAX_SEISMIC_BATCH_ACCOUNT") or env.get("STRATAX_SEISMIC_WORKER_ACCOUNT")
    ):
        raise ValueError("STRATAX_SEISMIC_WORKER_ACCOUNT must identify the commissioned worker identity.")
    return {k: profile[k] for k in REQUIRED_JOB_KEYS} | dict(
        provider="cloud-run-jobs",
        minInstances=0,
        standby=False,
    )


def estimate_ceiling_usd(profile: dict) -> float:
    profile = validate_batch_profile(profile, require_account=False)
    seconds = profile["maxSeconds"]
    compute = (
        profile["cpu"] * profile["vcpuSecondUsd"]
        + (profile["memoryMib"] / 1024) * profile["memoryGibSecondUsd"]
    ) * seconds
    return math.ceil(compute * 10000) / 10000


def matches_job_resources(template, profile):
    """Dispatch must match the resources approved, not merely the container digest."""
    containers=template.get('containers',[])
    if len(containers)!=1 or containers[0].get('image')!=profile['image']:
        return False
    limits=containers[0].get('resources',{}).get('limits',{})
    def quantity(value):
        value=str(value)
        for suffix,factor in (('Gi',1024**3),('Mi',1024**2),('Ki',1024),('G',10**9),('M',10**6),('m',.001)):
            if value.endswith(suffix):return float(value[:-len(suffix)])*factor
        return float(value)
    try:
        return (quantity(limits['cpu'])==profile['cpu'] and quantity(limits['memory'])==profile['memoryMib']*1024**2
                and int(template.get('maxRetries',0))==0)
    except (KeyError,TypeError,ValueError):
        return False


def profile_catalog():
    return [
        dict(
            id=PREVIEW_PROFILE_ID,
            kind="cloud-run-jobs",
            maximumCells=2_000_000,
            fieldScaleQualified=False,
            minInstances=0,
            description="Bounded analytical preview on an on-demand Cloud Run Job; GCS artifacts only.",
        ),
        dict(
            id=FIELD_PROFILE_ID,
            kind="cloud-run-jobs",
            maximumCells=None,
            fieldScaleQualified=False,
            minInstances=0,
            description="Field-scale Cloud Run Job profile; separately commissioned image/pricing required.",
            commissioned=False,
        ),
        dict(
            id=ACOUSTIC_CPU_PROFILE_ID,
            kind="acoustic",
            description="Pinned Linux GCC CPU acoustic adapter; small-fixture qualified only until field benchmarks close.",
            mpi=False,
            openacc=False,
            minInstances=0,
        ),
        dict(
            id=ACOUSTIC_MPI_PROFILE_ID,
            kind="acoustic",
            description="CPU/MPI acoustic profile; pending separate qualification.",
            mpi=True,
            openacc=False,
            commissioned=False,
            minInstances=0,
        ),
        dict(
            id=ACOUSTIC_OPENACC_PROFILE_ID,
            kind="acoustic",
            description="NVIDIA nvc/OpenACC profile without DevitoPRO; pending separate qualification.",
            mpi=False,
            openacc=True,
            commissioned=False,
            minInstances=0,
        ),
    ]


def batch_available(env: dict | None = None) -> bool:
    env = os.environ if env is None else env
    try:
        profile = load_batch_profile(env)
        if not profile:
            return False
        validate_batch_profile(profile, env=env)
        return True
    except ValueError:
        return False
