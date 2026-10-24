# StrataX frontend foundation

Frontend-only, modular browser application. The uploaded original project is untouched. This is a new implementation, with no production databases, email, storage, or calculation services connected.

## Source
- `dist/index.html`: entry point
- `dist/styles.css`: responsive layout and design tokens
- `dist/app.js`: application shell, routing, workspace views and local interactions
- `dist/workbenches.js`: specialist visual reference layouts and tool rails
- `dist/catalog.js`: agreed workspace and microfeature catalogue
- `contracts.d.ts`: proposed integration contracts

## Scope and implementation truth
The feature inventory in the app contains the full agreed module catalogue. Dedicated interactive screens exist for overview, file metadata review, wells, documents, maps, log display, QC proposal decisions, cutoff controls, summaries, reports, settings and history. Advanced interpretation, modeling and engineering modules currently expose specialist visual references, configuration forms, evidence requirements, result empty states and editable feature specifications. These are foundations, not completed specialist editors. They require further frontend implementation before feature parity can be claimed.

Map backgrounds and well geometry are illustrative SVGs, not live tiles or georeferenced data. Log curves and summary figures are synthetic. The cutoff sensitivity response is an explicit UI demonstration, not a scientific algorithm. File selection stores metadata only. No OCR, semantic search, scientific parsing, calculation, simulation, depth conversion, identity enforcement or server persistence is represented as working.

Local UI drafts persist under `stratax.frontend.v1` in browser storage. Workspace JSON, catalogue JSON, source inventory and example summary CSV can be downloaded. Reports use browser print/PDF. Do not enter sensitive production information into this demonstration.

## Design
Light scientific workspace, teal identity from the supplied logo, compact navigation, contextual controls and progressively disclosed advanced settings. Desktop-first interpretation with responsive navigation and stacked layouts on narrow screens.

## Build / serve
No dependency installation required. Serve `dist` using any static HTTP server. ES modules require HTTP, not file://. Node syntax checks: `node --check dist/app.js` and `node --check dist/catalog.js`.

## Integration rules
Replace synthetic datasets through explicit adapters; preserve evidence roles and versions. Validate units, depth datums, source CRS and method applicability on the server. A local UI review is not scientific approval. Require authorization for every project resource. Save immutable calculation configurations and detect stale downstream results. Full production readiness also requires modularizing state/view controllers, automated UI regression coverage, runtime schemas, accessibility review, real chart and GIS adapters, authentication and an error/loading boundary for each asynchronous resource.

## Public entry and project directory
The root route now opens a landing page. `#signin`, `#signup` and `#forgot-password` provide accessible account-form layouts, browser field validation and explicit frontend-only feedback. Password values are never persisted or sent; social sign-in and account recovery are unconnected. A separate preview entry opens `#projects` without pretending to authenticate.

Projects support creation, metadata editing, search, filters, sorting, favorites, grid/list modes, duplication, archiving, recoverable Trash and restoration. Local project data is stored under `stratax.projects.v2` as independently cloned contexts. Legacy single-project state migrates to the Tomboy demo. New projects start with no demonstration wells, no sample files and no saved interpretation drafts. This is local UI separation, not server tenant isolation or production authorization.

## Portfolio polish and settings
Portfolio progress charts aggregate the six manually recorded workflow-stage states for active projects. Per-card charts and an update-progress editor persist their counts; illustrative demo progress is labeled. The new resume-project panel uses last-opened timestamps. Completed tracking status is not a scientific approval.

The styled profile trigger now contains Feature Inventory, Settings, Help, All Projects and Exit Preview in a dismissible menu. Those utility links no longer occupy the sidebar permanently. Settings now contains profile, project, appearance/accessibility, units/references, log viewer, map, review policies, notifications, exports and portability sections. Appearance and motion, map selection, timezone and log-line/grid preferences have immediate local UI effects. Scientific and backend-dependent settings remain configuration drafts.

Help has searchable expandable topics and keyboard navigation (Alt P/O/M/L/S, ?, Escape and Ctrl/Cmd K). Navigation shortcuts do not activate while typing into editable fields.
