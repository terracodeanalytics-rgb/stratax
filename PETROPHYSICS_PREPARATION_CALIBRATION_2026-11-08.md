# Preparation and calibration — local qualification

Date: 8 November 2026. Started 7 November. Scope: the approved preparation/calibration batch; catalog remains `stratax-science/1.2`. Verification fixtures are software evidence, not field calibration.

## Failure inventory and corrections

The unchanged application passed the existing 113 Python checks and nine mocked browser checks. New probes then reproduced six Python failures and one browser failure before application edits. A subsequent artifact probe reproduced one additional defect. Inputs, observations and expected behavior are retained in `.release/preparation-calibration-20261107/failures-before.md` and the discovery JUnit files.

| Defect | Correction | Regression evidence |
| --- | --- | --- |
| Unit edits retained draft confirmation | Binding source/column/unit changes clear confirmation and the visible checkbox, invalidating the current draft run | Focused browser unit edit/reconfirmation check |
| Equivalent feet/metre resampling lost exact stations | Match converted stations and gap limits using the established absolute axis tolerance of 1e-8 metres | Analytical half-metre grid and ft/m equality |
| Direct alignment relabeled MD as TVD | Compare method reference with retained source reference before dispatch and in the worker | Actual validation route rejection |
| Canvas scope relabeled MD as TVD | Compare scope reference and index against the retained source | Actual validation route rejection |
| Splicing accepted sources from different wells | Shared preparation source guard rejects cross-well sources despite an alignment checkbox | Actual validation route rejection |
| Standalone QC dropped physical index/reference | Infer full retained index only from one source with a known length unit and retained reference; read the actual coordinates and persist them | Direct worker/artifact test without canvas scope; accepted-result reuse |
| Workflow alignment relabeled retained depth | Enforce reference equivalence at worker execution, including private intermediate inputs | External and private workflow rejection tests |
| Borehole artifact statistics used a flag as depth | Put retained depth first before the chunk writer computes index ranges/statistics | Discovery failure followed by range [0,39] and no false repeated-depth warnings |
| Core regression accepted porosity above 100% | Apply the shared fractional-domain guard before selecting positive regression pairs | Unphysical porosity, insufficient pairs and zero-core rejection probes |

These corrections do not transform depth references or relabel physical units. Existing source-version, active-input, binding-unit, private-output-unit and physical-axis checks remain in force. Historical results are not rewritten.

## Coverage matrix

| Work package | Numerical / rejection evidence | Local integration evidence | Limits |
| --- | --- | --- | --- |
| Mappings and units | Unconfirmed, inactive, cross-well, wrong run and known-unit scale relabeling rejected; supported length, fraction and density conversions | Suggestions remain unconfirmed; source/unit changes require review; guided preparation and parameter dialogs | Unknown TMB measurement units remain unresolved |
| QC / conditioning | Integrity; analytical despike, nearest-edge smoothing, bounded interpolation, normalization, shift, splice and inch-caliper flags; nulls, repeated/decreasing depths; originals unchanged | All eight QC methods through UI setup, actual routes/worker/artifact writing, comparison, review, reload, downstream use and CSV | Methods retain their stated sample-window semantics; not vendor environmental corrections |
| Depth matching / resampling | Increasing anchors, logging-run binding, no extrapolation, null/gap support, explicit grid, ft/m equivalence, false reference rejection | Both methods through complete local lifecycle; private alignment rejection; existing mixed-axis/row-count guards | No MD/TVD/TVDSS transformation inferred |
| Endpoints / inheritance | Half-open reviewed interval; finite percentiles; method/project/well/zone/step precedence and converted parameter origins | Endpoint proposal lifecycle and inherited-parameter UI; existing checkpoint tests retain provenance | Percentiles remain proposals, separate from geological approval |
| Temperature / fluid resistivity / Pickett | Gradient and anchors with supported bounds; C/F/K equivalence; R(T)=Rsample*(Tsample+C)/(T+C); invalid domains; known relationship recovers m=2 and a·Rw=0.14; independent a/Rw only; no n | All three methods through actual local lifecycle, fluid identity/citations and retained units | Applicability of empirical temperature corrections and water-zone assumptions requires independent evidence |
| Permeability calibration | Known k=1000*phi²; held-out changes do not change training fit; positive domains, insufficient pairs, evidence and explicit application bounds; exclusions counted; percent/fraction equivalence | Regression, Timur and Coates through local lifecycle and accepted-result reuse | Calibration does not authorize extrapolation; field core/log pairs are not qualified |

