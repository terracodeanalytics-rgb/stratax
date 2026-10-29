# StrataX context

## Current backend — 2026-10-29 source-bound engine additions

API production is **`stratax-api-00028-wew` at100%**, image `sha256:dbff3328d9d1f7580fdf16667f34fcaf54a9192580571875939d96b5c33089ce`; revision24 remains tagged `seismic-backend-previous`. The existing private Site and frontend source version are unchanged. Final job images and receipts are in SEISMIC_BACKEND_IMPLEMENTATION_2026-10-29.md. All older deployment sections below are historical.

Tool jobs identify `stratax-seismic/2.1` while graph contracts remain v2.0. Estimates accept source bindings through `inputs` or existing advanced JSON `$inputs`: retained section, reviewed brick, accepted result field, accepted analytical indexed section, native index source. Workers resolve only admitted scoped/generation-pinned references. Actual Cloud analytical indexing now builds private sharded ragged Zarr partitions/pyramids, checkpoints between partitions, and provides bounded reads. This is sequential partition execution, not a distributed field scheduler. Full programme implementation remains false in capabilities.

New source files: seismic_source_io.py, seismic_cloud_index_worker.py, seismic_cloud_index_reader.py, seismic_field_ops.py, seismic_run_geometry.py, seismic_volume_workflows.py, seismic_wavelets.py and seismic_interpretation_ops.py. Geometry-coupled graph previews validate actual selected headers/common midpoints/metric spacing rather than unconditionally rejecting NMO/stack/FK. Accepted tool resources expose field schemas and remain source/version scoped.

API now pins pyproj/Zarr/numcodecs for bounded coordinate/index reads. Heavy GemPy/resqpy/Devito/PyLops execution stays worker-side. Seismic job remains2CPU/4GiB/600s; models/acoustic4CPU/16GiB/1800s; one task, zero retries, no idle workers. Minimum/maximum API instances0/2; existing quotas and petrophysics limits unchanged. Do not submit test jobs or resume browser/scientific tests without a new user instruction: the user explicitly excluded them from this implementation/deployment.

Full distributed/MPI/OpenACC, field imaging/marine processing, general geological conversion and graphical/3D interpretation work remain implementation tasks. Missing testing is a separate status, not the explanation for these missing capabilities. Startup readiness and zero ERROR logs do not establish accepted workflows.

## Active deployment — 2026-10-29 bounded tool jobs

New private frontend is https://stratax-seismic-workbench.neonwhale8.chatgpt.site, Site `appgprj_6ae37700e488819196b149dee2c6053f`; old Site remains intact. The connected Sites account cannot access the old project; user explicitly authorised creating this replacement. New source checkout is ignored `.release/sites-seismic-v2`, while `.sites-source` retains the inaccessible old identity. Never substitute their IDs/remotes. Cloud Firebase/project data is shared; origin-local data/handles were not migrated.

API revision `stratax-api-00024-diw` is the new production target;22 is tagged rollback. `STRATAX_SITE_ORIGIN` points to the new Site and `STRATAX_ADDITIONAL_SITE_ORIGINS` retains the old origin. Shared Firebase domains and only the StrataX Maps key referrers were extended additively. No account/password/provider changes.

`seismic_tool_jobs.py` + `seismic_tool_worker.py` now connect bounded tools to on-demand jobs, approval-bound profiles, private artifacts and review using existing owner/run/quota infrastructure. `STRATAX_SEISMIC_TOOL_PROFILES` maps seismic/models/acoustic to exact job/digest/resources; graph preview uses the existing compatibility profile. Small CPU profile2/4GiB/600s, heavier4/16GiB/1800s, zero retries. No real calculation jobs submitted. Tests remain explicitly deferred; do not run pytest/browser/fixtures until authorised. Read SEISMIC_JOBS_DEPLOYMENT_2026-10-29.md before continuing; full workspaces, distributed field processing and MPI/OpenACC remain incomplete.

## Engine v2 source — 2026-10-29

