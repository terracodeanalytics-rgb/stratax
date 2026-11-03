# Project and import visibility support release

## 2026-11-03 - Project recovery and imported-view support fix live (Site v10)

- Published Site v10: source `067289c63fd8411c86cdc0bf31ad621ef51e9857`, deployment `appgdep_6ae94ca8025c819180c34e0a677b53cb`, existing public URL/audience preserved. Site v9 retained for rollback. API/workers unchanged; API health ok.
- Stale project saves no longer block opening other projects. Pending work remains cached; known conflicts persist across reload and stop repeated autosaves. Explicit recovery saves a backup before loading Cloud state. Save operations stay scoped to the active project when required.
- Existing active imports rebuild missing well/location registrations from retained evidence. The first empty log workbook opens imported wells automatically. Import completion links directly to logs and map/location review. Unknown CRS remains unplaced; no invented coordinates or scientific approvals.
- Passed six focused browser checks locally and six on published assets with isolated mocked accounts/APIs, five account-scope tests and ten adjacent map checks. Eight published asset hashes match; zero page errors, real user writes, Cloud executions or backend deployments. This does not verify users' inaccessible Local browser files.
- Map regression fixtures were updated for current importer and required survey datum/Z meaning. Map surfaces fit 320/768/1024/1440; preexisting shared-header overflow at 768 remains outside this support change and must not be claimed fixed.
- Receipts: `.release/project-import-recovery-20261103`, `.release/support-recovery-live.json`, `.release/map-workspace-verification.json`. Root Git unpublished; unrelated dirty importer/seismic work preserved.
- Cleanup reviewed: zero disposable files removed; all release/QA/recovery assets retained. No container images built or pruned. Remaining support step: users refresh/reopen; any retained conflict uses Review save conflict. Missing coordinates still require source-reference review.
