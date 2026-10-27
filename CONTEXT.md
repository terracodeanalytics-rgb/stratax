# StrataX context

## Current development candidate — 2026-10-27

The interpretation/science implementation is a verified development candidate, not a completed production release. Production remains Site version 12 and API stratax-api-00009-yeb. Candidate API stratax-api-00011-vij serves zero normal traffic at the science-candidate tag; new stratax-science-worker executes bounded explicit candidate runs. Project/region: project-9afac/us-central1.

Scientific contracts and explicit boundaries: SCIENTIFIC_WORKSPACE.md; registry scientific_catalog.py; numerical operators scientific_core.py; API scientific_api.py; worker scientific_worker.py; UI interpretation-workspace.js / interpretation.css. Input source versions/units are explicit, arrays live outside Firestore, and local content requires consented independent Cloud copying before remote calculation.

User chose one complete release. Do not publish the prepared Sites source `8b72167f49352ab1a42565a99531f904b24f11f6` or promote the API until remaining planned functionality and integrated acceptance are complete. Successful candidate checks do not certify every catalog feature. Current proof: 74 local science/API checks, 71 image checks, 34 real candidate checks, six read-only user LAS comparisons, 10 canvas browser checks and 10 map regressions.

## Repository and live state

- Git root: STRATAX; remote `https://github.com/terracodeanalytics-rgb/stratax`. Canonical frontend: `frontend/dist`; API: `backend`. No frontend build/framework is required.
- Site: https://stratax-workbench.cometcrab258.chatgpt.site/#home. Preserve project ID `appgprj_6adc66e963588191a4154ab09c724471` and its owner-only audience.
- Current frontend: Sites version 12, source `f3c07629f3b847c9c8286da40d7adf7b0537386d`, deployment `appgdep_6ae116b51fe4819187d7b9359dc40fa0`. Version 11 remains the prior saved frontend.
- API: https://stratax-api-227436363119.us-central1.run.app. `stratax-api-00009-yeb` at 100% in `project-9afac/us-central1`; candidate alias https://candidate---stratax-api-fwy32oha6q-uc.a.run.app.
- Backend build `72eb2f31-fa5c-4ac9-b7ab-ee002b96805d`; digest `sha256:b2b3a6944c4b668b72c83f9dd00fe9e378c419d1206ec45ffd51033532dd8cc4`. Prior project revision `stratax-api-00005-xav` remains available for rollback.
- Cloud Run: zero minimum/two maximum instances, request-based CPU, 512 MiB, concurrency eight and existing 60-second timeout.
- Sites source is the separate ignored `.sites-source` repository. Never change the root Git remote to the Sites remote. Use hidden stdin credentials and exact pushed source/archive provenance.

## Identity and project ownership

- Shared TerraCode Firebase pool in `project-9afac`; dedicated StrataX web app `1:227436363119:web:a01865da7615f56878fc9a`. Shared password changes affect other TerraCode apps. Shared email templates/providers and G-RES endpoints are unchanged.
- Runtime identity: `stratax-auth-runtime@project-9afac.iam.gserviceaccount.com`. Existing auth-link role/datastore.user plus secret access to `gres-smtp-password` and `stratax-maps-api-key`; objectUser only on the existing StrataX raw bucket. Do not expand to other apps/resources.
- Account/profile/legal/rate-limit collections remain StrataX-specific. Projects use `stratax_projects/{verified_uid}/records/{id}`. All resource ownership comes from server-verified Firebase identity and exact current-policy acceptance.
- Seven policies are version 1.1; frontend policy copy and backend versions must evolve together. Existing users acknowledge changes before workspace access.
- Account emails remain customized SMTP HTML/plain text with fixed StrataX continuations. Do not log passwords, tokens, action codes, generated links or SMTP credentials.

## Project behavior and persistence

