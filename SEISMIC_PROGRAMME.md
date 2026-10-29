# Seismic programme — implementation ledger

Approved scope: a separate seismic workspace matching the petrophysics interaction model; land P-wave and towed-streamer reflection; 2D/3D processing, interpretation, quantitative interpretation, geological models/export, acoustic RTM/FWI and 4D. Unstacked SEG-Y plus reviewed geometry is the raw-processing input. Native recorder certification, OBS/DAS, elastic/anisotropic FWI and simulator execution are excluded.

One complete production release is required. Internal source checkpoints are not releases. Do not publish an incomplete implementation or describe registry entries as verified capabilities. The existing 1 TiB processed-volume and 10 TiB aggregate-prestack goals are acceptance targets, not current measured capacity. Large runs require a version-bound estimate and explicit approval; implementation authorization is not spending approval.

## Acceptance ledger

The exhaustive operation/case ledger is [SEISMIC_ACCEPTANCE.md](SEISMIC_ACCEPTANCE.md). The milestone table below is a summary, not an alternative acceptance inventory. All complete milestone gates remain open.

| Milestone | Acceptance | Status |
| --- | --- | --- |
| M0 | Source/operation contracts, reproducible fixtures, numerical tolerances and resource profiles | In progress |
| M1 | Immutable survey indexing, analytical storage and bounded persistent viewer | In progress: indexed Cloud native traces, bounded vtk.js 3D amplitudes and independent books; full-survey/distributed storage, linked maps/slices and provider/field qualification pending |
| M2 | Well calibration, manual/assisted horizon/fault interpretation, export/reload | In progress: manual horizon/fault sticks and reviewed section tracking; full well ties and surfaces pending |
| M3 | Reviewed velocity conversion, structural framework, maps and uncertainty | Numerical Dix/time–depth foundations only; complete workflow pending |
| M4 | Actual land shot records through reviewed processing graph and image | Bounded graph execution/approval/review source and local integration fixture; full processing/field image pending |
| M5 | Actual 2D/3D marine correction, demultiple and prestack imaging | Pending |
| M6 | AVO/inversion and independently evaluated property predictions | Numerical Shuey and matrix-free post/prestack inversion only; hosted quantitative workspace/field comparison pending |
| M7 | Validated faulted grids/properties and interoperable model exports | Pending |
| M8 | Acoustic 2D/3D RTM/FWI, adjoint/gradient and declared-scale checks | Small compiled 2D/3D acoustic adapter adjoint/Taylor qualification passes; RTM/FWI application, MPI/GPU and field workflows pending |
| M9 | 4D signal preservation, all integration/capacity gates, hosted acceptance | Numerical stable-mask gain/lag matching and repeatability only; integrated workflow pending |

No milestone has met its complete acceptance gate. This is an internal source checkpoint, not the complete programme or a production release.

## 2026-10-29 indexed traces and 3D continuation

- See SEISMIC_INDEXED_3D.md for exact source contracts, limits, build reproduction/notices and candidate provenance. Existing import chunks now retain exact variable-trace locators/checksums and conservative bin bounds. Source/metadata generations and original headers are verified in API and Batch reads. Native newer-header fallback remains; source arrays are never regularised silently.
- Added actual 3D poststack amplitude workbooks using locally bundled vtk.js 38.0.4. Explicit bin ranges/masks, duplicate/raw-gather rejection, matching geometry revisions, camera persistence, display scaling, JSON export and forced graphics recovery pass the loopback UI. Bin-coordinate display does not establish complete survey geometry, physical-coordinate maps or 3D interpretation/tracking.
- Full backend: 171 passed/four acoustic skips; subsequent focused native-reader suite four passed including an additional compatibility case. JS/account: 12. Loopback browser: 10 groups, zero page errors/Local-content uploads. Linux import/seismic builds pass 27/39 checks; neither is deployed. Scope/field/capacity/hosted gates remain open; zero complete milestones are accepted.

## Earlier 2026-10-29 continuation through 867fd7d

