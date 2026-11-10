# Petrophysics completion plan — target 14 November 2026

> 8 November urgent release: isolated upload Continue hotfix is live at the custom domain (Site v11); broader Interpretation P3 remains incomplete and unpublished. See STATUS/HANDOFF and `.release/upload-step-one-20261108`.

> Interpretation-page update, 8 November: the broader every-button/workflow-lifecycle batch is authorized and in progress. Scientific/method/recovery and numerous UI corrections pass locally, including the six-LAS ghost timeout, complete HTML rows and generated-original copy. The exhaustive control matrix still has mandatory open coverage; do not declare P3 complete. See INTERPRETATION_BUTTONS_LIFECYCLE_2026-11-08.md. No deployment, paid jobs, automation or Git publication.

> Progress update, 8 November (evaluation/UI milestone): the explicitly approved shale-to-pay and previous-feature wiring batch is complete locally at catalog 1.3. Verification: 186 Python tests, 38 actual button-driven browser cases (37 methods plus rejection), ten focused UI regressions and five read-only six-LAS checks passed. See PETROPHYSICS_EVALUATION_UI_2026-11-08.md. P0/P1 and bounded P2 local software paths are complete; hosted/field qualification and specialist extensions remain separate. No deployment, paid jobs, automation or Git publication occurred.

> Progress update, 8 November: the preparation/calibration batch was explicitly authorized and implemented locally. Six-area coverage and actual outcomes are recorded in PETROPHYSICS_PREPARATION_CALIBRATION_2026-11-08.md: 142 Python checks, 18 actual-route browser lifecycle cases, ten focused browser checks and five read-only six-LAS checks. This qualifies the bounded local software path; field units/calibration and hosted qualification remain pending. The remaining evaluation, extension and release work is still proposed, with no deployment or Git-publication authorization.


> Progress update, 7 November: P0's four audit corrections were separately authorized and implemented locally. Final checks: 113 Python tests and nine mocked browser checks passed. See PETROPHYSICS_FIXES_2026-11-07.md. This does not authorize the remaining programme, deployment, Git publication or scheduled automation; the later plan and dates remain proposals.


Planning date: 7 November 2026. Deadline assumed: 23:59 WAT (Africa/Lagos), Saturday 14 November 2026.

## Status and proposed commitment

Current position, 8 November: P0, bounded preparation/calibration and the shale-to-pay/UI batch have been explicitly authorized, implemented and verified locally. Specialist extensions, hosted release and field qualification remain outside those completed local batches and require separate authorization/evidence. No automation has been activated; deployment, paid jobs and Git publication remain deferred.

Baseline: PETROPHYSICS_INVENTORY_AUDIT_2026-11-07.md. There are 63 registered methods relevant to petrophysics/combined studies, with concrete backend evaluators; this is not 63 complete industry workflows. Historical checks exist, but current complete field qualification is outstanding.

Recommended 14 November deliverable: a verified conventional deterministic petrophysics release, the four audit defects addressed, complete reviewed conditioning/calibration/evaluation/reporting, and selected advanced extensions only if their earlier gates pass. This is a target with dependencies, not a guarantee.

Completing all 16 specialist capability gaps to independently qualified commercial-application scope by 14 November is not a defensible promise. In particular, dielectric, high-angle inversion, cased-hole processing and vendor-specific correction engines need scientific contracts, appropriate reference data and potentially licensed response information. Scheduling more agent runs cannot supply those inputs or replace validation.

## Definition of done

An item is complete only when its reviewed inputs and units reach real calculation code, settings affect that calculation, failures are explained, results preserve units/reference/lineage, persistence and reload work, outputs are independently checked, and the UI accurately describes availability and limitations. Tests must exercise meaningful scientific and workflow behavior, not only that a configuration opens.

