"""Reviewed property semantics shared by API admission and worker execution."""

def basis_role(method,role):
    return role in ('porosity','total','estimates') and (method.startswith(('saturation-','permeability-')) or method in ('porosity-effective','porosity-combine','cutoff-rules','reservoir-summary'))

def validate_basis(method,role,binding,column,parameters):
    from scientific_core import require
    retained=column.get('porosityBasis');declared=binding.get('porosityBasis')
    require(not declared or declared in ('total','effective'),'Choose total or effective porosity.','porosity_basis')
    require(not retained or not declared or retained==declared,'The declared porosity basis conflicts with the retained source.','porosity_basis')
    basis=retained or declared
    if basis_role(method,role):
        require(basis in ('total','effective'),'Review total/effective porosity for '+role+' before calculating. Historical sources need an explicit basis declaration.','porosity_basis')
        expected='total' if method=='porosity-effective' else parameters.get('porosityBasis') if method.startswith('saturation-') else parameters.get('basis') if method=='porosity-combine' else None
        require(not expected or basis==expected,'The input porosity basis does not match this method configuration.','porosity_basis')
    return basis

def validate_bindings(method,parameters,bindings,sources):
    metadata={}
    for role,binding in bindings.items():
        if binding.get('stepId'):continue
        source=sources[binding['datasetId']]
        col=next(c for c in source['columns'] if c['id']==binding['columnId'])
        basis=validate_basis(method,role,binding,col,parameters)
        if basis:metadata[role]=dict(porosityBasis=basis)
    return metadata

def retain_semantics(result,metadata):
    method=result['method'];fields=result.setdefault('seriesMetadata',{})
    for role,meaning in metadata.items():
        if role=='porosity' and role in result['series']:fields.setdefault(role,meaning)
    if method=='log-upscale' and metadata.get('value'):fields['upscaled']=metadata['value']
    if method.startswith('qc-') or method in ('align-curve','depth-match','correction-table','endpoint-proposal'):
        basis=(metadata.get('curve') or {}).get('porosityBasis')
        if basis:
            for name in ('curve','original','proposed','difference'):
                if name in result['series']:fields[name]=dict(porosityBasis=basis)
    if method.startswith('predict-') and metadata.get('target'):
        for name in ('reconstructed','empiricalLower','empiricalUpper'):fields[name]=metadata['target']
    return result


def validate_parameters(method,p):
    from scientific_core import number,require
    if method.startswith('shale-'):require(p['shale']>p['clean'],'The reviewed shale endpoint must exceed the clean endpoint.')
    if method in ('porosity-density','porosity-sonic'):
        matrix,fluid=number(p,'matrix',positive=True),number(p,'fluid',positive=True)
        require(matrix!=fluid,'Matrix and fluid responses must differ.')
    if method=='porosity-effective':number(p,'shalePorosity',0,1)
    if method.startswith('saturation-'):
        for key in ('rw','a','m','n')+ (('rsh',) if method!='saturation-archie' else ()):number(p,key,positive=True)
        require(method!='saturation-simandoux' or p['n']==2,'The implemented Simandoux formulation requires n=2.')
    if method in ('permeability-timur','permeability-coates'):
        for key in ('coefficient','phiExponent','swiExponent'):number(p,key,positive=True)
    if method=='reservoir-summary':
        require(p['base']>p['top'],'The summary base must exceed its top.');number(p,'maxGap',positive=True)
    if method=='cutoff-rules':
        number(p,'minimumBed',low=0);number(p,'maxGap',positive=True)
        require(p['combine'] in ('AND','OR'),'Choose AND or OR for cutoff combination.')
        def rules(items):
            require(isinstance(items,list) and 0<len(items)<=20,'Define 1–20 reviewed cutoff rules.')
            for rule in items:
                require(isinstance(rule,dict) and rule.get('role') in ('vsh','porosity','sw','k') and rule.get('operator') in ('<','<=','>','>='),'Review each cutoff property and operator.')
                number(rule,'value')
        rules(p['rules']);zones=p['zones'];require(isinstance(zones,list) and len(zones)<=100,'Use at most 100 cutoff zones.')
        for i,zone in enumerate(zones):
            require(isinstance(zone,dict),'Each cutoff zone must contain reviewed boundaries and rules.')
            top,base=number(zone,'top'),number(zone,'base');require(base>top,'Review each cutoff zone boundary.');rules(zone['rules'])
            require(not any(other['top']<base and other['base']>top for other in zones[:i]),'Cutoff zones must not overlap.')
