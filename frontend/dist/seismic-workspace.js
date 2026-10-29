import {api,session} from './auth.js';
import * as repository from './project-repository.js';
import {readLocalSection} from './seismic-reader.js';
import {trackSection} from './seismic-tracking.js';
import {seismicState,activeSeismicBook,freshSeismicBook,sectionPoint,addSeismicPick,removeSeismicPick,pickPolyline} from './seismic-model.js';

let host,scope='',generation=0,selectedView=null,picking=false,query='',browser=true,properties=true,refreshing=0;
const cache=new Map(),errors=new Map(),pending=new Set(),undos=new Map(),redos=new Map();
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const board=()=>seismicState(host.getState()),book=()=>activeSeismicBook(host.getState());
const sources=()=>host.getState().ingestion?.datasets?.filter(d=>d.family==='seismic'&&d.active!==false)||[];
const dataset=id=>sources().find(d=>d.id===id);
const view=()=>book().views.find(v=>v.id===selectedView)||book().views[0];
const interpretation=()=>book().interpretations.find(i=>i.id===book().activeInterpretation);
const localVersion=d=>d.sourceVersion||d.sourceSha256||`${d.importId}:${d.id}`;
const viewKey=v=>JSON.stringify([scope,v.datasetId,v.firstTrace,v.traceCount,v.firstSample,v.sampleCount,dataset(v.datasetId)?.sourceVersion||null]);
const sectionFor=v=>v&&cache.get(v.id)?.key===viewKey(v)?cache.get(v.id).section:null;
const storageKey=()=>`${scope}:${book().id}`;
const safe=fn=>async e=>{try{await fn(e);}catch(error){host.toast(error.message);}};

