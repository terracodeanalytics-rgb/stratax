# Seismic backend implementation — 2026-10-29

## Delivery boundary

The user requested the remaining backend and a live deployment, explicitly excluding
data/scientific/browser tests. Compilation, diff review, image packaging and platform
readiness/traffic/log inspection are the only verification in this delivery. No
scientific job or benchmark is submitted. This is not full M0–M9 completion.

The existing Site, authentication, account scopes, project data, petrophysics limits
and native frontend architecture are retained. There is no frontend layout rewrite.
The Site continues to use the same API URL; backend deployment does not require a
new Site version.

## Implemented additions

| Path | Backend implementation |
| --- | --- |
| Tool estimates/submission | Slices and Cloud index admitted alongside existing engines; source-bound sections, bricks and accepted resource fields; resource fingerprints; exact CPU/memory/image checks; one estimate bound to one run |
| Cloud index | Worker reads immutable native locators and samples, builds actual ragged lossless sharded Zarr v3 partitions, retains per-trace offsets/origins/intervals/geometry/masks, creates separate display levels, uploads private checksummed artifacts, checkpoints partition boundaries |
| Cloud index reads | Bounded `/tool-runs/{rid}/indexed-traces` downloads only selected partitions with checksum/scope/byte budgets; accepted indexes can provide downstream `indexed-section` inputs |
| Processing geometry | NMO/stack/FK no longer rejected unconditionally; selected retained headers must establish reviewed TWT/projected coordinates, common-midpoint identity and matching offsets or regular physical spacing |
| Land tools | 3D Kx/Ky/frequency cone filtering; geometry-reviewed CMP/NMO/weighted stack with sample fold; source/receiver statics corrections; elevation statics and semblance wrappers |
| Well ties | Explicit sampled wavelet import, Ricker creation, phase rotation, declared normalisation and spectrum assessment; existing calibration/extraction/synthetic paths retained |
| Velocity | Layer-convention-explicit interval/RMS/average conversion of functions and actual 3D velocity volumes; existing conversions retained for compatibility |
| Interpretation | Fault-block-safe physical horizon triangle meshes, explicit horizon flattening, indexed mesh JSON and actual OBJ triangle export; existing horizon/fault proposal paths retained |
| Quantitative | Actual inline/crossline poststack and prestack inversion with per-location priors, forward predictions/residuals/diagnostics; Aki–Richards and Shuey reflectivity modelling |
| 4D | Inline/crossline/time volume difference, stable-region matching, FIR cross-equalisation and shaped NRMS/correlation/time-shift outputs |
| RTM | Restoration of completed-shot image/illumination checkpoints with strict shape/support and admitted source/model/image compatibility |
| Ownership/persistence | Accepted resources retain tool-specific kinds, field shapes, source versions, private artifacts and engine provenance; resources returned by the seismic source browser API |
| Job accounting | Failed input uploads release their accounted input bytes when no object committed; unused estimates can be explicitly retired with generation-bound deletion/quota release; failed workers reconcile committed artifact sizes |
| Scheduling/cancellation | Discover ambiguous executions by exact run environment identity; retain reservations when shutdown is unconfirmed; only release known unscheduled pending runs or settled executions |
| Capability catalog | Distinguishes local dependencies from configured hosted profiles; removes stale acoustic-dispatch-uncommissioned claim; testing and full-programme status remain explicit |

Tool jobs identify `stratax-seismic/2.1`; graph contracts remain v2.0. Existing graph
recipes, project state and result references are preserved.

## Source bindings

`POST /api/projects/{pid}/seismic/tool-estimates` accepts `inputs`, or `$inputs` inside
the existing advanced parameters JSON. Bindings map named arguments (including
names such as `configuration.velocity`) to:

- `section`: activated dataset ID and bounded retained trace/sample selection;
- `brick`: activated dataset ID, explicit geometry revision and bounded 3D bin selection;
- `resource`: accepted private result resource ID and named output field;
- `indexed-section`: accepted analytical-index resource and bounded selection;
- `index-source`: native indexed dataset for the actual Cloud indexing worker.

Index jobs bind the first selected seismic dataset automatically if no explicit
binding is supplied. Other tools require their actual arguments or bindings; input
measurements are never invented. Native selected sources are generation-pinned at
estimation. Resource fingerprints are checked at submission. Worker bindings reject
different time sampling/origins for shared recording arguments and prevent bindings
from overwriting supplied parameters. Input schemas remain advanced controls; full
graphical source mapping is separate unfinished UI work.

New analytical entry points are `tools/geometry` and `tools/land`. Existing entries
gain `wavelet-import/create/phase`, `convert-volume-functions`, `basic-3d`,
`horizon-mesh/flatten/mesh-export`, `reflectivity-model`, `poststack-volume`,
`prestack-volume`, and `difference/match/cross-equalise/qc-volume` operations.

## Limits and remaining implementation

These are implementation limitations, **not just missing tests**:

- Cloud indexing is resumable sequential partition execution within approved CPU
  job/storage limits. It is not a distributed scheduler or 1 TiB/10 TiB implementation.
  Reads have a 128 MiB downloaded-partition budget and never load the whole survey.
