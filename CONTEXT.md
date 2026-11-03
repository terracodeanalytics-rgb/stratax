# StrataX context

## 2026-11-03 - Mobile Cloud source transfer published; environment creation blocked

- User declined paid infrastructure and explicitly selected the existing public STRATAX repository for transfer. Published the full reviewed source snapshot to `codex/mobile-cloud-20261103` using an isolated clone; source commit `edc8e23af507b1346760055913781b91def62c50`. Original laptop checkout/branch/index remain in place, and public `main` was not pushed or merged.
- Snapshot includes 299 tracked/nonignored source files plus Cloud handoff and setup instructions. Omitted flagged `backend/deploy-env.yaml`, login caches, .env files, Local browser data, user originals, Windows virtualenvs and ignored release/recovery assets. All originals remain on laptop. This is unfinished development source, not a deployable release.
- Added branch-only `CLOUD_HANDOFF.md`, `AGENTS.md` and `.codex/cloud-install.sh`. Syntax checks: 137 Python files and 51 frontend JS files pass. ZIP CRC/hash and whitespace checks pass. No scientific runtime qualification or Linux dependency installation completed.
- Signed-in desktop Settings > Codex Cloud could list/select `terracodeanalytics-rgb/stratax`, but creation failed twice. First: "Could not connect to cloud setup." Retry: "Could not start this chat" and "Couldn't create the environment. Try again to continue setup." No published environment, branch binding, Cloud execution or mobile continuation has been verified. Existing CLI legacy task listing works but does not establish new Cloud environment readiness.
- Next: retry Create environment in the signed-in desktop/web app; select STRATAX, use migration branch `codex/mobile-cloud-20261103`, read CLOUD_HANDOFF.md, install with `bash .codex/cloud-install.sh`, inspect setup, publish privately, then verify a mobile task uses this branch before turning laptop off. Do not buy credits or provision paid infrastructure. This local chat cannot directly hand itself off to Codex Cloud; use the written handoff.
- Production remains Site v10 / API unchanged. No VM, paid scientific job, backend/frontend deployment, new persistent key or credit purchase occurred. Cloud service permissions were not transferred.
- Cleanup reviewed: zero disposable files removed; migration ZIP, inventory, receipts and isolated clone retained as recovery/operational assets. Zero container builds or image deletions. Preserve unrelated dirty importer/seismic work. Receipts: `.release/mobile-cloud-transfer-20261103`.

## 2026-11-03 - Project recovery and imported-view support fix live (Site v10)

- Published Site v10: source `067289c63fd8411c86cdc0bf31ad621ef51e9857`, deployment `appgdep_6ae94ca8025c819180c34e0a677b53cb`, existing public URL/audience preserved. Site v9 retained for rollback. API/workers unchanged; API health ok.
- Stale project saves no longer block opening other projects. Pending work remains cached; known conflicts persist across reload and stop repeated autosaves. Explicit recovery saves a backup before loading Cloud state. Save operations stay scoped to the active project when required.
- Existing active imports rebuild missing well/location registrations from retained evidence. The first empty log workbook opens imported wells automatically. Import completion links directly to logs and map/location review. Unknown CRS remains unplaced; no invented coordinates or scientific approvals.
- Passed six focused browser checks locally and six on published assets with isolated mocked accounts/APIs, five account-scope tests and ten adjacent map checks. Eight published asset hashes match; zero page errors, real user writes, Cloud executions or backend deployments. This does not verify users' inaccessible Local browser files.
- Map regression fixtures were updated for current importer and required survey datum/Z meaning. Map surfaces fit 320/768/1024/1440; preexisting shared-header overflow at 768 remains outside this support change and must not be claimed fixed.
- Receipts: `.release/project-import-recovery-20261103`, `.release/support-recovery-live.json`, `.release/map-workspace-verification.json`. Root Git unpublished; unrelated dirty importer/seismic work preserved.
- Cleanup reviewed: zero disposable files removed; all release/QA/recovery assets retained. No container images built or pruned. Remaining support step: users refresh/reopen; any retained conflict uses Review save conflict. Missing coordinates still require source-reference review.

## 2026-11-02 - Dense multidisciplinary frontend and slim wells live (Site v9)

