"""Analytical and actual-route/worker acceptance for preparation and calibration."""
import copy
import json
from pathlib import Path
from unittest.mock import patch

import numpy as np
import pytest
from fastapi.testclient import TestClient
from test_scientific_api import Database, ROOT
from test_science import fixture
import main
import scientific_api as science
import scientific_worker as worker
from scientific_core import evaluate, ScienceProblem
from scientific_workflow_worker import execute_segment
from scientific_workflows import effective_parameters
from ingestion_core import column, output_dataset

RTOL, ATOL = 1e-8, 1e-10


def close(actual, expected):
    np.testing.assert_allclose(actual, expected, rtol=RTOL, atol=ATOL, equal_nan=True)


@pytest.mark.parametrize('method,values,parameters,expected',[
    ('qc-despike',[1,1,1,100,1,1,1],dict(window=3,threshold=4),[1]*7),
    ('qc-smooth',[1,2,None,4,5],dict(window=3),[4/3,1.5,None,4.5,14/3]),
    ('qc-normalize',[0,50,100,None],dict(sourceLow=0,sourceHigh=100,targetLow=10,targetHigh=20),[10,15,20,None]),
    ('qc-splice',[1,2,3,4],dict(boundary=2),[1,2,30,40]),
])
def test_conditioning_analytical_values_and_originals(method,values,parameters,expected):
    depth=list(range(len(values)));inputs=dict(depth=depth,curve=values)
    if method=='qc-splice':inputs['alternate']=[10,20,30,40]
    original=copy.deepcopy(inputs)
    result=evaluate(method,inputs,parameters,{role:'m' if role=='depth' else 'gAPI' for role in inputs})
    close(np.asarray(result['series']['proposed'],float),np.asarray(expected,float))
    assert inputs==original
    assert result['units']['proposed']=='gAPI'


def test_conditioning_interpolation_shift_borehole_and_depth_rejections():
    result=evaluate('qc-interpolate',dict(depth=[0,1,2,10,11],curve=[1,None,3,None,5]),dict(maxGap=3),dict(depth='m',curve='gAPI'))
    assert result['series']['proposed']==[1,2,3,None,5]
    result=evaluate('qc-shift',dict(depth=[0,10],curve=[1,2]),dict(shift=2),dict(depth='ft',curve='gAPI'))
    close(result['series']['depth'],[2,5.048])
    result=evaluate('qc-borehole',dict(depth=[0,1,2],curve=[.2/.0254,.23/.0254,None]),dict(bitSize=.2,tolerance=.0254),dict(depth='m',curve='in'))
    assert result['series']['washoutFlag']==[0,1,None]
    for depths in ([0,0,1],[0,2,1]):
        with pytest.raises(ScienceProblem):evaluate('qc-smooth',dict(depth=depths,curve=[1,2,3]),dict(window=3),dict(depth='m',curve='gAPI'))
    with pytest.raises(ScienceProblem):evaluate('qc-splice',dict(depth=[0,1],curve=[1,2],alternate=[3,4]),dict(boundary=1),dict(depth='m',curve='gAPI',alternate='unknown'))


def test_depth_matching_and_resampling_support():
    result=evaluate('depth-match',dict(depth=[0,1,2,3,4],curve=[1,2,3,4,5]),dict(anchors=[[1,11],[3,15]],sourceRun='run-A'),dict(depth='m',curve='gAPI'))
    assert result['series']['depth']==[None,11,13,15,None]
    for anchors in ([[0,0],[0,1]],[[0,2],[1,1]]):
        with pytest.raises(ScienceProblem):evaluate('depth-match',dict(depth=[0,1],curve=[1,2]),dict(anchors=anchors,sourceRun='run-A'),dict(depth='m',curve='gAPI'))
    a=dict(depth=[0,1,4,5],curve=[10,20,40,None]);p=dict(top=-1,base=6,spacing=.5,maxGap=1,interpolation='linear',depthReference='MD')
    result=evaluate('align-curve',a,p,dict(depth='m',curve='gAPI'))
    assert result['series']['curve'][:5]==[None,None,10,15,20]
    assert result['series']['curve'][5:10]==[None]*5
    assert result['series']['curve'][-3:]==[None]*3
    feet=evaluate('align-curve',a|dict(depth=np.array(a['depth'])/.3048),p,dict(depth='ft',curve='gAPI'))
    close(np.asarray(feet['series']['curve'],float),np.asarray(result['series']['curve'],float))


