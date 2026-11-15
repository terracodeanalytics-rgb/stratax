const assert=require('node:assert/strict');
const {start}=require('./local-science-browser.cjs');
const fs=require('node:fs');
(async()=>{
 const evidence='.release/map-field-20261115';
 fs.mkdirSync(evidence,{recursive:true});
 const app=await start({evidence,siteBase:process.env.STRATAX_UI_BASE,env:{MAP_ONLY_FIXTURE:'1'}});
 try{
  const a={id:'A',name:'A',sourceCoordinates:{x:481000,y:69000}},b={id:'B',name:'B',sourceCoordinates:{x:481200,y:69100}};
  const columns=[{id:'x',unit:'m'},{id:'y',unit:'m'},{id:'tvd',unit:'m'}];
  const source={id:'survey',name:'Deviation A',family:'deviation',well:'A',importId:'fixture',surveyMethod:'xy_tvd',mapping:{x:0,y:1,tvd:2},columns,rowCount:3,chunks:[{name:'survey.jsonl'}],references:{depthUnit:'m',depthReference:'TVD',verticalDatum:'KB'}};
  Object.assign(app.data.project,{storage:'portable',coordinates:{lat:51,lng:0}});
  app.data.datasets=[{id:'header',family:'well_headers',name:'Monza fixture',wellRecords:[a,b],columns,mapping:{x:0,y:1}},source,{id:'log-b',family:'logs',well:'B'}];
  const {page,context}=await app.createPage();
  await page.evaluate(async()=>{
   const repository=await import('./project-repository.js');
   await repository.putArtifact({id:'project',storage:'portable'},'fixture','survey.jsonl',new Blob(['[481000,69000,0]\n[481050,69020,60]\n[481080,69050,110]\n']));
   location.hash='map';
  });
  const svg=page.locator('#mw-field-svg');
  await svg.locator('polyline.mw-trajectory[data-map-point="A"]').waitFor();
  assert.equal(await svg.locator('g[data-map-point]').count(),2);
  assert.equal(await svg.locator('.mw-survey-end').count(),1);
  assert.match(await svg.textContent(),/X position \(km\)/);
  assert.doesNotMatch(await svg.textContent(),/Project site/);
  const marker=await svg.locator('g[data-map-point="A"]').getAttribute('transform');
  assert.equal((await svg.locator('polyline').getAttribute('points')).split(' ')[0],marker.slice(10,-1));
  const rect=await svg.locator('.mw-grid-edge').boundingBox();
  const click=async(x,y)=>page.mouse.click(rect.x+rect.width*x,rect.y+rect.height*y);
  await page.getByRole('button',{name:'Measure',exact:true}).click();
  await click(.35,.35);await click(.60,.35);
  assert.match(await page.locator('#mw-measure-status').textContent(),/Distance.*\d m/);
  await page.getByRole('button',{name:'Area',exact:true}).click();
  await click(.35,.35);await click(.6,.35);await click(.6,.6);await click(.35,.6);
  await page.getByRole('button',{name:'Finish area'}).click();
  assert.match(await page.locator('#mw-measure-status').textContent(),/Area.*\d m²/);
  assert.match(await svg.locator('.mw-measure-shape').getAttribute('d'),/ Z$/);
  await page.keyboard.press('Escape');
  await page.locator('#mw-deviation').uncheck();
  assert.equal(await svg.locator('polyline').count(),0);
  await page.locator('#mw-deviation').check();
  await svg.locator('polyline').waitFor();
  await page.locator('.mw-menu summary').filter({hasText:'Basemap'}).click();
  await page.getByRole('button',{name:'Google Roadmap'}).click();
  await page.getByText(/No geographically referenced wells/).waitFor();
  await context.close();

  a.sourceCoordinates.crs=b.sourceCoordinates.crs='EPSG:32632';
  source.references.crs='EPSG:32632';
  const geographic=await app.createPage();
  await geographic.page.evaluate(async()=>{
   const repository=await import('./project-repository.js');
   await repository.putArtifact({id:'project',storage:'portable'},'fixture','survey.jsonl',new Blob(['[481000,69000,0]\n[481050,69020,60]\n[481080,69050,110]\n']));
   window.__geometry={markers:[],lines:[],fit:[]};
   window.google={maps:{
    Map:class {fitBounds(bounds){window.__geometry.fit=bounds.points;}},
    Marker:class {constructor({position}){window.__geometry.markers.push(position);}addListener(){}},
    Polyline:class {constructor({path}){window.__geometry.lines.push(path);}},
    LatLngBounds:class {constructor(){this.points=[];}extend(point){this.points.push(point);}},
    Size:class {},Point:class {},SymbolPath:{CIRCLE:'circle'}
   }};
   location.hash='map';
  });
  await geographic.page.locator('#mw-field-svg .mw-trajectory').waitFor();
  await geographic.page.locator('.mw-menu summary').filter({hasText:'Basemap'}).click();
  await geographic.page.getByRole('button',{name:'Google Roadmap'}).click();
  await geographic.page.waitForFunction(()=>window.__geometry.markers.length===3);
  const geometry=await geographic.page.evaluate(()=>window.__geometry);
  assert.equal(geometry.lines.length,1);
  assert.equal(geometry.lines[0].length,3);
  assert.equal(geometry.fit.length,5);
  assert(geometry.markers.every(point=>point.lat<2));
  await geographic.context.close();

  app.data.project.storage='local';
  const local=await app.createPage();
  await local.page.evaluate(()=>{location.hash='map';});
  await local.page.locator('#mw-folder-access').getByRole('button',{name:'Reconnect project folder'}).waitFor();
  await local.page.locator('#mw-folder-access').getByRole('button',{name:'Reconnect project folder'}).click();
  await local.page.getByRole('button',{name:'Choose project folder'}).waitFor();
  const storedProject=app.data.project;
  await local.page.evaluate(project=>{
   window.__folderWrites=[];
   window.showDirectoryPicker=async()=>({
    name:'Fixture folder',queryPermission:async()=> 'granted',
    getFileHandle:async()=>({getFile:async()=>new Blob([JSON.stringify({schemaVersion:1,project,workspace:{files:[]}})]),
     createWritable:async()=>({write:async text=>window.__folderWrites.push(JSON.parse(text)),close:async()=>{},abort:async()=>{}})})
   });
   const original=IDBObjectStore.prototype.put;
   IDBObjectStore.prototype.put=function(value,key){return original.call(this,typeof value?.getFileHandle==='function'?{fixtureFolder:true}:value,key);};
  },storedProject);
  await local.page.getByRole('button',{name:'Choose project folder'}).click();
  await local.page.waitForFunction(()=>window.__folderWrites.length===1);
  await local.page.waitForFunction(()=>document.querySelector('#mw-folder-access')?.hidden===true);
  assert.equal(await local.page.evaluate(()=>window.__folderWrites[0].project.id),storedProject.id);
  assert.deepEqual(app.errors,[]);
  console.log('Passed source-grid wellheads and trajectories, distance, area, layer toggle, geographic fit and fallback, and folder reconnect/save.');
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
