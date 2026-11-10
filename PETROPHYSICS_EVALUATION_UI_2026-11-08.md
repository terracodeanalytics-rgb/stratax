# Shale-to-pay evaluation and previous-feature UI wiring

Date: 8 November 2026. Local software qualification only. No deployment, paid execution, automation, Cloud migration or Git publication.

## What changed

- Catalog advanced from 1.2 to **1.3** with its generated frontend mirror. Cutoff configurations require positive `maxGap` metres. Density, sonic and neutron porosity producers require an explicit total/effective `porosityBasis`; weighted combination requires explicit `basis`.
- Existing binding forms expose reviewed `porosityBasis` for imported/historical inputs. The existing configuration binding schema accepts that optional declaration. Known retained basis cannot be overridden; unknown basis must be declared before relevant calculations. Per-column basis survives direct/private execution, chunk manifests, acceptance, reload, QC reuse and CSV headers. No new public endpoint or historical-record migration.
- Gap-aware minimum-bed filtering sums supported left-station intervals, splits at gaps above maxGap and assumes no support beyond the terminal station. minimumBed=0 retains pointwise classification. Cutoff results now label their actual depth unit as metres, enabling accepted-result reuse.
- Unphysical downstream porosity/fraction/resistivity/permeability values are excluded and counted without changing originals. Porosity producers retain raw diagnostic outputs. Weighted combination respects strict versus renormalized missing-value policy after exclusions. Shale subtraction preserves negative raw derived estimates as diagnostic evidence while excluding invalid upstream total porosity.
- Summaries retain supported gross/net/pay, NTG, property coverage, phi-h, hydrocarbon pore thickness and kh, with separate reservoir/pay mask coverage. Pay outside reservoir is rejected. Invalid porosity no longer contributes to volumes.
- Preparation/evaluation source guards apply across wells and retained depth references. Basis checks protect API admission, mixed/private workflow inputs and workers. Source-independent model errors now fail before dispatch, including invalid endpoints, equal matrix/fluid responses, nonpositive saturation/permeability parameters, unsupported Simandoux n and invalid cutoff/summary settings.
- Upscaled cells retain `cellTop` as their explicit physical output index and preserve the source reference. The writer does not pretend original measurement rows are cell rows.
- The ribbon already exposed most methods. Replaced its generic prediction picker with explicit ridge/forest buttons in the existing Workflows group; verified existing QC, calibration, property, modeling, drilling, cutoff and summary actions. No parallel UI was introduced.
- Changes in inherited parameters clear affected method drafts' run references and mapping confirmations. Zone changes also detach affected draft results. Historical accepted runs remain retained. Missing inputs are explained through existing validation/forms; no invented field constants are supplied.

## Discovery and fix evidence

Evidence directory: `.release/evaluation-ui-20261108`.

The unchanged application passed **142 Python checks**, **10 mocked UI checks** and **18 actual local preparation lifecycle cases**. New discovery probes then produced **10 passes / six failures** before application edits. Three additional invalid-porosity combination/subtraction probes failed before their correction. The actual button matrix discovered an unconfirmed cutoff depth unit during downstream reuse; the parameter-editor probe reproduced retained stale run references after override edits.

`discovery.md`, `discovery-python.xml`, `domain-discovery.xml`, intermediate JUnit and pre-edit recovery files retain the before/fix evidence. Contract gaps and harness problems are distinguished there. Harness corrections include explicit UI setup after opening a fresh method draft, retained mock project state, dynamic accepted-source listings, closing modal reports before navigation, and waiting for rendered refreshed evidence rather than treating browser-cache writes as application state.

## Coverage matrix

