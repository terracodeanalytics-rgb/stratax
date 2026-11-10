# Guided ingestion

## Matching deviation files from a ZIP

The importer matches directional surveys to well headers or LAS well identities. A directional worksheet or CSV with several wells produces separate surveys. **Map → Review pending surveys** opens the retained import when a matched survey still needs review.

## Coordinate references and placement

Cloud imports read supported coordinate declarations from LAS headers and match documented survey CRS evidence to the corresponding archive wells. Map review prefills recognized references, displays retained alternate coordinates, and flags a conflicting projection or position before saving. Use **Map → Add → Review all well coordinates** to review existing pins in one place.

## Petrophysics intake and activation - live 2026-11-09

Data opens at **Wells**, followed by **Sources** and **Import history**. Wells offers **Import ready datasets** when a retained inspection has eligible well evidence. Confirm the selection to register the wells.

Petrophysics-only projects skip checkshots and seismic. For identifiable ZIP entries, the browser builds a smaller transfer archive using the existing compressed bytes. The cloud worker also checks the source category before retaining archive members. Supporting well files keep their original bytes and paths. Checkshots are available in projects with both workflows.

## Import ready datasets - live 2026-11-09

From Cloud ZIP **Review**, select **Import ready datasets**, review the listed files and notes, and confirm. The shortcut uses the completed inspection. If you have an earlier inspected upload, open its **Review** action in **Data → Import history**. Blocked datasets and files you mark pending stay there for later resolution using the retained originals.

## Inventory and ZIP review - live 2026-11-09

In Sources, Select all and Delete all shown apply to the visible inventory. The confirmation moves the sources to recoverable Trash while keeping linked datasets accessible. In ZIP Review, expand supporting files below a well log or open the shared and unmatched groups. Review notes explain the evidence needed and whether the issue blocks activation.

On Map, select Review well locations to use retained X/Y. Enter the documented EPSG code, preview the WGS84 conversion and save the selected wells. Keep wells unplaced when the source coordinate reference is unknown.

## Automatic Cloud ZIP intake - live 2026-11-09

Cloud ZIPs use **Upload & inspect ZIP** before the Review step. The native worker retains the original, streams member expansion within the 1 GiB expanded limit, and proposes categories and associations from headers and companion metadata. Accepted datasets appear in Data and Interpretation. Locations require reviewed coordinates and references before placement.

Valid datasets can activate while other sources remain pending. Open Import history and choose **Resolve pending sources** to reuse retained bytes in a linked inspection. Survey block selections use zero-based half-open logical row ranges with source-row provenance. The release ledger records exact coverage and review limitations.

The current local source uses **Files -> Review -> Match -> Mapping -> Import**. Mixed sources retain per-asset categories, stable client IDs and independent associations, even when filenames or retained originals are identical. Cloud transfer begins after one destination/authority/settings confirmation. Inspection activates the reviewed selection automatically when its content and warnings agree; changed native content, unresolved associations and blocking issues pause for review. Imported does not mean scientifically approved.

## Reader/workflow contract v2 - local source, 2026-10-31

- `well-importer.js` provides incremental full text inspection, structured binary review, header duplicate keep/skip/merge choices, name/UWI and header/filename matching, editable mappings/curve types/units and compatible-file settings. A row skipped from registration remains in the retained original.
- Tabular identity scanning covers records beyond the first preview window and retains bounded unique identifiers. Names/UWIs stay strings, including leading zeroes. Native multi-well tables create independently associated datasets. Configurations and transfers use asset keys; legacy per-file settings remain supported.
- Petrel-style VERSION/BEGIN HEADER/END HEADER ASCII supports comments, quoted whitespace records, undefined-value declarations and explicit units/layout overrides. DLIS origins and LIS information records retain observed scalar identity metadata; conflicting observations require review.
- Header rows register stable well evidence; imported logs can reconstruct only available metadata. Coordinate coincidence never merges wells. Native and Local activation share well registration/marker relationships. Existing well IDs remain unchanged.
- Retained bytes may be reused with another association or dataset version. Existing owner isolation, quotas, storage types, ordered resumable chunks, cancellation and recovery remain authoritative. Browser reader concurrency is two and Cloud upload concurrency three.
- Timings distinguish measured reading/hash/transfer/inspection stages where available. These source changes have not been benchmarked. Existing format/materialization budgets still apply.
- See [WELL_WORKFLOW_ACCEPTANCE.md](WELL_WORKFLOW_ACCEPTANCE.md) for exact bounds and unexecuted acceptance scenarios. Historical format qualification below predates this milestone and does not qualify these changes.

