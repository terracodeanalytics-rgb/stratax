# Interpretation-page controls and workflow lifecycle

> Urgent interruption: upload-only hotfix published separately as Site v11 at stratax.terracodeanalytics.com. The wider batch remains OPEN. Latest continuation: result-state comparisons 3/3; two-well/two-zone lifecycle 10/10; workflow editor 1/1; Pickett activation/lifecycle 1/1; final scientific suites 194/194 and JS 3/3; syntax 8 Python / 20 JS, exact catalog 1.3 and scoped whitespace passed. Latest matrix: 744 handler groups, 554 exercised in passing cases, 172 with disabled explanations, 18 unresolved. Historical placements include prior broken/transient states; interaction counts alone are not completion. Curve CSV/SVG provenance changes still need their final combined export rerun. See upload release evidence and active HANDOFF for remaining actions.

Status: **open — the exhaustive every-button acceptance gate is not closed**. The corrections and verified paths below are implemented locally. Passing calculation methods does not prove every reachable control, dialog branch and context works.

Catalog remains `stratax-science/1.3`. No deployment, paid jobs, automation, Git publication, public endpoint additions, Cloud migration or rewriting of user originals occurred. Earlier scientific batches and unrelated dirty work are retained.

## Discovery and corrections

Failures were recorded before application edits in `.release/interpretation-buttons-20261108/discovery.md`, the discovery receipts and retained source copies. Later expanded probes added the six-LAS timeout, duplicate-name scenario comparison and guided-dialog failures before their corrections.

| Defect / reproduction | Correction | Evidence |
| --- | --- | --- |
| Shift+F10 on a curve bubbles to the enclosing track; Escape loses focus. | Stop the relevant keyboard events and restore the original curve focus. | Keyboard surface regression. |
| Export comparison SVG when the second workbook contains a different well. | Resolve the displayed well from that pane's workbook. | Independent comparison SVG contains real paths and the correct well label. |
| Export/import a workbook containing ghost curves: ghost identity/provenance disappears. | Validate and retain ghost transformations/source versions; remap retained marker IDs. | Ghost metadata roundtrip, anchor checks and reload. |
| Submit a ghost overlay with all six TMB LAS sources displayed: click times out during redraw. | Cache well extents, fitted ranges and ghost display context within one redraw; evaluate depth conversion once per station. Caches expire on redraw. | Six-LAS submit/reload passes without invented units/anchors; numerical path/null-gap regression. |
| Reopen structured workflow fields containing private cutoff/depth outputs. | Preserve named private output bindings, include supported depth/qualified choices, and retain explicit porosity-basis declarations. | Structured editor validates the saved two-well/two-zone definition. |
| Close a workflow with edited name or malformed JSON; draft disappears. | Persist project-scoped draft fields/raw JSON; restore them on reopen. | Valid and invalid draft recovery checks. |
| No structured definition file controls or saved-revision recovery. | Add export/import and explicit reload-saved controls to the existing dialog. Imported bindings/applicability require fresh review. Preserve conflict drafts. | File import/export and revision-conflict recovery. |
| Completed checkpoint opens through an older cached queued run and skips review. | Fetch current run state for evidence/history actions. | Real gated worker and checkpoint review. |
| Accumulated checkpoint curves exceed 30 tracks and block review. | Continue result display in another comparison workbook while retaining earlier views and publication boundaries. | Full evaluation checkpoint comparison/acceptance. |
| Array-only results advertise scalar log comparison; mixed arrays appear as scalar curves. | Persist array column type and exclude arrays from scalar display eligibility. Keep array/table evidence available. | All-method lifecycles and scalar/array JS regression. |
| Crossplot/fluid outputs cannot be reused because output units are absent; six other methods omit determinable units. | Preserve units for crossplot, fluid indicators, mineral residual, normalized images, seismic attributes, surfaces, kriging and synthetic outputs. | Eight new Python artifact regressions; actual accepted-result reuse/exports. |
| Native seismic input linking fails on Windows without symlink privileges. | Use a read-only hardlink fallback in the temporary native reader path. | Actual generated SEG-Y worker lifecycle. |
| Graphical zone edits leave draft run references attached. | Detach affected draft results and clear confirmations; retain historical accepted results. | Existing zone/editing checks and scientific suites. |
| Parameter-only accepted results offer a curve CSV action which silently produces no file. | Determine eligibility from selected manifests and provide Summary CSV/HTML guidance; retain a submission guard. | Parameter-only method report paths. |
| Log-view category changes focus without saving it. | Save the selected log focus. | Category/chooser surface cases. |
| Compare identically named scenarios: IDs, review states and source versions disappear from the comparison. | Display run ID/method, review/stale state and retained provenance alongside parameters, coverage and warnings. | Two actual summary runs with different gaps/source versions and accept/reject decisions. |
| Guided calibration selects a method but leaves its modal over Properties. | Close the originating guided dialog before handing off to the selected action. | Guided-shortcut browser regression. |
| Unknown action IDs silently fall through. | Return actionable unavailable-action guidance. | Source inspection; full identifier closure remains part of the open inventory gate. |

