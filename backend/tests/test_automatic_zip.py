"""Automatic ZIP safety gates and model routing with generated evidence."""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from import_activation import automatic_result, automatic_selection, source_group_overlaps
from import_assist import assist
from import_bundles import classify, prepare_assets
from ingestion_core import parse


def test_activation_is_scoped_to_verified_wells_and_datasets():
    record = {
        'id': 'import', 'assets': [{'id': 'file', 'name': 'stations.csv'}],
        'datasets': [
            {'id': 'good', 'sourceId': 'file', 'family': 'deviation', 'well': 'a'},
            {'id': 'conflict', 'sourceId': 'file', 'family': 'deviation', 'well': 'b'},
            {'id': 'orphan', 'sourceId': 'file', 'family': 'deviation', 'well': 'missing'},
        ],
        'issues': [{'datasetId':'conflict', 'severity':'warning', 'code':'coordinate_evidence_conflict'}],
        'archiveEntries': [{'excluded': True, 'path': 'seismic.sgy', 'reason': 'Outside workflows'}],
    }
    project = {'project': {'workflows': ['petrophysics']}, 'workspace': {'wellDrafts': [{'id':'a'}, {'id':'b'}]}}
    selected = automatic_selection(record, project)
    assert [d['id'] for d in selected] == ['good']
    selected[0]['active'] = True
    assert automatic_result(record) == {
        'accepted': 1, 'pending': 2, 'pendingSourceIds': [],
        'skipped': [{'path':'seismic.sgy', 'reason':'Outside workflows'}], 'skippedCount': 1,
    }
    record['issues'].append({'severity':'blocking', 'code':'derived_quota'})
    assert automatic_selection(record, project) == []


@pytest.mark.parametrize('mode,reply,applies', [
    ('shadow', 'valid', False),
    ('verified', 'valid', True),
    ('verified', 'wrong_column', False),
    ('verified', 'outage', False),
])
def test_model_needs_independent_header_and_row_identity(tmp_path, monkeypatch, mode, reply, applies):
    source = tmp_path / 'unfamiliar.dat'
    source.write_text('Directional export\nUWI: QA-001\nWell,MD (m),Inclination (deg),AZIMGN (deg)\n'
                      'QA-001,0,0,0\nQA-002,0,0,0\nQA-001,10,2,5\nQA-002,10,2,6\n')
    project_wells = [{'id':'one','name':'Well 1','uwi':'QA-001'}, {'id':'two','name':'Well 2','uwi':'QA-002'}]
    data = {'mode':'automatic_zip', 'assets':[{'id':'source','name':source.name,'family':'documents',
             'archive':{'rootId':'zip','path':source.name}}],
            'options':{'perAsset':{'source':{'autoPrepare':True}}}}
    assert classify(source, content_first=True) == 'documents'
    monkeypatch.setenv('STRATAX_ZIP_ASSIST', mode)
    monkeypatch.setenv('STRATAX_ZIP_ASSIST_URL', 'https://fixture.invalid')

    def model(url, payload, timeout):
        if reply == 'outage':
            raise TimeoutError()
        assert payload['files'][0]['sample'][0]['rows'][2].startswith('Well,MD')
        return {'proposals':[{'assetId':'source','family':'deviation','headerRow':3,'evidenceRow':3,'delimiter':',',
                              'mapping':{'md':2 if reply == 'wrong_column' else 1,'inclination':2,'azimuth':3},
                              'wellId':'one','companionIds':['foreign']}]}
    monkeypatch.setattr('import_assist.request_proposals', model)
    suggestions, _ = assist(data, {'source':source}, project_wells, ['petrophysics'], lambda _:None, lambda:False)
    if reply == 'outage':
        assert suggestions == {}
    else:
        assert suggestions['source']['applied'] is applies
        assert suggestions['source']['companionIds'] == []
    if not applies:
        assert data['assets'][0]['family'] == 'documents'
        return
    assert data['assets'][0]['family'] == 'deviation'
    known = prepare_assets({'source':source}, data, project_wells)
    settings = {**data['options']['perAsset']['source'], '_knownWells':known}
    groups = parse(source, tmp_path/'derived', 'deviation', settings)
    assert {d['well'] for d in groups} == {'one','two'}
    assert all(d['rowCount'] == 2 and not d['issues'] for d in groups)


def test_followup_group_overlap_keeps_other_wells_reviewable():
    group = {'sourceId':'source', 'metadata':{'sheet':'North','rowWell':True,'well':'A'}}
    assert source_group_overlaps(group, group)
    assert not source_group_overlaps(group, {**group,'metadata':{**group['metadata'],'well':'B'}})
    assert not source_group_overlaps(group, {**group,'metadata':{**group['metadata'],'sheet':'South'}})
    assert source_group_overlaps(group, {'sourceId':'source'})


def test_filename_cannot_exclude_a_well_table(tmp_path):
    path = tmp_path/'checkshot_delivery.csv'
    path.write_text('Well,UWI\nWell A,000123\n')
    assert classify(path, content_first=True) == 'well_headers'
    assert classify(path) == 'checkshots'


def test_automatic_mode_is_flagged_and_ignores_unverified_client_mapping(monkeypatch):
    from unittest.mock import patch
    import main
    import imports_api
    from test_imports_api import setup
    database, client = setup()
    data = {'mode':'automatic_zip', 'family':'mixed',
            'files':[{'name':'bundle.zip','size':80,'family':'documents','client_id':'root'}],
            'options':{'perAsset':{'root':{'nativeArchive':True, 'well':'injected', 'mapping':{'md':3}}}}}
    try:
        with patch.object(main, '_db', database), patch.object(imports_api.firestore, 'transactional', lambda f:f):
            monkeypatch.delenv('STRATAX_AUTOMATIC_ZIP', raising=False)
            assert client.post('/api/projects/project/imports', json=data).status_code == 409
            monkeypatch.setenv('STRATAX_AUTOMATIC_ZIP', '1')
            response = client.post('/api/projects/project/imports', json=data)
            assert response.status_code == 201, response.json()
            assert response.json()['mode'] == 'automatic_zip'
            options = response.json()['options']['perAsset']['root']
            assert options['nativeArchive'] is True and 'well' not in options and 'mapping' not in options
    finally:
        main.app.dependency_overrides.pop(main.current_user, None)
