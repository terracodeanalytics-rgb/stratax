# Import workflow repair, 2026-11-09

The import repair is live at https://stratax.terracodeanalytics.com. The release supports explicit native ZIP intake, source-level review, partial acceptance and correction from retained originals. Source measurements and previously accepted artifacts retain their identities.

| Failure reproduced | Repair and verification |
| --- | --- |
| Files and Continue could appear inactive, and retained review could fail to reopen | Browser diagnostics recorded control states. Import state initializes at entry, local choices survive wizard redraw, and pending review loads the current inspection. Generated ZIP reached Review, Match, Mapping and Import on the custom domain. |
| The OpenWorks ASC metadata was interpreted as measurement headers | Browser and native recipes separate MD, inclination and azimuth. TMB-07 has 89 measurement rows, zero MD decreases and zero MD repeats. Its azimuth sequence has 29 decreases and 26 repeats. |
| Browser ZIP intake exceeded its member limit for the TOMBOY seismic member | Native streaming accounted for all 27 members, including the 527.7 MiB SEG-Y with 88,621 traces. The six LAS files produced 25,423, 25,901, 25,900, 23,064, 46,951 and 41,155 rows. Wrapped LAS and duplicate curves survive. The 89 unknown measurement units remain unresolved. |
| Companion metadata and repeated names could lead to incorrect associations | Header UWIs support six distinct wells. TM0004_plan maps to TMB-03/TMB-03st and TM0007_plan to TMB-06. Workbook metadata stays separate from measurements. Two scaled survey blocks and conflicting checkshot headings remain explicit review decisions. |
| A blocked source could prevent valid data activation | Partial acceptance and linked pending correction passed with real routes, native worker and artifact writer in a local fixture. The fixture transferred its generated ZIP once. Hosted QA confirmed three active datasets and one pending dataset with zero quota reserved. |
| Project autosave could race an import-owned revision | Project saves are serialized with import tasks. Three-way reconciliation preserves unrelated edits and sends conflicting edits through recovery. Four focused reconciliation cases passed. |
| Log and map buttons in review completion lacked handlers | Both buttons now route to their respective workspaces. The log viewer action and saved dataset reload passed in the local native browser fixture. |

The isolated backend passed 41 tests. The scientific regression suite passed 186 tests. Six LAS compatibility cases, two directional and keyboard cases, four reconciliation cases and the native browser lifecycle passed. Local in-flight cancellation, injected failure, retry, quota settlement and unchanged artifact reuse are included in the isolated suite. Syntax, scientific catalog consistency and isolated release whitespace checks passed.

Hosted end-to-end acceptance used generated data on v14. The final v15 importer files were verified byte-for-byte on the custom domain. The final API candidate passed health and custom-domain CORS, and now serves 100% of traffic with the matching Ready worker. The final UI navigation and pending correction were exercised locally. Hosted TOMBOY upload and field qualification remain unverified. The actual source still requires reviewed survey-block choices, checkshot conventions, references and units.

A cancelled import can be restarted using its retained source. The same cancelled record remains terminal. If a workbook has both accepted and pending worksheets, review the follow-up selection and include only the intended pending worksheet. An exhaustive browser matrix for every recovery and workbook combination remains open.

Site v15 source is 838fff9f06746eca17874a40ad47ce6434a2214e and deployment is appgdep_6af1639bd27881918953530c9b9bcfb9. The API build is 59300583-c73d-4be2-a703-3cd417fcecb1, revision stratax-api-import-repair-1108b. The import worker build is f67f947e-c962-4ac5-bd52-1ebfca07335d. Rollback retains v14 and API stratax-api-import-repair-1108a with worker build 200a170a-a491-4725-88a6-a5ec5f0a485c.

Evidence and exact receipts are in .release/import-repair-20261108. The original ZIP SHA-256 still matches 3c1356b49b1cad6e03856973ec867cc7243d3e274463e73843ed69b34cfa7407. Hosted QA used a generated ZIP only. Cleanup removed ten one-use local helpers and retained recovery and release artifacts. Registry cleanup removed zero images. Root Git publication remains deferred.

The isolated hosted QA account and project were removed after verification, together with four project subrecords and 42 generated object generations.