## Format matrix — reader contract v1

| Exchange format | Cloud reader | Local reader / boundary |
| --- | --- | --- |
| LAS 1.2 / 2.0 | Streaming section reader, independently compared with lasio | Streaming worker |
| LAS 3.0 | Dedicated repeated `_Definition` / `_Data` sections; malformed or unsupported sections fail explicitly | Same section convention; not every vendor LAS 3 extension is certified |
| CSV / TSV / delimited or fixed-width ASCII / DEV / XYZ | Python CSV / explicit widths, header row, encoding, nulls and mappings | Streamed rows; quoted multiline CSV requires Cloud or a single-line export |
| XLSX / XLS | openpyxl / xlrd | Vendored SheetJS 0.20.3, maximum 64 MiB materialized workbook |
| DLIS RP66 v1 / LIS79 | dlisio 1.0.4; supported wrappers; logical frames and multidimensional values | Retain original; convert to LAS/CSV or use a Cloud project. Materialized frames must fit the 512 MiB native limit |
| SEG-Y / Seismic Unix | segyio 1.9.14; unstructured trace headers, coordinate scalars, bounded samples, explicit endianness/byte positions | Streamed standard trace layouts. SEG-Y 0/1 and compatible 2.x layouts; extended/vendor layouts require conversion if rejected. No claim of universal rev 2.x support |
| ZGY / SGZ | pyzgy 0.1.1 / seismic-zfp 0.5.0; headers and bounded section previews | Convert to SEG-Y/XYZ or use Cloud |
| VDS | Original retention only; no licensed compatible reader installed | Conversion required |
| IRAP binary/ASCII / ZMAP+ | XTGeo 4.27; geometry and actual values, bounded materialization | Mapped XYZ or Cloud |
| CPS-3 / GOCAD | Documented FSASCI/FSNROW/FSLIMI grids and VRTX/PVRTX/TRGL/SEG records; topology retained | Mapped XYZ or Cloud; other dialects require interchange export |
| GeoJSON / Shapefile / GeoPackage | Fiona 1.10.1; complete companion bundles and layer geometry | GeoJSON up to 32 MiB; other bundles convert or Cloud |
| KML/KMZ / GeoTIFF | Safe embedded KML geometry / rasterio 1.5.2 bounded raster previews and CRS | GeoJSON export; image metadata only for browser-supported raster images |
| RESQML EPC + HDF5 | Recognized XML objects plus explicitly selected companion HDF5 datasets; safe references only | Conversion required |
| ECLIPSE EGRID/INIT/UNRST and related unformatted records | Bounded Fortran keyword decoder: INTE/REAL/DOUB/LOGI/CHAR/Cnnn/MESS, independently compared with resfo | Conversion required; no simulation |
| GRDECL | XTGeo grid metadata; external INCLUDE paths rejected | Conversion required |
| WITSML / PRODML XML file objects | Recognized namespaces and embedded object/log rows; structural inspection, no live connection | Conversion required |
| HDF5 / JSON / XML containers | Explicit HDF5 dataset paths / JSON record path / recognized XML schema | Explicit JSON record path; otherwise conversion. Container suffix never establishes scientific meaning |
| PDF / DOCX / photographs | pypdf embedded text (128 MiB cap), safe DOCX text, Pillow metadata; no OCR | Text/image metadata; PDF/DOCX originals retained with conversion guidance |

Native array/grid readers have explicit materialization limits. A 10 GiB original can be retained even when its selected frame/grid cannot be materialized. Export smaller runs, channels or tiles in that case. Seismic originals keep complete samples; generated previews are deliberately bounded. Imported coordinates never become confirmed WGS84 map points automatically.

## Persistence and service boundaries

