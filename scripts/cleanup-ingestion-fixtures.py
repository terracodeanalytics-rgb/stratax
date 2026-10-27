"""Remove only isolated ingestion QA fixtures from this dated acceptance run."""
import json
import re
import runpy
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from google.cloud import storage
from google.oauth2.credentials import Credentials

helpers=runpy.run_path(str(Path(__file__).with_name('verify-project-api.py')))
request=helpers['request'];project='project-9afac'
admin=subprocess.check_output(['gcloud.cmd','auth','print-access-token'],text=True).strip()
identity='https://identitytoolkit.googleapis.com/v1/projects/'+project+'/'
root='https://firestore.googleapis.com/v1/projects/'+project+'/databases/(default)/documents/'
users=[];cursor=''
while True:
    status,data=request(identity+'accounts:batchGet?maxResults=1000'+('&nextPageToken='+cursor if cursor else ''),token=admin,headers={'x-goog-user-project':project})
    if status!=200:raise RuntimeError('Could not inventory isolated accounts')
    users.extend(data.get('users',[]));cursor=data.get('nextPageToken','')
    if not cursor:break
client=storage.Client(project=project,credentials=Credentials(admin))
removed=objects_removed=0
for user in users:
    if not re.fullmatch(r'stratax-ingest-[0-9a-f]{16}@example.com',user.get('email','')):continue
    if datetime.fromtimestamp(int(user.get('createdAt','0'))/1000,timezone.utc).date().isoformat()!='2026-10-27':continue
    uid=user['localId'];status,records=request(root+'stratax_projects/'+uid+'/records',token=admin)
    projects=records.get('documents',[])
    if any(not d['name'].rsplit('/',1)[1].startswith('qa-ingest-') or d.get('fields',{}).get('project',{}).get('mapValue',{}).get('fields',{}).get('name',{}).get('stringValue')!='Isolated ingestion acceptance' for d in projects):continue
    for record in projects:
        pid=record['name'].rsplit('/',1)[1];base=root+'stratax_projects/'+uid+'/records/'+pid
        for collection in ['imports','datasets','import_templates']:
            _,entries=request(base+'/'+collection,token=admin)
            for entry in entries.get('documents',[]):request('https://firestore.googleapis.com/v1/'+entry['name'],'DELETE',token=admin)
        request(base,'DELETE',token=admin)
        prefix='owners/'+uid+'/projects/'+pid+'/'
        for name in ['project-9afac-stratax-raw','project-9afac-stratax-derived']:
            bucket=client.bucket(name);blobs=list(client.list_blobs(bucket,prefix=prefix,versions=True))
            if any(not blob.name.startswith(prefix) for blob in blobs):raise RuntimeError('Unsafe cleanup scope')
            if blobs:
                with client.batch():
                    for blob in blobs:blob.delete(if_generation_match=blob.generation)
                objects_removed+=len(blobs)
    for collection in ['stratax_legal_acceptance','stratax_accounts']:request(root+collection+'/'+uid,'DELETE',token=admin)
    status,_=request(identity+'accounts:delete','POST',{'localId':uid},admin,headers={'x-goog-user-project':project})
    if status!=200:raise RuntimeError('Could not delete isolated account')
    removed+=1
report={'isolated_accounts_removed':removed,'test_object_generations_removed':objects_removed}
Path('.release/ingestion-fixture-cleanup.json').write_text(json.dumps(report));print(json.dumps(report))
