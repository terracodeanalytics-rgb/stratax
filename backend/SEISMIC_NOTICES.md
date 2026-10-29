# Seismic dependency notices

These adapters call unmodified upstream libraries. No library source was copied into the new application modules. The seismic dependency file is separate from the lightweight API requirements; importing the API does not import NumPy, Zarr or PyLops through these routes.

| Dependency | Pinned version | Licence / source |
| --- | --- | --- |
| Zarr Python | 3.1.3 | MIT; [versioned release files](https://pypi.org/project/zarr/3.1.3/#files), including `LICENSE.txt` |
| numcodecs | 0.17.1 | MIT plus bundled codec notices; [versioned release files](https://pypi.org/project/numcodecs/0.17.1/#files) |
| PyLops | 2.8.0 | LGPL v3; [versioned release files](https://pypi.org/project/pylops/2.8.0/#files), including `LICENSE.md` |

The inherited scientific dependencies retain their upstream notices and obligations. Preserve the complete licence directories shipped in wheels, including the numcodecs codec-specific notices. When distributing a worker image or other combined object package, include the applicable copyright/licence texts (including GPL v3 and LGPL v3 for PyLops), retain the corresponding upstream source and any modifications, and satisfy the applicable source/replacement/relinking requirements. Do not treat a separate process or container as a licence exemption. No seismic worker image has been built or distributed by this checkpoint.

Devito 4.8.23 was installed for local dependency investigation, but has no commissioned acoustic adapter or qualified compiled test in this checkpoint. It is intentionally absent from the executable seismic dependency file. GemPy, resqpy-based faulted-grid orchestration and vtk.js integration remain programme work, not delivered capabilities.
