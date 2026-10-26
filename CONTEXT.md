# StrataX context

## Repository and hosting

- Git root is this STRATAX repository; destination is `https://github.com/terracodeanalytics-rgb/stratax`.
- Canonical frontend is `frontend/`; backend is `backend/`. Static ES modules require no frontend build.
- Existing Sites ID: `appgprj_6adc66e963588191a4154ab09c724471`, recorded in `frontend/.openai/hosting.json`. Preserve the Site and its owner-only audience.
- Current frontend: Sites version 6 account-avatar release, source `6d7fc4edee622ab41e98ffefc18bd30970fba3dc`; previous saved release version 5 used source `ada5a76bb12fd1c9b497ead5ef4d347f1dac9f0b`.
- The public header uses an initials-avatar menu after sign-in; My projects, account settings, policies, support and sign-out are available there. Menu controls support keyboard navigation, focus return and outside dismissal.
- Hosted Site source is a separate managed repository opened under ignored `.sites-source/`. Do not replace the root Git remote with the Sites remote. Use the Sites source helper, hidden stdin credentials and matching source/archive provenance for publication.
- The initial published frontend source matched the original local app/styles exactly.

## Cloud and identity

- Active cloud account inspected: `sharonafolabi3@gmail.com`; project `project-9afac`; region `us-central1`.
- Account API: https://stratax-api-227436363119.us-central1.run.app
- Cloud Run service `stratax-api`; current revision `stratax-api-00002-wep`. Status has the alternate URL https://stratax-api-fwy32oha6q-uc.a.run.app and candidate tag URL https://candidate---stratax-api-fwy32oha6q-uc.a.run.app.
- Dedicated Firebase web app `StrataX Web`: `1:227436363119:web:a01865da7615f56878fc9a`. Shared Firebase user pool; password changes affect other TerraCode apps using the same identity.
- Added only the StrataX Sites hostname to the authorized-domain list. Existing providers/templates/domains were preserved.
- Runtime identity `stratax-auth-runtime@project-9afac.iam.gserviceaccount.com` has the narrow existing `titanAuthLinkSender` role, `roles/datastore.user`, and access only to the existing SMTP secret `gres-smtp-password`. An older `stratax-api` identity with SQL roles was left untouched.
- Public Firebase/runtime settings are in `backend/deploy-env.yaml`. SMTP secret values are never stored in source; Cloud Run mounts the secret at runtime.

## Contracts and boundaries

- Public: `/api/health`, `/readyz`, `/api/runtime-config`, `/api/auth/action-email`, `/assets/logo.png`.
- Verified Firebase identity: `/api/account` GET/PUT and `/api/legal-acceptance` GET/POST. Profile writes also require current policies. All resource UIDs derive from the token.
- Firestore collections: `stratax_accounts`, `stratax_legal_acceptance`, `stratax_auth_rate_limits` in the default database. IAM is database-level; application code enforces collection and UID boundaries.
- Seven independent StrataX policy versions start at 1.0. Backend `policies.py` and frontend documents must evolve together.
- Account emails use SpaceMail SMTP, branded HTML/plain text, and fixed-origin StrataX action URLs. Shared Firebase templates and G-RES endpoints are not modified. Public email requests are validated and transactionally rate-limited by recipient, connecting address and globally.
- Do not log passwords, tokens, action codes, generated links or SMTP credentials.
- `#home` and policy routes are public within the existing Sites access boundary. Workspace routes require restored verified Firebase identity and current policy acceptance.
- Browser drafts use `stratax.frontend.v1:<uid>` and `stratax.projects.v2:<uid>`. Unscoped legacy keys are left intact and unassigned. Sign-out hides the active user’s drafts; browser storage is not encryption or server isolation.
- No scientific data upload, parsing, computation, GIS integration or server project synchronization was introduced. Synthetic examples and pending features remain labeled.

## Operational lessons

- Google intercepts `/healthz` before the application. Use `/api/health` externally.
- First Cloud Run deployment cannot specify `--no-traffic`; later candidates can.
- Windows sandbox loopback restrictions can stall FastAPI TestClient. The approved out-of-sandbox test run passed.
- Existing shared SMTP access can verify the explicitly authorized test message with read-only IMAP; do not inspect unrelated messages or send further test mail without authorization.
- Browser screenshot checks must wait for image decoding and fonts, especially when the initial auth callback re-renders the landing page.
- Retain all tagged images and serving/rollback images; do not prune other applications in the shared cloud project.
