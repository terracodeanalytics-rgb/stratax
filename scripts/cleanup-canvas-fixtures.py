"""Dated cleanup of interrupted, generated canvas QA identities; dry-run by default."""
import json
import re
import runpy
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from google.cloud import storage
from google.oauth2.credentials import Credentials

request = runpy.run_path(str(Path(__file__).with_name('verify-project-api.py')))['request']
project = 'project-9afac'
admin = subprocess.check_output(['gcloud.cmd', 'auth', 'print-access-token'], text=True).strip()
identity = 'https://identitytoolkit.googleapis.com/v1/projects/' + project + '/'
root = 'https://firestore.googleapis.com/v1/projects/' + project + '/databases/(default)/documents/'
cutoff = datetime.fromisoformat('2026-10-28T22:17:30+00:00')
apply = '--apply' in sys.argv
client = storage.Client(project=project, credentials=Credentials(admin))
accounts = objects = 0
cursor = ''
while True:
    status, data = request(identity+'accounts:batchGet?maxResults=1000'+('&nextPageToken='+cursor if cursor else ''), token=admin, headers={'x-goog-user-project': project})
    if status != 200: raise RuntimeError('Could not inventory generated QA identities')
    for user in data.get('users', []):
        created = datetime.fromtimestamp(int(user.get('createdAt', '0'))/1000, timezone.utc)
        if not re.fullmatch(r'stratax-canvas-browser-[0-9a-f]{16}@example.com', user.get('email', '')) or created.date().isoformat() != '2026-10-28' or created > cutoff: continue
        uid = user['localId']
        status, records = request(root+'stratax_projects/'+uid+'/records', token=admin)
        if status != 200: raise RuntimeError('Could not verify QA project scope')
        if records.get('documents'): continue  # Preserve any still-present project for explicit review.
        prefix = 'owners/'+uid+'/projects/'
        for name in ('project-9afac-stratax-raw', 'project-9afac-stratax-derived'):
            blobs = list(client.list_blobs(name, prefix=prefix, versions=True))
            if any(not (b.name==prefix and b.size==0) and not re.match(re.escape(prefix)+r'qa-canvas-[0-9a-f]{16}/', b.name) for b in blobs): raise RuntimeError('Unexpected object scope; nothing further removed')
            if apply:
                for blob in blobs: blob.delete(if_generation_match=blob.generation)
            objects += len(blobs)
        if apply:
            for collection in ('stratax_legal_acceptance', 'stratax_accounts'): request(root+collection+'/'+uid, 'DELETE', token=admin)
            status, _ = request(identity+'accounts:delete', 'POST', {'localId': uid}, admin, headers={'x-goog-user-project': project})
            if status != 200: raise RuntimeError('Could not remove the isolated identity')
        accounts += 1
    cursor = data.get('nextPageToken', '')
    if not cursor: break
report = dict(applied=apply, isolated_accounts=accounts, test_object_generations=objects)
Path('.release/canvas-fixture-cleanup.json').write_text(json.dumps(report), encoding='utf-8')
print(json.dumps(report))
