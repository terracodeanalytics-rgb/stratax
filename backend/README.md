# StrataX account API

Python/FastAPI service for the first StrataX production backend phase. Project records and original-file storage are implemented; scientific computation is not. See `../PROJECT_STORAGE.md` for storage contracts and bounds.

## Configuration

Public deployment configuration is in `deploy-env.yaml`. `FIREBASE_API_KEY` is a public Firebase browser key, not an administrator credential. SMTP_PASSWORD is supplied only by the existing Secret Manager secret at deployment. Use Application Default Credentials locally and the dedicated runtime service identity in Cloud Run; do not create service-account key files.

Cloud Run service: `stratax-api`, project `project-9afac`, region `us-central1`. Runtime identity: `stratax-auth-runtime@project-9afac.iam.gserviceaccount.com`. Request-based billing, zero minimum instances, maximum two instances, 1 CPU, 512 MiB, concurrency 8, request timeout 60 seconds.

## Interfaces

- GET `/api/health`: public health check. Google intercepts `/healthz`; use this application route externally.
- GET `/readyz`: required configuration readiness.
- GET `/api/runtime-config`: public Firebase web configuration, restricted Google Maps browser key and current policy versions.
- POST `/api/auth/action-email`: `{email, purpose, name?}`, where purpose is signup, recovery or verification. Returns generic HTTP 202 on accepted eligible requests; SMTP failures return a friendly 503. Recipient/IP/global rate limits are persisted transactionally in Firestore.
- GET/POST `/api/legal-acceptance`: verified Firebase identity required. POST accepts `{accepted:true, accepted_versions:{...}}`; exact current versions are authoritative.
- GET/PUT `/api/account`: verified Firebase identity required. PUT accepts only `{display_name, organization}` and requires current policy acceptance.
- GET/PUT `/api/projects/{id}` and GET `/api/projects`: owner-scoped records with transactional revisions and current-policy enforcement.
- GET/PUT `/api/projects/{id}/files/{file_id}`: private original-file download/streamed upload; 64 MiB per file, 128 MiB per project.
- GET `/assets/logo.png`: public, branded email image without access-controlled Sites image dependencies.

Profiles, current policy acceptance, and rate counters use only `stratax_accounts`, `stratax_legal_acceptance`, `stratax_auth_rate_limits`, and owner-scoped `stratax_projects` in the default Firestore database. UID comes from the verified token. The runtime has database-level IAM access; collection boundaries are enforced by application code. The API does not read or write other products' collections.

The frontend's policy documents and `policies.py` must stay in agreement. Material changes require new versions and renewed acceptance. Account links are generated server-side and rewritten to the fixed StrataX email-action page without altering shared Firebase templates. User-provided continuation URLs and additional JSON fields are rejected.

## Local verification

Create a virtual environment, install `requirements.txt` plus pytest/httpx for tests, and run `python -m pytest backend/tests -q` from the repository root. On Windows, the test client needs loopback-socket access.

The controlled browser suite is `scripts/verify-ui.cjs`. Live checks are `scripts/live-account-qa.py`, `scripts/verify-live-site.cjs`, and `scripts/verify-live-assets.cjs`. They create only isolated Firebase fixtures and remove their own account/policy records. The live browser tools accept a Sites access token over hidden stdin; never pass it as a shell argument or store it in source.

`scripts/verify-email.py` sends a real account email and checks only its matching message using read-only IMAP. Set STRATAX_QA_EMAIL only after the human authorizes that inbox. The SMTP secret stays in process memory. Never use an existing user's password for live QA.

## Release

Build with `gcloud builds submit backend --config=backend/cloudbuild.yaml --project=project-9afac --region=us-central1`. Deploy the returned immutable image digest using the public env file and `--update-secrets=SMTP_PASSWORD=gres-smtp-password:latest,GOOGLE_MAPS_API_KEY=stratax-maps-api-key:latest`. Existing services should use a zero-traffic tagged candidate and promote after checks. The first Cloud Run revision cannot use `--no-traffic`.

Retain the current and rollback images, all tagged images, and the newest three images under the repository cleanup policy. Never delete unrelated services, databases, accounts, mail, or shared resources as part of StrataX cleanup.
