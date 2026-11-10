"""Independent evaluation contracts and retained UI-facing artifact semantics."""
import json
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import numpy as np
import pytest
from scientific_core import evaluate, ScienceProblem
from scientific_worker import write_result

def close(actual,expected):np.testing.assert_allclose(actual,expected,rtol=1e-8,atol=1e-10,equal_nan=True)

@pytest.mark.parametrize('model',['linear','larionov-tertiary','larionov-older','stieber','clavier'])
def test_shale_models(model):
    x=np.array([0,.25,.5,.75,1]);expected={'linear':x,'larionov-tertiary':.083*(2**(3.7*x)-1),'larionov-older':.33*(2**(2*x)-1),'stieber':x/(3-2*x),'clavier':1.7-np.sqrt(3.38-(x+.7)**2)}[model]
    r=evaluate('shale-'+model,dict(gr=[-20,0,25,50,75,100,120,None]),dict(clean=0,shale=100),dict(gr='gAPI'))
    close(r['series']['vsh'][1:6],np.clip(expected,0,1));assert r['summary']['outsideEndpointRange']==2 and r['series']['vsh'][-1] is None

@pytest.mark.parametrize('method,raw,unit,parameters',[('porosity-density',2.32,'g/cm3',dict(matrix=2650,fluid=1000)),('porosity-sonic',.00014,'s/m',dict(matrix=.0001,fluid=.0003)),('porosity-neutron',20,'%',dict(scale=1,offset=0,calibration='Controlled fixture'))])
def test_porosity_basis_artifact(method,raw,unit,parameters,tmp_path):
    role={'porosity-density':'density','porosity-sonic':'slowness','porosity-neutron':'neutron'}[method]
    r=evaluate(method,{role:[raw]},parameters|dict(porosityBasis='total'),{role:unit});close(r['series']['porosity'],[.2])
    write_result(tmp_path,'owners/o/projects/p/science/r/d','run-fixture',r,{},{});ds=json.loads((tmp_path/'manifest.json').read_text())['datasets'][0]
    assert ds['columns'][0]['porosityBasis']=='total'

@pytest.mark.parametrize('model',['archie','indonesian','simandoux'])
def test_saturation_nonzero_shale(model):
    phi=.2;rw=.1;rt=10;v=.25;rsh=2
    inputs=dict(porosity=[phi],rt=[rt]);units=dict(porosity='v/v',rt='ohm.m')
    if model!='archie':inputs['vsh']=[v];units['vsh']='v/v'
    p=dict(rw=rw,a=1,m=2,n=2,porosityBasis='total')
    if model!='archie':p['rsh']=rsh
    expected=np.sqrt(rw/(phi**2*rt)) if model=='archie' else (1/(np.sqrt(rt)*(v**(1-v/2)/np.sqrt(rsh)+np.sqrt(phi**2/rw)))) if model=='indonesian' else (-v*rw/(phi**2*rsh)+np.sqrt((v*rw/(phi**2*rsh))**2+4*rw/(phi**2*rt)))/2
    close(evaluate('saturation-'+model,inputs,p,units)['series']['swUnclipped'],[expected])

def cutoff(depth,minimum=0):
    return evaluate('cutoff-rules',dict(depth=depth,vsh=[.1]*len(depth),porosity=[.2]*len(depth),sw=[.5]*len(depth),k=[10]*len(depth)),dict(rules=[dict(role='porosity',operator='>=',value=.2)],combine='AND',zones=[],minimumBed=minimum,maxGap=2,depthReference='MD'),dict(depth='m',vsh='v/v',porosity='v/v',sw='v/v',k='mD'))

def test_minimum_bed_does_not_bridge_gap():
    assert cutoff([0,1,10,11],0)['units']['depth']=='m'
    assert cutoff([0,1,10,11],2)['series']['qualified']==[0,0,0,0]
    assert cutoff([0,1,2],2)['series']['qualified']==[1,1,1]
    assert cutoff([0,1,10,11],0)['series']['qualified']==[1,1,1,1]

