"""Actual owner-scoped two-well/two-zone shale-to-pay checkpoint qualification."""
import hashlib
import json
import sys
from pathlib import Path
from unittest.mock import Mock,patch
import numpy as np
import pytest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
from test_scientific_api import Database,Reference,ROOT
from ingestion_core import column,output_dataset
import main
import scientific_api as science
from scientific_workflow_worker import execute_segment


@pytest.mark.parametrize('reject',[False,True])
def test_complete_two_well_two_zone_chain(tmp_path,reject):
    db=Database();steps=[];zones=[];hashes={};project_root=tmp_path/'owners/owner/projects/project'
    for well,factor in [('A',.3048),('B',1)]:
        unit='ft' if well=='A' else 'm';folder=project_root/'imports'/well
        rows=[[i/factor,20+i,2.32 if well=='A' else 2.2375,10,.2] for i in range(13)]
        cols=[column(name,u,i) for i,(name,u) in enumerate([('DEPTH',unit),('GR','gAPI'),('RHOB','g/cc'),('RT','ohm.m'),('SWI','v/v')])]
        ds=output_dataset(folder,'Controlled '+well,cols,rows);ds.update(active=True,well=well,indexColumnId=cols[0]['id'],references=dict(depthReference='MD'),manifest='owners/owner/projects/project/imports/'+well+'/'+ds['id']+'.json',sourceSha256=hashlib.sha256(json.dumps(rows).encode()).hexdigest())
        db.records[ROOT+'/datasets/'+ds['id']]=ds;hashes[ds['id']]=ds['sourceSha256']
        raw=lambda i:dict(datasetId=ds['id'],columnId=cols[i]['id'],unit=cols[i]['unit'],confirmed=True)
        for z in range(2):
            zid=well+'-Z'+str(z);zones.append(dict(id=zid,name=zid,wellId=well,reference='MD',top=z*6,base=(z+1)*6))
            scope=dict(datasetId=ds['id'],columnId=cols[0]['id'],unit=unit,reference='MD')
            sid=lambda name:name+'-'+zid
            dep=lambda name,out,u:dict(stepId=sid(name),output=out,unit=u,confirmed=True)
            def add(name,method,stage,bindings,parameters):
                selected=dict(stepId=sid('prep'),output='depth',unit='m',reference='MD') if stage=='calibration' or name=='vsh' else scope
                steps.append(dict(id=sid(name),method=method,checkpoint=stage,wellId=well,zoneId=zid,scope=selected,bindings=bindings,parameters=parameters))
            add('prep','qc-smooth','conditioning',dict(depth=raw(0),curve=raw(1)),dict(window=3))
            add('ends','endpoint-proposal','calibration',dict(depth=dep('prep','depth','m'),curve=dep('prep','proposed','gAPI')),dict(top=z*6,base=(z+1)*6))
            add('vsh','shale-linear','evaluation',dict(gr=dep('prep','proposed','gAPI')),dict(clean=0))
            add('phi','porosity-density','evaluation',dict(density=raw(2)),dict(porosityBasis='total'))
            add('eff','porosity-effective','evaluation',dict(total=dep('phi','porosity','v/v'),vsh=dep('vsh','vsh','v/v')),dict(shalePorosity=.1+z*.05))
            add('sw','saturation-archie','evaluation',dict(porosity=dep('eff','effectivePorosity','v/v'),rt=raw(3)),dict(rw=.1,a=1,m=2,n=2,porosityBasis='effective'))
            add('k','permeability-timur','evaluation',dict(porosity=dep('eff','effectivePorosity','v/v'),swi=raw(4)),dict(coefficient=1000,phiExponent=4,swiExponent=2,calibration='Controlled core evidence',applicationBounds=dict(phiLow=.05,phiHigh=.5,swiLow=.1,swiHigh=.8)))
            common=dict(depth=dep('eff','depth','m'),vsh=dep('vsh','vsh','v/v'),porosity=dep('eff','effectivePorosity','v/v'),sw=dep('sw','sw','v/v'),k=dep('k','permeability','mD'))
            for name,role,op,value in [('reservoir','porosity','>',.05),('pay','sw','<',.95)]:
                add(name,'cutoff-rules','evaluation',common,dict(rules=[dict(role=role,operator=op,value=value)],combine='AND',zones=[],minimumBed=0,maxGap=2,depthReference='MD'))
            add('summary','reservoir-summary','evaluation',dict(depth=common['depth'],porosity=common['porosity'],sw=common['sw'],k=common['k'],reservoir=dep('reservoir','qualified','v/v'),pay=dep('pay','qualified','v/v')),dict(depthReference='MD',top=z*6,base=(z+1)*6,maxGap=2))
    steps.sort(key=lambda s:['conditioning','calibration','evaluation'].index(s['checkpoint']))
    definition=dict(revision=0,name='Controlled two-well/two-zone evaluation',steps=steps,zones=zones,projectParameters={'shale-linear':dict(clean=5,shale=100),'porosity-density':dict(matrix=dict(value=2.65,unit='g/cc'),fluid=1000)},wellParameters={'B':{'shale-linear':dict(shale=120)}},zoneParameters={'B-Z1':{'shale-linear':dict(shale=150)}})
    class Blob:
        def __init__(self,path):self.path=tmp_path/path;self.size=self.path.stat().st_size
        def reload(self):pass
        def download_as_bytes(self):return self.path.read_bytes()
    main.app.dependency_overrides[main.current_user]=lambda:dict(uid='owner')
    try:
        with TestClient(main.app) as client,patch.object(main,'_db',db),patch.object(science.firestore,'transactional',lambda f:f),patch('google.auth.default',return_value=(Mock(),None)),patch('google.auth.transport.requests.AuthorizedSession') as dispatch,patch.object(science.storage,'Client') as store,patch.dict('os.environ',STRATAX_DERIVED_BUCKET='fixture'):
            store.return_value.bucket.return_value.blob.side_effect=Blob;dispatch.return_value.post.return_value.json.return_value={}
            response=client.put('/api/projects/project/science/workflows/evaluation',json=definition);assert response.status_code==200,response.text
            parent=client.post('/api/projects/project/science/workflow-runs',json=dict(workflowId='evaluation',revision=1,idempotencyKey='full-evaluation')).json();url='/api/projects/project/science/workflow-runs/'+parent['id']
            for stage in range(3):
                parent=client.get(url).json();response=client.post(url+'/start',json=dict(revision=parent['revision'],idempotencyKey='full-stage-'+str(stage)));assert response.status_code==202,response.text
                rid=response.json()['id'];record=science.restore_value(db.records[ROOT+'/scienceRuns/'+rid]);output=project_root/'science'/rid/record['dispatch'];prefix=output.relative_to(tmp_path).as_posix()
                extra=execute_segment(record,project_root,output,prefix,lambda:False,lambda p:None);manifest=json.loads((output/'manifest.json').read_text())
                science.settle_run(db,Reference(db,ROOT),Reference(db,ROOT+'/scienceRuns/'+rid),Reference(db,'stratax_science_runtime/capacity'),record['dispatch'],'completed',sum(p.stat().st_size for p in output.iterdir()),extra=extra)
                current=client.get('/api/projects/project/science/runs/'+rid).json();decision='reject' if reject and stage==1 else 'accept'
                response=client.post(url+'/checkpoint-review',json=dict(revision=current['revision'],decision=decision,comment='Controlled numerical fixture, not field calibration'));assert response.status_code==200,response.text
                if decision=='reject':
                    assert client.get(url).json()['status']=='rejected';assert not any(ROOT+'/datasets/'+d['id'] in db.records for d in manifest['datasets']);break
                reloaded=client.get('/api/projects/project/science/runs/'+rid+'/result').json();assert len(reloaded['datasets'])==len(manifest['datasets'])
                if stage==2:
                    by_id={s['provenance']['configuration']['id']:s for s in manifest['steps']}
                    for well in ('A','B'):
                        for z in range(2):
                            suffix=well+'-Z'+str(z);vsh=np.array(by_id['vsh-'+suffix]['preview']['vsh']);phi=(.2 if well=='A' else .25)-vsh*(.1+z*.05);sw=np.sqrt(.1/(phi**2*10));k=1000*phi**4/.2**2
                            np.testing.assert_allclose(by_id['sw-'+suffix]['preview']['sw'],sw,rtol=1e-8,atol=1e-10)
                            s=by_id['summary-'+suffix]['summary'];np.testing.assert_allclose([s['netM'],s['payM'],s['phiH'],s['hcph'],s['khMdM']],[5,5,phi[:-1].sum(),(phi[:-1]*(1-sw[:-1])).sum(),k[:-1].sum()],rtol=1e-8,atol=1e-10)
                            assert by_id['eff-'+suffix]['datasets'][0]['columns'][1]['porosityBasis']=='effective'
                            assert by_id['vsh-'+suffix]['provenance']['configuration']['parameterOrigins']['clean']['level']=='step'
                    assert by_id['vsh-B-Z1']['provenance']['configuration']['parameterOrigins']['shale']['level']=='zone'
            assert all(db.records[ROOT+'/datasets/'+did]['sourceSha256']==digest for did,digest in hashes.items())
    finally:main.app.dependency_overrides.clear()
