# StrataX status

## 2026-10-27 — project setup, Cloud/Local storage and real overview

- Published Sites version 8: source `7f3c1b2b2162a1ba1815f346ce312055473b26e4`, deployment `appgdep_6ae052b94e648191a702c1f72dc27347`. Existing owner-only audience retained.
- Four-step Project → Location → Storage → Review setup supports Petrophysics, Seismic or both, optional WGS84 coordinates, editable workflows and an explicit destination. Shared navigation/search/direct-route guards follow workflow selections; well tie requires both.
- Compact searchable project switcher includes Active/Archived projects and ends with All projects. Overview uses genuine stored source/configuration/registration counts, workflow tracking, real activity and Google Maps site coordinates. Fabricated wells, curves, maps, summaries, candidates and reports are removed; scientific processing remains unavailable.
- Cloud projects use owner-scoped Firestore and original files in the existing private `project-9afac-stratax-raw` bucket. Local folders save manifests/originals with reconnectable browser handles; unsupported/embedded contexts offer portable packages. Saving/error/unsaved states, revision conflicts, legacy recovery and original downloads are implemented. Limits/contracts: `PROJECT_STORAGE.md`.
- API revision `stratax-api-00005-xav` serves 100%; build `dc2b1a2a-42f8-407d-b4c8-42a47d746ba4`, image digest `sha256:65a3b738755635a20b784c94689f85a9a0b9c3ad07f8aa3f70bb44797ae17187`. Scale-to-zero, maximum two instances, request-based billing, concurrency eight. Prior auth revision/image retained.
- Reused the existing StrataX-only Maps browser key, preserving prior origins/tile access and adding Maps JavaScript/geocoding plus the hosted origin. G-RES configuration is unchanged. Runtime secrets stay in Secret Manager; runtime identity receives bucket-scoped access. Seven StrataX policies are version 1.1.
- Verification: 12 backend tests, 20 candidate API checks, 16 project browser checks and 11 account/landing regressions passed. Published browser: 11 passed, including real Firebase sign-in, actual Google Maps, source-byte integrity, refresh, cross-device project restoration and 320/768/1024/1440px layouts. Zero page/Maps errors. Fresh API ERROR query returned no entries.
- Tests used isolated accounts; their records and source objects were removed. No email was sent. The first second-session browser attempt omitted policy checkboxes; the harness was corrected and the full hosted pass succeeded. No existing account password was changed.
- Cleanup: removed the one-use source normalizer and stopped two verified sandbox-stalled pytest processes. Retained original assets, recovery data, test evidence, operational scripts and all four registry-tagged StrataX images; zero cloud images deleted. No unrelated service or G-RES data changed.

## 2026-10-26 — project workspace redesign

- Redesigned the Projects page with a library sidebar, compact portfolio/resume panels, searchable project cards, six-stage progress rails, grid/list controls, and focused empty states. Preserved existing project management and local persistence behavior.
- Reused the landing initials-avatar component in the Projects header and the top-right header inside selected projects. Removed the previous sidebar profile tile; feature inventory and help remain available through sidebar utility links.
- Refined shared typography, navigation, spacing and surfaces without changing scientific content or calculation behavior. Browser-local project storage and illustrative data labels remain explicit.
- Scope confirmed by the user: Projects page plus shared navigation/header. Design direction is in `.better-web-ui.md`; no framework or dependency was added.
- Controlled browser suite: 30 passed, covering create/edit, search, favorite, progress, duplicate, archive, Trash/restore, grid/list, persistence, avatar navigation, account regressions and 320/768/1024/1440px layouts. Live hosted checks: 17 passed, including the redesigned library at 320/768/1440px and the shared selected-project avatar. The isolated account was removed.
- Sites version 7 source: `530a817355cfb4111b42b5b52721a8f5df2815c1`; deployment `appgdep_6adf9c6e43d881918be33ba24fa81bfc`. Backend and owner-only Site audience unchanged.
- Removed the one-use redesign generator; retained design/test evidence and operational tooling. No backend images were built; the two existing protected tagged API images remain retained.

## 2026-10-26 — header account avatar

- Removed the header's Open workspace link and standalone Sign out button. Signed-in users now see a circular teal initials avatar with their name/email and My projects, Account settings, Privacy & policies, Contact support and Sign out in its dropdown.
- Added keyboard navigation, Escape/focus return, outside-click dismissal, bounded mobile positioning and friendly sign-out failure feedback. Existing hero navigation and signed-out account links remain functional.
- Controlled browser checks: 25 passed, including avatar initials, menu keyboard behavior, mobile bounds, settings navigation and sign-out. Live hosted checks: 13 passed, including real Firebase sign-in, dropdown project navigation, refresh and menu sign-out; the isolated fixture account was removed.
- Sites version 6 release source: `6d7fc4edee622ab41e98ffefc18bd30970fba3dc`; deployment `appgdep_6adf950bb1248191a387076843ec40bd`. Owner-only audience preserved. Backend and its two protected tagged images are unchanged; no cloud cleanup deletion was needed.
- Design references: https://atlassian.design/components/avatar and https://www.radix-ui.com/primitives/docs/components/dropdown-menu. Implemented in existing vanilla JavaScript without adding a UI dependency.

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
