# StrataX backend architecture and implementation plan

Date: 2026-10-26
Status: Landing/authentication and Cloud/Local project setup, storage and overview are implemented and deployed. Scientific processing remains planned. See PROJECT_STORAGE.md.

## Working agreement

- Discuss and implement the backend page by page, starting with the existing landing page.
- Design shared services across the whole product rather than creating a service per page.
- Use the existing hosted site as the review target. The user explicitly authorized frontend publication and the landing/authentication backend on 2026-10-26, superseding the earlier deployment hold for that phase. The user also authorized Cloud/Local project storage and publication on 2026-10-27. Local checks remain part of QA; later backend phases remain separate.
- Use Google Cloud services under the active account. Prioritize low idle cost, bounded processing costs, and reuse of calculated results.
- Preserve the current frontend design as the starting point. Replace demonstration behavior with real functionality as each page is completed.

## Verified starting state

This section records the initial inspection before implementation. Current release details are in `STATUS.md`, `CONTEXT.md` and `HANDOFF.md`.

The following was inspected read-only on 2026-10-26. Recheck account, project, resource locations, and pricing before provisioning.

- Local repository: `STRATAX`; Git remote: `https://github.com/terracodeanalytics-rgb/stratax`.
- Current code is a frontend-only foundation in `frontend/dist/`, with 38 workspaces and 248 feature groups.
- Authentication, scientific parsing/calculations, server persistence, and live GIS adapters are not connected.
- Existing frontend: https://stratax-workbench.cometcrab258.chatgpt.site/#home
- Sites project ID: `appgprj_6adc66e963588191a4154ab09c724471`; inspected published version: 3.
- Local files have not yet been compared with the published Sites source. Do this before editing or synchronizing the hosted project.
- Active Google Cloud CLI account: `sharonafolabi3@gmail.com`.
- Active Google Cloud project: `project-9afac`.
- Most existing Cloud Run services are in `us-central1`. No StrataX Cloud Run service appeared in the inspected list.
- Existing Firestore Native databases: `(default)` and `business-manager`, both in `us-central1`.
- APIs for Cloud Run, Firestore, Cloud Storage, identity, Cloud Tasks, Secret Manager, Cloud Build, Artifact Registry, logging, and monitoring are enabled. API availability does not establish that StrataX resources or configurations exist.
- The project serves other applications. Do not modify their services, data, authentication configuration, or images.

## Proposed service architecture

| Responsibility | Proposed service | Cost and implementation approach |
| --- | --- | --- |
| Frontend | Existing Sites hosting | Retain the current frontend initially; review changes through a local preview until publication is authorized. |
| Backend API | Cloud Run with Python/FastAPI | One modular API; request-based billing; minimum instances zero; bounded maximum instances. |
| Authentication | Identity Platform / Firebase Authentication | Email/password and Google sign-in, email verification, password recovery; verify tokens and project membership on the backend. |
| Application records | Firestore | Projects, memberships, well metadata, source references, configurations, reviews, result references, and job status. Use paginated queries and controlled polling. |
| Files and scientific datasets | Cloud Storage | Private storage for originals, parsed datasets, models, figures, and reports. Use short-lived authorized direct transfers and compressed/chunked datasets where appropriate. |
| Scientific and long-running work | Cloud Run Jobs | On-demand parsing, calculations, modeling, and report generation; select resources per workload and enforce timeouts. |
| Queuing and controlled retries | Cloud Tasks | Queue small job references rather than file contents. Use bounded retries and concurrency. Finalize dispatch to Cloud Run Jobs and duplicate-execution handling before implementation. |
| Secrets and service access | Secret Manager and IAM | Separate scoped service identities; no service-account keys or backend secrets in browser code. |
| Builds and images | Cloud Build and Artifact Registry | Build for releases and retain protected images under repository cleanup rules. |
| Operations and costs | Cloud Logging, Monitoring, and Billing budgets | Useful structured logs, controlled retention, alerts, and application usage limits. |

`us-central1` is the initial region candidate because existing resources are located there. Confirm user geography, data residency, latency, service availability, and regional pricing before choosing it permanently.

## Data and processing rules

- Store metadata and references in Firestore. Store large curve arrays, seismic data, rasters, and generated artifacts in Cloud Storage; do not create a Firestore document for every sample.
- Preserve immutable original sources, checksums, input versions, configurations, method versions, units, depth references, and result lineage.
- Every resource belongs to a project. Enforce authenticated access and project roles on all API and file-transfer operations.
- Use explicit job states, idempotent submissions, bounded retries, cancellation where supported, and clear user-facing failures.
- Fingerprint inputs and configurations so valid matching results can be reused. Mark downstream results stale when upstream evidence or accepted configurations change.
- Keep heavy work outside interactive API requests. Queue or launch it explicitly and expose progress/status through the API.
- Return only the chart windows, levels of detail, and dataset subsets needed by the frontend rather than repeatedly transferring entire datasets.
- Scientific outputs must come from validated implementations. Keep synthetic examples clearly labeled until replaced with real results.

## Optional capabilities

Introduce these only when the relevant page has an agreed need and cost estimate:

