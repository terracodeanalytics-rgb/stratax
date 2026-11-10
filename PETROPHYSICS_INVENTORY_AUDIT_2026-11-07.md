# StrataX petrophysics inventory and conventional-application comparison

> 8 November urgent release: isolated upload Continue hotfix is live at the custom domain (Site v11); broader Interpretation P3 remains incomplete and unpublished. See STATUS/HANDOFF and `.release/upload-step-one-20261108`.

> 8 November Interpretation-page continuation: broader UI/lifecycle corrections are being implemented and verified locally at catalog 1.3. The six-LAS ghost timeout, draft/review recovery, complete-row HTML and generated-source copy paths now have local evidence. This wider every-button batch is still open until its mandatory control matrix is closed. See INTERPRETATION_BUTTONS_LIFECYCLE_2026-11-08.md and the current `.release/interpretation-buttons-20261108` receipts.

> Evaluation/UI follow-up, 8 November: the separately approved bounded shale-to-pay and previous-feature wiring batch is complete locally at catalog **1.3**. All 37 relevant method actions reach actual local workers, artifacts, review, accepted-source reload, reuse and CSV; rejection and actual HTML summary reporting are also checked. Final evidence: 186 Python tests, 38 actual browser cases, ten focused UI regressions and five read-only six-LAS checks passed. See [evaluation coverage](PETROPHYSICS_EVALUATION_UI_2026-11-08.md). No hosted/field qualification or specialist-capability closure is implied. Older catalog/current-state statements below are historical milestones.

> Preparation/calibration follow-up, 8 November: the separately approved local batch corrected nine reproduced defects and passed 142 Python checks, 18 actual-route browser lifecycle cases, ten focused mocked-browser checks and five six-LAS compatibility checks. See [coverage and evidence](PETROPHYSICS_PREPARATION_CALIBRATION_2026-11-08.md). Catalog remains 1.2; hosted and field qualification are separate. The preserved baseline below is historical, not a current claim that these corrections remain open.


> Follow-up: the four confirmed findings F1–F4 were subsequently fixed **locally** on 7 November under the approved correction plan. Final verification: 113 Python tests and nine mocked browser checks passed. Local catalog is now 1.2; production and historical results are unchanged. See [fix evidence](PETROPHYSICS_FIXES_2026-11-07.md). The audit below is the preserved pre-fix baseline, including its original 1.1 release-source comparisons and findings; broader specialist gaps remain open.

Date: 2026-11-07 · Audit only · Local branch: codex/interpretation-canvas-science · HEAD: 4f181d5

## Decision-ready findings

The conventional deterministic calculation backbone exists. The principal gap is completing and qualifying full scientific workflows, especially specialist modules, rather than creating every backend from scratch.

- Registry: **65 total methods**. **63** can be used in a petrophysics or combined study: 55 petrophysics-only, five either-workflow, three requiring both petrophysics and seismic. A petrophysics-only project can expose 60, including log-view. Two seismic-only methods are outside this inventory.
- All 63 have concrete evaluator branches and shared API/worker/artifact/review plumbing. **Zero missing dispatcher implementations were identified among these registered methods.** This is a static source finding, not 63 newly demonstrated working workflows.
- The 63 methods form **28 assessed method families: 13 REAL within their stated bounded contract, 15 PARTIAL against a complete conventional application module**. Detailed limitations matter more than the method count.
- The multidisciplinary petrophysics shell also contains **74 intentionally DISABLED future commands in 19 groups**, plus nine planned view types. These are not 74 distinct missing petrophysics backends: some are UI gaps around existing kernels; others belong to separate seismic/modeling/engineering systems.
- **STUB: zero enabled registered numerical dispatchers identified.** Missing advertised future capabilities are explicitly unavailable; this does not certify every peripheral control.
- Prior tests exist. The latest recorded petrophysics milestone reports 93 Python checks, with fixture dispatch for every catalog method and mocked two-well workflow checks. They do not constitute accepted field or current production qualification.
- A complete calibrated TMB multiwell study remains unaccepted. Almost all non-depth TMB LAS units are UNKNOWN, and approved Rw, matrix/shale assumptions and permeability evidence are missing.
- Four concrete source-level concerns are recorded below. No repairs were made.

## Scope and evidence rules

Examined the ribbon, planned capabilities, method catalog, interpretation forms/run/review path, canvas model and well evidence integration, scientific admission, numerical evaluators, worker readers/writers, workflow definitions/checkpoints, reporting, tests, retained verification JSON and release source receipts.

