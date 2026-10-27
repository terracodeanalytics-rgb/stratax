"""Read-only acceptance using the user's six Downloads LAS sources; never upload them."""
import gzip
import json
import sys
import tempfile
from pathlib import Path

import lasio
import numpy as np

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'backend'))
from ingestion_core import read_las
from scientific_core import evaluate

files=sorted((Path.home()/'Downloads'/'las files').glob('*.las'))
if len(files)!=6:raise RuntimeError('Expected exactly the previously agreed six Downloads LAS fixtures; inspect selection before proceeding.')
checks=[]
for source in files:
    reference=lasio.read(source)
    with tempfile.TemporaryDirectory() as scratch:
        manifests=read_las(source,Path(scratch),{})
        assert len(manifests)==1
        manifest=manifests[0];rows=[]
        for chunk in manifest['chunks']:
            with gzip.open(Path(scratch)/chunk['name'],'rt',encoding='utf-8') as file:rows.extend(json.loads(line) for line in file)
        depth=[row[0] for row in rows];curve=[row[1] for row in rows]
        np.testing.assert_allclose(np.asarray(rows,float),reference.data,equal_nan=True)
        # Integrity compares raw source values; it does not assign an engineering unit to unknown curves.
        source_unit=manifest['columns'][1]['unit']
        units=dict(depth=manifest['columns'][0]['unit'],curve=source_unit if source_unit and source_unit.lower() not in ('unknown','unconfirmed') else 'raw source values (unit unresolved)')
        result=evaluate('qc-integrity',dict(depth=depth,curve=curve),{},units)
        np.testing.assert_allclose(np.asarray(result['series']['original'],float),reference.data[:,1],equal_nan=True)
        assert not manifest.get('metadata',{}).get('coordinatesConfirmed')
        assert len({c['id'] for c in manifest['columns']})==len(manifest['columns'])
        checks.append(dict(file=source.name,rows=len(rows),columns=len(manifest['columns']),nulls=sum(v is None for row in rows for v in row),datum='unconfirmed',sourceUnmodified=True))
report=dict(passed=len(checks),fixtures=checks,uploads=0)
Path('.release/downloads-science-verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))
