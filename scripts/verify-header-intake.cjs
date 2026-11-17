const assert=require('node:assert/strict'),fs=require('node:fs');
const {start}=require('./local-science-browser.cjs');
const evidence='.release/header-intake-20261117';
fs.mkdirSync(evidence,{recursive:true});
(async()=>{
 for(const uid of ['header-owner','header-second']){
  const app=await start({uid,evidence,siteBase:process.env.STRATAX_UI_BASE,env:{MAP_ONLY_FIXTURE:'1'}});
  try{
   app.data.project={...app.data.project,storage:'portable'};
   app.data.datasets=[];
   const {page}=await app.createPage();
   await page.locator('[data-pp-action=import]:visible').first().click();
   const download=page.waitForEvent('download');
   await page.locator('#wi-sample').click();
   const file=await(await download).path();
   assert.match(fs.readFileSync(file,'utf8'),/WELL,UWI/);
   const sample=await page.evaluate(async()=> (await import('./import-samples.js')).importSample('logs'));
   await page.locator('#wi-files').setInputFiles({name:sample.name,mimeType:sample.type,buffer:Buffer.from(sample.text)});
   await page.locator('#well-import-form[aria-busy=false]').waitFor();
   await page.locator('#wi-continue').click();
   assert.match(await page.locator('.setup-error').innerText(),/header first/);
   assert.equal(await page.locator('#wi-build-headers').count(),0);
   await page.locator('#wi-header-files').setInputFiles({name:'well-header.csv',mimeType:'text/csv',buffer:Buffer.from('WELL,UWI\nEXAMPLE_1,EXAMPLE-001\n')});
   await page.locator('#well-import-form[aria-busy=false]').waitFor();
   await page.locator('#wi-deviation-files').setInputFiles({name:'survey.csv',mimeType:'text/csv',buffer:Buffer.from('MD(m),INCLINATION(deg),AZIMGN(deg)\n0,0,0\n100,2,45\n')});
   await page.locator('#well-import-form[aria-busy=false]').waitFor();
   for(let step=0;step<4;step++){await page.locator('#wi-continue').click();await page.locator('#well-import-form[aria-busy=false]').waitFor();}
   await page.locator('#wi-authority').check();
   await page.locator('#wi-continue').click();
   await page.locator('#wi-view-data').waitFor({timeout:30000});
   const result=await page.evaluate(uid=>JSON.parse(localStorage.getItem('stratax.projects.v2:'+uid)),uid);
   const workspace=result.contexts[result.activeId],datasets=workspace.ingestion.datasets;
   const header=datasets.find(d=>d.family==='well_headers'),log=datasets.find(d=>d.family==='logs'),survey=datasets.find(d=>d.family==='deviation');
   assert(header&&log&&survey,'Header, log and optional survey activate together');
   assert.equal(header.wellRecords[0].id,log.well);
   assert.equal(survey.well,log.well);
   assert.equal(log.normalization.format,'stratax-dataset/1');
   assert.equal(log.normalization.rowEncoding,'json-array');
   assert.equal(log.columns[1].effectiveUnit,'gAPI');
   assert.equal(log.preview[2][1],null);
   await page.screenshot({path:evidence+'/'+uid+'.png'});
   await page.locator('#wi-view-map').click();
   await page.locator('[data-map-well="'+log.well+'"]').click();
   await page.locator('.mw-inspector [data-map-command=deviation]').click();
   await page.locator('#mw-survey-import').waitFor();
   const surveyDownload=page.waitForEvent('download');
   await page.locator('#mw-deviation-sample').click();
   assert.match(fs.readFileSync(await(await surveyDownload).path(),'utf8'),/MD\(m\),INCLINATION\(deg\),AZIMUTH\(deg\)/);
   await page.locator('#mw-deviation-cancel').click();
   await page.goto(new URL(page.url()).origin+'/__fixture-reset.html');
   await page.evaluate(uid=>{
    const key='stratax.projects.v2:'+uid,record=JSON.parse(localStorage.getItem(key));
    record.records.push({id:'folder-target',name:'Existing folder',storage:'local',status:'Active',workflows:['petrophysics'],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
    record.contexts['folder-target']={project:'Existing folder',files:[],audit:[],wellDrafts:[]};
    localStorage.setItem(key,JSON.stringify(record));
   },uid);
   await page.goto(new URL(page.url()).origin+'/#projects');
   await page.locator('[data-openproject=folder-target]').first().click();
   await page.locator('#open-project-folder-picker').waitFor();
   await page.evaluate(uid=>{
    window.__folderChoice='wrong';window.__folderWrites=0;
    window.showDirectoryPicker=async()=>{
     if(window.__folderChoice==='cancel')throw new DOMException('Cancelled','AbortError');
     return {name:'Original folder',queryPermission:async()=> 'granted',
      getFileHandle:async()=>({getFile:async()=>new Blob([JSON.stringify({schemaVersion:1,project:{
       id:window.__folderChoice==='wrong'?'wrong-folder':'folder-target',name:'Existing folder',
       workflows:['petrophysics'],storage:'local'},workspace:{project:'Existing folder',files:[],audit:[{action:'Retained disk workspace'}],wellDrafts:[]}})]),
       createWritable:async()=>{window.__folderWrites++;return {write:async()=>{},close:async()=>{}};}})};
    };
    const put=IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put=function(value,key){return put.call(this,typeof value?.getFileHandle==='function'?{fixtureFolder:true}:value,key);};
   },uid);
   await page.locator('#open-project-folder-picker').click();
   await page.getByText('Choose the original folder for this project.',{exact:true}).waitFor();
   assert.match(await page.locator('#open-project-folder-error').innerText(),/original folder/);
   await page.evaluate(()=>window.__folderChoice='cancel');
   await page.locator('#open-project-folder-picker').click();
   assert.equal(await page.locator('#open-project-folder-picker').count(),1);
   await page.evaluate(()=>window.__folderChoice='correct');
   await page.locator('#open-project-folder-picker').click();
   await page.waitForURL('**/#overview');
   const opened=await page.evaluate(uid=>JSON.parse(localStorage.getItem('stratax.projects.v2:'+uid)),uid);
   assert.equal(opened.activeId,'folder-target');
   assert.equal(opened.contexts['folder-target'].audit[0].action,'Retained disk workspace');
   assert.equal(await page.evaluate(()=>window.__folderWrites),0);
   assert.deepEqual(app.errors,[]);
   console.log(uid+' passed header gate, normalization, sample download, optional deviation and existing-folder opening');
  }catch(error){
   for(const context of app.browser.contexts())for(const page of context.pages()){
    console.error(JSON.stringify({url:page.url(),body:(await page.locator('body').innerText()).slice(-3500),errors:app.errors}));
    await page.screenshot({path:evidence+'/failure-'+uid+'.png',fullPage:true});
   }
   throw error;
  }finally{await app.close();}
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
