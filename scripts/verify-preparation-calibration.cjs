// Actual local science API/workers/artifacts; mocked identity, project UI and Cloud dispatch.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
const {chromium}=require('C:/Users/Tolu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const stub=fs.readFileSync('scripts/verify-ui.cjs','utf8').match(/const firebaseStub = `([\s\S]*?)`;/)[1].replaceAll('ui-test-user','owner');
const root=path.resolve('frontend/dist'),receiptRoot='.release/preparation-calibration-20261107';
const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://local').pathname,file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});res.end(error?'Not found':data);});});
const fixture=spawn(path.resolve('.venv/Scripts/python.exe'),['-u','scripts/serve-petrophysics-fixture.py'],{stdio:['ignore','pipe','pipe'],windowsHide:true});
let fixtureLog='',browser;
fixture.stderr.on('data',data=>{fixtureLog+=data.toString();});
const ready=new Promise((resolve,reject)=>{let output='';const timer=setTimeout(()=>reject(new Error('Local fixture startup timed out: '+fixtureLog)),90000);fixture.stdout.on('data',data=>{output+=data;const line=output.split('\n').find(line=>line.startsWith('{"port"'));if(line){clearTimeout(timer);resolve(JSON.parse(line).port);}});fixture.on('exit',code=>{clearTimeout(timer);reject(new Error('Local fixture exited '+code+': '+fixtureLog));});});
const checks=[],errors=[],requests=[];
(async()=>{
 const port=await ready,api='http://127.0.0.1:'+port;
 let fixtureData;
 for(let attempt=0;attempt<50;attempt++){
  try{fixtureData=await (await fetch(api+'/__fixture')).json();break;}catch(error){if(attempt===49)throw error;await new Promise(resolve=>setTimeout(resolve,100));}
 }
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 const localApi=async(endpoint,options={})=>{const response=await fetch(api+'/api/projects/project/science'+endpoint,{headers:{'Content-Type':'application/json'},...options,body:options.body===undefined?undefined:JSON.stringify(options.body)});const value=await response.json();assert.equal(response.ok,true,JSON.stringify(value));return value;};
 browser=await chromium.launch({headless:true,executablePath:'C:/Users/Tolu/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
 const rejection=structuredClone(fixtureData.scenarios[0]);rejection.reject=true;rejection.window.id+='-reject';
 for(const scenario of [...fixtureData.scenarios,rejection].filter(s=>!process.env.FIXTURE_METHOD||s.method===process.env.FIXTURE_METHOD)){
  console.log('Actual UI/API/worker: '+scenario.method);
  const project=fixtureData.project,workspace={project:project.name,files:[],audit:[],wellDrafts:[{id:'A',name:'Controlled well A'}],ingestion:{datasets:fixtureData.datasets,imports:[]},interpretation:{schemaVersion:1,windows:[scenario.window],selected:scenario.window.id,browser:true,inspector:true,annotations:[],cursor:null,board:{schemaVersion:1,books:[{id:'book',name:'Controlled study',wells:[],range:null,linked:true,selected:null,markers:[]}],activeBook:'book',templates:[],recipes:[],versions:[],focus:'analysis',migrated:true}}};
  let revision=1;
  const context=await browser.newContext({viewport:{width:1600,height:1100},acceptDownloads:true});
  await context.addInitScript(({project,workspace})=>{sessionStorage.setItem('test-user','1');localStorage.setItem('stratax.rememberUntil:owner',String(Date.now()+86400000));localStorage.setItem('stratax.projects.v2:owner',JSON.stringify({records:[project],activeId:project.id,contexts:{[project.id]:workspace}}));},{project,workspace});
  await context.route('https://www.gstatic.com/firebasejs/**/firebase-app.js',r=>r.fulfill({contentType:'text/javascript',body:'export function initializeApp(c){return c;}'}));
  await context.route('https://www.gstatic.com/firebasejs/**/firebase-auth.js',r=>r.fulfill({contentType:'text/javascript',body:stub}));
  await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
  await context.route('https://stratax-api-227436363119.us-central1.run.app/**',async route=>{
   const request=route.request(),url=new URL(request.url()),p=url.pathname;requests.push({method:request.method(),path:p});
   if(p.includes('/science')){const response=await fetch(api+p+url.search,{method:request.method(),headers:{'Content-Type':'application/json'},body:request.postData()||undefined});return route.fulfill({status:response.status,headers:{'Content-Type':response.headers.get('Content-Type')||'application/json','Access-Control-Allow-Origin':'*'},body:Buffer.from(await response.arrayBuffer())});}
   const body=request.postData()?request.postDataJSON():null;
   const result=p==='/api/runtime-config'?{firebase:{apiKey:'fixture',appId:'fixture'},policy_versions:{}}:p==='/api/legal-acceptance'?{accepted:true}:p==='/api/account'?{display_name:'Controlled local reviewer'}:p==='/api/projects'?{projects:[project]}:p===`/api/projects/${project.id}`?{project,revision:request.method()==='PUT'?++revision:revision,workspace:body?.workspace||workspace}:p.endsWith('/imports')?{datasets:fixtureData.datasets,imports:[]}:null;
   assert.notEqual(result,null,'Unexpected request '+p);return route.fulfill({contentType:'application/json',body:JSON.stringify(result)});
  });
  const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin+'/#interpretation');await page.locator('#iw-properties').waitFor();
  for(const checkbox of await page.locator('[name^="binding:"][name$=":confirmed"]').all()){assert.equal(await checkbox.isChecked(),false);await checkbox.check();}
  if(scenario.method==='qc-smooth')await page.locator('[name="parameter:window"]').fill('3');
  await page.locator('#iw-run').click();await page.locator('#iw-refresh').click();
  await page.waitForFunction(()=>document.querySelector('.iw-run-state strong')?.textContent==='completed');
  await page.locator('#iw-open-result').click();await page.locator('.iw-result-summary').waitFor();
  const runs=await localApi('');const run=runs.runs.find(run=>run.method===scenario.method&&run.status==='completed'&&!run.configuration.notes?.includes('downstream'));
  assert.ok(run,'Actual run missing');const result=await localApi('/runs/'+run.id+'/result');
  if(scenario.method==='qc-smooth')assert.ok(Math.abs(result.preview.proposed[0]-4/3)<1e-10,'Edited window must affect the calculation');
  assert.ok(result.datasets[0].indexColumnId,'Retained result index missing');
  await page.locator('[data-iw-proposal]').click();await page.locator(`[data-wb-review-run="${run.id}"]`).click();
  await page.locator('#iw-review-form [name=comment]').fill('Controlled analytical software acceptance; not field calibration');
  if(scenario.reject)await page.locator('#iw-review-form [name=decision]').selectOption('reject');
  await page.locator('#iw-review-form [name=reviewed]').check();await page.locator('#iw-review-form button').click();
  await page.waitForFunction(()=>!document.querySelector('#dialog')?.open);
  if(scenario.reject){
   assert.equal((await localApi('/runs/'+run.id)).status,'rejected');
   await assert.rejects(()=>localApi('/validate',{method:'POST',body:{revision:0,method:'qc-smooth',bindings:{depth:{datasetId:result.datasets[0].id,columnId:result.datasets[0].indexColumnId,unit:'m',confirmed:true},curve:{datasetId:result.datasets[0].id,columnId:result.datasets[0].columns[1].id,unit:result.datasets[0].columns[1].unit,confirmed:true}},parameters:{window:3}}}));
   checks.push({method:scenario.method,rejected:true,inactiveReuseBlocked:true});await context.close();continue;
  }
  assert.equal((await localApi('/runs/'+run.id)).status,'accepted');
  await page.reload();await page.locator('[data-pp-tab=Reports]').waitFor();
  const accepted=await localApi('');assert.ok(accepted.runs.find(value=>value.id===run.id&&value.status==='accepted'));
  const ds=result.datasets.find(ds=>ds.indexColumnId),depth=ds.columns.find(c=>c.id===ds.indexColumnId),value=ds.columns.find(c=>c.id!==depth.id);
  const downstream={revision:0,method:'qc-smooth',bindings:{depth:{datasetId:ds.id,columnId:depth.id,unit:depth.unit,confirmed:true},curve:{datasetId:ds.id,columnId:value.id,unit:value.unit,confirmed:true}},parameters:{window:3},notes:'downstream '+scenario.method};
  const saved=await localApi('/configurations/reuse-'+scenario.method,{method:'PUT',body:downstream});
  const reused=await localApi('/runs',{method:'POST',body:{configurationId:saved.id,revision:saved.revision,idempotencyKey:'reuse-'+scenario.method}});
  const reusedRun=await localApi('/runs/'+reused.id);assert.equal(reusedRun.status,'completed',reusedRun.message);
  const reusedResult=await localApi('/runs/'+reused.id+'/result');assert.equal(reusedResult.units.proposed,value.unit);
  await page.locator('[data-pp-tab=Reports]').click();await page.locator('[data-pp-action=report]:visible').click();
  await page.locator('#pp-report').waitFor({state:'visible'});
  for(const checkbox of await page.locator('#pp-report [name=run]').all())await checkbox.uncheck();await page.locator(`#pp-report [name=run][value="${run.id}"]`).check();
  assert.deepEqual(await page.locator('#pp-report [name=run]:checked').evaluateAll(nodes=>nodes.map(node=>node.value)),[run.id]);
  const downloading=page.waitForEvent('download');await page.locator('#pp-report [value=curves]').click();
  const download=await downloading;const chunks=[];for await(const chunk of await download.createReadStream())chunks.push(chunk);
  assert.ok(Buffer.concat(chunks).toString('utf8').includes('['+value.unit+']'),JSON.stringify({method:scenario.method,unit:value.unit,csv:Buffer.concat(chunks).toString('utf8').slice(0,500)}));
  checks.push({method:scenario.method,uiSetup:true,actualRoutesWorker:true,comparison:true,acceptedReload:true,downstream:true,csv:true});
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.equal(requests.some(request=>/\/files\//.test(request.path)),false);
 const info=await (await fetch(api+'/__fixture')).json();
 const receipt={passed:checks.length,checks,pageErrors:errors,localWorkerExecutions:info.executions,realCloudExecutions:0,requests:requests.length};
 fs.writeFileSync(receiptRoot+'/integration-'+(process.env.FIXTURE_METHOD||'browser')+'.json',JSON.stringify(receipt,null,2));fs.writeFileSync(receiptRoot+'/integration-server.log',fixtureLog);console.log(JSON.stringify(receipt));
})().catch(error=>{fs.writeFileSync(receiptRoot+'/integration-failure.log',String(error.stack)+'\n'+fixtureLog);console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();fixture.kill();});
