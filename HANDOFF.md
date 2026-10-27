# StrataX handoff

## Completed and live

Guided Data ingestion is published as Sites version 9 at https://stratax-workbench.cometcrab258.chatgpt.site. Source `d73ebab5c5ec3872add9a88fb2b6f6d731cd1483`; deployment `appgdep_6ae0a2de067c8191acb0d4a09b00622e`. Existing owner-only audience unchanged. Version 8 remains the frontend rollback.

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