Read SEISMIC_ENGINES_V2.md before resuming. Numerical source has substantial new processing/imaging/model/4D/acoustic paths; all-programme completion is not claimed. User now requests engine implementation only and explicitly defers data testing to a later frontend pass. Do not restart pytest/browser/fixture calculations unless authorised again. Parsing/compilation/packaging are permitted; Docker engine tests default off.

Engine graph fingerprints include `stratax-seismic/2.0`. New tool capability discovery reports actual missing runtime dependencies and uncommissioned acoustic dispatch. Private `seismic_engine_runner.py` creates atomic NPZ outputs/checkpoints without uploads; it is not a hosted admission bypass. Model requirements are separate: headless GemPy 2026.0.3 / engine 2026.0.3.post1 / resqpy 5.2.1. Hosted API does not automatically contain these engines. Preserve explicit owner/source/geometry/estimate boundaries.

Production remains revision22. No new source was deployed. Last attempted loopback browser processing submission returned503; unresolved and not accepted. Actual full UI/source/result/artifact integration, distributed field-scale storage/execution and MPI/OpenACC remain missing. Earlier lower sections describe historical revisions and should not override this source/runtime distinction.

## Live seismic API promote — 2026-10-29

- API service `stratax-api` in `project-9afac` / `us-central1` now runs revision `stratax-api-00022-yes` at 100% (image digest `sha256:72249c5d…4c43`, build `0659cd10-…`). Rollback: `stratax-api-00017-saf` tagged `board-candidate`; prior `00020-pez` superseded.
- Public API: https://stratax-api-227436363119.us-central1.run.app . Tagged URL: https://seismic-candidate---stratax-api-fwy32oha6q-uc.a.run.app
- Tools API adds export/handoff/4D-qc/model GRDECL·RESQML/FWI-plan; graph operators include receiver-deghost, debubble, srme-subtract, velocity-field PSTM, rmo-scan. `numpy`/`scipy` on API; PyLops stays worker-only.
- Site: https://stratax-workbench.cometcrab258.chatgpt.site — `.sites-source` commit `dcb2036` prepared; push 404 without Sites token (live still v15). Owner-only audience unchanged.
- Compute path remains Cloud Run Jobs + GCS only (`minInstances=0`).

## Seismic implementation checkpoint — 2026-10-29, undeployed

The approved programme is recorded in SEISMIC_PROGRAMME.md and SEISMIC_ACCEPTANCE.md. Evidence bundles use SEISMIC_EVIDENCE.md. No complete milestone or field-scale acceptance is claimed. Keep the single-complete-production-release policy; do not publish the current foundation as completion. Existing project/file/small-worker quotas are unchanged; large runs need explicit version-bound estimates and approval. Batch commissioning uses `scripts/configure-seismic.py` (dry-run by default). Capacity estimates use `scripts/estimate-seismic-capacity.py`.

`frontend/dist/seismic-workspace.js` owns independent `workspace.seismicWorkspace` state at `#seismic`; petrophysics state remains under `workspace.interpretation`. Modules implement bounded local/native indexed sections, 3D amplitude views, exact trace/sample picks, ordered fault sticks and reviewed section tracking. Four retained views and 500 UI picks per object are current bounds. Source arrays are transient, never saved in project JSON. Different time origins are rejected by aligned views rather than silently resampled; single-trace/ragged access remains possible. Unconfirmed datums/time conventions are not assigned.

`#processing` now has independent `workspace.seismicProcessing` graph books and processing ribbon, before a single Interpretation navigation entry with Petrophysics/Seismic modes. The shared explicit Cloud-copy flow retains source lineage and remaps seismic references; account/project checks protect asynchronous requests. Complete legacy-shortcut/configuration/result migration still needs work.

