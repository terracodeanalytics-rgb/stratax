// Generated numerical fixture only; never uses user files or a live Cloud identity.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/Tolu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const stub=fs.readFileSync('scripts/verify-ui.cjs','utf8').match(/const firebaseStub = `([\s\S]*?)`;/)[1],root=path.resolve('frontend/dist');
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://local').pathname,f=path.resolve(root,'.'+(p==='/'?'/index.html':p));if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(e,data)=>{res.writeHead(e?404:200,{'Content-Type':({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png'})[path.extname(f)]||'application/octet-stream'});res.end(e?'Missing':data);});});
(async()=>{
 let browser,fixture;const checks=[],errors=[],requests=[];let fixtureUrl=null,simulateCloud=false;
 try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  if(process.argv.includes('--cloud-processing')){
   const {spawn}=require('node:child_process');fixture=spawn(path.resolve('.venv/Scripts/python.exe'),['-u','scripts/serve-seismic-fixture.py'],{stdio:['ignore','pipe','pipe'],windowsHide:true,env:{...process.env,STRATAX_SITE_ORIGIN:'http://127.0.0.1:'+server.address().port}});
   const first=await new Promise((resolve,reject)=>{let output='';fixture.stdout.on('data',data=>{output+=data;if(output.includes('\n'))resolve(output.split('\n')[0]);});fixture.once('error',reject);fixture.once('exit',code=>reject(new Error('Fixture server exited '+code)));});
   fixtureUrl='http://127.0.0.1:'+JSON.parse(first).port;
   for(let attempt=0;attempt<100;attempt++){try{await fetch(fixtureUrl+'/health');break;}catch(error){if(attempt===99)throw error;await new Promise(r=>setTimeout(r,50));}}
  }
  const base='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({headless:true,executablePath:'C:/Users/Tolu/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});const context=await browser.newContext({acceptDownloads:true,viewport:{width:1600,height:1100}});
  await context.addInitScript(()=>{sessionStorage.setItem('test-user','1');localStorage.setItem('stratax.rememberUntil:ui-test-user',String(Date.now()+86400000));if(!localStorage.getItem('stratax.projects.v2:ui-test-user')){const p={id:'seismic-test',name:'Seismic acceptance',workflows:['petrophysics','seismic'],storage:'portable',status:'Active',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};localStorage.setItem('stratax.projects.v2:ui-test-user',JSON.stringify({records:[p],activeId:p.id,contexts:{[p.id]:{project:p.name,files:[],audit:[],wellDrafts:[],interpretation:{schemaVersion:1,windows:[],selected:null,browser:true,inspector:true,grid:true,annotations:[],board:{schemaVersion:1,books:[{id:'logs-original',name:'Original log workbook',wells:[],markers:[],range:null,linked:true,selected:null}],activeBook:'logs-original',templates:[],recipes:[],versions:[],focus:'logs'}}}}}));}});
  await context.route('https://www.gstatic.com/firebasejs/**/firebase-app.js',r=>r.fulfill({contentType:'text/javascript',body:'export function initializeApp(c){return c;}'}));await context.route('https://www.gstatic.com/firebasejs/**/firebase-auth.js',r=>r.fulfill({contentType:'text/javascript',body:stub}));
  await context.route('https://stratax-api-227436363119.us-central1.run.app/**',async r=>{requests.push({url:r.request().url(),method:r.request().method()});if(fixtureUrl&&simulateCloud&&new URL(r.request().url()).pathname.startsWith('/api/projects/')){const response=await r.fetch({url:fixtureUrl+new URL(r.request().url()).pathname+new URL(r.request().url()).search});if(response.status()>=400)console.error('FIXTURE API',r.request().method(),new URL(r.request().url()).pathname,response.status(),await response.text());return r.fulfill({response});}const p=new URL(r.request().url()).pathname;return r.fulfill({contentType:'application/json',body:JSON.stringify(p==='/api/runtime-config'?{firebase:{apiKey:'test',appId:'test'},policy_versions:{}}:p==='/api/legal-acceptance'?{accepted:true}:p==='/api/account'?{display_name:'Seismic Test'}:{projects:[]})});});
  await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);
  const test=async(name,fn)=>{try{await fn();checks.push(name);console.log('PASS '+name);}catch(error){console.error(JSON.stringify({failed:name,pageErrors:errors,toast:await page.locator('#toast').textContent()}));throw error;}};
  const stored=()=>page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('stratax.projects.v2:ui-test-user'));return p.contexts[p.activeId];});
  await test('Separate seismic workspace and preserved petrophysics state',async()=>{await page.goto(base+'/#seismic');await page.getByRole('region',{name:'Seismic interpretation workspace'}).waitFor();assert.equal((await stored()).interpretation.board.activeBook,'logs-original');assert.equal(await page.locator('.sw-window').count(),0);});
  await test('Retained local SEG-Y fixture with exact original section',async()=>{
   await page.evaluate(async()=>{
    const repository=await import('./project-repository.js'),p=JSON.parse(localStorage.getItem('stratax.projects.v2:ui-test-user')),project=p.records[0];
    const n=32,ns=128,bytes=new Uint8Array(3600+n*(240+ns*4)),v=new DataView(bytes.buffer);v.setUint16(3216,2000);v.setUint16(3220,ns);v.setUint16(3224,5);v.setUint16(3500,256);
    for(let t=0;t<n;t++){const at=3600+t*(240+ns*4);v.setUint16(at+114,ns);v.setUint16(at+116,2000);v.setInt32(at+188,10);v.setInt32(at+192,t+20);for(let s=0;s<ns;s++)v.setFloat32(at+240+s*4,Math.sin(s*.3+t*.1));}
    const original=(await repository.upload(project,new File([bytes],'generated-section.segy'))).file,workspace=p.contexts[p.activeId];workspace.files.push(original);workspace.ingestion={datasets:[{id:'survey',name:'Generated analytic survey',family:'seismic',active:true,sourceId:original.id,sourceSha256:'fixture-version',metadata:{traceCount:n,sampleCount:ns},references:{}}],imports:[]};localStorage.setItem('stratax.projects.v2:ui-test-user',JSON.stringify(p));
   });await page.reload();await page.locator('[data-sw-source="survey"]').click();await page.locator('[data-sw-canvas]').waitFor();assert.match(await page.locator('.sw-window footer').innerText(),/32 \u00d7 128 retained/);assert.equal(await page.locator('.sw-error').count(),0);
  });
  await test('Manual horizon picks, locks, undo and redo',async()=>{
   await page.locator('[data-sw-action="new-interpretation"]').click();await page.locator('#sw-new-object input[name="label"]').fill('Reviewed top');await page.getByRole('button',{name:'Create interpretation',exact:true}).click();
   const canvas=page.locator('[data-sw-canvas]');await canvas.click({position:{x:100,y:100}});await page.locator('[data-sw-pick-lock]').check();assert.equal(await page.locator('[data-sw-pick-remove]').isDisabled(),true);
   await page.locator('[data-sw-pick-lock]').uncheck();await page.locator('#sw-undo').click();assert.equal(await page.locator('[data-sw-pick-lock]').isChecked(),true);await page.locator('#sw-redo').click();assert.equal(await page.locator('[data-sw-pick-lock]').isChecked(),false);await page.locator('#sw-save-object').click();assert.equal((await stored()).seismicWorkspace.books[0].interpretations[0].dirty,false);
  });
  await test('Workbook persistence and independent log navigation',async()=>{
   await page.reload();await page.locator('[data-sw-canvas]').waitFor();assert.equal(await page.locator('[data-sw-pick-sample]').count(),1);await page.getByRole('button',{name:'Petrophysics',exact:true}).click();await page.locator('.wb-studio').waitFor();assert.equal((await stored()).interpretation.board.activeBook,'logs-original');await page.getByRole('button',{name:'Seismic',exact:true}).click();await page.locator('[data-sw-canvas]').waitFor();
  });
  await test('Reviewed horizon tracking proposal preserves locked seeds and barriers',async()=>{
   await page.locator('[data-sw-action="new-interpretation"]').click();await page.locator('#sw-new-object input[name="label"]').fill('Tracked top');await page.getByRole('button',{name:'Create interpretation',exact:true}).click();
   const canvas=page.locator('[data-sw-canvas]'),bounds=await canvas.boundingBox();await canvas.click({position:{x:10.5/32*bounds.width,y:44.5/128*bounds.height}});await page.locator('[data-sw-pick-lock]').check();
   await page.locator('[data-sw-action="track"]').click();await page.locator('#sw-track input[name="barriers"]').fill('22');await page.getByRole('button',{name:'Calculate proposal',exact:true}).click();await page.getByRole('region',{name:'Tracking proposal'}).waitFor();
   let draft=(await stored()).seismicWorkspace.books[0];assert.equal(draft.interpretations[1].points.length,1);assert.ok(draft.trackingProposal.points.length>10);assert.ok(draft.trackingProposal.points.every(p=>p.trace<22));assert.ok(draft.trackingProposal.stops.some(p=>p.trace===22));
   await page.locator('#sw-accept-tracking').click();await page.locator('#sw-save-object').click();draft=(await stored()).seismicWorkspace.books[0];assert.equal(draft.trackingProposal,null);assert.ok(draft.interpretations[1].points.find(p=>p.trace===10).locked);assert.equal(draft.interpretations[1].assistance.method,'bounded-section-event-correlation/v1');
   await page.reload();await page.locator('[data-sw-canvas]').waitFor();assert.ok(await page.locator('[data-sw-pick-sample]').count()>10);
  });
  await test('Section edits and undo retain the correct analytical range',async()=>{
   for(const [name,value] of Object.entries({firstTrace:8,traceCount:16,firstSample:10,sampleCount:64}))await page.locator(`#sw-section-form [name="${name}"]`).fill(String(value));
   await page.getByRole('button',{name:'Apply section',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.sw-window footer')?.textContent.includes('16 \u00d7 64 retained'));
   await page.locator('#sw-undo').focus();await page.keyboard.press('Control+z');await page.waitForFunction(()=>document.querySelector('.sw-window footer')?.textContent.includes('32 \u00d7 128 retained'));
   assert.equal((await stored()).seismicWorkspace.books[0].views[0].firstTrace,0);assert.equal(await page.locator('.sw-error').count(),0);
  });
  await test('Actual section export and responsive source controls',async()=>{
   await page.locator('[data-sw-action="export"]').click();const download=page.waitForEvent('download');await page.locator('#sw-export-section').click();const file=await(await download).path();const csv=fs.readFileSync(file,'utf8');assert.equal(csv.trim().split('\n').length,4097);await page.getByRole('button',{name:'Close dialog',exact:true}).click();
   for(const width of [320,768,1024,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.locator('[data-sw-canvas]').isVisible(),true);assert.equal(await page.getByRole('button',{name:'New horizon / fault',exact:true}).isVisible(),true);}
  });
  await test('Processing navigation, editable graph and independent persisted workbooks',async()=>{
   await page.setViewportSize({width:1600,height:1100});
   assert.deepEqual(await page.locator('.nav [data-go]').allTextContents(),['All projects','Overview','Data1','Map','Processing','Interpretation','Reports']);
   await page.locator('.nav [data-go="processing"]').click();await page.getByRole('region',{name:'Seismic processing workspace',exact:true}).waitFor();
   await page.locator('[data-sp-source="survey"]').click();await page.locator('.sp-menu summary').filter({hasText:'Trace editing'}).click();await page.locator('[data-sp-add="detrend"]').click();
   await page.locator('#sp-source [name="amplitudeUnit"]').fill('recorded source amplitude');await page.locator('#sp-source [name="domainConfirmed"]').check();await page.getByRole('button',{name:'Apply source settings',exact:true}).click();
   await page.locator('#sp-step [name="mode"]').fill('constant');await page.getByRole('button',{name:'Apply step settings',exact:true}).click();await page.locator('#sp-save').click();
   const workspace=await stored();assert.equal(workspace.seismicProcessing.books[0].graph.nodes[0].parameters.mode,'constant');assert.equal(workspace.interpretation.board.activeBook,'logs-original');assert.equal(workspace.seismicWorkspace.books[0].interpretations.length,2);
   await page.reload();await page.locator('[data-sp-node]').waitFor();assert.equal(await page.locator('[data-sp-node]').count(),1);
   await page.locator('.nav [data-go="seismic"]').click();await page.locator('[data-sw-canvas]').waitFor();assert.ok(await page.locator('[data-sw-pick-sample]').count()>10);
  });
  assert.equal(requests.filter(r=>/\/imports|\/science|\/seismic|\/files/.test(r.url)).length,0,'Local seismic content made no Cloud content requests');
  if(fixtureUrl)await test('Processing UI through real loopback API, worker, review and downstream source',async()=>{
   simulateCloud=true;
   await page.evaluate(async()=>{const {api}=await import('./auth.js'),record=await api('/api/projects/seismic-cloud-test'),key='stratax.projects.v2:ui-test-user',portfolio=JSON.parse(localStorage.getItem(key));portfolio.records.push({...record.project,revision:record.revision});portfolio.contexts[record.project.id]=record.workspace;portfolio.activeId=record.project.id;localStorage.setItem(key,JSON.stringify(portfolio));});
   await page.goto(base+'/?fixture=cloud#processing');await page.locator('[data-sp-source="survey"]').waitFor();await page.locator('[data-sp-source="survey"]').click();
   await page.locator('#sp-geometry').click();await page.locator('#sg-review').waitFor();
   await page.locator('#sg-review [name="crs"]').fill('Generated fixture CRS; no real-world projection');await page.locator('#sg-review [name="datum"]').fill('Generated fixture datum');await page.locator('#sg-review [name="notes"]').fill('Reviewed generated header fields; zero source/receiver coordinates do not qualify acquisition geometry.');await page.locator('#sg-review [name="reviewed"]').check();
   assert.equal(await page.locator('#sg-save').isDisabled(),true);await page.locator('#sg-preview').click();await page.waitForFunction(()=>document.querySelector('#sg-preview-result')?.textContent.includes('geometryQualifiedForProcessing'));
   assert.equal(JSON.parse(await page.locator('#sg-preview-result').innerText()).geometryQualifiedForProcessing,false);await page.locator('#sg-save').click();await page.waitForFunction(()=>document.querySelector('#toast')?.textContent.includes('Geometry declaration saved'));
   await page.locator('#sp-geometry').click();await page.locator('#sg-review').waitFor();assert.equal(await page.locator('#sg-review [name="crs"]').inputValue(),'Generated fixture CRS; no real-world projection');
   const geometryDownload=page.waitForEvent('download');await page.locator('#sg-export').click();assert.equal((await geometryDownload).suggestedFilename(),'seismic-geometry-review.json');await page.locator('#dialog').evaluate(e=>e.close());
   await page.locator('.sp-menu summary').filter({hasText:'Trace editing'}).click();await page.locator('[data-sp-add="detrend"]').click();
   await page.locator('.sp-menu summary').filter({hasText:'Signal processing'}).click();await page.locator('[data-sp-add="resample"]').click();
   await page.locator('#sp-source [name="amplitudeUnit"]').fill('generated fixture amplitude');await page.locator('#sp-source [name="domainConfirmed"]').check();await page.getByRole('button',{name:'Apply source settings',exact:true}).click();await page.locator('#sp-save').click();
   await page.waitForFunction(()=>document.querySelector('#toast')?.textContent.includes('Processing graph saved'));
   await page.locator('#sp-estimate').click();await page.locator('#sp-approve [name="reviewed"]').check();await page.getByRole('button',{name:'Approve and run preview',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('.sp-jobs')?.textContent.includes('completed'),null,{timeout:60000});await page.locator('#sp-compare').click();await page.waitForFunction(()=>document.querySelector('#sp-after')?.width===32);
   assert.match(await page.locator('#sp-grid-note').innerText(),/different sample grids/);
   await page.locator('#sp-review').click();await page.locator('#sp-result-review [name="comment"]').fill('Reviewed generated loopback fixture; no field interpretation approval.');await page.locator('#sp-result-review [name="reviewed"]').check();await page.getByRole('button',{name:'Record review',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.sp-jobs')?.textContent.includes('accepted'));
   const output=(await stored()).seismicProcessing.books[0].run.datasetId;
   await page.locator('.nav [data-go="interpretation"]').click();await page.getByRole('button',{name:'Seismic',exact:true}).click();await page.locator(`[data-sw-source="${output}"]`).waitFor();await page.locator(`[data-sw-source="${output}"]`).click();await page.locator('[data-sw-canvas]').waitFor();assert.match(await page.locator('.sw-window footer').innerText(),/32 \u00d7 64 retained/);assert.match(await page.locator('.sw-window footer').innerText(),/processed-analytical/);
  });
assert.deepEqual(errors,[]);fs.mkdirSync('.release',{recursive:true});await page.screenshot({path:'.release/seismic-workspace.png',fullPage:true});console.log(JSON.stringify({passed:checks.length,pageErrors:errors.length,localCloudContentRequests:0}));
 }finally{await browser?.close();fixture?.kill();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
