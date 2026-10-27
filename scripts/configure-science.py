"""Provision only the approved StrataX scientific job and its scoped identity."""
import argparse
import shutil
import subprocess

PROJECT="project-9afac"
WORKER="stratax-science-worker@project-9afac.iam.gserviceaccount.com"
API="stratax-auth-runtime@project-9afac.iam.gserviceaccount.com"
GCLOUD=shutil.which("gcloud.cmd") or shutil.which("gcloud")


def run(*args,allow_missing=False):
    r=subprocess.run([GCLOUD,*args],capture_output=True,text=True)
    if r.returncode:
        if allow_missing and ("NOT_FOUND" in r.stderr or "Cannot find job" in r.stderr):return None
        raise RuntimeError(r.stderr)
    return r.stdout


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--image',required=True);args=parser.parse_args()
    if not args.image.startswith('us-central1-docker.pkg.dev/project-9afac/stratax/stratax-science-worker:'):
        raise ValueError('Use an immutable StrataX scientific build tag.')
    if run('iam','service-accounts','describe',WORKER,'--project',PROJECT,allow_missing=True) is None:
        run('iam','service-accounts','create','stratax-science-worker','--project',PROJECT,'--display-name=StrataX bounded scientific processing')
    run('projects','add-iam-policy-binding',PROJECT,'--member=serviceAccount:'+WORKER,'--role=roles/datastore.user','--condition=None','--quiet')
    run('storage','buckets','add-iam-policy-binding','gs://project-9afac-stratax-raw','--member=serviceAccount:'+WORKER,'--role=roles/storage.objectViewer')
    run('storage','buckets','add-iam-policy-binding','gs://project-9afac-stratax-derived','--member=serviceAccount:'+WORKER,'--role=roles/storage.objectUser')
    exists=run('run','jobs','describe','stratax-science-worker','--project',PROJECT,'--region=us-central1',allow_missing=True)
    command='deploy' if exists is None else 'update'
    flags=['--project',PROJECT,'--region=us-central1','--image='+args.image,'--service-account='+WORKER,'--cpu=2','--memory=4Gi','--tasks=1','--parallelism=1','--max-retries=0','--task-timeout=1800s','--set-env-vars=GOOGLE_CLOUD_PROJECT=project-9afac,STRATAX_PROJECT_BUCKET=project-9afac-stratax-raw,STRATAX_DERIVED_BUCKET=project-9afac-stratax-derived']
    if exists is None:flags+=['--add-volume=name=raw,type=cloud-storage,bucket=project-9afac-stratax-raw,readonly=true','--add-volume-mount=volume=raw,mount-path=/raw','--add-volume=name=derived,type=cloud-storage,bucket=project-9afac-stratax-derived','--add-volume-mount=volume=derived,mount-path=/derived']
    run('run','jobs',command,'stratax-science-worker',*flags,'--quiet')
    for role in ('roles/run.jobsExecutorWithOverrides','roles/run.viewer'):
        run('run','jobs','add-iam-policy-binding','stratax-science-worker','--project',PROJECT,'--region=us-central1','--member=serviceAccount:'+API,'--role='+role)
    print('Configured only the StrataX scientific job, worker identity and scoped bucket/job permissions.')


if __name__=='__main__':main()