Deterministic analytical comparisons use `rtol=1e-8`, `atol=1e-10`. Coordinate matching uses the existing absolute 1e-8 metre axis tolerance to absorb feet conversion roundoff. No tolerance was relaxed to hide a failed numerical expectation. Existing statistical prediction fixtures retain fixed seeds; permeability validation uses a deterministic ordered holdout.

## Verification commands and retained evidence

- Python: `.venv/Scripts/python.exe -m pytest backend/tests/test_preparation_calibration.py backend/tests/test_science.py backend/tests/test_scientific_api.py backend/tests/test_petrophysics_workflows.py -q --basetemp=.release/preparation-calibration-20261107/release-pytest --junitxml=.release/preparation-calibration-20261107/release-python.xml`. **142 passed**, one existing deprecation warning. Includes the original three suites and 29 preparation/calibration cases.
- Focused mocked browser: `node scripts/verify-petrophysics-cloud-ui.cjs --preparation`. **10 passed**, zero page errors/real Cloud executions. Includes the previous four-fix browser regressions. Receipt: `focused-browser.json`.
- Actual local integration: `node scripts/verify-preparation-calibration.cjs`. **18 passed**: 17 complete method lifecycles plus UI rejection/unavailable-input validation. **35 local worker executions**, zero page errors/real Cloud executions. `serve-petrophysics-fixture.py` binds loopback only, uses actual science routes/evaluators/workers/artifact/review code and generated sources; identity, Firestore, storage and dispatch are mocked. No production endpoints were added. Receipt: `integration-browser.json`. The affected permeability lifecycle is rechecked separately after the final physical-domain correction; receipt `integration-permeability-regression.json`.
- Real-file compatibility: `node scripts/verify-well-canvas.cjs --six-las --petrophysics --preparation-only`. Five checks passed; TMB-01/02/04/05/06/07 originals read only, complete source ranges displayed, run/source identity retained, unresolved units unconfirmed, guided setup/parameters exercised. The harness asserts all six original SHA-256 hashes before/after and zero import/file/science content requests. Receipt: `six-las-browser.json`.
- Python AST / JavaScript syntax checks, exact backend/frontend catalog equality and scoped whitespace verification are recorded with the final evidence. Pre-edit copies are retained under `before/`; generated fixture directories may be removed after checks.

One pre-existing Starlette/AnyIO deprecation warning remains. The broader six-LAS canvas baseline passed import/display/mapping checks then timed out at an unrelated interwell ghost-overlay submit. This remains explicitly unresolved outside this preparation/calibration batch; the focused compatibility checks pass. No full broad-canvas pass is claimed.

Harness corrections are distinct from application defects: create the pytest basetemp parent, poll fixture readiness, wait for dialog closure rather than DOM removal, wait for report-form loading before clearing selections, and test rejection at validation/dispatch rather than draft saving.

## Delivery boundaries

No deployment, paid Cloud job, automation, Cloud-record migration, original-file rewrite, commit or push. The four completed corrections remain covered. Catalog descriptions/contracts did not change in this batch, so the matching generated frontend mirror remains at 1.2. Unrelated dirty importer, seismic and petrophysics changes are preserved.

Hosted qualification and field applicability remain pending. Approved TMB units, reviewed logging/depth references, fluid/temperature and geological evidence, and core/log calibration pairs/bounds are required for field use. The full shale-to-pay chain belongs to the following batch.

Local batch outcome: the bounded six-area cases above pass. The final permeability lifecycle recheck passed with two additional local worker executions and no page errors. The broader interwell ghost-overlay timeout remains explicitly unresolved and is not included in this completion claim.

Scoped cleanup removed nine generated fixture directories and the one-use editing helper after verification. Recovery files, source diffs, discovery/final JUnit, browser receipts, logs and operational harnesses remain. `cleanup.json` records the exact set. No images were built or deleted; no fresh registry inventory or unrelated Cloud cleanup was performed. Git publication remains deferred.
