"""Deploy pinned on-demand workers and API configuration; never execute jobs/tests."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

GCLOUD=shutil.which('gcloud.cmd') or shutil.which('gcloud')
PROJECT='project-9afac';REGION='us-central1'
ACCOUNT='stratax-seismic-worker@project-9afac.iam.gserviceaccount.com'
API='stratax-auth-runtime@project-9afac.iam.gserviceaccount.com'


def command(*args):
    result=subprocess.run([GCLOUD,*args],capture_output=True,text=True)
    if result.returncode: raise RuntimeError(result.stderr)
    return result.stdout


def main():
    p=argparse.ArgumentParser(description=__doc__)
    for name in ('seismic','models','acoustic','api'):p.add_argument('--'+name,required=True)
    p.add_argument('--origin',required=True);p.add_argument('--api-only',action='store_true');options=p.parse_args()
    profiles={}
    for kind in ('seismic','models','acoustic'):
        image=getattr(options,kind)
        if '@sha256:' not in image: raise ValueError('Use immutable image references.')
        job='stratax-'+kind+'-worker'
        cpu,memory,seconds=(2,4096,600) if kind=='seismic' else (4,16384,1800)
        # Cloud Run Jobs have no idle instances. Only explicit :run starts billing compute.
        if not options.api_only:
            command('run','jobs','deploy',job,'--project',PROJECT,'--region',REGION,'--image',image,
                '--service-account',ACCOUNT,'--cpu',str(cpu),'--memory',f'{memory}Mi','--tasks','1','--parallelism','1',
                '--max-retries','0','--task-timeout',f'{seconds}s',
                '--update-env-vars','GOOGLE_CLOUD_PROJECT=project-9afac,STRATAX_DERIVED_BUCKET=project-9afac-stratax-derived', '--quiet')
            for role in ('roles/run.jobsExecutorWithOverrides','roles/run.viewer'):
                command('run','jobs','add-iam-policy-binding',job,'--project',PROJECT,'--region',REGION,
                    '--member=serviceAccount:'+API,'--role='+role,'--quiet')
        profiles[kind]=dict(job=f'projects/{PROJECT}/locations/{REGION}/jobs/{job}',resources=dict(
            image=image,cpu=cpu,memoryMib=memory,maxSeconds=seconds,vcpuSecondUsd=.000018,memoryGibSecondUsd=.000002,
            priceAsOf='2026-10-29',priceSource='https://cloud.google.com/run/pricing',minInstances=0))
    values=dict(STRATAX_SEISMIC_TOOL_PROFILES=json.dumps(profiles,separators=(',',':')),
        STRATAX_SEISMIC_BATCH_PROFILE=json.dumps(profiles['seismic']['resources'],separators=(',',':')),
        STRATAX_SEISMIC_WORKER_ACCOUNT=ACCOUNT,STRATAX_SEISMIC_BATCH_ACCOUNT=ACCOUNT,
        STRATAX_SEISMIC_JOB='stratax-seismic-worker',STRATAX_SEISMIC_MAX_CONCURRENT='2',
        STRATAX_SEISMIC_REGION=REGION,STRATAX_SEISMIC_BATCH_REGION=REGION,
        STRATAX_DERIVED_BUCKET='project-9afac-stratax-derived',STRATAX_SITE_ORIGIN=options.origin,
        STRATAX_ADDITIONAL_SITE_ORIGINS='https://stratax-workbench.cometcrab258.chatgpt.site')
    flags=Path(__file__).resolve().parents[1]/'.release'/'seismic-api-deploy-flags.json'
    flags.write_text(json.dumps({'--project':PROJECT,'--region':REGION,'--image':options.api,
        '--update-env-vars':values,'--min-instances':0,'--max-instances':2,'--no-traffic':True,
        '--tag':'seismic-v2-candidate','--quiet':True}),encoding='utf-8')
    command('run','deploy','stratax-api','--flags-file',str(flags))
    result=command('run','services','describe','stratax-api','--project',PROJECT,'--region',REGION,
                   '--format=json(status.latestReadyRevisionName,status.conditions,status.traffic)')
    print(result)


if __name__=='__main__':main()