def test_endpoint_interval_and_parameter_precedence():
    result=evaluate('endpoint-proposal',dict(depth=[0,1,2,3,4,5],curve=[10,20,30,40,50,999]),dict(top=0,base=5,lowPercentile=25,highPercentile=75),dict(depth='m',curve='gAPI'))
    assert result['summary']['proposedLow']==20 and result['summary']['proposedHigh']==40
    assert result['summary']['selectedRows']==5
    assert 'proposals only' in ' '.join(result['warnings'])
    definition=dict(projectParameters={'shale-linear':dict(clean=10,shale=100)},wellParameters={'A':{'shale-linear':dict(clean=20)}},zoneParameters={'Z':{'shale-linear':dict(clean=30)}})
    values,origins=effective_parameters(definition,dict(method='shale-linear',wellId='A',zoneId='Z',parameters=dict(clean=40)))
    assert values==dict(clean=40,shale=100) and origins['clean']['level']=='step' and origins['shale']['level']=='project'
    values,origins=effective_parameters(dict(projectParameters={'porosity-density':dict(matrix=dict(value=2.65,unit='g/cc'))}),dict(method='porosity-density'))
    assert values['matrix']==2650 and origins['matrix']['suppliedUnit']=='g/cc'


def test_temperature_resistivity_and_pickett_identifiability():
    units=dict(depth='m');parameters=dict(top=100,base=200,temperatureC=20,gradientCPerM=.03,depthReference='TVD',citation='Controlled anchor')
    result=evaluate('temperature-profile',dict(depth=[0,100,150,200,300]),parameters,units)
    assert result['series']['temperatureC']==[None,20,21.5,23,None]
    anchored=evaluate('temperature-profile',dict(depth=[50,100,150,200,250]),parameters|dict(anchors=[[100,20],[200,30]]),units)
    assert anchored['series']['temperatureC']==[None,20,25,30,None]
    for unit,temperatures in [('degC',[20,80]),('degF',[68,176]),('K',[293.15,353.15])]:
        r=evaluate('resistivity-temperature',dict(temperature=temperatures),dict(sampleResistivity=.1,sampleTemperatureC=20,constantC=21.5,fluidKind='mud-filtrate',citation='Controlled domain'),dict(temperature=unit))
        close(r['series']['resistivity'],[.1,.1*41.5/101.5]);assert r['summary']['fluidKind']=='mud-filtrate'
    phi=np.array([.1,.12,.15,.2,.25,.3]);a=dict(porosity=phi,rt=.14/phi**2);u=dict(porosity='v/v',rt='ohm.m')
    for known,value,other,expected in [('none',None,None,None),('a',1.4,'rw',.1),('rw',.07,'a',2)]:
        r=evaluate('pickett-fit',a,dict(waterZoneEvidence='Controlled Sw=1',knownParameter=known,knownValue=value),u)
        close([r['summary']['m'],r['summary']['aRw']],[2,.14]);assert 'n' not in r['summary']
        if other:close([r['summary'][other]],[expected])
        else:assert 'a' not in r['summary'] and 'rw' not in r['summary']
    with pytest.raises(ScienceProblem):evaluate('pickett-fit',{key:value[:4] for key,value in a.items()},dict(waterZoneEvidence='Too few'),u)


