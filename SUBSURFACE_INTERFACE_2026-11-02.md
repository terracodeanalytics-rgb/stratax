# Multidisciplinary frontend and slim multiwell display — 2026-11-02

## Live release

Site version 9 succeeded at https://stratax-seismic-workbench.neonwhale8.chatgpt.site. Source `db7a43641cd993a1d250b177dbb40f5b8dad2a38`; deployment `appgdep_6ae820d84f84819187c740c3200315ad`. Public access preserved. Site version 8 is the rollback. API and worker images/configuration were not changed; API health passed. No scientific jobs started or Local files uploaded.

## Interface

- 13 discipline tabs: Home, Logs, QC, Petrophysics, Correlation, Geology, Geophysics, Modeling, Drilling, Reservoir, Production, Workflows and Reports, plus selection-dependent tabs. Individual supported models are directly exposed in discipline groups. Removed the CSS rule that pushed the final group across a large empty area; command stacks use three compact rows. Desktop overflow scrolls horizontally; narrow layouts use bounded group menus.
- 74 planned capability entries in 19 groups are visibly disabled, with explicit reasons. The searchable capability library uses the same inventory. Future commands do not dispatch, open counterfeit workspaces, generate results or create project objects. Existing method/tool availability remains authoritative.
- Project Browser categories: Data preserves the source/well tree; Models exposes retained model/derived evidence and disabled future object types; Processes exposes the existing reviewed workflow entry points; Results lists real scientific runs. Empty lists remain truthful.
- New view chooser exposes working log, crossplot, histogram and workbook comparison views plus nine disabled integrated view types. Existing Map and seismic routes remain untouched; the disabled integrated-view placeholders do not replace them.
- Context menus retain working selection operations and distinguish future raster/image/3D/sample-editor commands. Bottom panels offer real run history/messages, source-QC entry points, and a disabled visual process diagram.
- Centered dialogs now bound their size against CSS zoom as well as viewport dimensions, including long preparation tables. Native modal focus and original form membership are retained.

## Slim logs and adjustable widths

New tracks start at 48 px instead of 140 px; the depth ruler is 44 px per reference. Removed the fixed 240 px well-display floor. Existing saved widths are preserved; Slim wells applies the minimum to displayed wells. Track settings and imported templates accept 48–480 px. Template widths remain explicit.

Tracks and whole wells have keyboard/pointer resize handles. Drag gestures commit once, support Escape/cancellation, and use the existing undo/persistence machinery. Whole-well resizing assigns a common track width; the width dialog can target the selected track, selected well or all displayed wells. Fit wells allocates available canvas width with a 48 px floor, preserving horizontal scrolling when more wells cannot fit. Existing 30-well/track safety bounds remain. Width changes affect display geometry, not samples, depth transforms or scientific approval.

## References and coverage

The inventory adapts public domain/task structure and uses STRATAX icons and branding. It is not a licensed, version-by-version audit of every proprietary dialog/plugin. Planned entries describe STRATAX frontend equivalents; their names do not assert scientific implementation. Reference videos reviewed earlier remain linked in the original petrophysics workspace notes.

