# Indexed seismic traces and bounded 3D views

This source checkpoint extends the existing import and seismic workspaces. It is not a production deployment or complete M0–M9 acceptance.

## Exact native trace access

`seismic_import_index.py` uses the existing compressed import chunks. The first eight preview columns retain their identities; column 8 adds a trace locator containing the original byte offset, sample count, interval, delay and retained header geometry. Each chunk records its checksum and conservative inline/crossline bounds. The original SHA binds the index. The worker supplies its computed checksum; user options cannot replace it.

The indexed decoder supports its tested SEG-Y rev0/1 encodings and SU IEEE layout. Existing segyio imports remain available for newer/unsupported native headers, with an explicit warning that an indexed adapter is still needed. ZGY/SGZ import paths remain intact. Indexing uses temporary SQLite with an explicitly closed connection before scratch cleanup; it does not silently regularise geometry or sampling.

Owner-scoped routes under `/api/projects/{pid}/seismic/sources/{did}`:

- `GET /traces`: up to 512 distinct consecutive trace identities, 4,096 samples each and two million selected cells. Returns ragged records, per-trace axes and validity without padding.
- `GET /section`: the existing section contract can use exact locators. Selected sampling/origins must agree and the requested sample count must exist; incompatible selections require individual traces or a reviewed alignment operation.
- Geometry preview uses actual indexed byte offsets for variable records. Saved geometry remains an explicit declaration, not full-survey scientific qualification.

The API and processing worker verify chunk checksums, source byte support and original sampling headers. Processing estimates inspect the selected traces rather than assuming trace zero represents their sampling. Indexed Batch inputs retain the original and manifest generations/checksums. This path has loopback/API verification; actual provider commissioning and hosted acceptance remain open.

## 3D amplitude workbooks

`POST /brick` requires a retained geometry revision for the current source, declared 3D poststack observations, and reviewed inline/crossline roles matching the signed four-byte import mappings. Unstacked gathers are rejected. Duplicate bins require explicit resolution; no implicit stacking occurs. Missing bins/samples stay null with a separate validity mask. Differing sampling/origins require explicit alignment.

Requests specify inline/crossline starts, steps and counts plus a sample interval. A brick is limited to 512 bins, 500,000 cells and 1,024 samples per trace. Spatial lookup uses conservative chunk bounds and a 32 MiB expanded-index budget. Existing two-MiB manifest and five-MiB chunk read budgets apply. Layouts exceeding these budgets need the remaining partitioned survey service; these limits do not demonstrate 1 TiB/10 TiB capacity.

The Seismic ribbon has Review geometry and Add 3D view controls. A volume is stored as a workbook view with bin bounds, geometry revision, display scale and camera metadata. Amplitudes stay in transient caches. Rendering uses locally bundled vtk.js 38.0.4; it displays native inline/crossline/sample bins with nearest-neighbour sampling and transparent missing support. Camera interaction/save/reload, brick JSON export and explicit WebGL context-loss recovery are connected. Vertical scale is display-only; physical-coordinate maps, linked survey slices and 3D picking/tracking remain open.

## Renderer reproduction and notices

From the repository root in PowerShell:

```powershell
New-Item -ItemType Directory -Force .release/seismic-vtk
Copy-Item scripts/seismic-vtk-package.json .release/seismic-vtk/package.json
Copy-Item scripts/seismic-vtk-package-lock.json .release/seismic-vtk/package-lock.json
npm ci --prefix .release/seismic-vtk
node scripts/build-seismic-vtk.cjs
```

The build uses esbuild 0.25.11 and writes `frontend/dist/vendor/vtk-seismic.js`, its digest/package manifest and upstream/runtime licence notices. Runtime packages are vtk.js, fast-deep-equal, gl-matrix, seedrandom and spark-md5. Seedrandom includes its licence/attribution blocks in source; those blocks are retained in the generated notices. The bundle is 940,269 bytes with SHA-256 `e706cf1052ded5fb8f59b53ec0fc65f26cf13055c155d24ad7bab8a2b8fdcc11`. No runtime CDN is used for this renderer.

## Verification and candidate provenance

- Full backend regression: 171 passed, four Windows acoustic skips, two known optional/deprecation warnings. A subsequent focused four-test indexed-reader suite also passed, including an additional actual segyio newer-header compatibility case. No claim that a 172-test full rerun occurred.
- `node --test scripts/test-seismic-model.cjs scripts/test-account-scope.cjs`: 12 passed.
- `node scripts/verify-seismic-ui.cjs --cloud-processing`: 10 groups passed, zero page errors, zero Local-content Cloud requests. The fixture uses real API/worker computation with in-memory identity/storage/provider adapters. It verifies missing-bin native 3D rendering, camera persistence, export and forced graphics-context recovery. The rendered volume screenshot was visually inspected.
- Import image build `ef9c2438-dea6-4ab2-a0c2-6c97cab7b5b3`: 27 Linux native checks passed; digest `sha256:55317443f7ed25a68ac4d6f57b990c4c8aa0abd85e2d6a58d69f50fa3a1da0b6`.
- Seismic image build `8a4c8aaf-26d4-46da-b3d4-f9086b6bd24c`: 39 Linux tests passed; digest `sha256:cfe45af5be2359e1e0bb6c2fb324911be1323da71562e1c0f144511d8c48bdd4`.

These images are internal candidates. No production worker/profile, Site, API traffic, account/audience or quota was changed. No real Batch benchmark was submitted. Separate field cases, actual signed-in hosted acceptance, distributed/full-scale indexing and the remaining M2–M9 workflows remain open in SEISMIC_ACCEPTANCE.md.