def test_permeability_heldout_independence_and_application_bounds():
    phi=np.linspace(.1,.3,20);a=dict(porosity=phi,coreK=1000*phi**2);u=dict(porosity='v/v',coreK='mD')
    r=evaluate('permeability-regression',a,dict(validationFraction=.2),u)
    altered=a|dict(coreK=np.r_[a['coreK'][:16],a['coreK'][16:]*100])
    other=evaluate('permeability-regression',altered,dict(validationFraction=.2),u)
    close(np.asarray(r['series']['predictedK'],float),np.asarray(other['series']['predictedK'],float))
    close([r['summary']['slope'],r['summary']['intercept']],[2,np.log(1000)])
    assert other['summary']['holdoutLogRmse']>4 and r['series']['predictedK'][-4:]==[None]*4
    for method in ('permeability-timur','permeability-coates'):
        _,p,_=fixture(method);p['applicationBounds']=dict(phiLow=.1,phiHigh=.3,swiLow=.1,swiHigh=.5)
        a=dict(porosity=[.05,.2,.4],swi=[.2,.2,.2]);units=dict(porosity='v/v',swi='v/v')
        r=evaluate(method,a,p,units)
        assert r['series']['permeability'][0] is None and r['series']['permeability'][2] is None
        assert r['summary']['outsideCalibrationRows']==2
        percent=evaluate(method,dict(porosity=[5,20,40],swi=[20,20,20]),p,dict(porosity='%',swi='%'))
        close(np.asarray(r['series']['permeability'],float),np.asarray(percent['series']['permeability'],float))


def source_record(well='A',reference='MD'):
    return dict(id='source',active=True,manifest='owners/owner/projects/project/imports/i/data.json',rowCount=7,well=well,sourceSha256='controlled',parserVersion='fixture',indexColumnId='depth',references=dict(depthReference=reference),columns=[dict(id='depth',mnemonic='DEPTH',unit='m'),dict(id='curve',mnemonic='GR',unit='gAPI')])


@pytest.mark.parametrize('case',['align-reference','scope-reference','cross-well','source-run','unconfirmed','inactive','unit-scale'])
def test_preparation_admission_rejections(case):
    db=Database();source=source_record();db.records[ROOT+'/datasets/source']=source
    method='align-curve' if case=='align-reference' else 'depth-match' if case=='source-run' else 'qc-splice' if case=='cross-well' else 'qc-smooth'
    _,p,_=fixture(method)
    binding=lambda column,unit:dict(datasetId='source',columnId=column,unit=unit,confirmed=True)
    bindings=dict(depth=binding('depth','m'),curve=binding('curve','gAPI'))
    body=dict(revision=0,method=method,parameters=p,bindings=bindings)
    if case=='align-reference':p['depthReference']='TVD'
    if case=='scope-reference':body['scope']=dict(datasetId='source',columnId='depth',unit='m',reference='TVD')
    if case=='cross-well':
        db.records[ROOT+'/datasets/other']=source_record('B')|dict(id='other')
        bindings['alternate']=binding('curve','gAPI')|dict(datasetId='other');body['alignmentConfirmed']=True
    if case=='source-run':p['sourceRun']='wrong-run'
    if case=='unconfirmed':bindings['curve']['confirmed']=False
    if case=='inactive':source['active']=False
    if case=='unit-scale':bindings['depth']['unit']='ft'
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
    try:
        with TestClient(main.app) as client,patch.object(main,'_db',db):
            response=client.post('/api/projects/project/science/validate',json=body)
            assert response.status_code==400,response.text
    finally:main.app.dependency_overrides.clear()


def test_single_preparation_worker_retains_physical_index_without_canvas_scope(tmp_path):
    db=Database();root=tmp_path/'owners/owner/projects/project';folder=root/'imports'
    ds=output_dataset(folder,'Controlled GR',[column('DEPTH','ft',0),column('GR','gAPI',1)],[[i/.3048,i+10] for i in range(7)])
    ds.update(active=True,manifest='owners/owner/projects/project/imports/'+ds['id']+'.json',indexColumnId=ds['columns'][0]['id'],references=dict(depthReference='MD'),well='A')
    db.records[ROOT+'/datasets/'+ds['id']]=ds
    bindings={role:dict(datasetId=ds['id'],columnId=ds['columns'][i]['id'],unit=unit,confirmed=True) for i,(role,unit) in enumerate([('depth','ft'),('curve','gAPI')])}
    rid='run-qc';record=dict(id=rid,status='queued',dispatch='dispatch',method='qc-smooth',parameters=dict(window=3),configuration=dict(bindings=bindings),inputSnapshots={ds['id']:ds|dict(fingerprint=science.fingerprint(ds))})
    db.records[ROOT+'/scienceRuns/'+rid]=record
    with patch.object(worker.firestore,'Client',return_value=db),patch.object(worker,'settle_run') as settle,patch.dict('os.environ',SCIENCE_UID='owner',SCIENCE_PROJECT='project',SCIENCE_RUN=rid,SCIENCE_DISPATCH='dispatch',DERIVED_MOUNT=str(tmp_path)):
        worker.run()
    assert settle.call_args.args[5]=='completed'
    result=json.loads((root/'science'/rid/'dispatch'/'manifest.json').read_text())
    assert result['datasets'][0].get('indexColumnId')
    assert result['datasets'][0]['references']['depthReference']=='MD'
    close(result['preview']['depth'],range(7))


