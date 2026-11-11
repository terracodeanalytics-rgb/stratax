import {applyImportedEvidence} from './well-data.js';
import {retainedRows} from './well-derived.js';
import './well-evidence.js';
import {WELL_ICON_URL} from './well-symbol.js';
import {api,session} from './auth.js';
import {loadCloud,nativePreview,browserRead} from './ingestion-client.js';
import {openImporter,reviewImport} from './data-page.js';
import * as repository from './project-repository.js';
import {mountWorkspaceMap} from './project-map.js';

let host,activeProject,selected='',search='',basemap='grid',inspector=true,labels=true,showWells=true,showDeviation=true,zoom=1,paths=[],pathIssues=[],loading=false,loadedAt=0,loadedSignature='',resizeObserver,mapGeneration=0,googleMap,focusWell='',contextAbort,pan=[0,0],measure=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
const isWgs84=value=>/^(?:EPSG:)?4326$|^WGS\s?84$/i.test(String(value||'').trim());
const validPoint=p=>p&&typeof p.lat==='number'&&typeof p.lng==='number'&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&Math.abs(p.lat)<=85&&Math.abs(p.lng)<=180;
const projection=p=>[6378137*p.lng*Math.PI/180,6378137*Math.log(Math.tan(Math.PI/4+p.lat*Math.PI/360))];
export function configureMapWorkspace(value){host=value;}
export function focusMapWell(id){if(wells().includes(id)){selected=id;inspector=true;draw();}}
function settings(){return host.getState().mapWorkspace||{locations:{},symbols:{}};}
function datasets(){return (host.getState().ingestion?.datasets||[]).filter(d=>d.active!==false);}
function allWells(){return [...new Set([...(host.getState().wellDrafts||[]).map(w=>w.id),...datasets().map(d=>d.well)].filter(Boolean))];}
function wells(){return allWells().filter(id=>!settings().removedWells?.includes(id));}
function wellName(id){return settings().names?.[id]||host.getState().wellDrafts?.find(w=>w.id===id)?.name||id;}
const isScope=value=>session.user?.uid+':'+host.getProject()?.id===value;
function sourceWell(id){return host.getState().wellDrafts?.find(w=>w.id===id)?.sourceWellId||id;}
function pendingSurveys(id){
 const owner=sourceWell(id),records=host.getState().ingestion?.imports||[];
 const identity=d=>JSON.stringify([d.sourceId,d.metadata?.sheet||'',d.metadata?.well||'']);
 const accepted=new Set(datasets().filter(d=>d.sourceId&&d.family==='deviation'&&d.well===owner).map(identity));
 return records.flatMap(record=>['awaiting confirmation','retained/unresolved'].includes(record.status)
  ?(record.datasets||[]).filter(d=>!d.active&&d.family==='deviation'&&d.well===owner&&!accepted.has(identity(d))).map(d=>({id:d.id,importId:record.id}))
  :[]);
}
function located(){return wells().flatMap(id=>{const p=settings().locations?.[id];return p?.confirmed&&validPoint(p)?[{id,name:wellName(id),...p}]:[];});}
function saveSetting(key,value){const state=host.getState();state.mapWorkspace||={locations:{},symbols:{}};state.mapWorkspace[key]=value;host.save();}
function closeWellMenu(restoreFocus=false){const node=$('#mw-well-context'),trigger=node?.returnTarget;contextAbort?.abort();contextAbort=null;node?.remove();if(restoreFocus&&trigger?.isConnected)trigger.focus();}
function endpointFor(id,basis){
 const surface=located().find(point=>point.id===id);
 if(basis==='surface')return surface;
 const end=paths.find(path=>path.well===id)?.points.at(-1);
 return surface&&validPoint(end)?end:null;
}
function mapDistance(a,b){
 const radians=Math.PI/180;
 const x=Math.sin((b.lat-a.lat)*radians/2)**2+Math.cos(a.lat*radians)*Math.cos(b.lat*radians)*Math.sin((b.lng-a.lng)*radians/2)**2;
 return 12742017.6*Math.asin(Math.sqrt(Math.min(1,Math.max(0,x))));
}
function measureText(){
 if(!measure)return '';
 const label=measure.basis==='surface'?'Surface to surface':'Survey end to survey end';
 if(!measure.from)return label+' · choose the first well.';
 if(!measure.to)return label+' · choose a second well.';
 const a=endpointFor(measure.from,measure.basis),b=endpointFor(measure.to,measure.basis);
 return a&&b?label+' · '+wellName(measure.from)+' to '+wellName(measure.to)+' · '+mapDistance(a,b).toFixed(1)+' m':'One endpoint needs location or survey review.';
}
function startMeasure(basis,from=null){
 measure={basis,from:from&&endpointFor(from,basis)?from:null,to:null};basemap='grid';draw();
 document.querySelector('[data-map-command="cancel-measure"]')?.focus();
}
function selectMapWell(id){
 if(!measure){selected=id;inspector=true;draw();return;}
 if(!endpointFor(id,measure.basis)){host.toast(measure.basis==='surface'?'Confirm this well’s surface coordinates first.':'Confirm the well location and choose a valid active survey first.');return;}
 if(!measure.from||measure.to){measure.from=id;measure.to=null;}
 else if(measure.from!==id)measure.to=id;
 const status=$('#mw-measure-status');if(status)status.textContent=measureText();
 renderMap();
}
function wellMenu(event,id,trigger){
 event?.preventDefault();closeWellMenu();if(!wells().includes(id))return;selected=id;
 const node=document.createElement('div');node.id='mw-well-context';node.className='mw-well-context';node.setAttribute('role','menu');node.setAttribute('aria-label',wellName(id)+' actions');node.returnTarget=trigger;
 node.innerHTML=`<div>${esc(wellName(id))}</div>${[['interpretation','Open in Interpretation'],['measure-from','Measure from here'],['trajectory','Show trajectory'],['rename','Rename'],['duplicate','Duplicate'],['zoom','Zoom to well'],['delete','Delete']].map(([action,label])=>`<button role="menuitem" type="button" data-well-action="${action}">${label}</button>`).join('')}`;document.body.append(node);
 const rect=trigger?.getBoundingClientRect();node.style.left=Math.max(8,Math.min(event?.clientX||rect?.left||40,innerWidth-node.offsetWidth-8))+'px';node.style.top=Math.max(8,Math.min(event?.clientY||rect?.bottom||100,innerHeight-node.offsetHeight-8))+'px';
 const buttons=[...node.querySelectorAll('button')];buttons.forEach(b=>b.onclick=()=>{closeWellMenu();manageWell(b.dataset.wellAction,id);});buttons[0].focus();contextAbort=new AbortController();
 document.addEventListener('pointerdown',e=>{if(!node.contains(e.target))closeWellMenu();},{capture:true,signal:contextAbort.signal});
 node.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeWellMenu(true);}else if(e.key==='Tab')closeWellMenu(true);else if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const index=buttons.indexOf(document.activeElement);buttons[e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus();}});
}
async function manageWell(action,id){
 const scope=activeProject,name=wellName(id);selected=id;
 if(action==='interpretation'){host.openWellWorkspace('interpretation',sourceWell(id));return;}
 if(action==='measure-from'){startMeasure('surface',id);return;}
 if(action==='trajectory'){if(!paths.some(p=>p.well===id)){host.toast('Choose a valid active survey to display this trajectory.');return;}saveSetting('showDeviation',true);saveSetting('hiddenWells',(settings().hiddenWells||[]).filter(w=>w!==id));focusWell=id;inspector=true;draw();return;}
 if(action==='zoom'){const p=located().find(p=>p.id===id);if(!p){host.toast('Review this well’s location before zooming to it.');await editLocation();return;}focusWell=id;zoom=5;inspector=true;draw();return;}
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
function restoreWells(){
 const scope=activeProject,removed=(settings().removedWells||[]).filter(id=>allWells().includes(id));
 host.modal('Removed map wells',`<p class="sub">Original evidence was retained. Restore selected wells to the map.</p><form id="mw-restore-form">${removed.map(id=>`<label class="layer"><input type="checkbox" name="restore" value="${esc(id)}">${esc(wellName(id))}</label>`).join('')}<button class="primary" type="submit">Restore selected wells</button></form>`);
 $('#mw-restore-form').onsubmit=async e=>{e.preventDefault();if(!isScope(scope))return;const ids=new Set(new FormData(e.currentTarget).getAll('restore'));try{saveSetting('removedWells',(settings().removedWells||[]).filter(id=>!ids.has(id)));await host.flush();$('#dialog').close();draw();}catch(error){host.toast(error.message);}};
}
const finitePair=p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y);
function retainedLocation(id){
 const owner=sourceWell(id),well=host.getState().wellDrafts?.find(w=>w.id===owner),stored=well?.sourceCoordinates;
 const headers=datasets().filter(d=>d.family==='well_headers');
 for(const dataset of headers){
  const record=dataset.wellRecords?.find(w=>w.id===owner&&finitePair(w.sourceCoordinates));
  if(record){
   const raw=record.sourceCoordinates,same=stored?.x===raw.x&&stored?.y===raw.y;
   return {...(same?stored:{}),...raw,crs:raw.crs||(same?stored.crs:''),source:dataset.name};
  }
 }
 return finitePair(stored)?stored:null;
}
function locationReason(id){
 if(located().some(p=>p.id===id))return 'Confirmed location';
 const source=retainedLocation(id);
 if(source?.coordinateConflict||source?.conflictingCRS)return 'Coordinate sources disagree · review';
 if(source)return source.crs?'Documented CRS · location review':'X/Y retained · source CRS needed';
 return 'Coordinates or source CRS needed';
}
async function locationSuggestion(id){
 const existing=settings().locations?.[id],xy=retainedLocation(id);
 if(xy){
  const verified=existing?.coordinateOperation&&existing.sourceCoordinates?.x===xy.x&&existing.sourceCoordinates?.y===xy.y;
  return {...xy,crs:xy.crs||(verified?existing.sourceCRS:''),current:existing};
 }
 if(validPoint(existing))return existing;
 const d=datasets().find(d=>d.well===sourceWell(id)&&d.family==='logs');if(!d)return {};
 const data=host.getProject().storage==='cloud'?await nativePreview(host.getProject(),d.importId,d.id):d,headers=data.metadata?.headers||{};
 const value=names=>{const h=names.map(key=>headers[key]).find(Boolean),raw=h?.value;return raw!==undefined&&String(raw).trim()!==''?Number(raw):undefined;};
 const point={lat:value(['LAT','LATI','LATITUDE']),lng:value(['LONG','LON','LONI','LONGITUDE']),source:d.name};
 if(validPoint(point))return {...point,crs:isWgs84(d.references?.crs)?'EPSG:4326':''};
 return {...point,x:value(['X','XCOORD','EAST']),y:value(['Y','YCOORD','NORTH']),crs:d.references?.crs};
}
async function reviewLocations(onlyIds){
 const scope=activeProject,project=host.getProject(),ids=onlyIds||wells().filter(id=>!located().some(w=>w.id===id));
 if(!ids.length){host.toast('All visible wells already have confirmed locations. Select a well to edit its location.');return;}
 host.modal('Review well locations','<div id="mw-review-loading" role="status">Reading source header coordinates...</div>');
 const rows=await Promise.all(ids.map(async id=>{try{return {id,...await locationSuggestion(id)};}catch(error){return {id,error:error.message};}}));
 if(!isScope(scope)||!$('#mw-review-loading'))return;
 const hasXY=rows.some(finitePair),known=[...new Set(rows.map(row=>row.crs).filter(Boolean))],suggested=known.length===1&&/^EPSG:[0-9]+$/i.test(known[0])?known[0].toUpperCase():'';
 const cloud=project.storage==='cloud';
 const refs=cloud?`<input name="crs" required maxlength="14" placeholder="EPSG code from your source" value="${esc(suggested)}">`:'<select name="crs" required><option value="">Choose only if known</option><option value="EPSG:4326">WGS84 / EPSG:4326</option></select>';
 host.modal('Review well locations',`<p class="sub">Use the coordinate system documented in your survey, header workbook or Petrel project. Review groups separately if their source systems differ.</p>${hasXY?'<p class="sub">These wells include projected X/Y coordinates. Enter the documented source EPSG code to preview their latitude and longitude.</p>':''}<form id="mw-bulk-locations"><div class="table-wrap"><table class="mw-coordinate-review"><thead><tr><th>Use / well</th><th>Y / latitude</th><th>X / longitude</th></tr></thead><tbody>${rows.map(row=>{
  const xy=finitePair(row),projected=xy&&row.coordinateKind!=='geographic';
  const use=known.length<=1&&!row.error&&(xy||validPoint(row)),y=xy?row.y:row.lat,x=xy?row.x:row.lng;
  const context=[projected?'Projected X/Y':xy||validPoint(row)?'Geographic coordinates':'No coordinate pair found',row.source,row.crs,row.crsEvidence?.sourceName,row.coordinateConflict||row.conflictingCRS?'Coordinate sources disagree':''];
  if(row.geographicCoordinates&&projected)context.push('Alternate latitude / longitude '+row.geographicCoordinates.lat+', '+row.geographicCoordinates.lng);
  return `<tr><td><label><input type="checkbox" name="use" value="${esc(row.id)}" ${use?'checked':''}>${esc(wellName(row.id))}</label><small>${esc(row.error||context.filter(Boolean).join(' / '))}</small></td><td><input name="lat:${esc(row.id)}" type="number" step="any" value="${Number.isFinite(y)?y:''}" aria-label="Y or latitude for ${esc(wellName(row.id))}"></td><td><input name="lng:${esc(row.id)}" type="number" step="any" value="${Number.isFinite(x)?x:''}" aria-label="X or longitude for ${esc(wellName(row.id))}"></td></tr>`;
 }).join('')}</tbody></table></div><label class="field">Confirmed source coordinate reference${refs}</label><label class="layer"><input name="confirmed" type="checkbox" required>I verified the selected coordinate pairs use this reference.</label><label class="layer" id="mw-coordinate-conflict" hidden><input name="conflict" type="checkbox">I reviewed the conflicting evidence and verified which coordinates to use.</label><p id="mw-bulk-error" role="alert"></p><div id="mw-location-preview" aria-live="polite"></div><button class="primary" type="submit">${cloud?'Preview selected locations':'Save and show selected wells'}</button></form>`);
 let preview=null;
 $('#mw-bulk-locations').onsubmit=async event=>{
  event.preventDefault();if(!isScope(scope))return;
  const form=event.currentTarget,values=new FormData(form),chosen=values.getAll('use');
  const crs='EPSG:'+String(values.get('crs')||'').trim().replace(/^EPSG:\s*/i,'');
  const error=$('#mw-bulk-error'),button=form.querySelector('[type=submit]');
  error.textContent='';
  if(!chosen.length||!/^EPSG:[0-9]{3,7}$/.test(crs)||!values.get('confirmed')){error.textContent='Select wells and confirm the documented EPSG code.';return;}
  const points=[];
  for(const id of chosen){
   const y=String(values.get('lat:'+id)||'').trim(),x=String(values.get('lng:'+id)||'').trim();
   if(!x||!y||!Number.isFinite(Number(x))||!Number.isFinite(Number(y))){error.textContent='Enter both coordinates for '+wellName(id)+'.';return;}
   points.push({id,x:Number(x),y:Number(y)});
  }
  const acknowledge=values.has('conflict'),key=JSON.stringify([crs,points,acknowledge]);
  button.disabled=true;
  try{
   let converted;
   if(!cloud&&crs==='EPSG:4326'){
    converted=points.map(p=>({id:p.id,lat:p.y,lng:p.x,sourceCRS:crs}));
    if(converted.some(p=>!validPoint(p)))throw new Error('WGS84 requires longitude and latitude in degrees. Enter the documented projected CRS for eastings and northings.');
   }else if(preview?.key===key){
    converted=preview.points;
   }else{
    const result=await api(`/api/projects/${project.id}/locations/preview`,{method:'POST',body:{crs,points,acknowledge_coordinate_conflict:acknowledge}});
    if(!isScope(scope)||!form.isConnected)return;
    preview={key,points:result.points};
    $('#mw-location-preview').innerHTML='<p><strong>Converted WGS84 positions</strong></p><ul>'+preview.points.map(p=>`<li>${esc(wellName(p.id))}: ${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}${p.conflicts?.length?' · '+esc(p.conflicts.join(' ')):''}</li>`).join('')+'</ul>';
    button.textContent='Save and show selected wells';return;
   }
   const now=new Date().toISOString(),updates=Object.fromEntries(converted.map(p=>{
    const sourceCoordinates=points.find(source=>source.id===p.id),previous=settings().locations?.[p.id];
    const sameSource=previous?.sourceCRS===crs&&previous.sourceCoordinates?.x===sourceCoordinates.x&&previous.sourceCoordinates?.y===sourceCoordinates.y;
    return [p.id,{lat:p.lat,lng:p.lng,confirmed:true,crs:'EPSG:4326',confirmedAt:now,sourceCRS:crs,sourceCoordinates,
     ...(sameSource&&previous.coordinateOperation?{coordinateOperation:previous.coordinateOperation}:{}),
     source:'Reviewed source coordinates',...(p.conflicts?.length?{reviewedCoordinateConflicts:p.conflicts}:{})}];
   }));
   saveSetting('locations',{...settings().locations,...updates});
   await host.flush();$('#dialog').close();focusWell='';zoom=1;draw();
  }catch(failure){
   error.textContent=failure.message;
   if(failure.code==='coordinate_source_conflict')$('#mw-coordinate-conflict').hidden=false;
  }
  finally{button.disabled=false;}
 };
}
const menu=(title,items)=>`<details class="mw-menu"><summary>${title} <span aria-hidden="true">⌄</span></summary><div>${items.map(([id,label,disabled])=>`<button type="button" data-map-command="${id}" ${disabled?'disabled':''}>${label}</button>`).join('')}</div></details>`;
export function mapWorkspaceView(){
 const project=host.getProject(),scope=session.user?.uid+':'+project.id;if(activeProject!==scope){activeProject=scope;selected='';search='';paths=[];pathIssues=[];loadedAt=0;loadedSignature='';loading=false;basemap='grid';zoom=1;focusWell='';pan=[0,0];measure=null;inspector=true;}
 const ids=wells();if(!ids.includes(selected))selected=ids[0]||'';const p=located().find(w=>w.id===selected),deviations=datasets().filter(d=>d.family==='deviation'&&d.well===selected),pending=pendingSurveys(selected);
 return `<section class="map-workspace ${inspector?'':'inspector-collapsed'}"><header class="mw-heading"><div><div class="study-kicker">SPATIAL WORKSPACE</div><h1>Project map</h1><p>${esc(project.name)} · ${located().length}/${ids.length} wells located</p></div><div class="actions">${ids.length>located().length?`<button data-map-command="review-locations" class="primary">Review ${ids.length-located().length} well locations</button>`:''}<button data-map-command="fit">Fit project</button><button id="mw-inspector-toggle" aria-expanded="${inspector}" aria-controls="mw-inspector">${inspector?'Hide':'Show'} inspector</button></div></header><div class="mw-ribbon" aria-label="Map ribbon">${menu('＋ Add',[['review-locations','Review unplaced wells…'],['review-all-locations','Review all well coordinates…',!ids.length],['well','Import well locations…'],['deviation','Deviation data for selected well…',!selected],['spatial','Spatial data…'],['seismic','Seismic data…',!project.workflows?.includes('seismic')]])}${menu('Basemap',[['grid','Field grid'],['roadmap','Google Roadmap'],['satellite','Google Satellite'],['hybrid','Google Hybrid'],['terrain','Google Terrain']])}${menu('View',[['fit','Fit all evidence'],['labels','Show / hide well labels'],['wells','Show / hide wells'],['trajectories','Show / hide deviation'],['inspector','Show / hide inspector'],...(settings().removedWells?.length?[['restore-wells','Removed wells…']]:[])])}${menu('Measure',[['measure-surface','Surface to surface'],['measure-bottom','Survey end to survey end']])}${menu('Style',[['style','Selected well symbol…',!selected]])}${menu('Export',[['export','Field map (SVG)',basemap!=='grid']])}<span class="mw-ribbon-status">${loading?'Loading evidence…':'Project evidence'}</span></div><div class="mw-body"><aside class="mw-contents"><div class="mw-panel-title">Contents <button data-map-command="refresh" aria-label="Refresh map evidence">↻</button></div><label class="mw-search">${host.icon('search')}<input id="mw-search" aria-label="Find a well" placeholder="Find a well…" value="${esc(search)}"></label><h3>BASEMAP</h3><div class="mw-basemap">${basemap==='grid'?'Field grid · EPSG:3857':'Google '+basemap}</div><h3>PROJECT LAYERS</h3><label class="mw-layer"><input id="mw-wells" type="checkbox" ${showWells?'checked':''}>Wells <span>${ids.length}</span></label><label class="mw-layer"><input id="mw-deviation" type="checkbox" ${showDeviation?'checked':''}>Deviation trajectories <span>${paths.length}</span></label><h3>WELLS</h3><div class="mw-well-list">${ids.length?ids.map(id=>`<div class="mw-well-row" ${wellName(id).toLowerCase().includes(search.toLowerCase())||id.toLowerCase().includes(search.toLowerCase())?'':'hidden'}><input type="checkbox" data-map-visible="${esc(id)}" aria-label="Show ${esc(wellName(id))}" ${settings().hiddenWells?.includes(id)?'':'checked'}><button data-map-well="${esc(id)}" aria-pressed="${id===selected}"><img src="${WELL_ICON_URL}" alt="" class="mw-well-svg"><span><strong>${esc(wellName(id))}</strong><small>${esc(locationReason(id))}</small></span></button><button data-map-well-menu="${esc(id)}" aria-label="Actions for ${esc(wellName(id))}" aria-haspopup="menu">⋯</button></div>`).join(''):'<p class="sub">No wells registered. Add well data to begin.</p>'}</div><p class="mw-reference-note">Only confirmed locations and referenced survey trajectories are plotted.</p></aside><div class="mw-map-column">${measure?`<div class="mw-measure-toolbar"><output id="mw-measure-status">${esc(measureText())}</output><button data-map-command="cancel-measure">Exit Measure</button></div>`:''}<div class="mw-canvas" id="mw-canvas"><div class="mw-map-label">${basemap==='grid'?'FIELD GRID · EPSG:3857':'GOOGLE '+basemap.toUpperCase()}</div><div class="mw-north" aria-label="North">↑<small>N</small></div><div id="mw-renderer" aria-label="Project map"></div>${ids.length>located().length?`<div class="mw-unplaced-panel"><strong>${ids.length-located().length} wells waiting for location review</strong><p>Review the retained coordinates and their source coordinate system to place these wells.</p>${!located().length?`<div class="mw-unplaced-wells">${ids.map(id=>`<button data-map-unplaced="${esc(id)}"><img src="${WELL_ICON_URL}" alt="" width="20" height="28"><span>${esc(wellName(id))}</span></button>`).join('')}</div><small>Unplaced wells — these are not map positions.</small>`:''}<button data-map-command="review-locations">Review coordinates from source files</button></div>`:''}<div id="mw-map-feedback" role="status"></div><div class="mw-map-controls"><button data-map-command="zoom-in" aria-label="Zoom in">＋</button><button data-map-command="zoom-out" aria-label="Zoom out">−</button><button data-map-command="fit" aria-label="Fit evidence">⌖</button></div></div><div class="mw-legend"><span><img src="${WELL_ICON_URL}" alt="" width="12" height="17">Wellhead</span><span><i class="mw-line"></i>Deviation trajectory</span><span><i class="mw-end"></i>Survey end</span></div></div><aside class="mw-inspector" id="mw-inspector" ${inspector?'':'hidden'}><div class="mw-panel-title">Inspector<button id="mw-inspector-close" aria-label="Collapse inspector">×</button></div>${selected?`<div class="mw-inspector-well-title"><h2>${esc(wellName(selected))}</h2><button data-map-well-menu="${esc(selected)}" aria-label="Well actions" aria-haspopup="menu">⋯</button></div><p class="sub">Surface well · ${esc(selected)}</p><dl><dt>Location reference</dt><dd>${p?'WGS84 · user confirmed':'Unconfirmed — not plotted'}</dd>${p?`<dt>Latitude / longitude</dt><dd class="mw-coordinates">${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}</dd>`:''}<dt>Deviation evidence</dt><dd>${deviations.length} imported ${deviations.length===1?'dataset':'datasets'}${pending.length?' · '+pending.length+' pending review':''}</dd></dl><label class="field">Active survey<select id="mw-active-survey"><option value="">Choose active survey</option>${datasets().filter(d=>d.family==='deviation'&&d.well===selected).map(d=>`<option value="${esc(d.id)}" ${host.getState().wellDrafts?.find(w=>w.id===selected)?.activeSurveyId===d.id?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label><div class="mw-inspector-actions">${pending.length?'<button data-map-command="pending-surveys">Review pending surveys</button>':''}<button data-map-command="location">${p?'Edit':'Review'} well location</button><button data-map-command="deviation" class="primary">＋ Add deviation data</button><button data-map-command="interpretation">Open in Interpretation</button><button data-map-command="evidence">View well evidence</button></div><div class="mw-style"><h3>APPEARANCE</h3><label class="field">Well symbol<select id="mw-symbol">${['Wellhead','Circle','Square'].map(s=>`<option ${settings().symbols?.[selected]===s?'selected':''}>${s}</option>`).join('')}</select></label><label class="mw-layer"><input id="mw-labels" type="checkbox" ${labels?'checked':''}>Show well names</label></div>`:'<div class="mw-inspector-empty">Select a well to inspect its location and add deviation evidence.</div>'}<div class="mw-path-issues">${pathIssues.map(i=>`<p>${esc(i)}</p>`).join('')}</div></aside></div><footer class="mw-status"><span>${located().length} located wells · ${paths.length} mapped deviation ${paths.length===1?'survey':'surveys'}</span><span>Source positions: WGS84 · Field grid: Web Mercator E/N (km)</span></footer></section>`;
}
export function bindMapWorkspace(){
 if(!$('#mw-canvas'))return;const project=host.getProject();showWells=settings().showWells!==false;showDeviation=settings().showDeviation!==false;labels=settings().labels!==false;
 const toggle=()=>{inspector=!inspector;draw();};$('#mw-inspector-toggle').onclick=toggle;$('#mw-inspector-close')?.addEventListener('click',toggle);
 document.querySelectorAll('[data-map-well]').forEach(b=>{b.onclick=()=>selectMapWell(b.dataset.mapWell);b.oncontextmenu=e=>wellMenu(e,b.dataset.mapWell,b);b.onkeydown=e=>{if(e.key==='ContextMenu'||e.shiftKey&&e.key==='F10')wellMenu(e,b.dataset.mapWell,b);};});
 document.querySelectorAll('[data-map-well-menu]').forEach(b=>b.onclick=e=>wellMenu(e,b.dataset.mapWellMenu,b));
 document.querySelectorAll('[data-map-unplaced]').forEach(b=>{b.onclick=()=>{selected=b.dataset.mapUnplaced;editLocation();};b.oncontextmenu=e=>wellMenu(e,b.dataset.mapUnplaced,b);});
 $('#mw-search').oninput=e=>{search=e.target.value;document.querySelectorAll('[data-map-well]').forEach(b=>b.closest('.mw-well-row').hidden=!(wellName(b.dataset.mapWell)+' '+b.dataset.mapWell).toLowerCase().includes(search.toLowerCase()));};
 $('#mw-wells').onchange=e=>{showWells=e.target.checked;saveSetting('showWells',showWells);renderMap();};$('#mw-deviation').onchange=e=>{showDeviation=e.target.checked;saveSetting('showDeviation',showDeviation);renderMap();};$('#mw-labels')?.addEventListener('change',e=>{labels=e.target.checked;saveSetting('labels',labels);renderMap();});
 document.querySelectorAll('[data-map-visible]').forEach(input=>input.onchange=()=>{const hidden=new Set(settings().hiddenWells||[]);if(input.checked)hidden.delete(input.dataset.mapVisible);else hidden.add(input.dataset.mapVisible);saveSetting('hiddenWells',[...hidden]);renderMap();});
 $('#mw-active-survey')?.addEventListener('change',async e=>{const well=host.getState().wellDrafts?.find(w=>w.id===selected);if(well){well.activeSurveyId=e.target.value;host.save();await readDeviations(project);draw();}});
 $('#mw-symbol')?.addEventListener('change',e=>{saveSetting('symbols',{...settings().symbols,[selected]:e.target.value});renderMap();});
 document.querySelectorAll('[data-map-command]').forEach(b=>b.onclick=()=>{b.closest('details')?.removeAttribute('open');command(b.dataset.mapCommand);});
 const menus=[...document.querySelectorAll('.mw-menu')];menus.forEach(m=>m.ontoggle=()=>{if(m.open)menus.filter(n=>n!==m).forEach(n=>n.open=false);});
 const map=$('.map-workspace');
 if(measure)document.addEventListener('keydown',function exitMeasure(event){
  if(!map.isConnected){document.removeEventListener('keydown',exitMeasure);return;}
  if(event.key==='Escape'&&measure&&!event.defaultPrevented&&!document.querySelector('dialog[open]')){
   document.removeEventListener('keydown',exitMeasure);
   measure=null;draw();$('.mw-menu summary')?.focus();
  }
 });
 renderMap();const signature=datasets().map(d=>d.id+JSON.stringify(d.references||{})).join('|');if(signature!==loadedSignature&&!loading)refresh();else if(project.storage==='cloud'&&Date.now()-loadedAt>30000&&!loading)refresh();else if(!loadedAt&&!loading)refresh();
}
function draw(){closeWellMenu();host.render();}
async function command(action){try{
 if(action==='measure-surface'||action==='measure-bottom'){startMeasure(action==='measure-surface'?'surface':'bottom');return;}
 if(action==='cancel-measure'){measure=null;draw();return;}
 if(action==='interpretation'&&selected){host.openWellWorkspace('interpretation',sourceWell(selected));return;}
 if(action==='review-locations'){await reviewLocations();return;}
 if(action==='review-all-locations'){await reviewLocations(wells());return;}
 if(action==='restore-wells'){restoreWells();return;}
 if(action==='inspector'){inspector=!inspector;draw();return;}
 if(action==='deviation'){if(!selected){host.toast('Select a well before adding deviation data.');return;}await openImporter({family:'deviation',well:selected});return;}
 if(['well','spatial','seismic'].includes(action)){await openImporter({family:{well:'well_headers',spatial:'spatial',seismic:'seismic'}[action]});return;}
 if(action==='location'){await editLocation();return;}
 if(action==='pending-surveys'){const pending=pendingSurveys(selected)[0];if(pending)await reviewImport(pending.importId);return;}
 if(action==='evidence'){host.navigate('files');return;}
 if(action==='refresh'){await refresh();return;}
 if(action==='labels'){labels=!labels;draw();return;}if(action==='wells'){showWells=!showWells;draw();return;}if(action==='trajectories'){showDeviation=!showDeviation;draw();return;}
 if(action==='style'){inspector=true;draw();$('#mw-symbol')?.focus();return;}
 if(['grid','roadmap','satellite','hybrid','terrain'].includes(action)){basemap=action;measure=null;pan=[0,0];draw();return;}
 if(action==='fit'){zoom=1;focusWell='';pan=[0,0];renderMap();return;}if(action==='zoom-in'||action==='zoom-out'){if(basemap!=='grid'&&googleMap){googleMap.setZoom(googleMap.getZoom()+(action==='zoom-in'?1:-1));return;}zoom=Math.max(.2,Math.min(30,zoom*(action==='zoom-in'?1.4:1/1.4)));renderMap();return;}
 if(action==='export'){const svg=$('#mw-renderer svg');if(!svg){host.toast('Select Field grid to export the map.');return;}const copy=svg.cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');const style=document.createElementNS('http://www.w3.org/2000/svg','style');style.textContent='text{font:11px sans-serif;fill:#264b42}.mw-gridline{stroke:#dce6e1;stroke-width:1}.mw-trajectory{stroke:#b47c51;stroke-width:2;fill:none}.mw-point{fill:#fff;stroke:#087c73;stroke-width:1.5}';copy.prepend(style);host.download(host.getProject().name+'-map.svg',new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));}
 }catch(error){host.toast(error.message);}}
async function refresh(){
 const project=host.getProject(),id=project.id,uid=session.user?.uid;loading=true;try{if(project.storage==='cloud')await host.refreshCloudMapLocations();await host.flush();if(project.storage==='cloud'){const data=await loadCloud(project);if(host.getProject()?.id!==id||session.user?.uid!==uid)return;applyImportedEvidence(host.getState(),data);}await readDeviations(project);if(host.getProject()?.id!==id||session.user?.uid!==uid)return;loadedSignature=datasets().map(d=>d.id+JSON.stringify(d.references||{})).join('|');loadedAt=Date.now();}catch(error){if(activeProject===uid+':'+id)host.toast(error.message);}finally{if(activeProject===uid+':'+id){loading=false;if($('#mw-canvas'))draw();}}
}
async function readDeviations(project){
 const result=[],issues=[],uid=session.user?.uid;
 for(const d of datasets().filter(d=>d.family==='deviation')){
  const well=host.getState().wellDrafts?.find(w=>w.id===d.well);
  const surveys=datasets().filter(s=>s.family==='deviation'&&s.well===d.well),active=surveys.find(s=>s.id===well?.activeSurveyId)?.id||(surveys.length===1?d.id:null);if(!active){if(surveys[0]?.id===d.id)issues.push((well?.name||d.well)+': choose the active survey in the inspector.');continue;}if(active!==d.id)continue;
  try{if(d.issues?.some(i=>i.severity==='blocking'))throw new Error('Resolve import validation before map use.');if(!well)throw new Error('Assign the survey to a registered well.');const source=await retainedRows(host,d,50000),points=globalThis.StrataxWellEvidence.trajectory(source.rows,{...d,metadata:source.metadata},well);if(points.length<2)throw new Error('At least two referenced stations are required.');result.push({id:d.id,well:d.well,name:d.name,points});}catch(error){issues.push((well?.name||d.well||d.name)+': '+error.message);}
 }
 if(host.getProject()?.id===project.id&&session.user?.uid===uid){paths=result;pathIssues=issues;}
}
async function editLocation(){
 if(selected&&retainedLocation(selected)&&(host.getProject().storage==='cloud'||!located().some(p=>p.id===selected))){await reviewLocations([selected]);return;}
 if(!selected)return;const owner=session.user?.uid,projectId=host.getProject().id,well=selected,previous=settings().locations?.[well];let suggestion=previous||{};
 if(!previous){const d=datasets().find(d=>d.well===sourceWell(well)&&d.family==='logs');if(d){try{const details=host.getProject().storage==='cloud'?await nativePreview(host.getProject(),d.importId,d.id):d;const headers=details.metadata?.headers||{};const lat=headers.LAT?.value??headers.LATI?.value,lng=headers.LONG?.value??headers.LON?.value??headers.LONI?.value??headers.LONGITUDE?.value;if(lat!==undefined&&lng!==undefined)suggestion={lat:Number(lat),lng:Number(lng)};}catch(error){host.toast(error.message);}}}
 if(session.user?.uid!==owner||host.getProject()?.id!==projectId)return;
 host.modal('Review well location',`<h3>${esc(wellName(well))}</h3><p class="sub">Header values are suggestions. Confirm the source datum before using them. Original source data remains unchanged.</p><form id="mw-location-form"><div class="form-grid"><label class="field">Latitude<input name="lat" type="number" step="any" min="-85" max="85" required value="${Number.isFinite(suggestion.lat)?suggestion.lat:''}"></label><label class="field">Longitude<input name="lng" type="number" step="any" min="-180" max="180" required value="${Number.isFinite(suggestion.lng)?suggestion.lng:''}"></label></div><label class="layer"><input name="confirmed" type="checkbox" required>I have confirmed these coordinates use WGS84 (EPSG:4326).</label><p class="sub">Projected X/Y coordinates need conversion using their known source CRS; do not enter them as latitude/longitude.</p><p id="mw-location-error" role="alert"></p><button class="primary" type="submit">Save confirmed location</button></form>`);
 $('#mw-location-form').onsubmit=async e=>{e.preventDefault();if(session.user?.uid!==owner||host.getProject()?.id!==projectId){host.toast('This project is no longer active.');$('#dialog').close();return;}const form=e.currentTarget,fields=new FormData(form),point={lat:Number(fields.get('lat')),lng:Number(fields.get('lng')),confirmed:true,crs:'EPSG:4326',confirmedAt:new Date().toISOString()};if(!validPoint(point)||!fields.get('confirmed')){$('#mw-location-error').textContent='Enter valid WGS84 coordinates and confirm their reference.';return;}const button=form.querySelector('button');button.disabled=true;try{saveSetting('locations',{...settings().locations,[well]:point});await host.flush();$('#dialog').close();draw();}catch(error){$('#mw-location-error').textContent=error.message;button.disabled=false;}};
}
function renderMap(){
 resizeObserver?.disconnect();const element=$('#mw-renderer');if(!element)return;const generation=++mapGeneration;googleMap=null;
 const points=showWells?located().filter(p=>!settings().hiddenWells?.includes(p.id)):[],lines=showDeviation?paths.filter(p=>wells().includes(p.well)&&!settings().hiddenWells?.includes(p.well)):[],site=host.getProject().coordinates;
 element.classList.toggle('mw-measuring',!!measure);
 if(basemap!=='grid'){element.innerHTML='';mountWorkspaceMap(element,{points,paths:lines,site,basemap,labels,symbols:settings().symbols||{},select:id=>{selected=id;inspector=true;draw();},contextMenu:(id,event)=>wellMenu(event,id),focus:focusWell?points.find(p=>p.id===focusWell):null}).then(map=>{if(generation===mapGeneration)googleMap=map;}).catch(error=>{if(generation===mapGeneration&&element.isConnected)element.textContent=error.message+' Field grid remains available.';});return;}
 const drawGrid=()=>{if(!element.isConnected)return;const width=Math.max(250,element.clientWidth),height=Math.max(360,element.clientHeight);const positions=[...points,...lines.flatMap(p=>p.points),...(validPoint(site)?[site]:[])];const feedback=$('#mw-map-feedback');if(feedback)feedback.textContent=$('.mw-unplaced-panel')?'':!positions.length?(wells().length?'Review well locations to place your wells. No coordinates have been assumed.':'Add a site location or well data to begin.') : '';
  const xy=positions.map(projection),xs=xy.map(p=>p[0]),ys=xy.map(p=>p[1]);let cx=xy.length?(Math.min(...xs)+Math.max(...xs))/2:0,cy=xy.length?(Math.min(...ys)+Math.max(...ys))/2:0;const target=points.find(p=>p.id===focusWell);if(target)[cx,cy]=projection(target);cx+=pan[0];cy+=pan[1];const span=(target?1000:Math.max(xy.length?Math.max(...xs)-Math.min(...xs):0,xy.length?(Math.max(...ys)-Math.min(...ys))*width/height:0,1000))*1.4/zoom,vertical=span*height/width;const px=p=>{const [x,y]=projection(p);return [width/2+(x-cx)/span*(width-90),height/2-(y-cy)/vertical*(height-90)];};
  let grid='';for(let i=1;i<=4;i++){const x=45+(width-90)*i/5,y=45+(height-90)*i/5;grid+=`<path class="mw-gridline" d="M${x} 35V${height-35}M35 ${y}H${width-35}"/>`;if(positions.length)grid+=`<text x="${x}" y="${height-15}" text-anchor="middle">${((cx-span/2+span*i/5)/1000).toFixed(2)}</text><text x="5" y="${y-5}">${((cy+vertical/2-vertical*i/5)/1000).toFixed(2)}</text>`;}
  let geometry=lines.map(line=>`<polyline class="mw-trajectory" data-map-point="${esc(line.well)}" points="${line.points.map(p=>px(p).join(',')).join(' ')}"/><circle class="mw-survey-end" data-map-point="${esc(line.well)}" cx="${px(line.points.at(-1))[0]}" cy="${px(line.points.at(-1))[1]}" r="4"/>`).join('');
  if(validPoint(site)){const [x,y]=px(site);geometry+=`<path d="M${x} ${y-6}l6 6 -6 6 -6 -6Z" fill="#7d9186"/><text x="${x+10}" y="${y+4}">Project site</text>`;}
  for(const point of points){const [x,y]=px(point),symbol=settings().symbols?.[point.id]||'Wellhead';geometry+=`<g data-map-point="${esc(point.id)}" transform="translate(${x},${y})"><title>${esc(wellName(point.id))} · ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}</title><circle r="18" fill="${point.id===selected?'#e2f2ec':'transparent'}"/>${symbol==='Circle'?'<circle class="mw-point" r="5"/>':symbol==='Square'?'<rect class="mw-point" x="-5" y="-5" width="10" height="10"/>':`<image href="${WELL_ICON_URL}" x="-11" y="-18" width="22" height="30"/>`}${labels?`<text x="0" y="-23" text-anchor="middle">${esc(wellName(point.id))}</text>`:''}</g>`;}
  element.innerHTML=`<svg id="mw-field-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Field map of confirmed project geometry"><rect width="${width}" height="${height}" fill="#f6faf8"/>${grid}<g id="mw-map-geometry">${geometry}</g><line id="mw-measure-line" visibility="hidden" />${positions.length?`<path d="M45 ${height-46}h80m-80 -4v8m80 -8v8" stroke="#486b5c"/><text x="45" y="${height-56}">${(span*80/(width-90)/1000).toFixed(2)} km · grid distance</text>`:''}</svg>`;
  const svg=element.querySelector('svg'),line=svg.querySelector('#mw-measure-line');
  const start=measure?.from&&endpointFor(measure.from,measure.basis);
  const end=measure?.to&&endpointFor(measure.to,measure.basis);
  const resting=feedback?.textContent||'';
  const showLine=(a,b)=>{if(!a||!b){line.setAttribute('visibility','hidden');return;}line.setAttribute('x1',a[0]);line.setAttribute('y1',a[1]);line.setAttribute('x2',b[0]);line.setAttribute('y2',b[1]);line.setAttribute('visibility','visible');};
  showLine(start&&px(start),end&&px(end));
  let drag=null;
  svg.onpointerdown=e=>{if(measure||e.button!==0||e.target.closest('[data-map-point]'))return;drag={x:e.clientX,y:e.clientY};svg.setPointerCapture(e.pointerId);};
  svg.onpointermove=e=>{
   if(drag){svg.querySelector('#mw-map-geometry').setAttribute('transform',`translate(${e.clientX-drag.x} ${e.clientY-drag.y})`);return;}
   const id=e.target.closest('[data-map-point]')?.dataset.mapPoint,point=id&&endpointFor(id,measure?.basis||'surface');
   if(feedback)feedback.textContent=id?wellName(id)+(point?' · '+point.lat.toFixed(5)+', '+point.lng.toFixed(5):' · endpoint unavailable'):resting;
   if(!start||end)return;
   const rect=svg.getBoundingClientRect(),x=(e.clientX-rect.left)*width/rect.width,y=(e.clientY-rect.top)*height/rect.height;
   showLine(px(start),point?px(point):[x,y]);
   const status=$('#mw-measure-status');if(status)status.textContent=point&&id!==measure.from?wellName(measure.from)+' to '+wellName(id)+' · '+mapDistance(start,point).toFixed(1)+' m (preview)':measureText();
  };
  svg.onpointerleave=()=>{if(feedback)feedback.textContent=resting;if(!end)showLine(null,null);const status=$('#mw-measure-status');if(status)status.textContent=measureText();};
  svg.onpointerup=e=>{if(!drag)return;pan=[pan[0]-(e.clientX-drag.x)*span/(width-90),pan[1]+(e.clientY-drag.y)*vertical/(height-90)];drag=null;drawGrid();};
  svg.onpointercancel=()=>{drag=null;drawGrid();};
  svg.addEventListener('wheel',e=>{e.preventDefault();const previous=zoom;zoom=Math.max(.2,Math.min(30,zoom*Math.exp(-e.deltaY*.002)));const rect=svg.getBoundingClientRect(),x=(e.clientX-rect.left)*width/rect.width,y=(e.clientY-rect.top)*height/rect.height;pan=[pan[0]+(x-width/2)*span/(width-90)*(1-previous/zoom),pan[1]-(y-height/2)*vertical/(height-90)*(1-previous/zoom)];drawGrid();},{passive:false});
  element.querySelectorAll('[data-map-point]').forEach(g=>{g.onclick=()=>selectMapWell(g.dataset.mapPoint);g.oncontextmenu=e=>wellMenu(e,g.dataset.mapPoint,g);});
 };drawGrid();resizeObserver=new ResizeObserver(drawGrid);resizeObserver.observe(element);
}
