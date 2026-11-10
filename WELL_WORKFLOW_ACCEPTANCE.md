# Well workflow implementation and deferred acceptance

Source milestone: 2026-10-31; subsequently deployed on the same date at the user's request. See [live deployment record](WELL_WORKFLOW_DEPLOYMENT_2026-10-31.md). Source/build/operational-health checks do not qualify readers, numerical methods, migration behavior, accessibility, responsiveness or performance. No data/browser/scientific tests or GitHub publication occurred.

## Implemented source paths

- `frontend/dist/well-importer.js`: Files -> Review -> Match -> Mapping -> Import, per-asset configuration, complete incremental text inspection, structured binary inspection, source layout overrides, compatible-file mapping and reviewed activation.
- `frontend/dist/well-data.js`, `well-evidence.js`: source-based suggestions, identifiers, stable registrations, duplicate evidence, supported coordinate transformations and referenced survey reconstruction.
- `backend/well_ingestion.py`, `ingestion_core.py`, `ingestion_native.py`, `ingestion_worker.py`, `imports_api.py`: native equivalents, mixed assets, multi-well tables, binary source identity observations, retained-original reuse and version activation.
- `frontend/dist/well-derived.js`, `well-qc.js`: bounded retained-observation reads and separate checkshot QC. Original measurements remain in retained artifacts.
- `frontend/dist/well-canvas.js`, `well-canvas-model.js`: workbook visibility, global curve categories, shared marker picks, referenced depth conversion, styles and reusable templates.
- `frontend/dist/workbench.js`, `workbench.css`: shared route tabs, compact commands, persistent navigation collapse and application styling. Existing routes and engine gates remain authoritative.

## Explicit implementation boundaries

- Existing storage quotas and native materialization budgets remain. Browser readers are bounded to two; Cloud file uploads to three. Chunks within one resumable transfer remain ordered.
- Tables may contain up to 100 well groups. Header/marker registration collections are bounded to 1,000 records per parsed dataset; exceeding the boundary blocks activation instead of silently truncating registrations. Inspection with excessive issues is also blocked for a smaller-batch review.
- Identifier scanning retains unique identities and bounded previews rather than full log samples. Header review retains bounded header records. Text inspection pages through the complete original in 300-line windows, with encoding selection and an 8 MiB single-line guard. Large retained Cloud originals use the original download path.
- Local map transformations support WGS84 geographic, Web Mercator and WGS84 UTM. Native header placement uses the existing pyproj dependency for supported CRSs. Unresolved references remain unplaced.
- Minimum curvature requires MD 0, a confirmed WGS84 UTM origin, depth/angle units, vertical datum and north reference. True north uses an explicit correction or calculated grid convergence; magnetic north additionally requires documented declination. No magnetic model, tie-in or datum is invented.
- Supplied offsets and absolute coordinates retain their source observations. Z needs an explicit depth/elevation convention. Missing MD does not prevent a supplied coordinate path, but prevents MD-based depth conversion. Repeated/decreasing MD prevents trajectory derivation while its evidence remains retained.
- The log section offers source depth and the MD/TVD/TVDSS conversions supported by its active, compatible survey and elevation references. Checkshot time domains are inspected in the dedicated time-depth QC view. Conversion does not extrapolate outside evidence.
- Interval velocity is a derived consecutive-observation result. MD needs a compatible active survey conversion to TVD. Time units, one-way/two-way convention, signs and datums stay explicit. Invalid intervals do not produce invented velocities.
- Templates require unique confirmed curve-type/unit matches, or exact mnemonic/unit matches for unclassified curves. Missing/ambiguous matches are reported. This does not normalize uncertain units or select an arbitrary run.
- Timing fields describe measured stages of a future import. No speed improvement has been benchmarked or claimed.

## Deferred acceptance scenarios — not executed

