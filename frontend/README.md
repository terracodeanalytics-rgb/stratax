# StrataX web application

Static ES-module frontend published to the existing StrataX Sites project. Landing and account pages use Firebase and the StrataX account API. Cloud/Local projects and original storage are implemented. Scientific processing remains a future phase. See `../PROJECT_STORAGE.md`.

## Entry points

- #home: landing hero and TerraCode-style footer.
- #signin, #signup, #forgot-password, #email-action: real account and branded email-link flows.
- #terms, #privacy, #cookies, #acceptable-use, #data-ownership, #ai-processing, #disclaimer: public policies.
- Workspace routes require restored, verified Firebase identity and current StrataX policy acceptance.

## Source

- dist/app.js: workspace shell, workflow guards, routing and project interactions.
- dist/auth.js: Firebase, API access, session restoration and account operations.
- dist/auth-ui.js: G-RES-style account screens, policy controls and email-link completion.
- dist/public.js: landing hero, navigation and corporate footer.
- dist/projects-view.js: project library, cards and truthful workflow progress summaries.
- dist/legal-pages.js: current StrataX policy documents.
- dist/styles.css and dist/account.css: responsive workspace, public and account styles.
- dist/workspace.css: project library and shared navigation/header design.
- dist/project-setup.js: four-step creation/settings wizard.
- dist/project-repository.js: Cloud, local-folder and portable-package persistence.
- dist/project-overview.js, dist/project-map.js and dist/project.css: real project overview, compact switcher, lazy Google Maps and styling.
- dist/catalog.js and dist/workbenches.js: inventory and specialist reference layouts.
- contracts.d.ts: proposed scientific integration contracts, not available calculations.
- .openai/hosting.json: existing Sites identity; preserve its project ID and audience.

## Identity and storage

StrataX uses the shared TerraCode Firebase user pool in project-9afac with its own Firebase web app. Password changes affect the shared identity. Account profiles and policy records are specific to StrataX and stored in Firestore by verified UID.

Projects choose Cloud or Local storage. Cloud uses owner-scoped Firestore and private original-file storage through the authenticated API. Local folders retain manifests/originals; unsupported or embedded browsers use downloadable complete packages. UID-scoped browser recovery caches are not presented as destination saves. Legacy unscoped keys remain unassigned. Sign-out hides active user data without deleting saved files.

## Scientific implementation truth

The catalogue describes 38 workspaces and 248 feature groups. Synthetic visualizations, fabricated summaries and demonstration records have been removed. Real originals and configuration drafts can be saved; scientific parsing, OCR, calculations, modeling, simulation and depth conversion are unavailable. Google Maps displays the saved site coordinates only.

## Verification

No frontend build is required. Serve dist over HTTP; ES modules do not run through file URLs. Check changed JavaScript syntax with node --check.

From the repository root, node scripts/verify-projects.cjs exercises current project flows. The account subset of node scripts/verify-ui.cjs exercises account flows with controlled provider responses. Configure PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE for another runtime. Evidence is saved under ignored .release/. This suite does not substitute for live Firebase or SMTP verification.

Root status/context/handoff documents record deployment and verification. Never put SMTP credentials, Firebase ID tokens, email action codes or Sites access tokens in source files.
