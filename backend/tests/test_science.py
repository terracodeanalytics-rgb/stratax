"""Analytical acceptance fixtures and complete operator dispatch coverage."""
import gzip
import json
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from scientific_catalog import METHODS
from scientific_core import evaluate, ScienceProblem, unit_factor
from scientific_worker import read_inputs, write_result


def fixture(mid):
    n=40;d=np.arange(n,dtype=float);phi=np.linspace(.1,.3,n);sw=np.linspace(.2,.6,n);t=np.linspace(0,1,n)
    spec=METHODS[mid];p={k:v["default"] for k,v in spec["parameters"].items()};units={};a={}
    for item in spec["inputs"]:
        role,dim=item["role"],item["dimension"]
        if dim.endswith('-array'):dim='array'
        units[role]={"length":"m","fraction":"v/v","density":"kg/m3","slowness":"s/m","velocity":"m/s","resistivity":"ohm.m","pressure":"Pa","permeability":"mD","angle":"deg","api":"gAPI","array":"documented response units","numeric":"source units","category":"well ID"}[dim]
        a[role]=d if dim=="length" else phi if dim=="fraction" else np.full(n,2400.) if dim=="density" else np.full(n,.0002) if dim=="slowness" else np.full(n,3000.) if dim=="velocity" else np.full(n,10.) if dim=="resistivity" else 1e6+d*1e4 if dim=="pressure" else 10+d if dim=="permeability" else d if dim=="angle" else 25+d if dim=="api" else np.column_stack([phi,sw]) if dim=="array" else np.array(['A']*30+['B']*10) if dim=="category" else np.arange(n,dtype=float)+1
    if mid.startswith('qc-'):p.update({k:v for k,v in dict(sourceLow=0,sourceHigh=40,targetLow=0,targetHigh=1,bitSize=.2,tolerance=.01,boundary=20).items() if k in p})
    if mid=='facies-rules':p.update(thresholds=[10,20],labels=['A','B','C'])
    if mid=='fluid-indicators':a['densityPorosity']=phi;a['neutronPorosity']=phi-.02
    if mid.startswith('shale-'):p.update(clean=25,shale=100)
    if mid=='porosity-density':p.update(matrix=2650,fluid=1000)
    if mid=='porosity-sonic':p.update(matrix=.00018,fluid=.00062)
    if mid=='porosity-neutron':p.update(scale=1,offset=.01,calibration='Fixture matrix calibration')
    if mid=='porosity-effective':p['shalePorosity']=.1
    if mid.startswith('saturation-'):p['rw']=.08;p.update({'rsh':2} if 'rsh' in p else {})
    if mid=='permeability-regression':a['coreK']=1000*phi**2
    if mid in ('permeability-timur','permeability-coates'):p.update(coefficient=1000,calibration='Fixture core relationship')
    if mid=='mineral-inversion':p.update(matrix=[[1,0],[0,1]],minerals=['A','B']);a['responses']=np.column_stack([phi,1-phi])
    if mid=='nmr-partition':a['spectrum']=np.tile([.05,.1,.05],(n,1));p.update(t2=[10,50,100],coefficient=1);units['spectrum']='v/v'
    if mid in ('core-fit','simulation-compare'):
        a={k:2*d+1 if k in ('log','forecast') else d for k in a};p.update({'case':'fixture-case'} if 'case' in p else {})
    if mid=='height-brooks-corey':a.update(pc=np.linspace(1e4,1e5,n));a['sw']=.1+.9*(a['pc']/5000)**(-.5);p['swr']=.1
    if mid=='height-thomeer':a['pc']=np.linspace(1e4,1e5,n);a['sw']=1-.9*np.exp(-1/np.log(a['pc']/5000));p['swr']=.1
    if mid=='leverett-j':p.update(ift=.03,contactAngle=0)
    if mid=='pressure-gradient':p.update(depthReference='TVDSS',datum='Fixture MSL')
    if mid.startswith('predict-'):a['features']=np.column_stack([d,d**2]);a['target']=2*d+1;p['heldOutWell']='B'
    if mid=='correction-table':p.update(tool='Fixture tool/v1',citation='Authorized linear-response fixture',x=[0,100],delta=[1,2])
    if mid=='cutoff-rules':p.update(rules=[dict(role='porosity',operator='>=',value=.2)])
    if mid=='reservoir-summary':a['reservoir']=np.ones(n);a['pay']=np.ones(n);p.update(depthReference='MD',top=0,base=39,maxGap=2)
    if mid=='seismic-attributes':a['traces']=np.tile(np.sin(np.arange(128)*.2),(20,1));p.update(sampleInterval=.002,domain='TWT')
    if mid=='domain-conversion':p.update(velocity=2000,datum='Fixture time zero');units['axis']='s'
    if mid in ('surface-interpolation','property-kriging'):
        x,y=np.meshgrid(np.arange(5.),np.arange(5.));a.update(x=x.ravel(),y=y.ravel());a['z' if mid=='surface-interpolation' else 'value']=(x+y).ravel();p.update(nx=8,ny=8)
        p.update(dict(crs='EPSG:32632',domain='Depth') if mid=='surface-interpolation' else dict(range=3,variance=1))
    if mid=='log-upscale':p['edges']=[0,10,20,30,39]
    if mid=='elastic-properties':a['vs']=np.full(n,1500.)
    if mid=='gassmann':a['kDry']=np.full(n,1e10);p.update(kMineral=3.7e10,kFluid=2.2e9)
    if mid=='synthetic-seismogram':a['vp']=2000+d*20;p.update(sampleInterval=.002,axisConfirmed=True)
    if mid=='geomechanics-1d':p.update(surfaceStress=1e5,hydrostaticGradient=1e4,normalSonic=.00018,eatonExponent=3,poisson=.25,tectonicStress=1e5)
    if mid=='production-allocation':p.update(zero=0,slope=2,calibration='Fixture spinner table',flowUnit='m3/day')
    if mid=='trajectory-minimum-curvature':a.update(inclination=np.zeros(n),azimuth=np.zeros(n));p.update(northReference='Grid',crs='EPSG:32632',north=0,east=0,tvd=0)
    if mid=='trajectory-clearance':a['planned']=np.column_stack([d,np.zeros(n),d]);a['offset']=a['planned']+[10,0,0];p['threshold']=2;units.update(planned='m',offset='m')
    if mid=='in-place-volumes':p.update(area=1e6,netThickness=10,porosity=.2,sw=.25,fvf=1.2)
    if mid=='volume-uncertainty':p.update(distributions={k:dict(low=v,mode=v,high=v) for k,v in dict(area=1e6,netThickness=10,porosity=.2,sw=.25,fvf=1.2).items()})
    return a,p,units


