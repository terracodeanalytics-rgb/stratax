"""Provision only the approved StrataX parser job, scoped identities and bucket CORS."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

PROJECT="project-9afac"
WORKER="stratax-import-worker@project-9afac.iam.gserviceaccount.com"
API="stratax-auth-runtime@project-9afac.iam.gserviceaccount.com"
GCLOUD=shutil.which("gcloud.cmd") or shutil.which("gcloud")


def run(*args, allow_missing=False):
    result=subprocess.run([GCLOUD,*args],capture_output=True,text=True)
    if result.returncode:
        if allow_missing and 'NOT_FOUND' in result.stderr:
            return None
        raise RuntimeError(result.stderr)
    return result.stdout


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--image',required=True);args=parser.parse_args()
    if not args.image.startswith('us-central1-docker.pkg.dev/project-9afac/stratax/stratax-import-worker:'):
        raise ValueError('Use an immutable build tag from the StrataX parser image package.')
    if run('iam','service-accounts','describe',WORKER,'--project',PROJECT,allow_missing=True) is None:
        run('iam','service-accounts','create','stratax-import-worker','--project',PROJECT,'--display-name=StrataX scientific import worker')
    run('projects','add-iam-policy-binding',PROJECT,'--member=serviceAccount:'+WORKER,'--role=roles/datastore.user','--condition=None','--quiet')
    for bucket,identity,role in [('project-9afac-stratax-raw',WORKER,'roles/storage.objectViewer'),('project-9afac-stratax-derived',WORKER,'roles/storage.objectUser'),('project-9afac-stratax-derived',API,'roles/storage.objectViewer')]:
        run('storage','buckets','add-iam-policy-binding','gs://'+bucket,'--member=serviceAccount:'+identity,'--role='+role)
    bucket=json.loads(run('storage','buckets','describe','gs://project-9afac-stratax-raw','--format=json'))
    cors=bucket.get('cors_config',[])
    origin='https://stratax-workbench.cometcrab258.chatgpt.site'
    cors=[c for c in cors if origin not in c.get('origin',[])]
    cors.append({'origin':[origin],'method':['GET','HEAD','PUT','POST','OPTIONS'],'responseHeader':['Content-Type','Content-Range','Range','Location','X-Goog-Hash','X-Goog-Generation'],'maxAgeSeconds':3600})
    path=Path('.release/stratax-resumable-cors.json');path.parent.mkdir(exist_ok=True);path.write_text(json.dumps(cors))
    run('storage','buckets','update','gs://project-9afac-stratax-raw','--cors-file='+str(path.resolve()))
    exists=run('run','jobs','describe','stratax-import-worker','--project',PROJECT,'--region=us-central1',allow_missing=True)
    if exists is not None:
        run('run','jobs','update','stratax-import-worker','--project',PROJECT,'--region=us-central1','--image='+args.image,'--quiet')
    else:
        run('run','jobs','deploy','stratax-import-worker','--project',PROJECT,'--region=us-central1','--image='+args.image,'--service-account='+WORKER,'--cpu=2','--memory=4Gi','--tasks=1','--parallelism=1','--max-retries=0','--task-timeout=1800s','--set-env-vars=GOOGLE_CLOUD_PROJECT=project-9afac,STRATAX_PROJECT_BUCKET=project-9afac-stratax-raw,STRATAX_DERIVED_BUCKET=project-9afac-stratax-derived','--add-volume=name=raw,type=cloud-storage,bucket=project-9afac-stratax-raw,readonly=true','--add-volume-mount=volume=raw,mount-path=/raw','--add-volume=name=derived,type=cloud-storage,bucket=project-9afac-stratax-derived','--add-volume-mount=volume=derived,mount-path=/derived','--quiet')
    run('run','jobs','add-iam-policy-binding','stratax-import-worker','--project',PROJECT,'--region=us-central1','--member=serviceAccount:'+API,'--role=roles/run.jobsExecutorWithOverrides')
    run('run','jobs','add-iam-policy-binding','stratax-import-worker','--project',PROJECT,'--region=us-central1','--member=serviceAccount:'+API,'--role=roles/run.viewer')
    print('Configured only the StrataX parser job, worker identity, bucket grants and resumable CORS.')


if __name__=='__main__':main()
