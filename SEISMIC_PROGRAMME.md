# Seismic programme — implementation ledger

Approved scope: a separate seismic workspace matching the petrophysics interaction model; land P-wave and towed-streamer reflection; 2D/3D processing, interpretation, quantitative interpretation, geological models/export, acoustic RTM/FWI and 4D. Unstacked SEG-Y plus reviewed geometry is the raw-processing input. Native recorder certification, OBS/DAS, elastic/anisotropic FWI and simulator execution are excluded.

One complete production release is required. Internal source checkpoints are not releases. Do not publish an incomplete implementation or describe registry entries as verified capabilities. The existing 1 TiB processed-volume and 10 TiB aggregate-prestack goals are acceptance targets, not current measured capacity. Large runs require a version-bound estimate and explicit approval; implementation authorization is not spending approval.

## Acceptance ledger

| Milestone | Acceptance | Status |
| --- | --- | --- |
| M0 | Source/operation contracts, reproducible fixtures, numerical tolerances and resource profiles | In progress |
| M1 | Immutable survey indexing, analytical storage and bounded persistent viewer | In progress: bounded original reader, local native index and independent 2D workbook; large Cloud indexing/3D pending |
| M2 | Well calibration, manual/assisted horizon/fault interpretation, export/reload | In progress: manual horizon/fault sticks and reviewed section tracking; full well ties and surfaces pending |
| M3 | Reviewed velocity conversion, structural framework, maps and uncertainty | Numerical Dix/time–depth foundations only; complete workflow pending |
| M4 | Actual land shot records through reviewed processing graph and image | Numerical trace operators and graph validator only; hosted execution/field case pending |
| M5 | Actual 2D/3D marine correction, demultiple and prestack imaging | Pending |
| M6 | AVO/inversion and independently evaluated property predictions | Numerical Shuey and matrix-free post/prestack inversion only; hosted quantitative workspace/field comparison pending |
| M7 | Validated faulted grids/properties and interoperable model exports | Pending |
| M8 | Acoustic 2D/3D RTM/FWI, adjoint/gradient and declared-scale checks | Pending |
| M9 | 4D signal preservation, all integration/capacity gates, hosted acceptance | Numerical stable-mask gain/lag matching and repeatability only; integrated workflow pending |

No milestone has met its complete acceptance gate. This is an internal source checkpoint, not the complete programme or a production release.

## 2026-10-29 implementation checkpoint

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

Next required work: complete survey contracts/reference manifests and Cloud indexing with variable trace metadata, reviewed geometry/domains, bounded map/slice/3D access and persistent resource payloads; commission Batch estimates/approval/checkpointed execution; then finish the remaining M2–M9 workflows and their independent field/scale acceptance. Existing 10 GiB/file, 50 GiB/project and small-worker quotas were not raised. Do not convert these numerical foundations into claims that the full programme is implemented.

## Required verification

Analytical fixtures establish numerical truth independently of engine wrappers. Default float64 operator comparisons use relative norm error <=1e-8 (absolute <=1e-10 for zero-valued references); float32 storage comparisons use <=1e-5. Geometry, support/masks and discrete identities must match exactly. Individual inversion/imaging cases specify resolution-aware tolerances before qualification. Adjoint tests target relative error <=1e-5; Taylor remainder must exhibit second-order convergence before roundoff dominates.

Record unit/domain/datum assumptions; preserve source versions and validity masks. Display gain/decimation never becomes an analytical source. Chunked operators must agree with whole-array fixtures without seams. Native format certification is per fixture/dialect, never by extension. Scientific fixture tolerances must not be loosened to conceal failures.

Reference workflows: https://wiki.seg.org/wiki/Basic_data_processing_sequence ; https://doc.opendtect.org/7.0.0/doc/od_userdoc/content/opendtect_trees_and_elements/horizon/new_horizon/auto_and_manual_horizon_tracking.htm ; https://pylops.readthedocs.io/en/latest/tutorials/ ; https://www.devitoproject.org/FAQ.html ; https://resqpy.readthedocs.io/en/stable/tutorial/cellular_grids.html .

## Completion

Candidate verification precedes the single production release. Preserve current petrophysics data/workbooks and user edits. Finish with scoped cleanup, factual status/context/handoff updates, reviewed commit and push to the existing StrataX remote. No large benchmark or scientific certification is implied by a small fixture test.
