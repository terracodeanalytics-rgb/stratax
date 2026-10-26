# StrataX status

## 2026-10-26 — landing and account release

- Landing hero retained; requested marketing sections, section-navigation links, public demo access and preview notices removed. Corporate-style footer, public StrataX policies, home-linked branding and logo favicon added.
- G-RES-style responsive account screens now use real shared TerraCode Firebase identity, email/password and Google sign-in, one-time setup/recovery links, password controls, remembered sessions and independent StrataX policy acceptance.
- User profiles and policy records persist in Firestore. Workspace drafts remain browser-local under UID-scoped keys; legacy unscoped data is preserved without automatic assignment. Scientific and server project features remain deferred and truthfully labeled.
- Cloud Run `stratax-api-00002-wep` serves 100% in `project-9afac/us-central1`, using `stratax-auth-runtime@project-9afac.iam.gserviceaccount.com`, zero minimum/two maximum instances, request-based CPU, 512 MiB and concurrency 40.
- Current API image: `us-central1-docker.pkg.dev/project-9afac/stratax/stratax-api@sha256:34e409263b204eb0fd2e89dd352fba8c42db7be36c2ba4e851926055817e0881`; build `b55bd7b5-d9b9-4a0c-84f2-82e9cabaf95d`. Rollback: `stratax-api-00001-big`, digest `sha256:d88ba887a61cbc6a6c556adfd0074c4dce1b838206919a6dd5ab219c31cb38d5`.
- Hosted frontend: https://stratax-workbench.cometcrab258.chatgpt.site/#home. Sites version 5 is published from source commit `ada5a76bb12fd1c9b497ead5ef4d347f1dac9f0b`; deployment `appgdep_6adf9142539c8191ac0586e567fcaf49`. This includes final client-error redaction and account-aware profile labels. Version 4 remains the previous saved frontend release. The owner-only audience is unchanged.

### Verification

- Backend: 10 focused tests passed; one upstream test-client deprecation warning.
- Controlled-provider browser suite: 24 checks passed, including session expiry, account forms, legal acknowledgement, legacy-data preservation and responsive widths 320/768/1024/1440.
- Real Firebase/Firestore API verification: 20 checks passed; both isolated accounts removed.
- Hosted browser: 13 checks passed for real sign-in, policy persistence, workspace entry/refresh, logo home, sign-out and responsive pages.
- Additional hosted browser: four checks passed for cross-device email-link completion, password recovery, reused-link rejection and actual Google provider popup/cancellation. Both browser fixture accounts removed.
- Final version-5 verification: seven checks passed for decoded desktop/mobile logos, exact published app/auth source matches and provider-error redaction.
- Authorized test email delivered to `contact@terracodeanalytics.com`; read-only mailbox verification confirmed StrataX branding, correct action origin, HTML and plain text. No existing password was changed.
- Google credential entry/completion was not automated. Scientific capabilities and project-server persistence were not claimed or tested as implemented.
- Fresh API ERROR-log query returned no entries after live verification.

### Cleanup

- Removed the one-use frontend integration generator and stopped six sandbox-blocked test processes from this session.
- Retained supplied logo assets, isolated Sites source checkout, dependency environment, operational test scripts and ignored release evidence.
- Reviewed only the StrataX image package: two images, both tagged and protected as current/rollback. Zero images deleted; unrelated services unchanged.

### Next

Discuss and implement project-directory server persistence and ownership. Continue page-by-page scientific integration afterward. The earlier broad deployment hold has been lifted only for this completed landing/account phase.
