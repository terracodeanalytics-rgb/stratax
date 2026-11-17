import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from import_policy import header_well_ids, missing_headers, normalize_unit
from import_activation import automatic_selection
from test_imports_api import setup
import main
import imports_api


def test_header_only_and_mixed_batches():
    header = {'id': 'header', 'family': 'well_headers', 'wellRecords': [{'id': 'well-a'}]}
    log = {'id': 'log', 'family': 'logs', 'well': 'well-a'}
    assert missing_headers([header], set()) == []
    assert missing_headers([log], set()) == [log]
    assert missing_headers([log, header], header_well_ids({}, [header])) == []
    assert missing_headers([{**log, 'well': 'other'}], {'well-a'})


def test_existing_header_evidence_is_resolved_and_inactive_headers_are_excluded():
    workspace = {'wellDrafts': [{'id': 'well-a', 'evidence': ['header']}]}
    saved = {'header': {'family': 'well_headers', 'active': True, 'wellRecords': [{'id': 'well-a'}]}}
    assert header_well_ids(workspace, resolve=saved.get) == {'well-a'}
    saved['header']['active'] = False
    assert header_well_ids(workspace, resolve=saved.get) == set()


def test_header_lookup_reads_only_the_imported_wells_and_stops_after_header():
    workspace = {'wellDrafts': [
        {'id': 'well-a', 'evidence': ['header', 'log']},
        {'id': 'other', 'evidence': ['unrelated-header']},
    ]}
    resolved = []
    def resolve(identifier):
        resolved.append(identifier)
        return {'family': 'well_headers', 'active': True, 'wellRecords': [{'id': 'well-a'}]}
    assert header_well_ids(workspace, resolve=resolve, required={'well-a'}) == {'well-a'}
    assert resolved == ['header']


def test_automatic_zip_waits_for_a_header():
    log = {'id': 'log', 'family': 'logs', 'well': 'well-a', 'sourceId': 'source'}
    record = {'assets': [{'id': 'source'}], 'datasets': [log], 'issues': []}
    project = {'project': {'workflows': ['petrophysics']}, 'workspace': {'wellDrafts': [{'id': 'well-a'}]}}
    assert automatic_selection(record, project) == []
    assert record['issues'][0]['code'] == 'well_header_required'
    record['issues'] = []
    assert automatic_selection(record, project, {'well-a'}) == [log]


def test_units_are_normalized_without_inventing_unknown_units():
    for source, expected in [('Feet', 'ft'), ('meters', 'm'), ('API', 'gAPI'), ('G/CC', 'g/cm3'), ('DEG', 'degrees')]:
        assert normalize_unit(source) == expected
    assert normalize_unit('unrecorded') is None


def test_native_parser_normalizes_columns_and_retains_null_gaps(tmp_path):
    from ingestion_core import parse
    source = tmp_path / 'logs.las'
    source.write_text('~Version\nVERS. 2.0\nWRAP. NO\n~Well\nWELL. EXAMPLE_1\nNULL. -999.25\n'
                      '~Curve\nDEPT.FT\nGR.GAPI\n~ASCII\n1000 35\n1001 -999.25\n')
    original = source.read_bytes()
    output = tmp_path / 'parsed'
    output.mkdir()
    dataset = parse(source, output, 'logs', {'mapping': {'index': 0}, 'well': 'well-a',
                    'deriveWellHeader': False, 'references': {'depthUnit': 'ft', 'depthReference': 'MD'}})[0]
    assert dataset['normalization']['format'] == 'stratax-dataset/1'
    assert dataset['columns'][0]['unit'] == 'FT'
    assert dataset['columns'][0]['effectiveUnit'] == 'ft'
    assert dataset['columns'][1]['effectiveUnit'] == 'gAPI'
    assert dataset['preview'][1][1] is None
    assert source.read_bytes() == original


def test_cloud_commit_enforces_header_for_both_accounts():
    for uid in ['owner', 'other']:
        db, client = setup()
        root = 'stratax_projects/' + uid + '/records/project'
        db.records[root] = {'project': {'id': 'project', 'workflows': ['petrophysics']},
                            'revision': 1, 'workspace': {'files': [{'id': 'source'}],
                            'wellDrafts': [{'id': 'well-a', 'evidence': ['header']}]}}
        record = {'id': 'review', 'revision': 1, 'status': 'awaiting confirmation', 'family': 'logs',
                  'assets': [{'id': 'source', 'name': 'log.las'}], 'issues': [], 'options': {},
                  'datasets': [{'id': 'log', 'family': 'logs', 'well': 'well-a', 'sourceId': 'source', 'columns': []}]}
        db.records[root + '/imports/review'] = record
        main.app.dependency_overrides[main.current_user] = lambda: {'uid': uid}
        try:
            with patch.object(main, '_db', db), patch.object(imports_api.firestore, 'transactional', lambda f: f):
                body = {'revision': 1, 'acknowledge_warnings': True}
                response = client.post('/api/projects/project/imports/review/commit', json=body)
                assert response.status_code == 400, response.text
                assert not db.records[root + '/imports/review'].get('committedAt')
                db.records[root + '/datasets/header'] = {
                    'family': 'well_headers', 'active': True, 'wellRecords': [{'id': 'well-a'}]}
                response = client.post('/api/projects/project/imports/review/commit', json=body)
                assert response.status_code == 200, response.text
                assert db.records[root + '/datasets/log']['well'] == 'well-a'
        finally:
            main.app.dependency_overrides.clear()
