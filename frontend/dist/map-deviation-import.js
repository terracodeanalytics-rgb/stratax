import {session} from './auth.js';
import {browserRead,commitLocal,commitNative,importLocal,loadCloud,nativeImport,readyImportDatasets} from './ingestion-client.js';
import {applyImportedEvidence,sourceHints,suggest} from './well-data.js';
import {rememberImport} from './import-drafts.js';
import {intakeFamilyAllowed,labels} from './ingestion-catalog.js';
import {importSample} from './import-samples.js';

const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types={
 angles:['MD / inclination / azimuth',['md','inclination','azimuth']],
 offsets:['Offsets / TVD',['dx','dy','tvd']],
 xy_tvd:['X / Y / TVD',['x','y','tvd']],
 coordinates:['X / Y / Z',['x','y','z']]
};
const choice=(name,label,values)=>`<label class="field">${label}<select name="${name}"><option value="">Unspecified</option>${values.map(v=>`<option>${v}</option>`).join('')}</select></label>`;

export function openMapDeviation(host,{wells,initialWell,locked=false,onImported}){
 const project=host.getProject(),uid=session.user?.uid;
 if(!intakeFamilyAllowed('deviation',project)){host.toast('Enable petrophysics for this project before importing a deviation survey.');return;}
 const validScope=()=>session.user?.uid===uid&&host.getProject()?.id===project.id;
 let well=wells.find(w=>w.id===initialWell)||null,file,preview,suggestions,record,retainedId,busy=false,scan=0;
 const controller=new AbortController();
 const scoped=()=>validScope()&&form.isConnected;
 host.modal('Add deviation data',`<form id="mw-survey-import" class="mw-survey-import ${locked?'mw-survey-locked':''}">
  ${locked?'':`<aside class="mw-survey-wells"><label class="field">Find a well<input id="mw-deviation-search" type="search" placeholder="Search project wells"></label><div class="mw-deviation-wells">${wells.map(w=>`<button type="button" data-mw-deviation-well="${esc(w.id)}"><strong>${esc(w.name)}</strong><small>${esc(w.status)}</small></button>`).join('')}</div><p id="mw-well-search-empty" class="sub" hidden>No matching wells.</p></aside>`}
  <div class="mw-survey-main">
   <div class="mw-survey-destination"><span class="mw-survey-symbol">${host.icon('map')}</span><div><small>Destination well</small><strong id="mw-survey-destination"></strong></div></div>
   <label class="mw-survey-file"><strong id="mw-survey-file-name">Choose a survey file</strong><span>CSV, Excel, ASCII, DEV or survey export</span><input type="file" name="file" accept=".csv,.tsv,.txt,.asc,.dev,.deviation,.survey,.xls,.xlsx" aria-label="Survey file"></label>
   <details id="mw-survey-mapping" hidden><summary>Columns and references <small id="mw-survey-count"></small></summary>
    <label class="field">Survey representation<select name="surveyMethod">${Object.entries(types).map(([id,[label]])=>`<option value="${id}">${label}</option>`).join('')}</select></label>
    <div id="mw-survey-columns" class="mw-survey-fields"></div>
    <div class="mw-survey-fields">
     ${choice('depthUnit','Depth unit',['m','ft'])}
     <label class="field">Vertical datum<input name="verticalDatum" placeholder="e.g. KB"></label>
     <label class="field">Horizontal CRS<input name="crs" placeholder="e.g. EPSG:32632"></label>
     ${choice('angleUnit','Angle unit',['degrees','radians'])}
     ${choice('northReference','Azimuth reference',['Grid north','True north','Magnetic north'])}
     ${choice('offsetUnit','Horizontal offset unit',['m','ft'])}
     ${choice('depthReference','Depth reference',['MD','TVD','TVDSS'])}
     ${choice('verticalMeaning','Z convention',['Depth positive down','Elevation positive up'])}
     <label class="field">Grid north correction (degrees)<input name="northCorrection" type="number" step="any"></label>
     <label class="field">Magnetic declination (degrees)<input name="declination" type="number" step="any"></label>
    </div>
   </details>
   <section id="mw-survey-import-notes" class="mw-survey-notes" hidden></section>
   <p id="mw-survey-import-status" role="status"></p><p id="mw-survey-import-error" role="alert"></p>
   <div class="actions"><button type="button" id="mw-deviation-cancel">Cancel</button><button type="button" id="mw-deviation-sample">Download sample format</button><button type="submit" class="primary" id="mw-survey-import-submit" disabled>Import survey</button></div>
  </div></form>`);
 const dialog=$('#dialog'),form=$('#mw-survey-import'),submit=$('#mw-survey-import-submit');
 $('#mw-deviation-sample').onclick=()=>{
  const sample=importSample('deviation',form.elements.surveyMethod.value);
  host.download(sample.name,new Blob([sample.text],{type:sample.type}));
 };
 const status=$('#mw-survey-import-status'),error=$('#mw-survey-import-error'),notes=$('#mw-survey-import-notes');
 const eligible=()=>record?.datasets?.length===1?readyImportDatasets(record).filter(d=>d.family==='deviation'&&d.well===well?.sourceId):[];
 const renderState=()=>{
  $('#mw-survey-destination').textContent=well?.name||'Select a well';
  form.querySelectorAll('[data-mw-deviation-well]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mwDeviationWell===well?.id)));
  submit.disabled=busy||!well||!preview||!!record&&!eligible().length;
  submit.textContent=record?'Confirm import':'Import survey';
 };
 const setBusy=value=>{
  busy=value;
  form.setAttribute('aria-busy',String(value));
  form.querySelectorAll('input,select,button').forEach(control=>control.disabled=value||control.closest('label')?.hidden||!!record&&control.id!=='mw-survey-import-submit'&&control.id!=='mw-deviation-cancel'&&control.id!=='mw-survey-edit'&&control.name!=='acknowledge');
  dialog.querySelector('[data-close]').disabled=value;
  renderState();
 };
 const close=()=>{if(!busy)dialog.close();};
 $('#mw-deviation-cancel').onclick=close;
 dialog.oncancel=event=>{if(busy)event.preventDefault();};
 dialog.addEventListener('close',()=>controller.abort(),{once:true});
 const useWell=id=>{well=wells.find(w=>w.id===id);renderState();};
 form.querySelectorAll('[data-mw-deviation-well]').forEach(button=>button.onclick=()=>useWell(button.dataset.mwDeviationWell));
 $('#mw-deviation-search')?.addEventListener('input',e=>{
  const query=e.target.value.trim().toLowerCase(),buttons=[...form.querySelectorAll('[data-mw-deviation-well]')];
  for(const button of buttons)button.hidden=!wells.find(w=>w.id===button.dataset.mwDeviationWell).name.toLowerCase().includes(query);
  $('#mw-well-search-empty').hidden=buttons.some(button=>!button.hidden);
 });
 const method=form.elements.surveyMethod;
 const referenceNames=['depthUnit','verticalDatum','crs','angleUnit','northReference','offsetUnit','depthReference','verticalMeaning','northCorrection','declination'];
 const renderColumns=()=>{
  const mode=method.value,roles=types[mode][1];
  $('#mw-survey-columns').innerHTML=roles.map(role=>`<label class="field">${labels[role]||({dx:'Easting offset',dy:'Northing offset',tvd:'True vertical depth'})[role]}<select name="map:${role}" required><option value="">Select column</option>${preview.columns.map((c,index)=>`<option value="${index}" ${String(suggestions.mapping[role])===String(index)?'selected':''}>${esc(c.mnemonic)}${c.unit?' · '+esc(c.unit):''}</option>`).join('')}</select></label>`).join('');
  for(const name of referenceNames){
   const hide=(['angleUnit','northReference','northCorrection','declination'].includes(name)&&mode!=='angles')||name==='offsetUnit'&&mode!=='offsets'||['depthReference','verticalMeaning'].includes(name)&&mode!=='coordinates';
   form.elements[name].closest('label').hidden=hide;
   form.elements[name].disabled=hide;
  }
 };
 method.onchange=renderColumns;
 const inspectFile=async next=>{
  const version=++scan;file=next;preview=null;retainedId=null;error.textContent='';status.textContent='';$('#mw-survey-mapping').hidden=true;
  $('#mw-survey-file-name').textContent=file?.name||'Choose a survey file';renderState();
  if(!file)return;
  status.textContent='Reading columns…';
  try{
   const hints=sourceHints(await file.slice(0,16384).text());
   const parsed=await browserRead(file,'deviation',{references:hints},{signal:controller.signal});
   if(!scoped()||version!==scan)return;
   if(parsed.datasets.length!==1)throw new Error('Choose a file containing one survey. Export an individual worksheet if needed.');
   preview=parsed.datasets[0];
   suggestions=suggest(preview,'deviation',{references:hints});
   method.value=suggestions.surveyMethod;
   for(const name of referenceNames)form.elements[name].value=suggestions.references[name]??'';
   renderColumns();
   $('#mw-survey-count').textContent=preview.rowCount.toLocaleString()+' stations';
   $('#mw-survey-mapping').hidden=false;$('#mw-survey-mapping').open=true;
  }catch(cause){if(scoped()&&version===scan)error.textContent=cause.message;}
  finally{if(scoped()&&version===scan){status.textContent='';renderState();}}
 };
 form.elements.file.onchange=()=>inspectFile(form.elements.file.files[0]);
 const save=async()=>{
  if(!validScope())throw new Error('The project changed. Reopen the survey import in its original project.');
  host.save();await host.flush();
 };
 const commit=async ready=>{
  const selection={selected_dataset_ids:ready.map(d=>d.id)};
  if(project.storage==='cloud'){
   Object.assign(record,await host.importTask(()=>commitNative(project,record,true,null,null,selection)));
   if(!scoped())return;
   const evidence=await loadCloud(project);
   if(!scoped())return;
   applyImportedEvidence(host.getState(),evidence);
  }else await commitLocal(host.getState(),record,{selection,onSave:save});
  if(!scoped())return;
  dialog.close();onImported(well.id,ready.map(d=>d.id));host.toast('Deviation survey imported.');
 };
 form.onsubmit=async event=>{
  event.preventDefault();
  if(busy||!well||!preview||!validScope())return;
  const fields=new FormData(form),mode=method.value,acknowledged=fields.has('acknowledge');
  error.textContent='';setBusy(true);
  try{
   if(!record){
    const mapping=Object.fromEntries(types[mode][1].map(role=>[role,fields.get('map:'+role)]));
    if(Object.values(mapping).some(v=>v===null||v==='')||new Set(Object.values(mapping)).size!==Object.keys(mapping).length)throw new Error('Choose a different source column for each survey field.');
    const references=Object.fromEntries(referenceNames.map(name=>[name,fields.get(name)]).filter(([,value])=>value!==null&&value!==''));
    if(mode==='angles')references.depthReference='MD';
    if(mode==='xy_tvd'||mode==='offsets')references.depthReference='TVD';
    const asset={id:crypto.randomUUID(),file,family:'deviation',...(retainedId?{existingId:retainedId}:{})};
    const options={perAsset:{[asset.id]:{mapping,references,surveyMethod:mode,well:well.sourceId,wellName:well.name,expectedWell:{id:well.sourceId,name:well.sourceName||well.name,uwi:well.uwi,aliases:well.aliases||[]}}}};
    const progress=message=>{if(scoped())status.textContent=message;};
    status.textContent='Inspecting survey…';
    record=project.storage==='cloud'?await host.importTask(()=>nativeImport(project,[asset],'deviation',options,{signal:controller.signal,onProgress:progress})):await importLocal(project,host.getState(),[asset],'deviation',options,{signal:controller.signal,onProgress:progress,onSave:save});
    if(!scoped())return;
    rememberImport(host.getState(),record);
   }
   const ready=eligible();
   if(record.datasets?.length>1)throw new Error('This file contains multiple surveys. Export a single survey worksheet to import it here.');
   if(!ready.length)throw new Error('The retained survey needs review before it can be activated. See the inspection notes below.');
   if((record.issues||[]).length&&!acknowledged){status.textContent='Review the inspection notes before confirming.';return;}
   status.textContent='Adding survey to the well…';
   await commit(ready);
  }catch(cause){if(scoped()){status.textContent='';error.textContent=cause.message;}}
  finally{
   if(scoped()){
    if(record){
     const issues=record.issues||[];
     notes.hidden=!issues.length&&!error.textContent&&!record.assets?.some(asset=>asset.state==='stored');
     notes.innerHTML=`${issues.length?`<strong>Inspection notes</strong><ul>${issues.map(issue=>`<li>${esc(issue.message)}</li>`).join('')}</ul>`:''}${issues.length&&eligible().length?'<label class="mw-layer"><input type="checkbox" name="acknowledge" required> I reviewed these notes</label>':''}${!eligible().length&&record.assets?.some(asset=>asset.state==='stored')?'<button type="button" id="mw-survey-edit">Edit columns and references</button>':''}`;
     notes.querySelector('#mw-survey-edit')?.addEventListener('click',()=>{retainedId=record.assets.find(asset=>asset.state==='stored').id;record=null;notes.hidden=true;error.textContent='';status.textContent='';setBusy(false);renderColumns();});
    }
    setBusy(false);
   }
  }
 };
 renderState();
}
