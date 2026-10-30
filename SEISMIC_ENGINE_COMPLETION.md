# Sequential seismic backend completion

Implementation started 2026-10-30 from `c7a5c6b4b072a2ce2e9bc8e0f55e23f06f42de74`.

User constraints: Google Cloud, cost-efficient execution, backend only, no UI
changes/enabling, deployment, provisioning, paid jobs, tests or benchmarks.
Source parsing and static review are permitted. The earlier inventory remains
historical; no runtime/scientific qualification is inferred from this ledger.

## Ledger

| Order | Engine | Current source status |
|---:|---|---|
|1|Cloud index|Implemented locally; syntax/static review; tests/deployment pending|
|2|Slices|Implemented locally; source/interface review; tests/deployment pending|
|3|Well ties|Implemented locally; source/interface review; tests/deployment pending|
|4|Velocity|In progress; draft integral functions, not wired or closed|
|5|Travel times|Not started in this completion pass|
|6|Regularisation|Not started in this completion pass|
|7|Surface statics|Not started in this completion pass|
|8|Attributes|Not started in this completion pass|
|9|Surfaces|Not started in this completion pass|
|10|Geostatistics|Not started in this completion pass|
|11|Models|Not started in this completion pass|
|12|Kirchhoff|Not started in this completion pass|
|13|SRME prediction|Not started in this completion pass|
|14|AVO / inversion|Not started in this completion pass|
|15|4D|Not started in this completion pass|
|16|Acoustic RTM / FWI|Not started in this completion pass|

Do not mark all16 complete or move past an unfinished engine. No new source has
been deployed. Existing API28 and frontend remain unchanged.

## Engine1: Cloud indexing and required common infrastructure

- Existing tool-estimate/run/review routes retain identity, ownership and bounded
  Cloud Run Jobs. An optional typed `execution` requests a separately configured
  Google Batch field profile; no environment/profile/resource was provisioned.
- `STRATAX_SEISMIC_FIELD_PROFILES` contains server-reviewed profiles keyed by
  `profileId`. `STRATAX_SEISMIC_STORAGE_POLICY.maximumBytes` is explicit, separate
  from existing petrophysics limits. Missing configuration rejects admission.
- Field profiles bind image digest, service account, region/machine/resources,
  Spot/standard policy, attempts/runtime/concurrency, scratch/output, actual bucket
  locations, dated pricing and separate compute/storage/operations/transfer/
  retrieval/Firestore/log/control-plane cost assumptions. Rates have no invented
  zero defaults. Independent indexing is CPU/Spot with at most one infrastructure
  retry; no standard/GPU fallback. Existing bounded jobs remain zero-retry.
- Native locators reuse compatible retained headers; otherwise scan actual SEG-Y/
  SU headers with bounded pages and persistent cursors. Native sampling/scalars,
  original generation, ragged lengths/origins, duplicate bins and unknown geometry
  remain explicit. Directory nodes carry header bounds, not inferred grids/CRS.
- Header and analytical phases use separate deterministic Batch job IDs. Native
  construction commits before analytical task allocation; active runs share the
  existing global/owner/project admission. Large partition counts are grouped
  arithmetically into bounded Batch task counts without building giant task lists.
- Zarr v3 lossless ragged arrays and labelled display pyramids use shard-sized
  buffered writes. GCS object generation preconditions and hashes make publication
  immutable/retry-safe. Partition directories are hierarchical, fanout256, rather
  than one metadata list proportional to survey size.
- Range reads use checksummed256KiB blocks, pinned generations, bounded caches and
  the installed Zarr3.1.3 store protocol. A selected chunk no longer requires
  downloading every array/display object in its partition.
- Checkpoints include native page provenance and completed analytical partitions.
  Canonical partition references survive failed/restarted runs without copying
  amplitudes. Identical already accepted indexes return accepted metadata aliases
  without starting compute; original artifacts and provenance remain referenced.
- Provider status/cancellation is reconciled through the existing run API. Unknown
  scheduling/shutdown retains capacity/storage reservations. Successful cancellation
  requires provider confirmation; budget alerts are not treated as hard stops.
- Final results, native directories and headers are private immutable manifests.
  Review produces typed accepted resources; indexed downstream bindings support
  JSON manifests alongside legacy NPZ outputs. Header queries and trace selections
  preserve duplicates and missing support.

Main source: `backend/seismic_field_profiles.py`, `seismic_field_admission.py`,
`seismic_field_worker.py`, `seismic_field_artifacts.py`, `seismic_native_directory.py`,
`seismic_artifact_ranges.py`; extended existing tool/run/index/source APIs.

## Engine2: indexed and physical slices

- Existing bounded array methods retained. Added admitted accepted-index bindings
  `indexed-traces` and `indexed-volume`, attached as the `view` input for `slice`.
- Explicit trace IDs preserve ragged sampling in2D line output. 3D selections use
  reviewed native bin/header roles, original sample support, resolved duplicates,
  projected coordinates and matching source/geometry versions.
- Added `kind=indexed` with inline/crossline/time/depth/arbitrary/linked views and
  `kind=physical` with explicit SI spatial/sample axes, sample/reference datum and
  coordinate frames. Physical depth views require a declared depth-axis source;
  native time headers are not silently relabelled depth.
- Arbitrary physical sections use explicit nearest or piecewise-linear interpolation,
  reviewed metre support limits, contributing bins/weights and validity masks.
  Native axes with incompatible intervals/origins require explicit alignment.
- Bounded reads/outputs remain at most512 traces/bins and two million samples;
  requests operate against large indexed sources without whole-survey allocation.
- Results use existing private job artifacts, previews, review and resource bindings.

