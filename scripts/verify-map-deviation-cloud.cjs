const assert=require('node:assert/strict');
const fs=require('node:fs');
const {start}=require('./local-science-browser.cjs');
(async()=>{
 const evidence='.release/direct-deviation-20261116';
 fs.mkdirSync(evidence,{recursive:true});
 const app=await start({evidence,siteBase:process.env.STRATAX_UI_BASE,nativeImports:true,env:{CLOUD_COPY_FIXTURE:'1',MAP_ONLY_FIXTURE:'1'}});
 try{
  const base='/api/projects/project',before=(await app.request(base)).value;
  const project={...before.project,status:'Active',workflows:['petrophysics']};
  const workspace={...before.workspace,wellDrafts:[{id:'A',name:'First survey well'},{id:'B',name:'Second survey well'}]};
  const seeded=await app.request(base,{project,workspace,revision:before.revision},'PUT');
  assert.equal(seeded.status,200,JSON.stringify(seeded.value));
  Object.assign(app.data.project,seeded.value.project,{revision:seeded.value.revision});
  const {page}=await app.createPage();
  await page.evaluate(()=>{location.hash='map';});
  await page.locator('.mw-well-row [data-map-well-menu="A"]').click();
  await page.getByRole('menuitem',{name:/Add deviation data/}).click();
  const form=page.locator('#mw-survey-import');
  await form.locator('[type=file]').setInputFiles({name:'A-survey.csv',mimeType:'text/csv',buffer:Buffer.from('X,Y,TVD\n481000,69000,0\n481030,69010,30\n481090,69030,100\n')});
  await form.locator('[name=surveyMethod]').waitFor();
  await form.locator('[name=surveyMethod]').selectOption('xy_tvd');
  await form.locator('[name=depthUnit]').selectOption('m');
  await form.locator('[name=verticalDatum]').fill('KB');
  await form.locator('[type=submit]').click();
  await page.locator('#mw-survey-import [name=acknowledge], #mw-survey-import-error:not(:empty), dialog:not([open])').first().waitFor({state:'attached',timeout:35000});
  assert.equal(await form.locator('#mw-survey-import-error').textContent(),'');
  if(await form.locator('[name=acknowledge]').count()){
   assert.equal(app.requests.filter(r=>r.path.endsWith('/commit')).length,0);
   await form.locator('[name=acknowledge]').check();
   await form.locator('[type=submit]').click();
  }
  await page.locator('#dialog').waitFor({state:'hidden',timeout:35000});
  const result=(await app.request(base+'/imports')).value;
  const surveys=result.datasets.filter(d=>d.family==='deviation'&&d.active);
  assert.equal(surveys.length,1);
  assert.equal(surveys[0].well,'A');
  assert.equal(surveys[0].rowCount,3);
  assert.equal(app.requests.filter(r=>r.path.endsWith('/commit')).length,1);
  assert.equal(await page.locator('#well-import-form').count(),0);
  assert.deepEqual(app.errors,[]);
  console.log('Passed direct Cloud survey upload, inspection, warning review, and well-scoped activation.');
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
