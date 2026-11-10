# Import UI release - 2026-10-31

The five-stage import interface and Sources Actions menu are live on Site version4. The existing public audience and service settings are preserved. This release builds on the prior well workflow and excludes unrelated dirty seismic backend drafts.

## User-visible behavior

- Files, Review, Match, Mapping and Import use an original SVG system, progress rail, editable field/source-value tables and readable confirmation cards.
- With no header file, users explicitly tick **Create well headers from log files**. Unchecked logs require existing/uploaded-header associations. Both native and browser collectors honor the flag; legacy requests retain their previous behavior.
- Progress shows real byte counts/percentages for transfer and local text reading, file counts for native inspection, and indeterminate bars for unknown-duration work. A committed import produces a thumbs-up popup with expandable datasets and grouped review notes; changed inspection evidence still pauses.
- Sources Actions includes Inspect, Rename, Download original, Import/reclassify and Delete. Delete is a reversible move to Trash, with known dependent datasets explained. Original bytes, dataset associations and storage charges remain retained. Rename updates the display label without changing physical filenames or IDs. Known well names replace raw IDs in Sources/Datasets.

## Performance work and limits

Two browser readers / three Cloud file transfers remain bounded and each file's chunks stay ordered. New Cloud originals without matching retained sizes avoid a redundant client hash pass. Local text files hash during their existing parse stream. Unchanged physical previews survive unit/reference-only edits, new transfer sessions skip the initial status probe, concurrent session updates retain each other's URL, and repeated retained-original fingerprints are reused within a dispatch.

No benchmark, data, numerical or browser tests were run. These are source-level reductions in redundant work, not measured speed claims. Deferred acceptance is recorded in `WELL_WORKFLOW_ACCEPTANCE.md`.

## Deployment evidence

- Site version4 / source `b10c3afbda73298e7b635153b696f2a6feb404a7` / deployment `appgdep_6ae58154a9188191a36c3f623420f2c7` succeeded.
- API build `b90990bd-7ece-46ed-afbc-de5925b9cd8e`, digest `sha256:8ac2fbd16f723d0ca24677ad2de76b3de892da0d9509dae5c2b07dafca63f6a2`; revision `stratax-api-well-import-ui-1031b` serves100%. Candidate/production `/api/health` returned status ok; fresh revision ERROR log query was empty.
- Import worker build `6d58daff-ffac-4c3f-8bfe-4dbc599a1631`, digest `sha256:fc50a4f3c976eec40c0763da5850b5e63246938983e6ffb1203b36cbb3c5b99c`.
- Science worker build `9271dd3e-01b8-4c8f-a488-b4546be24e6d`, digest `sha256:cfbd8476e58325e37c9d24c153fde4b8fe5448201680b373565ecfc42efc5aba`.
- No job executions. Rollback tag `well-import-ui-previous` points to `stratax-api-well-workflow-1031a`. Prior rollback/candidate tags remain.
- Isolated backend source used the prior live release plus `projects.py`, `imports_api.py`, `ingestion_worker.py` and `well_ingestion.py`. Inherited release-only Dockerfiles omit data-test execution under the user's continuing restriction. Maintained Dockerfile gates were not removed.

## Verification and cleanup

Nine changed/new JavaScript modules passed syntax checks; four Python modules passed AST parsing. Relative imports resolve and tracked/new-file whitespace checks passed. Site native publication and API operational checks passed; authenticated browser/data acceptance remains unrun.

Cleanup inventoried64 registry images, with37 related API/import/science images all registry-tagged and protected;27 others were out of scope. Zero images were eligible/deleted and zero local junk was removed. Retain release receipts, archives, rollback images and Site checkout. Main repository GitHub commit/push remains unauthorized/deferred; only the separate Site source was published.