Track implementation, local verification, hosted verification and field applicability separately. A synthetic/reference fixture can qualify software behavior; it cannot establish the formation's Rw, mineralogy, water zone or permeability relationship. A missing scientific input remains blocked even if implementation is finished.

## Day-by-day target

| Date (WAT) | Work package | Required exit evidence |
| --- | --- | --- |
| 7 Nov | Agree conventional release scope; save audit/plan; identify missing scientific inputs and execution permissions. | Named backlog, acceptance criteria and unresolved dependencies. Planning only today unless separately authorized. |
| 8 Nov | Preserve the dirty baseline; resolve F1–F4: cutoff operator, geomechanics vertical reference, upscale gap support, prediction units. | Focused regressions, source review, unit/reference/null contracts and no unrelated changes. Establish the working continuation prompt before scheduling it. |
| 9 Nov | Verify existing preparation/calibration: mappings, unknown units, QC, run matching, resampling, endpoints, temperature/Rw, Pickett and core-calibration bounds. | Analytical/reference checks, mismatched axes rejected, same-run anchor restrictions, no invented units/calibration and retained original values. |
| 10 Nov | Complete and qualify deterministic Vsh → porosity → Sw → permeability → reservoir/pay → summaries. | Multiwell/multizone parameter propagation, calibrated model choices, null/gap and pay-subset handling, weighted results and independent numeric comparisons. |
| 11 Nov | Verify saved workflows, three checkpoints, private dependencies, acceptance/rejection, stale inputs, cancellation and report/export persistence. | Controlled end-to-end study, accepted-result reuse, complete-row CSV/HTML, account isolation and documented recovery behavior. Use actual field inputs only when approved. |
| 12 Nov | Conditional extensions: saturation-height application first; interpretation uncertainty second. | Reviewed FWL/TVDSS/fluid contracts and depth-wise outputs; explicit uncertainty assumptions and reproducible sensitivities. Drop neither core verification nor truthful availability to hit this date. |
| 13 Nov | Integration and independent review; resolve failures; make a release candidate and freeze new scope. | Complete relevant regressions, numerical evidence, supported-limit checks, privacy/ownership boundaries and candidate deployment evidence if authorized. |
| 14 Nov | Hosted verification and final decision; release only after gates pass and deployment authorization exists. | Candidate and live checks, rollback provenance, documented supported features/limitations, final inventory and remaining blockers. A failing candidate is not promoted to meet the calendar. |

The plan contains one primary sequential implementation stream. No subagents or parallel agent work have been authorized. Independent tool reads/checks may be batched normally. If measured progress shows more capacity is required, report the scope/date decision instead of silently reducing validation.

## Complete workstream ledger

