# Seismic reference qualification

These records describe scientific fixtures held in ignored `.release/seismic-fixtures/`, outside normal user projects. A downloaded field case does not close a processing, geometry or capacity gate.

## Stratton 3D land — swath 1

- Provider: Bureau of Economic Geology, Jackson School of Geosciences, University of Texas at Austin. Retain the requested acknowledgement that the data were collected and made available for worldwide education and training by the Bureau of Economic Geology at the University of Texas at Austin. [SEG distribution description](https://wiki.seg.org/wiki/Open_data).
- Raw geometry-loaded field swath: [swath_1_geometry.sgy](https://s3.amazonaws.com/open.source.geoscience/open_data/stratton/segy/navmerged/swath_1_geometry.sgy).
- Acquisition report: [stratton_acqui_proc.pdf](https://s3.amazonaws.com/open.source.geoscience/open_data/stratton/stratton_acqui_proc.pdf), 1,416,031 bytes, two scanned pages visually inspected.
- Retained source: 1,671,130,800 bytes. SHA-256 `3fa51c2609d3c2e000bd14827816976df7d0e6fdc0baaa409d1ce36f4b124808`.
- Full header scan: 136,530 traces, 3,000 samples per trace, 0.002-second declared interval, zero delay. Header index and source SHA receipt retained alongside the ignored fixture. Local SHA plus indexing elapsed 24.19 seconds; this is not a processing benchmark.
- Source text declares IBM float samples, field file ID bytes 9–12, source XY bytes 73–80, receiver XY bytes 81–88, source/receiver elevations bytes 45–48 / 41–44 and coordinate/elevation scalars bytes 71–72 / 69–70.
- **Nonstandard roles:** bytes 181–188 are receiver line/number; bytes 189–196 are source line/number. They are not reviewed midpoint coordinates or inline/crossline bins. Default header-role labels must not be accepted as survey geometry for this source.
- Source X means northing and Y means easting, with right-hand Z-down coordinates. The source text declares feet, Clarke 1866, NAD27, Texas State Plane South Zone/Lambert and false northing/easting. CRS/unit conversion remains a reviewed operation; no EPSG code was guessed.
- Auxiliary channels 996–999 are declared in bytes 25–28. They need explicit trace classification; zero coordinates must not become fabricated live positions. The swath spans field file IDs 1–262.
- Header processing history records reformatting, channel renumbering, geometry loading, padding and removal of bad/test records. This dataset is a geometry-loaded field reference, not untouched recorder certification.
- Report acquisition spacing is in feet: east–west receiver lines separated by 1,320 ft; north–south source lines separated by 880 ft; receiver/source intervals 110/220 ft. Acquisition bins 55×110 ft were interpolated after stacking to 55×55 ft interpretation bins. The report’s final processing includes zero-phase correction, Q compensation, surface-consistent deconvolution/statics, velocity analysis, stacking and 3D wave-equation migration. These are independent reference-history facts, not steps StrataX has qualified.

- Local analytical storage completed for all 409,590,000 samples, using sharded Zarr v3 float64/validity arrays and per-trace offsets/intervals/origins. Stored analytical objects total 1,629,446,510 bytes. Seventeen trace IDs distributed across the swath supplied 51,000 exact sample comparisons against the independent scalar IBM decoder. Full header indexing precedes this check; no missing samples or geometry were invented.
- An initial Windows atomic-replacement lock interrupted writing after roughly 30 million samples. The trace-boundary checkpoint remained unaccepted/incomplete; bounded retries of identical writes were added for Windows errors 5/32. Resuming completed in 180.47 seconds, with sampled peak process RSS 138,674,176 bytes at 0.25-second sampling. That duration includes source checksum and the resumed work, not the initial failed attempt; memory excludes OS file cache. The reusable command is `scripts/verify-seismic-reference.py <source> --write-analytical`.

Open: reviewed geometry/header-role resource, elevation/unit handling, trace classification, Cloud analytical indexing, gather selection, numerical field processing, comparison with the independent final image and complete hosted 2D/3D acceptance. No whole-field data was uploaded to a user workspace or used in a paid Batch run. This populated 1.67 GB source is not the required 1 TiB/10 TiB capacity test.

## Other investigated candidates

- [Poland Line 001](https://wiki.seg.org/wiki/Poland_2D_Vibroseis_Line_001): public-domain land 2D with SPS/RPS/XPS. Published FreeUSP HTTPS endpoint failed to connect both inside and outside the restricted network; no source was downloaded from that endpoint.
- [Mobil Viking Graben Line 12](https://wiki.seg.org/wiki/Mobil_AVO_viking_graben_line_12): candidate marine 2D downloaded to ignored `.release/seismic-fixtures/mobil_viking/seismic.segy` (749,552,400 bytes; SHA-256 `64cbb49796b940717c57cddf5c7e0130b56df7061009a770565bdd0978cfccf3`) via `scripts/qualify-seismic-reference.py mobil-viking-line12`. Licence text, geometry/header review and amplitude-history qualification remain open before M0.07 / M5 acceptance.
- [Penobscot](https://terranubis.com/datainfo/Penobscot): published prestack products are conditioned angle gathers and PSTM/NMO migrated gathers. They may support interpretation/QI after specific licence and amplitude-history checks; they cannot qualify raw streamer processing. The AGC stack is unsuitable as calibrated inversion input.
- [NLOG](https://www.nlog.nl/en/seismic-data): raw 3D availability can require a request and quoted fees. No provider message, request or purchase has been made.

Raw 3D streamer field acceptance and actual populated 1 TiB/10 TiB capacity acceptance remain open.