- Approved plan/contracts/limits: `PROJECT_STORAGE.md`. Setup has Project, Location, Storage and Review; select Petrophysics, Seismic or both. WGS84 site coordinates are optional. Workflows can change without deleting hidden work; well tie requires both.
- `project-repository.js` provides Cloud, local-folder and portable-package persistence. `project-setup.js`, `project-overview.js`, `project-map.js` and `project.css` implement the new surfaces. `app.js` coordinates existing project actions and recovery/save states.
- Cloud originals use private `project-9afac-stratax-raw` under owner/project prefixes. Firestore updates use revision checks; originals can only enter metadata through authenticated uploads. Guided import limits: 10 GiB/file, 50 GiB/project including originals/reservations/derived artifacts; 512 KiB project JSON. Legacy raw transfer endpoint retains its smaller compatibility limits. No public bucket access or new database was created.
- Local folders contain `project.stratax.json` and `originals/{id}`. Browser handles and recovery drafts use UID-scoped IndexedDB; permission may need renewal. Direct directory writing requires a supporting browser/top-level context. Portable JSON packages include originals and require explicit download to retain changes. Local project contents do not upload to StrataX cloud storage; Maps/search still contact Google.
- Existing scoped browser data is retained as a recovery copy. Genuine projects require a chosen destination; seeded Tomboy content is removed without deleting genuine additions. Unscoped legacy keys remain unassigned. Sign-out hides active data without deleting saved files.
- The compact switcher lists Active/Archived projects, excludes Trash and ends with All projects. Public/shared headers reuse the landing initials account menu. Search, navigation and direct routes enforce selected workflows.
- Overview counts/activity are real. Manual stage tracking is labeled user-reported. Scientific fake plots/results/maps/candidates are removed; exchange readers and bounded previews are available; OCR, interpretation calculations, simulation and derived GIS remain unavailable.

## Maps and operational details

- G-RES gets its Maps key from a runtime secret; StrataX reuses its existing dedicated browser key instead. Preserved its prior origins/tile API, adding Maps JavaScript/geocoding and the hosted Sites origin. The restricted browser key is returned by runtime config; raw key values are not in source.
- Maps loads lazily; setup supports manual coordinates, place search and picking. Overview/full Map display the saved site pin. Failed Maps never blocks manual setup. Origin referrers are allowed for Maps; authenticated API calls retain no-referrer.
- Google intercepts `/healthz`; use `/api/health` externally. First Cloud Run deployment cannot use no-traffic; existing services can.
- Windows sandbox loopback can stall TestClient; use the approved escalated test path. Two stalled pytest processes from this session were stopped.
- Keep all tagged/live/rollback/worker images plus newest three. Ten tagged StrataX API/worker images were retained; zero deleted. No unrelated cloud resource was cleaned.
- Evidence is ignored under `.release`. Scripts `verify-projects.cjs`, `verify-project-api.py` and `verify-live-projects.cjs` cover this release. Older single-form project assertions in `verify-ui.cjs` are historical; use its account/landing filter for adjacent regressions.
- Real email delivery was previously authorized only once to contact@terracodeanalytics.com; do not resend without new authorization. No email was sent during this phase.

## Guided ingestion runtime

