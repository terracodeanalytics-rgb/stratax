# Well-log canvas

Interpretation is a persistent well-log board. `well-canvas-model.js` contains pure view metadata/geometry; `well-canvas.js` reads retained chunks and binds the tree, tracks and inspector. The existing method registry/API remains authoritative for calculations.

## Current local workbench additions - 2026-10-31

- The tree organizes wells, runs, curves and supporting evidence, plus global curve categories and shared stratigraphy. Well/run/curve/marker checkboxes redraw the active workbook and show partial parent states. Display visibility keeps imported selections and hidden styles intact.
- Stable registry names/UWI/aliases are separate from IDs. Headers place wellheads when their coordinate reference is confirmed. The map retains active survey selection and unresolved-location review; source observations remain available.
- Survey-backed MD/TVD/TVDSS conversion requires compatible units/datums and never extrapolates. Index rulers and curve headers remain visible during navigation. Inspector values come from retained samples; source selection bounds are converted back to their original units/reference.
- Shared imported picks can be displayed and correlated between actual well picks with compatible references. Imported evidence is not edited as a hand-picked top, and correlation lines are not calculated geological surfaces.
- Templates preserve multiple curves per track, ordering, scales, styles, fills and visibility. Apply to one/all workbook wells through unique confirmed curve-type/unit matches, with exact mnemonic/unit fallback for unclassified curves. Missing/ambiguous matches are reported.
- The Data page offers full retained survey/checkshot observation tables, time-depth QC and separate derived interval velocities, with explicit active checkshot selection. MD interval velocity needs a compatible active survey conversion to TVD.
- Changes have source-only validation. Runtime, numerical, visual, storage and performance qualification are deferred to [WELL_WORKFLOW_ACCEPTANCE.md](WELL_WORKFLOW_ACCEPTANCE.md).

## Try the six LAS files

1. Open the project and Interpretation. Existing activated log datasets appear under Wells & curves. Otherwise use Add curves, classify as conventional logs, and review the actual WELL identities and references before importing.
2. Use Add wells to select the six wells, or drag a well from the tree. Expand a run and drag a curve into a track to overlay it. Click a curve for its axis, colour, visibility and source properties.
3. Fit depth or enter top/base. Linked depths move together. Ctrl+wheel zooms; ordinary wheel scrolls the page; Shift-wheel pans; Shift-drag selects an interval. The depth ruler converts recognized source length units to metres; this does not establish a vertical datum or convert MD to TVD.
4. Pick/edit formation tops, correlate user-picked names, flatten on a named marker, or open a crossplot and brush actual paired samples.
5. Select a source curve and choose a ribbon method or Calculate from selection. Confirm mappings, units, parameters and calibration. Cloud projects execute through the scientific job; Local projects require an explicitly confirmed independent Cloud copy.
6. Open the completed result. Indexed results offer full proposed curves on the canvas. Review before accepting independent result datasets; originals remain immutable. Rejected results remain comparison evidence and cannot become downstream inputs.
7. Save templates, recipes, workbook tabs and named view versions. Export actual SVG plots, curve CSV or view metadata. Portable projects must still be downloaded to retain changes outside the browser.

Legacy saved depth ranges outside every loaded log are repaired once on reload. Subsequent intentional empty intervals show an explicit Fit depth recovery action.

## Data and persistence rules

- Display up to 250,000 rows/12 million scalar cells per dataset and across visible data. Load two datasets concurrently; clear caches on Firebase UID/project changes. No 2,000-row preview is substituted for the full displayed log range. Pixel envelopes retain local minima/maxima and null gaps; CSV retains actual source samples.
- Coordinates and unknown units remain unresolved. The six Downloads files do not contain a confirmed geodetic datum; these tests do not authorize WGS84 map placement. Duplicate mnemonics retain independent column identities.
- View state contains source IDs, selected columns, axes, tops and layouts, not full source arrays. Curve edits change display metadata. Accepted calculations create separate immutable datasets.
- Scoped calculations preserve exact indexed rows. Intervals use metres; brushes use bounded nonoverlapping source-row ranges. Scope cannot silently combine unrelated datasets or resample values. Pointwise results retain an explicit depth column and reference.
- Nested matrix parameters are losslessly encoded through a non-reserved Firestore map key; public reads restore the original JSON. Revision checks and failed-save drafts remain in force.
- Templates match exact mnemonic/unit pairs and report ambiguity/missing curves. Recipes reopen explicit steps and require fresh confirmations; they do not automatically execute a processing chain.

## Verification and limits

The six read-only LAS files contain 188,394 rows in total. `verify-well-canvas.cjs --six-las` imports their actual browser-readable data locally, checks the full row counts, hashes originals before/after and asserts no Cloud content requests. Sixteen interaction groups plus five focused depth-recovery checks and all 57 calculation configuration menus are covered, including saved reload and four widths. Numerical/API/project tests cover 81 cases. Eight hosted checks verify the real Cloud calculation/proposal/acceptance/reload path. Live selected-index acceptance covers 36 checks; `verify-scientific-storage.py` independently round-trips a matrix through real Firestore and removes its fixture.

These results establish the implemented paths, not universal Techlog/Petrel parity or field validation of every specialist workflow. LAS cannot supply seismic, NMR spectra, core calibration or model geometry. Missing inputs/calibration remain blocked. Digitization, proprietary variants, full 3D geological editing and simulator execution are unavailable. See SCIENTIFIC_WORKSPACE.md for method boundaries and STATUS.md for exact deployed verification.
