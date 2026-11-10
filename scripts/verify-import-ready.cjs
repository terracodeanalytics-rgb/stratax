const assert=require('node:assert/strict');
const {start}=require('./local-science-browser.cjs');

(async()=>{
 const app=await start({nativeImports:true,env:{CLOUD_COPY_FIXTURE:'1'}});
 try{
  const base='/api/projects/project';
  const {page}=await app.createPage();
  await page.locator('[data-pp-action=import]:visible').click();
  await page.locator('#wi-files').setInputFiles('.release/import-repair-20261108/generated.zip');
  await page.locator('#wi-continue').click();
  const shortcut=page.locator('#wi-import-ready');
  await shortcut.waitFor({timeout:60000});
  assert.match(await shortcut.locator('..').innerText(),/3 ready to import · 1 pending/);

  const guardCases=await page.evaluate(async()=>{
   const {readyImportDatasets}=await import('/ingestion-client.js');
   const ready={id:'ready',sourceId:'A'},other={id:'other',sourceId:'B'};
   const record={status:'awaiting confirmation',datasets:[ready,other],assets:[{id:'A',name:'a.las'},{id:'B',name:'b.asc'}]};
   const cases=[{datasetId:'other'},{sourceId:'B'},{source:'b.asc'},{}];
   return cases.map(issue=>readyImportDatasets({...record,issues:[{...issue,severity:'blocking'}]}).map(d=>d.id));
  });
  assert.deepEqual(guardCases,[['ready'],['ready'],['ready'],[]]);

  await shortcut.click();
  await page.locator('#quick-import-back').click();
  await shortcut.waitFor();
  await page.locator('#wi-leave-pending').check();
  assert.match(await shortcut.locator('..').innerText(),/2 ready to import · 2 pending/);
  await page.locator('#wi-leave-pending').uncheck();
  await shortcut.click();
  const form=page.locator('#quick-import-form');
  await form.locator('button[type=submit]').click();
  assert.equal(app.requests.filter(r=>r.path.endsWith('/commit')).length,0);
  await page.locator('#quick-import-authority').check();
  await form.locator('button[type=submit]').click();
  await page.locator('#wi-done').waitFor();
  const read=async()=> (await app.request(base+'/imports')).value.imports[0];
  const record=await read();
  assert.equal(record.datasets.filter(d=>d.active).length,3);
  const pending=record.datasets.filter(d=>!d.active);
  assert.equal(pending.length,1);
  assert.equal(pending[0].family,'checkshots');
  assert.deepEqual(record.pendingDatasetIds,[pending[0].id]);
  assert.equal(app.requests.filter(r=>r.method==='POST'&&r.path.includes('/upload/')).length,1);
  assert.equal(app.requests.filter(r=>r.method==='POST'&&r.path.endsWith('/inspect')).length,1);
  assert.equal(app.requests.filter(r=>r.method==='PUT'&&r.path.endsWith('/configuration')).length,0);
  assert.equal(app.requests.filter(r=>r.path.endsWith('/commit')).length,1);
  await page.locator('#wi-done').click();
  await page.reload();
  await page.locator('.iw').waitFor();
  assert.deepEqual((await read()).acceptedDatasetIds,record.acceptedDatasetIds);
  await page.evaluate(()=>{location.hash='data';});
  await page.locator('[data-data-section=history]').click();
  await page.locator('[data-import="'+record.id+'"]').click();
  await page.locator('#resolve-pending-sources').waitFor();
  assert.equal(await page.locator('#history-import-ready').count(),0);
  assert.deepEqual(app.errors,[]);
  console.log(JSON.stringify({ready:3,pending:1,inspections:1,configurationWrites:0,transfers:1,consoleErrors:app.errors.length}));
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
