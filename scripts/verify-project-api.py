"""Live isolated project API checks. Never sends email or resets an existing account."""
import json
import os
from pathlib import Path
import secrets
import subprocess
import urllib.error
import urllib.parse
import urllib.request

API = os.environ.get("STRATAX_QA_API", "https://stratax-api-227436363119.us-central1.run.app")
PROJECT = "project-9afac"
SITE = "https://stratax-workbench.cometcrab258.chatgpt.site"


def request(url, method="GET", data=None, token=None, raw=False, headers=None):
    h = dict(headers or {})
    if token:
        h["Authorization"] = "Bearer " + token
    if data is not None and not raw:
        data = json.dumps(data).encode()
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, method=method, data=data, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=90) as response:
            body = response.read()
            return response.status, body if raw else json.loads(body) if body else {}
    except urllib.error.HTTPError as error:
        body = error.read()
        return error.code, body if raw else json.loads(body) if body else {}


def main():
    admin = subprocess.check_output(["gcloud.cmd", "auth", "print-access-token"], text=True).strip()
    _, config = request(API + "/api/runtime-config")
    key = config["firebase"]["apiKey"]
    fixtures, checks, project_id = [], [], "qa-" + secrets.token_hex(10)
    source_id = "source-" + secrets.token_hex(8)
    identity = "https://identitytoolkit.googleapis.com/v1/"

    def check(name, passed):
        if not passed:
            raise RuntimeError("Project API check failed: " + name)
        checks.append(name)

    def fixture():
        address = "stratax-project-qa-" + secrets.token_hex(8) + "@example.com"
        status, link = request(identity + "projects/" + PROJECT + "/accounts:sendOobCode", "POST", {"requestType": "EMAIL_SIGNIN", "email": address, "returnOobLink": True, "continueUrl": SITE + "/#email-action", "canHandleCodeInApp": True}, admin, headers={"x-goog-user-project": PROJECT})
        check("Generate isolated account", status == 200)
        code = urllib.parse.parse_qs(urllib.parse.urlparse(link["oobLink"]).query)["oobCode"][0]
        status, signed = request(identity + "accounts:signInWithEmailLink?key=" + key, "POST", {"email": address, "oobCode": code})
        check("Verify isolated identity", status == 200)
        fixtures.append(signed)
        return signed

    try:
        a, b = fixture(), fixture()
        token = a["idToken"]
        check("Anonymous projects blocked", request(API + "/api/projects")[0] == 401)
        check("Policies required", request(API + "/api/projects", token=token)[0] == 403)
        for user in (a, b):
            check("Accept current policies", request(API + "/api/legal-acceptance", "POST", {"accepted": True, "accepted_versions": config["policy_versions"]}, user["idToken"])[0] == 200)
        project = {"name": "Isolated storage verification", "workflows": ["petrophysics", "seismic"], "storage": "cloud", "status": "Active", "coordinates": {"lat": 0, "lng": 0}, "createdAt": "2026-10-27T00:00:00Z", "updatedAt": "2026-10-27T00:00:00Z"}
        url = API + "/api/projects/" + project_id
        body = {"revision": 0, "project": project, "workspace": {"files": [], "configs": {}, "audit": []}}
        status, created = request(url, "PUT", body, token)
        check("Create cloud project", status == 200 and created.get("revision") == 1)
        check("WGS84 zero coordinates retained", request(url, token=token)[1]["project"]["coordinates"] == {"lat": 0, "lng": 0})
        check("Other owner cannot read", request(url, token=b["idToken"])[0] == 404)
        check("Other owner cannot overwrite", request(url, "PUT", {**body, "revision": 1}, b["idToken"])[0] == 409)
        check("Stale revision rejected", request(url, "PUT", body, token)[0] == 409)
        source = b"depth,value\n1,2\n"
        status, uploaded = request(url + "/files/" + source_id, "PUT", source, token, raw=True, headers={"Content-Type": "application/octet-stream", "X-File-Name": "qa-source.csv"})
        check("Original file upload", status == 200)
        check("Original download integrity", request(url + "/files/" + source_id, token=token, raw=True)[1] == source)
        check("Other owner cannot download", request(url + "/files/" + source_id, token=b["idToken"], raw=True)[0] == 404)
        listing = request(API + "/api/projects", token=token)[1]
        check("Cloud list reports real sources", any(p["id"] == project_id and p.get("sourceCount") == 1 for p in listing["projects"]))
        status, current = request(url, token=token)
        body = {"revision": current["revision"], "project": {**project, "status": "Archived"}, "workspace": current["workspace"]}
        status, updated = request(url, "PUT", body, token)
        check("Archive retains originals", status == 200 and len(updated["workspace"]["files"]) == 1)
        check("Path-like file name rejected", request(url + "/files/invalidname", "PUT", source, token, raw=True, headers={"Content-Type": "application/octet-stream", "X-File-Name": "../escape"})[0] == 400)
        check("Empty upload rejected", request(url + "/files/empty", "PUT", b"", token, raw=True, headers={"Content-Type": "application/octet-stream", "X-File-Name": "empty.csv"})[0] == 400)
        report = {"api": API, "passed": len(checks), "checks": checks}
        Path(".release/project-api-verification.json").write_text(json.dumps(report, indent=2))
        print(json.dumps(report))
    finally:
        for user in fixtures:
            uid = user["localId"]
            firestore = f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/"
            for path in (f"stratax_projects/{uid}/records/{project_id}", f"stratax_legal_acceptance/{uid}"):
                request(firestore + path, "DELETE", token=admin)
            object_name = f"owners/{uid}/projects/{project_id}/originals/{source_id}"
            prefix = urllib.parse.quote(object_name, safe="")
            _, objects = request("https://storage.googleapis.com/storage/v1/b/project-9afac-stratax-raw/o?versions=true&prefix=" + prefix, token=admin)
            for obj in objects.get("items", []):
                if obj["name"] == object_name:
                    request("https://storage.googleapis.com/storage/v1/b/project-9afac-stratax-raw/o/" + prefix + "?generation=" + obj["generation"], "DELETE", token=admin)
            request(identity + "projects/" + PROJECT + "/accounts:delete", "POST", {"localId": uid}, admin, headers={"x-goog-user-project": PROJECT})
        print(json.dumps({"isolated_accounts_removed": len(fixtures), "fixture_project_id": project_id}))


if __name__ == "__main__":
    main()
