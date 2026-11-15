const assert=require('node:assert/strict');
const fs=require('node:fs');
const {start}=require('./local-science-browser.cjs');

(async()=>{
 const evidence='.release/log-source-20261115';
 fs.mkdirSync(evidence,{recursive:true});
 const app=await start({evidence,siteBase:process.env.STRATAX_UI_BASE,env:{MAP_ONLY_FIXTURE:'1'}});
 try{
  const project=Object.assign(app.data.project,{storage:'local'});
  app.data.datasets=[{id:'local-log',importId:'fixture',family:'logs',well:'A',name:'Monza fixture',
   active:true,rowCount:3,indexColumnId:'column-0',references:{depthUnit:'m',depthReference:'MD'},
   columns:[{id:'column-0',mnemonic:'DEPT',unit:'m'},{id:'column-1',mnemonic:'GR',unit:'gAPI'}],
   chunks:[{name:'log.jsonl'}]}];
  const {page}=await app.createPage();
  if(await page.locator('[data-wb-curve-path]').count()===0&&await page.locator('[data-wb-action=all-wells]').first().isVisible()){
   const empty=await page.locator('.wb-empty [data-wb-action=all-wells]').count();
   if(empty){
    await page.locator('.wb-empty [data-wb-action=all-wells]').click();
    await page.locator('#wb-choose-wells input[type=checkbox]').first().check();
    await page.locator('#wb-choose-wells button').click();
   }
  }
  const reconnect=page.locator('.wb-range-warning').getByRole('button',{name:'Reconnect project folder'});
  await reconnect.waitFor();
  assert.match(await page.locator('.wb-error-label').first().textContent(),/Folder access needed/);
  await page.evaluate(project=>{
   window.__sourceReads=0;
   window.showDirectoryPicker=async()=>({
    name:'Monza fixture',queryPermission:async()=> 'granted',
    getDirectoryHandle:async name=>{
     if(name!=='datasets')throw new Error('Unexpected artifact root');
     return {getDirectoryHandle:async id=>{
      if(id!=='fixture')throw new Error('Unexpected import ID');
      return {getFileHandle:async name=>{
       if(name!=='log.jsonl')throw new Error('Unexpected artifact name');
       return {getFile:async()=>{window.__sourceReads++;return new Blob(['[100,20]\n[101,50]\n[102,75]\n']);}};
      }};
     }};
    },
    getFileHandle:async()=>({
     getFile:async()=>new Blob([JSON.stringify({schemaVersion:1,project,workspace:{files:[]}})]),
     createWritable:async()=>({write:async()=>{},close:async()=>{},abort:async()=>{}})
    })
   });
   const put=IDBObjectStore.prototype.put;
   IDBObjectStore.prototype.put=function(value,key){return put.call(this,typeof value?.getFileHandle==='function'?{fixtureFolder:true}:value,key);};
  }, project);
  await reconnect.click();
  await page.getByRole('button',{name:'Choose project folder'}).click();
  await page.locator('[data-wb-curve-path][d^="M"]').first().waitFor({state:'attached'});
  assert.equal(await reconnect.count(),0);
  assert.equal(await page.evaluate(()=>window.__sourceReads),1);
  assert.deepEqual(app.errors,[]);
  console.log('Passed disconnected local log, inline reconnect, and automatic recovery of all three retained samples.');
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
