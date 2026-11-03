# Familiar petrophysics workspace — local implementation and qualification

## Release state

Deployed live on 2026-10-31: Site version 7 and API `stratax-api-petrophysics-1031d` at 100% traffic, with matching Ready science job image. Site source was published through its dedicated repository; root Git commit/push and paid scientific executions were not performed. Existing importer and unrelated seismic drafts were preserved. See the deployment milestone below. The implementation is **not field-qualified**: the required complete real multiwell study has not been accepted through the three checkpoints.

The six TMB LAS originals contain `UNKNOWN` units on nearly every non-depth channel. Approved curve units, formation-temperature Rw, matrix/shale assumptions and permeability calibration evidence have not been supplied for this study. These remain scientific blockers; test constants are not field interpretations.

## References and baseline gaps

| Reference / baseline | Resulting behavior |
| --- | --- |
| [Techlog template reuse](https://www.youtube.com/watch?v=qh5-kFpUJv4) | Review unique, missing and ambiguous associations before applying a layout to the selected well or workbook. |
| [Petrel ghost curves](https://www.youtube.com/watch?v=xYwKibD5NJw) | Structural overlays, independently reviewed marker pairs, editable display anchors and multiple ghost curves. Geological display transformations remain separate from logging-run depth matching. |
| Existing icon-only tool groups and modal run history | Labeled Home, Logs, QC, Petrophysics, Correlation, Workflows and Reports tabs; contextual Properties; resizable/collapsible panels; persisted layout; bottom run panel. Specialist groups remain accessible. |
| Recipes reopened independent configurations | Revisioned workflow definitions, frozen run records, private within-segment dependencies and atomic checkpoint publication on the existing worker. |
| Row-alignment checkbox without physical-axis verification | Retained depth indices are now checked; explicit resampling records require axis/reference, bounds, spacing, interpolation and gap rules. No row-position join or extrapolation. |
| Calibration and reporting gaps | New preparation/calibration operators, source-bound calibration records, inherited parameter review, cutoff scenarios and accepted-result report exports. |

The video links are interaction references supplied with the approved plan. This implementation does not claim additional video viewing. Numerical behavior is checked against analytical fixtures and documented methods rather than tutorial defaults.

Scientific references include [SLB's Pickett definition](https://glossary.slb.com/en/terms/p/pickett_plot), the [Kansas Geological Survey's a·Rw calibration description](https://www.kgs.ku.edu/software/Pf/description.html), and [USGS Open-File Report 90-31, equation 10](https://pubs.usgs.gov/of/1990/0031/report.pdf) for the Celsius resistivity-temperature relation. The fluid correction requires a supplied constant and applicability citation; it does not equate mud resistivity with formation-water Rw.

## Implemented surfaces

- Project Browser retains Wells → datasets/runs → curves, visibility controls and source identity. Zones, Interpretations, Templates, Workflows and Results have working entry points.
- Layout version 2 adds bounded panel dimensions, selected ribbon/Properties tabs, drawers, run history and Reset layout without replacing legacy workbook IDs or source data.
- Workbook comparison preserves independent active contexts and scroll positions. Drag/drop, overlays, track/curve controls, context menus, F4, Escape, linked depth navigation, fitting, selection, crossplots and exports remain available.
- Histograms use retained samples and a selected interval when present. Zones have editable tables and draggable boundaries; parameter overrides can be edited at project, well and zone levels.
- Ghost anchors retain marker IDs, names, references, supporting depths, source versions and review evidence. Changed markers invalidate their overlays. Multiple rulers use supported references or a feet conversion of the current reference.
- Conventional methods remain individually accessible. New methods: `depth-match`, `align-curve`, `endpoint-proposal`, `temperature-profile`, `resistivity-temperature`, `porosity-combine`, `pickett-fit`.
- Temperature supports supplied anchors or a gradient. Fluid-resistivity inputs support Celsius, Fahrenheit and Kelvin, with the documented calculation evaluated in Celsius. A temperature profile requires a matching retained vertical reference.
- Pickett fitting exposes m and a·Rw, optional independently known a or Rw, supporting pairs and fit statistics. Its log–log view links preview points to retained depths.
- Saturation records the reviewed porosity basis. Empirical permeability requires calibration evidence and application bounds; regression reports held-out validation and restricts application to its training porosity range.
- Cutoff scenarios retain separate configurations and results. Rule sliders edit explicit thresholds; comparison displays parameters, summaries and warnings. Reservoir/pay meaning remains a reviewed interpretation.
- Reports select current accepted runs, include accepted preview plots, parameters, coverage/exclusions, warnings and provenance, and export summary CSV, complete accepted-row CSV and print-ready HTML. The current workbook is optional, explicitly labeled comparison evidence.

## Execution contracts

- Owner-scoped `/science/workflows` list/get/put/delete/validation and `/science/workflow-runs` create/list/status/start/cancel/checkpoint-review routes extend the existing project API. Existing single-method endpoints remain.
- Definitions contain ordered method IDs, concrete per-well bindings, parameters, zones, checkpoint boundaries and output step selections. Proposed mappings for another well remain unconfirmed; missing/ambiguous matches block execution. Every well needs all three checkpoints.
- One existing scientific job executes each explicit segment. The project lease, global capacity, artifact reservation, storage accounting and bounded input readers are shared with ordinary scientific runs.
- Within-segment results are private. Acceptance publishes selected datasets and calibration records in the review transaction; rejection publishes none and blocks continuation. Earlier accepted checkpoints survive a later failure or cancellation.
- A later checkpoint can bind a published output using `{stepId, output, unit, confirmed}`. Its index can use `scope: {stepId, output: "depth", unit: "m", reference: "MD"}`; the server resolves this to the accepted artifact, not a guessed row join.
- Input fingerprints include units, references, indices and mappings. Accepted-source ancestry is checked again before downstream use and publication. Changed ancestors mark runs stale. View edits also remove affected draft confirmations.
- Source-unit guards prevent relabeling retained values as another scale. Reviewed unknown units can be supplied explicitly; a known stored unit must match its declared input scale.
- Cancellation retains reservations until settlement. Repeated submission identifiers do not dispatch twice. A lost dispatch response retains the reservation because a timeout does not prove that the worker failed to start. An unconfirmed dispatch without a recoverable operation may require operational reconciliation.
- Workflow/run/calibration records are separate from project view metadata. Sample arrays remain in bounded chunked artifacts. Reload uses persisted run state and actual worker progress.

## Verification

| Check | Result |
| --- | --- |
| Python numerical + owner API + workflow integration | **93 passed**; includes two-well, mixed-unit checkpoint publication/rejection, accepted conditioned-curve reuse, private porosity/saturation chaining, explicit alignment, ancestry invalidation, idempotency, cancellation and settlement. Cloud APIs mocked. |
| Current workspace browser suite | **21 groups passed**, all **64** non-log-view configurations opened, zero page errors and zero Cloud content requests. Includes individual ghost-anchor review/invalidation and reference rulers. |
| Six actual TMB LAS files | **20 groups passed** before the final anchor-specific addition; original hashes unchanged and no content uploaded. Display/interaction acceptance only. |
| Two generated 250,000-row datasets | **20 groups passed** before the final anchor-specific addition; zero page errors/Cloud content requests. This is a supported-limit functional stress check, not a formal latency benchmark. |
| Mocked Cloud report/workflow UI | **5 checks passed**: accepted-only selection, HTML provenance/plots, Chromium A4 PDF rendering, complete-row CSV and structured workflow binding save. No real job dispatch. |
| Layout widths | 320, 768, 1024, 1440 and 1920 px checked. Native browser zoom is not separately qualified. |
| Source checks | JavaScript syntax and `git diff --check` passed. |

Commands:

```text
.venv\Scripts\python.exe -m pytest backend/tests/test_petrophysics_workflows.py backend/tests/test_scientific_api.py backend/tests/test_science.py -q --basetemp=.tmp_petrophysics_all_tests
node scripts/verify-well-canvas.cjs --petrophysics
node scripts/verify-well-canvas.cjs --six-las --petrophysics
node scripts/verify-well-canvas.cjs --petrophysics --large
node scripts/verify-petrophysics-cloud-ui.cjs
.venv\Scripts\python.exe scripts/generate-science-catalog.py
```

Receipts are retained under `.release/petrophysics-*-verification.json`; existing recovery archives remain intact. The Windows sandbox blocked Python socket-pair creation and Chromium startup, so those local tests ran with approved escalation. No paid runtime qualification was substituted with mocks.

## Compatibility and remaining qualification

- Legacy workbooks and originals remain retained. Expanded source fingerprints can mark old scientific runs stale; their artifacts are not deleted. Existing empirical permeability configurations now need explicit calibration application bounds before execution.
- A real complete mixed multiwell conventional study, with all required calibrated properties, flags, zonal summaries and accepted reports, remains outstanding pending the approved scientific inputs above.
- Live worker dispatch/restart/cancellation, shared capacity under live load, deployment compatibility, account/project-switch browser scenarios and native zoom still require release qualification. Paid Cloud bounds and deployment/publication authorization remain separate.

## Cleanup

Removed the three verified `.tmp_petrophysics_*` test directories after validation. Preserved original LAS files, unrelated dirty work, operational scripts, `.release` receipts and recovery assets. No images were built or deployed. The cached 66-image inventory was reviewed: all cached images are tagged, including 26 API and 6 science-worker images, so those are retained. This was not a fresh live registry audit; no registry deletion was attempted.

## 2026-10-31 - Petrophysics deployed live (Site v7)

- Site version 7 succeeded at https://stratax-seismic-workbench.neonwhale8.chatgpt.site; source `7ccdbc3f1b78c2a0eec690927e91a3d3c3339468`, deployment `appgdep_6ae64903b1408191a83868b44b9dcbd7`. Public audience preserved.
- API `stratax-api-petrophysics-1031d` is Ready at 100% traffic. Build `f263b613-df2c-47e3-a45f-679cc758379c`; science build `22bc6d42-72fd-4aba-a8be-3757468dd03b`. Matching science job image verified and Ready; resources unchanged, zero agent-started executions. Import/seismic jobs unchanged.
- Candidate/production health passed; workflow route correctly requires authentication (401), DELETE CORS passed, fresh revision ERROR query empty. Live petrophysics JS/CSS and interpretation module match release hashes. Read-only Chromium smoke: title, visible page, stylesheet present, zero page errors. Hosting modifies index HTML; its byte hash differs. Authenticated live workflow execution is not qualified.
- Release overlays only 8 backend and 6 frontend files onto the completed importer baseline. Unrelated dirty seismic/importer changes preserved. API rollback tag `petrophysics-previous` retains `stratax-api-import-bundles-1031c`; Site version 6 remains available. Previous science digest and final job settings are in `.release/petrophysics-live-20261031`.
- Prior local validation: 93 Python tests, 21 current browser groups, 5 mocked Cloud/report checks. Real field qualification still requires approved TMB units/Rw/matrix/shale/permeability evidence; no fixture defaults substituted. Paid Cloud study acceptance and root commit/push remain separate authorization steps.
- Cleanup inventory: 68 images total, 34 API/science images all tagged/protected, zero eligible/deleted; zero disposable local files removed. Preserve all release archives/receipts and user recovery assets. See `PETROPHYSICS_WORKSPACE_2026-10-31.md` and `.release/petrophysics-live-20261031/deployment-receipt.json`.
