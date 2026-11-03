"""Independent calibration checks and a local mixed-unit, two-well checkpoint study."""
import hashlib
import json
from pathlib import Path
from unittest.mock import patch, Mock
import numpy as np
import pytest
from fastapi.testclient import TestClient
from test_scientific_api import Database, Reference, ROOT
import main
import scientific_api as science
from scientific_core import evaluate, ScienceProblem
from scientific_workflows import check_definition, effective_parameters
from scientific_workflow_worker import execute_segment
from scientific_worker import verify_alignment
from ingestion_core import column, output_dataset


def test_alignment_gaps_depth_ordering_and_pickett_identifiability():
    r=evaluate('align-curve',dict(depth=[0,1,4,5],curve=[10,20,40,None]),
               dict(top=-1,base=6,spacing=.5,maxGap=1,depthReference='MD'),dict(depth='m',curve='source unit'))
    values=r['series']['curve']
    assert values[:2]==[None,None] and values[3]==15 and values[6:10]==[None]*4
    assert values[-3:]==[None,None,None]
    for anchors in ([[0,0],[2,1],[1,2]], [[0,0],[1,2],[2,1]]):
        with pytest.raises(ScienceProblem):
            evaluate('depth-match',dict(depth=[0,1,2],curve=[1,2,3]),dict(anchors=anchors,sourceRun='run-A'),dict(depth='m',curve='gAPI'))
    phi=np.array([.1,.12,.15,.2,.25,.3])
    fit=evaluate('pickett-fit',dict(porosity=phi,rt=.14/phi**2),dict(waterZoneEvidence='Independent Sw=1 fixture'),dict(porosity='v/v',rt='ohm.m'))['summary']
    assert fit['m']==pytest.approx(2) and fit['aRw']==pytest.approx(.14)
    assert 'rw' not in fit and 'a' not in fit
    corrected=evaluate('resistivity-temperature',dict(temperature=[20,80]),dict(sampleResistivity=.1,sampleTemperatureC=20,constantC=21.5,citation='Controlled empirical fixture'),dict(temperature='degC'))
    assert corrected['series']['resistivity']==pytest.approx([.1,.1*41.5/101.5])
    fahrenheit=evaluate('resistivity-temperature',dict(temperature=[68,176]),dict(sampleResistivity=.1,sampleTemperatureC=20,constantC=21.5,citation='Controlled unit conversion fixture'),dict(temperature='degF'))
    assert fahrenheit['series']['resistivity']==pytest.approx(corrected['series']['resistivity'])
    indices=dict(a=dict(datasetId='a'),b=dict(datasetId='b'))
    sources={k:dict(references=dict(depthReference='MD')) for k in ('a','b')}
    axis,ref=verify_alignment(dict(a=[0,1],b=[0,1/.3048]),dict(a='m',b='ft'),indices,sources)
    assert axis==pytest.approx([0,1]) and ref=='MD'
    with pytest.raises(ScienceProblem,match='different depth axes'):
        verify_alignment(dict(a=[0,1],b=[.1,1.1]),dict(a='m',b='m'),indices,sources)


def test_parameter_inheritance_and_rejected_dependencies():
    definition=dict(projectParameters={'shale-linear':dict(clean=10,shale=100)},wellParameters={'A':{'shale-linear':dict(clean=20)}},zoneParameters={'Z':{'shale-linear':dict(clean=dict(value=30,unit='gAPI'))}})
    parameters,origins=effective_parameters(definition,dict(method='shale-linear',wellId='A',zoneId='Z'))
    assert parameters==dict(clean=30,shale=100) and origins['clean']['level']=='zone' and origins['clean']['unit']=='gAPI'
    density,_=effective_parameters(dict(projectParameters={'porosity-density':dict(matrix=dict(value=2.65,unit='g/cc'),fluid=dict(value=1,unit='g/cc'))}),dict(method='porosity-density'))
    assert density==dict(matrix=2650,fluid=1000)
    with pytest.raises(ValueError):effective_parameters(dict(projectParameters={'shale-linear':dict(fake=1)}),dict(method='shale-linear'))


