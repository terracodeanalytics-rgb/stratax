# StrataX handoff

## Completed and live

Project setup, Cloud/Local storage, compact switcher, real-data overview and removal of fabricated scientific displays are published as Sites version 8. Source `7f3c1b2b2162a1ba1815f346ce312055473b26e4`; deployment `appgdep_6ae052b94e648191a702c1f72dc27347`. Existing owner-only Site audience unchanged.

API `stratax-api-00005-xav` serves 100% in project-9afac/us-central1. Build `dc2b1a2a-42f8-407d-b4c8-42a47d746ba4`; digest `sha256:65a3b738755635a20b784c94689f85a9a0b9c3ad07f8aa3f70bb44797ae17187`. Prior auth revision/images and previous Sites versions are retained.

Read `PROJECT_STORAGE.md` for implemented behavior, schema, routes, file-size limits, folder/portable compatibility, legacy migration and conflict recovery. Scientific parsing, OCR, interpretation engines and results remain unavailable. No fabricated data is generated in their place.

## Verification

- Backend: `python -m pytest backend/tests -q`: 12 passed; one upstream TestClient deprecation warning.
- Controlled projects: `node scripts/verify-projects.cjs`: 16 passed, zero page errors. Includes real browser filesystem write/reopen through a controlled chooser, portable export/import original-byte round trips, workflow selections/guards, saved configurations, permission renewal, failed-save retry and responsive layouts.
- Account/landing subset of `verify-ui.cjs`: 11 passed, zero page errors. Use STRATAX_UI_TEST_FILTER; previous single-form project tests have been superseded.
- Candidate `verify-project-api.py`: 20 passed; two isolated identities plus project/source records removed. Real upload/download integrity, owner isolation, stale revisions, archive retention and validation verified.
- Published `verify-live-projects.cjs`: 11 passed, zero page/Maps errors. Real Firebase sign-in/policies, actual Google Maps, original download bytes, refresh, cross-device project/files and four viewport widths verified. Isolated account/records/original objects removed.
- First second-session browser attempt omitted policy checkbox selection in the harness; corrected and rerun successfully. Existing account credentials were never used or reset. No email sent.
- Fresh StrataX API ERROR logs were empty after verification.

## Cleanup and repository

One-use source normalizer removed; two verified sandbox-stalled pytest processes stopped. Browser suites close their owned browsers/servers. Retained original assets, user recovery copies, ignored evidence, Sites checkout and operational tools. Four registry-tagged StrataX images retained; zero image deletions. Shared/G-RES services and data untouched.

Root Git destination remains https://github.com/terracodeanalytics-rgb/stratax. Finish with only reviewed scoped files staged; never stage .release, .sites-source, credentials or private runtime data.

## Next

Continue page-by-page with real scientific import/parsing before enabling calculations or derived geometry. User decisions are still needed for those scientific workflows. Cloud/Local automatic synchronization and collaboration are not implemented. Portable duplicates are independent complete copies and must be downloaded; local folder permissions may require reconnecting after a browser restart.
