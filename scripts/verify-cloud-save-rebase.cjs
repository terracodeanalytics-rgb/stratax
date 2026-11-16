const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Tolu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const authStub=fs.readFileSync('scripts/verify-ui.cjs','utf8').match(/const firebaseStub = `([\s\S]*?)`;/)[1];
const root=path.resolve('frontend/dist');
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+(new URL(req.url,'http://local').pathname==='/'?'/index.html':new URL(req.url,'http://local').pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.readFile(file,(error,body)=>{res.writeHead(error?404:200,{'Content-Type':({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream'});res.end(body);});
});
const id='shared-id';
const testAccount=uid=>({uid,geoPreview:[],record:{revision:1,project:{id,name:uid+' study',storage:'cloud',status:'Active',workflows:['petrophysics']},workspace:{files:[],audit:[],wellDrafts:[{id:'A',name:'Well A'},{id:'B',name:'Well B'}],mapWorkspace:{hiddenWells:[]}}},conflicts:0,saves:0});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=process.env.STRATAX_UI_BASE||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Tolu/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
 const errors=[];
 async function open(account,{corroborated=false}={}){
  const {uid}=account,context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.addInitScript(({uid,project,workspace})=>{
   window.__basemapMarkers=[];
   window.google={maps:{
    Map:class{fitBounds(){}},
    Marker:class{constructor({position}){window.__basemapMarkers.push(position.id);}addListener(){}},
    LatLngBounds:class{extend(){}},
    Size:class{},Point:class{},SymbolPath:{CIRCLE:'circle'}
   }};
   sessionStorage.setItem('test-user','1');
   localStorage.setItem('stratax.rememberUntil:'+uid,String(Date.now()+86400000));
   const key='stratax.projects.v2:'+uid;
   if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({records:[{...project,revision:1}],activeId:project.id,contexts:{[project.id]:workspace}}));
  },{uid,project:account.record.project,workspace:account.record.workspace});
  await context.route('https://www.gstatic.com/firebasejs/**/firebase-app.js',r=>r.fulfill({contentType:'text/javascript',body:'export function initializeApp(config){return config;}'}));
  await context.route('https://www.gstatic.com/firebasejs/**/firebase-auth.js',r=>r.fulfill({contentType:'text/javascript',body:authStub.replaceAll('ui-test-user',uid).replaceAll('ui-test-token',uid+'-token')}));
  await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
  await context.route('https://stratax-api-227436363119.us-central1.run.app/**',async route=>{
   const req=route.request(),url=new URL(req.url()),record=account.record;
   const token=req.headers().authorization;
   if(token)assert.equal(token,'Bearer '+uid+'-token');
   let status=200,value={};
   if(url.pathname==='/api/runtime-config')value={firebase:{apiKey:'fixture',appId:'fixture'},policy_versions:{}};
   else if(url.pathname==='/api/legal-acceptance')value={accepted:true};
   else if(url.pathname==='/api/account')value={display_name:uid};
   else if(url.pathname==='/api/projects')value={projects:[{...record.project,revision:record.revision}],next_cursor:null};
   else if(url.pathname==='/api/projects/'+id+'/imports'){
    const wells=[{id:'A',name:'Well A'},{id:'B',name:'Well B'}].map((well,i)=>({...well,
     sourceCoordinates:corroborated?{x:481200+i*100,y:69280,crs:'EPSG:26391',crsEvidence:{crs:'EPSG:26391',sourceId:'documented-grid'}}:{x:5+i,y:4,crs:'EPSG:4326'}}));
    const headers={id:'headers',family:'well_headers',name:'Fixture headers',wellRecords:wells};
    const logs=corroborated?wells.map(well=>({id:'las-'+well.id,family:'logs',well:well.id,wellRecords:[{...well,sourceCoordinates:{
     ...well.sourceCoordinates,coordinateConflict:true,
     ...(well.id==='B'&&uid.endsWith('-b')?{crsEvidence:{crs:'EPSG:26392',sourceId:'other-grid'}}:{}),
     geographicCoordinates:{lat:4.624668,lng:6.793340,...(well.id==='B'&&uid.endsWith('-a')?{crs:'EPSG:4326'}:{})}
    }}]})):[];
    value={datasets:[headers,...logs],imports:[]};
   }
   else if(url.pathname==='/api/projects/'+id+'/locations/preview'){
    const body=req.postDataJSON();
    account.geoPreview.push(body);
    value={points:body.points.map(({id,x,y})=>body.crs==='EPSG:26391'
     ?{id,lat:4.623748,lng:6.756529,conflicts:['Retained coordinate sources disagree.','The conversion differs from the retained geographic coordinates by more than 1 km.']}
     :{id,lat:y,lng:x,conflicts:[]})};
   }
   else if(url.pathname==='/api/projects/'+id){
    if(req.method()==='GET')value=record;
    else {
     const submitted=req.postDataJSON();
     if(submitted.revision!==record.revision){status=409;account.conflicts++;value={code:'project_conflict',message:'This project changed elsewhere.'};}
     else {account.saves++;value={revision:record.revision+1,project:submitted.project,workspace:{...submitted.workspace,files:record.workspace.files}};account.record=structuredClone(value);}
    }
   }
   await route.fulfill({status,contentType:'application/json',body:JSON.stringify(value)});
  });
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/#map');
  await page.locator('g[data-map-point="A"]').waitFor();
  assert.equal(account.saves,0);
  return {page,context};
 }
 try{
  for(const uid of ['cloud-save-owner-a','cloud-save-owner-b']){
   const account=testAccount(uid),{page,context}=await open(account,{corroborated:true});
   await page.locator('.mw-menu summary').filter({hasText:'Basemap'}).click();
   await page.getByRole('button',{name:'Google Roadmap'}).click();
   await page.waitForFunction(()=>window.__basemapMarkers.includes('A'));
   assert.deepEqual(await page.evaluate(()=>window.__basemapMarkers),['A']);
   assert.deepEqual(account.geoPreview[0].points.map(point=>point.id),['A']);
   assert.equal(account.geoPreview[0].crs,'EPSG:26391');
   assert.equal(account.geoPreview[0].acknowledge_coordinate_conflict,true);
   assert.match(await page.locator('[data-map-well="B"]').textContent(),/geographic conflict/);
   await page.locator('.mw-inspector [data-map-command=deviation]').click();
   assert.equal(await page.locator('#mw-survey-import [data-mw-deviation-well]').count(),2);
   assert.equal(await page.locator('#well-import-form').count(),0);
   await page.locator('#mw-deviation-cancel').click();
   await page.locator('.mw-menu summary').filter({hasText:'Basemap'}).click();
   await page.getByRole('button',{name:'Field grid',exact:true}).click();
   account.record.revision++;
   account.record.workspace.mapWorkspace.hiddenWells=['B'];
   account.record.workspace.audit.unshift({action:'Concurrent import for '+uid});
   await page.locator('[data-map-visible="A"]').uncheck();
   await page.waitForFunction(uid=>{
    const stored=JSON.parse(localStorage.getItem('stratax.projects.v2:'+uid));
    return stored?.records[0]?.revision>=3&&!stored.records[0].pendingSave;
   },uid);
   assert.equal(account.conflicts,1);
   assert.equal(account.saves,1);
   assert.deepEqual(new Set(account.record.workspace.mapWorkspace.hiddenWells),new Set(['A','B']));
   assert.equal(account.record.workspace.audit[0].action,'Concurrent import for '+uid);
   assert.equal(account.record.project.name,uid+' study');
   assert.equal(await page.locator('[data-map-visible="B"]').isChecked(),false);
   await context.close();
  }
  const account=testAccount('cloud-save-overlap'),{page}=await open(account);
  account.record.revision++;
  account.record.workspace.wellDrafts[0].name='Cloud rename';
  await page.locator('.mw-well-row [data-map-well-menu="A"]').click();
  await page.getByRole('menuitem',{name:'Rename',exact:true}).click();
  await page.locator('#mw-well-name-form [name=name]').fill('Pending device rename');
  await page.locator('#mw-well-name-form [type=submit]').click();
  await page.locator('#mw-name-error').filter({hasText:'edits overlap'}).waitFor();
  assert.equal(account.saves,0);
  assert.equal(account.record.workspace.wellDrafts[0].name,'Cloud rename');
  const retained=await page.evaluate(uid=>JSON.parse(localStorage.getItem('stratax.projects.v2:'+uid)),account.uid);
  assert.equal(retained.contexts[id].wellDrafts[0].name,'Pending device rename');
  assert.equal(retained.cloudSaveBases[id].revision,1);
  assert.deepEqual(errors,[]);
  console.log('Passed automatic Google Maps placement and Cloud save recovery for two accounts, plus referenced-conflict and overlapping-edit retention.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
