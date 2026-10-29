import copy
import io
import os
import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
import main,seismic_api
from scientific_api import fingerprint
from seismic_geometry import GeometryReview,header_preview
from test_seismic_store import segy_bytes
from test_seismic_api import fixture,MemoryStore


def review(version='fixed'):
    return dict(revision=0,sourceVersion=version,dimension=3,dataKind='poststack',coordinateUnit='ft',
                axisOrder='northing-easting',crs='Fixture projected CRS, no inferred EPSG',datum='Fixture vertical datum',
                elevationUnit='ft',elevationPositive='up',timeConvention='TWT',reviewed=True,notes='Independent header fixture',
                roles={k:dict(byte=b,width=w,signed=True) for k,b,w in [('midpointX',181,4),('midpointY',185,4),('coordinateScalar',71,2)]})


@pytest.mark.parametrize('endian',['big','little'])
def test_header_roles_preserve_native_units_and_explicit_axis_order(endian):
    raw=segy_bytes(endian)
    value=header_preview(io.BytesIO(raw),len(raw),GeometryReview(**review()),endian=endian,first_trace=1,trace_count=2)
    assert value['rows'][0]['raw']['midpointX']==1100
    assert value['rows'][0]['scaled']['midpointX']==110 and value['rows'][0]['scaled']['midpointY']==200
    assert value['axisOrder']=='northing-easting' and value['coordinateUnit']=='ft'
    assert not value['coordinateConversionApplied'] and not value['geometryQualifiedForProcessing']


@pytest.mark.parametrize('changes',[
    {'reviewed':False},{'crs':'unknown'},{'coordinateUnit':'degrees'},
    {'roles':{'midpointX':dict(byte=181,width=4,signed=True)}},
    {'roles':{'midpointX':dict(byte=239,width=4,signed=True)}}])
def test_geometry_review_rejects_unconfirmed_inconsistent_or_missing_roles(changes):
    with pytest.raises(ValidationError):GeometryReview(**(review()|changes))


def test_geometry_versions_conflicts_source_changes_and_owner_isolation():
    db,ds=fixture();version=fingerprint(ds)
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
    route='/api/projects/project/seismic/sources/source/geometry'
    try:
        with patch.object(main,'_db',db),patch.object(seismic_api.storage,'Client',MemoryStore),patch.object(seismic_api.firestore,'transactional',lambda f:f),patch.dict(os.environ,STRATAX_PROJECT_BUCKET='raw',STRATAX_DERIVED_BUCKET='derived'):
            client=TestClient(main.app)
            assert client.get(route).json()['review'] is None
            body=review(version)
            preview=client.post(route+'/preview?first_trace=1&trace_count=1',json=body)
            assert preview.status_code==200,preview.text
            assert preview.json()['rows'][0]['scaled']['midpointX']==110
            saved=client.put(route,json=body)
            assert saved.status_code==200,saved.text
            assert saved.json()['review']['revision']==1
            assert client.put(route,json=body).status_code==409
            body['revision']=1;body['notes']='Independent second review'
            assert client.put(route,json=body).json()['review']['revision']==2
            assert client.get(route+'?revision=1').json()['review']['notes']=='Independent header fixture'
            assert client.get(route).json()['review']['notes']=='Independent second review'
            ds['parserVersion']='changed'
            assert client.get(route).json()['stale']
            assert client.post(route+'/preview',json=body).status_code==409
            main.app.dependency_overrides[main.current_user]=lambda:dict(uid='other')
            assert client.get(route).status_code==404
    finally:main.app.dependency_overrides.clear()
