"""Regenerate the browser's dependency-free method catalog from the server contract."""
import json
import sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'backend'))
from scientific_catalog import METHODS,VERSION
(root/'frontend/dist/science-methods.js').write_text('// Generated from backend/scientific_catalog.py; use scripts/generate-science-catalog.py.\nexport const version='+json.dumps(VERSION)+';\nexport const methods='+json.dumps(list(METHODS.values()),ensure_ascii=False)+';\n',encoding='utf-8',newline='\n')