def summary(phi):
    return evaluate('reservoir-summary',dict(depth=[0,1,10,11],porosity=phi,sw=[.5]*4,k=[10]*4,reservoir=[1]*4,pay=[1]*4),dict(depthReference='MD',top=0,base=11,maxGap=2),dict(depth='m',porosity='v/v',sw='v/v',k='mD',reservoir='v/v',pay='v/v'))

def test_summary_analytical():
    s=summary([.2]*4)['summary'];close([s[k] for k in ['netM','payM','ntg','phiH','hcph','khMdM']],[2,2,2/11,.4,.2,20])

def test_invalid_porosity_excluded_and_counted():
    s=summary([1.2,.2,.2,.2])['summary'];close([s['phiH'],s['hcph'],s['porosityCoverageM']],[.2,.1,1]);assert s['invalidDomainRows']['porosity']==1

def test_unknown_basis_and_conflict():
    from scientific_evaluation import validate_basis
    with pytest.raises(ScienceProblem):validate_basis('saturation-archie','porosity',{}, {},dict(porosityBasis='total'))
    with pytest.raises(ScienceProblem):validate_basis('saturation-archie','porosity',dict(porosityBasis='effective'),dict(porosityBasis='total'),dict(porosityBasis='total'))

def test_summary_rejects_pay_outside_reservoir():
    with pytest.raises(ScienceProblem):evaluate('reservoir-summary',dict(depth=[0,1],porosity=[.2]*2,sw=[.5]*2,k=[10]*2,reservoir=[0,1],pay=[1,1]),dict(depthReference='MD',top=0,base=1,maxGap=2),dict(depth='m',porosity='v/v',sw='v/v',k='mD',reservoir='v/v',pay='v/v'))


def test_upscaled_cells_retain_index(tmp_path):
    r=evaluate('log-upscale',dict(depth=[0,1,10,11],value=[10,100,30,40]),dict(edges=[0,5,11],maxGap=2),dict(depth='m',value='gAPI'))
    write_result(tmp_path,'owners/o/projects/p/science/r/d','run-fixture',r,{},dict(verifiedIndexReference='MD'))
    ds=json.loads((tmp_path/'manifest.json').read_text())['datasets'][0]
    assert ds['columns'][0]['id']==ds['indexColumnId'] and ds['columns'][0]['mnemonic']=='cellTop'
    assert ds['references']['depthReference']=='MD' and ds['indexRange']==[0,5]


@pytest.mark.parametrize('gap,expected',[(1.999,0),(2,4),(2.001,4)])
def test_minimum_bed_gap_boundary(gap,expected):
    r=evaluate('cutoff-rules',dict(depth=[0,2,4],vsh=[.1]*3,porosity=[.2]*3,sw=[.5]*3,k=[10]*3),dict(rules=[dict(role='porosity',operator='>',value=.1)],combine='AND',minimumBed=4,maxGap=gap,zones=[],depthReference='MD'),dict(depth='m',vsh='v/v',porosity='v/v',sw='v/v',k='mD'))
    assert sum(r['series']['qualified'])==(3 if expected else 0)


@pytest.mark.parametrize('declared,retained,status',[('total',None,200),(None,None,400),('effective','total',400),('total','total',200)])
def test_actual_admission_porosity_basis(declared,retained,status):
    from test_scientific_api import Database,ROOT
    from fastapi.testclient import TestClient
    from unittest.mock import patch
    import main
    db=Database();ds=db.records[ROOT+'/datasets/source'];ds['columns']=[dict(id='phi',unit='v/v'),dict(id='rt',unit='ohm.m')]
    if retained:ds['columns'][0]['porosityBasis']=retained
    bindings=dict(porosity=dict(datasetId='source',columnId='phi',unit='v/v',confirmed=True,porosityBasis=declared),rt=dict(datasetId='source',columnId='rt',unit='ohm.m',confirmed=True))
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
    try:
        with TestClient(main.app) as client,patch.object(main,'_db',db):
            response=client.post('/api/projects/project/science/validate',json=dict(revision=0,method='saturation-archie',bindings=bindings,parameters=dict(rw=.1,porosityBasis='total')))
            assert response.status_code==status,response.text
    finally:main.app.dependency_overrides.clear()


