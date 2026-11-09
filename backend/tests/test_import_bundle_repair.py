"""Regression evidence for the recorded TOMBOY intake defects."""
import copy
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import sys
import zipfile
from unittest.mock import patch

import pytest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from ingestion_core import parse,ImportProblem
from import_recipes import selected_rows,mixed_survey_blocks
from import_bundles import expand_zip

ZIP=Path(r'C:\Users\Tolu\Downloads\keku TOMBOY.zip')

def member(tmp_path,name):
    if not ZIP.exists():pytest.skip('Read-only TOMBOY compatibility fixture not present')
    with zipfile.ZipFile(ZIP) as archive:content=archive.read('keku TOMBOY/'+name)
    target=tmp_path/Path(name).name;target.write_bytes(content);return target

def test_actual_survey_md_and_legacy_azimuth_mapping(tmp_path):
    source=member(tmp_path,'deviation/Directional_Surveys - TMB-07.asc')
    ds=parse(source,tmp_path/'out','deviation',{'mapping':{'depth':'2'}})[0]
    assert ds['rowCount']==89 and ds['mapping']=={'md':'0','inclination':'1','azimuth':'2'}
    assert ds['columnStatistics'][0]['decreasing']==ds['columnStatistics'][0]['repeated']==0
    assert ds['columnStatistics'][2]['decreasing']==29 and ds['columnStatistics'][2]['repeated']==26
    assert not any(i['code'].startswith('station_order') or i['code'].startswith('mapping_') for i in ds['issues'])

def test_survey_workbook_discovers_only_measurement_sheets(tmp_path):
    source=member(tmp_path,'deviation/Directional_Surveys.xlsx');datasets=parse(source,tmp_path/'out','deviation',{})
    assert [(d['metadata']['sheet'],d['rowCount']) for d in datasets]==[('TM0004_plan',74),('TM0007_plan',89)]
    assert any(i['code']=='survey_blocks_review' for i in datasets[0]['issues'])
    assert not any(i['code']=='survey_blocks_review' for i in datasets[1]['issues'])

def test_mixed_blocks_require_reviewed_selection_and_preserve_source(tmp_path):
    source=member(tmp_path,'deviation/Directional_Surveys - TMB-04.asc');before=hashlib.sha256(source.read_bytes()).hexdigest()
    ds=parse(source,tmp_path/'out','deviation',{'rowRanges':[[37,74]],'rowSelectionReviewed':True,'references':{'depthUnit':'ft'}})[0]
    assert ds['rowCount']==37 and ds['preview'][0][0]==4099.992
    assert ds['metadata']['sourceRowRanges']==[[37,74]]
    assert not any(i['code']=='survey_blocks_review' for i in ds['issues'])
    assert hashlib.sha256(source.read_bytes()).hexdigest()==before

@pytest.mark.parametrize('ranges',[[[0,0]],[[2,1]],[[0,2],[1,3]],[[-1,2]],[[0,20]],[[False,2]],[]])
def test_row_selection_rejects_invalid_ranges(ranges):
    with pytest.raises(ImportProblem):list(selected_rows([[i] for i in range(5)],ranges))

def test_tdp_prefix_is_metadata_not_a_measurement(tmp_path):
    source=member(tmp_path,'checkshots/solid 1 checkshot.txt');ds=parse(source,tmp_path/'out','checkshots',{})[0]
    assert ds['rowCount']==201 and len(ds['columns'])==2 and ds['preview'][1]==[20,101.804]
    assert {'mapping_depth','mapping_time'}<={i['code'] for i in ds['issues']}

def test_streamed_members_reject_traversal_and_preserve_bytes(tmp_path):
    source=tmp_path/'test.zip'
    with zipfile.ZipFile(source,'w') as archive:archive.writestr('well/a.txt',b'original bytes')
    result=list(expand_zip(source,tmp_path/'expanded','root'));assert len(result)==1
    assert Path(result[0]['localPath']).read_bytes()==b'original bytes'
    assert result[0]['sha256']==hashlib.sha256(b'original bytes').hexdigest()
    with zipfile.ZipFile(source,'w') as archive:archive.writestr('../outside.txt',b'bad')
    with pytest.raises(ImportProblem,match='unsafe'):list(expand_zip(source,tmp_path/'bad','root'))

@pytest.mark.parametrize('petrophysics_only',[False,True],ids=['combined','petrophysics-only'])
def test_full_zip_worker_real_routes_writers_no_cloud(tmp_path,petrophysics_only):
    if not ZIP.exists():pytest.skip('Read-only TOMBOY compatibility fixture not present')
    import ingestion_worker,ingestion_core
    from test_imports_api import Database
    db=Database();root='stratax_projects/owner/records/project';raw=tmp_path/'raw';derived=tmp_path/'derived';derived.mkdir()
    original=raw/'owners/owner/projects/project/originals/rootzip';original.parent.mkdir(parents=True);shutil.copyfile(ZIP,original)
    if petrophysics_only:
        db.records[root]['project']['workflows']=['petrophysics']
    db.records[root]['workspace']['files']=[{'id':'rootzip','name':'keku TOMBOY.zip','size':ZIP.stat().st_size}]
    db.records[root]['importQuota']={'reservedBytes':1024**3}
    db.records[root+'/imports/bundle']={'id':'bundle','family':'mixed','status':'inspecting','revision':1,'dispatchToken':'testdispatch','artifactReservation':1024**3,'assets':[{'id':'rootzip','clientId':'rootzip','name':'keku TOMBOY.zip','family':'documents','size':ZIP.stat().st_size,'state':'stored'}],'options':{'perAsset':{'rootzip':{'nativeArchive':True,'retainOnly':True}}}}
    class Blob:
        def __init__(self,name):self.path=raw/name
        def upload_from_file(self,source,**kw):
            self.path.parent.mkdir(parents=True,exist_ok=True)
            with self.path.open('xb') as target:shutil.copyfileobj(source,target,1024**2)
    class Bucket:
        def blob(self,name):return Blob(name)
        def get_blob(self,name):return Blob(name) if (raw/name).exists() else None
    class Storage:
        def bucket(self,name):return Bucket()
    environment={'IMPORT_UID':'owner','IMPORT_PROJECT':'project','IMPORT_ID':'bundle','IMPORT_DISPATCH':'testdispatch','RAW_MOUNT':str(raw),'DERIVED_MOUNT':str(derived),'STRATAX_PROJECT_BUCKET':'fixture'}
    ingestion_core._output_bytes=0
    with patch.dict(os.environ,environment),patch.object(ingestion_worker.firestore,'Client',return_value=db),patch.object(ingestion_worker.firestore,'transactional',lambda f:f),patch.object(ingestion_worker.storage,'Client',return_value=Storage()),patch.object(Path,'symlink_to',lambda link,target,*a,**kw:link.hardlink_to(target)):
        ingestion_worker.run()
    result=db.records[root+'/imports/bundle'];receipt={'status':result['status'],'assets':len(result['assets']),'datasets':[(d['family'],d['rowCount']) for d in result.get('datasets',[])],'issues':result.get('issues',[]),'quota':db.records[root]['importQuota']}
    evidence=Path('.release/import-petrophysics-20261109' if petrophysics_only else '.release/import-repair-20261108')
    evidence.mkdir(parents=True,exist_ok=True)
    (evidence/'native-full-zip.json').write_text(json.dumps(receipt,indent=2),encoding='utf-8')
    assert result['status']!='failed',receipt
    assert len(result['assets'])==(12 if petrophysics_only else 28) and len(result['archiveEntries'])==27
    logs=[d for d in result['datasets'] if d['family']=='logs'];assert [d['rowCount'] for d in logs]==[25423,25901,25900,23064,46951,41155]
    assert len({d['well'] for d in logs})==6
    if petrophysics_only:
        assert not any(d['family'] in ('checkshots','seismic') for d in result['datasets'])
        assert any(d['family']=='well_headers' and d['rowCount']==6 for d in result['datasets'])
        assert sum(m.get('code')=='workflow_skipped' for m in result['archiveEntries'])==16
        registrations=[r for d in logs for r in d['wellRecords']]
        assert len(registrations)==6
        assert all(r['sourceCoordinates']['crs']=='EPSG:26391' and
                   r['sourceCoordinates']['coordinateConflict'] and 'location' not in r
                   for r in registrations)
        assert all(r['sourceCoordinates']['crsEvidence']['sourceName']=='Directional_Surveys.xlsx'
                   for r in registrations)
    else:
        assert any(d['family']=='seismic' and d['rowCount']==88621 for d in result['datasets'])
    assert db.records[root]['importQuota']['reservedBytes']==0
    assert all((raw/'owners/owner/projects/project/originals'/a['id']).exists() for a in result['assets'])


