# Seismic jobs and replacement Site — 2026-10-29

## Scope and verification policy

User authorised items 1–5 (job connections, workspaces, remaining processing,
submission fix and deployment) and explicitly forbade tests for now. No pytest,
browser checks, scientific fixture execution or application calculation was run.
Only compilation, JavaScript parsing, source review, packaging and platform
deployment/readiness metadata were used. Deployment does not establish correctness.

This delivery does **not complete all five items**. It implements bounded tool
jobs and workbook controls, fixes the recorded adapter mismatch, and deploys the
new Site/API/worker combination. The full workspaces and large/distributed/MPI/GPU
work remain incomplete as detailed below.

## New owner-private Site

The previous Site is inaccessible through the selected Sites connection. The user
explicitly requested a new Site rather than changing or deleting the old one.

- New project: `appgprj_6ae37700e488819196b149dee2c6053f`.
- URL: https://stratax-seismic-workbench.neonwhale8.chatgpt.site
- Pushed source: `50841428b30536653d5f63c580769937f5311c15`.
- Saved version: `appgprj_6ae37700e488819196b149dee2c6053f~appgver_8a0c01c6c63081918072e6f1731cf1ba`.
- Successful deployment: `appgdep_6ae37a1a1b4481919d0689bac2f64f2c`.
- Existing Site, its source checkout and audience retained. New Site remains private.
- Firebase authorised domains and the StrataX Maps key referrers were extended
  additively for the new origin; existing domains/referrers/API restrictions retained.
- API configuration retains the original origin as an additional allowed Site;
  the new origin becomes the account-link continuation. No password, email provider,
  user record, database, project quota or petrophysics worker limit changed.
- Cloud records use the same authenticated Firebase UID/project scopes. Browser-local
  state and folder permissions are origin-specific and remain at the old origin;
  they were not copied/uploaded automatically.

## Job implementation

`seismic_tool_jobs.py` extends the existing owner-scoped project/run collections.
Tool input arrays go into private immutable GCS JSON artifacts, not Firestore.
Estimates bind parameter checksum, selected activated dataset versions, engine
version, immutable worker image, resource/time ceiling and output reservation.
Input artifacts are counted against existing project storage. Changed sources,
expired quotations and mismatched approval/idempotency keys block dispatch.

Submission reserves the shared runtime capacity and existing storage quota before
Cloud Run dispatch. One run per owner and two globally are the current caps; jobs
have one task, zero retries and a hard timeout. On uncertain scheduling, automatic
resubmission is suppressed to avoid duplicate compute charges. Worker claims and
artifact commits prevent duplicate scientific writes.

`seismic_tool_worker.py` executes existing bounded tool handlers, or the acoustic
dispatcher, then stores a checksummed NPZ result. Acoustic checkpoint hooks publish
private checkpoints; restart admission checks identical tool parameters, source
versions and resources. Saved NPZ restoration disables pickle and bounds expanded
size. Cancellation uses existing seismic cancellation/status settlement paths.

Owner-scoped result endpoints provide bounded preview metadata and short-lived
private signed downloads. Review preserves a scienceReview plus an independent
accepted `seismicResources` engine-result reference. These generic resources are
not yet the complete typed geological/interpretation downstream workflow.

Workbook controls now retain independent names/settings/source selections/run
references, provide bounded source-section loading, estimates/approval, job polling,
cancellation, history, private downloads, comparison preview and review. Arrays loaded
from source sections remain transient. Request parameters are still advanced JSON;
this is **not** the final fully graphical well-tie/QI/model/4D workbook experience.

## Recorded 503 diagnosis and scheduling repair

The loopback adapter in `serve-seismic-fixture.py` still required `params` and parsed
Google Batch `taskGroups`, while production code now posts Cloud Run `overrides`.
The mismatch raised a Python exception and returned the generic503. The adapter now
reads Cloud Run container environment overrides and returns an operation descriptor.
It was not rerun because tests are deferred.