- Schema version 1 records: ImportSession (assets, mapping/references, issues, parser provenance, state and revision), immutable SourceAssets, activated Datasets and reusable ImportTemplates. Original curve names/duplicate identities/units stay intact; user-confirmed units are separate `effectiveUnit` values. Selected channels use `activeColumns`.
- Owner-scoped Firestore paths: `stratax_projects/{uid}/records/{project}/imports`, `datasets`, `import_templates`. Identity is derived from verified Firebase tokens and current-policy acceptance. Project revisions preserve import quota/lease fields.
- Originals: private `project-9afac-stratax-raw/owners/{uid}/projects/{pid}/originals/{asset}`. Chunked artifacts and manifests: private `project-9afac-stratax-derived/owners/{uid}/projects/{pid}/imports/{iid}/{dispatch}/{asset}`. No scientific arrays are stored inline in Firestore.
- Cloud limits: **10 GiB/source, 50 GiB/project**, including retained originals, reserved transfers and derived artifacts. Resumable sessions use exact size/generation preconditions. Completion verifies GCS size/CRC; worker records SHA-256. Session URLs are credentials: never log or publish them. Large downloads use owner-authorized five-minute signed links.
- Import API: list/create/get sessions; `upload/{asset}`, `complete/{asset}`, `configuration`, `inspect`, `preview/{dataset}`, `commit`, `cancel`. Mutation revisions prevent stale review/overwrite. Previously stored originals can be classified without another upload. Committed imports are immutable; replacements preserve old datasets.
- One on-demand Cloud Run Job, `stratax-import-worker`, 2 CPU / 4 GiB / 30 minutes / no automatic retry. One lease per project; global Firestore capacity permits two active parsers. Retry is explicit and gets an independent dispatch/artifact prefix. Per-job parsed-output budget is below its reserved ~1.1 GiB quota. Failed/cancelled artifacts count toward quota; originals remain retained.
- Local worker contents never call the Cloud parser. Folder projects write originals and chunk artifacts; explicitly linked originals retain an external dependency. UID-scoped IndexedDB stores handles/recovery copies. Permission renewal may be required. Portable packages include originals/artifacts and require explicit download; >128 MiB originals or >64 MiB artifacts require folder/Cloud storage. No silent omission.
- GCS soft-delete/versioning is operational recovery; a cancelled import does not delete completed originals. Incomplete uploads can be cancelled from history. Abandoned sessions require explicit cancellation to release reservations; no automatic expiry reaper is claimed.

## Verification and provenance

- `backend/tests/test_ingestion.py`: generated valid/malformed numeric fixtures, streaming row validation, explicit unsupported variants, unsafe archive/XML/HDF references; six Downloads LAS files are read-only local acceptance fixtures compared with lasio. They are never uploaded by tests and their unspecified datum stays unresolved.
- `backend/native_selftest.py` runs during every worker-image build. It creates numeric fixtures for native binaries/grids/GIS/model/documents and fails the build on mismatches. Valid fixture coverage is representative, not certification of every vendor dialect/version/wrapper. Expanded malformed-binary and very-large-file stress coverage remains desirable.
- `scripts/verify-ingestion-api.py`: isolated generated Cloud uploads, interrupted resume, quotas, owner isolation, actual native job/chunks/preview/commit/templates and cleanup. No SMTP email; no existing password reset.
- `scripts/verify-ingestion-ui.cjs`: Local wizard, source identity/Back state, duplicate curves, real zeros/nulls, retained unsupported binaries, persistence and responsive layouts. `scripts/verify-live-ingestion.cjs` verifies the published Cloud path and four viewport widths.
- Public binary fixtures are from Equinor/dlisio commit `59b6050ce62a029a25245a2d1fd5d0c55a88100c`, LGPL-3.0; license included in `backend/test-fixtures`. SheetJS and hash-wasm licenses are included beside the browser assets. Keep original attribution.

