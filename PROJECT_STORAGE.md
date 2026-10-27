# Project setup and storage

Implemented from the approved four-step setup plan on 27 October 2026.

## Project behavior

Setup uses Project, Location, Storage and Review. A name and Petrophysics, Seismic interpretation, or both are required. WGS84 site coordinates are optional; latitude and longitude must be supplied together. Zero is valid. Workflow selections can change without deleting configurations from deselected tools. Shared navigation, tool search, workflow cards and direct routes use the selected workflows; rock physics/well tie requires both.

The overview displays stored source counts, user registrations/configurations, applicable workflow tracking, the saved site pin and genuine activity. Manual progress is labeled user-reported. Synthetic wells, curves, maps, candidates, reports and results are no longer generated. Scientific processing remains unavailable.

## Destinations and recovery

- Cloud: owner-scoped Firestore documents at `stratax_projects/{verified_uid}/records/{project_id}`; originals under `owners/{verified_uid}/projects/{project_id}/originals/{file_id}` in the existing private `project-9afac-stratax-raw` bucket. Uniform bucket access and public-access prevention remain enabled.
- Local folder: a user-selected directory receives a unique `StrataX-{id}` folder containing `project.stratax.json` and `originals/{file_id}`. Browser folder handles use UID-scoped IndexedDB. Permission may need reconnecting through the save control. A manifest and its originals must remain together.
- Portable file: complete JSON packages include project/workspace data and base64 originals. Imported packages receive independent project IDs. Browser recovery caching is not represented as a disk save; download the package to retain changes. Direct directory writing requires a supporting browser and top-level context; embedded/unsupported contexts offer portable files.
- Local contents are not sent to StrataX Cloud Storage. Google Maps and place search still contact Google. No automatic Cloud/Local synchronization is provided.
- Genuine legacy browser projects become recovery drafts requiring an explicit destination. The original scoped portfolio is preserved once under `stratax.projects.recovery.v2:<uid>`; unscoped keys remain unassigned. Seeded Tomboy content is removed; genuine additions in its context remain in a recovery project.
- Save conflicts retain pending changes. The save control offers a complete pending export or retains a separate UID-scoped conflict copy before loading the current Cloud version. Sign-out clears active identity/UI, not saved files.

## API

All project/file routes require verified Firebase identity and exact current StrataX policy acceptance. Identity never comes from request JSON.

- `GET /api/projects?cursor=...`: pages of up to 50 project summaries, revisions, actual source/well counts and `next_cursor`.
- `GET /api/projects/{id}`: project, workspace and revision.
- `PUT /api/projects/{id}`: `{revision, project, workspace}`. Revision zero creates; matching revisions update transactionally. Stale writes return 409. Stored source metadata is authoritative and cannot be invented through this endpoint.
- `PUT /api/projects/{id}/files/{file_id}`: streamed binary source, `X-File-Name` URL-encoded. Files are stored before metadata is attached transactionally; attachment failure removes the uploaded object.
- `GET /api/projects/{id}/files/{file_id}`: authenticated original download.

Current bounds: 64 MiB per original, 128 MiB total sources per project, 500 source records, 512 KiB project JSON writes and 256 MiB portable imports. Original files are not scientifically parsed. Archive/Trash are reversible record states, not deletion of originals. Duplicate creates an independent portable copy, including originals, ready to download.

## Cloud configuration

The existing Cloud Run service retains scale-to-zero, maximum two instances and request-based billing. Concurrency is eight. `STRATAX_PROJECT_BUCKET` selects the private bucket. Its runtime identity has bucket-scoped `roles/storage.objectUser` and access to `stratax-maps-api-key` in addition to its existing SMTP secret. No service-account key files are used.

G-RES supplies its Maps key at runtime from a shared secret. StrataX instead reuses its existing dedicated browser key, retaining the prior tile API/origin restrictions and adding Maps JavaScript, geocoding and the hosted StrataX origin. G-RES configuration is unchanged. The public runtime configuration contains the restricted browser key; secret values never enter repository files. Maps loads lazily. Document/script referrer policy permits origin-based Google key authorization; authenticated API calls keep `no-referrer`.

Seven policy documents and backend versions are now 1.1, reflecting actual Cloud/Local storage and Google Maps processing. Users acknowledge the current versions before accessing projects.

## Verification tools

- `scripts/verify-projects.cjs`: controlled-provider browser tests, real browser filesystem writes/reopen, complete portable originals, workflow guards, failed saves, permission renewal and responsive layouts.
- `scripts/verify-project-api.py`: live isolated accounts, Cloud revisions/ownership, original-file integrity and fixture cleanup. Set `STRATAX_QA_API` for a candidate URL.
- `scripts/verify-live-projects.cjs`: hidden stdin Sites token; real hosted sign-in, setup, Maps, originals, cross-device restoration and responsive screenshots.
- `scripts/configure-project-storage.py`: narrowly scoped StrataX bucket/Maps-secret setup; key material remains in memory/stdin.

Older project-UI assertions in `verify-ui.cjs` describe the previous single-form setup. Run its account/landing regression subset with `STRATAX_UI_TEST_FILTER`; the new project suite is authoritative for this release.