`seismic_api.py`/`seismic_runs_api.py` retain owner/legal/project/private-artifact boundaries. Bounded previews have revisioned graphs, exact estimate/approval binding, deterministic Batch job IDs, resource reservations, cancellation/reconciliation, checkpoint restart and independent reviewed outputs. Configure a pinned immutable image, reviewed hardware and current pricing before commissioning; capability discovery stays unavailable without that profile. No provider acceptance or production Batch profile is commissioned. The old small petrophysics worker remains unchanged.

`seismic_trace_index.py` retains per-trace offsets/lengths/intervals/origins/header geometry in resumable SQLite; `seismic_trace_store.py` writes sharded ragged Zarr v3 arrays. `seismic_import_index.py`/`seismic_indexed_reader.py` now integrate exact locators and per-chunk bin bounds into existing private Cloud import chunks, with ragged trace/compatible-section access and pinned Batch reads. Full distributed Cloud analytical storage/indexing and target scale remain open. The ignored Stratton swath completes populated local storage with 51,000 independent sample comparisons, but its geometry remains unreviewed. See SEISMIC_REFERENCES.md; never commit source/reference arrays.

`seismic_geometry.py` and `seismic-geometry-review.js` provide source-bound declarations, including indexed variable-layout header preview and immutable revisions. Review is available in Processing and Seismic; local sources still require explicit Cloud copy for these server resources. Scalars apply in the native representation. Saved declarations remain `geometryQualifiedForProcessing=false`: full-survey QC/binning and CRS transformations are missing.

`seismic_brick.py` and `seismic-volume-view.js` add bounded 3D poststack bin access/volume rendering. Bricks require matching reviewed signed four-byte inline/crossline roles, reject raw gathers/duplicate bins, preserve null support and reject incompatible sampling. Limits: 512 bins/500,000 samples, 32 MiB expanded spatial-index selection, existing manifest/chunk caps. vtk.js 38.0.4 is locally bundled; source arrays are transient, while camera/bounds/display scale persist. Bin-coordinate views do not imply physical-coordinate maps or complete 3D interpretation. Reproduction/notices/build digests and test boundaries are in SEISMIC_INDEXED_3D.md.

The Devito adapter uses an explicit SI-to-upstream-unit boundary and a fixed conservative time step. The zero-halo Born perturbation must match the upstream operator layout. Four frozen 2D/3D adjoint/Taylor tests pass in Linux GCC 14.2.0-19; image/build provenance and licensing are in backend/SEISMIC_NOTICES.md. This is not the RTM/FWI application or MPI/OpenACC qualification.

Latest full backend: 171 passes/four Windows acoustic skips, followed by four focused indexed-reader passes including an added native-revision case. JS/account checks: 12. Loopback browser: 10 groups including native 3D samples/camera/export/WebGL recovery, zero page errors/Local-content uploads. Internal import image passes 27 checks; aligned seismic image passes 39. Prior six-LAS 17-group/57-configuration and acoustic compiled results remain separate evidence. Production stays Sites v15/API revision 17 and the existing workers. All complete milestones and field/1 TiB/10 TiB gates remain open.

## Real-user frontend QA — 2026-10-29

TEST 1 contains the existing six LAS imports and the separate `QA · six LAS frontend tests` workbook. Seven frontend-submitted QC runs are completed; full smoothing/despiking comparisons remain proposed and no QA result was accepted. See FRONTEND_QA_2026-10-29.md for exact evidence and coverage limits. Raw numeric QC uses `raw source values (unit unresolved)`; normalization endpoints and shift/splice boundaries are arbitrary software-test settings, never geological calibration. Six-LAS QC completion does not validate absent NMR/seismic/core/model workflows.

The supported in-app browser connection worked in the fresh chat despite the previous chat's disabled-browser errors. No permission/audience changes or alternate API test scripts were used. Full reload restored all 24 tracks and seven completed runs. No application code or deployment changed in this pass.

## Current interpretation release — 2026-10-28

Sites version 15 is live, source `f75d8450cb28a413b17a0d286ce9abb1f06092b0`, deployment `appgdep_6ae272eb44448191af2fd56b34a50527`. API `stratax-api-00017-saf` is at 100%; API build `6c1074de-1a62-458c-a923-632b0c1e21dc`, scientific worker build `b2fcd1f5-e87b-4180-b075-a1a38e35a18d`. Same Site audience and project-9afac/us-central1. Previous versions/images are retained.