export function configureSeismic(context){host=context;}
function normalize(){
 const next=`${session.user?.uid}:${host.getProject()?.id}`;
 if(next===scope)return;
 scope=next;generation++;selectedView=null;picking=false;query='';cache.clear();errors.clear();pending.clear();undos.clear();redos.clear();
 if(host.getProject()?.storage==='cloud')queueMicrotask(refresh);
}
function edit(label,fn){
 const key=storageKey(),history=undos.get(key)||[];
 history.push({label,state:structuredClone(book())});if(history.length>30)history.shift();undos.set(key,history);redos.set(key,[]);
 book().trackingProposal=null;fn();host.save();host.render();
}
function history(from,to){
 const key=storageKey(),items=from.get(key)||[];if(!items.length)return;
 const previous=items.pop(),destination=to.get(key)||[];destination.push({label:previous.label,state:structuredClone(book())});to.set(key,destination);
 const s=board(),i=s.books.findIndex(b=>b.id===s.activeBook);s.books[i]=previous.state;host.save();host.render();
}
async function refresh(){
 if(refreshing===generation)return;const g=generation,p=host.getProject();refreshing=g;
 try{
  if(p.storage==='cloud'){
   const data=await api(`/api/projects/${encodeURIComponent(p.id)}/imports`);
   if(g!==generation)return;
   host.getState().ingestion={...(host.getState().ingestion||{}),...data};
   const remote=await api(`/api/projects/${encodeURIComponent(p.id)}/seismic`);
   if(g!==generation)return;
   for(const s of remote.sources){const d=dataset(s.id);if(d)d.sourceVersion=s.sourceVersion;}
   const known=new Set(board().books.flatMap(b=>b.interpretations.map(i=>i.id)));
   for(const item of remote.interpretations)if(!known.has(item.id))book().interpretations.push({...item,dirty:false});
   for(const b of board().books)for(const item of remote.interpretations){
    const local=b.interpretations.find(i=>i.id===item.id);
    if(local&&!local.dirty)Object.assign(local,item);
   }
  }
  cache.clear();errors.clear();host.render();
 }catch(error){if(g===generation)host.toast(error.message);}finally{if(refreshing===g)refreshing=0;}
}
function addView(id){
 const ds=dataset(id);if(!ds)throw new Error('Choose an active seismic source.');
 if(book().views.length>=4)throw new Error('Use another workbook or close a section before opening more than four sections.');
 edit('Add seismic source',()=>{const v={id:crypto.randomUUID(),datasetId:id,firstTrace:0,traceCount:Math.min(128,ds.metadata?.traceCount||128),firstSample:0,sampleCount:Math.min(1000,ds.metadata?.sampleCount||1000),gain:1,clip:null,width:650,height:560};book().views.push(v);selectedView=v.id;});
}
async function load(v){
 const g=generation,key=viewKey(v);
 if(pending.has(key))return;
 if(cache.get(v.id)?.key===key)return;
 const ds=dataset(v.datasetId);if(!ds)return;
 pending.add(key);errors.delete(v.id);
 try{
  let section;const p=host.getProject();
  if(p.storage==='cloud'){
   const params=new URLSearchParams({first_trace:v.firstTrace,trace_count:v.traceCount,first_sample:v.firstSample,sample_count:v.sampleCount});
   section=await api(`/api/projects/${encodeURIComponent(p.id)}/seismic/sources/${encodeURIComponent(ds.id)}/section?${params}`);
  }else{
   const original=host.getState().files?.find(f=>f.id===ds.sourceId);
   if(!original)throw new Error('Reconnect the retained original before opening this section.');
   const kind=/\.su$/i.test(original.name)?'su':/\.(sgy|segy)$/i.test(original.name)?'segy':null;
   if(!kind)throw new Error('This direct section reader supports SEG-Y/SU. ZGY/SGZ require the indexed adapter.');
   const full=host.getState().ingestion?.imports?.find(i=>i.id===ds.importId)?.datasets?.find(d=>d.id===ds.id)||ds;
   section=await readLocalSection(await repository.source(p,original),{...v,kind,endian:full.metadata?.endian||'big',headerBytes:full.metadata?.headerBytes||{}});
   section.sourceVersion=localVersion(ds);section.datasetId=ds.id;section.references=ds.references||{};
  }
  if(section.sampleStarts.some(start=>Math.abs(start-section.sampleStarts[0])>section.sampleInterval*1e-9))throw new Error('These traces have different time origins. Select compatible trace groups or a single trace; this section view does not silently align or resample them.');
  if(g!==generation||!book().views.includes(v))return;
  const current=viewKey(v);
  if(current!==key)return;
  cache.set(v.id,{key,section});errors.delete(v.id);
  // Cache is bounded across open windows; source arrays never enter saved project JSON.
  while(cache.size>4){const oldest=cache.keys().next().value;if(oldest===v.id)break;cache.delete(oldest);}
 }catch(error){if(g===generation)errors.set(v.id,{key,message:error.message});}finally{
  pending.delete(key);if(g===generation&&document.querySelector('.sw'))host.render();
 }
}

