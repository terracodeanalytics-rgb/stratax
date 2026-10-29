# Seismic engine implementation v2 — 2026-10-29

## Current scope

This is an engine implementation checkpoint, **not completion of M0–M9**. The user
explicitly requested no further data tests and deferred testing to the frontend.
No data tests or fixture calculations were started after that instruction. Only
Python compilation, JavaScript parsing, diff review and packaging are allowed in
this phase. Engine Dockerfiles default `RUN_ENGINE_TESTS=0`; an explicit build arg
is required to run their retained qualification fixtures in a later authorised pass.

The initial audit remains historical evidence of the defects that prompted these
changes. The fixes and new engines below supersede its implementation descriptions;
they do not retroactively close acceptance cases.

## Built source paths

| Area | Implemented source | Constraints |
| --- | --- | --- |
| M0 contracts | `seismic_engine_catalog.py`, graph engine v2 fingerprint | Per-runtime missing dependencies; field qualification remains false |
| M1 execution | existing owner-scoped graph admission plus `seismic_engine_runner.py` | Atomic local/private NPZ output/checkpoints; new manifest engines are not yet admitted by hosted graph jobs |
| M2 ties | `seismic_ties.calibrated_synthetic` | Independently sampled checkshots, monotonic sonic drift, explicit TVD/TWT references, no extrapolation |
| M2 interpretation | `seismic_horizon_tracking.track_volume` | 3D event/correlation proposals, seed/manual/locked preservation, barriers, bounded proposal size and stop reasons |
| M3 depth | `seismic_depth_model.convert_cube` | Genuine 3D interval velocity, explicit source/target axes and reference; missing support remains invalid |
| M3 structure | `fault_block_surface`, `layer_framework`, `closure_map` | Reviewed fault-block identities, proportional zones/layers/pinchout masks, priority-flood spill/closure maps |
| M4 statics | `seismic_statics.fit_surface_statics` | Damped source/receiver inversion of supplied observed-minus-predicted timing, bounded corrections; not weathering tomography |
| M4 DMO | `seismic_land.elliptic_dmo` | Explicit NMO first; dip-limited kinematic elliptic scatter, amplitude-preserving claim withheld |
| M4 migration | `poststack_phase_shift_migration` compatibility key | Executes actual homogeneous zero-offset Kirchhoff diffraction sum; frontend label updated accordingly |
| M5 Radon | `seismic_radon.py` | Exact discrete scatter/adjoint and damped LSQR decomposition; existing graph now calls it |
| M5 SRME | `seismic_srme.predict_surface_multiples` | First-order surface integral on complete collocated deghosted response; supplied signature, line/area quadrature, no invented missing acquisition |
| M5 regularisation | `seismic_regularization.regularise_traces` | Explicit physical acquisition/offset axes and scales, local RBF inside measured convex support |
| M5 imaging | `seismic_imaging.kirchhoff_operator` | Genuine 2D/3D kinematic operator and exact transpose; homogeneous analytic or reviewed one-way travel tables; explicit aperture |
| M5 travel times | `seismic_travel_times.first_arrival_times` | Isotropic first-order fast marching, 2D/3D grid-node geometry; off-grid sources not rounded |
| M6 attributes | `seismic_volume_attributes.structure_attributes` | Genuine 3D physical-coordinate structure tensor, dip/azimuth/coherence/curvatures; time curvature is labelled time-surface curvature |
| M6 inversion | post/prestack API branches, `seismic_inversion.py` | Assessed wavelets/priors/amplitude histories; balanced traces rejected; PyLops runtime required |
| M6 prediction | `seismic_prediction.calibrated_prediction` | Entire blind wells held out; regression/classification, feature importance, prediction ranges, clearly labelled forest disagreement |
| M7 implicit model | `seismic_implicit_model.compute_implicit_model` | Pinned headless GemPy, explicit ERODE/ONLAP/FAULT groups and affected relations; no implicit-to-corner-grid topology invention |
| M7 properties | `seismic_geostatistics.py` | Empirical/fitted exponential variograms, anisotropic local ordinary kriging, random-path SGS on reviewed Gaussian scores, SIS categories, deterministic seeds |
| M7 exchange | `seismic_model_exchange.py` | Actual RESQML 2.0.1 EPC/HDF5 regular and explicit split-pillar geometry/properties, active support and signed-volume checks |
| M8 acoustic | `seismic_acoustic_engine.execute_acoustic`, `AcousticSurvey`, `rtm_survey`, `run_multiscale_fwi` | Sequential multishot kernels, saved-wavefield correlation RTM/illumination; squared-slowness-to-velocity gradient, band projection, Armijo backtracking, bounded updates and checkpoint hooks |
| M9 4D | `cross_equalise_fir`, `seismic_4d_registration.register_vintages` | Full-window stable-mask FIR fit; 3D common-axis registration bounded by reviewed physical shifts; reservoir regions excluded from fitting |
| M9 export | `seismic_export.py` | Correct SEG-Y rev1 binary fields, unsigned counts/intervals, trace delays, TWT-only exact representability; invalid geometry/float32 overflow rejected |

## API and worker connections