def test_partial_worksheet_acceptance_followup_and_commit_revision():
    import main,imports_api
    from test_imports_api import setup
    db,client=setup();root='stratax_projects/owner/records/project'
    good={'id':'good','sourceId':'old','columns':[{'id':'column-0'}],'issues':[],'metadata':{'sheet':'valid'}}
    bad={'id':'bad','sourceId':'old','columns':[{'id':'column-0'}],'issues':[{'code':'survey_blocks_review','severity':'blocking','message':'Review block'}],'metadata':{'sheet':'mixed'}}
    db.records[root+'/imports/parent']={'id':'parent','revision':1,'status':'retained/unresolved','family':'deviation','assets':[{'id':'old','name':'existing.las','size':3,'family':'deviation','state':'stored'}],'options':{},'datasets':[good,bad],'issues':[{'sourceId':'old','datasetId':'bad','severity':'blocking','message':'Review block'}]}
    try:
        with patch.object(main,'_db',db),patch.object(imports_api.firestore,'transactional',lambda f:f):
            body={'revision':1,'acknowledge_warnings':True,'selected_dataset_ids':['good']}
            response=client.post('/api/projects/project/imports/parent/commit',json=body)
            assert response.status_code==200,response.text
            result=response.json();assert result['projectRevision']==db.records[root]['revision']
            assert result['pendingDatasetIds']==['bad']
            assert client.post('/api/projects/project/imports/parent/commit',json=body|{'revision':result['revision']}).status_code==409
            follow={'family':'deviation','files':[{'name':'existing.las','size':3,'existing_id':'old'}],'options':{'parentImportId':'parent'}}
            response=client.post('/api/projects/project/imports',json=follow)
            assert response.status_code==201 and response.json()['assets'][0]['existing'] is True
            assert response.json()['reservedBytes']==0
            assert db.records[root+'/datasets/good']['active'] is True
            follow['files'][0].pop('existing_id')
            assert client.post('/api/projects/project/imports',json=follow).status_code==400
    finally:main.app.dependency_overrides.clear()


def test_expansion_cancellation_and_entry_limit(tmp_path):
    source=tmp_path/'cancel.zip'
    with zipfile.ZipFile(source,'w') as archive:archive.writestr('member.txt',b'unchanged')
    with pytest.raises(ImportProblem,match='cancelled'):list(expand_zip(source,tmp_path/'out','root',cancelled=lambda:True))
    with zipfile.ZipFile(source,'w') as archive:
        for index in range(100):archive.writestr(str(index)+'.txt',b'content')
    with pytest.raises(ImportProblem,match='99 files'):list(expand_zip(source,tmp_path/'limit','root'))


def test_companion_proposals_and_sheet_ownership(tmp_path):
    from import_bundles import prepare_assets
    survey=member(tmp_path,'deviation/Directional_Surveys.xlsx')
    data={'assets':[{'id':'survey','name':survey.name,'family':'deviation'}],'options':{'perAsset':{'survey':{'autoPrepare':True}}}}
    prepare_assets({'survey':survey},data,[{'id':'three','uwi':'TM0004_plan','name':'TMB-03'},{'id':'six','uwi':'TM0007_plan','name':'TMB-6'}])
    options=data['options']['perAsset']['survey']
    assert options['references']=={'depthReference':'MD','depthUnit':'ft'}
    assert options['sheetSettings']['TM0004_plan']['well']=='three'
    assert options['sheetSettings']['TM0007_plan']['well']=='six'
    assert '04.5E' in options['proposalSources']['surveyMetadata']['crsDescription']
    assert not options['references'].get('crs')


