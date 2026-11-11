const assert=require('node:assert/strict');
const fs=require('node:fs');
const {start}=require('./local-science-browser.cjs');

(async()=>{
 fs.mkdirSync('.release/map-persistence-20261109',{recursive:true});
 const app=await start({nativeImports:true,env:{CLOUD_COPY_FIXTURE:'1',MAP_ONLY_FIXTURE:'1'}});
 let page;
 try{
  const base='/api/projects/project',before=(await app.request(base)).value;
  const well={id:'crs-well',name:'CRS fixture',sourceCoordinates:{x:481200,y:69280,crs:'EPSG:26391',
   crsEvidence:{sourceName:'Survey metadata fixture'},geographicCoordinates:{lat:4.624668,lng:6.793340}}};
  const setup=await app.request(base,{revision:before.revision,project:{...before.project,status:'Active',workflows:['petrophysics']},
   workspace:{...before.workspace,wellDrafts:[well,{id:'offset-well',name:'Offset fixture'}],
    mapWorkspace:{locations:{'offset-well':{lat:4.63,lng:6.756529,confirmed:true,crs:'EPSG:4326'}}}}},'PUT');
  assert.equal(setup.status,200,JSON.stringify(setup.value));
  Object.assign(app.data.project,setup.value.project,{revision:setup.value.revision});
  ({page}=await app.createPage());
  await page.evaluate(()=>{location.hash='map';});
  await page.getByRole('button',{name:'CRS fixture Documented CRS · location review'}).click();
  await page.locator('.mw-inspector-actions [data-map-command=location]').click();
  const form=page.locator('#mw-bulk-locations');
  assert.equal(await form.locator('[name=crs]').inputValue(),'EPSG:26391');
  assert.match(await form.innerText(),/Survey metadata fixture/);
  await form.locator('[name=crs]').fill('EPSG:32632');
  await form.locator('[name=confirmed]').check();
  await form.locator('[type=submit]').click();
  await page.getByText(/Retained evidence identifies EPSG:26391/).waitFor();
  assert.equal(await page.locator('[data-map-point="crs-well"]').count(),0);
  await form.locator('[name=crs]').fill('EPSG:26391');
  await form.locator('[type=submit]').click();
  await page.getByText(/retained geographic coordinates by more than 1 km/).waitFor();
  await form.locator('[name=conflict]').check();
  await form.locator('[type=submit]').click();
  await page.getByText('Converted WGS84 positions').waitFor();
  assert.match(await page.locator('#mw-location-preview').innerText(),/4\.623748, 6\.756529/);
  await form.locator('[type=submit]').click();
  await page.locator('[data-map-point="crs-well"]').waitFor();
  const saved=(await app.request(base)).value.workspace.mapWorkspace.locations['crs-well'];
  assert.equal(saved.sourceCRS,'EPSG:26391');
  assert.ok(saved.reviewedCoordinateConflicts.length);
  const current=(await app.request(base)).value;
  const remote={...saved,lat:4.62,confirmedAt:new Date(Date.parse(saved.confirmedAt)+1000).toISOString()};
  current.workspace.mapWorkspace.locations['crs-well']=remote;
  const updated=await app.request(base,{revision:current.revision,project:current.project,workspace:current.workspace},'PUT');
  assert.equal(updated.status,200,JSON.stringify(updated.value));
  await page.locator('[data-map-command=refresh]').click();
  await page.getByText('4.620000, 6.756529').waitFor();
  assert.equal((await app.request(base)).value.workspace.mapWorkspace.locations['crs-well'].lat,4.62);
  await page.locator('.mw-inspector [data-map-well-menu="crs-well"]').click();
  await page.getByRole('menuitem',{name:'Measure from here'}).click();
  await page.locator('[data-map-point="offset-well"]').hover();
  assert.match(await page.locator('#mw-measure-status').innerText(),/1112\.0 m \(preview\)/);
  await page.locator('[data-map-point="offset-well"]').click();
  assert.match(await page.locator('#mw-measure-status').innerText(),/1112\.0 m$/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#mw-measure-status').count(),0);
  assert.deepEqual(app.errors,[]);
  const result={passed:6,newerRemotePinDisplayed:true,documentedCrsPrefilled:true,wrongCrsBlocked:true,geographicConflictReviewed:true,confirmedLocationSaved:true,measurementPreviewAndCancel:true};
  fs.writeFileSync('.release/map-persistence-20261109/browser.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
 }catch(error){
  if(page)fs.writeFileSync('.release/map-persistence-20261109/browser-diagnostic.json',JSON.stringify({errors:app.errors,body:(await page.locator('body').innerText()).slice(-9500)},null,2));
  throw error;
 }finally{await app.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