- Continued beyond source checkpoint `5256b4c` with a real header-geometry review path: branded Processing dialog, explicit byte/width/signed role mapping, coordinate/elevation scalars, native units/axis order/CRS/datum declarations, retained-header preview, exact-settings save guard, immutable revisions/conflicts, reload and JSON export. Source and owner changes are checked. Only metadata is declared; no axes/units/CRS are silently transformed, and geometry-coupled execution remains blocked until survey QC is implemented. Eight new geometry tests and the expanded nine-group loopback browser suite pass.

- Added `#processing` between Map and the single Interpretation entry. Mixed projects expose Petrophysics/Seismic mode controls; seismic, processing and petrophysics keep separate state. Processing books have an editable graph/ribbon/source browser/properties and persisted revisions, source/domain/amplitude requirements, explicit Local-to-Cloud copy and scope guards for account/project changes.
- Added version-bound resource estimates/approval, idempotent Batch submission, cancellation/reconciliation, bounded checkpoint restart, private result/provenance retrieval and shared review into independent downstream dataset versions. Existing quotas/small workers remain intact. The executable hosted capability is limited to a configured bounded preview profile; there is no commissioned production profile. The loopback integration fixture runs the actual scientific worker with fake provider/identity/storage boundaries; it is not a real hosted Batch acceptance.
- Added full variable-length trace/header SQLite indexing and sharded ragged analytical arrays. A real 1.67 GB Stratton raw swath completes local analytical storage and independent sample comparisons; its geometry needs reviewed header roles/units/auxiliary classification. See SEISMIC_REFERENCES.md. Cloud field indexing and bounded survey map/slice/3D services remain open.
- Added an SI-facing Devito acoustic adapter with explicit geometry, fixed stability-bounded time step, bounded saved-wavefield allocation, source/Born adjoints and objective gradient. Four compiled tests pass in actual 2D/3D on frozen small fixtures. This is not complete RTM/FWI orchestration or field acceptance. Exact images/compiler/source obligations are in backend/SEISMIC_NOTICES.md.
- Latest verification: 164 backend tests pass, four acoustic tests skip on Windows and separately pass in the pinned Linux image; 12 JavaScript model/account tests; nine seismic browser groups including actual loopback geometry review/processing/review/downstream use; existing six-LAS regression passes 17 groups/57 configurations. Browser suites report zero page errors/content uploads and unchanged LAS hashes.
- All M0–M9 complete gates remain open. No complete production release, signed-in hosted seismic acceptance or populated 1 TiB/10 TiB benchmark has occurred. Production remains Sites v15 / API revision 17. Existing quotas were not raised; no large run was approved or dispatched.

## Earlier source checkpoint 352c335

- `#seismic` is independent of the existing petrophysics canvas. It reuses project storage/authentication and branded controls, with searchable retained sources, up to four resizable sections, exact source-index picks, locks/table editing, ordered fault sticks, undo/redo, named workbook versions and real CSV/JSON exports. Source samples never enter saved workspace JSON. Cursor linking is restricted to matching retained source versions while shared survey datums remain unconfirmed.
- Local and owner-scoped Cloud section readers access the retained SEG-Y/SU original in bounded ranges, not importer previews. The new direct adapter explicitly supports fixed-length rev 0/1 layouts and the tested numeric encodings. Existing native ZGY/SGZ import support remains; those formats and variable layouts are not supported by this new direct section route.
- Worker-side SEG-Y indexing writes lossless sharded Zarr v3 analytical arrays, masks, a SQLite trace/geometry index and separate labelled display levels. An indexed generated source round-trips exactly. Unknown time convention, CRS and datum remain unconfirmed. This is not yet the distributed Cloud survey-indexing service; variable trace lengths require further adapter work.
- Tracking uses analytical section amplitudes, seed-centred event/correlation constraints, explicit trace barriers and stop reasons. Amber proposals require acceptance, never replace manual/locked seeds, and retain source version, seed coordinates, settings and bounds. Correlation is not statistical geological confidence. This is bounded 2D section tracking, not 3D horizon propagation or fault-surface reconstruction.
- New API routes share existing owner/policy/project boundaries. Interpretation saves check source bounds, source fingerprints and transactional revisions. Missing originals return friendly errors while drafts remain. Graph validation checks supported operations, dependency cycles, parameters and a metadata budget; it explicitly reports that hosted execution is unavailable.
- Numerical foundations cover filtering, anti-aliased resampling, static shifts, elevation correction, NMO/stretch mute, semblance, stacking, FK filtering, four basic attributes, Dix conversion, checkshot/sonic time–depth calibration, wavelets/synthetics, Shuey fitting, repeatability and stable-mask gain/lag matching. They are not the complete land/marine processing graphs.
- PyLops poststack and Aki–Richards prestack inversion use matrix-free regularised solves with explicit background models, forward residuals and solver diagnostics. Independent matrix/forward and adjoint checks pass. AGC/normalised/display products and mismatched wavelet sampling are rejected. The hosted quantitative workflow, blind-well assessment and field validation remain pending. See `backend/SEISMIC_NOTICES.md` for dependency notices and distribution obligations.

