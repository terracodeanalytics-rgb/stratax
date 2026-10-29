import copy
import io
import json
import os
import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
import pytest
from fastapi.testclient import TestClient

import main
import seismic_api
from scientific_api import fingerprint
from seismic_graph import Graph, execute_graph, validate_graph
from seismic_processing import TraceBlock
from google.api_core.exceptions import NotFound
from test_scientific_api import Database, ROOT
from test_seismic_store import segy_bytes


class MemoryStore:
    def bucket(self, name):
        return self

    def blob(self, name):
        payload = segy_bytes() if name.endswith('/originals/original') else b'{"metadata":{"endian":"big"}}'

        class Blob:
            size = len(payload)
            def reload(self): pass
            def download_as_bytes(self): return payload
            def open(self, *args, **kwargs): return io.BytesIO(payload)
        return Blob()


def fixture():
    db = Database()
    db.records[ROOT]['workspace']['files'] = [dict(id='original', name='source.segy', size=len(segy_bytes()))]
    ds = db.records[ROOT+'/datasets/source']
    ds.update(family='seismic', sourceId='original', name='Source survey')
    return db, ds


def graph(ds):
    return dict(sourceId='source', sourceVersion=fingerprint(ds), domain='TWT', domainConfirmed=True,
                amplitudeUnit='recorded source amplitude', nodes=[dict(id='centre', operator='detrend', input='source', parameters={'mode':'constant'}),
                dict(id='sum', operator='stack', input='centre', parameters={})], output='sum')


def test_graph_rejects_cycles_orphans_unavailable_and_unconfirmed_inputs():
    _, ds = fixture()
    valid = graph(ds)
    nodes, digest = validate_graph(valid)
    assert [n.id for n in nodes] == ['centre', 'sum'] and len(digest) == 64
    for change in [dict(domainConfirmed=False), dict(amplitudeUnit='unknown'), dict(output='absent')]:
        with pytest.raises(ValueError):
            validate_graph(valid | change)
    bad = copy.deepcopy(valid)
    bad['nodes'][0]['input'] = 'sum'
    with pytest.raises(ValueError, match='cycles'):
        validate_graph(bad)
    bad = copy.deepcopy(valid)
    bad['nodes'][0]['operator'] = 'fwi'
    with pytest.raises(ValueError, match='not executable'):
        validate_graph(bad)
    bad = copy.deepcopy(valid)
    bad['nodes'][0]['parameters']['extra'] = True
    with pytest.raises(ValueError, match='parameters'):
        validate_graph(bad)
    bad = copy.deepcopy(valid)
    bad['nodes'][0].update(operator='bandpass', parameters=dict(low=50, high=10))
    with pytest.raises(ValueError, match='increasing'):
        validate_graph(bad)


def test_graph_executes_validated_steps_without_mutation():
    _, ds = fixture()
    source = TraceBlock([[1, 2, 3], [3, 6, 9]], .002)
    progress = []
    result, _ = execute_graph(Graph(**graph(ds)), source, progress=progress.append)
    np.testing.assert_allclose(result.samples, [[-2, 0, 2]])
    np.testing.assert_array_equal(source.samples, [[1, 2, 3], [3, 6, 9]])
    assert progress[-1]['completed'] == 2
    with pytest.raises(ValueError, match='cancelled'):
        execute_graph(graph(ds), source, cancelled=lambda:True)


