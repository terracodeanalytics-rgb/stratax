# Seismic evidence bundles

This file defines the evidence template used to close cases in [SEISMIC_ACCEPTANCE.md](SEISMIC_ACCEPTANCE.md).
A foundation, unit test or registry entry does **not** close a case. Only a completed bundle below does.

## Bundle template (copy per case ID)

```text
Case: M?.??
Status: open | accepted
Date:
Operator / command:
Source version / SHA-256:
Geometry revision:
Software / container digests:
Fixture path (outside user workspaces):
Dimensions / precision:
Hardware:
Runtime seconds:
Peak memory bytes:
Ownership / access checks:
Independent comparison method:
Limitations:
Estimate / approval IDs (paid runs only):
Report path under .release/seismic-evidence/:
```

## Checkpoint rules

1. [SEISMIC_ACCEPTANCE.md](SEISMIC_ACCEPTANCE.md) is the only closure authority.
2. Living docs ([STATUS.md](STATUS.md), [CONTEXT.md](CONTEXT.md), [HANDOFF.md](HANDOFF.md), [SEISMIC_PROGRAMME.md](SEISMIC_PROGRAMME.md)) may describe foundations; they must not mark a milestone accepted until every case in that milestone has an accepted bundle.
3. Evidence lives under ignored `.release/seismic-evidence/{case-id}/`. Never commit source arrays, field SEGY, or secrets.
4. Paid Batch / capacity / NLOG fee runs require a version-bound estimate JSON and an explicit approval record before dispatch.
5. Tolerances stay at the programme baseline; do not loosen them after failure.
6. Production traffic moves only after M9.15–17 evidence is accepted.

## Programme control artefacts

| Artefact | Path | Purpose |
| --- | --- | --- |
| Commissioning script | [scripts/configure-seismic.py](scripts/configure-seismic.py) | IAM + reviewed Batch pricing profile (no job submit) |
| Resource contracts | [backend/seismic_resources.py](backend/seismic_resources.py) | Survey / gather / angle / velocity / model types |
| Pricing helpers | [backend/seismic_profiles.py](backend/seismic_profiles.py) | Profile validation shared with API/runtime |
| Reference notes | [SEISMIC_REFERENCES.md](SEISMIC_REFERENCES.md) | Qualified field fixtures outside workspaces |

## Session receipts (not acceptance)

| Date | Artefact | Notes |
| --- | --- | --- |
| 2026-10-29 | Stratton swath SHA re-verify | `3fa51c2609d3c2e000bd14827816976df7d0e6fdc0baaa409d1ce36f4b124808` |
| 2026-10-29 | Mobil Line 12 download | 749,552,400 B; SHA `64cbb49796b940717c57cddf5c7e0130b56df7061009a770565bdd0978cfccf3`; licence/geometry still open |
| 2026-10-29 | Cloud Run Jobs path | Seismic dispatch uses on-demand `stratax-seismic-worker` Cloud Run Job + GCS; minInstances=0; no Batch VMs/standby disks |
| 2026-10-29 | Capacity estimate draft | `.release/seismic-capacity-estimate.json` — **750 job-hours** @ 4 vCPU/16 GiB (~**USD 367** compute / ~**USD 225**/mo GCS); **approvalRequired**; no dispatch/promote |
| 2026-10-29 | Backend suite | 181 passed / 4 acoustic skips |
| 2026-10-29 | Loopback seismic UI | `verify-seismic-ui.cjs --cloud-processing` (see STATUS) |

## Accepted bundles

None. All M0–M9 cases remain open until individual bundles are recorded here and the acceptance ledger rows are updated.