export function seismicView(){
 normalize();const s=board(),b=book(),v=view(),selected=interpretation();
 return `<section class="sw" aria-label="Seismic interpretation workspace"><header class="sw-heading"><div><div class="study-kicker">SEISMIC INTERPRETATION</div><h1>${esc(host.getProject().name)}</h1><p>${host.getProject().storage==='cloud'?'Private retained sources · independent interpretation versions':'Local sources stay on this device'}</p></div><button id="sw-refresh">${host.icon('clock')} Refresh</button></header>
 <nav class="sw-ribbon" aria-label="Seismic tools">${[['import','Sources','data'],['new-view','Add section','plus'],['new-interpretation','New horizon / fault','layers'],['picking',picking?'Stop picking':'Pick points','pin'],['track','Track section','layers'],['history','Saved versions','clock'],['export','Export','reports'],['browser',browser?'Hide sources':'Show sources','layers'],['properties',properties?'Hide properties':'Show properties','settings']].map(([id,name,icon])=>`<button data-sw-action="${id}" ${id==='picking'?`aria-pressed="${picking}"`:''}>${host.icon(icon)}<span>${name}</span></button>`).join('')}</nav>
 <div class="sw-body ${browser?'':'sw-no-browser'} ${properties?'':'sw-no-properties'}">${browser?`<aside class="sw-browser" aria-label="Seismic sources"><header><strong>Surveys & objects</strong></header><input id="sw-search" aria-label="Find seismic source" placeholder="Find survey…" value="${esc(query)}">${sources().filter(d=>d.name.toLowerCase().includes(query.toLowerCase())).map(d=>`<button class="sw-source" draggable="true" data-sw-source="${esc(d.id)}"><strong>${esc(d.name)}</strong><small>Retained original · ${esc(d.references?.domain||'domain unconfirmed')}</small></button>`).join('')||'<p class="sub">No matching seismic sources. Import and review a survey first.</p>'}<div class="sw-objects"><strong>Interpretations</strong>${b.interpretations.map(i=>`<button data-sw-object="${i.id}" aria-pressed="${i.id===b.activeInterpretation}">${esc(i.label)}<small>${esc(i.kind)} · ${i.points.length} picks${i.dirty?' · draft':''}${i.stale?' · stale source':''}</small></button>`).join('')||'<p class="sub">No horizons or faults picked.</p>'}</div></aside>`:''}
 <div class="sw-workspace" id="sw-dropzone"><nav class="sw-books" aria-label="Seismic workbooks">${s.books.map(w=>`<button data-sw-book="${w.id}" aria-pressed="${w.id===s.activeBook}">${esc(w.name)}</button>`).join('')}<button data-sw-action="new-book" aria-label="New seismic workbook">+</button><button data-sw-action="rename-book">Rename</button></nav>
 <div class="sw-view-tools"><button id="sw-undo" ${!(undos.get(storageKey())||[]).length?'disabled':''}>Undo</button><button id="sw-redo" ${!(redos.get(storageKey())||[]).length?'disabled':''}>Redo</button><label><input id="sw-link" type="checkbox" ${b.linked?'checked':''}> Linked cursors</label></div>
 <div class="sw-windows">${b.views.map(windowView).join('')||`<div class="sw-empty"><h2>Open a retained seismic section</h2><p>Add a survey from the browser or import your seismic originals. Picks retain exact source trace/sample identities.</p><button data-sw-action="import">Import seismic data</button></div>`}</div></div>
 ${properties?`<aside class="sw-properties" aria-label="Seismic properties"><header><strong>${selected?esc(selected.label):'Section properties'}</strong></header>${v?sectionProperties(v):'<p class="sub">Select a source to configure its section.</p>'}${selected?interpretationProperties(selected):''}<p class="sub">Display gain changes appearance only. Source amplitudes, units and datums remain unchanged.</p></aside>`:''}</div>
 <div class="sw-status" role="status" id="sw-cursor">${b.views.length} sections · ${b.interpretations.length} interpretation objects · ${selected?esc(selected.label)+' selected':'No active pick object'} · ${picking?'Picking enabled':'Navigate / inspect'}</div></section>`;
}
function windowView(v){
 const data=sectionFor(v),failure=errors.get(v.id),d=dataset(v.datasetId),i=interpretation();
 const error=!d?'This retained source is no longer active. Restore it or choose another source.':failure?.key===viewKey(v)?failure.message:null;
 return `<article class="sw-window" data-sw-window="${v.id}" style="width:${Math.max(260,Math.min(v.width||650,1600))}px;height:${Math.max(250,Math.min(v.height||560,1200))}px" aria-label="${esc(d?.name||'Unavailable source')} section"><header><strong>${esc(d?.name||'Source no longer active')}</strong><button data-sw-close="${v.id}" aria-label="Close seismic section">×</button></header>${error?`<div class="sw-error" role="alert">${esc(error)}<button data-sw-retry="${v.id}">Retry section</button></div>`:!data?'<div class="sw-message" role="status">Loading retained full-resolution samples…</div>':`<div class="sw-axis"><span>Trace ${data.firstTrace}</span><span>Trace ${data.firstTrace+data.samples.length-1}</span></div><div class="sw-section"><canvas data-sw-canvas="${v.id}" role="img" aria-label="${esc(d?.name)} full-resolution seismic amplitudes"></canvas><svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">${i?.datasetId===v.datasetId?`<polyline points="${pickPolyline(i,v,data)}" fill="none" stroke="${i.kind==='fault'?'#efaa43':'#00be9d'}" stroke-width="4"/>`:''}<line data-sw-crosshair="${v.id}" x1="0" x2="1000" stroke="#d2a454" stroke-width="2" visibility="hidden"/></svg></div><div class="sw-axis"><span>${data.sampleStarts[0].toFixed(4)} s</span><span>${(data.sampleStarts[0]+(data.samples[0].length-1)*data.sampleInterval).toFixed(4)} s · time convention unconfirmed</span></div>`}<footer>${data?`${data.samples.length} × ${data.samples[0].length} retained samples · full resolution · ${esc(data.adapter)}`:'No importer preview substituted'}</footer></article>`;
}
function sectionProperties(v){
 return `<form id="sw-section-form"><p>${esc(dataset(v.datasetId)?.name)}</p>${[['firstTrace','First source trace',v.firstTrace],['traceCount','Trace count',v.traceCount],['firstSample','First source sample',v.firstSample],['sampleCount','Samples per trace',v.sampleCount],['gain','Display gain',v.gain]].map(([key,name,value])=>`<label>${name}<input name="${key}" type="number" ${key==='gain'?'step="0.1" min="0.1" max="100"':'step="1" min="'+(key.endsWith('Count')?'1':'0')+'"'} value="${value}" required></label>`).join('')}<button class="primary">Apply section</button></form>`;
}
function interpretationProperties(i){
 const proposal=book().trackingProposal?.interpretationId===i.id?book().trackingProposal:null;
 return `<hr><label>Interpretation name<input id="sw-object-name" maxlength="120" value="${esc(i.label)}"></label><p class="sub">${esc(i.kind)} · source-bound sample picks${i.dirty?' · unsaved draft':''}</p><button id="sw-save-object">Save interpretation</button>${proposal?`<section aria-label="Tracking proposal"><h3>Review section proposal</h3><p>${proposal.points.length} proposed picks · ${proposal.stops.length} tracking stops. Amber points are proposals; existing picks are preserved.</p><p class="sub">Correlation is a matching score, not geological confidence. Review the events before accepting.</p><button id="sw-accept-tracking" ${proposal.points.length?'':'disabled'}>Accept proposed picks</button><button id="sw-discard-tracking">Discard proposal</button><details><summary>Stop conditions</summary>${proposal.stops.map(s=>`<p>Trace ${s.trace}: ${esc(s.reason)}</p>`).join('')||'<p>Retained section boundary reached.</p>'}</details></section>`:''}<table class="sw-picks"><caption>Pick coordinates</caption><thead><tr><th>Trace</th><th>Sample</th><th>Lock</th><th></th></tr></thead><tbody>${i.points.map((p,n)=>`<tr><td>${p.trace}</td><td><input data-sw-pick-sample="${n}" type="number" step="any" min="0" value="${p.sample}" aria-label="Sample for pick ${n+1}, trace ${p.trace}" ${p.locked?'disabled':''}></td><td><input data-sw-pick-lock="${n}" type="checkbox" aria-label="Lock pick ${n+1}, trace ${p.trace}" ${p.locked?'checked':''}></td><td><button data-sw-pick-remove="${n}" aria-label="Remove pick ${n+1}, trace ${p.trace}" ${p.locked?'disabled':''}>×</button></td></tr>`).join('')}</tbody></table>`;
}
function draw(v){
 const c=$(`[data-sw-canvas="${v.id}"]`),data=sectionFor(v);if(!c||!data)return;
 const width=data.samples.length,height=data.samples[0].length;c.width=width;c.height=height;
 let max=0;for(const row of data.samples)for(const x of row)if(Number.isFinite(x))max=Math.max(max,Math.abs(x));
 const image=new ImageData(width,height),limit=v.clip>0?v.clip:max||1;
 for(let t=0;t<width;t++)for(let s=0;s<height;s++){
  const x=data.samples[t][s],at=(s*width+t)*4;
  if(!Number.isFinite(x)){image.data.set([222,230,229,255],at);continue;}
  const a=Math.max(-1,Math.min(1,x/limit*v.gain)),intensity=Math.round(255*(1-Math.abs(a)));
  image.data.set(a>=0?[255,intensity,intensity,255]:[intensity,intensity,255,255],at);
 }
 c.getContext('2d').putImageData(image,0,0);
 const proposal=book().trackingProposal;
 if(proposal&&proposal.interpretationId===interpretation()?.id&&proposal.sourceVersion===data.sourceVersion&&proposal.datasetId===v.datasetId){
  const overlay=c.parentElement.querySelector('svg');
  for(const p of proposal.points){
   const x=(p.trace-data.firstTrace+.5)/width*1000,y=(p.sample-data.firstSample+.5)/height*1000;
   if(x<0||x>1000||y<0||y>1000)continue;
   const marker=document.createElementNS('http://www.w3.org/2000/svg','circle');
   marker.setAttribute('cx',x);marker.setAttribute('cy',y);marker.setAttribute('r','5');marker.setAttribute('fill','#d89700');overlay.append(marker);
  }
 }
 c.onpointermove=e=>{const r=c.getBoundingClientRect(),point=sectionPoint(data,(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);
  $('#sw-cursor').textContent=`Trace ${point.trace} · sample ${point.sample} · ${point.axis.toFixed(6)} s (time convention unconfirmed) · amplitude ${point.amplitude??'null'} · inline ${point.header.inline} / crossline ${point.header.crossline} · source coordinates ${point.header.x}, ${point.header.y} (CRS unconfirmed)`;
  if(book().linked)for(const other of book().views){
   const d=sectionFor(other),line=$(`[data-sw-crosshair="${other.id}"]`);if(!d||!line)continue;
   if(other.datasetId!==v.datasetId||d.sourceVersion!==data.sourceVersion){line.setAttribute('visibility','hidden');continue;}
   const y=(point.axis-d.sampleStarts[0])/(d.sampleInterval*d.samples[0].length)*1000;line.setAttribute('y1',y);line.setAttribute('y2',y);line.setAttribute('visibility',y>=0&&y<=1000?'visible':'hidden');
  }
 };
 c.onclick=safe(e=>{
  selectedView=v.id;
  if(!picking){host.render();return;}
  const i=interpretation();if(!i)throw new Error('Create or select a horizon/fault before picking.');
  if(i.datasetId!==v.datasetId||i.sourceVersion!==data.sourceVersion)throw new Error('Select the matching interpretation source version before adding picks.');
  const r=c.getBoundingClientRect(),point=sectionPoint(data,(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);
  edit('Pick source sample',()=>addSeismicPick(i,point));
 });
}
function namedDialog(title,initial,complete){
 host.modal(title,`<form id="sw-name-form"><label class="field">Name<input name="name" value="${esc(initial)}" maxlength="120" required></label><button class="primary">Save</button></form>`);
 $('#sw-name-form').onsubmit=safe(async e=>{e.preventDefault();const name=e.target.elements.name.value.trim();if(!name)throw new Error('Enter a name.');await complete(name);$('#dialog').close();host.save();host.render();});
}
function action(name){
 if(name==='import')return host.openImporter({family:'seismic'});
 if(name==='browser'){browser=!browser;host.render();return;}
 if(name==='properties'){properties=!properties;host.render();return;}
 if(name==='picking'){if(!interpretation())throw new Error('Create or select a horizon/fault first.');picking=!picking;host.render();return;}
 if(name==='new-view'){if(!sources().length)return host.openImporter({family:'seismic'});return addView(view()?.datasetId||sources()[0].id);}
 if(name==='new-book')return namedDialog('New seismic workbook','Seismic sections',name=>{const next=freshSeismicBook(name);board().books.push(next);board().activeBook=next.id;selectedView=null;});
 if(name==='rename-book')return namedDialog('Rename seismic workbook',book().name,name=>{book().name=name;});
 if(name==='new-interpretation'){
  const v=view(),data=sectionFor(v);if(!data)throw new Error('Open a retained seismic section before creating an interpretation.');
  host.modal('New interpretation',`<form id="sw-new-object"><label class="field">Name<input name="label" maxlength="120" required></label><label class="field">Type<select name="kind"><option value="horizon">Horizon</option><option value="fault">Fault stick</option></select></label><p>Records manual source trace/sample picks; no geological surface or datum is inferred.</p><button class="primary">Create interpretation</button></form>`);
  $('#sw-new-object').onsubmit=safe(e=>{e.preventDefault();const f=new FormData(e.target),label=f.get('label').trim();if(!label)throw new Error('Enter an interpretation name.');$('#dialog').close();edit('Create interpretation',()=>{const i={id:crypto.randomUUID(),revision:0,datasetId:v.datasetId,sourceVersion:data.sourceVersion,kind:f.get('kind'),label,points:[],notes:'',dirty:true};book().interpretations.push(i);book().activeInterpretation=i.id;picking=true;});});return;
 }
 if(name==='track'){
  const v=view(),data=sectionFor(v),i=interpretation();
  if(!data||!i||i.kind!=='horizon'||i.datasetId!==v.datasetId||i.sourceVersion!==data.sourceVersion)throw new Error('Select a horizon with reviewed seeds in the matching retained section.');
  host.modal('Track retained section',`<form id="sw-track"><label class="field">Event<select name="event"><option value="peak">Peak</option><option value="trough">Trough</option><option value="zero">Zero crossing</option></select></label><label class="field">Search radius (samples)<input name="radius" type="number" min="1" max="32" value="4" required></label><label class="field">Correlation half-window (samples)<input name="window" type="number" min="2" max="32" value="5" required></label><label class="field">Minimum correlation<input name="minimumCorrelation" type="number" min="0" max="1" step=".01" value=".8" required></label><label class="field">Barrier source traces, comma separated<input name="barriers" maxlength="2000" placeholder="For example: 12, 35"></label><p>Track only the currently retained section. Stop at barriers, missing support or weak correlation. Manual and locked seeds are preserved. Review amber proposals before accepting.</p><button class="primary">Calculate proposal</button></form>`);
  $('#sw-track').onsubmit=safe(e=>{e.preventDefault();const f=new FormData(e.target),barriers=f.get('barriers').trim()?f.get('barriers').split(',').map(v=>Number(v.trim())):[];
   if(barriers.some(t=>!Number.isInteger(t)||t<data.firstTrace||t>=data.firstTrace+data.samples.length))throw new Error('Barrier traces must lie inside this retained section.');
   const proposal=trackSection(data,i.points,{event:f.get('event'),radius:Number(f.get('radius')),window:Number(f.get('window')),minimumCorrelation:Number(f.get('minimumCorrelation')),barriers});
   $('#dialog').close();edit('Calculate section tracking proposal',()=>{book().trackingProposal={...proposal,interpretationId:i.id,datasetId:i.datasetId};});
  });return;
 }
 if(name==='history'){
  host.modal('Seismic workbook versions',`<button id="sw-save-version">Save named version</button>${board().versions.filter(v=>v.bookId===book().id).map(v=>`<p><strong>${esc(v.name)}</strong> <button data-sw-restore="${v.id}">Restore view</button></p>`).join('')||'<p>No versions saved.</p>'}`);
  $('#sw-save-version').onclick=()=>namedDialog('Save seismic workbook version','Review version',name=>{if(board().versions.length>=10)throw new Error('Retain at most ten workbook versions in this project.');board().versions.push({id:crypto.randomUUID(),bookId:book().id,name,state:structuredClone(book())});});
  document.querySelectorAll('[data-sw-restore]').forEach(b=>b.onclick=()=>{const version=board().versions.find(v=>v.id===b.dataset.swRestore);$('#dialog').close();edit('Restore workbook version',()=>{board().books[board().books.findIndex(b=>b.id===book().id)]=structuredClone(version.state);});});return;
 }
 if(name==='export'){
  host.modal('Export seismic evidence','<button id="sw-export-picks">Interpretation picks CSV</button><button id="sw-export-section">Retained section CSV</button><button id="sw-export-view">Workbook metadata JSON</button>');
  $('#sw-export-view').onclick=()=>host.download('seismic-workbook.json',new Blob([JSON.stringify(book(),null,2)],{type:'application/json'}));
  const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
  $('#sw-export-picks').onclick=safe(()=>{const i=interpretation();if(!i)throw new Error('Select a horizon or fault to export.');const rows=[['label','kind','datasetId','sourceVersion','trace','sample','locked'],...i.points.map(p=>[i.label,i.kind,i.datasetId,i.sourceVersion,p.trace,p.sample,p.locked])];host.download('seismic-picks.csv',new Blob([rows.map(r=>r.map(csv).join(',')).join('\n')],{type:'text/csv'}));});
  $('#sw-export-section').onclick=safe(()=>{const d=cache.get(view()?.id)?.section;if(!d)throw new Error('Open a retained section first.');const rows=['trace,sample,axis_seconds_time_convention_unconfirmed,amplitude'];d.samples.forEach((row,t)=>row.forEach((a,s)=>rows.push([d.firstTrace+t,d.firstSample+s,d.sampleStarts[t]+s*d.sampleInterval,a??''].join(','))));host.download('seismic-section.csv',new Blob([rows.join('\n')],{type:'text/csv'}));});return;
 }
}

export function bindSeismic(){
 if(!$('.sw'))return;
 $('.sw').onkeydown=e=>{
  if(e.key==='Escape'&&picking){picking=false;host.render();return;}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'&&!e.target.closest('input,textarea,select,[contenteditable]')){
   e.preventDefault();history(e.shiftKey?redos:undos,e.shiftKey?undos:redos);
  }
 };
 for(const v of book().views){
  if(errors.get(v.id)?.key!==viewKey(v))queueMicrotask(()=>load(v));
  draw(v);
  const panel=$(`[data-sw-window="${v.id}"]`);if(panel)panel.onpointerup=()=>{if(panel.offsetWidth>0&&panel.offsetHeight>0){v.width=panel.offsetWidth;v.height=panel.offsetHeight;host.save();}};
 }
 document.querySelectorAll('[data-sw-action]').forEach(b=>b.onclick=safe(()=>action(b.dataset.swAction)));
 document.querySelectorAll('[data-sw-source]').forEach(b=>{b.onclick=safe(()=>addView(b.dataset.swSource));b.ondragstart=e=>e.dataTransfer.setData('application/x-stratax-seismic',b.dataset.swSource);});
 const drop=$('#sw-dropzone');drop.ondragover=e=>e.preventDefault();drop.ondrop=safe(e=>{e.preventDefault();const id=e.dataTransfer.getData('application/x-stratax-seismic');if(!id)throw new Error('Drop a retained seismic source from this browser.');addView(id);});
 document.querySelectorAll('[data-sw-book]').forEach(b=>b.onclick=()=>{board().activeBook=b.dataset.swBook;selectedView=null;picking=false;cache.clear();errors.clear();host.save();host.render();});
 document.querySelectorAll('[data-sw-object]').forEach(b=>b.onclick=()=>{book().activeInterpretation=b.dataset.swObject;host.save();host.render();});
 document.querySelectorAll('[data-sw-close]').forEach(b=>b.onclick=()=>edit('Close seismic section',()=>{book().views=book().views.filter(v=>v.id!==b.dataset.swClose);cache.delete(b.dataset.swClose);}));
 document.querySelectorAll('[data-sw-retry]').forEach(b=>b.onclick=()=>{errors.delete(b.dataset.swRetry);load(book().views.find(v=>v.id===b.dataset.swRetry));});
 $('#sw-undo').onclick=()=>history(undos,redos);$('#sw-redo').onclick=()=>history(redos,undos);
 $('#sw-link').onchange=e=>{book().linked=e.target.checked;host.save();};
 $('#sw-refresh').onclick=refresh;
 if($('#sw-search'))$('#sw-search').oninput=e=>{query=e.target.value;const position=e.target.selectionStart;host.render();const field=$('#sw-search');field.focus();field.setSelectionRange(position,position);};
 if($('#sw-section-form'))$('#sw-section-form').onsubmit=safe(e=>{e.preventDefault();const values=Object.fromEntries([...new FormData(e.target)].map(([k,v])=>[k,Number(v)]));
  if(!['firstTrace','traceCount','firstSample','sampleCount'].every(k=>Number.isInteger(values[k]))||values.firstTrace<0||values.firstSample<0||values.traceCount<1||values.traceCount>512||values.sampleCount<1||values.sampleCount>4096||values.traceCount*values.sampleCount>2000000||!(values.gain>=.1&&values.gain<=100))throw new Error('Choose valid section bounds and display gain.');
  const v=view();edit('Change seismic section',()=>Object.assign(v,values));cache.delete(v.id);errors.delete(v.id);load(v);
 });
 const i=interpretation();if(!i)return;
 if($('#sw-discard-tracking'))$('#sw-discard-tracking').onclick=()=>edit('Discard tracking proposal',()=>{});
 if($('#sw-accept-tracking'))$('#sw-accept-tracking').onclick=safe(()=>{
  const proposal=book().trackingProposal,ds=dataset(i.datasetId);
  if(!proposal||proposal.sourceVersion!==localVersion(ds)||proposal.interpretationId!==i.id)throw new Error('Reload the source and calculate a current tracking proposal.');
  if(i.points.length+proposal.points.length>500)throw new Error('This proposal exceeds 500 section picks. Track a smaller range.');
  edit('Accept reviewed tracking picks',()=>{
   for(const p of proposal.points)if(!i.points.some(old=>old.trace===p.trace))addSeismicPick(i,p);
   i.assistance={method:proposal.method,sourceVersion:proposal.sourceVersion,settings:proposal.settings,seeds:proposal.seeds,bounds:proposal.bounds,acceptedPicks:proposal.points.length,acceptedAt:new Date().toISOString()};
  });
 });
 $('#sw-object-name').onchange=e=>{const label=e.target.value.trim();if(label)edit('Rename interpretation',()=>{i.label=label;i.dirty=true;});};
 document.querySelectorAll('[data-sw-pick-lock]').forEach(b=>b.onchange=()=>edit('Lock pick',()=>{i.points[Number(b.dataset.swPickLock)].locked=b.checked;i.dirty=true;}));
 document.querySelectorAll('[data-sw-pick-remove]').forEach(b=>b.onclick=safe(()=>edit('Remove pick',()=>removeSeismicPick(i,Number(b.dataset.swPickRemove)))));
 document.querySelectorAll('[data-sw-pick-sample]').forEach(b=>b.onchange=safe(()=>{const sample=Number(b.value),data=cache.get(view()?.id)?.section;if(!data||i.datasetId!==view().datasetId||i.sourceVersion!==data.sourceVersion)throw new Error('Open the matching retained source before editing sample coordinates.');if(!Number.isFinite(sample)||sample<0||sample>data.samplesPerTrace-1)throw new Error('Enter a sample inside the retained source bounds.');edit('Move pick',()=>addSeismicPick(i,{trace:i.points[Number(b.dataset.swPickSample)].trace,sample},{index:Number(b.dataset.swPickSample)}));}));
 $('#sw-save-object').onclick=safe(async()=>{
  if(host.getProject().storage==='cloud'){
   const body=Object.fromEntries(['revision','datasetId','sourceVersion','kind','label','points','notes','assistance'].filter(k=>i[k]!==undefined).map(k=>[k,i[k]]));
   const g=generation,result=await api(`/api/projects/${host.getProject().id}/seismic/interpretations/${i.id}`,{method:'PUT',body});
   if(g!==generation)return;Object.assign(i,result);
  }
  i.dirty=false;host.save();host.render();host.toast('Interpretation saved. Original samples remain unchanged.');
 });
}