Interpretation now contains the actual well-log board described in WELL_LOG_CANVAS.md. Full retained sample chunks replace the former 2,000-row view limit. Cache and remote state are scoped to UID/project; Local content remains local. Known depth units are converted for display only, without assuming CRS/datum or converting MD/TVD. Ordinary scrolling preserves depth; Ctrl+wheel zooms, with legacy empty-range recovery and a visible Fit action.

Scientific source scope preserves exact depth/brush rows and emits indexed pointwise outputs. Proposed full curves can be compared before review; only accepted versions become downstream inputs. `scientific_api.firestore_value/restore_value` encode nested JSON matrices with a non-reserved Firestore map key and are also used by project saves. Public reads preserve the original JSON. Existing arrays do not enter database documents as scientific samples.

The registry retains 58 bounded methods. Eighty-one scientific/API/project tests, 16 six-LAS interaction groups, 57 menu/config checks, five depth-recovery checks, 10 map regressions and 36 live scoped-API checks pass. Eight hosted end-to-end checks also pass with zero page errors, including live calculation, proposal comparison, acceptance and persisted reload. These are implementation checks, not universal specialist certification; see SCIENTIFIC_WORKSPACE.md and STATUS.md for exact verification/boundaries.

## Repository and live state

- Git root: STRATAX; remote `https://github.com/terracodeanalytics-rgb/stratax`. Canonical frontend: `frontend/dist`; API: `backend`. No frontend build/framework is required.
- Site: https://stratax-workbench.cometcrab258.chatgpt.site/#home. Preserve project ID `appgprj_6adc66e963588191a4154ab09c724471` and its owner-only audience.
- Current frontend: Sites version 15; source/deployment above. Versions 13/14 are retained for rollback.
- API: https://stratax-api-227436363119.us-central1.run.app. `stratax-api-00017-saf` at 100% in `project-9afac/us-central1`; candidate alias https://candidate---stratax-api-fwy32oha6q-uc.a.run.app.
- Backend build `6c1074de-1a62-458c-a923-632b0c1e21dc`; worker build `b2fcd1f5-e87b-4180-b075-a1a38e35a18d`. Prior project revision `stratax-api-00005-xav` remains available for rollback.
- Cloud Run: zero minimum/two maximum instances, request-based CPU, 512 MiB, concurrency eight and existing 60-second timeout.
- Sites source is the separate ignored `.sites-source` repository. Never change the root Git remote to the Sites remote. Use hidden stdin credentials and exact pushed source/archive provenance.

## Identity and project ownership

- Shared TerraCode Firebase pool in `project-9afac`; dedicated StrataX web app `1:227436363119:web:a01865da7615f56878fc9a`. Shared password changes affect other TerraCode apps. Shared email templates/providers and G-RES endpoints are unchanged.
- Runtime identity: `stratax-auth-runtime@project-9afac.iam.gserviceaccount.com`. Existing auth-link role/datastore.user plus secret access to `gres-smtp-password` and `stratax-maps-api-key`; objectUser only on the existing StrataX raw bucket. Do not expand to other apps/resources.
- Account/profile/legal/rate-limit collections remain StrataX-specific. Projects use `stratax_projects/{verified_uid}/records/{id}`. All resource ownership comes from server-verified Firebase identity and exact current-policy acceptance.
- Seven policies are version 1.1; frontend policy copy and backend versions must evolve together. Existing users acknowledge changes before workspace access.
- Account emails remain customized SMTP HTML/plain text with fixed StrataX continuations. Do not log passwords, tokens, action codes, generated links or SMTP credentials.

## Project behavior and persistence