@pytest.mark.parametrize('private',[False,True])
def test_workflow_alignment_cannot_relabel_retained_depth(tmp_path,private):
    folder=tmp_path/'imports';ds=output_dataset(folder,'Controlled MD',[column('DEPTH','m',0),column('GR','gAPI',1)],[[i,i+10] for i in range(7)])
    ds.update(manifest='owners/o/projects/p/imports/'+ds['id']+'.json',indexColumnId=ds['columns'][0]['id'],references=dict(depthReference='MD'),well='A')
    bindings={role:dict(datasetId=ds['id'],columnId=ds['columns'][i]['id'],unit=unit,confirmed=True) for i,(role,unit) in enumerate([('depth','m'),('curve','gAPI')])}
    _,parameters,_=fixture('align-curve');parameters.update(top=0,base=6,depthReference='TVD')
    record=dict(id='run-align',methodVersion='fixture',inputSnapshots={ds['id']:ds},configuration=dict(steps=[dict(id='align',wellId='A',method='align-curve',bindings=bindings,parameters=parameters)]))
    if private:
        record['configuration']['steps'].insert(0,dict(id='prepared',wellId='A',method='qc-smooth',bindings=bindings,parameters=dict(window=3)))
        record['configuration']['steps'][1]['bindings']={role:dict(stepId='prepared',output=output,unit=unit,confirmed=True) for role,output,unit in [('depth','depth','m'),('curve','proposed','gAPI')]}
    with pytest.raises(ScienceProblem):execute_segment(record,tmp_path,tmp_path/'output','owners/o/projects/p/science/r/d',lambda:False,lambda progress:None)


def test_borehole_artifact_statistics_use_physical_depth(tmp_path):
    inputs,parameters,units=fixture('qc-borehole')
    result=evaluate('qc-borehole',inputs,parameters,units)
    worker.write_result(tmp_path,'owners/o/projects/p/science/r/d','run-borehole',result,{},dict(verifiedIndexReference='MD'))
    dataset=json.loads((tmp_path/'manifest.json').read_text())['datasets'][0]
    assert dataset['columns'][0]['id']==dataset['indexColumnId']
    assert dataset['indexRange']==[min(inputs['depth']),max(inputs['depth'])]
    assert not any(issue['code']=='repeated_index' for issue in dataset['issues'])


@pytest.mark.parametrize('method,changes',[
    ('temperature-profile',dict(temperatureC=-274,anchors=[])),
    ('resistivity-temperature',dict(sampleResistivity=0)),
    ('resistivity-temperature',dict(sampleTemperatureC=-274)),
    ('pickett-fit',dict(knownParameter='a',knownValue=0)),
    ('permeability-timur',dict(calibration='')),
    ('permeability-coates',dict(applicationBounds={})),
])
def test_calibration_invalid_domains(method,changes):
    inputs,parameters,units=fixture(method)
    with pytest.raises(ScienceProblem):evaluate(method,inputs,parameters|changes,units)


@pytest.mark.parametrize('phi,core',[(np.linspace(1.1,1.3,20),np.linspace(10,30,20)),(np.linspace(.1,.3,9),np.arange(1,10)),(np.linspace(.1,.3,20),np.zeros(20))])
def test_core_regression_requires_physical_and_sufficient_pairs(phi,core):
    with pytest.raises(ScienceProblem):evaluate('permeability-regression',dict(porosity=phi,coreK=core),dict(validationFraction=.2),dict(porosity='v/v',coreK='mD'))
