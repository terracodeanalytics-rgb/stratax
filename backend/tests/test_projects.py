import copy
import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
import main
import projects
from policies import POLICY_VERSIONS


class Reference:
    def __init__(self, db, path):
        self.db, self.path = db, path

    def document(self, name):
        return Reference(self.db, self.path + "/" + name)

    def collection(self, name):
        return self.document(name)

    def get(self, transaction=None):
        return self

    def to_dict(self):
        return copy.deepcopy(self.db.records.get(self.path))


class Database:
    def __init__(self):
        self.records = {"stratax_legal_acceptance/owner": {"versions": POLICY_VERSIONS}, "stratax_legal_acceptance/other": {"versions": POLICY_VERSIONS}}

    def collection(self, name):
        return Reference(self, name)

    def transaction(self):
        return self

    def set(self, reference, record):
        self.records[reference.path] = copy.deepcopy(record)


def test_project_owner_revision_and_validation():
    db = Database()
    client = TestClient(main.app)
    main.app.dependency_overrides[main.current_user] = lambda: {"uid": "owner"}
    body = {"revision": 0, "project": {"name": "Real study", "storage": "cloud", "status": "Active", "workflows": ["petrophysics"], "coordinates": {"lat": 0, "lng": 0}}, "workspace": {"files": [], "configs": {"porosity": {"notes": "User entry"}}}}
    try:
        with patch.object(main, "_db", db), patch.object(projects.firestore, "transactional", lambda f: f):
            created = client.put("/api/projects/study-a", json=body)
            assert created.status_code == 200, created.text
            assert created.json()["revision"] == 1
            assert created.json()["project"]["coordinates"] == {"lat": 0, "lng": 0}
            assert client.get("/api/projects/study-a").json()["workspace"]["configs"]["porosity"]["notes"] == "User entry"
            assert client.put("/api/projects/study-a", json=body).status_code == 409
            body["revision"] = 1
            body["workspace"]["files"] = [{"id": "invented", "name": "fake.csv"}]
            assert client.put("/api/projects/study-a", json=body).json()["workspace"]["files"] == []
            body["revision"]=2
            body["workspace"]["interpretation"]={"parameters":{"matrix":[[1,2],[3,4]]}}
            assert client.put("/api/projects/study-a",json=body).status_code==200
            assert client.get("/api/projects/study-a").json()["workspace"]["interpretation"]["parameters"]["matrix"]==[[1,2],[3,4]]
            main.app.dependency_overrides[main.current_user] = lambda: {"uid": "other"}
            assert client.get("/api/projects/study-a").status_code == 404
            assert client.get("/api/projects/study-a/files/invented").status_code == 404
            main.app.dependency_overrides[main.current_user] = lambda: {"uid": "owner"}
            body["revision"] = 2
            body["project"]["coordinates"]["lat"] = 91
            assert client.put("/api/projects/study-a", json=body).status_code == 400
            body["project"]["coordinates"] = None
            body["project"]["workflows"] = []
            assert client.put("/api/projects/study-a", json=body).status_code == 400
            body["project"]["workflows"] = ["seismic"]
            body["project"]["storage"] = "local"
            assert client.put("/api/projects/study-a", json=body).status_code == 400
            db.records["stratax_legal_acceptance/owner"] = {"versions": {}}
            assert client.get("/api/projects/study-a").status_code == 403
    finally:
        main.app.dependency_overrides.clear()


def test_projects_block_anonymous_and_large_payloads():
    client = TestClient(main.app)
    assert client.get("/api/projects").status_code == 401
    assert client.get("/api/projects/test").status_code == 401
    assert client.put("/api/projects/test", json={"padding": "a" * 530000}).status_code == 413
    assert client.put("/api/projects/test", content="{}").status_code == 415


def test_location_preview_requires_review_for_contradictory_source_crs():
    db = Database()
    client = TestClient(main.app)
    main.app.dependency_overrides[main.current_user] = lambda: {"uid": "owner"}
    db.records['stratax_projects/owner/records/study-a'] = {
        'project': {'name':'Study'},
        'workspace': {'wellDrafts': [{'id':'well-a','name':'Well A','sourceCoordinates':{
            'x':481200,'y':69280,'crs':'EPSG:26391',
            'geographicCoordinates':{'lat':4.624668,'lng':6.793340}}}]}}
    payload = {'crs':'EPSG:32632','points':[{'id':'well-a','x':481200,'y':69280}]}
    try:
        with patch.object(main, '_db', db):
            result = client.post('/api/projects/study-a/locations/preview',json=payload)
            assert result.status_code == 409 and 'EPSG:26391' in result.text
            payload['crs'] = 'EPSG:26391'
            result = client.post('/api/projects/study-a/locations/preview',json=payload)
            assert result.status_code == 409 and '1 km' in result.text
            payload['acknowledge_coordinate_conflict'] = True
            result = client.post('/api/projects/study-a/locations/preview',json=payload)
            assert result.status_code == 200, result.text
            point = result.json()['points'][0]
            assert abs(point['lat'] - 4.623747763469332) < 1e-8
            assert abs(point['lng'] - 6.756528805898362) < 1e-8
            assert point['conflicts']
    finally:
        main.app.dependency_overrides.clear()


def test_stale_map_snapshot_cannot_replace_a_newer_confirmed_location():
    db = Database()
    client = TestClient(main.app)
    main.app.dependency_overrides[main.current_user] = lambda: {"uid": "owner"}
    project = {"name":"Study","storage":"cloud","status":"Active","workflows":["petrophysics"]}
    older = {"lat":0.619539,"lng":8.845051,"confirmed":True,"confirmedAt":"2026-11-09T10:18:48Z"}
    corrected = {"lat":4.616454,"lng":6.770548,"confirmed":True,"confirmedAt":"2026-11-09T10:23:51+00:00"}
    path = '/api/projects/study-a'
    db.records['stratax_projects/owner/records/study-a'] = {
        'project':project, 'revision':11, 'workspace':{'mapWorkspace':{'locations':{'well':corrected}}}}
    try:
        with patch.object(main, "_db", db), patch.object(projects.firestore, "transactional", lambda f: f):
            workspace = {'mapWorkspace':{'locations':{'well':older},'symbols':{'well':'Circle'}}}
            result = client.put(path, json={'revision':11,'project':project,'workspace':workspace})
            assert result.status_code == 200, result.text
            saved = result.json()['workspace']['mapWorkspace']
            assert saved['locations']['well'] == corrected
            assert saved['symbols']['well'] == 'Circle'
            result = client.put(path, json={'revision':12,'project':project,'workspace':{}})
            assert result.json()['workspace']['mapWorkspace']['locations']['well'] == corrected
            newer = dict(corrected, lat=4.6165, confirmedAt='2026-11-09T10:24:00Z')
            workspace['mapWorkspace']['locations']['well'] = newer
            result = client.put(path, json={'revision':13,'project':project,'workspace':workspace})
            assert result.json()['workspace']['mapWorkspace']['locations']['well'] == newer
    finally:
        main.app.dependency_overrides.clear()