- Approved plan/contracts/limits: `PROJECT_STORAGE.md`. Setup has Project, Location, Storage and Review; select Petrophysics, Seismic or both. WGS84 site coordinates are optional. Workflows can change without deleting hidden work; well tie requires both.
- `project-repository.js` provides Cloud, local-folder and portable-package persistence. `project-setup.js`, `project-overview.js`, `project-map.js` and `project.css` implement the new surfaces. `app.js` coordinates existing project actions and recovery/save states.
- Cloud originals use private `project-9afac-stratax-raw` under owner/project prefixes. Firestore updates use revision checks; originals can only enter metadata through authenticated uploads. Guided import limits: 10 GiB/file, 50 GiB/project including originals/reservations/derived artifacts; 512 KiB project JSON. Legacy raw transfer endpoint retains its smaller compatibility limits. No public bucket access or new database was created.
- Local folders contain `project.stratax.json` and `originals/{id}`. Browser handles and recovery drafts use UID-scoped IndexedDB; permission may need renewal. Direct directory writing requires a supporting browser/top-level context. Portable JSON packages include originals and require explicit download to retain changes. Local project contents do not upload to StrataX cloud storage; Maps/search still contact Google.
- Existing scoped browser data is retained as a recovery copy. Genuine projects require a chosen destination; seeded Tomboy content is removed without deleting genuine additions. Unscoped legacy keys remain unassigned. Sign-out hides active data without deleting saved files.
- The compact switcher lists Active/Archived projects, excludes Trash and ends with All projects. Public/shared headers reuse the landing initials account menu. Search, navigation and direct routes enforce selected workflows.
- Overview counts/activity are real. Manual stage tracking is labeled user-reported. Scientific fake plots/results/maps/candidates are removed; exchange readers and bounded previews are available; OCR/digitization and simulator execution remain unavailable; bounded scientific calculations are documented separately.

## Maps and operational details

- G-RES gets its Maps key from a runtime secret; StrataX reuses its existing dedicated browser key instead. Preserved its prior origins/tile API, adding Maps JavaScript/geocoding and the hosted Sites origin. The restricted browser key is returned by runtime config; raw key values are not in source.
- Maps loads lazily; setup supports manual coordinates, place search and picking. Overview/full Map display the saved site pin. Failed Maps never blocks manual setup. Origin referrers are allowed for Maps; authenticated API calls retain no-referrer.
- Google intercepts `/healthz`; use `/api/health` externally. First Cloud Run deployment cannot use no-traffic; existing services can.
- Windows sandbox loopback can stall TestClient; use the approved escalated test path. Two stalled pytest processes from this session were stopped.
- Keep all tagged/live/rollback/worker images plus newest three. Ten tagged StrataX API/worker images were retained; zero deleted. No unrelated cloud resource was cleaned.
- Evidence is ignored under `.release`. Scripts `verify-projects.cjs`, `verify-project-api.py` and `verify-live-projects.cjs` cover this release. Older single-form project assertions in `verify-ui.cjs` are historical; use its account/landing filter for adjacent regressions.
- Real email delivery was previously authorized only once to contact@terracodeanalytics.com; do not resend without new authorization. No email was sent during this phase.

## Guided ingestion runtime