- Site version 9 succeeded at the existing public URL; source `db7a43641cd993a1d250b177dbb40f5b8dad2a38`, deployment `appgdep_6ae820d84f84819187c740c3200315ad`. Site v8 retained for rollback. API/workers unchanged; API health ok; no paid scientific executions.
- User expanded scope to the full multidisciplinary frontend. Thirteen discipline tabs expose working methods directly, plus 74 disabled planned capabilities in 19 groups. Added browser Data/Models/Processes/Results categories, view chooser, output tabs, disabled future context actions and searchable capability inventory. Planned controls do not dispatch or invent objects/results.
- New tracks default to 48 px; reference rulers to 44 px. Drag/keyboard resize, per-track/per-well/all-well width settings, Slim wells and Fit wells persist through existing view metadata/undo. Saved explicit widths remain; source samples and transforms are unchanged. Long centered dialogs respect CSS zoom bounds.
- Passed 28 local browser groups / 64 method configurations, 11 focused groups on six real LAS originals (hashes unchanged), five mocked Cloud/report checks, and 11 published-browser groups with isolated mocked account/API/Local fixtures. Seven deployed asset hashes match; zero page errors/uploads. Native browser-chrome zoom and actual Cloud/field qualification remain unclaimed.
- Read `SUBSURFACE_INTERFACE_2026-11-02.md` for reference links, disabled capability IDs and backend follow-up inventory; `.release/multidiscipline-ui-20261102` retains exact source/deployment receipts and archive. Unrelated dirty work preserved. No root Git commit/push.
- Cleanup: zero disposable local files/deletions, zero container builds or registry changes. Preserve all original data, release/QA receipts and recovery assets.

## 2026-11-02 - Grouped petrophysics ribbon and collapsible sidebar live (Site v8)

- Site version 8 succeeded: source `fc7bae98fc98313d761f1864e05e49eeb3455486`, deployment `appgdep_6ae7c5c2fa8081919a20106c2685af16`, existing public URL/audience preserved. Site version 7 retained for rollback. API/workers unchanged; no paid scientific jobs.
- Replaced stacked toolbars with grouped commands, seven tabs and contextual tools; retained every method via searchable Advanced methods. Guided preparation creates proposed method setups without confirmations/execution; calibration/evaluation reuse existing review workflows. Workspace dialogs are centered with bounded content and reachable actions.
- Application sidebar and Project Browser now collapse independently; project preferences persist and top-bar restore remains available on narrow screens.
- Passed 25 local browser groups / 64 method configurations, 8 focused follow-up groups, 5 mocked Cloud/report checks, and 8 published-browser groups with mocked account/APIs and Local fixtures. Five released asset hashes match; API health ok. Zero page errors or Cloud content uploads. Widths 320–1920 px; CSS zoom 125–150% tested, native browser-chrome zoom not automated.
- Read `PETROPHYSICS_RIBBON_2026-11-02.md` and `.release/petrophysics-ribbon-20261102/deployment-receipt.json`. Real Cloud/field qualification retains prior input blockers. Root Git remains unpublished; unrelated dirty work preserved.
- Cleanup: zero disposable local files found/deleted; zero container builds or registry deletions. Preserve all release/QA/recovery assets.

## 2026-10-31 - Petrophysics deployed live (Site v7)

- Site version 7 succeeded at https://stratax-seismic-workbench.neonwhale8.chatgpt.site; source `7ccdbc3f1b78c2a0eec690927e91a3d3c3339468`, deployment `appgdep_6ae64903b1408191a83868b44b9dcbd7`. Public audience preserved.
- API `stratax-api-petrophysics-1031d` is Ready at 100% traffic. Build `f263b613-df2c-47e3-a45f-679cc758379c`; science build `22bc6d42-72fd-4aba-a8be-3757468dd03b`. Matching science job image verified and Ready; resources unchanged, zero agent-started executions. Import/seismic jobs unchanged.
- Candidate/production health passed; workflow route correctly requires authentication (401), DELETE CORS passed, fresh revision ERROR query empty. Live petrophysics JS/CSS and interpretation module match release hashes. Read-only Chromium smoke: title, visible page, stylesheet present, zero page errors. Hosting modifies index HTML; its byte hash differs. Authenticated live workflow execution is not qualified.
- Release overlays only 8 backend and 6 frontend files onto the completed importer baseline. Unrelated dirty seismic/importer changes preserved. API rollback tag `petrophysics-previous` retains `stratax-api-import-bundles-1031c`; Site version 6 remains available. Previous science digest and final job settings are in `.release/petrophysics-live-20261031`.
- Prior local validation: 93 Python tests, 21 current browser groups, 5 mocked Cloud/report checks. Real field qualification still requires approved TMB units/Rw/matrix/shale/permeability evidence; no fixture defaults substituted. Paid Cloud study acceptance and root commit/push remain separate authorization steps.
- Cleanup inventory: 68 images total, 34 API/science images all tagged/protected, zero eligible/deleted; zero disposable local files removed. Preserve all release archives/receipts and user recovery assets. See `PETROPHYSICS_WORKSPACE_2026-10-31.md` and `.release/petrophysics-live-20261031/deployment-receipt.json`.

