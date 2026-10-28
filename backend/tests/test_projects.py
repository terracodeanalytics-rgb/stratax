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
