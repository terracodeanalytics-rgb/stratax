const assert=require('node:assert/strict');
const fs=require('node:fs');
const {start}=require('./local-science-browser.cjs');

(async()=>{
 const app=await start({nativeImports:true,env:{CLOUD_COPY_FIXTURE:'1'}});
 try{
  const {page}=await app.createPage();
  const transfer=await page.evaluate(async()=>{
   const {resumableUpload}=await import('/ingestion-client.js');
   const MiB=1024**2,size=169*MiB,requests=[];
   let offset=0,fail=false;
   const saved={XHR:window.XMLHttpRequest,fetch:window.fetch};
   window.XMLHttpRequest=class{
    constructor(){this.upload={};}
    open(){}
    setRequestHeader(){}
    getResponseHeader(){return 'bytes=0-'+(offset-1);}
    send(part){
     requests.push(part);
     queueMicrotask(()=>{
      if(fail){fail=false;offset=part.start+8*MiB;this.status=503;this.onload();return;}
      if(part.start!==offset)throw new Error('Wrong resume offset');
      offset=part.end;this.status=offset===size?200:308;this.onload();
     });
    }
   };
   window.fetch=async()=>({ok:false,status:308,headers:{get:()=> 'bytes=0-'+(offset-1)}});
   const file={name:'bundle.zip',size,slice:(start,end)=>({start,end})};
   try{
    await resumableUpload(file,'/test',{fresh:true});
    const fresh=requests.length;
    offset=0;requests.length=0;fail=true;
    await resumableUpload(file,'/test',{fresh:true});
    return {fresh,recoveredFrom:requests[1].start/MiB,recoveryChunk:(requests[1].end-requests[1].start)/MiB,completed:offset===size};
   }finally{window.XMLHttpRequest=saved.XHR;window.fetch=saved.fetch;}
  });
  assert.deepEqual(transfer,{fresh:6,recoveredFrom:8,recoveryChunk:8,completed:true});
  await page.locator('[data-pp-action=import]:visible').click();
  await page.locator('#wi-files').setInputFiles('.release/import-repair-20261108/generated.zip');
  await page.locator('#wi-continue').click();
  await page.waitForFunction(()=>document.querySelector('[aria-current=step]')?.innerText.startsWith('2. Review'),null,{timeout:60000});
  assert.ok(app.requests.filter(r=>r.path.includes('/preview/')).length<=1);
  const pending=page.locator('[data-asset]').filter({hasText:'pending.txt'});
  if(!await pending.isVisible())await pending.locator('xpath=ancestor::details[1]/summary').click();
  await pending.click();
  await page.locator('[data-wi-fix=mapping_depth]').click();
  await page.locator('#native-mapping').waitFor();
  assert.equal(await page.evaluate(()=>document.activeElement.name),'mapping:depth');
  await page.locator('#native-back-to-review').click();
  assert.match(await page.locator('[aria-current=step]').innerText(),/2\. Review/);
  await page.locator('[data-wi-fix=mapping_depth]').click();
  await page.locator('[name="mapping:depth"]').selectOption('0');
  await page.locator('[name="mapping:time"]').selectOption('1');
  await page.locator('[name=well]').selectOption(await page.locator('[name=well] option').filter({hasText:'QA Well'}).first().getAttribute('value'));
  await page.locator('[name="ref:depthReference"]').fill('MD');
  await page.locator('[name="ref:depthUnit"]').fill('m');
  await page.locator('[name="ref:timeConvention"]').fill('Two-way time');
  await page.locator('[name="ref:timeUnit"]').fill('ms');
  await page.locator('#native-mapping button.primary').click();
  await page.locator('#well-import-form').waitFor({timeout:60000});
  assert.match(await page.locator('[aria-current=step]').innerText(),/2\. Review/);
  assert.equal(await page.locator('[data-wi-fix=mapping_depth]').count(),0);
  assert.equal(await page.locator('[data-wi-fix=mapping_time]').count(),0);
  assert.match(await page.locator('.ie-content').innerText(),/Proposed well: QA Well/);
  await page.locator('#wi-leave-pending').check();
  for(const stage of ['3. Match','4. Mapping','5. Import']){
   await page.locator('#wi-continue').click();
   assert.equal((await page.locator('[aria-current=step]').innerText()).split('\n')[0].trim(),stage,await page.locator('.setup-error').allTextContents());
  }
  await page.locator('#wi-authority').check();
  await page.locator('#wi-continue').click();
  await page.locator('#wi-review-result').click();
  await page.locator('#commit-import').waitFor();
  assert.equal(await page.locator('[data-select-dataset]').count(),4);
  assert.equal(await page.locator('[data-select-dataset]:checked').count(),3);
  assert.equal(app.requests.filter(r=>r.method==='POST'&&r.path.includes('/upload/')).length,1);
  assert.deepEqual(app.errors,[]);
  fs.writeFileSync('.release/import-speed-20261109/browser.json',JSON.stringify({passed:2,transfer,errors:app.errors},null,2));
  console.log(JSON.stringify({passed:2,transfer}));
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