## Current local petrophysics architecture — 2026-10-31

- The current checkout now contains an undeployed conventional petrophysics workspace and reviewed workflow implementation. Live state is unchanged from the recorded importer release; do not treat this mixed dirty tree as a qualified deployment bundle.
- Frontend: `petrophysics-workspace.js/.css` supplies layout migration, ribbon actions, contextual panels, zone/parameter editors, workflow definitions, per-well mapping review and accepted reporting. `interpretation-workspace.js` and `well-canvas.js` connect it to existing scientific views, retained rows and workbook interactions.
- Backend: `scientific_conventional.py` adds bounded calibration/preparation methods; `scientific_workflows.py` owns revisioned definitions/runs; `scientific_workflow_worker.py` executes private checkpoint dependencies on the existing scientific worker. `scientific_api.py` supplies shared admission, review, source-unit/lineage guards and calibration publication. Catalog version is `stratax-science/1.1`; regenerate the browser mirror with `scripts/generate-science-catalog.py`.
- Canonical workflow/run/calibration records are owner-scoped Firestore subcollections, separate from project view metadata. Sample arrays remain in chunked artifacts. Checkpoint acceptance publishes selected datasets atomically; an earlier accepted checkpoint survives a later failure. Unknown dispatch outcomes retain their reservations.
- Published depth outputs can bind a downstream scope by step ID. Within a segment, private outputs cannot be selected by unrelated calculations. Resampling requires explicit reviewed spacing/reference/interpolation/gap rules; ordinary multi-dataset methods verify retained physical axes.
- Logging-run depth anchors and interwell ghost display anchors are distinct. Ghost anchors retain marker evidence and become stale when that evidence changes. Display fills/ghosts do not create lithology or fluid interpretations.
- Approved units/calibration for the actual TMB field study remain missing. Controlled fixtures verify calculation contracts and publication behavior, not field geology. Full field acceptance, native zoom/account-switch browser qualification and live paid-worker qualification remain pending.
- Existing endpoints and originals remain retained. Expanded fingerprints may mark legacy scientific runs stale. Existing empirical permeability configurations need explicit calibration bounds before execution.
- Details and evidence: [PETROPHYSICS_WORKSPACE_2026-10-31.md](PETROPHYSICS_WORKSPACE_2026-10-31.md).

## Current deployment - updated 2026-10-31

