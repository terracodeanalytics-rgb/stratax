import {applyImportedEvidence} from './well-data.js';
import {retainedRows} from './well-derived.js';
import './well-evidence.js';
import {WELL_ICON_URL} from './well-symbol.js';
import {api,session} from './auth.js';
import {loadCloud,browserRead} from './ingestion-client.js';
import {openImporter,reviewImport} from './data-page.js';
import * as repository from './project-repository.js';
import {mountWorkspaceMap} from './project-map.js';

let host,activeProject,selected='',search='',basemap='grid',inspector=true,labels=true,showWells=true,showDeviation=true,zoom=1,paths=[],pathIssues=[],loading=false,loadedAt=0,loadedSignature='',resizeObserver,mapGeneration=0,googleMap,focusWell='',contextAbort,pan=[0,0],measure=null,refreshQueued=false,gridSelection='',folderBlocked=false,automaticLocations={};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
const isWgs84=value=>/^(?:EPSG:)?4326$|^WGS\s?84$/i.test(String(value||'').trim());
const validPoint=p=>p&&typeof p.lat==='number'&&typeof p.lng==='number'&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=85&&Math.abs(p.lng)<=180;
export function configureMapWorkspace(value){host=value;}
export function focusMapWell(id){if(wells().includes(id)){selected=id;inspector=true;draw();}}
function settings(){return host.getState().mapWorkspace||{locations:{},symbols:{}};}
function datasets(){return (host.getState().ingestion?.datasets||[]).filter(d=>d.active!==false);}
const wellFamilies=new Set(['well_headers','logs','arrays','deviation','tops','checkshots','core','pressure','fluids','geochemistry','production']);
const wellKey=value=>String(value??'').trim().toLowerCase().replace(/[ _-]+/g,' ');
function wellInventory(data=datasets()){
 const wells=new Map((host.getState().wellDrafts||[]).filter(w=>w.id).map(w=>[w.id,w]));
 for(const d of data){
  if(!wellFamilies.has(d.family))continue;
  for(const record of d.wellRecords||[]){
   if(!record.id)continue;
   const well=wells.get(record.id);
   if(!well)wells.set(record.id,record);
   else if(record.name&&(!well.name||well.name===well.id))wells.set(record.id,{...well,name:record.name});
  }
  if(d.well){
   const well=wells.get(d.well),name=d.metadata?.headers?.WELL?.value;
   if(!well)wells.set(d.well,{id:d.well,name:name||d.well});
   else if(name&&(!well.name||well.name===well.id))wells.set(d.well,{...well,name});
  }
 }
 return wells;
}
function coordinateEvidence(record,dataset){
 const raw=record.sourceCoordinates||{};
 const crs=raw.crs||dataset.references?.crs||record.location?.sourceCRS||sourceEpsg(dataset.metadata?.headers?.EPSG?.value||dataset.metadata?.headers?.CRS?.value);
 const geographic=raw.geographicCoordinates||record.location;
 const parse=value=>typeof value==='string'&&!value.trim()?null:globalThis.StrataxWellEvidence.numeric(value);
 const point=isWgs84(crs)&&validPoint(geographic)?{x:geographic.lng,y:geographic.lat}:{x:parse(raw.x),y:parse(raw.y)};
 return {...raw,...point,crs,source:dataset.name,headerId:dataset.id};
}
function headerMatches(){
 const data=datasets(),inventory=wellInventory(data),records=[];
 for(const dataset of data.filter(d=>wellFamilies.has(d.family))){
  for(const record of dataset.wellRecords||[])records.push({record,dataset});
  if(dataset.family!=='logs'||!dataset.well||dataset.wellRecords?.some(r=>r.id===dataset.well&&Number.isFinite(r.sourceCoordinates?.x)&&Number.isFinite(r.sourceCoordinates?.y)))continue;
  const {name,uwi,x,y,latitude,longitude}=globalThis.StrataxWellEvidence.headerIdentity(dataset);
  const well=inventory.get(dataset.well),nameMatches=[well?.name,...(well?.aliases||[])].some(alias=>wellKey(alias)===wellKey(name));
  const matchingUwi=well?.uwi&&uwi&&wellKey(well.uwi)===wellKey(uwi);
  if(well?.uwi&&uwi&&!matchingUwi||name&&well?.name!==dataset.well&&!nameMatches&&!matchingUwi)continue;
  records.push({dataset,record:{id:dataset.well,name,uwi,sourceCoordinates:{x,y,geographicCoordinates:{lat:latitude,lng:longitude}}}});
 }
 const byId=new Map(),byUwi=new Map(),byName=new Map();
 const add=(index,key,entry)=>{if(key){if(!index.has(key))index.set(key,[]);index.get(key).push(entry);}};
 for(const entry of records){
  add(byId,entry.record.id,entry);
  if(entry.dataset.family==='well_headers'){
   add(byUwi,wellKey(entry.record.uwi),entry);
   add(byName,wellKey(entry.record.name),entry);
  }
 }
 const matches=new Map(),signature=p=>JSON.stringify([p.x,p.y,sourceEpsg(p.crs)||wellKey(p.crs)]);
 for(const [id,well] of inventory){
  const owner=well.sourceWellId||id,registered=inventory.get(owner)||well,exact=byId.get(owner)||[];
  const uwi=wellKey(registered.uwi);
  const byIdentifier=uwi?byUwi.get(uwi)||[]:[];
  const names=[registered.name||owner,...(registered.aliases||[])].map(wellKey);
  const named=[...new Set(names.flatMap(name=>byName.get(name)||[]))].filter(entry=>!uwi||!entry.record.uwi||wellKey(entry.record.uwi)===uwi);
  const related=exact.filter(entry=>entry.dataset.family==='well_headers');
  const alternative=byIdentifier.length?byIdentifier:named;
  const headers=related.length?related:alternative;
  const ambiguous=!related.length&&new Set(alternative.map(e=>e.record.id)).size>1;
  const fallback=exact.filter(entry=>entry.dataset.family!=='well_headers');
  const provenance=data.find(d=>registered.evidence?.includes(d.id)||registered.source&&registered.source===d.importId);
  if(provenance&&registered.sourceCoordinates)fallback.push({record:registered,dataset:provenance});
  if(ambiguous&&!fallback.some(e=>finitePair(coordinateEvidence(e.record,e.dataset)))){matches.set(id,{ambiguous:true});continue;}
  for(const group of [ambiguous?[]:headers,fallback]){
   const candidates=group.map(entry=>({...entry,point:coordinateEvidence(entry.record,entry.dataset)}));
   const complete=candidates.filter(entry=>finitePair(entry.point));
   if(candidates.some(e=>e.point.coordinateConflict||e.point.conflictingCRS)||new Set(complete.map(e=>signature(e.point))).size>1){
    matches.set(id,{ambiguous:true});break;
   }
   if(complete.length){matches.set(id,complete[0]);break;}
  }
 }
 return matches;
}
function allWells(){return [...wellInventory().keys()];}
function wells(){return allWells().filter(id=>!settings().removedWells?.includes(id));}
function wellName(id){return settings().names?.[id]||wellInventory().get(id)?.name||id;}
const isScope=value=>session.user?.uid+':'+host.getProject()?.id===value;
function sourceWell(id){return host.getState().wellDrafts?.find(w=>w.id===id)?.sourceWellId||id;}
const surveysFor=(id,data=datasets())=>data.filter(d=>d.family==='deviation'&&(d.well===id||d.well===sourceWell(id)));
function pendingSurveys(id){
 const owner=sourceWell(id),records=host.getState().ingestion?.imports||[];
 const identity=d=>JSON.stringify([d.sourceId,d.metadata?.sheet||'',d.metadata?.well||'']);
 const accepted=new Set(datasets().filter(d=>d.sourceId&&d.family==='deviation'&&d.well===owner).map(identity));
 return records.flatMap(record=>['awaiting confirmation','retained/unresolved'].includes(record.status)
  ?(record.datasets||[]).filter(d=>!d.active&&d.family==='deviation'&&d.well===owner&&!accepted.has(identity(d))).map(d=>({id:d.id,importId:record.id}))
  :[]);
}
function displayedLocation(id,source){
 const saved=settings().locations?.[id],automatic=automaticLocations[id];
 return headerPoint(saved,source)?saved:headerPoint(automatic,source)?automatic:null;
}
function located(){const matches=headerMatches();return [...matches.keys()].filter(id=>!settings().removedWells?.includes(id)).flatMap(id=>{const p=displayedLocation(id,retainedLocation(id,matches));return p?[{id,name:wellName(id),...p}]:[];});}
function saveSetting(key,value){const state=host.getState();state.mapWorkspace||={locations:{},symbols:{}};state.mapWorkspace[key]=value;host.save();}
function closeWellMenu(restoreFocus=false){const node=$('#mw-well-context'),trigger=node?.returnTarget;contextAbort?.abort();contextAbort=null;node?.remove();if(restoreFocus&&trigger?.isConnected)trigger.focus();}
function endpointFor(id,basis,grid=fieldGrid()){
 if(basis==='surface')return grid.points.find(point=>point.id===id)?.xy;
 return grid.lines.find(line=>line.well===id)?.xy.at(-1);
}
function metricText(value,power,grid){
 if(grid.unit===null)return value.toLocaleString(undefined,{maximumFractionDigits:2})+' source '+(power===2?'units²':'units');
 const amount=value*grid.unit**power,threshold=1000**power;
 return amount>=threshold
  ?(amount/threshold).toLocaleString(undefined,{maximumFractionDigits:3})+(power===2?' km²':' km')
  :amount.toLocaleString(undefined,{maximumFractionDigits:2})+(power===2?' m²':' m');
}
function measureText(){
 if(!measure)return '';
 const grid=fieldGrid();
 if(measure.basis==='area'){
  if(measure.done)return 'Area · '+metricText(polygonArea(measure.vertices),2,grid);
  return 'Area · '+(measure.vertices.length<3?'Click at least three corners.':'Add corners or choose Finish area.');
 }
 if(measure.basis==='distance'){
  const [a,b]=measure.vertices;
  return b?'Distance · '+metricText(Math.hypot(b[0]-a[0],b[1]-a[1]),1,grid):'Distance · choose '+(a?'an end point.':'a start point.');
 }
 const label=measure.basis==='surface'?'Surface to surface':'Survey end to survey end';
 if(!measure.from)return label+' · choose the first well.';
 if(!measure.to)return label+' · choose a second well.';
 const a=endpointFor(measure.from,measure.basis,grid),b=endpointFor(measure.to,measure.basis,grid);
 return a&&b?label+' · '+wellName(measure.from)+' to '+wellName(measure.to)+' · '+metricText(Math.hypot(b[0]-a[0],b[1]-a[1]),1,grid):'Choose endpoints on this field grid.';
}
function polygonArea(vertices){
 const [x,y]=vertices[0];
 return Math.abs(vertices.reduce((sum,[ax,ay],i)=>{
  const [bx,by]=vertices[(i+1)%vertices.length];
  return sum+(ax-x)*(by-y)-(bx-x)*(ay-y);
 },0))/2;
}
function startMeasure(basis,from=null){
 basemap='grid';
 if(from&&!endpointFor(from,basis)){
  const grid=fieldGrids().find(value=>endpointFor(from,basis,value));
  if(grid){gridSelection=grid.id;pan=[0,0];zoom=1;focusWell='';}
 }
 measure={basis,from:from&&endpointFor(from,basis)?from:null,to:null,vertices:[],done:false,gridId:fieldGrid().id};
 draw();
 document.querySelector('[data-map-command="cancel-measure"]')?.focus();
}
function measurementValue(){
 if(!measure)return null;
 const grid=fieldGrid();
 if(measure.basis==='area')return measure.done?{value:polygonArea(measure.vertices),power:2,grid}:null;
 const [a,b]=measure.basis==='distance'?measure.vertices:[measure.from&&endpointFor(measure.from,measure.basis,grid),measure.to&&endpointFor(measure.to,measure.basis,grid)];
 return a&&b?{value:Math.hypot(b[0]-a[0],b[1]-a[1]),power:1,grid}:null;
}
function showMeasurementResult(){
 const result=measurementValue();if(!result)return;
 const {value,power,grid}=result;
 const units=power===1
  ?[['Kilometres','km',1000],['Metres','m',1],['Centimetres','cm',.01],['Millimetres','mm',.001],['Miles','mi',1609.344],['Nautical miles','nmi',1852],['Yards','yd',.9144],['Feet','ft',.3048],['Inches','in',.0254],['Fathoms','fathom',1.8288]]
  :[['Square kilometres','km²',1e6],['Hectares','ha',1e4],['Square metres','m²',1],['Ares','a',100],['Square miles','mi²',1609.344**2],['Acres','ac',4046.8564224],['Square yards','yd²',.9144**2],['Square feet','ft²',.3048**2],['Square inches','in²',.0254**2],['Square centimetres','cm²',.0001]];
 const format=amount=>amount.toLocaleString(undefined,{maximumSignificantDigits:8});
 const values=grid.unit===null?`<p><strong>${format(value)}</strong> source units${power===2?'²':''}</p><p class="sub">Standard conversions require known horizontal units for this source grid.</p>`
  :`<dl class="mw-measure-results">${units.map(([label,symbol,factor])=>`<dt>${label}</dt><dd>${format(value*grid.unit**power/factor)} ${symbol}</dd>`).join('')}</dl>`;
 host.modal(power===2?'Measurement · area':'Measurement · distance',values+'<div class="actions"><button id="mw-result-done">Done</button></div>');
 $('#mw-result-done').onclick=()=>$('#dialog').close();
}
function updateMeasurement(){
 const status=$('#mw-measure-status'),finish=$('[data-map-command="finish-area"]'),result=$('[data-map-command="measurement-result"]');
 if(result)result.hidden=!measurementValue();
 if(status)status.textContent=measureText();
 if(finish)finish.disabled=measure.vertices.length<3||measure.done;
}
function selectMapWell(id){
 if(!measure||['distance','area'].includes(measure.basis)){selected=id;inspector=true;draw();return;}
 if(!endpointFor(id,measure.basis)){host.toast('Choose a well with that endpoint on the current field grid.');return;}
 if(!measure.from||measure.to){measure.from=id;measure.to=null;}
 else if(measure.from!==id)measure.to=id;
 updateMeasurement();
 renderMap();
 if(measure.to)showMeasurementResult();
}
function wellMenu(event,id,trigger){
 event?.preventDefault();closeWellMenu();if(!wells().includes(id))return;selected=id;
 const node=document.createElement('div');node.id='mw-well-context';node.className='mw-well-context';node.setAttribute('role','menu');node.setAttribute('aria-label',wellName(id)+' actions');node.returnTarget=trigger;
 node.innerHTML=`<div>${esc(wellName(id))}</div>${[['interpretation','Open in Interpretation'],['measure-from','Measure from here'],['trajectory','Show trajectory'],['add-deviation','Add deviation data…'],['rename','Rename'],['duplicate','Duplicate'],['zoom','Zoom to well'],['delete','Delete']].map(([action,label])=>`<button role="menuitem" type="button" data-well-action="${action}">${label}</button>`).join('')}`;document.body.append(node);
 const rect=trigger?.getBoundingClientRect();node.style.left=Math.max(8,Math.min(event?.clientX||rect?.left||40,innerWidth-node.offsetWidth-8))+'px';node.style.top=Math.max(8,Math.min(event?.clientY||rect?.bottom||100,innerHeight-node.offsetHeight-8))+'px';
 const buttons=[...node.querySelectorAll('button')];buttons.forEach(b=>b.onclick=()=>{closeWellMenu();manageWell(b.dataset.wellAction,id);});buttons[0].focus();contextAbort=new AbortController();
 document.addEventListener('pointerdown',e=>{if(!node.contains(e.target))closeWellMenu();},{capture:true,signal:contextAbort.signal});
 node.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeWellMenu(true);}else if(e.key==='Tab')closeWellMenu(true);else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const index=buttons.indexOf(document.activeElement);buttons[e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus();}});
}
async function manageWell(action,id){
 const scope=activeProject,name=wellName(id);selected=id;
 if(action==='interpretation'){host.openWellWorkspace('interpretation',sourceWell(id));return;}
 if(action==='add-deviation'){await importDeviation(id).catch(error=>host.toast(error.message));return;}
 if(action==='measure-from'){startMeasure('surface',id);return;}
 if(action==='trajectory'){if(!paths.some(p=>p.well===id)){host.toast('Choose a valid active survey to display this trajectory.');return;}saveSetting('showDeviation',true);saveSetting('hiddenWells',(settings().hiddenWells||[]).filter(w=>w!==id));focusWell=id;inspector=true;draw();return;}
 if(action==='zoom'){const grid=fieldGrids().find(value=>value.points.some(p=>p.id===id));if(!grid){host.toast('Review this well’s location before zooming to it.');if(!loading)await refresh();return;}if(!located().some(p=>p.id===id))basemap='grid';gridSelection=grid.id;focusWell=id;pan=[0,0];zoom=5;inspector=true;draw();return;}
 if(action==='delete'){
  host.modal('Delete map well',`<h3>Remove ${esc(name)} from the map?</h3><p>This removes the map well and its displayed trajectories. Original files, datasets and well evidence stay in Data.</p><p class="sub">Restore it later from View → Removed wells.</p><div class="actions"><button id="mw-delete-cancel">Cancel</button><button id="mw-delete-confirm" class="danger">Delete from map</button></div>`);
  $('#mw-delete-cancel').onclick=()=>$('#dialog').close();$('#mw-delete-confirm').onclick=async()=>{if(!isScope(scope))return;try{saveSetting('removedWells',[...new Set([...(settings().removedWells||[]),id])]);await host.flush();$('#dialog').close();selected='';if(focusWell===id){focusWell='';zoom=1;}draw();}catch(error){host.toast(error.message);}};return;
 }
 host.modal(action==='rename'?'Rename well':'Duplicate well',`<h3>${esc(name)}</h3><form id="mw-well-name-form"><label class="field">${action==='rename'?'Display name':'New well name'}<input name="name" required maxlength="100" value="${esc(action==='rename'?name:(name+' copy').slice(0,100))}"></label><p class="sub">${action==='rename'?'The source well identifier and dataset associations remain unchanged.':'Creates an independent well registration with a copied map location/style and a reference to the source well. Original datasets are not duplicated.'}</p><p id="mw-name-error" role="alert"></p><button type="submit" class="primary">${action==='rename'?'Save name':'Duplicate well'}</button></form>`);
 $('#mw-well-name-form').onsubmit=async e=>{e.preventDefault();if(!isScope(scope))return;const form=e.currentTarget,newName=String(new FormData(form).get('name')||'').trim();if(!newName){$('#mw-name-error').textContent='Enter a well name.';return;}form.querySelector('button').disabled=true;try{
  if(action==='rename'){const registration=host.getState().wellDrafts?.find(w=>w.id===id);if(registration)registration.name=newName;saveSetting('names',{...settings().names,[id]:newName});}
  else{const newId=id.slice(0,78)+'-copy-'+crypto.randomUUID().slice(0,8);host.getState().wellDrafts||=[];host.getState().wellDrafts.push({id:newId,name:newName,sourceWellId:sourceWell(id),status:'User-created copy',createdAt:new Date().toISOString()});const current=settings();host.getState().mapWorkspace={...current,names:{...current.names,[newId]:newName},symbols:{...current.symbols,[newId]:current.symbols?.[id]||'Wellhead'},locations:{...current.locations,...(current.locations?.[id]?{[newId]:{...current.locations[id],copiedFrom:id}}:{})}};selected=newId;host.save();}
  await host.flush();$('#dialog').close();draw();
 }catch(error){$('#mw-name-error').textContent=error.message;form.querySelector('button').disabled=false;}};
}
function chooseDeviationWell(){
 const ids=allWells();
 if(!ids.length){host.toast('Import or register a well before adding its deviation survey.');return;}
 host.modal('Add deviation data',`<p class="sub">Choose the well that owns the survey.</p><label class="field">Find a well<input id="mw-deviation-search" type="search"></label><div class="mw-deviation-wells">${ids.map(id=>`<button type="button" data-mw-deviation-well="${esc(id)}"><strong>${esc(wellName(id))}</strong><small>${esc(locationReason(id))}</small><span>Add deviation</span></button>`).join('')}</div><div class="actions"><button type="button" id="mw-deviation-cancel">Cancel</button></div>`);
 $('#mw-deviation-cancel').onclick=()=>$('#dialog').close();
 const buttons=[...document.querySelectorAll('[data-mw-deviation-well]')];
 $('#mw-deviation-search').oninput=e=>{const query=wellKey(e.target.value);for(const button of buttons)button.hidden=!wellKey(wellName(button.dataset.mwDeviationWell)).includes(query);};
 for(const button of buttons)button.onclick=()=>importDeviation(button.dataset.mwDeviationWell).catch(error=>host.toast(error.message));
}
async function importDeviation(id){
 const scope=activeProject;
 await openImporter({family:'deviation',well:sourceWell(id),onCommitted:record=>{
  if(!isScope(scope))return;
  const accepted=(record.datasets||[]).filter(d=>d.active&&d.family==='deviation');
  if(!accepted.length)return;
  const state=host.getState(),well=state.wellDrafts?.find(w=>w.id===id);
  const matching=accepted.filter(d=>d.well===sourceWell(id)||d.well===id);
  if(well&&matching.length===1)well.activeSurveyId=matching[0].id;
  selected=id;inspector=true;
  state.mapWorkspace||={locations:{},symbols:{}};
  state.mapWorkspace.showDeviation=true;
  state.mapWorkspace.hiddenWells=(state.mapWorkspace.hiddenWells||[]).filter(w=>w!==id);
  host.save();
  if($('#mw-canvas'))void refresh();
 }});
}
function restoreWells(){
 const scope=activeProject,removed=(settings().removedWells||[]).filter(id=>allWells().includes(id));
 host.modal('Removed map wells',`<p class="sub">Original evidence was retained. Restore selected wells to the map.</p><form id="mw-restore-form">${removed.map(id=>`<label class="layer"><input type="checkbox" name="restore" value="${esc(id)}">${esc(wellName(id))}</label>`).join('')}<button class="primary" type="submit">Restore selected wells</button></form>`);
 $('#mw-restore-form').onsubmit=async e=>{e.preventDefault();if(!isScope(scope))return;const ids=new Set(new FormData(e.currentTarget).getAll('restore'));try{saveSetting('removedWells',(settings().removedWells||[]).filter(id=>!ids.has(id)));await host.flush();$('#dialog').close();draw();}catch(error){host.toast(error.message);}};
}
const finitePair=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
function retainedLocation(id,matches=headerMatches()){
 const match=matches.get(id);
 return match?.ambiguous?{coordinateConflict:true}:match?.point||null;
}
function headerPoint(point,source){
 if(!point?.confirmed||!validPoint(point)||!source||source.coordinateConflict||source.conflictingCRS)return false;
 const crs=sourceEpsg(source.crs);
 const samePair=finitePair(source)&&point.sourceCoordinates?.x===source.x&&point.sourceCoordinates?.y===source.y;
 return samePair&&(crs?sourceEpsg(point.sourceCRS)===crs:point.headerId===source.headerId&&!!sourceEpsg(point.sourceCRS));
}
const sourceEpsg=value=>{
 const match=/^(?:EPSG:\s*)?([0-9]{3,7})$/i.exec(String(value||'').trim());
 return isWgs84(value)?'EPSG:4326':match?'EPSG:'+match[1]:'';
};
function canUseSourcePair(crs,x,y){
 return crs!=='EPSG:4326'||validPoint({lng:x,lat:y});
}
async function placeReferencedWells(project,scope){
 const groups=new Map(),updates={},matches=headerMatches(),recovered=await headerLocations(scope,matches);
 if(!isScope(scope))return;
 for(const id of wells()){
  const retained=retainedLocation(id,matches),header=recovered.get(matches.get(id)?.record?.id);
  if(displayedLocation(id,retained))continue;
  const source=sourceEpsg(retained?.crs)?retained:header||retained;
  if(retained?.coordinateConflict||retained?.conflictingCRS)continue;
  if(!source||source.coordinateConflict||source.conflictingCRS)continue;
  const crs=sourceEpsg(source.crs);
  if(!crs||!canUseSourcePair(crs,source.x,source.y))continue;
  const points=groups.get(crs)||[];
  points.push({id,x:source.x,y:source.y});groups.set(crs,points);
 }
 const convert=async(crs,points)=>{
  try{
   const converted=project.storage==='cloud'
    ?(await api(`/api/projects/${project.id}/locations/preview`,{method:'POST',body:{crs,points}})).points
    :points.flatMap(p=>{
     const value=globalThis.StrataxWellEvidence.location(p.x,p.y,crs);
     return value?[{...value,id:p.id}]:[];
    });
   for(const p of converted)if(validPoint(p)&&!p.conflicts?.length){
    const original=points.find(v=>v.id===p.id);
    if(original)updates[p.id]={lat:p.lat,lng:p.lng,confirmed:true,crs:'EPSG:4326',sourceCRS:crs,
     sourceCoordinates:{x:original.x,y:original.y},source:'Retained wellhead coordinates',headerId:matches.get(p.id)?.dataset?.id};
   }
  }catch(error){
   if(points.length<2||!isScope(scope)||!['coordinate_source_conflict','invalid_transformed_location'].includes(error.code))return;
   const middle=Math.floor(points.length/2);
   await convert(crs,points.slice(0,middle));
   await convert(crs,points.slice(middle));
  }
 };
 for(const [crs,points]of groups)for(let start=0;start<points.length;start+=100){
  if(!isScope(scope))return;
  await convert(crs,points.slice(start,start+100));
 }
 if(!isScope(scope))return;
 const fresh=Object.entries(updates).filter(([id])=>!headerPoint(settings().locations?.[id],retainedLocation(id,matches)));
 if(!fresh.length)return;
 Object.assign(automaticLocations,Object.fromEntries(fresh));
}
function emptyWellList(){
 const state=host.getState(),unassigned=datasets().filter(d=>d.family!=='well_headers'&&wellFamilies.has(d.family)&&!d.well).length;
 const pending=(state.ingestion?.imports||[]).some(record=>!record.committedAt&&['awaiting confirmation','retained/unresolved','inspecting'].includes(record.status));
 const message=allWells().length?'All wells are removed from this map. Use View → Removed wells to restore them.'
  :unassigned?unassigned+' active well datasets need a well association.'
  :pending?'An import is still awaiting inspection or confirmation.'
  :state.files?.some(file=>!file.trashed)?'Source files are retained. Import well headers or associate active datasets with wells.'
  :'Import well headers or register a well to begin.';
 return `<p class="sub">${esc(message)}</p><button type="button" data-map-command="evidence">Open Data</button>`;
}
function locationReason(id){
 if(located().some(p=>p.id===id))return 'Confirmed location';
 const source=retainedLocation(id);
 if(source?.coordinateConflict||source?.conflictingCRS)return 'Coordinate sources disagree';
 if(finitePair(source))return 'Source X/Y grid';
 if(paths.some(path=>path.well===id&&path.points.length))return 'Survey only · wellhead unplaced';
 return 'Unplaced · no usable wellhead coordinates';
}
async function headerLocations(scope,matches){
 const results=new Map(),ambiguous=new Set();
 const missing=new Set([...matches].filter(([id,match])=>match.record&&!headerPoint(settings().locations?.[id],retainedLocation(id,matches))&&!sourceEpsg(match.point?.crs)).map(([,match])=>match.record.id));
 if(!missing.size)return results;
 for(const dataset of datasets().filter(d=>d.family==='well_headers'&&d.wellRecords?.some(r=>missing.has(r.id)))){
  if(!isScope(scope))break;
  const key=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const crsColumn=dataset.columns?.findIndex(c=>['epsg','epsgcode','crs','sourcecrs','coordsys','coordinatesystem'].includes(key(c.mnemonic)))??-1;
  const declared=sourceEpsg(dataset.references?.crs);
  if(crsColumn<0&&!declared)continue;
  let rows=[];
  if(crsColumn>=0){try{({rows}=await retainedRows(host,dataset,1000));}catch{continue;}}
  for(const record of dataset.wellRecords){
   if(!missing.has(record.id))continue;
   const crs=sourceEpsg(rows[record.rowIndex]?.[crsColumn])||declared;
   const coordinates=record.sourceCoordinates||{};
   const geographic=coordinates.geographicCoordinates;
   const point=crs==='EPSG:4326'&&validPoint(geographic)?{x:geographic.lng,y:geographic.lat}:coordinates;
   if(!crs||!finitePair(point)||!canUseSourcePair(crs,point.x,point.y))continue;
   if(declared&&declared!==crs||coordinates.coordinateConflict||coordinates.conflictingCRS){ambiguous.add(record.id);continue;}
   const previous=results.get(record.id);
   if(previous&&(previous.x!==point.x||previous.y!==point.y||previous.crs!==crs))ambiguous.add(record.id);
   results.set(record.id,{x:point.x,y:point.y,crs});
  }
 }
 for(const id of ambiguous)results.delete(id);
 return results;
}
const menu=(title,items)=>`<details class="mw-menu"><summary>${title} <span aria-hidden="true">⌄</span></summary><div>${items.map(([id,label,disabled])=>`<button type="button" data-map-command="${id}" ${disabled?'disabled':''}>${label}</button>`).join('')}</div></details>`;
export function mapWorkspaceView(){
 const project=host.getProject(),scope=session.user?.uid+':'+project.id;if(activeProject!==scope){activeProject=scope;selected='';search='';paths=[];pathIssues=[];loadedAt=0;loadedSignature='';loading=false;basemap='grid';zoom=1;focusWell='';pan=[0,0];measure=null;refreshQueued=false;gridSelection='';folderBlocked=false;automaticLocations={};inspector=true;}
 const grids=fieldGrids(),grid=fieldGrid(grids),ids=wells(),mapped=new Set(located().map(p=>p.id)),sourceCount=grids.filter(g=>g.id!=='geographic').flatMap(g=>g.points).filter(p=>!mapped.has(p.id)).length;
 if(measure&&measure.gridId!==grid.id)measure=null;
 const gridLabel=grid.id==='geographic'?'Field grid · local metres':'Field grid · source X/Y';if(!ids.includes(selected))selected=ids[0]||'';const p=located().find(w=>w.id===selected),deviations=surveysFor(selected),pending=pendingSurveys(selected);
 return `<section class="map-workspace ${inspector?'':'inspector-collapsed'}"><header class="mw-heading"><div><div class="study-kicker">SPATIAL WORKSPACE</div><h1>Project map</h1><p>${esc(project.name)} · ${located().length+sourceCount}/${ids.length} wells plotted</p></div><div class="actions"><button data-map-command="fit">Fit project</button><button id="mw-inspector-toggle" aria-expanded="${inspector}" aria-controls="mw-inspector">${inspector?'Hide':'Show'} inspector</button></div></header><div class="mw-ribbon" aria-label="Map ribbon">${menu('＋ Add',[['well','Import well locations…'],['deviation','Add deviation data…',!allWells().length],['spatial','Spatial data…'],['seismic','Seismic data…',!project.workflows?.includes('seismic')]])}${menu('Basemap',[['grid','Field grid'],['roadmap','Google Roadmap'],['satellite','Google Satellite'],['hybrid','Google Hybrid'],['terrain','Google Terrain']])}${menu('View',[['fit','Fit all evidence'],['labels','Show / hide well labels'],['wells','Show / hide wells'],['trajectories','Show / hide deviation'],['inspector','Show / hide inspector'],...(settings().removedWells?.length?[['restore-wells','Removed wells…']]:[])])}${menu('Measure',[['measure-distance','Distance between points'],['measure-area','Polygon area'],['measure-surface','Surface to surface'],['measure-bottom','Survey end to survey end']])}${menu('Style',[['style','Selected well symbol…',!selected]])}${menu('Export',[['export','Field map (SVG)',basemap!=='grid']])}<span class="mw-ribbon-status">${loading?'Loading evidence…':'Project evidence'}</span></div><div class="mw-body"><aside class="mw-contents"><div class="mw-panel-title">Contents <button data-map-command="refresh" aria-label="Refresh map evidence">↻</button></div><label class="mw-search">${host.icon('search')}<input id="mw-search" aria-label="Find a well" placeholder="Find a well…" value="${esc(search)}"></label><h3>BASEMAP</h3><div class="mw-basemap">${basemap==='grid'?esc(gridLabel):'Google '+basemap}</div><h3>PROJECT LAYERS</h3><label class="mw-layer"><input id="mw-wells" type="checkbox" ${showWells?'checked':''}>Wells <span>${ids.length}</span></label><label class="mw-layer"><input id="mw-deviation" type="checkbox" ${showDeviation?'checked':''}>Deviation trajectories <span>${paths.length}</span></label><h3>WELLS</h3><div class="mw-well-list">${ids.length?ids.map(id=>`<div class="mw-well-row" ${wellName(id).toLowerCase().includes(search.toLowerCase())||id.toLowerCase().includes(search.toLowerCase())?'':'hidden'}><input type="checkbox" data-map-visible="${esc(id)}" aria-label="Show ${esc(wellName(id))}" ${settings().hiddenWells?.includes(id)?'':'checked'}><button data-map-well="${esc(id)}" aria-pressed="${id===selected}"><img src="${WELL_ICON_URL}" alt="" class="mw-well-svg"><span><strong>${esc(wellName(id))}</strong><small>${esc(locationReason(id))}</small></span></button><button data-map-well-menu="${esc(id)}" aria-label="Actions for ${esc(wellName(id))}" aria-haspopup="menu">⋯</button></div>`).join(''):emptyWellList()}</div><p class="mw-reference-note">Wellheads use retained coordinates. Unplaced wells remain in Contents.</p></aside><div class="mw-map-column">${project.storage==='local'?'<div id="mw-folder-access" class="mw-folder-access" hidden><span>Folder access is required to load local survey files and write pending changes.</span><button data-map-command="reconnect-folder">Reconnect project folder</button></div>':''}${basemap==='grid'?`<div class="mw-grid-tools" aria-label="Field grid tools"><button data-map-command="measure-distance" aria-pressed="${measure?.basis==='distance'}">Measure</button><button data-map-command="measure-area" aria-pressed="${measure?.basis==='area'}">Area</button>${grids.length>1?`<label>Coordinate grid <select id="mw-grid-select">${grids.map(g=>`<option value="${esc(g.id)}" ${g.id===grid.id?'selected':''}>${esc(g.name)}</option>`).join('')}</select></label>`:''}</div>`:''}${measure?`<div class="mw-measure-toolbar"><output id="mw-measure-status" aria-live="polite">${esc(measureText())}</output><div>${measure.basis==='area'?'<button data-map-command="finish-area" disabled>Finish area</button> ':''}<button data-map-command="measurement-result" hidden>View result</button> <button data-map-command="cancel-measure">Clear measurement</button></div></div>`:''}<div class="mw-canvas" id="mw-canvas"><div class="mw-map-label">${basemap==='grid'?esc(gridLabel.toUpperCase()):'GOOGLE '+basemap.toUpperCase()}</div><div class="mw-north" aria-label="North">↑<small>N</small></div><div id="mw-renderer" aria-label="Project map"></div>${ids.length>located().length+sourceCount?`<div class="mw-unplaced-panel"><strong>Some wellheads are unplaced</strong><p>Open a well in Contents to see its location status.</p></div>`:''}<div id="mw-map-feedback" role="status"></div><div class="mw-map-controls"><button data-map-command="zoom-in" aria-label="Zoom in">＋</button><button data-map-command="zoom-out" aria-label="Zoom out">−</button><button data-map-command="fit" aria-label="Fit evidence">⌖</button></div></div><div class="mw-legend"><span><img src="${WELL_ICON_URL}" alt="" width="12" height="17">Wellhead</span><span><i class="mw-line"></i>Deviation trajectory</span><span><i class="mw-end"></i>Survey end</span></div></div><aside class="mw-inspector" id="mw-inspector" ${inspector?'':'hidden'}><div class="mw-panel-title">Inspector<button id="mw-inspector-close" aria-label="Collapse inspector">×</button></div>${selected?`<div class="mw-inspector-well-title"><h2>${esc(wellName(selected))}</h2><button data-map-well-menu="${esc(selected)}" aria-label="Well actions" aria-haspopup="menu">⋯</button></div><p class="sub">Surface well · ${esc(selected)}</p><dl><dt>Location reference</dt><dd>${p?'WGS84 · confirmed source':finitePair(retainedLocation(selected))?'Source X/Y grid':esc(locationReason(selected))}</dd>${p?`<dt>Latitude / longitude</dt><dd class="mw-coordinates">${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}</dd>`:''}<dt>Deviation evidence</dt><dd>${deviations.length} imported ${deviations.length===1?'dataset':'datasets'}${pending.length?' · '+pending.length+' pending review':''}</dd></dl><label class="field">Active survey<select id="mw-active-survey"><option value="">Choose active survey</option>${deviations.map(d=>`<option value="${esc(d.id)}" ${host.getState().wellDrafts?.find(w=>w.id===selected)?.activeSurveyId===d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label><div class="mw-inspector-actions">${pending.length?'<button data-map-command="pending-surveys">Review pending surveys</button>':''}<button data-map-command="deviation" class="primary">＋ Add deviation data</button><button data-map-command="interpretation">Open in Interpretation</button><button data-map-command="evidence">View well evidence</button></div><div class="mw-style"><h3>APPEARANCE</h3><label class="field">Well symbol<select id="mw-symbol">${['Wellhead','Circle','Square'].map(s=>`<option ${settings().symbols?.[selected]===s?'selected':''}>${s}</option>`).join('')}</select></label><label class="mw-layer"><input id="mw-labels" type="checkbox" ${labels?'checked':''}>Show well names</label></div>`:'<div class="mw-inspector-empty">Select a well to inspect its location and add deviation evidence.</div>'}<div class="mw-path-issues">${pathIssues.map(i=>`<p>${esc(i)}</p>`).join('')}</div></aside></div><footer class="mw-status"><span>${located().length+sourceCount} plotted wells · ${paths.length} mapped deviation ${paths.length===1?'survey':'surveys'}</span><span>${basemap!=='grid'?'Geographic well and survey evidence':grid.id==='geographic'?'Field grid uses a local WGS84 projection':'Source X/Y · '+(grid.unit===null?'units unspecified':grid.name)}</span></footer></section>`;
}
export function bindMapWorkspace(){
 if(!$('#mw-canvas'))return;const project=host.getProject(),folder=$('#mw-folder-access');
 if(folder){
  folder.hidden=!folderBlocked;
  repository.folderCanWrite(project.id).then(writable=>{if(folder.isConnected){folderBlocked=!writable;folder.hidden=writable;}}).catch(error=>{if(folder.isConnected)host.toast(error.message);});
 }
 $('#mw-grid-select')?.addEventListener('change',e=>{gridSelection=e.target.value;measure=null;pan=[0,0];zoom=1;focusWell='';draw();$('#mw-grid-select')?.focus();});
 if(measure)updateMeasurement();showWells=settings().showWells!==false;showDeviation=settings().showDeviation!==false;labels=settings().labels!==false;
 const toggle=()=>{inspector=!inspector;draw();};$('#mw-inspector-toggle').onclick=toggle;$('#mw-inspector-close')?.addEventListener('click',toggle);
 document.querySelectorAll('[data-map-well]').forEach(b=>{b.onclick=()=>selectMapWell(b.dataset.mapWell);b.oncontextmenu=e=>wellMenu(e,b.dataset.mapWell,b);b.onkeydown=e=>{if(e.key==='ContextMenu'||e.shiftKey&&e.key==='F10')wellMenu(e,b.dataset.mapWell,b);};});
 document.querySelectorAll('[data-map-well-menu]').forEach(b=>b.onclick=e=>wellMenu(e,b.dataset.mapWellMenu,b));
 document.querySelectorAll('[data-map-unplaced]').forEach(b=>{b.onclick=()=>{selected=b.dataset.mapUnplaced;if(!loading)void refresh();};b.oncontextmenu=e=>wellMenu(e,b.dataset.mapUnplaced,b);});
 $('#mw-search').oninput=e=>{search=e.target.value;document.querySelectorAll('[data-map-well]').forEach(b=>b.closest('.mw-well-row').hidden=!(wellName(b.dataset.mapWell)+' '+b.dataset.mapWell).toLowerCase().includes(search.toLowerCase()));};
 $('#mw-wells').onchange=e=>{showWells=e.target.checked;saveSetting('showWells',showWells);renderMap();};$('#mw-deviation').onchange=e=>{showDeviation=e.target.checked;saveSetting('showDeviation',showDeviation);renderMap();};$('#mw-labels')?.addEventListener('change',e=>{labels=e.target.checked;saveSetting('labels',labels);renderMap();});
 document.querySelectorAll('[data-map-visible]').forEach(input=>input.onchange=()=>{const hidden=new Set(settings().hiddenWells||[]);if(input.checked)hidden.delete(input.dataset.mapVisible);else hidden.add(input.dataset.mapVisible);saveSetting('hiddenWells',[...hidden]);renderMap();});
 $('#mw-active-survey')?.addEventListener('change',async e=>{const well=host.getState().wellDrafts?.find(w=>w.id===selected);if(well){well.activeSurveyId=e.target.value;host.save();await refresh();}});
 $('#mw-symbol')?.addEventListener('change',e=>{saveSetting('symbols',{...settings().symbols,[selected]:e.target.value});renderMap();});
 document.querySelectorAll('[data-map-command]').forEach(b=>b.onclick=()=>{b.closest('details')?.removeAttribute('open');command(b.dataset.mapCommand);});
 const menus=[...document.querySelectorAll('.mw-menu')];menus.forEach(m=>m.ontoggle=()=>{if(m.open)menus.filter(n=>n!==m).forEach(n=>n.open=false);});
 const map=$('.map-workspace');
 if(measure)document.addEventListener('keydown',function exitMeasure(event){
  if(!map.isConnected){document.removeEventListener('keydown',exitMeasure);return;}
  if(event.key==='Escape'&&measure&&!event.defaultPrevented&&!document.querySelector('dialog[open]')){
   document.removeEventListener('keydown',exitMeasure);
   measure=null;draw();$('[data-map-command=measure-distance]')?.focus();
  }
 });
 renderMap();const signature=mapEvidenceSignature();if(signature!==loadedSignature&&!loading)refresh();else if(project.storage==='cloud'&&Date.now()-loadedAt>30000&&!loading)refresh();else if(!loadedAt&&!loading)refresh();
}
function draw(){closeWellMenu();host.render();}
async function command(action){try{
 if(action.startsWith('measure-')){startMeasure(action.slice(8));return;}
 if(action==='finish-area'&&measure?.basis==='area'&&measure.vertices.length>=3){measure.done=true;updateMeasurement();renderMap();showMeasurementResult();return;}
 if(action==='measurement-result'){showMeasurementResult();return;}
 if(action==='reconnect-folder'){
  try{await host.reconnectProjectFolder();folderBlocked=false;await refresh();}
  catch(error){if(error.code==='project_folder_access')host.folderReconnectDialog(refresh);else if(error.name!=='AbortError')throw error;}
  return;
 }
 if(action==='cancel-measure'){measure=null;draw();$('[data-map-command=measure-distance]')?.focus();return;}
 if(action==='interpretation'&&selected){host.openWellWorkspace('interpretation',sourceWell(selected));return;}
 if(action==='restore-wells'){restoreWells();return;}
 if(action==='inspector'){inspector=!inspector;draw();return;}
 if(action==='deviation'){chooseDeviationWell();return;}
 if(['well','spatial','seismic'].includes(action)){await openImporter({family:{well:'well_headers',spatial:'spatial',seismic:'seismic'}[action]});return;}
 if(action==='location'){if(!loading)await refresh();return;}
 if(action==='pending-surveys'){const pending=pendingSurveys(selected)[0];if(pending)await reviewImport(pending.importId);return;}
 if(action==='evidence'){host.navigate('files');return;}
 if(action==='refresh'){await refresh();return;}
 if(action==='labels'){saveSetting('labels',!labels);draw();return;}if(action==='wells'){saveSetting('showWells',!showWells);draw();return;}if(action==='trajectories'){saveSetting('showDeviation',!showDeviation);draw();return;}
 if(action==='style'){inspector=true;draw();$('#mw-symbol')?.focus();return;}
 if(['grid','roadmap','satellite','hybrid','terrain'].includes(action)){basemap=action;measure=null;pan=[0,0];draw();return;}
 if(action==='fit'){zoom=1;focusWell='';pan=[0,0];renderMap();return;}if(action==='zoom-in'||action==='zoom-out'){if(basemap!=='grid'&&googleMap){googleMap.setZoom(googleMap.getZoom()+(action==='zoom-in'?1:-1));return;}zoom=Math.max(.2,Math.min(30,zoom*(action==='zoom-in'?1.4:1/1.4)));renderMap();return;}
 if(action==='export'){const svg=$('#mw-renderer svg');if(!svg){host.toast('Select Field grid to export the map.');return;}const copy=svg.cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');const style=document.createElementNS('http://www.w3.org/2000/svg','style');style.textContent='text{font:11px sans-serif;fill:#264b42}.mw-gridline{stroke:#dce6e1;stroke-width:1}.mw-trajectory{stroke:#b47c51;stroke-width:2;fill:none}.mw-point{fill:#fff;stroke:#087c73;stroke-width:1.5}';style.textContent+=".mw-survey-end{fill:#fff;stroke:#b47c51;stroke-width:1.5}.mw-measure-shape{stroke:#176c55;stroke-width:2;fill:#087c7322}.mw-grid-edge{fill:none;stroke:#8ca89a}";copy.prepend(style);host.download(host.getProject().name+'-map.svg',new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));}
 }catch(error){host.toast(error.message);}}
function mapEvidenceSignature(){
 return JSON.stringify([datasets().map(d=>[d.id,d.well,d.references,d.wellRecords,d.rowCount,d.metadata?.headers]),
  (host.getState().wellDrafts||[]).map(w=>[w.id,w.name,w.uwi,w.aliases,w.activeSurveyId,w.sourceWellId,w.sourceCoordinates])]);
}
async function refresh(){
 if(loading){refreshQueued=true;return;}
 const project=host.getProject(),id=project.id,uid=session.user?.uid,scope=uid+':'+id;
 loading=true;
 let signature=mapEvidenceSignature();
 try{
  if(project.storage==='cloud'){
   const [evidence,locations]=await Promise.allSettled([loadCloud(project),host.refreshCloudMapLocations()]);
   if(!isScope(scope))return;
   if(evidence.status==='fulfilled')applyImportedEvidence(host.getState(),evidence.value);
   if(evidence.status==='rejected'||locations.status==='rejected')host.toast('Some Cloud map evidence could not refresh. Showing the retained workspace.');
  }
  signature=mapEvidenceSignature();
  await placeReferencedWells(project,scope);
  if(isScope(scope))await readDeviations(project);
 }catch(error){if(isScope(scope))host.toast(error.message);}
 finally{
  if(activeProject===scope){
   loading=false;loadedSignature=signature;loadedAt=Date.now();
   const queued=refreshQueued;refreshQueued=false;
   if($('#mw-canvas')){draw();if(queued&&!loading)void refresh();}
  }
 }
}
async function readDeviations(project){
 const result=[],issues=[],uid=session.user?.uid,matches=headerMatches(),data=datasets(),inventory=wellInventory(data);
 for(const id of wells()){
  const {record,dataset}=matches.get(id)||{};
  const well=inventory.get(id),header=retainedLocation(id,matches);
  const surveys=surveysFor(id,data);
  const survey=surveys.find(d=>d.id===well?.activeSurveyId)||(surveys.length===1?surveys[0]:null);
  if(!survey){if(surveys.length)issues.push(wellName(id)+': choose the active survey in the inspector.');continue;}
  try{
   if(survey.issues?.some(i=>i.severity==='blocking'))throw new Error('Resolve import validation before map use.');
   const source=await retainedRows(host,survey,50000);
   const d={...survey,columns:source.columns,references:source.references,metadata:source.metadata};
   const origin={...well,...record,sourceCoordinates:finitePair(header)?{...header,crs:sourceEpsg(header.crs)||''}:null};
   const evidence=globalThis.StrataxWellEvidence;
   let points=[],native=[],geographicError;
   try{points=evidence.trajectory(source.rows,d,origin);}catch(error){geographicError=error;}
   const crs=sourceEpsg(header?.crs),surveyCrs=sourceEpsg(d.references.crs),unit=sourceGridUnit(header,dataset);
   if(finitePair(header)&&!header.coordinateConflict&&!header.conflictingCRS&&crs!=='EPSG:4326'&&crs===surveyCrs&&(!d.references.crs||surveyCrs)){
    const xUnit=evidence.length(d.columns?.[d.mapping?.x]?.unit),yUnit=evidence.length(d.columns?.[d.mapping?.y]?.unit);
    if((!xUnit&&!yUnit)||(xUnit===yUnit&&(!unit||unit===xUnit))){
     try{native=evidence.trajectory(source.rows,{...d,references:{...d.references,crs}},origin,{sourceGrid:true,gridUnit:unit});}
     catch(error){geographicError=error;}
    }
   }
   if(!points.length&&native.length&&surveyCrs&&project.storage==='cloud'){
    try{points=await transformSurvey(project,surveyCrs,native,uid);}
    catch(error){geographicError=error;}
   }
   if(points.length<2&&native.length<2)throw geographicError||new Error('At least two referenced stations are required.');
   result.push({id:survey.id,well:id,points:points.length>=2?points:[],native:native.length>=2?native:[]});
  }catch(error){issues.push(wellName(id)+': '+error.message);}
 }
 if(host.getProject()?.id===project.id&&session.user?.uid===uid){paths=result;pathIssues=issues;}
}
async function transformSurvey(project,crs,stations,uid){
 const points=[];
 for(let i=0;i<stations.length;i+=100){
  if(!isScope(uid+':'+project.id))throw new Error('The project changed while loading evidence.');
  const batch=stations.slice(i,i+100);
  const response=await api('/api/projects/'+project.id+'/locations/preview',{method:'POST',body:{crs,points:batch.map(({x,y},j)=>({id:'station-'+(i+j),x,y}))}});
  if(response.points.length!==batch.length||response.points.some(p=>!validPoint(p)||p.conflicts?.length))throw new Error('The survey could not be placed on the geographic map.');
  points.push(...response.points);
 }
 return points;
}
function sourceGridUnit(point,dataset={}){
 const evidence=globalThis.StrataxWellEvidence;
 const x=evidence.length(dataset.columns?.[dataset.mapping?.x]?.unit),y=evidence.length(dataset.columns?.[dataset.mapping?.y]?.unit);
 if(x||y)return x===y?x:null;
 const crs=sourceEpsg(point?.crs);
 return /^EPSG:(3857|2639[1-3]|32[67]\d\d)$/.test(crs)?1:null;
}
function sourceGridGroups(){
 const groups=new Map(),matches=headerMatches();
 const mapped=new Set(located().map(p=>p.id)),needed=new Set();
 const groupKey=(dataset,point)=>JSON.stringify([sourceEpsg(point?.crs)||dataset.id,sourceGridUnit(point,dataset)]);
 for(const [id,{dataset}] of matches){
  if(!dataset)continue;
  if(!mapped.has(id)||paths.some(path=>path.well===id&&path.native.length&&!path.points.length))needed.add(groupKey(dataset,retainedLocation(id,matches)));
 }
 for(const [id,{dataset}] of matches){
  if(!dataset||settings().removedWells?.includes(id))continue;
  const point=retainedLocation(id,matches),crs=sourceEpsg(point?.crs),unit=sourceGridUnit(point,dataset);
  if(!finitePair(point)||point.coordinateConflict||point.conflictingCRS||crs==='EPSG:4326')continue;
  const native=paths.find(path=>path.well===id&&path.native.length);
  const key=groupKey(dataset,point);
  if(!needed.has(key))continue;
  if(!groups.has(key))groups.set(key,{id:key,name:dataset.name||'Source X/Y',unit,points:[],lines:[]});
  const grid=groups.get(key);
  grid.points.push({...point,id,xy:[point.x,point.y]});
  if(native)grid.lines.push({...native,xy:native.native.map(p=>[p.x,p.y])});
 }
 return [...groups.values()];
}
function fieldGrids(){
 const surfaces=located(),lines=paths.filter(p=>p.points.length&&wells().includes(p.well));
 const reference=surfaces[0]||lines[0]?.points[0];
 const grids=sourceGridGroups();
 if(!reference)return grids;
 const radians=Math.PI/180,metres=6371008.8*radians;
 const xy=p=>[((p.lng-reference.lng+540)%360-180)*metres*Math.cos(reference.lat*radians),(p.lat-reference.lat)*metres];
 return [{id:'geographic',name:'Geographic wells',unit:1,points:surfaces.map(p=>({...p,xy:xy(p)})),lines:lines.map(p=>({...p,xy:p.points.map(xy)}))},...grids];
}
function fieldGrid(grids=fieldGrids()){
 return grids.find(g=>g.id===gridSelection)||grids.find(g=>g.lines.length)||grids[0]||{id:'empty',name:'Source X/Y',unit:null,points:[],lines:[]};
}
function renderMap(){
 resizeObserver?.disconnect();const element=$('#mw-renderer');if(!element)return;
 const generation=++mapGeneration,hidden=new Set(settings().hiddenWells||[]);googleMap=null;
 const visible=id=>!hidden.has(id);
 element.classList.toggle('mw-measuring',!!measure);
 if(basemap!=='grid'){
  element.innerHTML='';
  const points=showWells?located().filter(p=>visible(p.id)):[],lines=showDeviation?paths.filter(p=>p.points.length&&wells().includes(p.well)&&visible(p.well)):[];
  if(!points.length&&!lines.length){element.innerHTML='<p class="mw-empty-map">No geographically referenced wells or surveys are visible. Use Field grid for source X/Y.</p>';return;}
  mountWorkspaceMap(element,{points,paths:lines,basemap,labels,symbols:settings().symbols||{},select:selectMapWell,contextMenu:(id,event)=>wellMenu(event,id),focus:focusWell?points.find(p=>p.id===focusWell):null}).then(map=>{if(generation===mapGeneration)googleMap=map;}).catch(error=>{if(generation===mapGeneration&&element.isConnected)element.textContent=error.message+' Field grid remains available.';});
  return;
 }
 const grid=fieldGrid(),points=showWells?grid.points.filter(p=>visible(p.id)):[],lines=showDeviation?grid.lines.filter(p=>visible(p.well)):[];
 const positions=[...points.map(p=>p.xy),...lines.flatMap(p=>p.xy)];
 const bounds=positions.reduce(([left,right,bottom,top],[x,y])=>[Math.min(left,x),Math.max(right,x),Math.min(bottom,y),Math.max(top,y)],[Infinity,-Infinity,Infinity,-Infinity]);
 const drawGrid=()=>{
  if(!element.isConnected)return;
  const width=Math.max(260,element.clientWidth),height=Math.max(340,element.clientHeight),left=67,right=width-42,top=66,bottom=height-74;
  const [minX,maxX,minY,maxY]=positions.length?bounds:[0,0,0,0];
  const target=points.find(p=>p.id===focusWell)?.xy;
  const [cx,cy]=target||[(minX+maxX)/2,(minY+maxY)/2];
  const scale=zoom/Math.max((maxX-minX)/(right-left)*1.24,(maxY-minY)/(bottom-top)*1.24,(!positions.length||maxX===minX&&maxY===minY)?1:1e-9);
  const ox=(left+right)/2,oy=(top+bottom)/2;
  const px=([x,y])=>[ox+(x-cx-pan[0])*scale,oy-(y-cy-pan[1])*scale];
  const xy=([x,y])=>[(x-ox)/scale+cx+pan[0],(oy-y)/scale+cy+pan[1]];
  const axisFactor=grid.unit===null?1:grid.unit/1000;
  const tick=(value)=>Number((value*axisFactor).toPrecision(7)).toLocaleString(undefined,{maximumFractionDigits:8});
  const unit=grid.unit===null?'source units':'km';
  let rules='';
  for(let i=0;i<=5;i++){
   const x=left+(right-left)*i/5,y=top+(bottom-top)*i/5,[east,north]=xy([x,y]);
   rules+=`<path class="mw-gridline" d="M${x} ${top}V${bottom}M${left} ${y}H${right}"/>${positions.length?`<text x="${x}" y="${bottom+17}" text-anchor="middle">${tick(east)}</text><text x="${left-6}" y="${y+3}" text-anchor="end">${tick(north)}</text>`:''}`;
  }
  const trajectories=lines.map(line=>{
   const coordinates=line.xy.map(px),[x,y]=coordinates.at(-1);
   return `<polyline class="mw-trajectory" data-map-point="${esc(line.well)}" points="${coordinates.map(p=>p.join(',')).join(' ')}"/><circle class="mw-survey-end" data-map-point="${esc(line.well)}" cx="${x}" cy="${y}" r="4"><title>${esc(wellName(line.well))} · survey end</title></circle>`;
  }).join('');
  const marks=points.map(point=>{
   const [x,y]=px(point.xy),symbol=settings().symbols?.[point.id]||'Wellhead';
   const marker=symbol==='Circle'?'<circle class="mw-point" r="5"/>':symbol==='Square'?'<rect class="mw-point" x="-5" y="-5" width="10" height="10"/>':`<image href="${WELL_ICON_URL}" x="-10" y="-23" width="20" height="26"/>`;
   return `<g data-map-point="${esc(point.id)}" transform="translate(${x},${y})" tabindex="0" role="button" aria-label="${esc(wellName(point.id))}"><title>${esc(wellName(point.id))}</title><circle r="13" fill="${point.id===selected?'#e2f2ec':'transparent'}"/>${marker}${labels?`<text y="-27" text-anchor="middle">${esc(wellName(point.id))}</text>`:''}</g>`;
  }).join('');
  const barValue=80/scale,bar=Math.pow(10,Math.floor(Math.log10(barValue))),step=(barValue/bar>=5?5:barValue/bar>=2?2:1)*bar,barWidth=step*scale;
  const scaleBar=positions.length?`<path d="M${left} ${height-18}h${barWidth}m-${barWidth} -4v8m${barWidth} -8v8" stroke="#486b5c"/><text x="${left+barWidth+7}" y="${height-15}">${metricText(step,1,grid)}</text>`:'';
  element.innerHTML=`<svg id="mw-field-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" aria-label="Field grid of wells and deviation trajectories"><rect width="${width}" height="${height}" fill="#f9fcfa"/><defs><clipPath id="mw-grid-clip"><rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}"/></clipPath></defs>${rules}<rect class="mw-grid-edge" x="${left}" y="${top}" width="${right-left}" height="${bottom-top}"/><text x="${ox}" y="${bottom+36}" text-anchor="middle">X position (${unit})</text><text transform="translate(13 ${oy}) rotate(-90)" text-anchor="middle">Y position (${unit})</text>${scaleBar}<g clip-path="url(#mw-grid-clip)"><g id="mw-map-geometry">${trajectories}${marks}</g><path class="mw-measure-shape"/></g></svg>`;
  const feedback=$('#mw-map-feedback');
  if(feedback)feedback.textContent=positions.length||$('.mw-unplaced-panel')?'':'No well or survey geometry is visible on this grid.';
  const svg=element.querySelector('svg'),shape=svg.querySelector('.mw-measure-shape'),geometry=svg.querySelector('#mw-map-geometry');
  const planar=measure&&['area','distance'].includes(measure.basis);
  const current=()=>!measure?[]:planar?measure.vertices:[measure.from&&endpointFor(measure.from,measure.basis,grid),measure.to&&endpointFor(measure.to,measure.basis,grid)].filter(Boolean);
  const paint=(preview=null)=>{
   const vertices=current(),area=measure?.basis==='area',points=preview?[...vertices,preview]:vertices;
   shape.setAttribute('d',points.map((p,i)=>(i?'L':'M')+px(p).join(' ')).join(' ')+(area&&measure.done?' Z':''));
   shape.setAttribute('fill',area&&measure.done?'#087c7322':'none');
  };
  const cursor=e=>{const rect=svg.getBoundingClientRect();return [(e.clientX-rect.left)*width/rect.width,(e.clientY-rect.top)*height/rect.height];};
  const coordinate=e=>{
   const [x,y]=cursor(e);
   if(x<left||x>right||y<top||y>bottom)return null;
   return xy([x,y]);
  };
  paint();
  let drag=null;
  svg.onpointerdown=e=>{if(measure||e.button!==0||e.target.closest('[data-map-point]'))return;drag=cursor(e);svg.setPointerCapture(e.pointerId);};
  svg.onpointermove=e=>{
   const [x,y]=cursor(e);
   if(drag){geometry.setAttribute('transform',`translate(${x-drag[0]} ${y-drag[1]})`);return;}
   const vertices=current();
   if(!vertices.length||measure.done||!planar&&measure.to)return;
   const id=e.target.closest('[data-map-point]')?.dataset.mapPoint;
   paint((!planar&&id&&endpointFor(id,measure.basis,grid))||coordinate(e));
  };
  svg.onpointerleave=()=>paint();
  svg.onpointerup=e=>{if(!drag)return;const [x,y]=cursor(e);pan=[pan[0]-(x-drag[0])/scale,pan[1]+(y-drag[1])/scale];drag=null;drawGrid();};
  svg.onpointercancel=()=>{drag=null;drawGrid();};
  svg.onclick=e=>{
   if(!planar)return;
   const point=coordinate(e);
   if(!point)return;
   if(measure.done){measure.vertices=[];measure.done=false;}
   measure.vertices.push(point);
   if(measure.basis==='distance'&&measure.vertices.length===2)measure.done=true;
   updateMeasurement();paint();
   if(measure.done)showMeasurementResult();
  };
  svg.addEventListener('wheel',e=>{
   e.preventDefault();
   const old=zoom,[x,y]=cursor(e);
   zoom=Math.max(.2,Math.min(30,zoom*Math.exp(-e.deltaY*.002)));
   pan=[pan[0]+(x-ox)/scale*(1-old/zoom),pan[1]-(y-oy)/scale*(1-old/zoom)];
   drawGrid();
  },{passive:false});
  svg.querySelectorAll('[data-map-point]').forEach(mark=>{
   mark.onclick=()=>{if(!planar)selectMapWell(mark.dataset.mapPoint);};
   mark.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectMapWell(mark.dataset.mapPoint);}};
   mark.oncontextmenu=e=>wellMenu(e,mark.dataset.mapPoint,mark);
  });
 };
 drawGrid();resizeObserver=new ResizeObserver(drawGrid);resizeObserver.observe(element);
}