def test_api_ownership_workflow_source_versions_and_pick_conflicts():
    db, ds = fixture()
    client = TestClient(main.app)
    main.app.dependency_overrides[main.current_user] = lambda: dict(uid='owner')
    try:
        with patch.object(main, '_db', db), patch.object(seismic_api.firestore, 'transactional', lambda f:f), patch.object(seismic_api.storage, 'Client', MemoryStore), patch.dict(os.environ, STRATAX_PROJECT_BUCKET='raw', STRATAX_DERIVED_BUCKET='derived'):
            resources = client.get('/api/projects/project/seismic').json()
            assert resources['sources'][0]['sourceVersion'] == fingerprint(ds)
            assert 'manifest' not in resources['sources'][0]
            caps = client.get('/api/projects/project/seismic/capabilities').json()
            assert caps['hostedGraphExecution'] is False
            body = dict(revision=0, datasetId='source', sourceVersion=fingerprint(ds), kind='horizon', label='Manual horizon', points=[dict(trace=0,sample=2,locked=True)])
            response = client.put('/api/projects/project/seismic/interpretations/top', json=body)
            assert response.status_code == 200, response.text
            assert response.json()['revision'] == 1 and response.json()['scientificApproval'] is False
            assert client.put('/api/projects/project/seismic/interpretations/top', json=body).status_code == 409
            bad = body | dict(points=[dict(trace=-1,sample=2,locked=False)])
            assert client.put('/api/projects/project/seismic/interpretations/new', json=bad).status_code == 400
            for point in [dict(trace=999, sample=0, locked=False), dict(trace=0, sample=999, locked=False)]:
                bad = body | dict(points=[point])
                rejected = client.put('/api/projects/project/seismic/interpretations/new', json=bad)
                assert rejected.status_code == 400 and rejected.json()['code'] == 'pick_bounds'
            assert client.post('/api/projects/project/seismic/graphs/validate', json=graph(ds)).json()['executionAvailable'] is False
            assistance = dict(method='bounded-section-event-correlation/v1', sourceVersion=fingerprint(ds),
                              settings=dict(event='peak', radius=4, window=5, minimumCorrelation=.8, barriers=[]),
                              seeds=[dict(trace=0, sample=2)], bounds=dict(firstTrace=0, traceCount=3, firstSample=0, sampleCount=16),
                              acceptedPicks=1, acceptedAt='2026-10-29T00:00:00Z')
            response = client.put('/api/projects/project/seismic/interpretations/tracked', json=body | dict(assistance=assistance))
            assert response.status_code == 200 and response.json()['assistance']['seeds'] == assistance['seeds']
            assistance['seeds'][0]['sample'] = 99
            assert client.put('/api/projects/project/seismic/interpretations/invalid-track', json=body | dict(assistance=assistance)).status_code == 400
            main.app.dependency_overrides[main.current_user] = lambda: dict(uid='other')
            assert client.get('/api/projects/project/seismic').status_code == 404
            assert client.put('/api/projects/project/seismic/interpretations/top', json=body).status_code == 404
            main.app.dependency_overrides[main.current_user] = lambda: dict(uid='owner')
            ds['active'] = False
            assert client.put('/api/projects/project/seismic/interpretations/new', json=body).status_code == 404
            ds['active'] = True
            db.records[ROOT]['project']['workflows'] = ['petrophysics']
            assert client.get('/api/projects/project/seismic').status_code == 400
            db.records['stratax_legal_acceptance/owner'] = {}
            assert client.get('/api/projects/project/seismic').status_code == 403
    finally:
        main.app.dependency_overrides.clear()


def test_unavailable_original_has_friendly_response_and_preserves_drafts():
    db, _ = fixture()
    main.app.dependency_overrides[main.current_user] = lambda: dict(uid='owner')
    try:
        with patch.object(main, '_db', db), patch.object(seismic_api.storage, 'Client', side_effect=NotFound('missing object')):
            result = TestClient(main.app).get('/api/projects/project/seismic/sources/source/section?trace_count=1&sample_count=1')
            assert result.status_code == 503 and result.json()['code'] == 'seismic_source_unavailable'
            assert 'missing object' not in result.text
    finally:
        main.app.dependency_overrides.clear()


def test_api_reads_original_section_not_import_preview():
    db, ds = fixture()
    raw = segy_bytes()

    class Blob:
        def __init__(self, name):
            self.name = name
            self.payload = raw if name.endswith('/originals/original') else json.dumps(dict(metadata=dict(endian='big'))).encode()
            self.size = len(self.payload)
        def reload(self): pass
        def download_as_bytes(self): return self.payload
        def open(self, *args, **kwargs): return io.BytesIO(self.payload)

    class Bucket:
        def blob(self, name): return Blob(name)

    class Store:
        def bucket(self, name): return Bucket()

    main.app.dependency_overrides[main.current_user] = lambda: dict(uid='owner')
    try:
        with patch.object(main,'_db',db), patch.object(seismic_api.storage,'Client',Store), patch.dict(os.environ,STRATAX_PROJECT_BUCKET='raw',STRATAX_DERIVED_BUCKET='derived'):
            client = TestClient(main.app)
            response = client.get('/api/projects/project/seismic/sources/source/section?trace_count=2&sample_count=4&first_sample=3')
            assert response.status_code == 200, response.text
            assert response.json()['samples'] == [[3,4,5,6],[103,104,105,106]]
            assert response.json()['sourceVersion'] == fingerprint(ds)
            assert response.json()['analytical'] is True
            assert client.get('/api/projects/project/seismic/sources/source/section?trace_count=99999').status_code == 400
            db.records[ROOT]['workspace']['files'][0]['name'] = 'survey.zgy'
            assert client.get('/api/projects/project/seismic/sources/source/section').json()['code'] == 'indexed_adapter_required'
    finally:
        main.app.dependency_overrides.clear()