- OCR for scanned documents; ordinary text extraction first for documents with usable embedded text.
- Semantic search and AI assistance, with explicit usage controls and no automatic full-library reprocessing.
- Paid map/tile providers after reviewing licensing, geographic coverage, and usage costs.
- Specialized compute for workloads that exceed Cloud Run Jobs' supported resource or runtime limits.
- A relational database, dedicated search service, cache, or additional infrastructure only when measured requirements justify it.

## Isolation decisions before provisioning

- Decide whether StrataX should use a dedicated Google Cloud project under the active account or isolated resources within `project-9afac`.
- If sharing the current project, review existing authentication and database usage before choosing a database, collection structure, service identities, and bucket boundaries.
- Do not assume an existing database is unused or that its free allowance is available to StrataX.
- Confirm authorized frontend origins, identity-provider redirect domains, API CORS, and upload/download CORS for Sites and local development.
- Use local application services, emulators where supported, and test fixtures during development; do not silently fall back to production data or resources.

## Cost strategy and assumptions

Initial planning target: **USD 10-30 per month for a small pilot**, assuming modest storage, light processing, and limited downloads. This is an unvalidated planning target, not a quote, spending cap, or guarantee. Sites hosting costs, domain costs, taxes, and paid third-party services have not been assessed.

Cost controls to design into the implementation:

1. Scale interactive compute to zero when idle. Accept occasional cold starts initially.
2. Bound API instances, job parallelism, task retries, CPU, memory, and execution time.
3. Set per-user/project upload sizes, storage allowances, and processing quotas.
4. Avoid duplicate jobs and reuse valid versioned results.
5. Keep compute and data in the chosen region where practical.
6. Limit polling, paginate metadata, and avoid unneeded real-time listeners.
7. Define lifecycle rules for temporary results and obsolete derived artifacts without deleting original evidence or required recovery data.
8. Control logs, container image accumulation, and build frequency.
9. Estimate internet download costs, OCR, AI, and intensive modeling separately; these can dominate the bill.
10. Configure billing alerts and inspect supported service spend caps before launch. Alerts alone do not cap spending; caps are service-specific and enforcement can lag.

Pricing observations checked on 2026-10-26:

- Identity Platform email/social tier includes the first 50,000 monthly active users at no charge; SMS and other authentication categories have separate pricing.
- Cloud Tasks includes the first one million billable operations per month at no charge; submissions, deliveries, retries, and payload chunking affect operations.
- Cloud Run free-tier usage is aggregated by billing account across projects. Existing applications may already consume it.
- Firestore offers a limited free database allowance per project. Verify database eligibility and existing usage rather than assuming a new StrataX database qualifies.

Before deployment, produce a workload-based estimate covering active users, API traffic, database operations, stored GiB, monthly uploads/downloads, job CPU/memory/time, build/image usage, and optional services.

## Page-by-page implementation process

For each page:

1. Review its existing screen and actions with the user.
2. Agree on behavior, permissions, required evidence, and completion criteria.
3. Define request/response contracts, validation, records, files, and job behavior.
4. Implement the real backend and frontend integration locally.
5. Verify the complete flow, including failure handling, project isolation, persistence, and scientific correctness where relevant.
6. Record what is complete and what remains before moving to the next page.

Initial sequence:

1. **Landing page:** settle navigation and primary calls to action. Keep presentation content static unless there is a real need for dynamic content. Decide whether users can sign up directly, request access, or enter a demo. Add a backend form only if its purpose and handling are agreed.
2. **Account pages:** sign-up, sign-in, verification, password recovery, session behavior, and sign-out.
3. **Project directory:** ownership/membership, create/edit/list/search, favorites, duplication, archive, Trash, restore, and progress tracking.
4. **Project overview and data collection:** real source storage, import status, well registry, document metadata, parsing, and versioned evidence.
5. **Remaining workspaces:** agree on the detailed order with the user; implement scientific foundations before dependent modeling and decision workflows.

## Frontend issues to address during integration

The initial read-only code review identified:

- Shallow startup state copies can mutate reset/new-project defaults.
- Incomplete saved portfolio structures can crash initialization.
- File review lookup by filename can select the wrong record when filenames repeat.
- Some local project mutations lack storage-error handling.
- Some visible log/cutoff controls have no connected behavior or persistence.

These findings are pending fixes. Syntax checks passed for the three JavaScript files, and 380 route/tab combinations rendered in a mocked DOM. Actual browser interactions and appearance were not verified by those checks.

## Next discussion

Review the project directory's server persistence, ownership and cross-device behavior. Landing navigation, shared TerraCode identity, real account flows, independent StrataX profiles and policies, and branded account emails are implemented. Scientific reference screens remain explicitly illustrative or unavailable until their own integration phases.

## Pricing and platform references

- Cloud Run overview: https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run
- Cloud Run pricing: https://cloud.google.com/run/pricing
- Identity Platform pricing: https://cloud.google.com/identity-platform/pricing
- Firestore billing: https://firebase.google.com/docs/firestore/pricing
- Cloud Storage pricing: https://cloud.google.com/storage/pricing
- Cloud Tasks pricing: https://cloud.google.com/tasks/pricing
- Billing budgets: https://docs.cloud.google.com/billing/docs/how-to/budgets
- Service spend caps: https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps
