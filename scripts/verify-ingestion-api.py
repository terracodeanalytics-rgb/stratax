"""Isolated live ingestion acceptance. Generated sources only; never sends mail."""
import json
import os
from pathlib import Path
import runpy
import secrets
import subprocess
import time
import urllib.parse
import requests

helpers=runpy.run_path(str(Path(__file__).with_name('verify-project-api.py')))
request=helpers['request'];API=helpers['API'];PROJECT=helpers['PROJECT'];SITE=helpers['SITE']


def main():
    admin=subprocess.check_output(['gcloud.cmd','auth','print-access-token'],text=True).strip()
    _,config=request(API+'/api/runtime-config')
    identity='https://identitytoolkit.googleapis.com/v1/'
    fixtures=[];checks=[];pid='qa-ingest-'+secrets.token_hex(8)
    def check(name,condition):
        if not condition:raise RuntimeError('Ingestion acceptance failed: '+name)
        checks.append(name);print('PASS: '+name,flush=True)
    def account():
        email='stratax-ingest-'+secrets.token_hex(8)+'@example.com'
        status,link=request(identity+'projects/'+PROJECT+'/accounts:sendOobCode','POST',{'requestType':'EMAIL_SIGNIN','email':email,'returnOobLink':True,'continueUrl':SITE+'/#email-action','canHandleCodeInApp':True},admin,headers={'x-goog-user-project':PROJECT})
        check('Isolated account link generated without email',status==200)
        code=urllib.parse.parse_qs(urllib.parse.urlparse(link['oobLink']).query)['oobCode'][0]
        status,user=request(identity+'accounts:signInWithEmailLink?key='+config['firebase']['apiKey'],'POST',{'email':email,'oobCode':code})
        check('Isolated identity verified',status==200);fixtures.append(user)
        check('Current policies recorded',request(API+'/api/legal-acceptance','POST',{'accepted':True,'accepted_versions':config['policy_versions']},user['idToken'])[0]==200)
        return user
    try:
        a,b=account(),account();token=a['idToken'];base=API+'/api/projects/'+pid
        project={'name':'Isolated ingestion acceptance','workflows':['petrophysics','seismic'],'storage':'cloud','status':'Active'}
        check('Cloud project created',request(base,'PUT',{'revision':0,'project':project,'workspace':{'files':[],'audit':[]}},token)[0]==200)
        check('Anonymous import blocked',request(base+'/imports')[0]==401)
        check('Other owner isolated',request(base+'/imports',token=b['idToken'])[0]==404)
        las=('~Version\nVERS. 2.0 : version\nWRAP. NO : wrap\n~Well\nWELL. QA-WELL : well\nNULL. -999.25 : null\n~Curve\nDEPT.M : depth\nGR.UNKNOWN : gamma\nGR.GAPI : repeated\n~ASCII\n'+''.join(f'{i/2} {i%100} -999.25\n' for i in range(160000))).encode()
        status,record=request(base+'/imports','POST',{'family':'logs','files':[{'name':'numeric.las','size':len(las)}],'options':{'references':{'depthReference':'MD','depthUnit':'m'},'perFile':{'numeric.las':{'well':'QA-WELL','createWell':True}}}},token)
        check('Source quota reserved',status==201);iid=record['id'];aid=record['assets'][0]['id'];url=base+'/imports/'+iid
        check('Upload URL owner isolation',request(url+'/upload/'+aid,'POST',{},b['idToken'])[0]==404)
        status,transfer=request(url+'/upload/'+aid,'POST',{},token);check('Scoped resumable transfer created',status==200)
        upload=transfer['upload_url'];boundary=1024*1024
        response=requests.put(upload,data=las[:boundary],headers={'Content-Type':'application/octet-stream','Content-Range':f'bytes 0-{boundary-1}/{len(las)}'},timeout=90)
        check('Partial source accepted without completion',response.status_code==308)
        check('Incomplete source cannot activate',request(url+'/complete/'+aid,'POST',{},token)[0]==409)
        probe=requests.put(upload,data=b'',headers={'Content-Range':f'bytes */{len(las)}'},timeout=30)
        check('Interrupted transfer exposes resumable offset',probe.status_code==308 and probe.headers.get('Range')==f'bytes=0-{boundary-1}')
        response=requests.put(upload,data=las[boundary:],headers={'Content-Type':'application/octet-stream','Content-Range':f'bytes {boundary}-{len(las)-1}/{len(las)}'},timeout=90)
        check('Resumed transfer completes',response.status_code in (200,201))
        status,stored=request(url+'/complete/'+aid,'POST',{},token);check('Completed size/checksum recorded',status==200)
        check('Completion is idempotent',request(url+'/complete/'+aid,'POST',{},token)[0]==200)
        status,link=request(base+'/files/'+aid+'/download-link',token=token)
        check('Signed original download integrity',status==200 and requests.get(link['url'],timeout=90).content==las)
        check('Native worker dispatched',request(url+'/inspect','POST',{},token)[0]==202)
        retries=0
        for _ in range(120):
            time.sleep(4);_,record=request(url,token=token)
            if record['status']=='failed' and retries<2:
                retries+=1;check('Retry failed Cloud execution '+str(retries),request(url+'/inspect','POST',{},token)[0]==202);continue
            if record['status']!='inspecting':break
        check('Native inspection finished',record['status']=='awaiting confirmation' and len(record.get('datasets',[]))==1)
        dataset=record['datasets'][0];status,preview=request(url+'/preview/'+dataset['id'],token=token)
        print(json.dumps({'preview_status':status,'rows':preview.get('rowCount'),'chunks':len(preview.get('chunks',[])),'first_row':preview.get('preview',[None])[0],'error_code':preview.get('code')}),flush=True);check('All numeric rows/chunks preserved',status==200 and preview['rowCount']==160000 and len(preview['chunks'])==32 and preview['preview'][0]==[0,0,None])
        check('Duplicate curve identities retained',preview['columns'][1]['mnemonic']==preview['columns'][2]['mnemonic'] and preview['columns'][1]['id']!=preview['columns'][2]['id'])
        check('Source datum remains unconfirmed',preview['metadata'].get('coordinatesConfirmed') is not True)
        check('Stale review rejected',request(url+'/commit','POST',{'revision':1,'acknowledge_warnings':True},token)[0]==409)
        check('Warnings require acknowledgement',request(url+'/commit','POST',{'revision':record['revision']},token)[0]==400)
        status,committed=request(url+'/commit','POST',{'revision':record['revision'],'acknowledge_warnings':True,'selected_dataset_ids':[dataset['id']],'selected_columns':{dataset['id']:['column-0','column-1']},'template_name':'QA logs'},token)
        check('Reviewed selected channels committed',status==200)
        _,listing=request(base+'/imports',token=token)
        check('Persistent inventory/template visible',len(listing['datasets'])==1 and listing['datasets'][0]['activeColumns']==['column-0','column-1'] and len(listing['templates'])==1)
        check('Derived reservation released',listing['quota']['reserved']==0 and listing['quota']['used']>len(las))
        _,current=request(base,token=token);check('Explicit well registration persisted',current['workspace']['wellDrafts'][0]['id']=='QA-WELL')
        check('Committed import immutable',request(url+'/configuration','PUT',{'revision':committed['revision'],'options':{}},token)[0]==409)
        status,reserved=request(base+'/imports','POST',{'family':'seismic','files':[{'name':f'quota-{i}.sgy','size':10*1024**3} for i in range(4)]},token)
        check('10 GiB per-file reservation supported',status==201)
        check('50 GiB total reservation race guarded',request(base+'/imports','POST',{'family':'seismic','files':[{'name':'overflow.sgy','size':10*1024**3}]},token)[0]==413)
        check('Cancellation releases unused reservations',request(base+'/imports/'+reserved['id']+'/cancel','POST',{},token)[0]==200 and request(base+'/imports',token=token)[1]['quota']['reserved']==0)
        report={'api':API,'passed':len(checks),'checks':checks};Path('.release/ingestion-api-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
    finally:
        root=f'https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents/'
        for user in fixtures:
            uid=user['localId'];path=f'stratax_projects/{uid}/records/{pid}'
            for collection in ('imports','datasets','import_templates'):
                _,docs=request(root+path+'/'+collection,token=admin)
                for doc in docs.get('documents',[]):request('https://firestore.googleapis.com/v1/'+doc['name'],'DELETE',token=admin)
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
            request(identity+'projects/'+PROJECT+'/accounts:delete','POST',{'localId':uid},admin,headers={'x-goog-user-project':PROJECT})
        print(json.dumps({'isolated_accounts_cleaned':len(fixtures)}))


if __name__=='__main__':main()