- Globally coupled distributed solvers, CPU/MPI domain decomposition and NVIDIA
  OpenACC scheduling are unfinished. Existing jobs remain single-task CPU profiles.
- Full acquisition-aware field SRME, variable-velocity amplitude/anti-alias imaging,
  applicable full 3D DMO/Radon, weathering/refraction tomography and complete field
  processing orchestration remain open. Existing narrow operators are retained;
  their limitations are not renamed into full implementations.
- Volume inversion runs independent vertical inversions over actual spatial bins;
  it does not introduce a lateral regularisation solver. 4D registration remains
  the existing reviewed bounded translation model, not arbitrary deformation.
- Automatic implicit geology to general intersecting-fault/truncation corner-point
  grids, general faulted-grid well blocking/upscaling, complete ensembles and every
  exchange case remain unfinished. Existing explicit split-pillar export remains.
- Manual workbook picking still uses existing bounded trace/sample persistence;
  full survey-coordinate 3D editing and complete graphical workbooks remain open.
- Native trace/gather adapters beyond their explicit supported formats remain
  bounded; no synthetic angle observations, geometry, calibration or CRS are supplied.
- Estimate retirement is explicit; there is no automatic background garbage
  collector. A dispatch whose provider identity cannot be resolved remains held
  rather than authorising another possibly duplicate charge.

M0–M9 acceptance is unchanged. No test count or field-capacity claim is created by
this implementation/deployment. The capability catalog keeps
`fullProgrammeImplemented=false` and `fieldScaleQualified=false`.

## Scientific and provider references

- [PyLops Aki–Richards coefficients](https://pylops.readthedocs.io/en/v2.3.0/api/generated/pylops.avo.avo.akirichards.html)
- [pyproj axis order and checked transformation](https://pyproj4.github.io/pyproj/latest/api/transformer.html)
- [Cloud Run execution identity and task template](https://docs.cloud.google.com/run/docs/reference/rest/v2/projects.locations.jobs.executions)
- [Cloud Run execution listing](https://docs.cloud.google.com/run/docs/reference/rest/v2/projects.locations.jobs.executions/list)
- [Devito CPU/MPI/OpenACC runtime boundaries](https://www.devitoproject.org/download.html)

## Live deployment

API revision **`stratax-api-00028-wew`** is ready and serves **100%** production
traffic. Cloud Run reports ContainerHealthy/Ready; a fresh revision-specific
`severity>=ERROR` log query returned zero records. The API URL remains
https://stratax-api-227436363119.us-central1.run.app, used by the unchanged private
Site. No application/data/browser tests were performed. The final seismic, models
and acoustic job digests/resource limits were read back from deployed job metadata.
Revision24 remains tagged `seismic-backend-previous`; candidate27 was never promoted.

## Image builds

| Runtime | Build | Immutable digest |
| --- | --- | --- |
| API | `7c203d4a-6f93-40b8-90ba-c9b7d7ed4636` | `sha256:dbff3328d9d1f7580fdf16667f34fcaf54a9192580571875939d96b5c33089ce` |
| Seismic | `fe13f6ed-44bd-4f11-bf5e-b28a24d5e13c` | `sha256:06d5093695e8797538a55f755ec30795e5c26b3cd8833950ed80519966548030` |
| Models | `f0c3b935-1eb2-4c53-9922-22d329a7a48f` | `sha256:e617df23d4f25025f87ba146252d9000d48d2378860be7808886e20a9943d838` |
| Acoustic | `44932232-e2fb-4a56-b02b-63610b8079d0` | `sha256:6497bd21bb1027918399558ab23fee1c0231ba4e8e95b6297f860b79f9d33b18` |

All builds succeeded with engine tests disabled and use the same final application
source snapshot. Static review after earlier packaging identified a QI route-local
serializer shadowing the shared serializer, and an ambiguous-upload accounting case.
Both were corrected before production promotion. Final worker source also throttles
progress/cancellation database reads and reconciles failed-worker artifact bytes.
Earlier image candidates remain protected/tagged; API revision27 was a ready
zero-traffic candidate and was not promoted.

The images retain existing dependency notices. API requirements now also explicitly
pin pyproj 3.8.0, Zarr 3.1.3 and numcodecs 0.17.1 for bounded CRS/index reads. Heavy
GemPy/resqpy/Devito/PyLops calculation engines stay in the worker profiles.

## Cleanup and configuration

The final scoped image inventory contains **58 images, all tagged/protected; zero
untagged images and zero image deletions**. Keep the latest three plus every tagged,
live, worker and rollback digest. Forty-two generated Python bytecode entries were
removed across the two compile/cleanup passes. No original data, private exports,
source archives, Site checkouts, dependency runtimes or recovery tooling was removed.

Cloud Run job metadata confirms the final digests above with seismic 2 CPU/4096 MiB/
600 seconds and models/acoustic 4 CPU/16384 MiB/1800 seconds, one task/parallelism one,
zero retries. No session job execution was submitted. API min/max remain zero/two;
petrophysics/import workers and quotas were not modified. Revision24 is retained as
`seismic-backend-previous` for rollback. This is configuration/build evidence only.