- Contracts/version matrix: `DATA_INGESTION.md`. Data uses Sources/Wells/Datasets/Import history; six-step guided intake, explicit transfer and activation confirmations, channel selection, templates and immutable version lineage. Source coordinates/datums are never silently activated.
- API `imports_api.py` manages owner/policy-checked resumable uploads, quota reservations, jobs, revision-gated confirmation and private previews. `ingestion_core.py`/`ingestion_native.py` are worker-only readers. API remains lightweight.
- Worker job: `stratax-import-worker`, us-central1, 2 CPU/4 GiB/1800s, no automatic retry; per-project lease and global two-parser capacity. Worker image build `21bbcecd-6842-43b8-86d1-39c649741e7e`, digest `sha256:758865c702747ef3e3c210244e25d07c448fcee0f4c603c6b2334da3c95e745b`. Native image gate: 26 checks.
- Worker identity `stratax-import-worker@project-9afac.iam.gserviceaccount.com`: datastore.user, raw objectViewer, derived objectUser. API identity has derived objectViewer and job-scoped execution/view permissions; self `strataxBlobSigner` permits signBlob for five-minute downloads. Other application grants remain unchanged.
- Private derived artifacts use existing `project-9afac-stratax-derived`. Large arrays use compressed NDJSON chunks/manifests, not Firestore. `STRATAX_DERIVED_BUCKET` and `STRATAX_IMPORT_JOB` configure the API. Raw-bucket resumable CORS includes only the existing StrataX origin.
- Browser `ingestion-worker.js` uses streamed reads and vendored SHA-256/SheetJS; Local native-only formats receive conversion guidance, never server upload. Folder chunks live in `datasets/{importId}`; portable packages preserve supported chunks/originals within explicit budgets. Parsed Cloud-to-portable conversion is unavailable and blocked explicitly.
- PowerShell comma-separated gcloud environment values MUST be quoted or passed as one structured subprocess argument. An unquoted value caused the candidate preview 503 and was corrected before publication. Cloud Run image-pull DEADLINE_EXCEEDED can occur before worker code starts; API tracks execution failure so imports can retry without re-upload.
- Six Downloads LAS files are local read-only acceptance fixtures. Never upload them or activate unspecified source datums as WGS84 automatically. No email was sent during ingestion QA.

- Data route defaults apply only when its route/project changes. Never assign document filters or wells tabs unconditionally inside `dataPageView`: that overrides user controls on every render. Filtered empty states offer Clear filters. Preflight disables Continue until parsing finishes; tests should wait on the control state, not progress copy.

## Map workspace

- `map-workspace.js`/`.css` implement ribbon, contents, field grid, collapsible inspector and real deviation paths; `project-map.js` remains the shared Maps loader with a multi-layer adapter. Runtime API/key/account/audience unchanged.
- Reviewed locations and per-well symbols persist in workspace `mapWorkspace.locations` / `symbols`. Confirmation explicitly requires WGS84. Imported source coordinates/datums are never overwritten. Grid is Web Mercator EPSG:3857 (E/N labels in km, grid-distance scale); mapped latitude range is ±85 degrees.
- Orange trajectories require assigned wells, supplied X/Y longitude/latitude mappings, explicit coordinate order and WGS84, complete readable stations and no blocking validation. Local chunks remain local; Cloud originals are read on the authenticated browser, bounded at 32 MiB and 50,000 stations. Angles-only data can be added but is not converted to a trajectory. Projected source-coordinate conversion is not implemented in this map adapter.
- The importer accepts optional `{family,well}` entry context, retaining identity through file preflight. It still requires its existing review/confirmation and storage rules. Map refresh detects new dataset identities. Map transient state and async results are scoped to user/project to prevent stale cross-account geometry.
- `verify-map-workspace.cjs`: 8 passed; existing ingestion suite: 10 passed. Google adapter tested using controlled SDK objects; live Google imagery loading was not repeated in this frontend-only phase. Production asset bytes are checked with `verify-live-data-filters.cjs --assets-only --map-assets`, without account creation or content upload.

- Well visibility/actions update: unlocated records appear in a labelled non-geographic tray. Bulk location review uses saved headers; it never assumes their datum. `well-symbol.js` supplies one SVG for all default well representations.
- Map aliases use `mapWorkspace.names`; canonical well IDs remain immutable. Duplicate creates a new `wellDrafts` registration (`sourceWellId` provenance) with independent copied map location/style, not cloned source datasets. Delete filters map objects through `mapWorkspace.removedWells`; View → Removed wells restores them. Source files/datasets are preserved. Context menus support right-click, Shift+F10/ContextMenu key, ellipsis, Escape and arrow navigation.
- Map browser suite now has 10 passing checks, including bulk header values, unconfirmed-CRS default, explicit confirmation, rename/duplicate/remove/restore and reload. No backend or Google credential changes.