1. Import all eleven well-data categories in a mixed batch, through Local, portable and Cloud storage. Verify category corrections, optional supporting files, per-asset configuration and disabled workflow restrictions.
2. Use identical filenames with different bytes; identical retained bytes with different owning wells; and independent versions of the same dataset. Verify stable asset keys, original reuse and version history.
3. Import multi-well tables with identifiers after the first 60 rows, quoted names, leading-zero UWIs and missing identifiers. Exercise name/UWI and header/filename rules, exact matching, ambiguity, compatible mappings and row-level owners.
4. Review repeated header rows, duplicate names/UWIs and coincident coordinates within a source, between sources and against existing registrations. Keep, skip or explicitly merge selected rows. Verify coordinates never merge identities and every retained row preserves provenance.
5. Import LAS, DLIS and LIS without headers. Verify only observed identifiers, coordinates, elevations and depths are reconstructed. Exercise multiple binary origins, conflicting identity records, sparse metadata and explicit owner conflicts. Do not interpret an RP66 WELL-ID as a confirmed UWI automatically.
6. Read structured Petrel ASCII headers, surveys, tops and checkshots, comments, header blocks, undefined-value declarations, annotated units, fixed widths, encodings and spreadsheets. Compare full source text with parsed records; exercise binary structured metadata and original downloads.
7. Confirm known projected headers plot immediately and unknown locations stay in the review list. Verify UTM hemispheres, axis order, unsupported CRSs, latitude limits, missing coordinates and owner changes.
8. Qualify angular minimum curvature against independent reference solutions, including straight holes, doglegs, singular geometry, true/grid corrections, magnetic declination and missing tie-ins. Compare supplied DX/DY/TVD, X/Y/TVD and X/Y/Z observations, units and sign conventions. Retain duplicate/decreasing MD for explicit review.
9. Keep multiple surveys and checkshots; switch active selections and reopen the project. Verify no earlier evidence is overwritten. Compare depth conversion and its inverse only within supported monotonic intervals and compatible datums.
10. Inspect all checkshot observations, time-depth plots and interval velocities using m/ft, s/ms, one-way/two-way times and sign/datum combinations. Include missing values, nonpositive intervals and decreasing/repeated observations. Verify QC exports distinguish originals from derivatives.
11. Import shared tops on several wells. Verify marker identity, per-well picks, trajectory references, hidden markers and visible correlation lines between actual picks. Confirm incompatible references are not connected as geological surfaces.
12. Toggle wells, runs, curves and global categories. Check partial parent states, immediate drawing, workbook-specific persistence, style retention, undo/redo and that display visibility never changes imported selections or measurements.
13. Apply templates to one and multiple wells with overlays, fills, ordering, scales, styles and missing/ambiguous curve matches. Reopen/export/import workbooks; inspect real sample values and source units. Verify linked scrolling, zoom, fit, readable headers and rulers.
14. Interrupt uploads before/after chunk acknowledgement; resume same-name assets explicitly. Exercise cancellation, expired sessions, transient failures, account/project switches, quota exhaustion, ownership isolation and retained-original recovery. Verify changed native content pauses activation.
15. Reopen legacy saved projects/workbooks and compare their IDs, associations, calculations and disabled-engine restrictions. Preserve the unrelated seismic draft work.
16. After separate authorization, benchmark representative file sizes and mixed batches against the previous version. Record browser/CPU/network/storage conditions; reading, identity scan, hashing, transfer, inspection and total timings; memory, cancellation and recovery. Do not infer improvement from queue limits alone.
17. After separate authorization, inspect narrow/wide workbench layouts, keyboard operation, focus, contrast, scrolling and screen-reader names.

## Primary reader references

