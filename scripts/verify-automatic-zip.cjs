const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const {start}=require('./local-science-browser.cjs');

const evidence='.release/automatic-zip-20261110';
const python=process.env.STRATAX_FIXTURE_PYTHON||path.resolve('.venv/Scripts/python.exe');
const build=(filename,kind)=>{
 const result=spawnSync(python,['-',filename,kind],{encoding:'utf8',input:[
  'import random,sys,zipfile',
  'with zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_STORED) as z:',
  ' for name in ("QA-01","QA-02"):',
  '  z.writestr("logs/"+name+".las",f"~Version\\nVERS. 2.0 :LAS\\nWRAP. NO :Wrap\\n~Well\\nWELL. {name} :Well\\nUWI. {name} :UWI\\nSTRT.M 0 :Start\\n~Curve\\nDEPT.M :Depth\\nGR.GAPI :Gamma\\n~ASCII\\n0 10\\n1 20\\n")',
  ' if sys.argv[2] != "small":',
  '  z.writestr("stations.csv","Well,MD (m),Inclination (deg),AZIMGN (deg)\\nQA-01,0,0,0\\nQA-99,0,0,0\\nQA-01,10,5,20\\nQA-99,10,5,21\\n")',
  '  z.writestr("seismic.sgy",b"Outside the petrophysics workflow")',
  '  z.writestr("mystery.bin",b"\\x00unknown binary")',
  ' if sys.argv[2] == "large":z.writestr("unfamiliar-big.bin",random.Random(29).randbytes(36*1024**2))'
 ].join('\n')});
 assert.equal(result.status,0,result.stderr);
};

async function run(kind,mode,rate,{checkReview=false}={}){
 const dir=evidence+'/'+kind+'-'+mode+'-'+rate;
 fs.mkdirSync(dir,{recursive:true});
 const bundle=dir+'/generated.zip';
 build(bundle,kind);
 const app=await start({evidence:dir,nativeImports:true,env:{CLOUD_COPY_FIXTURE:'1',MAP_ONLY_FIXTURE:'1',
  STRATAX_AUTOMATIC_ZIP:mode==='automatic'?'1':'0',FIXTURE_UPLOAD_BPS:String(rate)}});
 try{
  const base='/api/projects/project',before=(await app.request(base)).value;
  const setup=await app.request(base,{revision:before.revision,project:{...before.project,workflows:['petrophysics']},workspace:before.workspace},'PUT');
  assert.equal(setup.status,200,JSON.stringify(setup.value));
  Object.assign(app.data.project,setup.value.project,{revision:setup.value.revision});
  const {page}=await app.createPage(),imports=async()=> (await app.request(base+'/imports')).value;
  await page.evaluate(()=>{location.hash='data';});
  await page.locator('.data-library').waitFor();
  let metrics={},started;
  if(mode==='automatic'){
   await page.locator('#automatic-zip-upload').waitFor();
   started=performance.now();
   await page.locator('#automatic-zip-file').setInputFiles(bundle);
   await page.locator('[data-zip-timings]').waitFor({timeout:90000});
   metrics=JSON.parse(await page.locator('[data-zip-timings]').getAttribute('data-zip-timings'));
   assert.equal(app.requests.filter(r=>r.path.endsWith('/commit')).length,0);
   await page.locator('#zip-view-wells').click();
  }else{
   await page.locator('.data-page-head [data-action=upload]').click();
   started=performance.now();
   await page.locator('#wi-files').setInputFiles(bundle);
   await page.locator('#wi-continue').click();
   await page.locator('#wi-import-ready').click({timeout:90000});
   await page.locator('#quick-import-authority').check();
   await page.locator('#quick-import-form button[type=submit]').click();
   await page.locator('#wi-done').click();
  }
  await page.getByRole('button',{name:'View evidence',exact:true}).first().waitFor();
  const elapsed=performance.now()-started;
  const first=(await imports()).imports[0];
  assert.equal(first.datasets.filter(d=>d.active&&d.family==='logs').length,2,JSON.stringify(first.issues));
  if(mode==='automatic'){
   assert.equal(first.mode,'automatic_zip');
   assert.equal(first.automaticResult.accepted,kind==='small'?2:3,JSON.stringify(first.issues));
   assert.equal(first.automaticResult.pending,kind==='small'?0:kind==='large'?3:2,JSON.stringify(first.issues));
   assert.equal(first.automaticResult.skipped.length,kind==='small'?0:1);
   assert.equal(first.progress.phase,'done');
   assert.ok(Number.isFinite(metrics.transferMs)&&Number.isFinite(metrics.parsingMs));
   const wells=await page.locator('[data-well-evidence]').count();
   assert.ok(wells>=2);
   if(checkReview){
    assert.equal((await app.request(base+'/imports/'+first.id+'/inspect',{})).status,409);
    assert.equal((await app.request(base+'/imports/'+first.id+'/cancel',{})).status,409);
   }
  }
  if(checkReview){
   await page.locator('[data-data-section=history]').click();
   await page.locator('[data-import]').first().click();
   await page.getByRole('button',{name:'Review well group'}).click();
   const binding=page.locator('select[name="binding:QA-99"]');
   const well=(await page.locator('select[name=well] option').allTextContents()).findIndex(text=>text.includes('QA-02'));
   assert.ok(well>0);
   const target=await page.locator('select[name=well] option').nth(well).getAttribute('value');
   await binding.selectOption(target);
   await page.locator('#native-mapping button[type=submit], #native-mapping button.primary').click();
   await page.locator('#history-import-ready').click({timeout:60000});
   await page.locator('#quick-import-authority').check();
   await page.locator('#quick-import-form button[type=submit]').click();
   await page.locator('#wi-done').waitFor();
   const after=await imports(),original=after.imports.find(r=>r.id===first.id);
   assert.equal(original.automaticResult.pending,1);
   assert.equal(original.automaticResult.accepted,4);
   assert.equal(after.datasets.filter(d=>d.family==='deviation'&&d.active).length,2);
   assert.equal(after.imports.filter(r=>r.options.parentImportId===first.id).length,1);
  }
  assert.deepEqual(app.errors,[]);
  return {kind,mode,rate,zipBytes:fs.statSync(bundle).size,storedBytes:first.assets[0].size,
   elapsedMs:Math.round(elapsed),...metrics,verifiedRetainedReview:checkReview};
 }finally{await app.close();}
}

(async()=>{
 const benchmark=process.argv.includes('--benchmark'),rows=[];
 if(benchmark){
  for(const kind of ['small','mixed','large'])for(const rate of [32*1024**2,4*1024**2]){
   for(const mode of ['guided','automatic']){
    const row=await run(kind,mode,rate);
    rows.push(row);console.log(JSON.stringify(row));
   }
  }
 }else{
  const row=await run('mixed','automatic',0,{checkReview:true});
  rows.push(row);console.log(JSON.stringify(row));
 }
 fs.writeFileSync(evidence+'/'+(benchmark?'benchmark':'browser')+'.json',JSON.stringify(rows,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
