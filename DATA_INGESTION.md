# Guided ingestion

The Data page uses Type → Files → Identity → Mapping → Review → Import. Source selection, header previews and SHA-256 checks run on the device. Cloud transfer begins only after the explicit destination/authority confirmation. A second confirmation activates inspected datasets. Ready means imported, not scientifically approved.

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
