"""Controlled study metadata shared by actual-route browser lifecycle fixtures."""
import hashlib
import json
from ingestion_core import column,output_dataset

def study(db,record,artifacts):
    steps=[];zones=[]
    for well,factor in [('A',.3048),('B',1)]:
        unit='ft' if well=='A' else 'm';folder=artifacts/'owners/owner/projects/project/imports'/('study-'+well)
        cols=[column(name,u,i) for i,(name,u) in enumerate([('DEPTH',unit),('GR','gAPI'),('RHOB','g/cc'),('RT','ohm.m'),('SWI','v/v')])]
        rows=[[i/factor,20+i,2.32 if well=='A' else 2.2375,10,.2] for i in range(13)]
        ds=output_dataset(folder,'Controlled lifecycle '+well,cols,rows);ds.update(active=True,well=well,indexColumnId=cols[0]['id'],references=dict(depthReference='MD'),manifest='owners/owner/projects/project/imports/study-'+well+'/'+ds['id']+'.json',sourceSha256=hashlib.sha256(json.dumps(rows).encode()).hexdigest())
        db.records[record+'/datasets/'+ds['id']]=ds
        def raw(i):return dict(datasetId=ds['id'],columnId=cols[i]['id'],unit=cols[i]['unit'],confirmed=True)
        for z in range(2):
            zid=well+'-Z'+str(z);zones.append(dict(id=zid,name=zid,wellId=well,reference='MD',top=z*6,base=(z+1)*6));scope=dict(datasetId=ds['id'],columnId=cols[0]['id'],unit=unit,reference='MD')
            def sid(name):return name+'-'+zid
            def dep(name,output,unit):return dict(stepId=sid(name),output=output,unit=unit,confirmed=True)
            def add(name,method,stage,bindings,parameters):
                selected=dict(stepId=sid('prep'),output='depth',unit='m',reference='MD') if stage=='calibration' or name=='vsh' else scope
                steps.append(dict(id=sid(name),method=method,checkpoint=stage,wellId=well,zoneId=zid,scope=selected,bindings=bindings,parameters=parameters))
            add('prep','qc-smooth','conditioning',dict(depth=raw(0),curve=raw(1)),dict(window=3))
            add('ends','endpoint-proposal','calibration',dict(depth=dep('prep','depth','m'),curve=dep('prep','proposed','gAPI')),dict(top=z*6,base=(z+1)*6))
            add('vsh','shale-linear','evaluation',dict(gr=dep('prep','proposed','gAPI')),dict(clean=0))
            add('phi','porosity-density','evaluation',dict(density=raw(2)),dict(porosityBasis='total'))
            add('eff','porosity-effective','evaluation',dict(total=dep('phi','porosity','v/v'),vsh=dep('vsh','vsh','v/v')),dict(shalePorosity=.1+z*.05))
            add('sw','saturation-archie','evaluation',dict(porosity=dep('eff','effectivePorosity','v/v'),rt=raw(3)),dict(rw=.1,a=1,m=2,n=2,porosityBasis='effective'))
            add('k','permeability-timur','evaluation',dict(porosity=dep('eff','effectivePorosity','v/v'),swi=raw(4)),dict(coefficient=1000,phiExponent=4,swiExponent=2,calibration='Controlled core relationship',applicationBounds=dict(phiLow=.05,phiHigh=.5,swiLow=.1,swiHigh=.8)))
            common=dict(depth=dep('eff','depth','m'),vsh=dep('vsh','vsh','v/v'),porosity=dep('eff','effectivePorosity','v/v'),sw=dep('sw','sw','v/v'),k=dep('k','permeability','mD'))
            for name,role,op,value in [('reservoir','porosity','>',.05),('pay','sw','<',.95)]:add(name,'cutoff-rules','evaluation',common,dict(rules=[dict(role=role,operator=op,value=value)],combine='AND',zones=[],minimumBed=0,maxGap=2,depthReference='MD'))
            add('summary','reservoir-summary','evaluation',dict(depth=common['depth'],porosity=common['porosity'],sw=common['sw'],k=common['k'],reservoir=dep('reservoir','qualified','v/v'),pay=dep('pay','qualified','v/v')),dict(depthReference='MD',top=z*6,base=(z+1)*6,maxGap=2))
    steps.sort(key=lambda s:['conditioning','calibration','evaluation'].index(s['checkpoint']))
    return dict(revision=0,name='Controlled lifecycle two wells two zones',steps=steps,zones=zones,projectParameters={'shale-linear':dict(clean=5,shale=100),'porosity-density':dict(matrix=dict(value=2.65,unit='g/cc'),fluid=1000)},wellParameters={'B':{'shale-linear':dict(shale=120)}},zoneParameters={'B-Z1':{'shale-linear':dict(shale=150)}})