def test_stale_ancestors_are_blocked_and_failed_segments_keep_accepted_checkpoints():
    db=Database();original=db.records[ROOT+'/datasets/source'];derived=dict(id='derived',active=True,scientificRunId='accepted-run')
    db.records[ROOT+'/scienceRuns/accepted-run']=dict(status='accepted',inputFingerprints={'source':science.fingerprint(original)})
    assert science.lineage_fingerprints(Reference(db,ROOT),derived,None,main.fail)=={'source':science.fingerprint(original)}
    original['columns'][0]['unit']='v/v'
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as error:science.lineage_fingerprints(Reference(db,ROOT),derived,None,main.fail)
    assert error.value.detail['code']=='stale_lineage'
    parent=dict(id='workflow-test',status='running',revision=3,activeRunId='run-test',outputs={'conditioned':{'proposed':{'datasetId':'retained','columnId':'column-1'}}},checkpoints=[dict(checkpoint='conditioning',decision='accept')])
    db.records[ROOT+'/scienceWorkflowRuns/workflow-test']=parent
    db.records[ROOT+'/scienceRuns/run-test']=dict(id='run-test',dispatch='dispatch',status='cancelling',revision=1,reservation=science.ARTIFACT_BUDGET,configuration=dict(workflowRunId='workflow-test'))
    db.records[ROOT]['importQuota']=dict(reservedBytes=science.ARTIFACT_BUDGET,derivedBytes=5)
    with patch.object(science.firestore,'transactional',lambda f:f):
        science.settle_run(db,Reference(db,ROOT),Reference(db,ROOT+'/scienceRuns/run-test'),Reference(db,'stratax_science_runtime/capacity'),'dispatch','failed',7)
        science.settle_run(db,Reference(db,ROOT),Reference(db,ROOT+'/scienceRuns/run-test'),Reference(db,'stratax_science_runtime/capacity'),'dispatch','failed',7)
    saved=db.records[ROOT+'/scienceWorkflowRuns/workflow-test']
    assert saved['status']=='cancelled' and saved['outputs']==parent['outputs'] and saved['checkpoints']==parent['checkpoints']
    assert db.records[ROOT]['importQuota']==dict(reservedBytes=0,derivedBytes=12)


def test_dispatch_timeout_keeps_capacity_and_prevents_duplicate_dispatch():
    from test_scientific_api import config
    db=Database();main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner');client=TestClient(main.app)
    try:
        with patch.object(main,'_db',db),patch.object(science.firestore,'transactional',lambda f:f),patch('google.auth.default',return_value=(Mock(),None)),patch('google.auth.transport.requests.AuthorizedSession') as dispatch:
            dispatch.return_value.post.side_effect=TimeoutError('connection interrupted')
            client.put('/api/projects/project/science/configurations/config',json=config())
            payload=dict(configurationId='config',revision=1,idempotencyKey='uncertain-submission')
            first=client.post('/api/projects/project/science/runs',json=payload)
            assert first.status_code==202 and first.json()['dispatchUnconfirmed'] is True
            assert client.post('/api/projects/project/science/runs',json=payload).json()['id']==first.json()['id']
            assert dispatch.return_value.post.call_count==1
            assert db.records[ROOT]['importQuota']['reservedBytes']==science.ARTIFACT_BUDGET
    finally:main.app.dependency_overrides.clear()


def test_private_porosity_and_explicit_mixed_axis_alignment(tmp_path):
    sources={}
    for name,depth_unit,rows in [('density','ft',[[0,2.32],[2,2.32],[4,2.32],[6,2.32]]),('resistivity','m',[[0,10],[1,10],[2,10],[4,10]])]:
        folder=tmp_path/name
        ds=output_dataset(folder,name,[column('DEPTH',depth_unit,0),column(name,'g/cc' if name=='density' else 'ohm.m',1)],rows)
        ds.update(manifest='owners/o/projects/p/'+name+'/'+ds['id']+'.json',well='A',references=dict(depthReference='MD'),indexColumnId=ds['columns'][0]['id'])
        sources[ds['id']]=ds
    density,resistivity=sources.values()
    def binding(ds,col):return dict(datasetId=ds['id'],columnId=ds['columns'][col]['id'],unit=ds['columns'][col]['unit'],confirmed=True)
    steps=[dict(id='phi',method='porosity-density',wellId='A',bindings=dict(density=binding(density,1)),parameters=dict(matrix=2650,fluid=1000),scope=dict(datasetId=density['id'],columnId=density['columns'][0]['id'],unit='ft',reference='MD')),
           dict(id='sw',method='saturation-archie',wellId='A',bindings=dict(porosity=dict(stepId='phi',output='porosity',unit='v/v',confirmed=True),rt=binding(resistivity,1)),parameters=dict(a=1,m=2,n=2,rw=.1),alignment=dict(top=0,base=1,spacing=.5,maxGap=1,interpolation='linear',depthReference='MD',reviewed=True))]
    record=dict(id='run-private',methodVersion='fixture',configuration=dict(steps=steps),inputSnapshots=sources)
    output=tmp_path/'result';progress=[]
    extra=execute_segment(record,tmp_path,output,'owners/o/projects/p/science/run-private/dispatch',lambda:False,progress.append)
    manifest=json.loads((output/'manifest.json').read_text())
    result=manifest['steps'][1]
    assert result['preview']['sw']==pytest.approx([.5,.5,.5])
    assert result['preview']['depth']==[0,.5,1]
    assert extra['datasetCount']==2
    # With no reviewed resampling, equal row counts cannot authorize a row join.
    del steps[1]['alignment']
    with pytest.raises(ScienceProblem,match='depth index'):
        execute_segment(record,tmp_path,tmp_path/'blocked','owners/o/projects/p/science/blocked/dispatch',lambda:False,lambda p:None)


@pytest.mark.parametrize('reject_calibration',[False,True])
def test_two_well_three_checkpoint_atomic_publication_and_restart(tmp_path,reject_calibration):
    db=Database();project_root=tmp_path/'owners/owner/projects/project';project_root.mkdir(parents=True)
    steps=[];hashes={}
    for well,unit,factor in [('A','ft',.3048),('B','m',1)]:
        folder=project_root/'imports'/well;folder.mkdir(parents=True)
        rows=[[1000+i*.5/factor,20+i] for i in range(30)]
        ds=output_dataset(folder,'Source '+well,[column('DEPTH',unit,0),column('GR','gAPI',1)],rows)
        original_id=ds['id'];did='source-'+well;ds.update(id=did,well=well,active=True,sourceSha256=hashlib.sha256(json.dumps(rows).encode()).hexdigest(),parserVersion='fixture',manifest=f'owners/owner/projects/project/imports/{well}/'+original_id+'.json')
        # output_dataset's public manifest is added by its caller, as in the importer.
        if not (folder/ds['manifest'].rsplit('/',1)[-1]).exists():
            (folder/ds['manifest'].rsplit('/',1)[-1]).write_text(json.dumps(ds))
        db.records[ROOT+'/datasets/'+did]=ds;hashes[did]=ds['sourceSha256']
        bindings=dict(depth=dict(datasetId=did,columnId=ds['columns'][0]['id'],unit=unit,confirmed=True),curve=dict(datasetId=did,columnId=ds['columns'][1]['id'],unit='gAPI',confirmed=True))
        scope=dict(datasetId=did,columnId=ds['columns'][0]['id'],unit=unit,reference='MD')
        for stage,method,params in [('conditioning','qc-smooth',dict(window=3)),('calibration','endpoint-proposal',dict(top=0,base=10000)),('evaluation','shale-linear',dict(clean=20,shale=100))]:
            steps.append(dict(id=stage+'-'+well,method=method,checkpoint=stage,wellId=well,bindings=bindings if stage!='evaluation' else dict(gr=dict(stepId='conditioning-'+well,output='proposed',unit='gAPI',confirmed=True)),parameters=params,scope=scope if stage!='evaluation' else dict(stepId='conditioning-'+well,output='depth',unit='m',reference='MD')))
    steps.sort(key=lambda s:['conditioning','calibration','evaluation'].index(s['checkpoint']))
    definition=dict(revision=0,name='Mixed-unit local acceptance study',steps=steps)
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
    client=TestClient(main.app)
    class Blob:
        def __init__(self,path):self.path=tmp_path/path;self.size=self.path.stat().st_size
        def reload(self):pass
        def download_as_bytes(self):return self.path.read_bytes()
    try:
        with patch.object(main,'_db',db),patch.object(science.firestore,'transactional',lambda f:f),patch('google.auth.default',return_value=(Mock(),None)),patch('google.auth.transport.requests.AuthorizedSession') as dispatch,patch.object(science.storage,'Client') as store,patch.dict('os.environ',STRATAX_DERIVED_BUCKET='test'):
            store.return_value.bucket.return_value.blob.side_effect=Blob
            dispatch.return_value.post.return_value.json.return_value={}
            saved=client.put('/api/projects/project/science/workflows/study',json=definition);assert saved.status_code==200,saved.text
            run=client.post('/api/projects/project/science/workflow-runs',json=dict(workflowId='study',revision=1,idempotencyKey='study-001')).json()
            for stage in range(3):
                parent=db.records[ROOT+'/scienceWorkflowRuns/'+run['id']]
                submission=dict(revision=parent['revision'],idempotencyKey='checkpoint-'+str(stage))
                url='/api/projects/project/science/workflow-runs/'+run['id']
                started=client.post(url+'/start',json=submission);assert started.status_code==202,started.text
                child=started.json();record=science.restore_value(db.records[ROOT+'/scienceRuns/'+child['id']])
                assert client.post(url+'/start',json=submission).json()['id']==child['id']
                output=project_root/'science'/child['id']/record['dispatch'];prefix=str(output.relative_to(tmp_path)).replace('\\','/')
                progress=[];extra=execute_segment(record,project_root,output,prefix,lambda:False,progress.append)
                assert progress[-1]['current']==2
                manifest=json.loads((output/'manifest.json').read_text())
                assert not any(ROOT+'/datasets/'+d['id'] in db.records for d in manifest['datasets'])
                science.settle_run(db,Reference(db,ROOT),Reference(db,ROOT+'/scienceRuns/'+child['id']),Reference(db,'stratax_science_runtime/capacity'),record['dispatch'],'completed',sum(f.stat().st_size for f in output.iterdir()),extra=extra)
                current=db.records[ROOT+'/scienceRuns/'+child['id']]
                decision='reject' if reject_calibration and stage==1 else 'accept'
                accepted=client.post(url+'/checkpoint-review',json=dict(revision=current['revision'],decision=decision,comment='Controlled numerical and artifact review'))
                assert accepted.status_code==200,accepted.text
                if decision=='reject':
                    assert not any(ROOT+'/datasets/'+d['id'] in db.records for d in manifest['datasets'])
                    parent=science.restore_value(db.records[ROOT+'/scienceWorkflowRuns/'+run['id']])
                    assert parent['status']=='rejected' and len(parent['outputs'])==2
                    assert client.post(url+'/start',json=dict(revision=parent['revision'],idempotencyKey='blocked-after-rejection')).status_code==409
                    assert db.records[ROOT]['importQuota']['reservedBytes']==0
                    return
                assert all(db.records[ROOT+'/datasets/'+d['id']]['active'] for d in manifest['datasets'])
                if stage==2:
                    for ds in manifest['datasets']:
                        assert ds['well'] in ('A','B')
                        assert 0<ds['preview'][0][-1]<.02  # consumed the accepted smooth version, not raw GR
            parent=science.restore_value(db.records[ROOT+'/scienceWorkflowRuns/'+run['id']])
            assert parent['status']=='completed' and len(parent['checkpoints'])==3 and len(parent['outputs'])==6
            assert dispatch.return_value.post.call_count==3
            assert db.records[ROOT]['importQuota']['reservedBytes']==0
            assert all(db.records[ROOT+'/datasets/'+did]['sourceSha256']==value for did,value in hashes.items())
            main.app.dependency_overrides[main.current_user]=lambda:dict(uid='other')
            assert client.get(url).status_code==404
    finally:main.app.dependency_overrides.clear()
