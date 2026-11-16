const assert=require('node:assert/strict');
const {start}=require('./local-science-browser.cjs');
const fs=require('node:fs');
(async()=>{
 const evidence='.release/map-wells-20261116';
 fs.mkdirSync(evidence,{recursive:true});
 const app=await start({evidence,siteBase:process.env.STRATAX_UI_BASE,env:{MAP_ONLY_FIXTURE:'1'}});
 try{
  const a={id:'A',name:'A',sourceCoordinates:{x:481000,y:69000}},b={id:'B',name:'B',sourceCoordinates:{x:481200,y:69100}};
  const columns=[{id:'x',unit:'m'},{id:'y',unit:'m'},{id:'tvd',unit:'m'}];
  const source={id:'survey',name:'Deviation A',family:'deviation',well:'A',importId:'fixture',surveyMethod:'xy_tvd',mapping:{x:0,y:1,tvd:2},columns,rowCount:3,chunks:[{name:'survey.jsonl'}],references:{depthUnit:'m',depthReference:'TVD',verticalDatum:'KB'}};
  Object.assign(app.data.project,{storage:'portable',coordinates:{lat:51,lng:0}});
  app.data.datasets=[{id:'header',family:'well_headers',name:'Monza fixture',wellRecords:[a,b],columns,mapping:{x:0,y:1}},source,{id:'log-b',family:'logs',well:'B'}];
  const baseDatasets=[...app.data.datasets];
  app.data.datasets.push(
   {id:'log-only',family:'logs',well:'C',name:'C LAS',references:{crs:'EPSG:32632'},metadata:{headers:{WELL:{value:'C log well'},EASTING:{value:481400},NORTHING:{value:69400}}}},
   {id:'log-unplaced',family:'logs',well:'D',metadata:{headers:{WELL:{value:'D unplaced'}}}},
   {id:'header-only',family:'well_headers',name:'Additional headers',wellRecords:[
    {id:'E',name:'E header only',sourceCoordinates:{x:100,y:300}},
    {id:'F',name:'F conflict',sourceCoordinates:{x:110,y:310}},
    {id:'F',name:'F conflict',sourceCoordinates:{x:120,y:310}},
   ]},
   {id:'inactive-log',family:'logs',well:'G',active:false});
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
  await page.locator('[data-map-well="C"]').waitFor();
  assert.match(await page.locator('[data-map-well="D"]').textContent(),/Unplaced/);
  assert.match(await page.locator('[data-map-well="F"]').textContent(),/disagree/);
  assert.equal(await page.locator('[data-map-well="G"]').count(),0);
  await page.locator('#mw-grid-select').selectOption('geographic');
  await svg.locator('g[data-map-point="C"]').waitFor();
  await page.locator('#mw-grid-select').selectOption({label:'Additional headers'});
  await svg.locator('g[data-map-point="E"]').waitFor();
  assert.equal(await svg.locator('g[data-map-point="F"]').count(),0);
  await page.locator('#mw-grid-select').selectOption({label:'Monza fixture'});
  await svg.locator('polyline.mw-trajectory[data-map-point="A"]').waitFor();
  assert.match(await svg.textContent(),/X position \(km\)/);
  assert.doesNotMatch(await svg.textContent(),/Project site/);
  const marker=await svg.locator('g[data-map-point="A"]').getAttribute('transform');
  assert.equal((await svg.locator('polyline').getAttribute('points')).split(' ')[0],marker.slice(10,-1));
  const rect=await svg.locator('.mw-grid-edge').boundingBox();
  const click=async(x,y)=>page.mouse.click(rect.x+rect.width*x,rect.y+rect.height*y);
  await page.getByRole('button',{name:'Measure',exact:true}).click();
  await click(.35,.35);await click(.60,.35);
  assert.match(await page.locator('#mw-measure-status').textContent(),/Distance.*\d m/);
  assert.equal(await page.locator('.mw-measure-results dd').count(),10);
  assert.match(await page.locator('.mw-measure-results dd').first().textContent(),/ km$/);
  await page.getByRole('button',{name:'Done',exact:true}).click();
  await page.getByRole('button',{name:'Area',exact:true}).click();
  await click(.35,.35);await click(.6,.35);await click(.6,.6);await click(.35,.6);
  await page.getByRole('button',{name:'Finish area'}).click();
  assert.match(await page.locator('#mw-measure-status').textContent(),/Area.*\d m²/);
  assert.match(await svg.locator('.mw-measure-shape').getAttribute('d'),/ Z$/);
  assert.equal(await page.locator('.mw-measure-results dd').count(),10);
  assert.match(await page.locator('.mw-measure-results dd').nth(1).textContent(),/ ha$/);
  await page.keyboard.press('Escape');
  await page.locator('#mw-deviation').uncheck();
  assert.equal(await svg.locator('polyline').count(),0);
  await page.locator('#mw-deviation').check();
  await svg.locator('polyline').waitFor();
  await page.locator('.mw-inspector [data-map-command=deviation]').click();
  assert.equal(await page.locator('[data-mw-deviation-well]').count(),6);
  await page.locator('#mw-deviation-search').fill('unplaced');
  assert.equal(await page.locator('[data-mw-deviation-well]:visible').count(),1);
  await page.locator('#mw-deviation-search').fill('');
  await page.locator('[data-mw-deviation-well="A"]').click();
  assert.equal(await page.locator('#mw-survey-destination').textContent(),'Controlled A');
  if(process.env.STRATAX_CAPTURE_SURVEY_DIALOG){
   await page.locator('#dialog').screenshot({path:'.release/map-wells-20261116/deviation-dialog.png'});
   await page.setViewportSize({width:390,height:844});
   const dialog=await page.locator('#dialog').boundingBox();
   assert(dialog.width<390&&dialog.x>=0);
   await page.setViewportSize({width:1600,height:1100});
  }
  async function importSurvey(name,rows){
   const importer=page.locator('#mw-survey-import');
   assert.equal(await page.locator('#well-import-form').count(),0);
   await importer.locator('[type=file]').setInputFiles({name,mimeType:'text/csv',buffer:Buffer.from(rows)});
   await importer.locator('[name=surveyMethod]').waitFor();
   await importer.locator('[name=surveyMethod]').selectOption('xy_tvd');
   await importer.locator('[name=depthUnit]').selectOption('m');
   await importer.locator('[name=verticalDatum]').fill('KB');
   await importer.locator('[type=submit]').click();
   await page.locator('#mw-survey-import [name=acknowledge]').or(page.locator('dialog:not([open])')).first().waitFor({state:'attached'});
   if(await page.locator('#mw-survey-import [name=acknowledge]').count()){
    await importer.locator('[name=acknowledge]').check();
    await importer.locator('[type=submit]').click();
   }
   await page.locator('#dialog').waitFor({state:'hidden'});
  }
  await importSurvey('A-update.csv','X,Y,TVD\n481000,69000,0\n481030,69010,30\n481090,69030,100\n');
  await page.locator('.mw-well-row button[data-map-well-menu="B"]').click();
  await page.getByRole('menuitem',{name:/Add deviation data/}).click();
  assert.equal(await page.locator('[data-mw-deviation-well]').count(),0);
  assert.equal(await page.locator('#mw-survey-destination').textContent(),'Controlled B');
  await importSurvey('B-survey.csv','X,Y,TVD\n481200,69100,0\n481260,69110,50\n481310,69140,100\n');
  const bPath=svg.locator('polyline.mw-trajectory[data-map-point="B"]');
  await bPath.waitFor({state:'attached'});
  assert.equal(await svg.locator('.mw-survey-end').count(),2);
  await page.locator('#mw-deviation').uncheck();
  assert.equal(await bPath.count(),0);
  await page.locator('.mw-well-row button[data-map-well-menu="B"]').click();
  await page.getByRole('menuitem',{name:'Show trajectory'}).click();
  await bPath.waitFor({state:'attached'});
  assert.equal(await page.locator('#mw-deviation').isChecked(),true);
  await context.close();

  const conflict={...a,sourceCoordinates:{...a.sourceCoordinates,crs:'EPSG:26391',coordinateConflict:true,geographicCoordinates:{lat:4.62,lng:6.79}}};
  const angular={...source,id:'angular-survey',chunks:[{name:'angular.jsonl'}],surveyMethod:'angles',
   mapping:{md:0,inclination:1,azimuth:2},references:{depthReference:'MD',depthUnit:'ft'}};
  app.data.datasets=[{...baseDatasets[0],wellRecords:[conflict,b]},angular,baseDatasets[2]];
  const reviewed=await app.createPage();
  await reviewed.page.evaluate(async()=>{
   const repo=await import('./project-repository.js');
   await repo.putArtifact({id:'project',storage:'portable'},'fixture','angular.jsonl',new Blob(['[0,0,0]\n[1000,0,270]\n[2000,14,270]\n']));
   location.hash='map';
  });
  await reviewed.page.locator('g[data-map-point="A"]').waitFor();
  assert.match(await reviewed.page.locator('[data-map-well="A"]').textContent(),/geographic conflict/);
  assert.equal(await reviewed.page.locator('.mw-trajectory').count(),0);
  await reviewed.page.locator('[data-map-well="A"]').click();
  await reviewed.page.getByRole('button',{name:'Review survey map references'}).click();
  await reviewed.page.locator('#mw-survey-refs [name=angleUnit]').selectOption('degrees');
  await reviewed.page.locator('#mw-survey-refs [name=northReference]').selectOption('Grid north');
  await reviewed.page.locator('#mw-survey-refs [name=sameGrid]').check();
  await reviewed.page.getByRole('button',{name:'Apply to map'}).click();
  const path=reviewed.page.locator('polyline[data-map-point="A"]');
  await path.waitFor({state:'attached'});
  assert.equal(new Set((await path.getAttribute('points')).split(' ')).size,2);
  assert.equal(await reviewed.page.locator('.mw-survey-end[data-map-point="A"]').count(),1);
  await reviewed.page.locator('.mw-menu summary').filter({hasText:'Basemap'}).click();
  await reviewed.page.getByRole('button',{name:'Google Roadmap'}).click();
  await reviewed.page.getByText(/No geographically referenced wells/).waitFor();
  await reviewed.page.locator('.mw-well-row button[data-map-well-menu="A"]').click();
  await reviewed.page.getByRole('menuitem',{name:'Show trajectory'}).click();
  await path.waitFor({state:'attached'});
  await reviewed.context.close();

  app.data.datasets=baseDatasets;
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
  console.log('Passed source-grid wellheads and trajectories, distance, area, layer toggle, imported well visibility, targeted deviation import, geographic fit, and folder reconnect/save.');
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