| ID | Workstream | Target disposition | Acceptance criteria / dependency |
| --- | --- | --- | --- |
| P0 | Four confirmed audit concerns | Locally complete, 7 Nov | Operator/reference/gap/unit regressions pass; preserved in the latest 142-test run. Hosted and field qualification pending. |
| P1 | Conventional preparation and calibration | Bounded local batch complete, 8 Nov | Six-area coverage matrix and 142 Python / 18 actual-route browser / 10 focused UI / five six-LAS checks recorded in PETROPHYSICS_PREPARATION_CALIBRATION_2026-11-08.md. Approved TMB units and field calibration remain pending; the separate Interpretation batch has now corrected and locally verified the broad-canvas ghost timeout. |
| P2 | Conventional evaluation, previous-feature UI wiring and reports | Bounded local batch complete, 8 Nov | Actual two-well/two-zone three-checkpoint chain, explicit reservoir/pay semantics, accepted datasets/reuse, 37 method-button paths and exports verified. 186 Python / 38 actual browser cases passed. See PETROPHYSICS_EVALUATION_UI_2026-11-08.md; hosted/field qualification pending. |
| P3 | Every Interpretation control and full execution lifecycle | Authorized local batch in progress | Close the complete rendered/source control matrix, context/disabled explanations, recovery and export cases. Current evidence: INTERPRETATION_BUTTONS_LIFECYCLE_2026-11-08.md. Hosted/field qualification remains separate. |
| A1 | General petrophysical uncertainty | 12 Nov stretch | Define distributions, correlations/model dependencies, propagate through equations and summaries, retain seeds and sensitivity/provenance. Existing volume Monte Carlo alone does not close this item. |
| A2 | Saturation-height application | 12 Nov first extension | Reviewed Pc/fluid conversion, TVDSS/contact/FWL, HAFWL and Sw outputs, facies/flow-unit application, domain/range and validation rules. |
| A3 | Full multimineral interpretation | Post-14 Nov unless independently re-estimated | Response-model specification, hard/soft constraints, input uncertainty, mineral/fluid volumes, zonal model selection and appropriate XRD/core references. Preserve existing NNLS as a limited operator. |
| A4 | Vendor environmental corrections | Input/license-dependent; no credible 14 Nov commitment | Exact vendor/tool/version, authorized response tables/equations, applicability domains and reference cases. Keep generic additive table accurately labeled. |
| A5 | Additional shaly-sand saturation | Post-14 Nov or separately agreed bounded extension | Choose Waxman–Smits/Dual Water/Juhasz scope; specify CEC/Qv/bound-water calibration, units, equation versions and independent expected results. |
| A6 | Thin-bed / laminated formations | Post-14 Nov | Reviewed model and anisotropy/resolution assumptions, appropriate logs/core and reference comparisons. |
| A7 | Advanced porosity/fluid properties | Model/data-dependent after conventional release | Agree specific sonic/neutron/gas/invasion/fluid models; do not invent a generic vendor substitute. |
| A8 | NMR suite | Post-14 Nov | Decide pre-inverted T2 versus raw echoes; acquisition/noise QC, inversion/cutoff calibration and independent spectra/porosity/permeability cases. |
| A9 | Core / SCAL suite | Post-14 Nov | Core/log matching and stress/reference corrections; Pc/relative-permeability/wettability contracts and representative transfer. Saturation-height subset belongs to A2. |
| A10 | Formation testing / fluid contacts | Post-14 Nov | Station QC, mobility/compartments, multiple gradients and contact intersections with uncertainty; real station evidence. |
| A11 | Borehole images / core photos | Post-14 Nov | Tool-aware assembly/orientation, depth-registered rendering, picks and persistent interpretation; suitable original arrays/photos. |
| A12 | Organic shale / unconventional | Separate specialist milestone | TOC/kerogen/maturity/organic porosity models, appropriate calibration and references. |
| A13 | Dielectric | Separate specialist milestone | Measurement/dispersion contract, response inversion, calibration and independent reference dataset. |
| A14 | High-angle / horizontal evaluation | Separate specialist milestone | Formation/layer model, forward tool responses, geometrical-effect inversion and independent checks. A trajectory display is insufficient. |
| A15 | Production / cased-hole | Separate specialist milestone | Separate spinner, holdup/slip, multiphase, temperature, pulsed-neutron and integrity scopes with calibration and actual sources. |
| A16 | Extensibility / connectivity / publishing | Product prioritization after conventional release | Agree visual workflow, sandbox scripting, specific connectors and export/report formats. Do not bundle an undefined platform programme into the deadline. |

All audit areas remain visible in this ledger. Moving an item outside 14 November is an explicit scope recommendation, not claiming it was completed. Full-suite dates require estimates after scientific contracts, datasets and permissions are resolved.

## Inputs needed early

Before scientific field acceptance: approved units for the actual TMB curves; logging-run identities and depth references; matrix/fluid/shale assumptions; clean/shale and water-zone interval evidence; formation-temperature Rw evidence; core/permeability calibration pairs and applicability bounds. Saturation height additionally needs Pc/Sw plugs, fluid conversion properties and reviewed contact/FWL/TVDSS information.

