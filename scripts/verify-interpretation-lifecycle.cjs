const assert=require('node:assert/strict'),fs=require('node:fs');
const fromZip=process.argv.includes('--from-zip');
const evidence=process.env.STRATAX_LIFECYCLE_EVIDENCE||(fromZip?'.release/petrophysics-zip-to-export':'.release/interpretation-buttons-20261108');
let app;
(async()=>{
 fs.mkdirSync(evidence,{recursive:true});
 const env={MANUAL_FIXTURE_DISPATCH:'1',...(fromZip?{CLOUD_COPY_FIXTURE:'1',STRATAX_AUTOMATIC_ZIP:'1',MAP_ONLY_FIXTURE:'1'}:{})};
 app=await require('./local-science-browser.cjs').start({evidence,nativeImports:fromZip,env});const {page}=await app.createPage();
 let aliases={A:'A',B:'B'};
 if(fromZip){
  const {definition,wells}=await require('./petrophysics-zip-fixture.cjs').importStudy(app,page,evidence);
  app.data.workflow=definition;
  aliases=Object.fromEntries(Object.entries(wells).map(([name,dataset])=>[name,dataset.well]));
  await page.evaluate(()=>{location.hash='interpretation';});
  await page.locator('.iw').waitFor();
 }
 const coverage=fromZip?null:await require('./interpretation-control-coverage.cjs').install(page,evidence+'/workflow-controls.json');
 // This page was already loaded by the fixture factory; reload to install the DOM observer.
 await page.reload();await page.locator('.iw').waitFor();const checks=[],failures=[];let workflowId,mainRun;
 const close=async()=>{if(await page.locator('#dialog[open]').count())await page.locator('#dialog [data-close]').click();};
 const action=async id=>{await close();await page.locator('[data-pp-tab=Workflows]').click();const sel=`[data-pp-action="${id}"]`;if(!await page.locator(sel+':visible').count())await page.locator('.pp-group-compact').filter({has:page.locator(sel)}).first().locator('summary').click();await page.locator(sel+':visible').first().click();};
 const json=async value=>{const input=page.locator('#pp-workflow-json');const details=page.locator('#pp-workflow details').filter({has:input});if(!await input.isVisible())await details.locator('summary').first().click();if(value!==undefined)await input.fill(typeof value==='string'?value:JSON.stringify(value));return input;};
 const open=async(reset=true)=>{await action('workflows');await page.locator(`[data-workflow="${workflowId}"]`).click();await page.locator('#pp-workflow').waitFor();if(reset&&await page.locator('#pp-workflow-reload').count()){await page.locator('#pp-workflow-reload').click();await page.locator('#pp-workflow').waitFor();}};
 const details=async id=>{await action('runs');await page.locator(`[data-workflow-run="${id}"]`).click();await page.locator('#pp-reload-segment').waitFor();};
 const refresh=async()=>{await page.locator('#pp-reload-segment').click();await page.locator('#pp-reload-segment').waitFor();};
 let guidedRun=false;const newRun=async()=>{if(!guidedRun){guidedRun=true;await close();await page.locator('[data-pp-tab=Home]').click();await page.locator('[data-pp-action=evaluate]:visible').click();await page.locator('[data-guide-action=runs]').click();}else await action('runs');await page.locator('#pp-new-run').click();const before=await app.science('/workflow-runs');await page.locator(`[data-start-definition="${workflowId}"]`).click();await page.locator('#pp-run-segment').waitFor();const after=await app.science('/workflow-runs');const run=after.runs.find(r=>!before.runs.some(p=>p.id===r.id));assert.ok(run);return run.id;};
 const start=async id=>{await details(id);await page.locator('#pp-run-segment').click();await page.locator('#pp-cancel-segment').waitFor();const run=await app.science('/workflow-runs/'+id);assert.equal(run.segment.status,'queued');return run.segment.id;};
 const complete=async(id,runId,{fail=false,cancel=false}={})=>{assert.equal((await app.control({action:'begin',runId,fail})).status,'running');await refresh();if(cancel){await page.locator('#pp-cancel-segment').click();await page.waitForFunction(()=>document.querySelector('#dialog')?.innerText.includes('cancelling'));assert.equal((await app.science('/runs/'+runId)).status,'cancelling');}await app.control({action:'release',runId});await refresh();return app.science('/runs/'+runId);};
 const review=async(id,decision='accept')=>{await details(id);await page.locator('#pp-review-segment').click();await page.locator('#iw-review-form').waitFor();await page.locator('#iw-review-form [name=decision]').selectOption(decision);await page.locator('#iw-review-form [name=comment]').fill('Controlled local workflow lifecycle review; not field qualification');await page.locator('#iw-review-form [name=reviewed]').check();await page.locator('#iw-review-form button').click();await page.waitForFunction(()=>!document.querySelector('#dialog').open);};
 const download=async selector=>{const waiting=page.waitForEvent('download');await page.locator(selector).click();const file=await waiting,chunks=[];for await(const part of await file.createReadStream())chunks.push(part);return Buffer.concat(chunks).toString('utf8');};
 async function test(name,fn){console.log('Lifecycle: '+name);await close();await coverage.start(name);try{await fn();checks.push(name);coverage.pass();}catch(error){failures.push({name,error:String(error.stack),message:await page.locator('#pp-workflow-message').textContent().catch(()=>null),toast:await page.locator('#toast').textContent().catch(()=>null)});console.log('FAILED '+name+': '+error.message.slice(0,220));}finally{await close();coverage.save();}}
 const verifySummaryExport=async()=>{
   const finished=await app.science('/workflow-runs/'+mainRun),runId=finished.checkpoints[2].runId;
   const result=await app.science('/runs/'+runId+'/result');
   const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-8,`${actual} differs from ${expected}`);
   const average=values=>values.reduce((sum,value)=>sum+value,0)/values.length;
   for(const well of ['A','B'])for(const zone of [0,1]){
    const top=zone*6,shaleEndpoint=well==='A'?100:zone===0?120:150;
    const effective=Array.from({length:5},(_,i)=>{
     const gamma=20+top+i+(i===0?1/3:0);
     return (well==='A'?0.2:0.25)-(gamma/shaleEndpoint)*(0.1+zone*0.05);
    });
    const summary=result.summary[`summary-${well}-Z${zone}`];
    for(const [field,expected] of Object.entries({grossM:6,netM:5,payM:5,ntg:5/6,porosityWeighted:average(effective),swWeighted:average(effective.map(phi=>0.1/phi)),kWeighted:average(effective.map(phi=>1000*phi**4/0.2**2))}))near(summary[field],expected);
   }
   const guide=page.locator('.pp-study-workflow');
   if(await guide.getAttribute('open')===null)await guide.locator('summary').click();
   await guide.locator('[data-study-stage=summary]').click();
   await guide.locator('[data-pp-action=report]').click();
   const form=page.locator('#pp-report');
   await form.waitFor();
   for(const option of await form.locator('[name=run]').all())await option.setChecked(await option.getAttribute('value')===runId);
   const csv=await download('#pp-report [value=csv]');
   const summaryField=csv.split('\r\n')[1].match(/^"[^\"]*","[^\"]*","((?:[^\"]|"")*)",/)[1];
   assert.deepEqual(JSON.parse(summaryField.replaceAll('""','"')),result.summary);
   const zonal=await download('#pp-report [value=zonal]');
   const [, ...rows]=zonal.split('\r\n').map(row=>row.slice(1,-1).split('","'));
   assert.equal(rows.length,4);
   for(const [accepted,well,zone,reference,top,base,gross,net,pay,ntg,phi,sw,k,coverage,denominator] of rows){
    assert.equal(accepted,runId);
    assert.equal(well,aliases[zone.split('-')[0]]);
    assert.equal(reference,'MD');
    const summary=result.summary['summary-'+zone];
    assert.deepEqual([top,base,gross,net,pay,ntg,phi,sw,k,coverage,denominator].map(Number),[summary.topM,summary.baseM,summary.grossM,summary.netM,summary.payM,summary.ntg,summary.porosityWeighted,summary.swWeighted,summary.kWeighted,summary.depthCoverage,summary.ntgDenominatorM]);
   }
 };
 try{
  if(fromZip){
   workflowId='retained-zip-study';
   const saved=await app.science('/workflows/'+workflowId,app.data.workflow,'PUT');
   const create=key=>app.science('/workflow-runs',{workflowId,revision:saved.revision,idempotencyKey:key});
   const checkpoint=async(id,key,decision)=>{
    const path='/workflow-runs/'+id,current=await app.science(path);
    const run=await app.science(path+'/start',{revision:current.revision,idempotencyKey:key});
    await app.control({action:'begin',runId:run.id});
    await app.control({action:'release',runId:run.id});
    const completed=await app.science('/runs/'+run.id);
    assert.equal(completed.status,'completed',JSON.stringify(completed));
    const result=await app.science('/runs/'+run.id+'/result');
    await app.science(path+'/checkpoint-review',{revision:completed.revision,decision,comment:'Controlled ZIP fixture'});
    return result;
   };
   checks.push('ZIP upload, retained well mapping, map handoff and crossplot evidence');
   const rejected=await create('zip-rejected');
   const rejectedPreview=await checkpoint(rejected.id,'zip-rejected-condition','reject');
   assert.equal((await app.science('/workflow-runs/'+rejected.id)).status,'rejected');
   const afterRejection=await app.info();
   assert.ok(rejectedPreview.datasets.every(dataset=>!afterRejection.datasets.some(active=>active.id===dataset.id)));
   checks.push('Rejected conditioning stays out of the active curves');
   const study=await create('zip-reviewed-study');
   mainRun=study.id;
   const conditioned=await checkpoint(mainRun,'zip-condition','accept');
   assert.ok(conditioned.datasets.length);
   const afterAcceptance=await app.info();
   assert.ok(conditioned.datasets.every(dataset=>afterAcceptance.datasets.some(active=>active.id===dataset.id)));
   await page.reload();
   await page.locator('.iw').waitFor();
   assert.equal((await app.science('/workflow-runs/'+mainRun)).checkpointIndex,1);
   await checkpoint(mainRun,'zip-calibration','accept');
   await checkpoint(mainRun,'zip-evaluation','accept');
   checks.push('Reviewed conditioning, calibration and evaluation use the retained LAS datasets across reload');
   await verifySummaryExport();
   checks.push('Exported four reviewed intervals and matched independent thickness and average values');
   const revised=structuredClone(saved);
   delete revised.id;delete revised.updatedAt;
   revised.zones[0].top+=0.25;
   await app.science('/workflows/'+workflowId,revised,'PUT');
   const finished=await app.science('/workflow-runs/'+mainRun);
   assert.equal(finished.stale,true);
   assert.equal((await app.science('/runs/'+finished.checkpoints[2].runId)).stale,true);
   checks.push('Changed zone flags the previously reviewed export source for review');
   assert.deepEqual(app.errors,[]);
   console.log(JSON.stringify({passed:checks.length,checks,pageErrors:app.errors}));
   return;
  }
  await test('Create, validate and save actual two-well/two-zone workflow',async()=>{await action('workflow');await json(app.data.workflow);await page.locator('#pp-workflow [value=validate]').click();await page.locator('#pp-effective-parameters').waitFor();assert.match(await page.locator('#pp-effective-parameters').innerText(),/suppliedUnit|zone/);await page.locator('#pp-workflow [value=save]').click();await page.waitForFunction(()=>document.querySelector('#pp-workflow-json')?.value.includes('"revision": 1'));const definitions=await app.science('/workflows');workflowId=definitions.workflows.find(w=>w.name===app.data.workflow.name).id;});
  assert.ok(workflowId,'A saved definition is required for the following lifecycle checks');
  await test('Saved structured editor preserves every private and external mapping',async()=>{await open();for(const row of await page.locator('[data-step]').all())for(const select of await row.locator('[data-binding-role]').all())assert.notEqual(await select.inputValue(),'','Saved binding lost in '+await row.getAttribute('data-step'));await page.locator('#pp-workflow [value=validate]').click();await page.locator('#pp-effective-parameters').waitFor();});
  await test('Workflow drafts survive close/reopen and invalid JSON is retained',async()=>{await open();await page.locator('#pp-workflow [name=name]').fill('Retained unsaved draft');await close();await open(false);assert.equal(await page.locator('#pp-workflow [name=name]').inputValue(),'Retained unsaved draft');await json('{ invalid controlled draft');await close();await open(false);assert.equal(await (await json()).inputValue(),'{ invalid controlled draft');});
  await test('Structured definition file export/import are usable controls',async()=>{await open();assert.equal(await page.locator('#pp-workflow-export').count(),1);const text=await download('#pp-workflow-export');const value=JSON.parse(text);assert.ok((value.definition||value).steps.length);const choosing=page.waitForEvent('filechooser');await page.locator('#pp-workflow-import').click();await (await choosing).setFiles({name:'controlled-workflow.json',mimeType:'application/json',buffer:Buffer.from(text)});await page.waitForFunction(()=>document.querySelector('#pp-workflow-message')?.textContent.includes('review'));assert.ok((await (await json()).inputValue()).includes('"confirmed": false'));});
  await test('Revision conflict preserves draft and exposes saved-revision recovery',async()=>{await open();const original=await app.science('/workflows/'+workflowId),draft=structuredClone(original);delete draft.id;delete draft.updatedAt;draft.name='Retained conflict draft';await json(draft);await app.control({action:'conflict',workflowId});await page.locator('#pp-workflow [value=save]').click();await page.waitForFunction(()=>document.querySelector('#pp-workflow-message')?.textContent.includes('changed elsewhere'));assert.match(await (await json()).inputValue(),/Retained conflict draft/);await close();await open(false);assert.match(await (await json()).inputValue(),/Retained conflict draft/);assert.equal(await page.locator('#pp-workflow-reload').count(),1);await page.locator('#pp-workflow-reload').click();await page.waitForFunction(revision=>JSON.parse(document.querySelector('#pp-workflow-json').value).revision===revision,original.revision+1);assert.equal(JSON.parse(await (await json()).inputValue()).revision,original.revision+1);});
  await test('Cross-well mapping proposals require fresh review and preserve the saved definition',async()=>{await open();const saved=await app.science('/workflows/'+workflowId),one=structuredClone(saved);one.steps=one.steps.filter(step=>step.wellId===aliases.A);one.outputSelections=[];await json(one);await page.locator('#pp-workflow-well').selectOption(aliases.B);await page.locator('#pp-workflow-clone').click();const proposed=JSON.parse(await (await json()).inputValue());assert.equal(proposed.steps.filter(step=>step.wellId===aliases.B).length,one.steps.length);assert.ok(proposed.steps.filter(step=>step.wellId===aliases.B).every(step=>step.reviewRequired&&!step.reviewed&&Object.values(step.bindings).every(binding=>!binding.confirmed)));assert.deepEqual((await app.science('/workflows/'+workflowId)).steps,saved.steps);});
  await test('Direct calculation history opens current state and cancels actual in-flight work',async()=>{const scenario=app.data.scenarios.find(s=>s.method==='qc-smooth'),w=scenario.window,configuration=await app.science('/configurations/direct-cancel',{revision:0,method:scenario.method,parameters:w.parameters,bindings:Object.fromEntries(Object.entries(w.bindings).map(([role,binding])=>[role,{...binding,confirmed:true}]))},'PUT'),queued=await app.science('/runs',{configurationId:configuration.id,revision:configuration.revision,idempotencyKey:'direct-cancel'});await app.control({action:'begin',runId:queued.id});try{await close();await page.locator('#iw-refresh').click();await page.waitForFunction(()=>document.querySelector('.iw-bottom')?.textContent.includes('1 recent runs'));await page.locator('#iw-history').click();await page.locator(`[data-iw-history-run="${queued.id}"]`).click();const cancelled=page.waitForResponse(response=>response.url().endsWith('/runs/'+queued.id+'/cancel')&&response.request().method()==='POST');await page.locator('#iw-cancel-run').click();assert.equal((await cancelled).status(),200);assert.equal((await app.science('/runs/'+queued.id)).status,'cancelling');}finally{await app.control({action:'release',runId:queued.id});}assert.equal((await app.science('/runs/'+queued.id)).status,'cancelled');});
  await test('Queued/running cancellation, injected failure, retry and three checkpoint review',async()=>{
   mainRun=await newRun();let rid=await start(mainRun);assert.equal((await complete(mainRun,rid)).status,'completed');await review(mainRun);const first=await app.science('/workflow-runs/'+mainRun);assert.equal(first.checkpointIndex,1);const accepted=Object.keys(first.outputs);
   rid=await start(mainRun);const cancelled=rid;assert.equal((await complete(mainRun,rid,{cancel:true})).status,'cancelled');assert.deepEqual(Object.keys((await app.science('/workflow-runs/'+mainRun)).outputs),accepted);
   rid=await start(mainRun);const failed=rid;assert.notEqual(rid,cancelled);assert.equal((await complete(mainRun,rid,{fail:true})).status,'failed');assert.equal((await app.science('/runs/'+cancelled)).status,'cancelled');
   rid=await start(mainRun);assert.notEqual(rid,failed);assert.equal((await complete(mainRun,rid)).status,'completed');await review(mainRun);assert.equal((await app.science('/workflow-runs/'+mainRun)).checkpointIndex,2);
   await page.reload();await page.locator('.iw').waitFor();rid=await start(mainRun);assert.equal((await complete(mainRun,rid)).status,'completed');await review(mainRun);const finished=await app.science('/workflow-runs/'+mainRun);assert.equal(finished.status,'completed');assert.equal(finished.checkpoints.length,3);assert.equal((await app.science('/runs/'+failed)).status,'failed');
  });
  await test('Export reviewed reservoir totals and compare every interval with independent values',verifySummaryExport);
  await test('Separate study rejection blocks publication and continuation',async()=>{const id=await newRun(),rid=await start(id);await complete(id,rid);const result=await app.science('/runs/'+rid+'/result');await review(id,'reject');assert.equal((await app.science('/workflow-runs/'+id)).status,'rejected');const info=await app.info();assert.ok(result.datasets.every(ds=>!info.datasets.some(value=>value.id===ds.id)));await details(id);assert.equal(await page.locator('#pp-run-segment').count(),0);});
  await test('Saved zone revision marks dependent results stale and blocks acceptance',async()=>{
   const id=await newRun(),rid=await start(id);
   await complete(id,rid);
   const path='/workflows/'+workflowId,definition=await app.science(path);
   delete definition.id;delete definition.updatedAt;
   definition.zones[0].top+=0.25;
   await app.science(path,definition,'PUT');
   const run=await app.science('/runs/'+rid);
   assert.equal(run.stale,true);
   assert.match(run.staleReason,/zone/i);
   assert.equal((await app.science('/workflow-runs/'+id)).stale,true);
   assert.ok((await app.science()).runs.some(item=>item.id===rid&&item.stale));
   const decision=await app.request(`/api/projects/project/science/workflow-runs/${id}/checkpoint-review`,{revision:run.revision,decision:'accept',comment:'Controlled fixture'});
   assert.equal(decision.status,409);
   assert.equal((await app.science('/runs/'+rid)).status,'completed');
  });
  await test('Source revision marks study stale and blocks UI/direct continuation',async()=>{const id=await newRun(),rid=await start(id);await complete(id,rid);await review(id);const original=app.data.workflow.steps[0].bindings.depth.datasetId;await app.control({action:'stale',datasetId:original});await details(id);assert.match(await page.locator('#dialog').innerText(),/upstream sources changed/);assert.equal(await page.locator('#pp-run-segment').count(),0);const parent=await app.science('/workflow-runs/'+id);const result=await app.request('/api/projects/project/science/workflow-runs/'+id+'/start',{revision:parent.revision,idempotencyKey:'blocked-stale-direct'});assert.equal(result.status,409);});
  assert.deepEqual(app.errors,[]);
 }finally{fs.writeFileSync(evidence+'/lifecycle-browser.json',JSON.stringify({passed:checks.length,checks,failures,pageErrors:app.errors,requests:app.requests,realCloudExecutions:0},null,2));coverage?.save();await app.close();}
 if(failures.length)throw new Error(failures.length+' lifecycle cases failed');console.log(JSON.stringify({passed:checks.length,pageErrors:app.errors}));
})().catch(async error=>{console.error(error);if(app)await app.close();process.exitCode=1;});
