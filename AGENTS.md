# StrataX repository instructions

## Shared fixes and releases

- Fix the shared product path that caused the reported issue. A customer's dataset can be a regression fixture, but fixes must apply to all eligible accounts and existing projects. Avoid account IDs, email addresses, allowlists, and per-account flags as fixes for shared behavior.
- Exercise shared account-sensitive changes with at least two independent test identities. For storage and data fixes, include the storage modes affected by the change and cover existing project state when applicable. Keep each test account's data isolated.
- When deploying, verify that the existing public StrataX domain serves the shared release. Record the live verification and any coverage gaps in STATUS.md and HANDOFF.md.
- Keep account-specific recovery scoped to that account. An individual recovery is separate from the shared product fix.

## Session cleanup

Use the Terracode cleanup skill after coding sessions. Remove verified session junk and review deployment images only for services related to StrataX. Preserve the latest three images per service and all registry-tagged, live, tagged-revision and worker images. Keep original assets, user changes, recovery backups and operational tooling. Read-only catchups do not trigger cleanup.
