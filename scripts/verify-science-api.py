"""Isolated Cloud scientific acceptance; generated originals only, no email/password reset."""
import json
import os
from pathlib import Path
import runpy
import secrets
import sys
import subprocess
import time
import urllib.parse

import requests

helpers=runpy.run_path(str(Path(__file__).with_name('verify-project-api.py')))
request=helpers['request'];API=helpers['API'];PROJECT=helpers['PROJECT'];SITE=helpers['SITE']


def main():
    admin=subprocess.check_output(['gcloud.cmd','auth','print-access-token'],text=True).strip()
    _,runtime=request(API+'/api/runtime-config')
    identity='https://identitytoolkit.googleapis.com/v1/'
    fixtures=[];checks=[];pid='qa-science-'+secrets.token_hex(8)
    def check(name,condition):
        if not condition:raise RuntimeError('Scientific acceptance failed: '+name)
        checks.append(name);print('PASS: '+name,flush=True)
    def account():
        address='stratax-science-'+secrets.token_hex(8)+'@example.com'
        status,link=request(identity+'projects/'+PROJECT+'/accounts:sendOobCode','POST',dict(requestType='EMAIL_SIGNIN',email=address,returnOobLink=True,continueUrl=SITE+'/#email-action',canHandleCodeInApp=True),admin,headers={'x-goog-user-project':PROJECT})
        check('Isolated identity link generated without email',status==200)
        code=urllib.parse.parse_qs(urllib.parse.urlparse(link['oobLink']).query)['oobCode'][0]
        status,user=request(identity+'accounts:signInWithEmailLink?key='+runtime['firebase']['apiKey'],'POST',dict(email=address,oobCode=code))
        check('Isolated identity verified',status==200);fixtures.append(user)
        check('Current policy acceptance stored',request(API+'/api/legal-acceptance','POST',dict(accepted=True,accepted_versions=runtime['policy_versions']),user['idToken'])[0]==200)
        return user
    def await_run(url,token):
        for _ in range(150):
            time.sleep(4);status,record=request(url,token=token)
            if status!=200:raise RuntimeError('Run status request failed: '+str(status))
            if record['status'] not in ('queued','running','cancelling'):return record
        raise RuntimeError('Scientific execution exceeded acceptance wait; inspect its retained status before retrying.')
    try:
        a,b=account(),account();token=a['idToken'];base=API+'/api/projects/'+pid
        status,project=request(base,'PUT',dict(revision=0,project=dict(name='Isolated scientific acceptance',workflows=['petrophysics','seismic'],storage='cloud',status='Active'),workspace=dict(files=[],audit=[])),token)
        check('Private Cloud project created',status==200)
        check('Anonymous scientific access blocked',request(base+'/science/capabilities')[0]==401)
        check('Other account isolated',request(base+'/science/capabilities',token=b['idToken'])[0]==404)
        status,caps=request(base+'/science/capabilities',token=token)
        check('Versioned scientific methods advertised',status==200 and len(caps['methods'])>=58)
        las=('~Version\nVERS. 2.0\nWRAP. NO\n~Well\nWELL. QA-SCIENCE\nNULL. -999.25\n~Curve\nDEPT.M\nGR.GAPI\nRHOB.G/CC\n~ASCII\n'+''.join(f'{i} {25+i/10} 2.32\n' for i in range(120))).encode()
        status,imported=request(base+'/imports','POST',dict(family='logs',files=[dict(name='science.las',size=len(las))],options=dict(references=dict(depthReference='MD',depthUnit='m'),perFile={'science.las':dict(well='QA-SCIENCE',createWell=True)})),token)
        check('Generated source reservation created',status==201);iid=imported['id'];aid=imported['assets'][0]['id'];iurl=base+'/imports/'+iid
        _,transfer=request(iurl+'/upload/'+aid,'POST',{},token)
        response=requests.put(transfer['upload_url'],data=las,headers={'Content-Type':'application/octet-stream','Content-Range':f'bytes 0-{len(las)-1}/{len(las)}'},timeout=90)
        check('Generated original retained through scoped upload',response.ok)
        check('Transfer completion verified',request(iurl+'/complete/'+aid,'POST',{},token)[0]==200)
        check('Import worker dispatched',request(iurl+'/inspect','POST',{},token)[0]==202)
        for _ in range(150):
            time.sleep(4);_,imported=request(iurl,token=token)
            if imported['status']!='inspecting':break
        check('Native import completed',imported['status']=='awaiting confirmation')
        check('Source dataset activated',request(iurl+'/commit','POST',dict(revision=imported['revision'],acknowledge_warnings=True),token)[0]==200)
        source=imported['datasets'][0]
        configuration=dict(revision=0,method='shale-linear',bindings=dict(gr=dict(datasetId=source['id'],columnId='column-1',unit='gAPI',confirmed=True)),parameters=dict(clean=0,shale=100))
        scoped='--canvas-scope' in sys.argv
        if scoped:configuration['scope']=dict(datasetId=source['id'],columnId='column-0',unit='m',reference='MD',top=10,base=19,rowRanges=[[10,12],[18,19]])
        bad=json.loads(json.dumps(configuration));bad['bindings']['gr']['confirmed']=False
        check('Unconfirmed mapping rejected',request(base+'/science/validate','POST',bad,token)[0]==400)
        check('Mapped input preflight passes',request(base+'/science/validate','POST',configuration,token)[0]==200)
        status,saved=request(base+'/science/configurations/evaluation','PUT',configuration,token)
        check('Configuration saved independently',status==200 and saved['revision']==1)
        check('Stale configuration write blocked',request(base+'/science/configurations/evaluation','PUT',configuration,token)[0]==409)
        submit=dict(configurationId='evaluation',revision=1,idempotencyKey=secrets.token_hex(16))
        status,run=request(base+'/science/runs','POST',submit,token)
        if status!=202:print(json.dumps({'start_status':status,'response':run}),flush=True)
        check('Scientific job dispatched',status==202);rid=run['id'];rurl=base+'/science/runs/'+rid
        check('Repeated submission is idempotent',request(base+'/science/runs','POST',submit,token)[1].get('id')==rid)
        check('Private dispatch fields excluded',not {'dispatch','inputSnapshots','reservation'} & set(run))
        check('Other owner cannot read calculation',request(rurl,token=b['idToken'])[0]==404)
        complete=await_run(rurl,token)
        if complete['status']!='completed':print(json.dumps({'run':complete}),flush=True)
        check('Scientific worker completed full stored dataset',complete['status']=='completed')
        status,result=request(rurl+'/result',token=token)
        check('Numerical result equals analytical expectation',status==200 and abs(result['preview']['vsh'][0]-(.26 if scoped else .25))<1e-12 and abs(result['preview']['vsh'][-1]-(.269 if scoped else .369))<1e-12)
        check('Method and source provenance retained',result['methodVersion']==caps['version'] and result['provenance']['sources'][0]['sourceSha256']==source['sourceSha256'])
        check('Original source remains unchanged',request(base+'/files/'+aid,token=token,raw=True)[1]==las)
        check('Stale result-review revision blocked',request(rurl+'/review','POST',dict(revision=1,decision='accept',comment='stale'),token)[0]==409)
        status,accepted=request(rurl+'/review','POST',dict(revision=complete['revision'],decision='accept',comment='Analytical fixture verified'),token)
        check('Independent derived dataset activated',status==200 and accepted['status']=='accepted')
        _,inventory=request(base+'/imports',token=token)
        check('Original and result datasets both retained',len(inventory['datasets'])==2 and all(d['active'] for d in inventory['datasets']))
        check('Calculation reservation released and bytes counted',inventory['quota']['reserved']==0 and inventory['quota']['used']>len(las))
        derived=next(d for d in inventory['datasets'] if d.get('scientificRunId')==rid)
        status,rows=request(base+'/science/datasets/'+derived['id']+'/rows?limit=120',token=token)
        check('Activated result chunk preview reads real stored values',status==200 and len(rows['rows'])==(5 if scoped else 120) and rows['columns'][1]['unit']=='v/v')
        if scoped:
            check('Exact brushed source depths preserved',result['preview']['depth']==[10,11,12,18,19])
            check('Activated curve carries a real index and MD reference',derived['indexColumnId']=='column-0' and derived['references']['depthReference']=='MD' and rows['columns'][0]['unit']=='m')
        check('Unsafe artifact name blocked',request(rurl+'/artifacts/secrets.txt',token=token)[0]==400)
        report=dict(api=API,passed=len(checks),checks=checks,runId=rid)
        Path('.release/canvas-api-verification.json' if scoped else '.release/science-api-verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report))
    finally:
        root=f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/'
        for user in fixtures:
            uid=user['localId'];path=f'stratax_projects/{uid}/records/{pid}'
            for collection in ('imports','datasets','import_templates','scienceConfigurations','scienceRuns','scienceReviews'):
                cursor=''
                while True:
                    _,docs=request(root+path+'/'+collection+'?pageSize=100'+('&pageToken='+urllib.parse.quote(cursor,safe='') if cursor else ''),token=admin)
                    for doc in docs.get('documents',[]):request('https://firestore.googleapis.com/v1/'+doc['name'],'DELETE',token=admin)
                    cursor=docs.get('nextPageToken','')
                    if not cursor:break
            for item in (path,f'stratax_legal_acceptance/{uid}',f'stratax_accounts/{uid}'):request(root+item,'DELETE',token=admin)
            prefix=f'owners/{uid}/projects/{pid}/'
            for bucket in ('project-9afac-stratax-raw','project-9afac-stratax-derived'):
                cursor=''
                while True:
                    _,objects=request('https://storage.googleapis.com/storage/v1/b/'+bucket+'/o?versions=true&prefix='+urllib.parse.quote(prefix,safe='')+('&pageToken='+urllib.parse.quote(cursor,safe='') if cursor else ''),token=admin)
                    for obj in objects.get('items',[]):
                        if obj['name'].startswith(prefix):request('https://storage.googleapis.com/storage/v1/b/'+bucket+'/o/'+urllib.parse.quote(obj['name'],safe='')+'?generation='+obj['generation'],'DELETE',token=admin)
                    cursor=objects.get('nextPageToken','')
                    if not cursor:break
            request(identity+'projects/'+PROJECT+'/accounts:delete','POST',dict(localId=uid),admin,headers={'x-goog-user-project':PROJECT})
        print(json.dumps(dict(isolatedAccountsCleaned=len(fixtures))))


if __name__=='__main__':main()
