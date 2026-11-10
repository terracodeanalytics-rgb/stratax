const test=require('node:test'),assert=require('node:assert/strict');
test('Display conversion is evaluated once per station and preserves null gaps',async()=>{
 const {curvePath}=await import('../frontend/dist/well-canvas-model.js');let conversions=0;
 const path=curvePath([[0,0],[1,1],[2,null],[3,3]],0,1,[0,3],Object.assign([0,3],{reverse:false}),30,30,0,1,z=>{conversions++;return z;});
 assert.equal(path,'M0.00,0.00L10.00,10.00M30.00,30.00');assert.equal(conversions,4);
});
test('Scalar display eligibility excludes array channels but retains null scalar evidence',async()=>{
 const {numericColumns}=await import('../frontend/dist/well-canvas-model.js');
 const dataset={columns:[{id:'depth'},{id:'array',valueType:'array'},{id:'historical-array'},{id:'scalar'}],preview:[[0,[1,2],[3,4],null]]};
 assert.deepEqual(numericColumns(dataset).map(c=>c.id),['depth','scalar']);
});
test('Workflow imports retain source identity, require review and never mutate the original',async()=>{
 const {importWorkflowDefinition,bindingKey}=await import('../frontend/dist/workflow-drafts.js');
 const definition={id:'saved',revision:8,name:'Controlled',steps:[{id:'s',reviewed:true,bindings:{phi:{stepId:'prior',output:'porosity',unit:'v/v',porosityBasis:'total',confirmed:true}}}]};
 const imported=importWorkflowDefinition({projectId:'p',definition},'p');assert.equal(imported.id,undefined);assert.equal(imported.revision,0);assert.equal(imported.steps[0].reviewed,false);assert.equal(imported.steps[0].bindings.phi.confirmed,false);assert.equal(imported.steps[0].bindings.phi.porosityBasis,'total');assert.equal(definition.steps[0].bindings.phi.confirmed,true);
 assert.equal(bindingKey(imported.steps[0].bindings.phi),bindingKey({...definition.steps[0].bindings.phi,confirmed:false}));
 assert.throws(()=>importWorkflowDefinition({projectId:'other',definition},'p'),/another project/);assert.throws(()=>importWorkflowDefinition({name:'Invalid',steps:{}},'p'),/at most 100/);
 assert.deepEqual(imported.zones,[]);assert.deepEqual(imported.outputSelections,[]);assert.deepEqual(imported.projectParameters,{});
 assert.throws(()=>importWorkflowDefinition({name:'Invalid',steps:[null]},'p'),/step must be an object/);assert.throws(()=>importWorkflowDefinition({name:'Invalid',steps:[],zones:{}},'p'),/must be a list/);
});
