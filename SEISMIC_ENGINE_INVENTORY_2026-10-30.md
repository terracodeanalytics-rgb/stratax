# StrataX seismic engine inventory — 2026-10-30

> Historical baseline at c7a5c6b. Later local implementation progress is tracked in
> SEISMIC_ENGINE_COMPLETION.md; this table is not a new audit of that untested work.

## Scope and meaning

Fresh source inventory at Git checkpoint `c7a5c6b4b072a2ce2e9bc8e0f55e23f06f42de74`, plus read-only Google Cloud deployment metadata. Reviewed Processing graphs, the 16 Seismic engines ribbon items, seismic Interpretation, execution/persistence and dependency manifests. No implementation changes, application requests, browser tests, scientific calculations, job executions or benchmarks were performed.

**☑ means the implementation is complete for the stated bounded item, with testing still pending. ☐ means the agreed engine/workflow scope remains incomplete.** A method having numerical code, an API route or an installed library does not by itself complete the entire engine. Missing tests are recorded separately and are not the reason an item is unchecked.

This inventory distinguishes source implementation from UI availability. `REAL` below means a concrete complete bounded source path exists; it is not a claim of newly verified execution. `PARTIAL` means substantive code with remaining programme/workflow limitations. `STUB` means placeholder-only implementation. `DISABLED` is a separate UI state that can coexist with meaningful partial backend code.

## Seismic engines: current checklist

| Ribbon item | Complete implementation, testing pending |
|---|:---:|
| Well ties | ☐ |
| Velocity | ☐ |
| Attributes | ☐ |
| AVO / inversion | ☐ |
| Surfaces | ☐ |
| Models | ☐ |
| 4D | ☐ |
| Slices | ☑ |
| Cloud index — full distributed implementation | ☐ |
| Kirchhoff | ☐ |
| SRME prediction | ☐ |
| Geostatistics | ☐ |
| Travel times | ☐ |
| Regularisation | ☐ |
| Surface statics | ☐ |
| Acoustic RTM / FWI | ☐ |

**1 complete bounded engine / 15 partial engines.** This matches the saved checklist; no engine has been promoted to complete in this audit. The other15 are greyed out in the current UI, although their backend routes contain substantive implementations.

## What exists and what remains

The remaining column concerns the full agreed programme. It does not negate the narrower implemented operations listed alongside it.