- [Petrel features, including modeling, interpretation, collaboration and well placement](https://www.slb.com/products-and-services/delivering-digital-at-scale/software/petrel-subsurface-software/petrel-features)
- [Techlog multidisciplinary wellbore platform and image/high-angle workflows](https://www.slb.com/products-and-services/delivering-digital-at-scale/software/techlog-wellbore-software/techlog)
- [Petrel well correlation](https://www.slb.com/products-and-services/delivering-digital-at-scale/software/petrel-subsurface-software/petrel/petrel-geology-and-modeling/petrel-well-correlation)
- [Petrel trajectory planning](https://www.slb.com/products-and-services/delivering-digital-at-scale/software/petrel-subsurface-software/petrel/petrel-drilling/petrel-trajectory-planning)
- [Techlog production logging product sheet](https://www.software.slb.com/-/media/software-media-items/software/documents/external/product-sheets/techlog_production_logging_ps.pdf)
- [Petrel reservoir engineering module coverage](https://digital.slb.ru/products/petrel/petrel_reservoir_engineering/)

## Validation

28 local browser groups passed, opening all 64 non-log-view method configurations. Eleven focused groups passed on all six TMB LAS originals; hashes were unchanged and no content uploaded. Five mocked Cloud/report checks passed, including HTML/PDF and full-row CSV. Eleven browser groups also passed against published Site assets using an isolated mocked account/API and Local synthetic fixtures. Seven released asset hashes match; zero page errors/Cloud content requests. Widths 320–1920 px and CSS zoom 125–150% were checked. These are interface checks, not authenticated live scientific/field-study qualification; prior calibration blockers remain.

## Release and cleanup

Seven frontend overlays: interpretation-workspace.js, petrophysics-workspace.js, petrophysics-workspace.css, petrophysics-ribbon.js, new subsurface-capabilities.js, well-canvas.js and well-canvas-model.js. Release baseline: Site version 8. Preserve `.release/multidiscipline-ui-20261102` archives/receipts and `.release/dense-*.png` screenshots. All unrelated dirty importer/seismic work is excluded and retained. No disposable session junk found, no deletions, no container builds, no registry changes. Only the dedicated Site source was published; root Git publication remains excluded.

## Disabled capability inventory

### Home / Project and collaboration

- `shared-library` — Shared object library. Not available in this release. Shared-library review is planned.
- `live-collaboration` — Live collaboration. Not available in this release. Concurrent interpretation editing is planned.
- `object-search` — Global object relationships. Not available in this release. Cross-domain object linking is planned.

### Logs / Extended log display

- `raster-digitize` — Raster digitization. Not available in this release. Digital curve extraction is planned.
- `image-track` — Borehole image track. Not available in this release. Image-track rendering is planned.
- `core-photo-track` — Core photo track. Not available in this release. Depth-registered photographs are planned.
- `deviated-logview` — Deviated well display. Not available in this release. Along-hole section rendering is planned.

### QC / Advanced conditioning

- `automatic-depth` — Automatic depth alignment. Not available in this release. Reviewed automatic matching is planned.
- `tool-corrections` — Vendor tool corrections. Not available in this release. Vendor-specific correction models are planned.
- `image-orientation` — Image orientation QC. Not available in this release. Image orientation processing is planned.

### Petrophysics / Advanced evaluation

- `multimineral-suite` — Multimineral workspace. Not available in this release. Interactive multimineral model editing is planned.
- `dielectric` — Dielectric interpretation. Not available in this release. Dielectric analysis is planned.
- `high-angle-inversion` — High-angle 3D inversion. Not available in this release. Layer-model inversion is planned.
- `unconventional` — Organic shale evaluation. Not available in this release. Kerogen and maturity workflows are planned.

### Geology / Structural interpretation

- `fault-sticks` — Fault stick editor. Not available in this release. Fault editing in the shared workspace is planned.
- `horizon-picking` — Horizon picking. Not available in this release. The shared horizon editor is planned.
- `structural-framework` — Structural framework. Not available in this release. Framework construction is planned.
- `fault-framework` — Fault framework. Not available in this release. Fault-network editing is planned.

### Geology / Facies and stratigraphy

- `stratigraphic-column` — Stratigraphic column. Not available in this release. Stratigraphic column editing is planned.
- `sequence-stratigraphy` — Sequence stratigraphy. Not available in this release. Sequence interpretation is planned.
- `depositional` — Depositional interpretation. Not available in this release. Depositional-element editing is planned.
- `sedimentary-dips` — Sedimentary dip analysis. Not available in this release. Dip interpretation is planned.

### Geology / Borehole geology

- `dip-picking` — Image dip picking. Not available in this release. Interactive dip picking is planned.
- `fracture-picking` — Fracture picking. Not available in this release. Fracture interpretation is planned.
- `rose-plot` — Rose diagram. Not available in this release. Orientation-diagram rendering is planned.
- `stereonet` — Stereonet. Not available in this release. Stereographic plotting is planned.

### Geophysics / Seismic interpretation

- `seismic-3d-view` — 3D seismic view. Not available in this release. The integrated 3D viewer is planned.
- `seismic-volume-probe` — Volume probe. Not available in this release. Interactive volume probing is planned.
- `frequency-decomposition` — Spectral decomposition. Not available in this release. A shared spectral workspace is planned.
- `seismic-4d-view` — 4D comparison. Not available in this release. Time-lapse comparison views are planned.

### Geophysics / Quantitative interpretation

- `avo-workspace` — AVO workspace. Not available in this release. Interactive AVO diagnostics are planned.
- `joint-inversion` — Joint inversion workspace. Not available in this release. Integrated joint-inversion review is planned.
- `wavelet-editor` — Wavelet editor. Not available in this release. Interactive wavelet editing is planned.
- `synthetic-well-tie` — Interactive well tie. Not available in this release. The shared tie-calibration view is planned.

### Modeling / Grids and framework

- `pillar-grid` — Pillar gridding. Not available in this release. Interactive grid construction is planned.
- `depogrid` — Unstructured gridding. Not available in this release. Unstructured grid editing is planned.
- `zone-layer-model` — Zone and layer model. Not available in this release. 3D zone/layer modeling is planned.
- `grid-faults` — Faulted grid editing. Not available in this release. Grid/fault integration is planned.

### Modeling / Properties and realizations

- `facies-model` — 3D facies modeling. Not available in this release. Spatial facies modeling is planned.
- `property-editor` — 3D property editor. Not available in this release. Interactive cell-property editing is planned.
- `fracture-network` — Discrete fracture network. Not available in this release. Fracture-network construction is planned.
- `scenario-modeling` — Geological scenarios. Not available in this release. Multi-scenario structural modeling is planned.

### Drilling / Well design

- `trajectory-editor` — Interactive trajectory editor. Not available in this release. Graphical well-path editing is planned.
- `target-designer` — Target designer. Not available in this release. Target-volume editing is planned.
- `geosteering` — Real-time geosteering. Not available in this release. Live directional interpretation is planned.
- `well-placement` — Automated well placement. Not available in this release. Reviewed well-placement optimization is planned.

### Drilling / Wellbore stability

- `mud-window` — Mud-window workspace. Not available in this release. Interactive mud-window review is planned.
- `borehole-breakouts` — Breakout interpretation. Not available in this release. Borehole failure interpretation is planned.
- `cement-evaluation` — Cement evaluation. Not available in this release. Cased-hole cement evaluation is planned.
- `casing-design` — Casing / completion design. Not available in this release. Mechanical design tools are planned.

### Reservoir / Simulation preparation

- `fluid-pvt` — PVT model editor. Not available in this release. Fluid-model editing is planned.
- `scal-editor` — SCAL function editor. Not available in this release. Relative-permeability/capillary model editing is planned.
- `initialization` — Reservoir initialization. Not available in this release. Equilibration model review is planned.
- `schedule-editor` — Schedule editor. Not available in this release. Simulation schedule construction is planned.

### Reservoir / Simulation and uncertainty

- `simulation-launch` — Simulation launcher. Not available in this release. Simulator integration is planned.
- `history-match` — History matching. Not available in this release. History-matching optimization is planned.
- `ensemble-review` — Ensemble review. Not available in this release. Simulation ensemble views are planned.
- `streamlines` — Streamline visualization. Not available in this release. Streamline display is planned.

### Production / Production interpretation

- `spinner-processing` — Spinner calibration. Not available in this release. Full spinner processing is planned.
- `holdup` — Holdup analysis. Not available in this release. Multiphase holdup interpretation is planned.
- `temperature-production` — Temperature interpretation. Not available in this release. Production temperature modeling is planned.
- `multisensor-production` — Multisensor interpretation. Not available in this release. Multisensor production processing is planned.

### Production / Well performance

- `inflow-performance` — Inflow performance. Not available in this release. IPR analysis is planned.
- `nodal-analysis` — Nodal analysis. Not available in this release. Coupled well-performance analysis is planned.
- `production-surveillance` — Production surveillance. Not available in this release. Time-series surveillance views are planned.
- `injection-profile` — Injection profile. Not available in this release. Injection-profile analysis is planned.

### Workflows / Automation and connectivity

- `workflow-node-editor` — Visual workflow editor. Not available in this release. A graphical workflow editor is planned.
- `python-console` — Python scripting console. Not available in this release. Sandboxed scripting is planned.
- `real-time-streams` — Live data streams. Not available in this release. Streaming data integration is planned.
- `external-connectors` — External data connectors. Not available in this release. External platform connections are planned.

### Reports / Presentation and publishing

- `report-layout-designer` — Report layout designer. Not available in this release. Interactive report page design is planned.
- `cross-domain-report` — Multidisciplinary report. Not available in this release. Combined 3D/seismic/model reporting is planned.
- `presentation-scene` — Presentation scenes. Not available in this release. Scene capture and presentation tools are planned.
- `scheduled-reports` — Scheduled reporting. Not available in this release. Scheduled report delivery is planned.