Main source: `backend/seismic_indexed_views.py`, `seismic_physical_slices.py` and
extended `seismic_tools_api.py` / `seismic_source_io.py` / `seismic_tool_jobs.py`.

## Evidence and deferred work

Only Python AST parsing, source inspection and whitespace checks have run. No
engine module was imported for a calculation, and no fixtures/tests/browser/cloud
jobs/builds/deployments were executed in this pass.

Before any later paid run, configure reviewed source-built image/profile/pricing,
storage policy and IAM through an independently authorised deployment. Current
definitions do not establish lowest measured cost, numerical correctness, throughput
or1TiB/10TiB capacity acceptance. All verification remains pending.

Research used during implementation:
- [Google Batch retry policy](https://docs.cloud.google.com/batch/docs/automate-task-retries)
  supports a single policy with explicit infrastructure exit codes; unspecified
  scientific failures must not receive automatic retries.
- [Google Batch reserved failures](https://docs.cloud.google.com/batch/docs/troubleshooting)
  distinguishes Spot preemption50001 from runtime exhaustion50005.
- [Zarr3.1.3 storage protocol](https://zarr.readthedocs.io/en/v3.1.3/api/zarr/storage/index.html)
  and locally inspected installed source define range requests/async store behavior.
- [Zarr sharding specification](https://zarr-specs.readthedocs.io/en/latest/v3/codecs/sharding-indexed/index.html)
  supports independently accessed compressed inner chunks.

No dependencies were added for this work; existing pinned scientific/GCS/Zarr
packages and notices are retained. Do not change the UI availability checklist
until the user authorises that separate work.

## Engine2: Slices

- Bounded analytical bindings cover ragged2D traces, reviewed physical2D lines and
  reviewed3D poststack bins. Duplicate resolution is explicit; unstacked gathers
  are never inferred to be cubes. SI axes, datum/CRS, source and geometry revisions
  accompany results. Nonaligned ragged axes remain ragged until explicitly aligned.
- Inline, crossline, time/depth, arbitrary and linked views preserve masks and
  actual coordinates. Interpolation is explicit, distance-limited and records
  support. A curved2D line follows its ordered segments rather than a triangulated
  plane. Existing small-array adapters remain available.
- Existing reviewed job, cancellation, persistence, accepted-result binding and
  immutable NPZ/JSON export paths are retained. The field header-query route
  supports paged trace selection without loading a survey.

## Engine3: Well ties

- Conventional isotropic TVD sonic/checkshot calibration honours supplied anchors
  exactly, preserves original logs and rejects unsupported gaps or invalid velocity
  intervals. MD logs use the actual monotonic-TVD trajectory and reviewed datum.
  Constrained PCHIP time edits check derivative extrema and checkshot residuals.
- Paired physical/time sampling extracts deviated-well composites from reviewed2D
  lines or3D volumes. Geometry stencils are reused; no full section per well sample.
  Composite checkpoints retain completed samples and restart with identical pinned
  source, settings and worker resources. Bounded operations otherwise restart
  atomically; no automatic retry or parameter changes are added.
- Wavelet import/create/phase/assessment and weighted matrix-free multiwell ridge
  estimation feed synthetics with explicit original/calibrated impedance velocity.
  Alignment retains lag/support curves and a stated sign convention; sparse
  multiwell/line mistie networks require an explicit anchor per connected component.
- Workflow acceptance creates independent immutable time-depth and wavelet resource
  records in addition to the tie. Accepted input component versions remain in
  provenance; stale resources block acceptance. Legacy tie operations remain.
- Named CSV time-depth/wavelet/synthetic exports are private, generation-pinned
  artifacts with owner-scoped five-minute signed access. Worker arrays stay typed
  in NPZ rather than expanding to JSON; repeated field bindings reuse one bounded
  decoded artifact. Named export bytes count against the approved storage limit.
- API: existing tool-estimates/tool-runs/review paths; added
  GET /api/projects/{pid}/seismic/tool-runs/{rid}/exports/{name}. Operation names:
  workflow, calibrate, time-depth-edit, extract-composite, wavelet-estimate,
  wavelet-assess, align, mistie-network, multiwell-qc, export; existing import/create
  and phase operations retained. New expensive workflow operations require jobs.
- Source AST/whitespace review only. Deferred: synthetic recovery, waveform-adjoint
  checks, 2D/3D composite support, anchor/sign cases, restart equivalence, CSV
  round trips, owner isolation, scientific tolerances and frontend qualification.

## Engine4: Velocity — in progress, not closed

`backend/seismic_velocity_functions.py` is draft source for explicit interval
posting, SI time/depth moments, invalid-support handling and overburden admission.
It is not yet wired into the tool API and has not completed its implementation
review. Construction, well calibration/updates, uncertainty, domain conversion,
complete persistence/export and resource estimates remain to finish. Do not mark
Velocity complete or proceed to engine5 on the strength of this helper.

## Outstanding shared admission work

The new field index estimate includes full reviewed cost categories. Legacy
bounded tool estimates retain their existing explicit storage/network exclusion;
full-cost spending admission must still be extended across those paths. The
first-three source passes above do not close this overall programme requirement.
No new configurations, containers or cloud resources were commissioned.

Research references used for continued Velocity work: OpendTect Time-Depth
Conversion documentation, and DUG Insight interval velocity posting convention.
These distinguish reference conversion and top/bottom/centre posting; they are
research inputs, not validation of the new code.
- https://doc.opendtect.org/7.0.0/doc/od_userdoc/content/processing/create_seismic_output/velocity/time-depth_conversion.htm
- https://help.dugeo.com/online-manual/user-manual/articles/time_depth_conversion/714110-interval-velocity-posting-convention.html
