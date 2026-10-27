"""Configure only StrataX storage/Maps; keep key material on stdin/in memory."""
import json
import shutil
import subprocess

GCLOUD = shutil.which("gcloud.cmd") or shutil.which("gcloud")
PROJECT = "project-9afac"
SA = "stratax-auth-runtime@project-9afac.iam.gserviceaccount.com"


def run(*args, data=None):
    result = subprocess.run([GCLOUD, *args], input=data, capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(f"Cloud configuration failed: {args[0:3]} (exit {result.returncode})")
    return result.stdout


key = json.loads(run("services", "api-keys", "get-key-string", "7aa86d2e-0a81-4084-b9f6-79a80c587028", "--project", PROJECT, "--format=json"))["keyString"]
names = run("secrets", "list", "--project", PROJECT, "--filter=name:stratax-maps-api-key", "--format=value(name)")
if "stratax-maps-api-key" not in names:
    run("secrets", "create", "stratax-maps-api-key", "--project", PROJECT, "--replication-policy=automatic", "--data-file=-", data=key)
else:
    run("secrets", "versions", "add", "stratax-maps-api-key", "--project", PROJECT, "--data-file=-", data=key)
run("secrets", "add-iam-policy-binding", "stratax-maps-api-key", "--project", PROJECT, f"--member=serviceAccount:{SA}", "--role=roles/secretmanager.secretAccessor")
run("storage", "buckets", "add-iam-policy-binding", "gs://project-9afac-stratax-raw", f"--member=serviceAccount:{SA}", "--role=roles/storage.objectUser")
print("Configured StrataX-only Maps secret access and private raw-bucket access.")
