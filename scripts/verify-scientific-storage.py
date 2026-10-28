"""Round-trip nested scientific parameters against real Firestore; clean the fixture."""
import subprocess
import sys
import uuid
from pathlib import Path

from google.cloud import firestore
from google.oauth2.credentials import Credentials

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))
from scientific_api import firestore_value, restore_value

token = subprocess.check_output(["gcloud.cmd", "auth", "print-access-token"], text=True).strip()
client = firestore.Client(project="project-9afac", credentials=Credentials(token))
ref = client.collection("stratax_science_runtime").document("qa-codec-" + uuid.uuid4().hex)
fixture = {"parameters": {"matrix": [[1, 2], [3, 4]]}, "scope": {"rowRanges": [{"start": 0, "end": 9}]}}
try:
    ref.set(firestore_value(fixture))
    assert restore_value(ref.get().to_dict()) == fixture
    print("PASS: real Firestore preserves nested matrix parameters and selected rows")
finally:
    ref.delete()
    print("Isolated codec fixture removed")
