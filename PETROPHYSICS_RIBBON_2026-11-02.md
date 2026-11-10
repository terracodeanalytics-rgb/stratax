# Petrophysics ribbon and centered dialogs — deployed 2026-11-02

Site version 8 is live at https://stratax-seismic-workbench.neonwhale8.chatgpt.site. Source `fc7bae98fc98313d761f1864e05e49eeb3455486`; deployment `appgdep_6ae7c5c2fa8081919a20106c2685af16`. The public audience is unchanged. Rollback uses Site version 7. Backend API and workers were not changed.

## Behavior

- One grouped ribbon replaces the tab/action/legacy-toolbar stack. Visible group captions, primary and secondary commands, seven persistent tabs and contextual Curve/Track/Section tabs use STRATAX colors/icons. Ribbon collapse is stored per project; missing legacy preference defaults to expanded. Narrow layouts collapse groups into menus.
- Individual and specialist methods remain available in the searchable Advanced methods catalog. Existing tool availability, disabled digitization, method IDs and deep links remain authoritative.
- Prepare logs assembles exact-mnemonic source suggestions, unit/ambiguity blockers, template review, optional conditioning setups and existing workflow definitions/runs. Creating multiple setups proposes bindings without confirming them or starting calculations. Calibrate groups zones/inherited parameters and calibration methods; Evaluate well exposes configured-method exceptions and reviewed definitions/runs. Existing explicit Run/checkpoint publication rules remain unchanged.
- Workspace dialogs use native modal focus behavior, centered viewport placement, standard/wide widths, bounded scrolling, fixed headers, sticky action areas and focus restoration. Actions stay inside their original forms. Template/workflow/settings dialogs replace the current dialog rather than stacking. Existing Properties remains a side panel.
- The application sidebar has collapse controls in its own header and the persistent application top bar, plus an App sidebar ribbon action. Its existing per-project workbench preference is independent of Project Browser state. Narrow layouts use an independently restorable drawer. These additions are scoped to the petrophysics workspace.

## Verification and limits

25 local browser groups passed, including all 64 non-log-view method configurations. A focused follow-up passed 8 groups including proposed conditioning setup creation without confirmation or execution. Five mocked Cloud/report checks passed, including report PDF rendering and complete CSV rows. On published Site assets, 8 isolated browser groups passed with mocked account/APIs and Local synthetic fixtures: zero page errors and zero Cloud content requests. All five released asset hashes match, and existing API health is ok. These checks do not constitute a real authenticated Cloud workflow or field-study acceptance.

Widths: 320, 768, 1024, 1440 and 1920 px. Browser CSS zoom at 125% and 150% passed viewport-bound dialog checks; native browser-chrome zoom was not separately automated. Screenshots remain under `.release/ribbon-*.png` and responsive `.release/well-canvas-*.png`; the latest focused live run refreshed screenshots against the published assets. Numerical methods and original data were unchanged; prior field calibration blockers remain.

## Release and cleanup

Five frontend overlays only: interpretation-workspace.js, petrophysics-workspace.js, petrophysics-workspace.css, new petrophysics-ribbon.js and workbench.js. Release source starts from Site version 7; unrelated importer/seismic drafts are excluded. Receipts and archive are retained in `.release/petrophysics-ribbon-20261102`; automated checks are in scripts/verify-well-canvas.cjs and scripts/verify-petrophysics-cloud-ui.cjs.

No disposable local junk was found; zero files deleted. No container images were created or changed; no registry images deleted. Retain source archives, QA evidence, original data and recovery assets. Root Git commit/push remains explicitly excluded; only the dedicated Site repository was published as required for hosting.
