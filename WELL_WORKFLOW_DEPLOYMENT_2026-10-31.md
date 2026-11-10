# Well workflow live deployment - 2026-10-31

User authorized: deploy live. Existing data/browser/benchmark restrictions remain in force.

## Live state

- Frontend: https://stratax-seismic-workbench.neonwhale8.chatgpt.site, public audience preserved.
- Site project `appgprj_6ae37700e488819196b149dee2c6053f`, version **3**, saved version `appgprj_6ae37700e488819196b149dee2c6053f~appgver_75bb8528ad848191a3c13efda739164e`.
- Successful Site deployment `appgdep_6ae57207eb6481919148f3065553ca6b`; exact source `3ba2fd4cd0a3d7a4326b7f28e88519ec74b0525a` in the separate Site source repository.
- API `stratax-api-well-workflow-1031a` is Ready at **100% traffic**, project `project-9afac`, region `us-central1`.
- Import and science workers updated to matching immutable images and Ready. Their resource limits, accounts and retries were preserved. No worker job was executed.
- Rollback API28 remains tagged `well-workflow-previous`; previous Site version 2 remains available.

## Build provenance

All three builds succeeded:

| Component | Build | Immutable image digest |
| --- | --- | --- |
| API | `c175e4e5-2d91-4a79-a9b4-1d40086e4016` | `sha256:61ae4d8f7ed4a955bf55f1d4d189e4b88487d10654c6bf7bfc3f4f7b5aa3c3ee` |
| Import worker | `3562c8a1-8c4b-4b2b-afa4-a62b5272ce59` | `sha256:dc1ec3901547173f11943066da821932b023d30fca3bb5c72296d7ef459bd152` |
| Science worker | `5432f214-0663-4a6b-a939-76acd7a0076e` | `sha256:a095c8fd27d92442ae06a42ddf47eb3a9c4542a1225fea0f67e6cb11124dbf7d` |

Registry prefix: `us-central1-docker.pkg.dev/project-9afac/stratax`.

Backend source was isolated from the exact live API28 build `7c203d4a-6f93-40b8-90ba-c9b7d7ed4636`, with seven explicit well-workflow overlays. Every other baseline file was hash-checked unchanged; unrelated dirty seismic drafts were excluded. The frontend copied only the 17 reviewed well/workbench assets into the existing Site checkout.

Receipts, original source archive, release source, deployed Site archive and registry inventory are retained under ignored `.release/well-workflow-20261031/`. Preserve these as deployment/recovery material. No credentials were written to project files.

## Verification and limits

- Release source Python AST checks passed; 15 staged JavaScript syntax checks passed. Whitespace/source checks passed.
- Candidate Ready at zero traffic; `/api/health` returned `{"status":"ok","service":"stratax-api"}`. Startup logs confirmed the candidate request returned HTTP200.
- After promotion, live `/api/health` returned OK; service metadata confirmed the exact revision at100%; fresh revision ERROR query returned an empty list.
- `/healthz` returned a Google edge404 on both existing and candidate routes. The documented `/api/health` alias was used successfully instead.
- Native Sites publication returned `succeeded` with the production URL. Direct unauthenticated Python asset fetching returned403, so no independent asset-hash/browser/content acceptance is claimed. Site access settings were not changed.
- No tests, data imports, scientific calculations, user sign-ins, browser QA or speed benchmarks ran. Release-only Docker packaging omitted the existing native/science data-test RUN steps to honor the continuing user restriction. This does not qualify numerical behavior or data flows. [Deferred acceptance scenarios](WELL_WORKFLOW_ACCEPTANCE.md) remain open.

## Cleanup and publication

Required scoped cleanup review found61 STRATAX registry images, all tagged/protected; zero eligible image deletions. All were retained, including rollback/live/worker images. No disposable local session junk; zero local deletions. Keep original assets, source/data, operational tools and recovery archives.

The root GitHub worktree remains uncommitted/unpushed, including the user's unrelated seismic drafts. Only the separate Site source publication required for deployment was committed/pushed. The seismic/models/acoustic worker images, engine availability restrictions and application account settings were preserved.