Frozen workflow checkpoints use their workflow revision controls; their unrelated single-method Save configuration action explains that checkpoint evidence is immutable. Existing supported calculations remain available. Historical results are not rewritten.

## Retained verification

Final receipt counts are recorded in `verification-summary.json` under `.release/interpretation-buttons-20261108`.

- Python: **194 passed**, including the existing six suites and eight new unit/artifact cases. Existing Starlette/AnyIO deprecation warning remains.
- JavaScript numerical/metadata checks: **3 passed**.
- Actual method lifecycle: **65 passed** across two bounded runs: all 64 executable methods plus rejection, **123 local worker dispatches**. A later focused two-case rejection check verifies a specific 4xx refusal of rejected-source reuse.
- Broad generated-data canvas regression: **28 passed**. Expanded surface and workflow counts are taken from their final receipts; intermediate failed runs are retained as diagnosis, not counted as final passes.
- Read-only six-LAS compatibility/ghost path: **6 passed**, unchanged original hashes and zero content uploads. Known retained depth units remain known; missing measurement units remain unresolved.
- Focused prior-fix mocked UI suite: **9 passed**. Actual scenario-evidence regression: **1 passed**. Local checks report zero browser page exceptions and zero real Cloud executions.
- Syntax, exact catalog mirror and batch-scoped whitespace evidence: `contract-gates.json`. The core pre-batch copy is reconstructed by removing only this batch's new output-unit block; this limitation is recorded in that receipt.

Expected rejections include unreviewed/missing inputs, inactive rejected outputs, stale continuation and revision conflicts. Injected worker failure/cancellation are required successful recovery tests. Sandbox-denied browser/loopback launches and temporary-file checks were rerun with execution permission. Harness corrections include hidden-menu targeting, scalar rather than array consumers, waiting for refresh/cancel responses, stable reset isolation and retained well IDs rather than LAS names.

## Inventory and open completion gate

`ribbon-inventory.json` retains **278 source placements / 200 identifiers**, including **74 planned disabled placements**. The rendered `button-matrix.json` / `.md` retain contextual controls, dialogs, disclosures, dynamic objects, widths, prerequisites, handler/backend families, persistence and associated verification cases. Dynamic IDs and repeated contexts are intentionally retained; counts are not counts of unique product features.

The matrix's `unverified` entries remain open. A click within a passing case is interaction evidence, not automatic proof of that control's whole intended lifecycle. Missing disabled explanations and per-placement context gaps must also be resolved before declaring the batch complete.

Remaining mandatory work:

1. Close the remaining enabled-action and disabled-explanation entries, especially source/evidence inspectors, analysis-window controls, portable Cloud-copy flow, secondary import/source-viewer actions and contextual aliases. Verify each actual outcome and relevant save/reload behavior.
2. Complete per-control submit/cancel/close/validation branches and selected/unselected/narrow/project-workflow variants. Expand exact button-to-handler traces where the current matrix identifies a handler family.
3. Complete and classify console/network-error evidence across these remaining paths; zero page exceptions alone is insufficient.
4. Rerun affected cases, regenerate the matrix and only close the batch when no mandatory control/lifecycle case remains unresolved.

Hosted verification and field qualification remain separate. Approved TMB measurement units and geological/fluid/core calibration evidence are still required; generated values are never field defaults.

## Operational files

- `scripts/verify-interpretation-methods.cjs`: actual routes/workers/artifacts/review/reuse/exports; bounded `FIXTURE_START`, `FIXTURE_END`, `FIXTURE_BATCH` or focused `FIXTURE_METHOD` selectors.
- `scripts/verify-interpretation-lifecycle.cjs`: controllable in-flight execution, cross-well proposals, direct cancellation, three checkpoints, retries, rejection, stale sources and conflicts.
- `scripts/interpretation-control-cases.cjs`, `interpretation-control-coverage.cjs`, `build-interpretation-control-matrix.cjs`: rendered control cases and retained matrix generation.
- `scripts/verify-interpretation-evidence.cjs`: distinct scenario evidence; `scripts/verify-interpretation-contracts.py`: syntax/catalog/whitespace gates.
- `scripts/serve-petrophysics-fixture.py`, `local-science-browser.cjs`, `backend/tests/interpretation_workflow_fixture.py`: generated local fixtures with mocked identity, Firestore, storage and dispatch. Test-only loopback controls are not production endpoints.
- Recovery/source diffs, failure/fix receipts and cleanup outcome remain under `.release/interpretation-buttons-20261108`. Operational harnesses and original user assets are retained.