@pytest.mark.parametrize('method,changes',[('shale-linear',dict(clean=100,shale=100)),('porosity-density',dict(matrix=1000,fluid=1000)),('saturation-simandoux',dict(n=3)),('saturation-archie',dict(rw=0)),('permeability-timur',dict(coefficient=-1)),('reservoir-summary',dict(base=0,top=1)),('cutoff-rules',dict(maxGap=0))])
def test_source_independent_errors_rejected_before_dispatch(method,changes):
    from test_science import fixture
    from scientific_api import validate_parameters
    _,p,_=fixture(method)
    def fail(status,code,message):raise ScienceProblem(code,message)
    with pytest.raises(ScienceProblem):validate_parameters(method,p|changes,fail)


@pytest.mark.parametrize('missing,expected',[('strict',None),('renormalize',.2)])
def test_combination_excludes_unphysical_estimates(missing,expected):
    r=evaluate('porosity-combine',dict(estimates=[[.2,1.2],[.1,.3]]),dict(weights=[1,1],basis='total',missing=missing),dict(estimates='v/v'))
    assert r['series']['porosity'][0]==expected;close([r['series']['porosity'][1]],[.2]);assert r['summary']['invalidDomainRows']['estimates']==1


def test_effective_porosity_preserves_raw_and_excludes_bad_total():
    r=evaluate('porosity-effective',dict(total=[.2,1.2],vsh=[.4,.4]),dict(shalePorosity=.6),dict(total='v/v',vsh='v/v'))
    close([r['series']['effectivePorosity'][0]],[-.04]);assert r['series']['effectivePorosity'][1] is None and r['summary']['invalidDomainRows']['total']==1


@pytest.mark.parametrize('operator,expected',[('<',[1,0,0]),('<=',[1,1,0]),('>',[0,0,1]),('>=',[0,1,1])])
def test_cutoff_operator_boundaries(operator,expected):
    a=dict(depth=[0,1,2],vsh=[.1]*3,porosity=[.1,.2,.3],sw=[.5]*3,k=[10]*3)
    p=dict(rules=[dict(role='porosity',operator=operator,value=.2)],combine='AND',zones=[],minimumBed=0,maxGap=2,depthReference='MD');u=dict(depth='m',vsh='v/v',porosity='v/v',sw='v/v',k='mD')
    assert evaluate('cutoff-rules',a,p,u)['series']['qualified']==expected
    p.update(rules=[dict(role='porosity',operator='>=',value=.2)],zones=[dict(top=1,base=2,rules=[dict(role='porosity',operator='>',value=.2)])])
    assert evaluate('cutoff-rules',a,p,u)['series']['qualified']==[0,0,1]


def test_saturation_retains_unclipped_and_excludes_invalid():
    r=evaluate('saturation-archie',dict(porosity=[.2,1.2,0,None],rt=[.01,10,10,10]),dict(rw=.1,a=1,m=2,n=2,porosityBasis='total'),dict(porosity='v/v',rt='ohm.m'))
    close([r['series']['swUnclipped'][0]],[np.sqrt(250)]);assert r['series']['sw']==[1,None,None,None] and r['summary']['invalidDomainRows']['porosity']==2


@pytest.mark.parametrize('method,role,output',[('pickett-fit','porosity','porosity'),('log-upscale','value','upscaled'),('endpoint-proposal','curve','curve')])
def test_retained_property_semantics_for_copied_and_upscaled_values(method,role,output,tmp_path):
    from test_science import fixture
    from scientific_evaluation import retain_semantics
    a,p,u=fixture(method)
    if method!='pickett-fit':a[role]=np.linspace(.1,.3,len(a[role]));u[role]='v/v'
    r=retain_semantics(evaluate(method,a,p,u),{role:dict(porosityBasis='total'),'depth':dict(porosityBasis='total')})
    assert 'depth' not in r['seriesMetadata']
    write_result(tmp_path,'owners/o/projects/p/science/r/d','run-semantic',r,{},dict(verifiedIndexReference='MD'))
    ds=json.loads((tmp_path/'manifest.json').read_text())['datasets'][0]
    assert next(c for c in ds['columns'] if c['mnemonic']==output)['porosityBasis']=='total'