References: [SLB loaders](https://www.slb.com/es/products-and-services/delivering-digital-at-scale/software/techlog-wellbore-software/techlog/techlog-core-systems/techlog-base), [lasio](https://lasio.readthedocs.io/en/latest/), [dlisio](https://dlisio.readthedocs.io/en/latest/), [segyio](https://github.com/equinor/segyio), [GCS resumable protocol](https://docs.cloud.google.com/storage/docs/performing-resumable-uploads).


## Import interface refinement - 2026-10-31

The five-stage importer uses a compact progress rail, original SVG illustrations, source cards, readable field/association summaries and grouped review notes. `well-import-ui.js` renders the views; `well-import-config.js` separates physical preview reads from editable interpretation. Mapping/reference changes remain editable and do not alter original observations.

When no header file is supplied, **Create well headers from log files** is an explicit opt-in. With it unchecked, logs must match existing or uploaded-header wells; the browser and native collectors suppress synthetic registrations while retaining original header metadata. Legacy configurations without the flag retain their earlier behavior. Available values alone become well evidence; missing location/datum values remain unresolved.

Import progress reports actual original bytes during duplicate checks/transfers/local text reading, and completed asset counts during native inspection. Worker startup, retention and activation use indeterminate bars when no trustworthy denominator exists. The thumbs-up completion appears only after commitment; inspection differences still require review. Completion details group matching warning messages and retain affected-source context.

Read queues remain bounded at two browser readers and three concurrent Cloud files, with ordered resumable chunks. New Cloud originals without same-size retained candidates skip a redundant client fingerprint pass; Local text parsing computes SHA-256 in its existing byte stream. Reference/unit-only preview changes reuse raw previews, fresh resumable sessions skip an initial status request, concurrent session URLs update distinct Firestore fields, and a native dispatch reuses fingerprints for an identical retained original. These remove concrete redundant work; end-to-end speed improvements are not benchmarked.

Sources have an accessible Actions menu: Inspect, Rename, Download original, Import/reclassify and Delete. Rename updates `displayName`, preserving immutable IDs, original filename and associations. Delete moves the source to a restorable Trash filter; originals, linked datasets and retained-byte quotas remain intact. Owner-scoped `POST /api/projects/{project_id}/files/{file_id}/metadata` performs transactional metadata updates. Sources and datasets resolve stable well IDs to known well names.


### Import panel containment - 2026-10-31

The import dialog now has a definite viewport-bounded height and a wider1440px maximum. A grid keeps its heading outside the stage body; bounded flex/grid children give `.ie-content` independent scrolling while Back/Continue/Cancel remain in a non-scrolling footer. Expanded review notes and mapping accordions no longer determine the dialog's outer height. At narrow widths, the stage rail becomes a separate top row and the same content/footer containment applies. Completion views also retain an accessible content scroll area. Only CSS changed; import data/configuration contracts are unchanged.


## Live progress, related surveys and ZIP intake - 2026-10-31

Inspection polling now reports actual worker startup state, original bytes verified, rows parsed, chunks saved, validation, manifest retention and finalization. Worker counters are throttled to roughly1.5 seconds; a client timer updates elapsed time and age of the last observation without inventing work. Unknown totals remain indeterminate. Per-file lower loading bars are removed; file status text remains. Existing ownership, dispatch-token guards, cancellation and native review pauses are preserved.

Files offers **Add deviation for this well** beside a selected log. The survey stays in the same batch, inherits the log's selected stable well ID, and remains editable in Match. Conflicting identities require explicit acknowledgement or correction. Excluding/removing an owning log makes the survey require a new owner. Related-source context is stored by logical asset ID, not filename.

ZIP intake uses the pinned, integrity-verified BSD-3-Clause `@zip.js/zip.js`2.24.0 bundle inside a dedicated browser worker. The original ZIP is retained as an original-only asset, while extracted entries become separate reviewed assets. Original paths, directory scopes, CRC evidence and archive/log associations are retained in configuration and dataset metadata. ZIP passwords are transient browser/worker input and never enter project/import configuration.

Content/name/folder evidence suggests types and owners; preview column names refine uncertain classification. Uncertain types must be corrected before advancing, and ambiguous/multi-well associations remain editable. Multiple log runs resolving to the same well can share supporting evidence. Entry checkboxes control inclusion, independently of display visibility. Repeated names use independent asset IDs. Native companion discovery is scoped to original archive directories so separate folders cannot overwrite one another's companions.

Supported intake covers normal ZIP/ZIP64, nested folders/ZIPs, Unicode names and supported encrypted entries through the bundled reader. CRC/authentication, overlapping-entry and strict local-directory consistency checks remain on. Links/special entries, traversal/absolute paths, executable payloads, OS metadata and empty entries are excluded with notes. Corrupt, incomplete/multipart, unsupported compression, wrong passwords, missing/ambiguous companions and limits remain visible for correction. Password retry preserves already reviewed entries. Package formats such as XLSX/DOCX/EPC remain intact and use their existing readers.

Limits:100 assets per import, including retained originals; up to99 extracted entries for one ZIP,256 MiB per expanded member,1 GiB cumulative expanded bytes across selected ZIPs (including nested expansion),10,000 inventoried entries,8 MiB metadata, three nested ZIP levels and a two-minute read deadline. High expansion ratios require separate review. Oversized or unsupported members remain in the retained original and are listed, not represented as imported datasets. Multipart ZIPs and mixed-password nested packages may require separate extraction/re-export; closed scientific variants still require native conversion. These boundaries do not extend the scientific readers or enable disabled engines.