### Verification and release boundary

- Full backend regression at this checkpoint: 141 passed. Subsequent focused API/inversion checks cover later provenance/error/parameter validation changes; exact results are recorded in STATUS.md.
- JavaScript model/reader/tracking checks: 5 passed. Local browser acceptance: 7 groups, zero page errors and zero Local seismic-content Cloud requests, including reload, review/acceptance, barriers, locks, exact analytical-range undo and responsive controls.
- Existing six-LAS petrophysics browser regression: 17 groups / 57 configurations passed, zero page errors/content uploads, original file hashes unchanged. Its legacy-depth fixture now explicitly clears formation flattening introduced earlier in that same suite; no petrophysics calculation/display code was rewritten.
- A sparse logical-array test is not a 1 TiB capacity demonstration. No 1 TiB volume, 10 TiB prestack project, field migration, RTM/FWI, faulted-grid export or integrated 4D acceptance has run. No large compute spending was approved or started.
- No API/worker/Sites deployment, account change, production promotion or partial release. Production remains Sites v15 / API `stratax-api-00017-saf`. Hosted signed-in acceptance of the new workspace has not occurred.

Next required work: finish Cloud indexing with variable trace metadata, reviewed geometry/domains, bounded map/slice/3D access and persistent resource payloads; commission and independently test the implemented bounded Batch control/worker path with current prices/IAM; finish all remaining M2–M9 application workflows and independent field/scale acceptance. Resolve legacy seismic shortcuts while preserving their existing configurations/results. Existing 10 GiB/file, 50 GiB/project and small-worker quotas were not raised. Do not convert numerical foundations or source checkpoints into full-programme completion claims.

## Required verification

Analytical fixtures establish numerical truth independently of engine wrappers. Default float64 operator comparisons use relative norm error <=1e-8 (absolute <=1e-10 for zero-valued references); float32 storage comparisons use <=1e-5. Geometry, support/masks and discrete identities must match exactly. Individual inversion/imaging cases specify resolution-aware tolerances before qualification. Adjoint tests target relative error <=1e-5; Taylor remainder must exhibit second-order convergence before roundoff dominates.

Record unit/domain/datum assumptions; preserve source versions and validity masks. Display gain/decimation never becomes an analytical source. Chunked operators must agree with whole-array fixtures without seams. Native format certification is per fixture/dialect, never by extension. Scientific fixture tolerances must not be loosened to conceal failures.

Reference workflows: https://wiki.seg.org/wiki/Basic_data_processing_sequence ; https://doc.opendtect.org/7.0.0/doc/od_userdoc/content/opendtect_trees_and_elements/horizon/new_horizon/auto_and_manual_horizon_tracking.htm ; https://pylops.readthedocs.io/en/latest/tutorials/ ; https://www.devitoproject.org/FAQ.html ; https://resqpy.readthedocs.io/en/stable/tutorial/cellular_grids.html .

## Completion

Candidate verification precedes the single production release. Preserve current petrophysics data/workbooks and user edits. Finish with scoped cleanup, factual status/context/handoff updates, reviewed commit and push to the existing StrataX remote. No large benchmark or scientific certification is implied by a small fixture test.