@pytest.mark.parametrize('mode',['cancel','failure'])
def test_inflight_worker_settlement_and_retry(tmp_path,mode):
    import ingestion_worker,ingestion_core,threading
    from test_imports_api import Database
    db=Database();root='stratax_projects/owner/records/project';raw=tmp_path/'raw';derived=tmp_path/'derived';source=raw/'owners/owner/projects/project/originals/original';source.parent.mkdir(parents=True);derived.mkdir()
    source.write_text('~Version\nVERS. 2.0\nWRAP. NO\n~Well\nWELL. QA\n~Curve\nDEPT.M\nGR.GAPI\n~ASCII\n0 10\n1 20\n')
    db.records[root]['workspace']['files']=[{'id':'original','name':'qa.las','size':source.stat().st_size}]
    db.records[root]['importQuota']={'reservedBytes':1024**2}
    record={'id':'recovery','revision':1,'status':'inspecting','dispatchToken':'first','family':'logs','artifactReservation':1024**2,'assets':[{'id':'original','name':'qa.las','size':source.stat().st_size,'state':'stored'}],'options':{'well':'qa','createWell':True}}
    db.records[root+'/imports/recovery']=record
    entered=threading.Event();release=threading.Event();original_parse=ingestion_worker.parse
    def gated(*args,**kwargs):
        entered.set();assert release.wait(10)
        if mode=='failure':raise RuntimeError('Controlled local parser failure')
        return original_parse(*args,**kwargs)
    environment={'IMPORT_UID':'owner','IMPORT_PROJECT':'project','IMPORT_ID':'recovery','IMPORT_DISPATCH':'first','RAW_MOUNT':str(raw),'DERIVED_MOUNT':str(derived)}
    ingestion_core._output_bytes=0
    with patch.dict(os.environ,environment),patch.object(ingestion_worker.firestore,'Client',return_value=db),patch.object(ingestion_worker.firestore,'transactional',lambda f:f),patch.object(Path,'symlink_to',lambda link,target,*a,**kw:link.hardlink_to(target)),patch.object(ingestion_worker,'parse',gated):
        thread=threading.Thread(target=ingestion_worker.run);thread.start();assert entered.wait(10)
        if mode=='cancel':db.records[root+'/imports/recovery']['status']='cancelled'
        release.set();thread.join(10);assert not thread.is_alive()
    result=db.records[root+'/imports/recovery'];assert db.records[root]['importQuota']['reservedBytes']==0
    assert not any('/datasets/' in key for key in db.records)
    if mode=='cancel':assert result['status']=='cancelled'
    else:assert any(i['code']=='parser_failed' for i in result['issues'])
    before=copy.deepcopy(result)
    result.update(status='inspecting',dispatchToken='retry',artifactReservation=1024**2);db.records[root]['importQuota']['reservedBytes']=1024**2
    environment['IMPORT_DISPATCH']='retry';ingestion_core._output_bytes=0
    with patch.dict(os.environ,environment),patch.object(ingestion_worker.firestore,'Client',return_value=db),patch.object(ingestion_worker.firestore,'transactional',lambda f:f),patch.object(Path,'symlink_to',lambda link,target,*a,**kw:link.hardlink_to(target)):
        ingestion_worker.run()
    result=db.records[root+'/imports/recovery'];assert result['datasets'][0]['rowCount']==2
    assert db.records[root]['importQuota']['reservedBytes']==0
    assert source.read_text().startswith('~Version')
    assert before['status']=='cancelled' or before['issues'][0]['code']=='parser_failed'
    from import_recipes import reusable_assets
    assert reusable_assets(result,result['options'],[])==['original']
    assert reusable_assets(result,result['options']|{'references':{'depthReference':'TVD'}},[])==[]
    retained=derived/result['datasets'][0]['manifest'];retained_hash=hashlib.sha256(retained.read_bytes()).hexdigest()
    result.update(status='inspecting',dispatchToken='reused',reuseAssetIds=['original'],artifactReservation=1024**2);db.records[root]['importQuota']['reservedBytes']=1024**2
    environment['IMPORT_DISPATCH']='reused';ingestion_core._output_bytes=0
    with patch.dict(os.environ,environment),patch.object(ingestion_worker.firestore,'Client',return_value=db),patch.object(ingestion_worker.firestore,'transactional',lambda f:f),patch.object(Path,'symlink_to',lambda link,target,*a,**kw:link.hardlink_to(target)),patch.object(ingestion_worker,'parse',side_effect=AssertionError('Unchanged source must reuse artifacts')) as parser:
        ingestion_worker.run();assert parser.call_count==0
    result=db.records[root+'/imports/recovery'];assert result['datasets'][0]['rowCount']==2
    assert hashlib.sha256(retained.read_bytes()).hexdigest()==retained_hash
    assert result['datasets'][0]['manifest']!=str(retained.relative_to(derived)).replace('\\','/')
    assert db.records[root]['importQuota']['reservedBytes']==0
