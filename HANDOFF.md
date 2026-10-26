# StrataX handoff

## Completed

Landing-page simplification, corporate footer, favicon/logo navigation, G-RES-style account UI, shared Firebase integration, real branded setup/recovery/verification emails, current-policy acceptance and StrataX-specific profile persistence are implemented. Project/scientific backend work remains separate.

Latest follow-up: the signed-in public header now shows an initials avatar and account dropdown instead of Open workspace/Sign out. Menu links point to working project/settings/policy/support destinations. The 25-check browser suite passed. Published source `6d7fc4edee622ab41e98ffefc18bd30970fba3dc`, deployment `appgdep_6adf950bb1248191a387076843ec40bd`; 13 live hosted checks passed and the isolated account was removed. Backend unchanged.

## Live state

- Frontend: https://stratax-workbench.cometcrab258.chatgpt.site/#home; existing owner-only Sites audience retained.
- API: https://stratax-api-227436363119.us-central1.run.app; `stratax-api-00002-wep` at 100% in `project-9afac/us-central1`.
- Backend build `b55bd7b5-d9b9-4a0c-84f2-82e9cabaf95d`; current digest `sha256:34e409263b204eb0fd2e89dd352fba8c42db7be36c2ba4e851926055817e0881`.
- Previous frontend version 5 was published from Sites source commit `ada5a76bb12fd1c9b497ead5ef4d347f1dac9f0b`, deployment `appgdep_6adf9142539c8191ac0586e567fcaf49`. Version 4 passed the complete real sign-in/email/browser checks; version 5 adds provider-error redaction and account-aware profile labels and passed the 24-check focused browser suite.

## Verification and tools

- `python -m pytest backend/tests -q`: 10 passed. Use the repository virtual environment; Windows TestClient needs loopback access.
- `node scripts/verify-ui.cjs`: 24 controlled-provider browser checks passed. Runtime paths can be overridden with PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE.
- `scripts/live-account-qa.py`: 20 real Firebase/Firestore checks passed; deletes its isolated identities and account/policy documents.
- `scripts/verify-live-site.cjs`: hidden stdin `{siteToken}` runs hosted real sign-in/layout checks; `{siteToken, flow:"email"}` tests real cross-device link completion/password recovery and Google popup/cancellation. No tokens are persisted or printed.
- `scripts/verify-live-assets.cjs`: hidden Sites token input; verifies all logo images decode and captures final mobile/desktop renders.
- Final version-5 asset/source verification passed seven checks, including exact published app/auth bytes and provider-error redaction. Fresh API ERROR logs remained empty.
- `scripts/verify-email.py`: one real message was authorized only for `contact@terracodeanalytics.com`; delivery and inbox receipt passed. Do not rerun casually because it sends mail.
- Sanitized evidence and screenshots are under ignored `.release/`. Isolated Sites source is under ignored `.sites-source/`. Preserve operational tooling and recovery evidence.
- Live Google provider popup and cancellation passed; entering real Google credentials was not automated.

## Next actions

1. Discuss the project directory’s backend ownership, persistence, duplication, archive/Trash and cross-device behavior with the user.
2. Continue page by page. Do not silently claim scientific reference screens are completed editors or calculations.

## Cleanup and preservation

One-use integration script removed; six blocked session test processes stopped. Both StrataX image digests are tagged/current-or-rollback and were retained; zero images deleted. No unrelated services, accounts, data, settings or images were changed. The existing untracked BACKEND_PLAN.md belongs to this conversation and should be preserved and committed with its updated phase status.