The live API also lacked seismic profile configuration. The deployment now installs
the pinned profiles. Run status distinguishes operation completion (execution creation)
from actual execution completion. API dispatch claims suppress concurrent duplicate
scheduling; an ambiguous network response is held for reconciliation instead of
automatically launching another potentially chargeable execution.

## Cost/resource configuration

CPU-first Cloud Run Jobs; no idle worker services, minimum instances or standby disks.
No actual job executions were submitted by this delivery.

| Runtime | CPU | Memory | Timeout | Retry count |
| --- | --- | --- | --- | --- |
| Bounded seismic | 2 | 4 GiB | 600s | 0 |
| Models/quantitative | 4 | 16 GiB | 1800s | 0 |
| Acoustic | 4 | 16 GiB | 1800s | 0 |

Reviewed us-central1 on-demand Jobs rates: CPU $0.000018/vCPU-second and memory
$0.000002/GiB-second, from https://cloud.google.com/run/pricing on2026-10-29.
These are rate assumptions, not actual billed usage; storage, transfer, free-tier
effects and billing delays remain separate. Every submission requires explicit
review of its concrete ceiling. Persistent originals, artifacts and registry images
still incur applicable storage costs.

Workers use shared existing StrataX-only identity/raw/derived permissions and
job-scoped API execution grants. The deployment script provisions configurations
only and never calls job `:run`. API keeps zero minimum/two maximum instances.

## Image provenance

| Runtime | Build | Digest |
| --- | --- | --- |
| API | `cf81126b-f14a-499e-b7ad-7ba68e258105` | `sha256:81c210588ffb3e1e5ef0e25fdceb3e2e4e6ead4e2a1e4a258195d2624ae604d9` |
| Seismic | `5279d892-7a10-4592-bea3-ed686f8e00b0` | `sha256:e5c3343801819778ce9d1b97bb2069aeaa9b255843d5a97447f16994144b287a` |
| Models | `84965632-ecc0-457b-a4a7-dd50005cb363` | `sha256:6fa336d184cc1f9f3243c07e3563594de0c01aff22007ee7f08b05e9945bf6d7` |
| Acoustic | `ab324e98-1e56-4970-a63b-1b9b3c5e33d4` | `sha256:44073b26d40a347f12824aabf54ef439f64917708b0b7b17195e10ce9c332e5e` |

All builds disable data tests. The final API includes the additional source-family
correction for well logs/model evidence; workers use the same tool execution code.
The API is `stratax-api-00024-diw`, deployed as a ready zero-traffic candidate then
promoted using Cloud Run traffic metadata. Revision22 remains a tagged rollback.
Deployment initially encountered Windows shell parsing of pipe-delimited environment
arguments. Replaced with a structured ignored flags file and resumed API-only deploy,
preserving the already installed worker configurations and existing secret values.

Cleanup reviewed **47 scoped images, all tagged/protected, zero untagged**, and
deleted zero images. No disposable local session files were identified; original
assets, both Site checkouts, source archives, dependency runtimes and recovery
evidence remain retained. No data or browser tests were run.

## Remaining work

1. Complete source-driven graphical calibration/QI/geological/4D workbooks, including
   full linked views and typed downstream selection. Current advanced engine books
   do not satisfy all interaction requirements.
2. Actual distributed field-scale analytical indexing/storage/pyramids/processing,
   globally coupled decomposition, MPI/OpenACC/GPU profiles. Current jobs remain
   explicitly bounded single-task CPU calculations; no 1TiB/10TiB claim.
3. Remaining field-grade processing/model-conversion limitations from
   SEISMIC_ENGINES_V2.md; their scientific/operational qualification is not removed
   by successful packaging or deployment.
4. Frontend/application verification and fixing observed failures once the user
   authorises tests. The503 adapter correction, new job paths, new-origin login,
   source reads, result previews/review/downloads, cancellation/restart and ownership
   all need that later pass. Full M0–M9 acceptance stays open.
