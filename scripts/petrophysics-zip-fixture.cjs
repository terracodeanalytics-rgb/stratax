const assert = require('node:assert/strict');
const path = require('node:path');
const {spawnSync} = require('node:child_process');

exports.importStudy = async function importStudy(app,page,evidence) {
 const archive=path.resolve(evidence,'petrophysics-study.zip');
 const python=process.env.STRATAX_FIXTURE_PYTHON||path.resolve('.venv/Scripts/python.exe');
 const created=spawnSync(python,['-',archive],{encoding:'utf8',input:[
  'import sys,zipfile',
  'with zipfile.ZipFile(sys.argv[1],"w") as z:',
  ' for well,unit,factor,density in (("ZIP-A","FT",0.3048,2.32),("ZIP-B","M",1,2.2375)):',
  String.raw`  header=f"~Version\nVERS. 2.0 :LAS\nWRAP. NO :Wrap\n~Well\nWELL. {well} :Well\nUWI. {well} :UWI\nSTRT.{unit} 0 :Start\nSTOP.{unit} {12/factor:.16g} :Stop\nSTEP.{unit} {1/factor:.16g} :Step\nNULL. -999.25 :Null\n~Curve\nDEPT.{unit} :Depth\nGR.GAPI :Gamma\nRHOB.G/CC :Density\nRT.OHMM :Resistivity\nSWI.V/V :Irreducible saturation\n~ASCII\n"`,
  String.raw`  z.writestr(well+".las",header+"\n".join(f"{i/factor} {20+i} {density} 10 0.2" for i in range(13))+"\n")`,
  String.raw` z.writestr("stations.csv","Well,MD (m),Inclination (deg),AZIMGN (deg)\nZIP-A,0,0,0\nUnresolved,0,0,0\nZIP-A,10,5,20\nUnresolved,10,5,21\n")`
 ].join('\n')});
 assert.equal(created.status,0,created.stderr);
 await page.evaluate(()=>{location.hash='data';});
 await page.locator('#automatic-zip-file').setInputFiles(archive);
 await page.locator('#zip-view-wells').click({timeout:90000});
 const url='/api/projects/project/imports';
 const {value:initial}=await app.request(url);
 const original=initial.imports[0];
 const wells=Object.fromEntries(original.datasets.filter(d=>d.active&&d.family==='logs').map(d=>[d.name.replace(/^ZIP-/i,'').replace(/\.las$/i,''),d]));
 assert.deepEqual(Object.keys(wells).sort(),['A','B'],JSON.stringify(original.issues));
 await page.locator('[data-data-section=history]').click();
 await page.locator('[data-import]').first().click();
 await page.getByRole('button',{name:'Review well group'}).click();
 await page.locator('select[name="binding:Unresolved"]').selectOption(wells.B.well);
 await page.locator('#native-mapping button[type=submit], #native-mapping button.primary').click();
 await page.locator('#history-import-ready').click({timeout:60000});
 await page.locator('#quick-import-authority').check();
 await page.locator('#quick-import-form button[type=submit]').click();
 await page.locator('#wi-done').click();
 const {value:after}=await app.request(url);
 assert.equal(after.datasets.filter(d=>d.active&&d.family==='deviation').length,2);

 await page.locator('[data-data-section=wells]').click();
 await page.locator(`[data-well-open-map="${wells.A.well}"]`).click();
 await page.locator('.mw-inspector-actions [data-map-command=interpretation]').click();
 await page.locator('.wb-active-well').waitFor();
 const guide=page.locator('.pp-study-workflow');
 if(await guide.getAttribute('open')===null)await guide.locator('summary').click();
 await guide.locator('[data-study-stage=qualitative]').click();
 await guide.locator('[data-pp-action=crossplot]').click();
 await page.locator('#wb-dialog-form button[type=submit]').click();
 const point=page.locator('#wb-crossplot-svg [data-wb-sample-row]').first();
 const sample=Number(await point.getAttribute('data-wb-sample-row'));
 await point.click();
 await page.locator('[data-wb-action=record-crossplot]').click();
 await page.locator('#wb-dialog-form [name=label]').fill('Imported well crossplot pick');
 await page.locator('#wb-dialog-form [name=evidence]').fill('Linked to a retained LAS sample.');
 await page.locator('#wb-dialog-form button[type=submit]').click();
 await page.locator('#dialog[open]').waitFor({state:'hidden'});
 const annotation=await page.evaluate(()=>{
  const portfolio=JSON.parse(localStorage.getItem('stratax.projects.v2:owner'));
  return portfolio.contexts[portfolio.activeId].interpretation.annotations.find(a=>a.label==='Imported well crossplot pick');
 });
 assert.equal(annotation.datasetId,wells.A.id);
 assert.deepEqual(annotation.geometry.rowRanges,[[sample,sample]]);

 const definition=structuredClone(app.data.workflow);
 for(const step of definition.steps){
  const dataset=wells[step.wellId];
  const replace=source=>{
   const mnemonic=['DEPT','GR','RHOB','RT','SWI'][Number(source.columnId.split('-').at(-1))];
   const column=dataset.columns.find(c=>c.mnemonic.toUpperCase()===mnemonic);
   assert.ok(column,`Missing imported ${mnemonic} in ${dataset.name}`);
   Object.assign(source,{datasetId:dataset.id,columnId:column.id});
  };
  if(step.scope.datasetId)replace(step.scope);
  for(const binding of Object.values(step.bindings))if(binding.datasetId)replace(binding);
  step.wellId=dataset.well;
 }
 for(const zone of definition.zones)zone.wellId=wells[zone.wellId].well;
 definition.wellParameters=Object.fromEntries(Object.entries(definition.wellParameters).map(([name,parameters])=>[wells[name].well,parameters]));
 return {definition,wells};
};