- Frontend: [STRATAX](https://stratax-seismic-workbench.neonwhale8.chatgpt.site), public Site version 6. Source `27e78ffb60dcc5381050fc9d90de7478a731fcd4`; deployment `appgdep_6ae59f5950d08191b4ae2712177c203b` succeeded. Versions 3-5 below are release history, not current production.
- Cloud: project `project-9afac`, region `us-central1`. API `stratax-api-import-bundles-1031c` was verified Ready at 100% traffic. Import worker build `a18238d9-2473-4050-8076-9893c0173ae7` is aligned; science/seismic jobs were unchanged in the latest release.
- Evidence: candidate/production `/api/health` passed and the fresh API revision ERROR query was empty at deployment. These are recorded release checks, not a fresh live check during this documentation update. Exact builds, digests and receipts: [IMPORT_BUNDLES_2026-10-31.md](IMPORT_BUNDLES_2026-10-31.md), `.release/import-bundles-20261031/deployment-receipt.json`.
- Import remains Files -> Review -> Match -> Mapping -> Import. Real observed stages/counters, elapsed time and observation age replace the idle-looking 0%; unknown totals stay indeterminate. Lower per-file bars are removed. The enlarged viewport-bounded panel keeps its footer outside scrolling content.
- Files can attach deviation to a selected log before advancing. Stable well IDs carry the association; conflicts and excluded/removed owners require review. Log-derived header creation is an explicit checkbox, using available metadata only.
- ZIP originals are retained; selected entries have independent asset IDs, paths, editable types and well associations. Directory-scoped companions, inclusion controls, exclusion notes and transient passwords preserve reviewability. Core limits: 100 total assets, up to 99 extracted entries for one ZIP, 256 MiB/member and 1 GiB cumulative expansion. See the release document for nesting, metadata, timeout and format boundaries.
- Sources Actions: Inspect, Rename, Download original, Import/reclassify and Delete to restorable Trash. Display names change independently of physical originals. Trash preserves originals, datasets, associations and retained storage usage.
- Key implementation files: `frontend/dist/well-importer.js`, `well-import-ui.js`, `well-import.css`, `archive-intake.js`, `archive-worker.js`, `ingestion-client.js`, `source-actions.js`; native progress/ownership in `backend/imports_api.py`, `ingestion_worker.py`, `ingestion_core.py`, `well_ingestion.py`.
- Verification boundary: source checks and operational release checks passed. Browser/data/ZIP fixtures, scientific acceptance and speed benchmarks remain unrun; no agent-started import jobs. Preserve the existing source-only restriction until the user changes it.
- Preserve unrelated dirty seismic work. Latest backend release used an isolated previously-live source plus three scoped overlays. Root GitHub publication remains deferred; the separate Site source was committed/pushed for deployment. Keep recovery archives and registry-tagged/live/worker images.


## 2026-10-31 - Progress, related deviations and ZIP intake deployed

- Site version6 succeeded at https://stratax-seismic-workbench.neonwhale8.chatgpt.site; source `27e78ffb60dcc5381050fc9d90de7478a731fcd4`, deployment `appgdep_6ae59f5950d08191b4ae2712177c203b`; existing public audience preserved.
- Progress now shows observed startup/verification/row/chunk/validation/finalization work, elapsed time and observation age; unknown totals are indeterminate and lower per-file bars are removed. Added Files-stage deviation attachment with editable ownership and explicit conflict review.
- ZIP intake preserves originals and paths, detects editable file types and well suggestions, offers per-entry selection and exclusion notes, isolates companion folders and preserves reviewed entries on password retry. Integrity-verified zip.js2.24.0 is vendored with license/provenance. Passwords are transient. Bounds:99 extracted entries for one ZIP,100 total assets,256 MiB/member,1 GiB cumulative expansion,10,000 inventory entries,8 MiB metadata, three nested ZIP levels and a two-minute deadline. Unsupported/unsafe/ambiguous cases remain review exclusions; conversion may still be needed.
- API `stratax-api-import-bundles-1031c` Ready at100%, import worker image updated without agent-started executions; science/seismic jobs untouched. Candidate/production health passed, fresh revision ERROR query empty. Prior API protected as `import-bundles-previous`.
- Verification:7 application JavaScript syntax checks,1 vendor syntax check,3 Python AST checks, relative imports, whitespace, CSS balance, staged-source/hash review. Browser/data/ZIP fixtures, numerical and performance acceptance remain unrun under the continuing source-only restriction. Existing user-triggered execution status/logs were read only.
- Cleanup:66 registry images inventoried,39 scoped tagged/protected,27 out of scope, zero eligible/deleted; zero local junk removed. Retain `.release/import-bundles-20261031` receipts/recovery and vendor source evidence. Unrelated seismic drafts preserved; root GitHub publication deferred. See [IMPORT_BUNDLES_2026-10-31.md](IMPORT_BUNDLES_2026-10-31.md) and deferred acceptance scenarios.


## 2026-10-31 - Import panel/footer correction deployed

- Site version5 succeeded: source `1c378c50bf471a7be3c86b79e69cf9239ac5180c`, deployment `appgdep_6ae586f41fb08191bf664a838b99b949`; existing public audience preserved.
- CSS-only fix in `frontend/dist/well-import.css`: larger viewport-bounded panel (1440px maximum width), definite dialog height, bounded grid/flex children, independently scrolling stage content and a non-scrolling Back/Continue/Cancel footer. Review/mapping expansion no longer grows the outer dialog; narrow layouts retain the same footer containment.
- Focused CSS bounds/cascade/scroll source review, balanced blocks and whitespace checks passed. Browser/data tests remain unrun under the continuing source-only restriction. Deferred screenshot regression cases were added to `WELL_WORKFLOW_ACCEPTANCE.md`.
- No backend build/deployment or job execution. Cleanup inventoried64 images:37 scoped images all tagged/protected,27 out of scope, zero eligible/deleted; zero local junk removed. Retain `.release/import-panel-layout-20261031` recovery/provenance. Unrelated dirty work is preserved; root GitHub publication remains deferred.


## 2026-10-31 - Import UI refinement deployed live

- Site version4 succeeded at https://stratax-seismic-workbench.neonwhale8.chatgpt.site, source `b10c3afbda73298e7b635153b696f2a6feb404a7`, deployment `appgdep_6ae58154a9188191a36c3f623420f2c7`; existing public audience preserved.
- Redesigned all five import stages with original SVGs, readable mapping/association cards, explicit log-derived header opt-in, actual byte/file progress and committed-success thumbs-up/review popup. Source Actions offers Inspect, Rename, Download, Reclassify and Delete to restorable Trash; originals/datasets/quota remain retained. Sources/datasets resolve known well names.
- Eliminated redundant unit/reference preview reads, unnecessary prehashes for new Cloud originals, fresh-session status requests and repeated native fingerprints within one dispatch. Fixed concurrent resumable-session field updates. Upload speed remains unbenchmarked.
- API `stratax-api-well-import-ui-1031b` Ready at100%; candidate/production health passed, zero fresh revision ERROR logs. Import/science job images updated without executions or resource changes. Previous live revision retained as `well-import-ui-previous`.
- Source-only checks:9 JavaScript syntax checks,4 Python AST checks, relative imports and whitespace passed. No browser/data/scientific/performance tests. Release source derives from the previous isolated live release plus four scoped backend overlays; unrelated seismic drafts were excluded.
- Cleanup:64 registry images inventoried,37 scoped tagged/protected,27 out of scope, zero eligible/deleted; zero local junk removed. Recovery/provenance remains in `.release/well-import-ui-20261031`. Root GitHub publication remains deferred; separate Site source only was committed/pushed. See [IMPORT_UI_RELEASE_2026-10-31.md](IMPORT_UI_RELEASE_2026-10-31.md).


## Current live well-workflow release - 2026-10-31

- Well-workflow source is now deployed. Current Site version3: `appgprj_6ae37700e488819196b149dee2c6053f~appgver_75bb8528ad848191a3c13efda739164e`, successful deployment `appgdep_6ae57207eb6481919148f3065553ca6b`, source `3ba2fd4cd0a3d7a4326b7f28e88519ec74b0525a`, same public URL/audience.
- Current API: `stratax-api-well-workflow-1031a` at100% in `project-9afac` / `us-central1`. Import/science workers use the matching new digests in `WELL_WORKFLOW_DEPLOYMENT_2026-10-31.md`. Seismic/models/acoustic workers and disabled-engine gates are unchanged.
- Use `/api/health` for operational HTTP verification; it returned OK before/after promotion and fresh revision ERROR logs were empty. `/healthz` returned an edge404 in this environment. Direct Site asset fetch returned403; native publication success is the frontend deployment verification.
- Isolated backend package is based on exact API28 live source plus only well-workflow overlays. Never deploy the dirty root backend wholesale: unrelated seismic draft files must remain excluded. Keep ignored `.release/well-workflow-20261031` receipts, archive and source; keep `.release/sites-seismic-v2` as the separate frontend source checkout.
- No data/browser/scientific/benchmark tests authorized by this deployment request. Root GitHub publication remains unauthorized. Required cleanup retained all61 tagged/protected images, with zero local/image deletions.


## Current local well-workflow contract (2026-10-31)

- Maintained application: `frontend/dist`. The shared shell uses `workbench.js`/`workbench.css`; original routes, scientific APIs and disabled-engine gates remain authoritative.
- Import sequence is Files -> Review -> Match -> Mapping -> Import. `well-importer.js` orchestrates existing browser/native readers. Per-asset keys are client UUIDs, independent of filenames and retained-original IDs; old single-family/per-file requests remain readable.
- `well-data.js` and `well-evidence.js` provide suggestions, stable registrations, duplicate evidence and browser coordinate/survey support. `backend/well_ingestion.py` decorates native evidence. `ingestion_native.py` additionally retains scalar DLIS/LIS identity observations and flags conflicts. Table identifiers preserve leading zeroes.
- `wellDrafts` retains existing IDs and gains names, UWI, aliases, evidence references and active survey/checkshot IDs. Shared marker definitions/picks live in `stratigraphy`. Full measurements stay in original/chunk artifacts; view state stores references, styles and bounded metadata.
- Log-section visibility is separate from imported column selection and persists per workbook. Templates use unique confirmed type/unit matches and report exceptions. Imported marker correlations connect actual compatible picks and are not geological surfaces.
- Depth conversion requires compatible active survey references; supplied observations remain unchanged. Checkshot QC keeps original rows separate from derived values and requires a referenced TVD conversion for MD interval velocities. Implementation bounds and every deferred scenario are in `WELL_WORKFLOW_ACCEPTANCE.md`.
- Only source checks are authorized for this milestone. No deployment, tests/data/browser execution, paid Cloud processing or Git publication occurred. Speed improvements and numerical qualification remain unverified. Preserve unrelated seismic draft changes and the previously documented live state.


## Current local implementation — 2026-10-30

- Authoritative completion ledger: `SEISMIC_ENGINE_COMPLETION.md`. First three engines have local implementation/source-review passes; Velocity has an unwired draft;5–16 have not had their completion pass. Overall implementation is incomplete. Testing and deployment remain pending, separately from implementation gaps.
- Standing scope: backend only, Google Cloud cost efficiency, sequential engines. Do not run scientific/automated/browser/benchmark tests, build/deploy images, provision infrastructure, execute paid jobs, change UI availability or invent source geometry/calibration/pricing.
- New field path extends existing owner-scoped FastAPI/Firestore/GCS admission. Server-reviewed `STRATAX_SEISMIC_FIELD_PROFILES` and explicit `STRATAX_SEISMIC_STORAGE_POLICY.maximumBytes` control Batch resources/pricing/storage. These settings are not configured by this work. Shared per-project execution admission stays at one; independent indexing defaults to recoverable CPU/Spot, while coupled MPI needs an explicit standard-VM profile. No automatic GPU/standard fallback.
- Field indexing currently covers native SEG-Y/SU originals and compatible retained locator indexes. Existing bounded format adapters remain. Native discovery is a checkpointed streaming phase; analytical partitions are distributed. Lossless arrays and labelled display pyramids are separate. Fanout256 directories and checksummed generation-pinned256KiB ranges avoid whole-survey reads. Missing/duplicate/ragged support and unknown references stay explicit.
- New `indexed-volume`/`indexed-traces` bindings connect accepted indexes to bounded physical slices and well ties. Reviewed source/geometry versions and actual CRS/datum are required. Paired well sampling avoids materialising a section for each trajectory sample. Calibration, wavelets and ties persist separately; private named exports use owner-scoped expiring signed access.
- Capability responses add implementation/configured-execution/testing/deployment distinctions. This is source metadata only; no field-scale qualification or full-programme completion is claimed. Legacy bounded estimates still exclude storage/network fees; complete full-cost coverage across all engine paths remains work to finish.
- Live frontend/API/workers unchanged by local work. Site is public according to the user's later explicit sharing instruction; original private-audience descriptions are historical. No new access check or scientific verification was performed.

## Current frontend — 2026-10-29 UI-only redesign

The Site (now public by later user instruction) https://stratax-seismic-workbench.neonwhale8.chatgpt.site serves source b2902f2f2113fc8a398dd2a27234e5e926674c20, successful deployment appgdep_6ae397e67ae88191bc8838c1dcdd3f8f. Keep Site project appgprj_6ae37700e488819196b149dee2c6053f and its audience; source checkout .release/sites-seismic-v2 remains separate from root GitHub origin. Root frontend/dist is the maintained source.

Seismic engines is a Processing tab, not a sidebar page. #processing / #seismic-qi both highlight Processing; #interpretation / #seismic retain the single Interpretation entry and independent log/seismic state. Shared new UI modules are seismic-ui.js, seismic-ui-availability.js, seismic-engine-controls.js and seismic-studio.css. Processing and seismic interpretation retain separate workbook/layout/source state.

seismic-ui-availability.js deliberately follows SEISMIC_BACKEND_CHECKLIST.md: incomplete tools are visible but disabled with explanation; saved configurations/results remain inspectable. Computational handlers also reject unfinished tools/graphs. Only Slices is enabled in Seismic engines. Its volume binding requires an existing reviewed geometry revision and explicit inline/crossline indices; no geometry or sample data is fabricated. Primitive controls supplement advanced JSON; they do not complete the remaining scientific/model workbooks.

The user still excludes testing. Only source parsing/diff checks and packaging/publication were performed; no browser/data test, worker execution or new acceptance claim. Backend API/worker images, quotas and auth remain unchanged.

## Current backend — 2026-10-29 source-bound engine additions

API production is **`stratax-api-00028-wew` at100%**, image `sha256:dbff3328d9d1f7580fdf16667f34fcaf54a9192580571875939d96b5c33089ce`; revision24 remains tagged `seismic-backend-previous`. The API deployment below is unchanged by the subsequent UI-only Site publication described above. Final job images and receipts are in SEISMIC_BACKEND_IMPLEMENTATION_2026-10-29.md. All older deployment sections below are historical.

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
