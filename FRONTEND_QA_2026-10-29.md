# Six-LAS production frontend QA — 2026-10-29

## Scope and evidence

Tested the actual signed-in in-app browser at https://stratax-workbench.cometcrab258.chatgpt.site/#interpretation, Cloud project **TEST 1**, workbook **QA · six LAS frontend tests**. Used the six existing imports; no new LAS copies were uploaded. Browser actions used the supported CUA frontend controls, with read-only DOM inspection for plotted SVG paths and displayed provenance. No API scripts substituted for frontend actions.

Documented deployment remains Sites v15, source `f75d8450cb28a413b17a0d286ce9abb1f06092b0`, API `stratax-api-00017-saf`, science worker build `b2fcd1f5-e87b-4180-b075-a1a38e35a18d` in project-9afac/us-central1. No deployment occurred in this pass.

The prior chat's browser connection reported disabled browser use. A fresh supported in-app tab in this chat opened successfully and restored the signed-in project. The Site audience and browser permissions were not changed.

## Passed frontend observations

- Six source wells loaded: TMB-01/02/04/05/06/07, total **188,394 source rows**. Source curves retained unresolved engineering units; depth mapping used the supplied FT header. Runtime MD scope labels were retained, without establishing a datum or converting MD to TVD.
- Earlier observations carried forward from the immediately preceding test chat: all 18 initial source tracks rendered; duplicate TMB-02 GR columns stayed separate; overlay, log-axis and hide/show restoration worked.
- Earlier actual-source crossplots: TMB-02 GR/DT **22,301** valid pairs; TMB-05 CALI/CILD **23,000**; TMB-06 first two curves **46,948**; TMB-04 first two **2,022**; TMB-07 first two **24,681**; TMB-01 first two **14,809**. These are paired valid samples, not total source rows.
- This chat verified **24 tracks / 25 curve paths**, including TMB-02's two-GR overlay and all six original/proposed/difference comparison tracks for TMB-05 and TMB-06. Every inspected path was nonempty with no NaN/Infinity coordinates; complete stored samples finished loading.
- Calculation history restored across chats. Reopening completed normalization restored the exact dataset/column mappings, QA notes and endpoint parameters. Its provenance showed the source SHA-256, parser/method version and explicit column IDs.

## Actual Cloud runs submitted from the frontend

| Method / source | Rows | Input nulls | Reported changed samples | Observed outcome |
| --- | ---: | ---: | ---: | --- |
| Integrity / TMB-02 GR column-3 | 25,901 | 3,600 | 0 | Completed in prior chat; no repeat/decreasing depths |
| Smooth, window 5 / TMB-05 CALI | 23,064 | 43 | 21,117 | Completed in prior chat; full original/proposed/difference curves verified here |
| Despike, window 7 / MAD 4 / TMB-06 CALI | 46,951 | 3 | 6,792 | Completed; full comparison curves rendered; no repeat/decreasing depths |
| Interpolate, max interior gap 1 m / TMB-04 CALI | 25,900 | 23,878 | 0 | Completed; nulls remained; no repeat/decreasing depths |
| Normalize, 0–100 to 0–1 / TMB-07 GR column-2 | 41,155 | 119 | 41,036 | Completed; nulls retained; no repeat/decreasing depths |
| Shift, +1 m / TMB-01 CALI | 25,423 | 10,614 | 0 | Completed; unchanged curve values/nulls; no repeat/decreasing depths |
| Explicit splice, boundary 2,000 m / TMB-02 GR columns 3 and 4 | 25,901 | 3,600 | 0 | Completed; provenance retained both distinct columns; no repeat/decreasing depths |

Normalization endpoints and shift/splice boundaries are explicitly labelled **arbitrary software-test settings**, not geological calibration or recommended interpretation. Numeric QC inputs use `raw source values (unit unresolved)`; no gAPI/inch/other engineering units were assigned. Result panels say **Not scientifically approved**. No test result was accepted/activated as an independent downstream dataset and no source was replaced.

The runs above verify frontend submission, worker completion, displayed summaries and provenance. This pass does not independently recompute every output sample. TMB-04's large missing region was not filled; that does not validate all interpolation gap patterns. Interpolation/normalization/shift/splice used full-dataset bindings with null canvas scope; their full indexed canvas comparison path was not exercised. Full comparison rendering was exercised for smoothing/despiking. Zero splice changes is the displayed outcome for this duplicate pair, not proof of arbitrary overlap correctness.

## Blocks and limitations

- Earlier chat: unconfirmed mappings/units blocked processing. Shale Linear without clean calibration blocked with **Provide clean before calculating**.
- Here: NMR without a spectrum mapping was rejected with **Check the form fields and try again**; no NMR run appeared in calculation history. The form requires fraction-array spectrum, T2 bins and calibrated SDR coefficient. This is a missing-input block, not validation of the NMR algorithm or of every individual prerequisite message.
- LAS curves cannot supply absent seismic, NMR spectra, core calibration, pressure/model geometry or simulator cases. Those specialist workflows remain untested/blocked by actual data availability.
- Some browser click calls timed out after their action had already succeeded (dialogs closed or selection changed). Fresh UI observations established the actual state before continuing. These are automation transport symptoms; no application defect is inferred solely from them.
- The first splice submission was not observed as a new run; a separately saved, rechecked configuration was submitted successfully afterward. Root cause of the first non-submission was not established.
- No browser warning/error log entries were returned in checks during this pass. This does not replace server log or network coverage; those were not queried outside the frontend.

## Final persistence and session state

- Full browser reload restored TEST 1, both workbook tabs, the splice configuration, QA notes, explicit mappings/units and seven completed calculation-history entries. Splice provenance retained source hash, method version, separate GR column-3/column-4 and boundary 2000.
- After reload, all **24 tracks / 26 rendered path segments** were loaded and finite/nonempty; no Loading samples placeholders remained. TMB-05/TMB-06 full original/proposed/difference comparisons persisted.
- The result-review modal opened with keyboard activation. It requires a review comment and an unchecked applicability/inputs/units/warnings confirmation, and explains independent-result activation and the absence of automatic scientific approval. It was closed without recording a decision.
- Final browser warning/error log query returned zero entries. Seven runs were completed, zero failed runs appeared in history, and no calculation remained queued/running. This is seven QC method executions across six real LAS sources, not all specialist methods.
- No application code changed, no original files were modified, no credentials or audience settings were changed, and no results were scientifically approved. QA proposals/configurations are retained as review evidence in TEST 1. No deployment images or temporary shell/browser harnesses were created for this pass; no files or Cloud images were deleted. Coding-session cleanup/image pruning was not triggered by this frontend-only test pass. The in-app tab is retained for follow-up.