@pytest.mark.parametrize('mid',list(METHODS))
def test_every_advertised_operator_executes_bounded_fixture(mid):
    a,p,u=fixture(mid);r=evaluate(mid,a,p,u)
    assert r['method']==mid and r['scientificApproval'] is False
    json.dumps(r,allow_nan=False)
    assert r['series'] or r['summary']


def test_analytical_petrophysics_and_unclipped_provenance():
    assert evaluate('shale-linear',{'gr':[0,50,100]},dict(clean=0,shale=100),{'gr':'gAPI'})['series']['vsh']==[0,.5,1]
    r=evaluate('porosity-density',{'density':[2.32]},dict(matrix=2650,fluid=1000),{'density':'g/cm3'})
    assert r['series']['porosity'][0]==pytest.approx(.2)
    r=evaluate('saturation-archie',dict(porosity=[.2,.2],rt=[10,0]),dict(rw=.1,a=1,m=2,n=2),dict(porosity='v/v',rt='ohm.m'))
    assert r['series']['sw'][0]==pytest.approx(.5)
    assert r['series']['sw'][1] is None
    for model in ['indonesian','simandoux']:
        r=evaluate('saturation-'+model,dict(porosity=[.2],rt=[10],vsh=[0]),dict(rw=.1,rsh=2,a=1,m=2,n=2),dict(porosity='v/v',rt='ohm.m',vsh='v/v'))
        assert r['series']['sw'][0]==pytest.approx(.5)


def test_vertical_and_constant_inclination_minimum_curvature():
    units=dict(md='m',inclination='deg',azimuth='deg');p=dict(northReference='Grid',crs='EPSG:32632',north=0,east=0,tvd=0,maxDls=3)
    r=evaluate('trajectory-minimum-curvature',dict(md=[0,100],inclination=[0,0],azimuth=[0,0]),p,units)
    assert r['series']['tvd']==pytest.approx([0,100]);assert r['series']['north']==[0,0]
    r=evaluate('trajectory-minimum-curvature',dict(md=[0,100],inclination=[60,60],azimuth=[90,90]),p,units)
    assert r['series']['east'][1]==pytest.approx(100*np.sin(np.pi/3));assert r['series']['tvd'][1]==pytest.approx(50)


