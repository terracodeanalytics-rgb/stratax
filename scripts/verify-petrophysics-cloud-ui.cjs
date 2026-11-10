// Cloud UI contract test: all accounts, records, rows and scientific APIs are mocked.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require('C:/Users/Tolu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const stub=fs.readFileSync('scripts/verify-ui.cjs','utf8').match(/const firebaseStub = `([\s\S]*?)`;/)[1],root=path.resolve('frontend/dist');
const server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+(new URL(req.url,'http://local').pathname==='/'?'/index.html':new URL(req.url,'http://local').pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(e,data)=>{res.writeHead(e?404:200,{'Content-Type':({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});res.end(e?'Not found':data);});});
(async()=>{
 const {methods}=await import(pathToFileURL(path.resolve(root,'science-methods.js')).href);
 const project={id:'cloud-ui-fixture',name:'Controlled petrophysics report fixture',storage:'cloud',status:'Active',workflows:['petrophysics'],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
 const columns=[{id:'column-0',mnemonic:'DEPTH',unit:'m'},{id:'column-1',mnemonic:'porosity',unit:'v/v'},{id:'column-2',mnemonic:'observedRt',unit:'ohm.m'}],rows=[.1,.12,.15,.2,.25,.3].map((phi,i)=>[1000+i,phi,.14/phi**2]);
 const dataset={id:'accepted-dataset',name:'Controlled accepted Pickett pairs',well:'fixture-well',family:'derived',active:true,rowCount:rows.length,columns,indexColumnId:'column-0',references:{depthReference:'MD',depthUnit:'m'},scientificRunId:'run-accepted',sourceSha256:'controlled-fixture-hash',preview:rows};
 const workspace={project:project.name,files:[],audit:[],wellDrafts:[{id:'fixture-well',name:'Fixture well'}],ingestion:{datasets:[dataset],imports:[]}};
 const run={id:'run-accepted',method:'pickett-fit',status:'accepted',revision:3,createdAt:new Date().toISOString(),configuration:{notes:'Controlled analytical calibration',bindings:{},parameters:{waterZoneEvidence:'Controlled analytical Sw=1 fixture'}}};
 const manifest={method:'pickett-fit',methodVersion:'fixture',reference:'https://www.kgs.ku.edu/software/Pf/description.html',datasets:[dataset],preview:{depth:rows.map(r=>r[0]),porosity:rows.map(r=>r[1]),observedRt:rows.map(r=>r[2]),fittedRt:rows.map(r=>r[2])},summary:{m:2,aRw:.14,rSquared:1,pairs:rows.length},warnings:['Only m and a·Rw are identifiable without independent evidence.'],provenance:{configuration:run.configuration,sources:[{id:'controlled-original',sourceSha256:'controlled-fixture-hash'}]}};
 const cutoffBindings=Object.fromEntries(['depth','vsh','porosity','sw','k'].map(role=>[role,{datasetId:dataset.id,columnId:role==='depth'?'column-0':'column-1',unit:role==='depth'?'m':'v/v',confirmed:true}]));
 const cutoffRules=['<=','>=','<','>'].map((operator,i)=>({role:['vsh','porosity','sw','porosity'][i],operator,value:.1*(i+1)}));
 const cutoffWindow={id:'stored-cutoff',tool:'cutoffs',method:'cutoff-rules',scenarioName:'Retained cutoff fixture',datasetId:dataset.id,bindings:cutoffBindings,parameters:{rules:cutoffRules,combine:'AND',zones:[],minimumBed:0,depthReference:'MD'}};
 workspace.interpretation={schemaVersion:1,windows:[cutoffWindow],selected:cutoffWindow.id,browser:true,inspector:true,annotations:[],cursor:null};
 let revision=1,definition,savedConfiguration;const requests=[],errors=[],checks=[];
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Tolu/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
 try{
  const context=await browser.newContext({viewport:{width:1600,height:1100},acceptDownloads:true});
  await context.addInitScript(({project,workspace})=>{sessionStorage.setItem('test-user','1');localStorage.setItem('stratax.rememberUntil:ui-test-user',String(Date.now()+86400000));localStorage.setItem('stratax.projects.v2:ui-test-user',JSON.stringify({records:[project],activeId:project.id,contexts:{[project.id]:workspace}}));},{project,workspace});
  await context.route('https://www.gstatic.com/firebasejs/**/firebase-app.js',r=>r.fulfill({contentType:'text/javascript',body:'export function initializeApp(c){return c;}'}));
  await context.route('https://www.gstatic.com/firebasejs/**/firebase-auth.js',r=>r.fulfill({contentType:'text/javascript',body:stub}));
  await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
  await context.route('https://stratax-api-227436363119.us-central1.run.app/**',async route=>{
   const request=route.request(),url=new URL(request.url()),p=url.pathname,body=request.method()==='POST'||request.method()==='PUT'?request.postDataJSON():null;requests.push({path:p,method:request.method()});
   let result=p==='/api/runtime-config'?{firebase:{apiKey:'fixture',appId:'fixture'},policy_versions:{}}:p==='/api/legal-acceptance'?{accepted:true}:p==='/api/account'?{display_name:'Fixture reviewer'}:p==='/api/projects'?{projects:[project]}:p===`/api/projects/${project.id}`?{project,revision:request.method()==='PUT'?++revision:revision,workspace:body?.workspace||workspace}:null;
   if(p.endsWith('/science/capabilities'))result={version:'fixture',methods};
   else if(p.endsWith('/science'))result={configurations:[],runs:[run,{...run,id:'run-unaccepted',status:'completed'}]};
   else if(p.endsWith('/imports'))result={datasets:[dataset],imports:[]};
   else if(p.includes('/datasets/')&&p.endsWith('/rows'))result={rows:rows.slice(Number(url.searchParams.get('start')||0)),columns,rowCount:rows.length,references:dataset.references};
   else if(p.endsWith('/runs/run-accepted/result'))result=manifest;
   else if(p.includes('/science/configurations/')&&request.method()==='PUT'){savedConfiguration=body;result={...body,id:p.split('/').at(-1),revision:body.revision+1};}
   else if(p.endsWith('/workflows/validate')){assert.equal(typeof body,'object');assert.equal(body.steps.length,3);result={valid:true,effectiveParameters:{fixture:{values:{clean:20},origins:{clean:{level:'project',unit:'gAPI'}}}}};}
   else if(p.includes('/workflows/')&&request.method()==='PUT'){assert.equal(typeof body,'object');definition={...body,id:p.split('/').at(-1),revision:1};result=definition;}
   else if(p.endsWith('/workflows'))result={workflows:definition?[definition]:[]};
   if(result===null)return route.fulfill({status:404,contentType:'application/json',body:JSON.stringify({message:'Unexpected fixture request '+p})});
   return route.fulfill({contentType:'application/json',body:JSON.stringify(result)});
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port+'/#interpretation');await page.locator('[data-pp-tab=Reports]').waitFor();await page.locator('#iw-refresh').click();await page.waitForFunction(()=>document.querySelector('.iw-bottom')?.textContent.includes('2 recent runs'));
  await page.locator('[data-pp-tab=Reports]').click();await page.locator('[data-pp-action=report]:visible').click();await page.locator('#pp-report').waitFor();assert.equal(await page.locator('#pp-report [name=run]').count(),1);checks.push('Report picker excludes unaccepted interpretations');
  let pending=page.waitForEvent('download');await page.locator('#pp-report [value=html]').click();let download=await pending;let chunks=[];for await(const chunk of await download.createReadStream())chunks.push(chunk);const html=Buffer.concat(chunks).toString('utf8');assert.match(html,/window.print\(\)/);assert.match(html,/Accepted interpretation plots/);assert.match(html,/controlled-fixture-hash/);assert.match(html,/a·Rw/);assert.doesNotMatch(html,/run-unaccepted/);checks.push('HTML report includes accepted plots, assumptions, provenance and print/PDF action');const printPage=await context.newPage();await printPage.setContent(html);const pdf=await printPage.pdf({format:'A4',printBackground:true});assert.equal(pdf.subarray(0,5).toString(),'%PDF-');assert.equal(pdf.length>1000,true);fs.writeFileSync('.release/petrophysics-controlled-report.pdf',pdf);await printPage.close();checks.push('Chromium renders the controlled accepted report to A4 PDF');
  pending=page.waitForEvent('download');await page.locator('#pp-report [value=curves]').click();download=await pending;chunks=[];for await(const chunk of await download.createReadStream())chunks.push(chunk);const csv=Buffer.concat(chunks).toString('utf8');assert.match(csv,/DEPTH \[m\]/);assert.equal(csv.split('\r\n').length,7);checks.push('CSV exports complete accepted rows and units');
  await page.locator('#dialog [data-close]').click();await page.locator('[data-pp-tab=Workflows]').click();await page.locator('[data-pp-action=workflow]:visible').click();await page.locator('#pp-workflow details').last().locator('summary').click();
  const binding={datasetId:dataset.id,columnId:'column-1',unit:'v/v',confirmed:true};
  const draft={revision:0,name:'Controlled definition contract',steps:['conditioning','calibration','evaluation'].map((checkpoint,i)=>({id:'step-'+i,method:'porosity-neutron',wellId:'fixture-well',checkpoint,bindings:{neutron:binding},parameters:{scale:1,offset:0,calibration:'Controlled identity response fixture'}})),projectParameters:{},wellParameters:{},zoneParameters:{},zones:[],outputSelections:[]};
  await page.locator('#pp-workflow-json').fill(JSON.stringify(draft));await page.locator('#pp-workflow [value=validate]').click();await page.locator('#pp-effective-parameters').waitFor();assert.match(await page.locator('#pp-effective-parameters').innerText(),/gAPI/);await page.locator('#pp-workflow [value=save]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-step]').length===3);assert.equal(await page.locator('[data-binding-role]').count(),3);assert.equal(await page.locator('[data-confirm-role]:checked').count(),3);for(const select of await page.locator('[data-binding-role]').all())assert.equal(JSON.parse(await select.inputValue()).datasetId,dataset.id);checks.push('Workflow JSON import renders reviewed bindings and sends structured versioned API bodies');
  await page.locator('#dialog [data-close]').click();
  await page.locator('[data-pp-tab=Petrophysics]').click();await page.locator('[data-pp-action=cutoffs]:visible').click();
  const operators=()=>page.locator('#pp-cutoff-rules [name=op]').evaluateAll(elements=>elements.map(element=>element.value));
  assert.deepEqual(await operators(),['<=','>=','<','>']);assert.equal(await page.locator('#pp-cutoffs [name=name]').inputValue(),'Retained cutoff fixture');
  checks.push('Cutoff editor reopens all four stored operators and the scenario name');
  await page.locator('#pp-cutoff-rules [name=role]').first().selectOption('sw');
  await page.locator('#pp-add-rule').click();await page.locator('[data-remove-rule="4"]').click();
  assert.deepEqual(await operators(),['<=','>=','<','>']);
  assert.deepEqual(await page.locator('#pp-cutoff-rules [name=value]').evaluateAll(elements=>elements.map(element=>Number(element.value))),cutoffRules.map(rule=>rule.value));
  checks.push('Property changes and rule addition/removal preserve operators and thresholds');
  await page.locator('#pp-cutoffs button.primary').click();await page.locator('#iw-properties').waitFor();
  assert.deepEqual(JSON.parse(await page.locator('[name="parameter:rules"]').inputValue()).map(rule=>rule.operator),['<=','>=','<','>']);
  for(const [role,binding] of Object.entries(cutoffBindings)){
   assert.equal(await page.locator(`[name="binding:${role}:datasetId"]`).inputValue(),binding.datasetId);
   assert.equal(await page.locator(`[name="binding:${role}:columnId"]`).inputValue(),binding.columnId);
   assert.equal(await page.locator(`[name="binding:${role}:unit"]`).inputValue(),binding.unit);
   assert.equal(await page.locator(`[name="binding:${role}:confirmed"]`).isChecked(),false);
  }
  await page.locator('#iw-properties button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#toast')?.textContent.includes('Configuration saved'));
  assert.deepEqual(savedConfiguration.parameters.rules.map(rule=>rule.operator),['<=','>=','<','>']);
  assert.equal(savedConfiguration.notes,'Cutoff scenario: Retained cutoff fixture');
  for(const role of Object.keys(cutoffBindings))assert.deepEqual(savedConfiguration.bindings[role],{...cutoffBindings[role],confirmed:false});
  checks.push('Submitted cutoff configuration preserves operators, name and source bindings with fresh review required');
  await page.locator('[data-pp-action=cutoffs]:visible').click();assert.deepEqual(await operators(),['<=','>=','<','>']);
  assert.equal(await page.locator('#pp-cutoffs [name=name]').inputValue(),'Retained cutoff fixture');await page.locator('#dialog [data-close]').click();
  checks.push('Saved cutoff scenario reopens without operator or name changes');
  if(process.argv.includes('--preparation')){
   const confirmation=page.locator('[name="binding:porosity:confirmed"]');await confirmation.check();
   await page.locator('[name="binding:porosity:unit"]').fill('%');
   assert.equal(await confirmation.isChecked(),false,'Editing a reviewed unit must invalidate its confirmation');
   checks.push('Editing mapping units requires fresh explicit confirmation');
  }
  assert.deepEqual(errors,[]);assert.equal(requests.some(r=>r.method==='POST'&&/\/science\/(runs|workflow-runs)/.test(r.path)),false);
  const receipt={passed:checks.length,checks,pageErrors:errors,realCloudExecutions:0,fixture:'Controlled analytical records; mocked account/API, not field acceptance'};fs.writeFileSync('.release/petrophysics-cloud-ui-verification.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
