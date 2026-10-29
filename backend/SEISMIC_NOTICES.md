# Seismic dependency notices

These adapters call unmodified upstream libraries. No library source was copied into the new application modules. The seismic dependency file is separate from the lightweight API requirements; importing the API does not import NumPy, Zarr or PyLops through these routes.

| Dependency | Pinned version | Licence / source |
| --- | --- | --- |
| Zarr Python | 3.1.3 | MIT; [versioned release files](https://pypi.org/project/zarr/3.1.3/#files), including `LICENSE.txt` |
| numcodecs | 0.17.1 | MIT plus bundled codec notices; [versioned release files](https://pypi.org/project/numcodecs/0.17.1/#files) |
| PyLops | 2.8.0 | LGPL v3; [versioned release files](https://pypi.org/project/pylops/2.8.0/#files), including `LICENSE.md` |
| Devito | 4.8.23 | MIT; acoustic image retains installed licence and exact upstream source distribution |
| pyrevolve | 2.2.8 | MIT; acoustic image retains installed licence and exact upstream source distribution |

The inherited scientific dependencies retain their upstream notices and obligations. Preserve the complete licence directories shipped in wheels, including the numcodecs codec-specific notices. When distributing a worker image or other combined object package, include the applicable copyright/licence texts (including GPL v3 and LGPL v3 for PyLops), retain the corresponding upstream source and any modifications, and satisfy the applicable source/replacement/relinking requirements. Do not treat a separate process or container as a licence exemption. The seismic Dockerfile retains the complete PyLops licence, GPL text and exact upstream PyLops source distribution inside the image. Installed wheels retain their bundled licence directories.

Internal Linux candidate build `544eca4b-fb00-412f-882f-2a3e4e5176b4` passed 25 numerical/storage/inversion/checkpoint tests, producing digest `sha256:45b3bf9d9384c8faf3920e03b4fc3e9f20a7b3051baa75102ff1026a6ea04ff3`. It predates subsequent source changes and is not the production release or a commissioned Batch profile. Rebuild matching sources before execution qualification.

The later seismic candidate `2fe4b07f-bc4a-4e1d-9a7b-0663a39613f7` passed 30 Linux tests, digest `sha256:102f9275a01e5843485197b07138ebd9998367bfc1b134c5d00b68555195f58b`. Subsequent local ragged-write batching/retry changes are not present in that image: rebuild before commissioning them.

The separate acoustic requirements/image add the unmodified open Devito engine. Build `fd8c0908-745b-4ae9-9dd0-aad57f12ed8e` passed four compiled genuine 2D/3D source/Born adjoint and Taylor tests using GCC/G++ 14.2.0-19, producing digest `sha256:509b6ed748bedc1f4abea56f2e2c9174071210943fc390a3eb7057d8fd622abd`. Earlier builds failed the Born adjoint because the application perturbation buffer had a halo inconsistent with the upstream operator. The application layout was corrected; tolerances were unchanged. The runtime inherits the exact seismic base digest and retains exact Devito/pyrevolve source archives. Compiler/runtime libraries retain their package notices; a distribution review remains a release gate.

This is a small CPU qualification, not commissioned Batch execution, CPU/MPI or NVIDIA OpenACC qualification, field RTM/FWI, or a production release. GemPy, resqpy-based faulted-grid orchestration and vtk.js integration remain programme work, not delivered capabilities.
