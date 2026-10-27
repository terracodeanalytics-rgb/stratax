# StrataX handoff

## Completed and live

Map well visibility, SVG defaults and context actions are published as Sites version 12 at https://stratax-workbench.cometcrab258.chatgpt.site. Source `f3c07629f3b847c9c8286da40d7adf7b0537386d`; deployment `appgdep_6ae116b51fe4819187d7b9359dc40fa0`. Owner-only audience unchanged; version 11 retained for rollback.

API `stratax-api-00009-yeb` serves 100% in project-9afac/us-central1. Build `72eb2f31-fa5c-4ac9-b7ab-ee002b96805d`, digest `sha256:b2b3a6944c4b668b72c83f9dd00fe9e378c419d1206ec45ffd51033532dd8cc4`. Parser job `stratax-import-worker` uses build `21bbcecd-6842-43b8-86d1-39c649741e7e` / digest `sha256:758865c702747ef3e3c210244e25d07c448fcee0f4c603c6b2334da3c95e745b`. Prior API project/auth revisions and tagged images retained.

Read `DATA_INGESTION.md` for the format/version matrix, API/storage schema, parser and portable limits, conversion paths and provenance. `PROJECT_STORAGE.md` covers setup and destination behavior. Data contains real sources/wells/datasets/history; no fabricated scientific output. A 10 GiB upload does not imply every binary frame can be materialized: reader-specific bounds remain explicit.

## Verification

- `.venv/Scripts/python.exe -m pytest backend/tests -q`: 35 passed. Final control-plane status addition: affected API suite 6 passed. Windows sandbox blocks some temporary/TestClient paths; use the approved escalated test command.
- Worker Docker build gate `native_selftest.py`: 26 passed, including native DLIS/LIS, SEG-Y/SU/ZGY/SGZ, grids, GIS, RESQML/HDF5, ECLIPSE and safe XML/archive handling.
- `node scripts/verify-ingestion-ui.cjs`: 9 passed, zero page errors; includes true browser filesystem original/chunk/manifest writes and four viewport widths. Local content generated no Cloud content requests.
- `scripts/verify-ingestion-api.py`: 34 live candidate checks passed. Real resumed GCS upload, native 160,000-row parse/32 chunks, private preview, channel selection/commit, templates/reload, owner isolation and quota checks. No full 10 GiB transfer or 50 GiB storage stress run.
- `scripts/verify-live-ingestion.cjs`: 9 published checks passed, zero page errors. First harness attempt clicked before source preflight finished; corrected the asynchronous wait. Actual hosted native previews, download bytes, reload and responsive layouts verified.
- Six Downloads LAS files remained read-only local fixtures; datum unresolved. No QA email sent and no existing user password changed. Isolated accounts, Firestore records and source/derived test objects removed.

## Operational details and cleanup

PowerShell gcloud comma-separated environment values must be quoted; the first candidate bucket setting was misparsed, corrected before release. One Cloud Run image import hit a platform DEADLINE_EXCEEDED before worker code ran. API stores operation/execution references and surfaces failed executions for explicit retry. Worker has no automatic retries; per-project/global leases and artifact reservations bound processing.

All ten scoped registry images have tags and are protected; zero image deletions. Interrupted test leftovers were removed with strict generated-email/date/project checks (two accounts and one object generation). Three stalled sandbox pytest processes and one stalled source helper stopped. Keep ignored `.release` evidence, `.sites-source`, recovery copies, assets and operational tools. The cleanup script is dated/scoped intentionally; never broaden its match to real accounts.

Root remote is https://github.com/terracodeanalytics-rgb/stratax. Only reviewed repository files belong in the final commit; never stage `.release`, `.sites-source`, private tokens or local data. Sites source is a separate repository; never replace the root remote. Native Sites credentials are short-lived and must remain hidden stdin/session memory.

## Follow-up boundaries

No paid vendor SDK, full Petrel/Techlog project migration, live WITSML/ETP, OCR, interpretation algorithms or simulation execution. VDS/closed variants offer retention and conversion instructions. Expanded malformed-binary fixtures for every advertised vendor dialect and full capacity stress tests remain further validation work. Parsed Cloud-to-portable conversion and automatic Cloud/Local synchronization are explicitly unavailable. Unconfirmed source CRS/datums do not enter confirmed map geometry.

## Filter hotfix

`#documents` forced `typeFilter=documents` and tab=sources on every render, so changing the dropdown or opening Datasets appeared broken. `#wells` had the same tab issue. Defaults now apply on route/project changes, and filtered zero results have an explicit Clear filters action. The importer also disables Continue during preflight. Local suite: 10 passed; focused hosted filter verification recorded in STATUS. No user data or backend/image changes.

Hosted hotfix verification limit: the initial harness reached an unfinished setup-save modal; the directly created replacement Cloud fixture then did not appear in the Projects UI. Both isolated identities/projects/objects were removed. No page errors occurred. This was not broadened into an unrelated project-sync change; local document-route regression passes. `verify-live-data-filters.cjs --assets-only` separately compares production bytes with tested source.

Production asset comparison passed: `data-page.js` exactly matches tested source, SHA-256 `94654f6020a94b26805bd3a2988ee685242eab82e00887f26bb1431729f213df`. Backend, worker and user datasets were unchanged.

## Map release

Map now has a compact ribbon, contents/well list, EPSG:3857 field grid, Google basemap adapter, collapsible inspector, reviewed well locations, styling and SVG export. Add deviation opens the guided importer attached to the selected well. Orange lines are complete supplied WGS84 coordinate stations; angles-only surveys remain evidence without invented trajectories. Location review requires explicit datum confirmation. Local data never uploads for map parsing. Map read limits: 32 MiB Cloud source, 50,000 coordinate stations; projected-CRS conversion/angle-based trajectory algorithms remain unavailable.

Focused map browser suite: 8 passed; ingestion regression: 10 passed; zero page errors. Includes persistence, zero coordinates, source association, coordinate/angles distinction, Google adapter/zoom, export and four viewport widths. External font fetching caused one harness reload timeout; isolating that network dependency produced the full passing run. No Cloud fixture accounts, uploads, new API/worker builds or image deletions. Original/recovery assets preserved; browser suites close their owned resources.

Production map JS/CSS asset comparison passed for all five modules; HTML asset references validated. New map module SHA-256: `bc8e58bc2dc413b1f34d6b216dcd372345e5d4a645e417fd216cf6d6d1c61ea1`. Site owner-only access remains unchanged. No backend resources or images changed.

## Latest well actions

The previous blank view was truthful but unhelpful: all six wells lacked confirmed coordinate references, so only the project site plotted. Unplaced wells now remain visible as explicitly non-geographic SVG items. Bulk Review locations reads source LAS headers, allows corrections and requires explicit WGS84 confirmation before plotting. Do not silently mark the six Downloads headers as WGS84.

Right-click/ellipsis actions work on well rows and markers: rename display label (source IDs stay intact), duplicate independent registration with provenance/location/style, zoom to well, delete from map and restore. No raw file or dataset deletion/copy occurs. Default icons come from shared `well-symbol.js`; Google and field-grid adapters use the same SVG. Map suite: 10 passed, zero errors; source/dataset counts preserved through management actions. No Cloud fixture accounts/uploads, new backend images or deletions; browser resources closed and original/recovery assets retained.

Published well-action assets verified against local tested source: six JS/CSS modules match exactly; HTML references validated. Map module SHA-256 `b0336a2359d224124f86103219c292f8e5535a992f84454a0e3402828628437b`. No source data mutations were performed during this session.
