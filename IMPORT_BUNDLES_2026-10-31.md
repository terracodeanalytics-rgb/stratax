# Live import progress, related surveys and ZIP intake

## Result

The release connects real worker/startup/verification/row/chunk/validation/finalization observations to the importer; lower per-file loading bars are removed. Unknown totals remain indeterminate. A one-second UI clock shows elapsed time and observation age; worker writes and inspection polling run at about1.5-second intervals. Timers stop on completion/cancellation and dispatch checks prevent prior-job metadata from replacing current progress.

Files now offers **Add deviation for this well**. Added surveys inherit the selected log's well context, remain editable in Match and require explicit review for conflicting identifiers or an excluded/removed parent. ZIP intake suggests file types and owning wells, with strong identifiers and unique well identities preferred over ambiguous filename/folder evidence. Header creation remains an explicit opt-in when needed.

## ZIP contracts and boundaries

The original ZIP is retained without being represented as a parsed dataset. Selected expanded entries are independent assets with immutable IDs, original archive paths, directory scope and CRC evidence. Classification, inclusion and row/well associations remain reviewable. Duplicate basenames are independent; same-folder duplicate bundles require correction. Existing native/browser readers inspect actual entries and preserve their existing format/domain restrictions.

The pinned BSD-3-Clause `@zip.js/zip.js`2.24.0 native bundle was downloaded from its official npm tarball, verified against its SHA-512 package integrity, syntax-checked and vendored with license/provenance. It runs in a dedicated worker. ZIP/ZIP64, Unicode, supported encryption/compression, nested folders and nested ZIPs use that reader. CRC/authentication, overlap and strict local-directory checks are enabled. Passwords remain ephemeral in browser/worker memory and are not serialized to project/import options.

Traversal/absolute/drive paths, links/special filesystem entries, executable payloads, OS metadata, empty files, oversized/high-ratio entries, integrity failures, unreadable formats and missing passwords generate explicit notes. Partial successes remain reviewable and retry preserves already reviewed entries. Uncertain types block advancing until corrected. Companion discovery is scoped to original archive directories; no extracted files overwrite each other. Scientific native inspection can still pause for changed evidence or missing/ambiguous companions.

Bounds:100 import assets including retained originals; up to99 extracted files for a single ZIP,256 MiB/member,1 GiB cumulative expansion across ZIPs/nesting,10,000 inventory entries,8 MiB metadata, three nested levels, and a two-minute read deadline. Extras remain in the retained archive and are listed for splitting/re-export, not silently activated. Multipart ZIPs, mixed-password nested archives and unsupported compression/schema variants may require separate extraction or conversion. This is bounded ZIP intake; it does not claim every ZIP dialect or scientific format is supported.

## Verification and deployment

Site version6 succeeded: source `27e78ffb60dcc5381050fc9d90de7478a731fcd4`, deployment `appgdep_6ae59f5950d08191b4ae2712177c203b`; the existing public audience is preserved.

Seven changed/new application JavaScript modules and the unchanged vendored bundle passed syntax checks. Three Python modules passed AST checks. Source imports, whitespace, CSS block balance, staged backend identity and frontend hashes were reviewed. Browser/data/ZIP fixtures, scientific validation and performance benchmarks remain unrun under the continuing source-only restriction. Existing user-triggered job status/logs were read without starting an execution; its startup took about63 seconds, explaining the prior idle-looking0%.

- API build `c3598187-fa2c-4520-9b46-c90e5e55e74a`, digest `sha256:4973209ea9470a20cfdde1ca067c5b7053b05f00adddd078c68ae271120614e4`; revision `stratax-api-import-bundles-1031c` Ready at100%. Candidate and production `/api/health` returned status ok; fresh revision ERROR query was empty.
- Import worker build `a18238d9-2473-4050-8076-9893c0173ae7`, digest `sha256:47bcf62fd70eb7433cc4de51e4456893990c07544c1bb2e5f9fbc96773a4daca`; job Ready, image-only update, no agent-started execution. Scientific/seismic jobs unchanged; optional progress callbacks default off.
- Isolated source: previous live `well-import-ui-1031b` release plus `ingestion_core.py`, `ingestion_worker.py` and `imports_api.py`. Unrelated seismic drafts were excluded and release-only Docker data-test execution remains omitted under the user's restriction.
- Rollback: `import-bundles-previous` points to `stratax-api-well-import-ui-1031b`; older protected tags preserved.

## Cleanup and handoff

Inventory:66 registry images,39 scoped API/import/science images all tagged/protected,27 out of scope, zero eligible/deleted; zero local junk removed. Retain `.release/import-bundles-20261031` receipts, source archives, vendor package evidence and Site checkout. Root GitHub commit/push remains deferred; only the separate Site source is published. Deferred scenarios are recorded in `WELL_WORKFLOW_ACCEPTANCE.md`.

Reader references: [zip.js API](https://gildas-lormeau.github.io/zip.js/api/), [ZIP reader options](https://gildas-lormeau.github.io/zip.js/api/interfaces/ZipReaderOptions.html), [PKWARE format specification](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT).