def test_brooks_corey_recovers_known_parameters():
    a,p,u=fixture('height-brooks-corey');r=evaluate('height-brooks-corey',a,p,u)
    assert r['summary']['lambdaExponent']==pytest.approx(.5)
    assert r['summary']['entryPressurePa']==pytest.approx(5000)


def test_constant_volume_and_seeded_uncertainty_conventions():
    a,p,u=fixture('in-place-volumes');expected=1e6*10*.2*.75/1.2
    assert evaluate('in-place-volumes',a,p,u)['summary']['standardVolumeM3']==pytest.approx(expected)
    a,p,u=fixture('volume-uncertainty');r=evaluate('volume-uncertainty',a,p,u)
    assert r['summary']['p90Exceedance']==pytest.approx(expected)
    assert r==evaluate('volume-uncertainty',a,p,u)


def test_qc_preserves_nulls_and_does_not_bridge_large_gaps():
    r=evaluate('qc-interpolate',dict(depth=[0,1,2,10,11],curve=[1,None,3,None,5]),dict(maxGap=3),dict(depth='m',curve='gAPI'))
    assert r['series']['proposed']==[1,2,3,None,5]
    assert r['series']['original']==[1,None,3,None,5]


def test_thickness_summary_accounts_for_missing_intervals():
    a=dict(depth=[0,1,10,11],porosity=[.2]*4,sw=[.5]*4,k=[10]*4,reservoir=[1]*4,pay=[1]*4)
    r=evaluate('reservoir-summary',a,dict(depthReference='MD',top=0,base=11,maxGap=2),dict(depth='m',porosity='v/v',sw='v/v',k='mD',reservoir='v/v',pay='v/v'))
    assert r['summary']['grossM']==11 and r['summary']['payM']==2
    assert r['summary']['hcph']==pytest.approx(.2)


@pytest.mark.parametrize('mutate',[lambda a,p,u:u.update(gr='unknown'),lambda a,p,u:p.update(shale=0),lambda a,p,u:a.update(gr=[[1,2]])])
def test_unsafe_or_ambiguous_inputs_block(mutate):
    a,p,u=fixture('shale-linear');mutate(a,p,u)
    with pytest.raises(ScienceProblem):evaluate('shale-linear',a,p,u)


def test_prediction_requires_independent_wells():
    a,p,u=fixture('predict-ridge');a['wellGroup']=np.array(['A']*40)
    with pytest.raises(ScienceProblem):evaluate('predict-ridge',a,p,u)


def test_actual_artifact_roundtrip_and_path_boundary(tmp_path):
    a,p,u=fixture('shale-linear');r=evaluate('shale-linear',a,p,u)
    total,_=write_result(tmp_path/'science', 'owners/o/projects/p/science/r/d', 'run-abc123',r,{}, {})
    manifest=json.loads((tmp_path/'science'/'manifest.json').read_text())
    ds=manifest['datasets'][0];ds['manifest']='science/'+Path(ds['manifest']).name
    bindings={'curve':dict(datasetId=ds['id'],columnId='column-1',unit='v/v')}
    values,units=read_inputs(tmp_path,{ds['id']:ds},bindings)
    assert values['curve']==r['series']['vsh'] and total>0
    ds['manifest']='../secret.json'
    with pytest.raises(ScienceProblem):read_inputs(tmp_path,{ds['id']:ds},bindings)


def test_units_no_silent_unknown_conversion():
    assert unit_factor('length','ft')==.3048
    assert unit_factor('pressure','psi')==pytest.approx(6894.757293168)
    with pytest.raises(ScienceProblem):unit_factor('length','degrees')


def test_full_resolution_seismic_selection_not_decimated_preview(tmp_path):
    import segyio
    from scientific_worker import seismic_section
    path=tmp_path/'section.sgy';spec=segyio.spec();spec.sorting=2;spec.format=5;spec.samples=list(range(128));spec.ilines=[10,20];spec.xlines=[1,2]
    with segyio.create(str(path),spec) as file:
        for i in range(4):
            file.header[i]={189:10 if i<2 else 20,193:i%2+1,21:i}
            file.trace[i]=np.arange(128,dtype=np.float32)+i*1000
    _,p,_=fixture('seismic-attributes');p.update(selection='inline',sectionValue=20,firstTrace=0,traceCount=2,firstSample=10,sampleCount=30)
    values,meta=seismic_section(path,p,{})
    assert values.shape==(2,30) and values[0,0]==2010 and values[1,-1]==3039
    assert meta['traceHeaders'][0]['inline']==20
    p['sampleCount']=200
    with pytest.raises(ScienceProblem):seismic_section(path,p,{})