| Area | Verification |
| --- | --- |
| Shale | All five GR models, endpoint limits, unbounded IGR, nulls and independent analytical values |
| Porosity | Density/sonic/neutron, total/effective semantics, shale subtraction, weighted strict/renormalized combination, unit conversion, raw diagnostic retention and invalid-value exclusion |
| Saturation | Archie/Indonesian/implemented Simandoux, nonzero shale, n=2 restriction, reviewed basis, clipped/unclipped values and invalid domains; scalar Rw remains an explicit formation-temperature assumption |
| Permeability | Existing reviewed regression/Timur/Coates, positive domains, training/held-out separation, Swi independence, application bounds, units and exclusion counts; preparation regressions preserved |
| Reservoir/pay | Four operators and boundary equality, named editor scenarios, zonal overrides, gap limits below/at/above the boundary, minimum beds, no terminal extrapolation and pay-subset rejection |
| Summaries | Independent fixture gives net/pay=2 m, NTG=2/11, phi-h=.4 m, hydrocarbon pore thickness=.2 m, kh=20 mD·m; invalid porosity coverage exclusion verified |
| Combined study | Actual routes/review/artifacts for two wells in feet/metres and two zones per well; all three checkpoints, private full shale-to-pay chain, project/well/zone/step origins, converted parameter units, acceptance/rejection, reload and unchanged source hashes |
| Previous batches | All eight QC methods, run-bound depth matching, alignment, endpoints, temperature/Rw/Pickett, three permeability methods, cutoff editor, TVD-only geomechanics, gap-aware upscaling and both prediction algorithms reach their appropriate UI actions and actual workers |
| Persistence/export | Accepted result reuse, property basis in columns/manifests/QC outputs/CSV, complete accepted rows, actual HTML summary report with provenance, empirical prediction interval caveat retained |
| Real files | Six agreed Downloads LAS files read only; guided preparation and parameter dialogs, import/display, source/run identity and unresolved-unit safeguards; unchanged SHA-256 checks and zero content uploads |

Deterministic analytical comparisons use `rtol=1e-8`, `atol=1e-10`. The existing absolute 1e-8 metre coordinate-equivalence tolerance remains separate. The two-zone fixture reports five metres of supported thickness inside each six-metre half-open zone because its terminal station has no extrapolated support. Fixture constants are controlled test evidence, not field calibration.

## Verification commands

- `.venv/Scripts/python.exe -m pytest backend/tests/test_science.py backend/tests/test_scientific_api.py backend/tests/test_petrophysics_workflows.py backend/tests/test_preparation_calibration.py backend/tests/test_evaluation_ui.py backend/tests/test_evaluation_workflow.py -q --junitxml=.release/evaluation-ui-20261108/release-python.xml` — **186 passed**, one existing Starlette/AnyIO deprecation warning.
- `node scripts/verify-evaluation-ui.cjs` — **38 passed**: 37 actual button/configuration/API/evaluator/worker/artifact/review/reload/reuse/export paths plus one rejection case; **75 local worker executions**, zero page errors and zero real Cloud executions. Accepted datasets are checked in the rendered source tree after reload; project override edits invalidate the affected draft while historical acceptance remains intact. Identity, Firestore, storage and dispatch are mocked. Exact per-method action, tab and outcomes are retained in `integration-browser.json` and the generated `button-to-backend.md` matrix.
- Final focused checks also pass: three copied/upscaled porosity-basis artifact regressions (`semantic-final.xml`), including keeping depth free of porosity tags; one actual upscaling button lifecycle recheck consuming the **upscaled property**, with two additional local worker executions (`integration-log-upscale.json`).
- `node scripts/verify-petrophysics-cloud-ui.cjs --preparation` — **10 passed**, including preserved cutoff editor/operator and mapping-confirmation regressions. Receipt: `focused-browser.json`.
- `node scripts/verify-well-canvas.cjs --six-las --petrophysics --preparation-only` — **five passed**, zero page errors/content uploads, original-hash comparisons pass. Receipt: `six-las-browser.json`.
- Python/JavaScript syntax, exact catalog-mirror equality and scoped whitespace checks are retained with the final evidence.

## Limits and handoff

Production remains unchanged at the previously documented Site v10 / API stratax-api-domain-1107a state, with earlier scientific code. No hosted verification or field applicability is claimed. Approved TMB units and independent geological, temperature/fluid and core-calibration evidence remain necessary. Simandoux is qualified only within its explicitly implemented formulation; no specialist saturation algorithm was added.

The unrelated broad-canvas interwell ghost-overlay submission timeout remains separately unresolved. The focused six-LAS preparation checks and required evaluation paths do not use that overlay. All unrelated dirty importer/seismic/petrophysics work and user originals are preserved. Git publication stays deferred.

Scoped cleanup removed two generated integration fixture trees (including the regenerated previous-batch baseline fixtures) and one one-use editing helper; the final focused fixture was cleared again after its check. Recovery files, discovery/JUnit/browser receipts, matrix, scoped diffs and operational harnesses are retained. Zero images built/deleted; no fresh registry inventory or unrelated Cloud cleanup. Receipt: `.release/evaluation-ui-20261108/cleanup.json`.
