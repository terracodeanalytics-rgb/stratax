# Petrophysics audit corrections — local verification

Date: 7 November 2026. Approved scope: four defects, local implementation/tests only. No deployment, paid Cloud job, automation or Git publication.

## Changes

1. **Cutoffs:** corrected the operator-selection typo. Existing scenario names populate the editor; scenario creation clones the selected configuration so source mappings and parameters remain attached to the correct scenario. Operators and thresholds survive property changes, adding/removing rows, submission and reopening. New scenarios still require fresh input confirmation.
2. **Geomechanics:** required explicit `depthReference=TVD` in the catalog and core evaluator; checked retained source references during API admission and direct worker execution. Workflow admission checks external depths/scope/alignment; the workflow worker also checks private depth references and source lineage, preventing a forged scope label from converting MD/TVDSS. TVD metadata and the retained result index persist. Hydrostatic gradient remains referenced to the reviewed TVD zero; TVDSS needs a separate origin contract.
3. **Upscaling:** required a finite positive `maxGap` in metres. Reused the summary thickness-support helper: left-station support on half-open intervals, with larger gaps and null values excluded. Partial coverage is retained, unsupported cells return null/zero coverage and the upscaled value retains its source unit. The specified `[0,1,10,11]` case returns 20 with coverage 2/11.
4. **Prediction:** both ridge and forest assign the reviewed target unit to reconstructed/lower/upper curves. Real local artifact round-trip, private downstream use and mocked acceptance preserve those units. The empirical interval qualification statement is unchanged.

## Compatibility

Scientific catalog and generated frontend mirror are `stratax-science/1.2`, with 65 matching methods. Old geomechanics/upscaling configurations require explicit new parameters before execution; no scientific values are silently supplied. Existing accepted results, artifacts and versions are not rewritten or migrated.

## Verification

| Check | Result |
| --- | --- |
| Final scientific, API and workflow Python suites | **113 passed**, one pre-existing Starlette/AnyIO deprecation warning |
| Mocked Chromium report/workflow/cutoff checks | **9 passed**, zero page errors, zero real Cloud executions |
| Catalog consistency | Exact equality of generated frontend methods/version and backend catalog |
| Source checks | Python parsing, JavaScript syntax and scoped whitespace passed |

Commands:

```text
.venv/Scripts/python.exe -m pytest backend/tests/test_science.py backend/tests/test_scientific_api.py backend/tests/test_petrophysics_workflows.py -q --basetemp=.release/petrophysics-fixes-20261107/pytest-final
node scripts/verify-petrophysics-cloud-ui.cjs
node --check frontend/dist/petrophysics-workspace.js
node --check frontend/dist/science-methods.js
node --check scripts/verify-petrophysics-cloud-ui.cjs
```

New regressions cover analytical vertical integration and metre/feet equivalence; MD/TVDSS/missing/mismatched and falsely relabeled source references; direct worker metadata; private workflow depth lineage; gap thresholds including equality, irregular sampling/nulls/partial support; both prediction algorithms through chunk reads, private dependencies and accepted records; and all four cutoff operators through UI redraw/save/reopen.

The initial Python run passed 111 checks before adding the two direct-worker cases; the final run passed all 113. The initial browser run timed out after the new test used `.toast` instead of the application's `#toast`; the corrected harness passed. This was not an application fix or a scientific failure.

## Evidence, cleanup and limits

`.release/petrophysics-fixes-20261107` retains pre-edit copies of 12 scoped files, diffs, source hashes and verification receipts. The reusable regression scripts remain in the repository. Two generated pytest directories and the one-use editing helper were removed after verification. No images were built/deleted and no fresh registry inventory was needed for this local-only batch; registry/live/worker protections remain intact.

All existing unrelated work and user originals remain preserved. Production remains Site v10 / API `stratax-api-domain-1107a` with the previous scientific release. Hosted behavior, real Cloud execution and field applicability are **not** qualified by these local fixtures. Broader specialist functionality from the inventory remains open. Git publication remains deferred.