- [dlisio DLIS API](https://dlisio.readthedocs.io/en/stable/dlis/api.html) and [multiple-origin metadata](https://dlisio.readthedocs.io/en/latest/dlis/metadata.html).
- [dlisio LIS information records](https://dlisio.readthedocs.io/en/latest/lis/userguide.html) and [component API](https://dlisio.readthedocs.io/en/stable/lis/api.html).

## Cleanup and publication

Applied the required cleanup review to the active repository. No disposable session artifacts or generated images were created; zero files/images were deleted. Preserve original assets, operational tooling, supplied screenshots, recovery material and all unrelated dirty seismic files. No Cloud images were created or removed, and no fresh registry inventory was performed. No deployment or Git publication was authorized.

Subsequent deployment cleanup reviewed61 STRATAX images, all tagged/protected, and retained all61. No local or registry deletions. Deployment/recovery artifacts are intentionally retained.


## Deferred import UI and source-action acceptance

- Check all five stages at narrow and wide viewports, keyboard navigation, focus restoration, long filenames, and reduced motion. Confirm complete-source inspection and per-source layout controls remain reachable.
- Import logs with header creation off and matching existing/header-table wells; verify no additional registrations are created. Repeat with it on and inspect provenance, missing-field handling, identities and unconfirmed map references. Confirm legacy imports retain their previous semantics.
- Observe real byte percentages, retained-original reuse, worker startup, per-file inspection counts, cancellation, interrupted transfers and reinspection progress reset. Ensure unknown-duration work remains indeterminate and the success popup appears only after commit.
- Check completion review expansion, grouped repeated warnings with source context, selected versus excluded datasets, source timings and destination names.
- Use every Actions entry on Local, portable and Cloud projects. Rename must preserve source IDs/bytes and dataset relationships. Delete must explain linked evidence, hide the original from ordinary Sources, keep all imported datasets/bytes/quota, and allow restore using the Trash filter. Check ownership/account/project changes during actions.
- Benchmark cold and warm mixed-batch imports separately before quantifying speed improvements. Browser/data/performance acceptance remains deferred; the current release runs source checks and operational deployment checks only.


### Deferred panel-footer regression checks

Reproduce the supplied Review and Mapping screenshots with review notes and all mapping sections expanded. Back/Continue must remain visible without collapsing any section; scrolling must stay inside the stage content. Repeat with long file lists, large curve lists, short/narrow viewports and browser zoom, then check keyboard focus and the completion review dropdown. This CSS correction was source-reviewed only; browser acceptance remains deferred.


## Deferred progress / related-survey / ZIP scenarios

- Observe a cold worker startup, hashing, record/chunk counters, validation and finalization. Ensure only measurable byte progress gets a percentage; elapsed/update-age ticks must not imply progress. Cancel during each phase and check timer cleanup, account ownership and reinspection dispatch isolation. Lower per-file bars must be absent.
- Attach deviation from Files for one of several logs, with and without uploaded headers, with header creation enabled/disabled, with multiple runs per well and with multi-well tables. Change the owning well, conflict with an actual source identifier, exclude/remove/re-add the parent, and verify explicit correction/acknowledgement plus persisted association.
- ZIP: single/multiple wells; all well-data families; flat/nested folders; up to three nested ZIP levels; multiple ZIPs sharing the total budget; duplicate names in different/same folders; repeated exact paths; Unicode/case variants; renamed/mislabeled and unknown files; binary package files preserved intact; empty ZIPs/entries and OS metadata.
- Review include/exclude, classification corrections, editable row associations, multiple logs for one well, missing headers, source reuse, native pause and retained-original provenance. Check Shapefile/EPC companion grouping, absent/ambiguous files, and partial selection. Reopen a retained ZIP and retry wrong passwords without losing reviewed entries.
- Encrypted entries, correct/incorrect/missing and mixed nested passwords; supported/unsupported compression; CRC/authentication failure; truncated/corrupt/multipart/self-extracting ZIPs; absolute/traversal/backslash/drive paths; symlinks/devices; executables; overlapping entries and directory mismatches. Bad entries must remain explicit review exclusions with originals retained.
- Exercise file/member/aggregate/metadata/count/nesting/ratio/time limits, cancellation, browser reader failure and unavailable storage. Validate no password persistence, cross-owner references or asset configuration collisions. Compare measurements and benchmark only after authorization.

These browser/data/ZIP fixture scenarios remain unrun. Current verification is source-only plus operational deployment metadata/health/log checks; existing user-triggered job history was inspected read-only.
