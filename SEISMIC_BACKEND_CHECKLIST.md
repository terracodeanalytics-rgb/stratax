# StrataX seismic backend checklist

Updated: 2026-10-29. Deployment: API revision `stratax-api-00028-wew`.
Source checkpoint: `f21af6999bbd548c5da43fa5e31a40b15497de9a`.

☑ = backend implementation complete; testing pending.
☐ = implementation still incomplete, even if some engine code exists.

These statuses reproduce the current agreed-scope checklist. They do not establish
scientific correctness, successful live execution or field-scale capacity.

## Processing

| Ribbon item | Complete backend |
|---|:---:|
| Sources / survey selection | ☑ |
| Review header geometry | ☐ |
| Remove mean / trend | ☑ |
| Top / bottom mute | ☑ |
| Amplitude balance | ☑ |
| Spiking deconvolution | ☑ |
| Bandpass filter | ☑ |
| Anti-aliased resampling | ☑ |
| FK velocity filter — complete 2D/3D workflow | ☐ |
| Supplied-sweep correlation | ☑ |
| Apply reviewed statics | ☑ |
| Residual statics | ☐ |
| Elliptic DMO after NMO | ☐ |
| Poststack Kirchhoff migration | ☐ |
| NMO & stretch mute | ☑ |
| Weighted stack | ☑ |
| Source-signature designature | ☑ |
| Simple deghost | ☑ |
| Receiver-side deghost | ☑ |
| Debubble | ☐ |
| Swell-noise attenuation | ☐ |
| Parabolic Radon demultiple | ☐ |
| SRME subtraction — supplied model | ☑ |
| Kirchhoff PSTM | ☐ |
| Kirchhoff depth migration | ☐ |
| Residual moveout scan | ☐ |
| Validate graph | ☑ |
| Save graph | ☑ |

## Seismic engines

| Ribbon item | Complete backend |
|---|:---:|
| Well ties | ☐ |
| Velocity | ☐ |
| Attributes | ☐ |
| AVO / inversion | ☐ |
| Surfaces | ☐ |
| Models | ☐ |
| 4D | ☐ |
| Slices | ☑ |
| Cloud index — complete distributed implementation | ☐ |
| Kirchhoff | ☐ |
| SRME prediction | ☐ |
| Geostatistics | ☐ |
| Travel times | ☐ |
| Regularisation | ☐ |
| Surface statics | ☐ |
| Acoustic RTM / FWI | ☐ |

## Interpretation — Seismic mode

| Ribbon item | Complete backend |
|---|:---:|
| Sources | ☑ |
| Add section | ☑ |
| New horizon / fault — complete 2D/3D support | ☐ |
| Track section — backend execution | ☐ |
| Saved versions | ☑ |
| Review geometry | ☐ |
| Add 3D view — complete agreed support | ☐ |
| Complete interpretation / mesh export | ☐ |

The latest deployment added substantial functionality inside several unchecked
items. Those additions do not yet complete their entire agreed backend scope.
Display-only controls and frontend picking are excluded from this engine checklist.

Implementation details and remaining gaps:
[Seismic backend implementation report](SEISMIC_BACKEND_IMPLEMENTATION_2026-10-29.md).
