# STRATAX mobile/cloud handoff

This is a source snapshot, not a production release. It includes all existing tracked and nonignored unfinished source, including importer and seismic work. Do not deploy it wholesale.

Production: Site v10, source 067289c63fd8411c86cdc0bf31ad621ef51e9857, URL https://stratax-seismic-workbench.neonwhale8.chatgpt.site. API/workers were unchanged in the Nov 3 support release. Read STATUS.md, CONTEXT.md, HANDOFF.md before work.

The user declined paid infrastructure. Do not provision paid compute, buy credits, run paid scientific jobs, deploy backend changes, or publish the public root repository without separate authorization.

Current next product request: plan engines for frontend capabilities without backend support. An urgent support fix interrupted that work; the support fix is deployed. Do not treat unfinished local seismic/importer code as qualified production.

Credentials, backend/deploy-env.yaml, .env files, local browser storage, user originals, Windows virtualenv, dependencies, release/recovery archives and Codex login/session databases were not transferred. Original laptop data remains intact. Existing Local projects cannot be recovered from this source snapshot.

Cloud setup: Python 3.12+ virtualenv, backend/requirements.txt; Node 22+ and Playwright if browser tests are authorized. Existing browser harnesses contain Windows paths and need environment-specific overrides or a scoped portability change before running on Linux. Do not copy Windows binaries or credentials.

Git remote for original public repository: https://github.com/terracodeanalytics-rgb/stratax. Original HEAD: 4f181d5be873d5b635aeb19eb7ced8ec5bfb7634. This archive includes unpublished changes; it is not a replacement Git history. Preserve the laptop checkout and its Git state.

User skills live on the laptop under C:/Users/Tolu/.codex/skills. They are not automatically available in Cloud. Preserve their rules: real functionality, scientific honesty, reviewed execution, friendly errors, scoped cleanup, preserve assets/recovery/user changes; no unrelated deletion.
