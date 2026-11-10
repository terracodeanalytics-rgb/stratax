"""Retained units and scalar/array eligibility for Interpretation-page outputs."""
import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scientific_core import evaluate
from scientific_worker import write_result
from test_science import fixture


@pytest.mark.parametrize('method,outputs', [
    ('crossplot', {'x':'source units', 'y':'source units'}),
    ('fluid-indicators', {'resistivityRatio':'dimensionless', 'porositySeparation':'v/v'}),
    ('mineral-inversion', {'residual':'documented response units'}),
    ('image-normalize', {'normalized':'dimensionless'}),
    ('seismic-attributes', {'amplitude':'documented response units', 'envelope':'documented response units', 'rms':'documented response units'}),
    ('surface-interpolation', {'xAxis':'m', 'yAxis':'m', 'surface':'source units'}),
    ('property-kriging', {'xAxis':'m', 'yAxis':'m', 'mean':'source units', 'variance':'(source units)²', 'realizations':'source units'}),
    ('synthetic-seismogram', {'reflectivity':'dimensionless', 'synthetic':'dimensionless', 'wavelet':'dimensionless'}),
])
def test_interpretation_output_units_survive_artifacts(method,outputs,tmp_path):
    inputs,parameters,units=fixture(method)
    result=evaluate(method,inputs,parameters,units)
    assert {key:result['units'].get(key) for key in outputs}==outputs
    write_result(tmp_path,'owners/o/projects/p/science/r/d','run-fixture',result,{}, {})
    manifest=json.loads((tmp_path/'manifest.json').read_text())
    columns={column['mnemonic']:column for dataset in manifest['datasets'] for column in dataset['columns']}
    for key,unit in outputs.items():
        assert columns[key]['unit']==unit
        array=any(isinstance(value,list) for value in result['series'][key])
        assert (columns[key].get('valueType')=='array')==array