- Contracts/version matrix: `DATA_INGESTION.md`. Data uses Sources/Wells/Datasets/Import history; six-step guided intake, explicit transfer and activation confirmations, channel selection, templates and immutable version lineage. Source coordinates/datums are never silently activated.
- API `imports_api.py` manages owner/policy-checked resumable uploads, quota reservations, jobs, revision-gated confirmation and private previews. `ingestion_core.py`/`ingestion_native.py` are worker-only readers. API remains lightweight.
- Worker job: `stratax-import-worker`, us-central1, 2 CPU/4 GiB/1800s, no automatic retry; per-project lease and global two-parser capacity. Worker image build `21bbcecd-6842-43b8-86d1-39c649741e7e`, digest `sha256:758865c702747ef3e3c210244e25d07c448fcee0f4c603c6b2334da3c95e745b`. Native image gate: 26 checks.
- Worker identity `stratax-import-worker@project-9afac.iam.gserviceaccount.com`: datastore.user, raw objectViewer, derived objectUser. API identity has derived objectViewer and job-scoped execution/view permissions; self `strataxBlobSigner` permits signBlob for five-minute downloads. Other application grants remain unchanged.
- Private derived artifacts use existing `project-9afac-stratax-derived`. Large arrays use compressed NDJSON chunks/manifests, not Firestore. `STRATAX_DERIVED_BUCKET` and `STRATAX_IMPORT_JOB` configure the API. Raw-bucket resumable CORS includes only the existing StrataX origin.
- Browser `ingestion-worker.js` uses streamed reads and vendored SHA-256/SheetJS; Local native-only formats receive conversion guidance, never server upload. Folder chunks live in `datasets/{importId}`; portable packages preserve supported chunks/originals within explicit budgets. Parsed Cloud-to-portable conversion is unavailable and blocked explicitly.
- PowerShell comma-separated gcloud environment values MUST be quoted or passed as one structured subprocess argument. An unquoted value caused the candidate preview 503 and was corrected before publication. Cloud Run image-pull DEADLINE_EXCEEDED can occur before worker code starts; API tracks execution failure so imports can retry without re-upload.
- Six Downloads LAS files are local read-only acceptance fixtures. Never upload them or activate unspecified source datums as WGS84 automatically. No email was sent during ingestion QA.

- Data route defaults apply only when its route/project changes. Never assign document filters or wells tabs unconditionally inside `dataPageView`: that overrides user controls on every render. Filtered empty states offer Clear filters. Preflight disables Continue until parsing finishes; tests should wait on the control state, not progress copy.

## Map workspace

- `map-workspace.js`/`.css` implement ribbon, contents, field grid, collapsible inspector and real deviation paths; `project-map.js` remains the shared Maps loader with a multi-layer adapter. Runtime API/key/account/audience unchanged.
- Reviewed locations and per-well symbols persist in workspace `mapWorkspace.locations` / `symbols`. Confirmation explicitly requires WGS84. Imported source coordinates/datums are never overwritten. Grid is Web Mercator EPSG:3857 (E/N labels in km, grid-distance scale); mapped latitude range is ±85 degrees.
- Orange trajectories require assigned wells, supplied X/Y longitude/latitude mappings, explicit coordinate order and WGS84, complete readable stations and no blocking validation. Local chunks remain local; Cloud originals are read on the authenticated browser, bounded at 32 MiB and 50,000 stations. Angles-only data can be added but is not converted to a trajectory. Projected source-coordinate conversion is not implemented in this map adapter.
- The importer accepts optional `{family,well}` entry context, retaining identity through file preflight. It still requires its existing review/confirmation and storage rules. Map refresh detects new dataset identities. Map transient state and async results are scoped to user/project to prevent stale cross-account geometry.
- `verify-map-workspace.cjs`: 8 passed; existing ingestion suite: 10 passed. Google adapter tested using controlled SDK objects; live Google imagery loading was not repeated in this frontend-only phase. Production asset bytes are checked with `verify-live-data-filters.cjs --assets-only --map-assets`, without account creation or content upload.

- Well visibility/actions update: unlocated records appear in a labelled non-geographic tray. Bulk location review uses saved headers; it never assumes their datum. `well-symbol.js` supplies one SVG for all default well representations.
- Map aliases use `mapWorkspace.names`; canonical well IDs remain immutable. Duplicate creates a new `wellDrafts` registration (`sourceWellId` provenance) with independent copied map location/style, not cloned source datasets. Delete filters map objects through `mapWorkspace.removedWells`; View → Removed wells restores them. Source files/datasets are preserved. Context menus support right-click, Shift+F10/ContextMenu key, ellipsis, Escape and arrow navigation.
- Map browser suite now has 10 passing checks, including bulk header values, unconfirmed-CRS default, explicit confirmation, rename/duplicate/remove/restore and reload. No backend or Google credential changes.