Primary implementation files:
- frontend/dist/petrophysics-ribbon.js; petrophysics-workspace.js; interpretation-workspace.js; science-methods.js; subsurface-capabilities.js; well-canvas.js; well-canvas-model.js.
- backend/scientific_catalog.py; scientific_core.py; scientific_conventional.py; scientific_api.py; scientific_worker.py; scientific_workflows.py; scientific_workflow_worker.py; well_ingestion.py.
- backend/tests/test_science.py; test_scientific_api.py; test_petrophysics_workflows.py.
- PETROPHYSICS_WORKSPACE_2026-10-31.md; WELL_WORKFLOW_ACCEPTANCE.md; SCIENTIFIC_WORKSPACE.md; current STATUS/CONTEXT/HANDOFF and retained release receipts.

REAL means genuine implementation for the expressly bounded calculation or UI contract, with historical evidence where available. PARTIAL means meaningful code exists but the broader workflow is incomplete or has a material source concern. DISABLED means intentionally unavailable. STUB means a placeholder/no-op pretending to perform a calculation. None of these labels means freshly tested or field-qualified.

No application tests, scientific calculations, browser workflow tests, uploads, cloud jobs, deployments, edits to application code, fixes, commits or pushes were performed for this audit. Only this Markdown report was created. Read-only catalog parsing, source comparisons and external research were used.

### Local versus deployed source

The seven core scientific files listed above match byte-for-byte the retained backend source in .release/petrophysics-live-20261031/backend. Its source-receipt.json records the same overlays. This reduces ambiguity between the dirty working tree and the published petrophysics source; it is not a fresh attestation of every remote container byte.

Recorded live context from the domain migration immediately preceding this audit: https://stratax.terracodeanalytics.com, Site v10, API stratax-api-domain-1107a at 100%, using the same petrophysics API image digest 095796a225418dbfb0df61c1820c5ab83eff8ddaff0712f4074638f67a1e5ca6. Science release receipt records image 4bb45cab1fad12693f70fbd3b775cb7602c5a37be3e4299c17d230e6d953cad0. No fresh live application qualification was performed here.

SCIENTIFIC_WORKSPACE.md still describes catalog 1.0 / 58 methods. Current code and generated mirror are **1.1 / 65**. That document is historical on this point; it was not edited.

## How conventional applications organize the work

The public product sources support this sequence: preserve and prepare well data, assess QC and corrections, establish depth alignment and zonal parameters, evaluate clay/porosity/saturation/permeability, reconcile core/pressure/SCAL evidence, evaluate cutoffs and uncertainties, then publish plots and zonal results. This sequence is my synthesis of the vendor descriptions, not a claim to reproduce proprietary implementations.

