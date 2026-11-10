const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {start}=require('./local-science-browser.cjs');

(async()=>{
 const evidence='.release/deviation-zip-20261109',bundle=evidence+'/generated.zip';
 fs.mkdirSync(evidence,{recursive:true});
 const python=process.env.STRATAX_FIXTURE_PYTHON||path.resolve('.venv/Scripts/python.exe');
 const build=spawnSync(python,['-',bundle],{encoding:'utf8',input:[
  'import sys,zipfile',
  'with zipfile.ZipFile(sys.argv[1], "w", zipfile.ZIP_DEFLATED) as z:',
  '    for name,uwi in [("QA-01","QA0001"),("QA-6","QA0006")]:',
  '        z.writestr("logs/"+name+".las",f"~Version\\nVERS. 2.0 :LAS\\nWRAP. NO :Wrap\\n~Well\\nWELL. {name} :Name\\nUWI. {uwi} :UWI\\n~Curve\\nDEPT.M :Depth\\nGR.GAPI :Gamma\\n~ASCII\\n0 10\\n1 20\\n")',
  '    z.writestr("stations.csv","Well,MD (m),Inclination (deg),AZIMGN (deg)\\nQA-06,0,0,0\\nQA-06,10,5,20\\n")',
  '    blocks = "".join(f"{i*scale:.6f} {i} {i*5}\\n" for scale in (0.3048,1) for i in range(6))',
  '    z.writestr("surveys/Directional Survey QA-01.asc","UWI: QA0001\\nMeasr. Depth Deviation\\n"+blocks)'
 ].join('\n')});
 assert.equal(build.status,0,build.stderr);
 const app=await start({nativeImports:true,env:{CLOUD_COPY_FIXTURE:'1',MAP_ONLY_FIXTURE:'1'}});
 try{
  const base='/api/projects/project',initial=(await app.request(base)).value;
  const setup=await app.request(base,{revision:initial.revision,project:{...initial.project,workflows:['petrophysics']},workspace:initial.workspace},'PUT');
  assert.equal(setup.status,200,JSON.stringify(setup.value));
  Object.assign(app.data.project,setup.value.project,{revision:setup.value.revision});
  const {page}=await app.createPage();
  await page.locator('.workbench-import').first().click();
  await page.locator('#wi-files').setInputFiles(bundle);
  await page.locator('#wi-continue').click();
  await page.locator('#wi-import-ready').waitFor({timeout:60000});
  const imports=async()=> (await app.request(base+'/imports')).value;
  const before=(await imports()).imports[0];
  const logs=before.datasets.filter(d=>d.family==='logs');
  assert.equal(logs.length,2);
  const one=logs.find(d=>d.name.includes('QA-01')),six=logs.find(d=>d.name.includes('QA-6'));
  assert.notEqual(one.well,six.well);
  const pending=before.datasets.find(d=>d.family==='deviation'&&d.well===one.well);
  const ready=before.datasets.find(d=>d.family==='deviation'&&d.well===six.well);
  assert.ok(pending?.issues.some(i=>i.code==='survey_blocks_review'&&i.severity==='blocking'));
  assert.ok(ready&&!ready.issues.some(i=>i.severity==='blocking'));
  await page.locator('#wi-import-ready').click();
  await page.locator('#quick-import-authority').check();
  await page.locator('#quick-import-form button[type=submit]').click();
  await page.locator('#wi-done').click();
  const after=await imports();
  assert.ok(after.datasets.some(d=>d.id===ready.id&&d.active&&d.well===six.well));
  assert.ok(!after.datasets.some(d=>d.id===pending.id));
  await page.evaluate(()=>{location.hash='map';});
  await page.locator('[data-map-well="'+six.well+'"]').click();
  assert.equal(await page.locator('#mw-active-survey').inputValue(),ready.id);
  await page.locator('[data-map-well="'+one.well+'"]').click();
  await page.getByText('0 imported datasets · 1 pending review').waitFor();
  await page.getByRole('button',{name:'Review pending surveys'}).click();
  await page.getByText('Import details',{exact:true}).waitFor();
  assert.deepEqual(app.errors,[]);
  const result={attachedSurvey:1,pendingSurveyVisible:1,wells:2,consoleErrors:0};
  fs.writeFileSync(evidence+'/browser.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
