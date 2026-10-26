# StrataX web application

Static ES-module frontend published to the existing StrataX Sites project. Landing and account pages use Firebase and the StrataX account API. Scientific and project-server integrations are separate future phases.

## Entry points

- #home: landing hero and TerraCode-style footer.
- #signin, #signup, #forgot-password, #email-action: real account and branded email-link flows.
- #terms, #privacy, #cookies, #acceptable-use, #data-ownership, #ai-processing, #disclaimer: public policies.
- Workspace routes require restored, verified Firebase identity and current StrataX policy acceptance.

## Source

- dist/app.js: workspace shell, routing and local project interactions.
- dist/auth.js: Firebase, API access, session restoration and account operations.
- dist/auth-ui.js: G-RES-style account screens, policy controls and email-link completion.
- dist/public.js: landing hero, navigation and corporate footer.
- dist/projects-view.js: project library, cards and truthful workflow progress summaries.
- dist/legal-pages.js: current StrataX policy documents.
- dist/styles.css and dist/account.css: responsive workspace, public and account styles.
- dist/workspace.css: project library and shared navigation/header design.
- dist/catalog.js and dist/workbenches.js: inventory and specialist reference layouts.
- contracts.d.ts: proposed scientific integration contracts, not available calculations.
- .openai/hosting.json: existing Sites identity; preserve its project ID and audience.

## Identity and storage

StrataX uses the shared TerraCode Firebase user pool in project-9afac with its own Firebase web app. Password changes affect the shared identity. Account profiles and policy records are specific to StrataX and stored in Firestore by verified UID.

Scientific workspace drafts remain browser-local using stratax.frontend.v1:<uid> and stratax.projects.v2:<uid>. Legacy unscoped keys are preserved without being assigned to a new user. This is not cross-device synchronization or encryption of local drafts. Sign-out hides the active workspace without deleting saved drafts.

## Scientific implementation truth

The catalogue contains 38 workspaces and 248 feature groups. Advanced modules currently provide visual references, configuration drafts and result empty states. Maps use illustrative geometry; curves and summary numbers are synthetic; file selection records metadata only. OCR, scientific parsing, calculation, modeling, simulation, depth conversion, live GIS and server project persistence are not connected. Retain synthetic/unavailable labels until each capability is implemented and validated.

## Verification

No frontend build is required. Serve dist over HTTP; ES modules do not run through file URLs. Check changed JavaScript syntax with node --check.

From the repository root, node scripts/verify-ui.cjs exercises browser flows with controlled provider responses. Configure PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE for another runtime. Evidence is saved under ignored .release/. This suite does not substitute for live Firebase or SMTP verification.

Root status/context/handoff documents record deployment and verification. Never put SMTP credentials, Firebase ID tokens, email action codes or Sites access tokens in source files.