Existing authenticated `/api/projects/{pid}/seismic/tools` now includes capabilities,
imaging, travel-times, marine/SRME, regularise, statics and geostatistics endpoints,
alongside extended tie/velocity/attributes/surfaces/models/qi/4d/export routes.
Large science is not silently launched from these bounded array endpoints. Missing
model or quantitative dependencies return 503; missing numeric support serialises
as JSON null. Analytical tool results are still ephemeral until the complete
source-driven artifact/review integration is implemented.

`python backend/seismic_engine_runner.py manifest.json result.npz --checkpoint checkpoint.npz`
is a private/offline worker entry point, not an API bypass. Manifest keys are
`engineVersion: stratax-seismic/2.0`, `engine`, and `arguments`. Supported manifest
engines are acoustic, implicit-model, srme, structure-attributes, travel-times,
depth-conversion, regularisation, statics, horizon-tracking, prediction, kriging,
simulation and variogram. It performs no uploads or cloud job dispatch. Input
manifest is bounded to 64 MiB; JSON metadata references numeric NPZ arrays without
pickle. Outputs and checkpoint writes replace atomically within an existing private
directory. Hosted owner/source/estimate admission still belongs to the existing API.

Graph v2 fingerprints include the implementation version, so old approvals and
checkpoints cannot silently qualify changed algorithms. Depth-producing graph
steps invalidate later TWT-only operations. RMO output shape and homogeneous depth
migration sample spacing are accounted for in resource estimates.

## Verification chronology and limits

Before the no-data-test instruction: existing/new focused engine checks passed;
full backend at that earlier source was **196 passed / 4 skipped**. An earlier full
run had a transient exchange-file syntax error while the source was being edited;
the correction passed its focused suite. Additional later focused runs and GemPy
plane/fault cases passed before the instruction. These numbers do **not** qualify
the final sources added afterward.

The acoustic candidate first exposed the stock adjoint's 3-buffer incompatibility
with saved RTM wavefields; corrected to an explicit upstream backward stencil.
Build `097a32d0-4fc6-4ef0-9b18-0824d3c6e078` succeeded, digest
`sha256:295f3f9e1758dff30dc2842c581f13cfa91e7477961ebff82ce95f9689f68fbe`.
Model candidate `518a6a49-276e-4df7-a0fe-038a6939e735` also succeeded, digest
`sha256:db88642463c5be9d6b96eec7fd3e403c08722496cbcee385e4840ea50f9043f3`.
Both predate the final implementation additions.

The browser regression begun before the instruction passed local views/picks and
processing navigation after correcting its stale assertion for the user's existing
Seismic engines sidebar entry. The loopback Cloud run then returned 503 during
submission. **That path remains unresolved and must be recorded as failing**, not
hidden by the earlier green suite. No browser suite was restarted after the user
deferred testing.

Packaging-only builds with data tests off: seismic `119506f7-0019-45ce-b69d-91dd89c89971`
(`sha256:f01dc373046e1646f90f73431a41b59a3c91b9d0a8cc390ad8073ec6c65b87f8`),
models `1d9d32b0-ae10-4421-89ae-2c624b1e7e40`
(`sha256:879ded4d19d97d8816a6cb68d121bd9234b14d1775691404ac684ddd3625e54e`).
Final packaging builds all succeeded with tests disabled:

| Runtime | Build | Immutable digest |
| --- | --- | --- |
| Seismic | `7f10bdfb-eaa3-4a3a-8883-eb438cac649c` | `sha256:c431ed0cae2631aa734e318e11b4a1ae600ff7de8d182169a188165f8fc060c4` |
| Models | `92136b3e-693e-4bf6-afd0-9cbd797a2e42` | `sha256:3d9f8256b23e0fa98cddad3a422eb896bd795f105f07829a7e19901215af3594` |
| Acoustic | `4834d4b1-f1f0-4b02-902b-26f40b2659d1` | `sha256:c497bd1b39db7c583d962fcad3862ce72422fd474dd7867e033701ad91016adc` |

Building an image without tests demonstrates packaging, not numerical correctness.
Scoped final cleanup reviewed **36 images, all tagged/protected**, zero untagged,
zero deletions. No original data, isolated dependencies or recovery tools removed.

## Still not completed

- Complete M0–M9 acceptance, field/capacity qualification and one complete production release.
- Actual distributed sharded analytical indexing/pyramids and globally coupled execution;
  1 TiB / 10 TiB capabilities are not established by these bounded engines.
- Hosted admission/estimates/approved dispatch and durable review artifacts for every
  new tool, especially acoustic/model engines. Current live API lacks a seismic profile.
- MPI/OpenACC profiles and compiler/device qualification. Sequential multishot code
  is not MPI/domain decomposition.
- Off-grid variable-velocity ray/table handling with full anti-aliasing/amplitude
  qualification; full acquisition-aware field SRME/aperture/primary QC; weathering
  tomography and complete land/marine field pipelines.
- Automatic conversion of implicit structures into valid representable faulted grids,
  full intersecting-fault/truncation/pinchout workflows and complex model acceptance.
- Full petrophysics-style source-driven tie/QI/model/4D workbooks, signed-in hosted
  validation and final frontend publication. JSON tool panels do not satisfy that UX.

Production remains API `stratax-api-00022-yes` and the previously published Site;
no service traffic, live job profile, quota, account or audience changed here.
