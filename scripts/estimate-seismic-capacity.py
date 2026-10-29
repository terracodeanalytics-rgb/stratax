"""Produce version-bound cost/storage estimates for M9.10–14 capacity gates.

On-demand Cloud Run Jobs + GCS only. No standby VMs, min instances, or reserved disks.
Does not dispatch jobs. Print an estimate JSON for explicit approval before paid runs.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from datetime import date

# Cloud Run Jobs us-central1 list-price order of magnitude; re-check before approval.
DEFAULT_VCPU_SECOND = 0.00002400
DEFAULT_MEMORY_GIB_SECOND = 0.00000250
DEFAULT_STORAGE_GIB_MONTH = 0.020  # GCS Standard
DEFAULT_CPU = 4
DEFAULT_MEMORY_GIB = 16
DEFAULT_JOB_HOURS = 750  # multi-pass 1 TiB + 10 TiB index/verify/restart sketch


def estimate(volume_tib, prestack_tib, cpu, memory_gib, job_hours, vcpu_second_usd, memory_gib_second_usd, storage_gib_month_usd):
    volume_bytes = int(volume_tib * 1024 ** 4)
    prestack_bytes = int(prestack_tib * 1024 ** 4)
    seconds = job_hours * 3600
    compute = (cpu * vcpu_second_usd + memory_gib * memory_gib_second_usd) * seconds
    storage_month = (volume_tib + prestack_tib) * 1024 * storage_gib_month_usd
    return dict(
        kind="stratax-seismic-capacity-estimate/1",
        asOf=date.today().isoformat(),
        provider="cloud-run-jobs+gcs",
        targets=dict(volumeIndexingViewingTiB=volume_tib, aggregatePrestackTiB=prestack_tib,
                     volumeBytes=volume_bytes, prestackBytes=prestack_bytes),
        resources=dict(
            cpu=cpu,
            memoryGib=memory_gib,
            jobHours=job_hours,
            vcpuSecondUsd=vcpu_second_usd,
            memoryGibSecondUsd=memory_gib_second_usd,
            storageGibMonthUsd=storage_gib_month_usd,
            minInstances=0,
            standby=False,
            persistentCompute=False,
        ),
        basis=dict(
            effectiveThroughputMiBpsSketch=40,
            passesSketch="checksum+index+analytical+pyramid+verify+interrupt/restart",
            contingency="~2× single-stream read time over 11 TiB aggregate",
            storage="GCS only; no standby disks",
        ),
        estimatedComputeUsd=math.ceil(compute * 100) / 100,
        estimatedMonthlyStorageUsd=math.ceil(storage_month * 100) / 100,
        approvalRequired=True,
        limitations=[
            "Estimate only; excludes egress and operator time.",
            "On-demand Cloud Run Jobs (scale to zero) + GCS; no reserved/standby compute.",
            "Do not dispatch until an explicit approval ID is recorded in SEISMIC_EVIDENCE.md.",
            "Do not promote production until every SEISMIC_ACCEPTANCE.md case is closed.",
        ],
    )


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--volume-tib", type=float, default=1.0)
    p.add_argument("--prestack-tib", type=float, default=10.0)
    p.add_argument("--cpu", type=int, default=DEFAULT_CPU)
    p.add_argument("--memory-gib", type=float, default=DEFAULT_MEMORY_GIB)
    p.add_argument("--job-hours", type=float, default=DEFAULT_JOB_HOURS)
    p.add_argument("--vcpu-second-usd", type=float, default=DEFAULT_VCPU_SECOND)
    p.add_argument("--memory-gib-second-usd", type=float, default=DEFAULT_MEMORY_GIB_SECOND)
    p.add_argument("--storage-gib-month-usd", type=float, default=DEFAULT_STORAGE_GIB_MONTH)
    args = p.parse_args(argv)
    print(json.dumps(estimate(args.volume_tib, args.prestack_tib, args.cpu, args.memory_gib, args.job_hours,
                              args.vcpu_second_usd, args.memory_gib_second_usd, args.storage_gib_month_usd), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