If these are unavailable, continue software/reference qualification and record field applicability as blocked. Never use fixture constants as a geological interpretation. Paid cloud acceptance needs an explicit bounded run estimate and spending approval; there is no standing paid-science allowance.

## Automated continuation proposal

Use a scheduled continuation in this existing chat, preserving its context and the plan/ledger. Proposed cadence: every two hours at 08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00 and 22:00 WAT, from activation through 14 November. Check usage after the first sessions and reduce cadence if necessary. A scheduled trigger is a restart opportunity, not a promise of uninterrupted compute or a fixed quantity of completed work.

Each run should read the ledger and current diffs, resume the earliest authorized unblocked item, implement a coherent increment, perform proportionate authorized verification, and save evidence/handoff. Avoid duplicate operations and conflicting edits; do not launch a second agent/session against work already active. When awaiting an input, work on another independent authorized item. Retrying the same blocked step indefinitely is not useful.

Notify for a completed milestone, failure, deadline risk, necessary scope decision or required input. Stay quiet when the state is unchanged or there is nothing actionable. The automation is for doing work, not repeatedly producing status summaries.

Stop scheduling at completion or the 14 November deadline. Recheck the date on every activation so a missed final trigger cannot silently extend authority. Use the native scheduler to end/pause the automation when supported; never self-extend the deadline or create replacement schedules.

### Environment and permission limits

- Local automation requires this computer to remain powered on with the desktop app running and the checkout available. It does not work on these local files after the laptop is shut down.
- The connected Codex Cloud environment listing returned zero environments on 7 November. The earlier migration branch is a source snapshot, not a ready cloud execution environment. Cloud operation is a separate setup/verification task; no server or paid infrastructure is proposed here.
- Scheduled runs inherit sandbox/access restrictions and available usage. Commands requiring unavailable approval/network access may fail or stop progress. Automation cannot grant itself permissions, buy credits or assume expired credentials still work.
- Activation still requires explicit scheduling authorization and a manual check of the continuation prompt under its approved scope. Authorization for the completed local batches does not authorize scheduled fixes, deployment, publication or spending.
- Existing root publication restrictions, user originals, recovery assets and unrelated importer/seismic changes remain protected. Do not publish the whole dirty tree or deploy it wholesale.

Official documentation: [Scheduled tasks](https://learn.chatgpt.com/docs/automations?surface=app). It describes in-chat continuation, local project requirements and inherited permission boundaries. This is not evidence that this account has a runnable cloud environment.

## Proposed durable continuation prompt — inactive draft

Continue the authorized StrataX petrophysics work in this chat using PETROPHYSICS_COMPLETION_PLAN_2026-11-14.md and PETROPHYSICS_INVENTORY_AUDIT_2026-11-07.md. Read current repository instructions, living docs, progress evidence and scoped diffs before editing. Resume the earliest authorized unblocked ledger item; do not restart completed work or duplicate an active execution. Keep implementation, local verification, hosted verification and field qualification distinct. Follow tolu-code-style and applicable release/cleanup/documentation instructions. Preserve the existing dirty baseline, user originals, recovery material and unrelated seismic/importer work. Use only the tests, publication, deployments and spending bounds explicitly authorized in this chat; planning documents do not authorize themselves. Missing units, reference data, calibrated parameters, tools or permissions must remain explicit blockers. Do not invent scientific assumptions or claim full specialist capability from a limited kernel. Persist results and the next actionable step after each meaningful increment. Report completion, material failure, required input or deadline/scope risk; remain quiet for unchanged/non-actionable state. Stop and end the schedule when the approved scope is complete or after 14 November 2026, Africa/Lagos. Do not self-extend scope, spending or deadline.

## Planning session completion

Created this plan only. No application code was changed, no tests were run, no automation was created, no deployment or paid job was started, and no Git publication occurred. The audit report and all existing work remain preserved.