| Application/source | Publicly documented approach | Consequence for StrataX |
| --- | --- | --- |
| [SLB Techlog Quanti](https://www.slb.com/products-and-services/delivering-digital-at-scale/software/techlog-wellbore-software/techlog/techlog-petrophysics/techlog-quanti) | QC and fluid precomputations feed reusable analysis workflows; project/well/zone parameters, graphical selection, resampling, cutoff sensitivity and zonal reports are integrated. | Judge the complete chain and parameter propagation, not just equations or ribbon tabs. Much of the basic architecture exists; complete study acceptance is missing. |
| [Aspen Geolog brochure](https://home.aspentech.com/-/media/aspentech/home/resources/brochure/pdfs/fy25/q4/at3812brogeologv7425.pdf) | Determin covers sequential evaluation through net pay/averages and vendor corrections. Its uncertainty tools propagate input ranges into depth-wise property distributions and account for dependencies. | Independent five-input volume Monte Carlo is useful but does not provide full petrophysical uncertainty propagation. |
| [Geoactive IP Foundation](https://www.geoactive.com/interactive-petrophysics) | Data handling, editing, shifting, plots and deterministic clay/porosity/Sw/cutoff/summation tools form the base package, with specialist toolkits layered above it. | Prioritize dependable conventional workflow completion separately from specialist parity. |
| [SLB Quanti.Elan](https://www.slb.com/products-and-services/delivering-digital-at-scale/software/techlog-wellbore-software/techlog/techlog-petrophysics/techlog-quantielan) | Multi-component interpretation supports model/zone selection, multiple response equations, constraints, uncertainty and mineral/fluid outputs. | A fixed linear response matrix with nonnegative least squares is only a building block for this module. |
| [Geoactive Advanced Formation Evaluation](https://www.geoactive.com/ip-advanced-formation-evaluation) | Mineral Solver integrates log/core evidence. Saturation-height work includes Pc QC/fitting, function mixing, application to offset wells and facies/flow-unit use. | Existing Pc fits and J curves do not complete height-above-contact Sw prediction or a calibrated multiwell mineral workflow. |
| [Aspen Geolog Multimin course](https://esupport.aspentech.com/UniversityCourse?id=a3p4P000000Vmw4QAC) | Preparation includes matching, editing, despiking and environmental corrections before complex mineral analysis and uncertainty. | A generic correction table or paired core regression should not be described as the full preparation/calibration suite. |
| [SLB high-angle/horizontal petrophysics](https://www.software.slb.com/-/media/software-media-items/software/documents/external/product-sheets/techlog_3d_petrophysics.ashx) | A structural/layer model is forward modeled and reconciled with measurements before petrophysical evaluation in high-angle wells. | A deviated display or minimum-curvature survey alone does not provide high-angle log inversion. |

Public vendor descriptions establish expected workflows and capability scope. They do not disclose sufficient detail to certify numerical equivalence, and no proprietary software was run for a quantitative comparison.

## Complete registered-method inventory: 63 methods

All entries below have backend numerical code. PARTIAL identifies the gap to a complete conventional module, rather than claiming the existing arithmetic is a placeholder. Evidence locations give the first relevant branch; nearby statements and the shared infrastructure described afterward complete the trace.

| Family | Assessment | Exact method IDs | Actual implementation and boundary | Source evidence |
| --- | --- | --- | --- | --- |
| 1. Display | REAL (bounded) | `log-view` | Retained depth/curve output; main canvas additionally reads full chunks. | `backend/scientific_core.py:136` |
| 2. QC | REAL (bounded) | `qc-integrity`, `qc-despike`, `qc-interpolate`, `qc-smooth`, `qc-normalize`, `qc-shift`, `qc-borehole`, `qc-splice` | Depth/null counters; median/MAD despike; bounded interior interpolation; moving mean; affine normalization; depth translation; caliper washout flag; explicit splice. | `backend/scientific_core.py:139` |
| 3. Alignment | REAL (bounded) | `depth-match`, `align-curve` | Reviewed monotonic piecewise anchors; linear/nearest resampling with gap limits and no extrapolation. | `backend/scientific_conventional.py:12` |
| 4. Facies / crossplot | REAL (bounded) | `facies-rules`, `facies-cluster`, `crossplot` | Threshold classification; standardized two-input k-means; paired scatter/regression. Clusters do not identify geology automatically. | `backend/scientific_core.py:173` |
| 5. Fluid indicators | REAL (bounded) | `fluid-indicators` | Deep/shallow resistivity ratio and density/neutron porosity separation; no definitive fluid typing. | `backend/scientific_core.py:187` |
| 6. Shale | REAL (bounded) | `shale-linear`, `shale-larionov-tertiary`, `shale-larionov-older`, `shale-stieber`, `shale-clavier` | Five GR-index transformations with reviewed endpoints; retain unbounded IGR and bounded Vsh. | `backend/scientific_core.py:191` |
| 7. Endpoint proposal | REAL (bounded) | `endpoint-proposal` | Reviewed-interval percentiles; statistical proposals require geological review. | `backend/scientific_conventional.py:54` |
| 8. Porosity | REAL (bounded) | `porosity-density`, `porosity-sonic`, `porosity-neutron`, `porosity-effective`, `porosity-combine` | Density mixing; Wyllie; calibrated affine neutron response; shale subtraction; explicit weighted same-basis combination. | `backend/scientific_core.py:197; scientific_conventional.py:102` |
| 9. Temperature / Rw | REAL (bounded) | `temperature-profile`, `resistivity-temperature` | Supplied vertical anchors/gradient; cited empirical temperature conversion for the separately identified fluid. | `backend/scientific_conventional.py:67` |
| 10. Saturation | REAL (bounded) | `saturation-archie`, `saturation-indonesian`, `saturation-simandoux`, `pickett-fit` | Archie; Indonesian; n=2 Simandoux quadratic; clean-water Pickett regression for m and a·Rw. Retain unclipped Sw. | `backend/scientific_core.py:206; scientific_conventional.py:116` |
| 11. Permeability | REAL (bounded) | `permeability-regression`, `permeability-timur`, `permeability-coates`, `hydraulic-units` | Core-calibrated power-law regression with held-out tail; calibrated empirical transforms bounded by phi/Swi range; RQI/FZI. | `backend/scientific_core.py:220` |
| 12. Minerals | PARTIAL | `mineral-inversion` | Per-row SciPy NNLS response matrix with soft closure, residual and condition diagnostics; maximum 20,000 rows. | `backend/scientific_core.py:237` |
| 13. NMR | PARTIAL | `nmr-partition` | T2-bin porosity sums, bound/free partition, T2 log mean; optional calibrated SDR permeability. | `backend/scientific_core.py:247` |
| 14. Core | PARTIAL | `core-fit` | Already aligned paired core/log regression and residuals. It does not automatically depth-match core. | `backend/scientific_core.py:255` |
| 15. Capillary | PARTIAL | `height-brooks-corey`, `height-thomeer`, `leverett-j` | Pc–Sw curve fitting and J normalization. No height-above-FWL application engine. | `backend/scientific_core.py:259` |
| 16. Images | PARTIAL | `image-normalize` | Global or per-row percentile normalization of rectangular arrays; no orientation/picking engine. | `backend/scientific_core.py:275` |
| 17. Pressure | PARTIAL | `pressure-gradient` | Pressure against reviewed TVD/TVDSS linear regression and equivalent gradient density; no full formation-test interpretation. | `backend/scientific_core.py:278` |
| 18. Prediction | PARTIAL | `predict-ridge`, `predict-forest` | Ridge or random forest with explicit withheld well and residual-based empirical intervals; output-unit gap noted below. | `backend/scientific_core.py:280` |
| 19. Corrections | PARTIAL | `correction-table` | One-dimensional supplied additive response table, bounded interpolation; exact tool/citation required. | `backend/scientific_core.py:290` |
| 20. Cutoffs / summary | REAL (bounded) | `cutoff-rules`, `reservoir-summary` | AND/OR threshold masks, zonal overrides and minimum bed; gap-aware weighted net/pay summaries, phiH, HCPH, kh. | `backend/scientific_core.py:293` |
| 21. Surface / property models | PARTIAL | `surface-interpolation`, `property-kriging` | Bounded 2D linear interpolation or GSTools ordinary kriging/conditional realizations. No 3D geological grid. | `backend/scientific_core.py:327` |
| 22. Upscaling | PARTIAL | `log-upscale` | Scalar thickness-weighted averaging over supplied cell edges; missing large-gap guard noted below. | `backend/scientific_core.py:336` |
| 23. Rock physics (both workflows required) | PARTIAL | `elastic-properties`, `gassmann`, `synthetic-seismogram` | Isotropic moduli/impedance; dry-to-saturated Gassmann bulk modulus; uniform-TWT normal-incidence Ricker synthetic. | `backend/scientific_core.py:341` |
| 24. Geomechanics | PARTIAL | `geomechanics-1d` | Density-integrated overburden, calibrated Eaton pore pressure and horizontal stress screening; vertical-reference gap noted below. | `backend/scientific_core.py:348` |
| 25. Production | PARTIAL | `production-allocation` | Linear calibrated sensor response to flow; no multiphase production-logging allocation engine. | `backend/scientific_core.py:350` |
| 26. Survey / clearance | PARTIAL | `trajectory-minimum-curvature`, `trajectory-clearance` | Minimum curvature/DLS; sampled nearest-offset-point distance. No uncertainty-ellipse anticollision. | `backend/scientific_core.py:352` |
| 27. Imported simulation comparison | PARTIAL | `simulation-compare` | Paired observed/forecast regression and RMSE; does not run or history-match a simulator. | `backend/scientific_core.py:255` |
| 28. Volumetrics / decisions | REAL (bounded) | `in-place-volumes`, `opportunity-score`, `volume-uncertainty` | A·h·phi·(1−Sw)/B; explicit weighted score; seeded independent triangular Monte Carlo/LHS volumes. | `backend/scientific_core.py:358` |

### Representative equations and controls

- GR shale: IGR=(GR−GRclean)/(GRshale−GRclean), then the selected linear/Larionov/Stieber/Clavier transform. Nonlinear transforms use bounded IGR; raw IGR remains in the output.
- Density porosity: (rhoMatrix−rhoBulk)/(rhoMatrix−rhoFluid). Sonic porosity: (DT−DTmatrix)/(DTfluid−DTmatrix). Neutron is an explicitly calibrated scale/offset, rather than a library of vendor response charts.
- Archie: Sw=[a·Rw/(phi^m·Rt)]^(1/n). Indonesian adds a shale-conduction term; this implementation's Simandoux quadratic requires n=2. Clipped and unclipped Sw are both retained.
- Pickett: fit log10(Rt)=b−m·log10(phi) in independently identified clean water-bearing rock. It identifies m and a·Rw; independent a or Rw is required to separate the product. It does not fit n.
- Temperature conversion: R(T)=Rsample·(Tsample+C)/(T+C), in Celsius, with fluid identity, applicability citation and supplied C. Mud/mud-filtrate resistivity is not silently treated as formation-water Rw.
- Permeability: calibrated powers of phi and Swi, or log(k) against log(phi) regression. Empirical application is restricted to reviewed calibration bounds. RQI=0.0314·sqrt(k/phi); FZI=RQI/[phi/(1−phi)] with k in mD.
- Mineral inversion solves NNLS on the supplied response matrix with a weighted closure row. It reports residual, closure error, rank and conditioning; closure is soft, not an exact equality.
- NMR uses supplied T2-bin porosity amplitudes. Bound/free volumes and optional SDR depend on the reviewed cutoff and calibration. Raw echo inversion and fluid typing are absent.
- Summary weights use left-station support on half-open sample intervals; intervals above maxGap contribute no thickness. Gross, net, pay, NTG, phiH, hydrocarbon pore-height and kh retain coverage information.
- Volumetrics use A·h·phi·(1−Sw)/B. Monte Carlo/LHS samples independent triangular inputs and reports exceedance P90/P50/P10. It does not resample log/equation uncertainties through the interpretation chain.

These describe the inspected implementation. Formula inspection alone does not validate applicability to a particular formation.

## UI → API → worker → retained result trace

| Surface | Implemented path | Persistence/output | Qualification boundary |
| --- | --- | --- | --- |
| Import evidence, register well, source coverage | well-importer.js and well-data/evidence integration → imports_api / ingestion worker → well_ingestion.decorate/register_evidence. | Retained originals/chunks, stable well/source IDs and reviewed active datasets. | Later mixed well/ZIP/survey changes have deferred acceptance scenarios in WELL_WORKFLOW_ACCEPTANCE.md; earlier importer tests do not validate every later format/path. |
| Log tracks, overlays, widths, rulers, zoom, histograms, crossplots | well-canvas.js / well-canvas-model.js; histogram in petrophysics-workspace.js:111. | Actual retained rows plus workbook/project display metadata. | These functions legitimately run in the browser; a separate numerical backend is not required for track width, plotting or display controls. |
| Tops, correlations, flattening, ghost anchors | Marker records and reviewed display transforms, including ghost source versions/evidence. | Project workbook metadata; originals unchanged. | Manual interpretation and display transforms, not automatic stratigraphic correlation or logging-run depth correction. |
| Individual method setup/run | petrophysics-workspace.js:46 → interpretation-workspace.js:130 runCalculation → /science/validate → configuration save → /science/runs. | Owner-scoped scienceConfigurations/scienceRuns, configuration revisions and idempotency key. | Cloud calculation only. Local evidence must be copied explicitly before server computation. |
| Admission | scientific_api.py:186 validate; :126 unit checks; run admission/capacity logic. | Immutable source snapshots/fingerprints and artifact reservations. | Known source units cannot be relabeled as another scale; unknown units still require user confirmation and evidence. |
| Worker | scientific_worker.py:25 read_inputs; :145 scoped_inputs; :180 verify_alignment; :192 run → scientific_core.evaluate. | Full chunk inputs, exact scope or explicitly aligned depth axes. | 250,000 rows, 2,000,000 input cells and 256 MiB artifact reservation; tighter individual limits apply. One method invocation is bounded, not unlimited field computation. |
| Proposal and acceptance | scientific_worker.py:109 write_result → result/chunk routes → review transaction at scientific_api.py:434. | Chunked independent datasets; rejection publishes none; acceptance writes review/calibration/lineage records. | Acceptance records the user's decision and leaves scientificApproval=false. It is not automated geological approval. |
| Prepare / Calibrate / Evaluate | petrophysics-workspace.js:74 guided and :122 workflow → scientific_workflows.py / scientific_workflow_worker.py:9. | Versioned definitions, frozen runs, private intermediates and three explicit checkpoints. | Guidance creates/reuses proposals; it is not a one-click calibrated interpretation engine. |
| Parameters and zones | project/well/zone/step precedence at scientific_workflows.py:84; zone scope checked in prepare_segment. | Parameter origins, units, scope and review evidence persist. | Explicit definitions and well/zone binding are required. A zone-table edit alone does not recompute accepted studies. |
| Workflow publication, cancellation, stale inputs | Shared scientific lease/quota, child segment runs, checkpoint acceptance transaction and ancestry fingerprints. | Earlier accepted checkpoints survive later failure; cancelled/ambiguous dispatch keeps reservations until settlement. | Historical mocked checks exist; current real Cloud dispatch, recovery, capacity/load and operational reconciliation remain unqualified here. |
| Report / scenarios | petrophysics-workspace.js:90 scenarios; :138 acceptedFigures; :139 report. | Accepted-current results, complete-row CSV, summary CSV, print-ready HTML and optional workbook comparison. | Browser-generated reports with bounded preview plots; full curves are separate exports. No report-layout service, scheduled publishing or native LAS writer was found in this path. |

## Implemented but not yet qualified: what that actually means

There is no evidence for labeling all current methods “never tested.” The inspected tests and retained records show different verification levels:

| Evidence | What it supports | What it does not support |
| --- | --- | --- |
| test_science.py:72 parametrizes list(METHODS) | Every advertised method has a bounded fixture call and serializable output check. | An accurate, independently validated result for every scientific model; the generic test mostly checks execution/structure. |
| test_science.py:80 onward | Specific analytical assertions for shale/density/Archie and clean-shale saturation limit, capillary recovery, trajectories, volumes, gaps, units and artifact handling. | Exhaustive nonlinear edge cases, all vendor tools and field applicability. |
| test_petrophysics_workflows.py:19/44/53/73/89/115 | Alignment support, unit conversion, Pickett identifiability, inheritance, ancestry, ambiguous dispatch, private dependencies and mixed-unit two-well checkpoint publication/rejection. | Real Firebase/Firestore/GCS/Cloud Run behavior under live load. Cloud boundaries are mocked. |
| .release/petrophysics-workspace-verification.json | 28 recorded browser groups, 64 configurations opened, empty pageErrors, zero Cloud content requests. The count is newer than the original 21-group milestone. | Execution of 64 scientific methods in production. “Configuration opened” is not calculation qualification. |
| .release/petrophysics-cloud-ui-verification.json | Five report/workflow checks, including complete-row CSV and controlled A4 rendering. Explicit realCloudExecutions=0. | Real Cloud end-to-end study acceptance. |
| PETROPHYSICS_WORKSPACE_2026-10-31.md and source/deployment receipts | Recorded 93 Python passes and previous read-only real-LAS/large-data UI checks; the seven scientific sources match retained release files. | Fresh results for today's checkout/runtime. These checks were not rerun. |
| WELL_WORKFLOW_ACCEPTANCE.md | Explicit record of later importer/survey/header/ZIP scenarios still deferred. | Universal LAS/DLIS/LIS/ZIP/vendor compatibility or measured upload speed. |

**Pending qualification inventory:** a real mixed multiwell conditioning → calibration → evaluation → accepted report; approved units/calibration; specialist source families (T2 spectra, image arrays, matched core/SCAL, pressure measurements); actual hosted checkpoint dispatch/cancellation/restart; capacity/settlement under live load; newer mixed import/ZIP/survey scenarios; account/project-switch resilience and native browser zoom.

A missing input is distinct from missing code. Do not invent units, Rw, water-zone evidence, core coefficients or mineral responses to make a blocked method appear operational.

## Where backend capability is missing or incomplete

The following are concrete missing scientific/workflow primitives relative to conventional application scope. Several have an existing small kernel; their missing functionality is specified rather than calling the whole module absent.

| Capability | Already present | Missing backend / workflow work | Priority |
| --- | --- | --- | --- |
| General petrophysical uncertainty | Independent volume Monte Carlo/LHS. | Correlated parameter distributions propagated depth-by-depth through Vsh/phi/Sw/k/net pay, model-choice uncertainty, reproducible ensemble provenance and sensitivity across the chain. | High |
| Full saturation-height application | Brooks–Corey/Thomeer fits and Leverett J. | Fluid densities/IFT/contact-angle conversion, reviewed FWL/contact and TVDSS linkage, plug/facies/flow-unit grouping, calibration transfer, HAFWL/Pc/Sw curve generation and validation. | High |
| Full multimineral interpretation | Linear NNLS with soft closure and residuals. | Nonlinear mineral/fluid response models, uncertainty weighting, physically constrained pore/fluid volumes, zonal model sets, XRD/CEC constraints, model switching and interpretation QC. | High |
| Vendor environmental corrections | Supplied 1D additive table and caliper flag. | Applicable tool/version-specific multidimensional corrections for borehole, mud, invasion, salinity, temperature, pressure and acquisition effects, with validated response data. | High |
| Additional shaly-sand saturation | Archie/Indonesian/Simandoux. | Waxman–Smits/Dual Water/Juhasz adapters and required CEC/Qv/bound-water/calibration contracts. Not executable in the catalog. | Medium |
| Thin-bed / laminated formation evaluation | Generic Vsh and porosity formulas. | Thomas–Stieber or equivalent supported laminated model, resolution/anisotropy handling and validated layer interpretation. | Medium |
| Advanced porosity / fluid-property suite | Wyllie, density, affine neutron, weighted combination; cited temperature correction. | Validated nonlinear/vendor neutron and additional sonic responses; gas/invasion-aware joint evaluation and salinity/fluid-property estimation with reviewable assumptions. | Medium |
| NMR processing / interpretation suite | Pre-inverted T2 partition and optional SDR. | Raw echo processing/inversion, noise/acquisition QC, calibrated cutoff selection and broader fluid/viscosity/multidimensional models. | Medium |
| Core / SCAL interpretation | Paired core/log statistics and simple Pc fits. | Core-run matching workflow, stress/reference corrections, plug/facies relationships, relative-permeability/wettability models and representative SCAL transfer. | Medium |
| Formation testing / fluid contacts | TVD/TVDSS pressure regression; manual contact annotation. | Pressure-station QC/mobility and compartment grouping, multiple fluid gradients, contact intersection with uncertainty and calibration integration. | Medium |
| Borehole images / core photos | Array normalization and retained original files. | Tool-aware image assembly/orientation/corrections, depth-registered display, dip/fracture picking and interpretation persistence; registered photo-track workflow. | Medium |
| Organic shale / unconventional evaluation | No dedicated catalog calculation. | TOC/kerogen/maturity/organic-porosity/saturation models and their calibration. Disabled unconventional command. | Later specialist |
| Dielectric interpretation | No dedicated catalog calculation. | Dielectric dispersion/response inversion and calibrated porosity/salinity/Sw interpretation. Disabled dielectric command. | Later specialist |
| High-angle/horizontal petrophysics | Survey reconstruction and depth conversions. | Formation layer/boundary model, forward tool responses and inversion of shoulder-bed/geometrical effects. Disabled high-angle-inversion command. | Later specialist |
| Production / cased-hole interpretation | A calibrated linear sensor-response calculation. | Full spinner passes/calibration, holdup/slip/multiphase allocation, temperature production models, pulsed-neutron/cement/casing evaluation. | Separate specialist programme |
| Extensibility / connectivity / delivery | Saved definitions, recipes, CSV/SVG/HTML and manual source import. | Sandboxed user scripting, visual graph authoring, real-time WITSML/ETP or platform connectors, report layout/scheduling and any required qualified LAS/DLIS export path. | Product-dependent |

No universal “all conventional applications do every feature” claim is intended. These products are modular; licensing and target use vary. The missing list distinguishes a conventional deterministic minimum from later specialist programmes.

## Confirmed source concerns and unverified scientific risks

### F1 — P1: cutoff operator can reset during graphical editor redraw
**Source:** frontend/dist/petrophysics-workspace.js:88, cutoffs.draw/read.
The option-selection expression compares against r.operatorerator instead of r.operator. When a stored or redrawn rule uses >=, < or >, no option is selected; the first <= option becomes the browser default, and read() writes it into the rule. Changing a property can redraw the form and trigger this loss. This can change the scientific selection when the user saves the scenario.
**Evidence level:** directly visible source defect; no browser reproduction run. Preserve the selected operator and later qualify redraw/reopen/submit cases.

### F2 — P1: 1D geomechanics does not enforce a vertical depth reference
**Sources:** backend/scientific_catalog.py geomechanics-1d; scientific_core.py:348; scientific_api.py:210.
Overburden is integrated over the supplied depth vector and hydrostatic pressure uses that vector. The method has no depthReference parameter and is not among methods with the API's source-reference guard. Thus a reviewed length column in MD can be admitted even though vertical stress integration needs an appropriate vertical axis.
**Evidence level:** missing guard confirmed by source; numerical impact for actual deviated wells is untested. This is a real implementation issue, not merely a lack of field fixtures.

### F3 — P2: log upscaling can bridge an unsupported large interval
**Sources:** backend/scientific_core.py:336 versus thickness at :97 and reservoir-summary at :314.
The upscale branch weights each station across its full adjacent depth interval. It has no maxGap parameter and does not reuse the summary gap exclusion. A finite left sample can therefore contribute support across a long unmeasured interval.
**Evidence level:** direct algorithm comparison; no computation run. Review gap/support semantics before using upscaled outputs as representative cell properties.

### F4 — P2: reconstructed curve outputs do not retain target units
**Sources:** backend/scientific_core.py:280 and :370; scientific_worker.py:115.
Prediction emits reconstructed/empiricalLower/empiricalUpper but does not assign their units; these keys are absent from known_units. The writer defaults absent units to unconfirmed. The target's actual physical unit is not propagated, complicating accepted-result reuse and weakening reported dimensional provenance.
**Evidence level:** direct source trace; no prediction job or UI reproduction run.

### Scientific applicability risks requiring later review, not confirmed numerical failures

- Mineral response rows can have heterogeneous dimensions, but the array binding carries one free-form unit; consistency and weighting are supplied by the user, not a typed response-model system.
- Pressure-gradient and geomechanics may accept depth conventions requiring more reference/sign detail than a simple label supplies.
- Generic core-fit/simulation-compare accept numeric paired columns rather than a full dimensional conversion contract; matching rows/units must be independently established.
- Summary and cutoff semantics need qualification around physical fraction domains, NULL support, OR rules and gaps/minimum-bed continuity. Do not infer these edge cases passed from a generic execution fixture.
- Image “dynamic normalization” here means row-wise percentile normalization; do not describe it as a complete vendor image-conditioning workflow.
- Calibration citations/confirmations are important controls, but a nonempty citation is not independent validation of geological applicability.
- Reports correctly label bounded preview plots; they should not be mistaken for full-depth publication-quality plots of every retained row.

## Disabled shell inventory

Source: frontend/dist/subsurface-capabilities.js:4; rendering/disabled attributes: petrophysics-ribbon.js groupedRibbon; petrophysics-workspace.js:72 capabilityLibrary / :73 viewChooser.

| Tab/group | Disabled command IDs |
| --- | --- |
| Home / project and collaboration | shared-library, live-collaboration, object-search |
| Logs / extended display | raster-digitize, image-track, core-photo-track, deviated-logview |
| QC / advanced conditioning | automatic-depth, tool-corrections, image-orientation |
| Petrophysics / advanced evaluation | multimineral-suite, dielectric, high-angle-inversion, unconventional |
| Geology / structural | fault-sticks, horizon-picking, structural-framework, fault-framework |
| Geology / stratigraphy | stratigraphic-column, sequence-stratigraphy, depositional, sedimentary-dips |
| Geology / borehole | dip-picking, fracture-picking, rose-plot, stereonet |
| Geophysics / seismic | seismic-3d-view, seismic-volume-probe, frequency-decomposition, seismic-4d-view |
| Geophysics / quantitative | avo-workspace, joint-inversion, wavelet-editor, synthetic-well-tie |
| Modeling / grids | pillar-grid, depogrid, zone-layer-model, grid-faults |
| Modeling / properties | facies-model, property-editor, fracture-network, scenario-modeling |
| Drilling / design | trajectory-editor, target-designer, geosteering, well-placement |
| Drilling / stability | mud-window, borehole-breakouts, cement-evaluation, casing-design |
| Reservoir / preparation | fluid-pvt, scal-editor, initialization, schedule-editor |
| Reservoir / simulation | simulation-launch, history-match, ensemble-review, streamlines |
| Production / interpretation | spinner-processing, holdup, temperature-production, multisensor-production |
| Production / performance | inflow-performance, nodal-analysis, production-surveillance, injection-profile |
| Workflows / automation | workflow-node-editor, python-console, real-time-streams, external-connectors |
| Reports / publishing | report-layout-designer, cross-domain-report, presentation-scene, scheduled-reports |

Planned view types: 3d-window, map-composer, seismic-window, image-window, core-window, stereonet-window, grid-window, simulation-window, production-window.

This is the multidisciplinary shell inventory, not a claim that an independent seismic module lacks horizon picking, wavelets or 3D rendering. Those sibling engines require their own audit. In particular multimineral-suite, image-orientation and spinner-processing coexist with smaller implemented kernels; disabling the complete workspace is truthful.

## Prioritized sequence for a later authorized implementation session

1. Resolve F1–F4 and agree the conventional scientific contracts (reference/units, supported formulas, gap/null semantics and calibration applicability).
2. Obtain approved units and calibration evidence for an actual study; design its acceptance ledger before starting scientific execution.
3. Qualify the complete existing deterministic chain and accepted reporting, including the deployed worker, ancestry, cancellation and independent reference results.
4. Complete full saturation-height application and conventional uncertainty propagation where required by the target study.
5. Complete environmental/model calibration and multimineral workflows, then prioritize thin beds, advanced core/NMR/pressure/image work according to actual source families.
6. Treat dielectric, organic shale, high-angle inversion, advanced production and cased-hole work as explicit specialist scopes. Do not enable them because a neighboring small kernel exists.
7. Keep UI-only controls, registered numerical methods, complete specialist modules and deployment/field qualification as separate inventory fields.

This sequence is a recommendation only. No implementation or testing is authorized by this audit.

## Headline counts and completion record

- Registered petrophysics/combined numerical methods with real code: **63**; missing registered dispatch implementations found: **0**.
- Method-family assessment (28 rows): **REAL 13; PARTIAL 15; STUB 0; DISABLED 0**. REAL is bounded implementation status, not fresh field acceptance.
- Separate shell ledger: **DISABLED 74 commands in 19 groups**, plus **9 planned view types**. These overlap the underlying method-family boundaries and must not be summed as missing backends.
- Identified incomplete/missing conventional or specialist capability areas: **16** (table above); some extend an existing kernel.
- Confirmed source concerns: **4**; application fixes/tests/deployments/cloud executions in this session: **0**.
- Application/source assets, existing dirty changes, user data, registry images and recovery material preserved. No cleanup mutation is required for this audit-only session.
