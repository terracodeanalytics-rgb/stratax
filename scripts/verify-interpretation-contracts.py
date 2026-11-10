"""Local syntax, unchanged catalog contract and batch-scoped whitespace evidence."""
import difflib
import json
from pathlib import Path
import py_compile
import subprocess
import sys

root=Path(__file__).resolve().parents[1]
evidence=root/'.release/interpretation-buttons-20261108'
sys.path.insert(0,str(root/'backend'))
from scientific_catalog import METHODS,VERSION

assert VERSION=='stratax-science/1.3'
expected='// Generated from backend/scientific_catalog.py; use scripts/generate-science-catalog.py.\nexport const version='+json.dumps(VERSION)+';\nexport const methods='+json.dumps(list(METHODS.values()),ensure_ascii=False)+';\n'
assert (root/'frontend/dist/science-methods.js').read_text(encoding='utf-8')==expected

python_files=['backend/scientific_api.py','backend/scientific_core.py','backend/scientific_worker.py','backend/tests/test_interpretation_lifecycle.py','backend/tests/interpretation_workflow_fixture.py','backend/tests/interpretation_import_fixture.py','scripts/verify-interpretation-pdf.py','scripts/serve-petrophysics-fixture.py']
js_files=['frontend/dist/project-repository.js','frontend/dist/interpretation-workspace.js','frontend/dist/petrophysics-workspace.js','frontend/dist/well-canvas.js','frontend/dist/well-canvas-model.js','frontend/dist/workflow-drafts.js','scripts/verify-well-canvas.cjs','scripts/interpretation-control-cases.cjs','scripts/interpretation-control-coverage.cjs','scripts/local-science-browser.cjs','scripts/verify-interpretation-methods.cjs','scripts/verify-interpretation-lifecycle.cjs','scripts/verify-interpretation-evidence.cjs','scripts/build-interpretation-control-matrix.cjs','scripts/verify-interpretation-cloud-copy.cjs','scripts/verify-interpretation-cloud-originals.cjs','scripts/verify-interpretation-report-rows.cjs','scripts/verify-interpretation-result-states.cjs','scripts/verify-interpretation-workflow-editing.cjs','scripts/test-interpretation-lifecycle.cjs']
for name in python_files:py_compile.compile(str(root/name),doraise=True)
for name in js_files:subprocess.run(['node','--check',str(root/name)],check=True,capture_output=True,text=True)
patches=[];violations=[]
for name in python_files+js_files:
    current=(root/name).read_text(encoding='utf-8');before=evidence/'before'/name
    if name=='backend/scientific_core.py':before=evidence/'before/scientific_core-reconstructed.py'
    original=before.read_text(encoding='utf-8') if before.exists() else ''
    changes=list(difflib.unified_diff(original.splitlines(),current.splitlines(),fromfile='before/'+name,tofile=name,lineterm=''))
    patches.extend(changes)
    for line in changes:
        if line.startswith('+') and not line.startswith('+++') and line.rstrip(' \t')!=line:violations.append(name+': '+line[:120])
    if current.endswith('\n\n') and not original.endswith('\n\n'):violations.append(name+': new blank line at EOF')
(evidence/'source-changes.patch').write_text('\n'.join(patches)+'\n',encoding='utf-8',newline='\n')
receipt=dict(catalog=VERSION,methods=len(METHODS),pythonSyntax=len(python_files),javaScriptSyntax=len(js_files),scopedWhitespaceViolations=violations,coreBaseline='Reconstructed by removing only the new output-unit block; all earlier dirty core work retained.')
(evidence/'contract-gates.json').write_text(json.dumps(receipt,indent=2)+'\n',encoding='utf-8')
assert not violations,violations
print(json.dumps(receipt))