| Engine / backend route | Actual implementation found | Remaining scope / limitation | Source evidence |
|---|---|---|---|
| Well ties — `tie` | Wiener wavelet extraction; imported/Ricker/phase-rotated wavelets; bulk-shift correlation; piecewise time edits; misties; sonic/density/checkshot synthetic | Bounded calculations exist; the complete managed calibration, time–depth/wavelet resource and graphical tie-workbook workflow remains incomplete | [tool_tie](backend/seismic_tools_api.py#L128), [calibrated_synthetic](backend/seismic_ties.py#L85), [wavelets](backend/seismic_wavelets.py) |
| Velocity — `velocity` | Explicit RMS/interval/average conversions for functions/volumes; integration; thickness; genuine3D cube time/depth resampling | Full well-calibrated velocity-model revision and uncertainty workflow remains incomplete; cube conversion is not a field velocity-building solver | [tool_velocity](backend/seismic_tools_api.py#L156), [convert_velocity_volume](backend/seismic_velocity_work.py#L82), [convert_cube](backend/seismic_depth_model.py#L9) |
| Attributes — `attributes` | Envelope/RMS/phase/frequency, coherence, dip, spectral decomposition; genuine3D structure tensors and volume attributes | Bounded arrays; no complete field-volume distributed/halo-aware attribute execution path | [tool_attributes](backend/seismic_tools_api.py#L182), [attributes](backend/seismic_processing.py#L164), [structure_attributes](backend/seismic_volume_attributes.py#L8) |
| AVO / inversion — `qi` | Shuey fits; Shuey/Aki–Richards reflectivity; regularised post/prestack inversion; volume wrappers; forward residuals; held-out-well prediction | Complete source/gather/angle/background/calibration workflow remains unfinished; volume inversion solves vertical locations independently, not a coupled lateral volume solver | [tool_qi](backend/seismic_tools_api.py#L511), [inversion](backend/seismic_inversion.py), [invert_volume](backend/seismic_volume_workflows.py#L18), [prediction](backend/seismic_prediction.py) |
| Surfaces — `surfaces` | Pick grids; fault-stick strips; barrier/seed-driven3D tracking proposals; fault-block surfaces/layers/closures; physical horizon meshes; flattening; OBJ export | Full survey-coordinate3D interpretation editing and managed framework/workbook path remains incomplete | [tool_surfaces](backend/seismic_tools_api.py#L210), [tracking](backend/seismic_horizon_tracking.py), [physical mesh](backend/seismic_interpretation_ops.py#L6) |
| Models — `models` | GemPy implicit structure; regular property grids; depth-interval well averages; explicit corner geometry; regular/split-pillar RESQML EPC/HDF5; GRDECL; volume sums | No general implicit-to-intersecting-fault/truncation grid conversion, general faulted-grid well blocking/upscaling or complete ensemble/exchange workflow | [tool_models](backend/seismic_tools_api.py#L245), [implicit model](backend/seismic_implicit_model.py#L6), [model helpers](backend/seismic_models_work.py), [exchange](backend/seismic_model_exchange.py) |
| 4D — `4d` | Associations; differences; stable-region amplitude/phase/time matching; FIR equalisation; NRMS/correlation/shifts; genuine3D volume wrappers and registration | Registration is bounded translation, not a general acquisition/deformation solution; full vintage geometry/common-support workflow and field execution remain incomplete | [tool_4d](backend/seismic_tools_api.py#L298), [volume operations](backend/seismic_volume_workflows.py#L50), [registration](backend/seismic_4d_registration.py#L8) |
| Slices — `slice` | Inline/crossline/time/arbitrary/linked-triad extraction with validity masks; reviewed source-brick binding; approved bounded job, result artifact, preview, download/review and saved workbook references | Complete for bounded extraction; does not establish field-scale storage/viewing capacity or numerical correctness | [tool_slice](backend/seismic_tools_api.py#L90), [slice functions](backend/seismic_slices.py), [source inputs](backend/seismic_source_io.py), [UI binding](frontend/dist/seismic-qi-workspace.js) |
| Cloud index — `index-manifest` | Real immutable-source ragged sharded Zarr partitions, display pyramids, sequential checkpoints/restart, checksums, bounded downstream indexed reads | Sequential partition execution; no complete distributed1TiB/10TiB scheduler/storage path | [worker](backend/seismic_cloud_index_worker.py#L13), [reader](backend/seismic_cloud_index_reader.py#L12), [job worker](backend/seismic_tool_worker.py) |
| Kirchhoff — `imaging` | Genuine2D/3D forward/adjoint kinematic point operator, aperture selection, homogeneous velocity or supplied source/receiver one-way tables | Full field amplitude/anti-alias treatment, travel-time/velocity-building integration and distributed imaging incomplete | [tool_imaging](backend/seismic_tools_api.py#L381), [kirchhoff_operator](backend/seismic_imaging.py#L8) |
| SRME prediction — `marine` | First-order surface-multiple prediction with explicit source signature and quadrature on complete collocated source/receiver surface response | Does not complete acquisition-aware irregular streamer SRME, missing-offset reconstruction or full adaptive prediction/subtraction workflow | [tool_marine](backend/seismic_tools_api.py#L427), [predict_surface_multiples](backend/seismic_srme.py#L8) |
| Geostatistics — `geostatistics` | Empirical/fitted variograms; local ordinary kriging; seeded sequential Gaussian/indicator simulations | Bounded point sets; full fault/zone-conditioned property-model, upscaling and ensemble orchestration incomplete | [tool_geostatistics](backend/seismic_tools_api.py#L467), [kriging](backend/seismic_geostatistics.py#L52), [simulation](backend/seismic_geostatistics.py#L84) |
| Travel times — `travel-times` | Genuine2D/3D first-order isotropic fast marching using explicit grid-node sources and positive interval velocity | Bounded solver, not a completed field tomography/shot-table/distributed imaging pipeline; route cap50000 cells, lower-level cap250000 | [tool_travel_times](backend/seismic_tools_api.py#L415), [first_arrival_times](backend/seismic_travel_times.py#L7) |
| Regularisation — `regularise` | Acquisition-coordinate local RBF interpolation; scales, neighbour/geometry checks, support masks | Bounded local interpolation, not the complete survey-wide amplitude/alias-controlled distributed regularisation workflow | [tool_regularise](backend/seismic_tools_api.py#L444), [regularise_traces](backend/seismic_regularization.py#L8) |
| Surface statics — `statics` | Source/receiver delay fitting from observed/predicted timing residuals, regularisation and reviewed shift limits; land tools apply explicit corrections | Does not complete weathering/refraction tomography or the full land residual-statics cycle | [tool_statics](backend/seismic_tools_api.py#L455), [fit_surface_statics](backend/seismic_statics.py#L8), [land operations](backend/seismic_field_ops.py) |
| Acoustic RTM / FWI — `acoustic` | Devito genuine2D/3D CPU acoustic sessions; serial shots; modelling/RTM; absorbing boundaries; multiscale FWI, bounded updates/line search and checkpoint code | Distributed shot/domain execution, MPI/OpenACC commissioning, complete solver-state recovery and field orchestration remain incomplete; modelling checkpoint records a completed-shot count, while its modelling loop does not consume resumed state | [dispatcher](backend/seismic_acoustic_engine.py#L6), [AcousticSession](backend/seismic_acoustic.py#L10), [RTM/FWI](backend/seismic_rtm_work.py), [worker restart](backend/seismic_tool_worker.py) |

The acoustic modelling restart limitation is visible directly in `execute_acoustic`: `model` iterates every session and writes only `completedShots`; unlike the RTM/FWI branches, that branch does not use `resumed` or restore completed records. Do not describe all acoustic operations as fully restartable.

## Execution, persistence and capability truth

- [Tool jobs](backend/seismic_tool_jobs.py#L16) admit18 tool IDs: the16 ribbon families plus geometry and land. The direct analytical API has19 POST routes, including export/handoff and excluding the separate acoustic worker dispatcher. These are route counts, not completed-engine counts.
- [Engine catalog](backend/seismic_engine_catalog.py#L9) lists19 capability records. `available` can be true because a worker profile has a job/image configured; it does not verify scientific completeness or successful execution. Records explicitly retain `fullProgrammeImplemented=false`, `fieldScaleQualified=false` and pending testing.
- [Worker](backend/seismic_tool_worker.py#L18) claims owner-scoped runs, resolves immutable/private inputs, writes checksummed private NPZ outputs/checkpoints and settles usage. [Jobs API](backend/seismic_tool_jobs.py) supplies estimates, reviewed version-bound submission, status/cancellation, artifacts, independent review and indexed reads. This common infrastructure does not finish every engine's scientific workflow.
- The UI [availability map](frontend/dist/seismic-ui-availability.js#L1) enables only Slices in the engine tab; [handlers](frontend/dist/seismic-qi-workspace.js) also guard run actions. Backend APIs intentionally retain their narrower analytical operations; greying a button does not remove an API route or make backend code disappear.
- Most analytical matrix/volume requests are limited to two million cells; private input JSON is limited to8MiB in the worker, preview artifact reads to64MiB, and analytical indexed partition downloads to128MiB per bounded read. Specific operators impose smaller limits. These are bounded execution contracts, not full survey capacity.

## Other seismic screens

The current source matches the prior [saved checklist](SEISMIC_BACKEND_CHECKLIST.md). These totals include controls such as Sources/Save/Versions; they must not be described as counts of scientific algorithms.

| Screen | Checklist rows | Complete stated item, tests pending | Partial agreed item |
|---|---:|---:|---:|
| Processing |28|17|11|
| Seismic engines |16|1|15|
| Interpretation — Seismic |8|3|5|
| Total |52|21|31|

Processing contains24 registered numerical graph operators,14 enabled and10 disabled by the UI completion map. Sources, geometry review and graph validation/save account for the remaining checklist controls. Incomplete graph operators are FK full2D/3D, residual statics, DMO, poststack migration, debubble, swell noise, Radon, PSTM, PSDM and RMO. Geometry review is also disabled for the full agreed workflow. Numerical functions still exist for these narrower operators: see [operator definitions](backend/seismic_graph.py#L11) and [dispatch](backend/seismic_graph.py#L299).

Interpretation enables Sources, Add section and Saved versions. Full New horizon/fault2D/3D, backend tracking, reviewed geometry, full3D view and complete interpretation/mesh export remain disabled. Existing local picking/display/history behavior is retained separately; it is not evidence of a complete3D backend. See [interpretation availability](frontend/dist/seismic-ui-availability.js#L7) and [workspace](frontend/dist/seismic-workspace.js).

## Live metadata checked today

API `stratax-api-00028-wew` still receives100% traffic. No backend deployment was performed. The previous revision24 rollback tag remains present. Current worker job metadata:

| Worker job | CPU | Memory | Timeout | Tasks / parallelism | Retries | Image digest |
|---|---:|---:|---:|---|---:|---|
| stratax-seismic-worker |2|4096Mi|600s|1 /1|0|sha256:06d5093695e8797538a55f755ec30795e5c26b3cd8833950ed80519966548030|
| stratax-models-worker |4|16384Mi|1800s|1 /1|0|sha256:e617df23d4f25025f87ba146252d9000d48d2378860be7808886e20a9943d838|
| stratax-acoustic-worker |4|16384Mi|1800s|1 /1|0|sha256:6497bd21bb1027918399558ab23fee1c0231ba4e8e95b6297f860b79f9d33b18|

These are configured worker jobs, not proof of a completed calculation. None was executed in this inventory.

Dependency manifests retain NumPy2.3.5, SciPy1.16.3, PyLops2.8.0, Zarr3.1.3, pyproj3.8.0; the model worker adds GemPy2026.0.3 / gempy-engine2026.0.3.post1 and resqpy5.2.1; acoustic adds Devito4.8.23 / pyrevolve2.2.8. They are source pins, not a fresh in-container import inspection. The acoustic Dockerfile selects GCC14 and C; no GPU/MPI qualification is inferred. See [science](backend/requirements-science.txt), [seismic](backend/requirements-seismic.txt), [models](backend/requirements-models.txt), [acoustic](backend/requirements-acoustic.txt), [acoustic image](backend/Dockerfile.acoustic).

## Priorities and verification limits

1. Preserve honest disabled states; do not substitute capability availability or dependency presence for implementation completeness.
2. Finish the scoped calibration/gather/model/interpretation workflows and expose individually completed operations with precise scope, rather than relabelling the whole broad engine complete.
3. Complete distributed field execution, full marine/imaging methods and faulted-grid workflows; complete acoustic restart behavior by operation and separately commission CPU/MPI/OpenACC profiles.
4. Keep numerical, frontend, field and capacity verification pending until the user authorises it. Large benchmarks still require an exact reviewed estimate.

No runtime or scientific correctness conclusion is drawn. No UI/backend change, deployment, cleanup deletion, commit or push was part of this read-only inventory plus requested report creation. The new report is the only workspace change.

**Headline engine counts: REAL (source-complete bounded path)1; PARTIAL15; STUB0. UI state: enabled1 / DISABLED15. Disabled and partial overlap. Testing remains pending for all16.**
