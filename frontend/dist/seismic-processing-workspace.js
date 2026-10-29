import {api,session} from './auth.js';
import {jobsView,bindJobs} from './seismic-processing-jobs.js';
import {openCloudCopy} from './workspace-cloud-copy.js';
import {openGeometryReview} from './seismic-geometry-review.js';
import {seismicIcon,ribbonGroup,bindRibbon,parameterLabel} from './seismic-ui.js';
import {processingToolReady,unfinishedText,unavailableAttributes} from './seismic-ui-availability.js';
let host,scope='',generation=0,remoteVersion=new Map(),busy=false,notice='';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const operators={
 detrend:{name:'Remove mean / trend',group:'Trace editing',parameters:{mode:'linear'}},
 mute:{name:'Top / bottom mute',group:'Trace editing',parameters:{top:0.1,bottom:null,taper:0.02}},
 'amplitude-balance':{name:'Amplitude balance',group:'Trace editing',parameters:{window:null}},
 'spike-decon':{name:'Spiking deconvolution',group:'Signal processing',parameters:{operatorLength:32,noiseFloor:0.001}},
 bandpass:{name:'Bandpass filter',group:'Signal processing',parameters:{low:5,high:60,order:4}},
 resample:{name:'Anti-aliased resampling',group:'Signal processing',parameters:{up:1,down:2}},
 'fk-filter':{name:'FK velocity filter',group:'Signal processing',parameters:{spacing:25,minimumVelocity:1500}},
 'sweep-correlate':{name:'Supplied-sweep correlation',group:'Land corrections',parameters:{sweep:[]}},
 'static-shift':{name:'Apply reviewed statics',group:'Land corrections',parameters:{shifts:[]}},
 'residual-statics':{name:'Residual statics (cross-correlate)',group:'Land corrections',parameters:{maxLagSamples:16}},
 dmo:{name:'Elliptic DMO after NMO',group:'Land imaging',parameters:{offsets:[],midpointSpacing:25,velocity:2000,nmoConfirmed:false}},
 'phase-shift-migration':{name:'Poststack Kirchhoff (constant velocity)',group:'Land imaging',parameters:{velocity:2000,traceSpacing:25}},
 nmo:{name:'NMO & stretch mute',group:'Velocity & stacking',parameters:{offsets:[],velocity:2000,maxStretch:.3}},
 stack:{name:'Weighted stack',group:'Velocity & stacking',parameters:{weights:null}},
 designature:{name:'Source-signature designature',group:'Marine conditioning',parameters:{signature:[],noiseFloor:0.01}},
 deghost:{name:'Simple deghost',group:'Marine conditioning',parameters:{ghostDelaySeconds:0.04,reflectionCoeff:-1}},
 'receiver-deghost':{name:'Receiver-side deghost',group:'Marine conditioning',parameters:{ghostDelaySeconds:0.04,reflectionCoeff:-1}},
 debubble:{name:'Debubble',group:'Marine conditioning',parameters:{bubblePeriodSeconds:0.08,damp:0.6}},
 'swell-noise':{name:'Swell-noise attenuation',group:'Marine conditioning',parameters:{timeHighpassHz:2,spaceHighpass:0.05}},
 'parabolic-radon':{name:'Parabolic Radon demultiple',group:'Marine conditioning',parameters:{offsets:[],pMin:0,pMax:2e-7,pCount:64,multiplePCut:5e-8,mutePrimary:true}},
 'srme-subtract':{name:'SRME subtract (supplied model)',group:'Marine conditioning',parameters:{multiples:[],scale:1}},
 'kirchhoff-pstm':{name:'Kirchhoff PSTM',group:'Marine imaging',parameters:{offsets:[],midpointSpacing:25,velocity:1500,velocityTimes:null,velocityValues:null}},
 'kirchhoff-psdm':{name:'Kirchhoff depth migration (constant velocity)',group:'Marine imaging',parameters:{offsets:[],midpointSpacing:25,velocity:1500}},
 'rmo-scan':{name:'Residual moveout scan',group:'Marine imaging',parameters:{offsets:[],velocities:[1500,1600,1700,1800],window:11,maxStretch:0.3}}
};
const sources=()=>host.getState().ingestion?.datasets?.filter(d=>d.family==='seismic'&&d.active!==false)||[];
const state=()=>{const w=host.getState();w.seismicProcessing||={schemaVersion:1,books:[],activeBook:null};const s=w.seismicProcessing;if(s.books.length&&!s.books.some(b=>b.id===s.activeBook))s.activeBook=s.books[0].id;return s;};
const current=()=>state().books.find(b=>b.id===state().activeBook)||state().books[0];
const ui=()=>state().ui||=( {browser:true,properties:true,query:''} );
const scopeCurrent=g=>g===generation&&scope===`${session.user?.uid}:${host.getProject()?.id}`;
const safe=fn=>async e=>{try{await fn(e);}catch(error){host.toast(error.message);}};
const changed=()=>{const b=current();if(b){b.dirty=true;b.validation=null;b.estimate=null;}host.save();host.render();};
export function configureProcessing(context){host=context;}
function normalize(){const next=`${session.user?.uid}:${host.getProject()?.id}`;if(next===scope)return;scope=next;generation++;remoteVersion=new Map();busy=false;notice='';if(host.getProject().storage==='cloud')queueMicrotask(refresh);}
async function refresh(){
 const g=generation,p=host.getProject();if(busy)return;busy=true;
 try{if(p.storage==='cloud'){
  const data=await api(`/api/projects/${p.id}/imports`);if(!scopeCurrent(g))return;host.getState().ingestion={...(host.getState().ingestion||{}),...data};
  const resources=await api(`/api/projects/${p.id}/seismic`);if(!scopeCurrent(g))return;remoteVersion=new Map(resources.sources.map(d=>[d.id,d.sourceVersion]));
  const saved=await api(`/api/projects/${p.id}/seismic/graphs`);if(!scopeCurrent(g))return;
  for(const r of saved.graphs){const local=state().books.find(b=>b.id===r.id);if(!local)state().books.push({id:r.id,name:'Processing graph',graph:r.graph,selected:r.graph.output,dirty:false});else if(!local.dirty)local.graph=r.graph;}
  const history=await api(`/api/projects/${p.id}/seismic/runs`);if(!scopeCurrent(g))return;
  for(const b of state().books){const runs=history.runs.filter(r=>r.estimate?.graphId===b.id);b.run=runs.find(r=>r.id===b.run?.id)||runs[0]||b.run;}
 }host.render();}catch(error){if(scopeCurrent(g))host.toast(error.message);}finally{if(scopeCurrent(g))busy=false;}
}
function newBook(did){
 const d=sources().find(s=>s.id===did);if(!d)throw new Error('Select an active seismic source.');
 const m=d.metadata||{},variable=[m.sampleCountRange,m.sampleIntervalRange,m.sampleOriginRange].some(r=>Array.isArray(r)&&r[0]!==r[1]);
 const id=crypto.randomUUID(),b={id,name:d.name+' processing',dirty:true,selected:null,graph:{revision:0,sourceId:d.id,sourceVersion:remoteVersion.get(d.id)||d.sourceVersion||d.sourceSha256||`${d.importId}:${d.id}`,domain:'TWT',domainConfirmed:false,amplitudeUnit:'',nodes:[],output:'',notes:''},selection:{firstTrace:0,traceCount:Math.min(variable?1:128,m.traceCount||128),firstSample:0,sampleCount:Math.min(1000,m.sampleCountRange?.[0]||m.sampleCount||1000)}};
 state().books.push(b);state().activeBook=id;changed();
}
function addStep(operator){if(!processingToolReady(operator))throw new Error(unfinishedText);const b=current();if(!b)throw new Error('Add a seismic source first.');const node={id:crypto.randomUUID(),operator,input:b.graph.output||'source',parameters:structuredClone(operators[operator].parameters)};b.graph.nodes.push(node);b.graph.output=node.id;b.selected=node.id;changed();}
function graphCanvas(b){
 if(!b)return `<div class="sw-empty"><span class="sw-empty-symbol">${seismicIcon('graph')}</span><span class="sw-eyebrow">PROCESSING GRAPH</span><h2>Start with your seismic survey</h2><p>Select a survey from the source browser, then add the processing steps your data needs.</p><button class="primary" id="sp-import">${host.icon('plus')}Import seismic data</button><small>Already processed? Open your survey in Interpretation.</small></div>`;
 const n=b.graph.nodes,source=sources().find(d=>d.id===b.graph.sourceId);
 return `<div class="sp-canvas" id="sp-graph-drop" aria-label="Processing graph"><div class="sp-source-node"><span class="sw-node-icon">${host.icon('data')}</span><div><small>SOURCE</small><strong>${esc(source?.name||b.graph.sourceId)}</strong><span>${b.graph.domainConfirmed?esc(b.graph.domain)+' · '+esc(b.graph.amplitudeUnit):'Review domain and amplitude units'}</span></div><span class="sw-tag">Original</span></div>${n.map((s,index)=>{const input=s.input==='source'?'Source':`${b.graph.nodes.findIndex(x=>x.id===s.input)+1}. ${operators[b.graph.nodes.find(x=>x.id===s.input)?.operator]?.name||s.input}`;return `<div class="sp-connector" aria-hidden="true"></div><button class="sp-graph-node ${b.selected===s.id?'is-selected':''}" data-sp-node="${s.id}" aria-pressed="${b.selected===s.id}"><span class="sp-step-number">${String(index+1).padStart(2,'0')}</span><span class="sp-node-copy"><strong>${esc(operators[s.operator]?.name||s.operator)}</strong><small>From ${esc(input)}</small></span>${!processingToolReady(s.operator)?'<span class="sw-tag sw-tag-unfinished">Unfinished</span>':b.graph.output===s.id?'<span class="sw-tag">Output</span>':host.icon('chevron')}</button>`;}).join('')}${n.length?'':`<div class="sp-connector" aria-hidden="true"></div><div class="sp-add-step-note">${host.icon('plus')}Choose a tool from the ribbon to add your first step.</div>`}<div class="sp-flow-end"><span></span>${n.length} processing ${n.length===1?'step':'steps'} · ${b.dirty?'Draft changes':'Saved graph'}</div></div>`;
}
function parameterField(key,value){
 const label=esc(parameterLabel(key));
 if(typeof value==='boolean')return `<label class="sw-check"><input name="${key}" type="checkbox" ${value?'checked':''}>${label}</label>`;
 if(Array.isArray(value)||value===null)return `<label>${label}<textarea name="${key}" rows="2" spellcheck="false">${esc(JSON.stringify(value))}</textarea></label>`;
 return `<label>${label}<input ${typeof value==='number'?'type="number" step="any"':''} name="${key}" value="${esc(value)}" required></label>`;
}
function properties(b){
 if(!b)return `<div class="sw-inspector-empty">${host.icon('settings')}<h3>Properties</h3><p>Select a survey or processing step to see its settings here.</p></div>`;
 const n=b.graph.nodes.find(n=>n.id===b.selected);
 return `<header><strong>Properties</strong><span class="sw-tag">${n?'Step '+(b.graph.nodes.indexOf(n)+1):'Source'}</span></header>${n?`<form id="sp-step"><div class="sw-inspector-title">${seismicIcon('wave')}<h3>${esc(operators[n.operator]?.name||n.operator)}</h3></div><label>Input step<select name="input"><option value="source" ${n.input==='source'?'selected':''}>Retained original</option>${b.graph.nodes.filter(x=>x.id!==n.id).map(x=>`<option value="${x.id}" ${n.input===x.id?'selected':''}>${b.graph.nodes.indexOf(x)+1}. ${esc(operators[x.operator]?.name||x.operator)}</option>`).join('')}</select></label>${Object.entries(n.parameters).map(([k,v])=>parameterField(k,v)).join('')}<button class="primary sw-full">Apply step settings</button><div class="sw-inspector-actions"><button type="button" id="sp-output">Use as output</button><button type="button" id="sp-remove" class="sw-danger">Remove</button></div></form>`:'<p class="sw-help">Select a graph step to configure its parameters.</p>'}<details class="sw-inspector-section" ${n?'':'open'}><summary>Source & workbook</summary><form id="sp-source"><label>Workbook name<input name="name" maxlength="120" value="${esc(b.name)}" required></label><label>Source domain<select name="domain"><option value="TWT" ${b.graph.domain==='TWT'?'selected':''}>Two-way time · seconds</option><option value="depth" ${b.graph.domain==='depth'?'selected':''}>Depth · metres</option></select></label><label>Amplitude unit / meaning<input name="amplitudeUnit" maxlength="80" value="${esc(b.graph.amplitudeUnit)}" required></label><label class="sw-check"><input name="domainConfirmed" type="checkbox" ${b.graph.domainConfirmed?'checked':''}>Domain and amplitude meaning reviewed</label><button class="sw-full">Apply source settings</button></form></details><details class="sw-inspector-section"><summary>Source provenance</summary><dl class="sw-meta"><dt>Dataset</dt><dd>${esc(b.graph.sourceId)}</dd><dt>Version</dt><dd>${esc(b.graph.sourceVersion)}</dd></dl></details>`;
}
export function processingView(){
 normalize();const s=state(),b=current(),groups=[...new Set(Object.values(operators).map(o=>o.group))];
 const layout=ui(),icons=['wave','spectrum','target','graph','velocity','wave','cube'];
 const sourceButtons=`<button id="sp-sources">${host.icon('plus')}<span>Import</span></button><button id="sp-geometry" disabled title="Implementation incomplete. Full geometry review is not available yet.">${host.icon('map')}<span>Geometry</span></button>`;
 const menus=groups.map((g,index)=>`<details class="sp-menu"><summary>${seismicIcon(icons[index])}<span>${esc(g)}</span>${host.icon('down')}</summary><div><strong>${esc(g)}</strong>${Object.entries(operators).filter(([,o])=>o.group===g).map(([id,o])=>`<button data-sp-add="${id}" ${unavailableAttributes(processingToolReady(id))} ${!b?'disabled':''}>${seismicIcon('wave')}<span>${esc(o.name)}</span>${processingToolReady(id)?host.icon('plus'):'<small>Unfinished</small>'}</button>`).join('')}</div></details>`).join('');
 return `<section class="sw sp" aria-label="Seismic processing workspace"><header class="sw-heading"><div><div class="study-kicker">SEISMIC PROCESSING</div><h1>${esc(host.getProject().name)}</h1><p>Build a processing flow. Review each result before accepting it.</p></div><div class="sw-heading-actions"><button id="sp-refresh">${host.icon('clock')}Refresh</button>${host.getProject().storage!=='cloud'?'<button id="sp-cloud-copy">Create Cloud copy…</button>':''}</div></header><nav class="sw-ribbon" aria-label="Seismic processing tools">${ribbonGroup('Sources',sourceButtons)}${ribbonGroup('Processing',menus)}${ribbonGroup('Review & save',`<button id="sp-validate" ${!b?'disabled':''}>${host.icon('shield')}<span>Validate</span></button><button id="sp-save" ${!b?'disabled':''}>${host.icon('check')}<span>Save graph</span></button><button id="sp-export" ${!b?'disabled':''}>${host.icon('download')}<span>Recipe</span></button>`)}<div class="sw-ribbon-end"><button id="sp-toggle-browser" aria-label="${layout.browser?'Hide':'Show'} source browser" aria-pressed="${layout.browser}">${host.icon('layers')}</button><button id="sp-toggle-properties" aria-label="${layout.properties?'Hide':'Show'} properties" aria-pressed="${layout.properties}">${host.icon('settings')}</button></div></nav><div class="sw-body ${layout.browser?'':'sw-no-browser'} ${layout.properties?'':'sw-no-properties'}">${layout.browser?`<aside class="sw-browser" aria-label="Processing sources"><header><strong>Surveys & inputs</strong><span class="sw-count">${sources().length}</span></header><label class="sw-source-search">${host.icon('search')}<input id="sp-search" type="search" aria-label="Find seismic survey" placeholder="Find a survey…" value="${esc(layout.query)}"></label><div class="sw-browser-section-title">PROJECT SURVEYS</div>${sources().filter(d=>d.name.toLowerCase().includes(layout.query.toLowerCase())).map(d=>`<button class="sw-source ${d.id===b?.graph.sourceId?'is-selected':''}" draggable="true" data-sp-source="${esc(d.id)}">${host.icon('layers')}<span><strong>${esc(d.name)}</strong><small>${d.id===b?.graph.sourceId?'Current source':'Retained seismic source'}</small></span>${host.icon('plus')}</button>`).join('')||'<div class="sw-browser-empty"><p>No matching surveys.</p><small>Import seismic data or change your search.</small></div>'}<div class="sw-browser-foot">Select or drag a survey to create a processing workbook.</div></aside>`:''}<div class="sw-workspace"><nav class="sw-books" aria-label="Processing workbooks">${s.books.map(w=>`<button data-sp-book="${w.id}" aria-pressed="${w.id===b?.id}">${seismicIcon('graph')}${esc(w.name)}${w.dirty?'<span class="sw-draft-dot" aria-label="Unsaved draft"></span>':''}</button>`).join('')}<button id="sp-new-book" class="sw-new-book" aria-label="New processing workbook">${host.icon('plus')}</button></nav><div class="sw-canvas-toolbar"><span>${b?esc(b.name):'Processing canvas'}</span><span class="sw-tag">${b?.graph.domainConfirmed?esc(b.graph.domain):'Source review required'}</span></div>${graphCanvas(b)}${jobsView(b)}</div>${layout.properties?`<aside class="sw-properties" aria-label="Processing properties">${properties(b)}</aside>`:''}</div><div class="sw-status" role="status"><span class="sw-status-indicator"></span>${esc(notice||b?.validation?.message||'Select a source, configure your flow, then validate and save.')}<span class="sw-status-end">${b?.dirty?'Draft changes':b?'Graph saved':'No active graph'}</span></div></section>`;
}
export function bindProcessing(){
 if(!$('.sp'))return;const b=current();
 bindRibbon($('.sp .sw-ribbon'));
 for(const key of ['browser','properties'])$(`#sp-toggle-${key}`).onclick=()=>{ui()[key]=!ui()[key];host.save();host.render();};
 if($('#sp-search'))$('#sp-search').oninput=e=>{ui().query=e.target.value;const at=e.target.selectionStart;host.render();const field=$('#sp-search');field.focus();field.setSelectionRange(at,at);};
 $('#sp-new-book').onclick=safe(()=>sources().length?newBook(sources().find(d=>d.id===b?.graph.sourceId)?.id||sources()[0].id):host.openImporter({family:'seismic'}));
 bindJobs(host,b,changed);
 let geometryButton=$('#sp-geometry');if(!geometryButton){geometryButton=document.createElement('button');geometryButton.type='button';geometryButton.id='sp-geometry';geometryButton.textContent='Review header geometry';$('.sp .sw-ribbon').insertBefore(geometryButton,$('#sp-sources').nextSibling);}geometryButton.onclick=safe(()=>openGeometryReview(host,b));
 if($('#sp-cloud-copy'))$('#sp-cloud-copy').onclick=()=>openCloudCopy(host,'processing');
 $('#sp-refresh').onclick=refresh;$('#sp-sources').onclick=()=>host.openImporter({family:'seismic'});if($('#sp-import'))$('#sp-import').onclick=$('#sp-sources').onclick;
 document.querySelectorAll('[data-sp-source]').forEach(e=>{e.onclick=safe(()=>newBook(e.dataset.spSource));e.ondragstart=event=>event.dataTransfer.setData('application/x-stratax-processing-source',e.dataset.spSource);});
 const drop=$('.sp .sw-workspace');drop.ondragover=e=>e.preventDefault();drop.ondrop=safe(e=>{e.preventDefault();const id=e.dataTransfer.getData('application/x-stratax-processing-source');if(!id)throw new Error('Drag a survey from the source browser.');newBook(id);});
 document.querySelectorAll('[data-sp-add]').forEach(e=>e.onclick=safe(()=>addStep(e.dataset.spAdd)));
 document.querySelectorAll('[data-sp-book]').forEach(e=>e.onclick=()=>{state().activeBook=e.dataset.spBook;notice='';host.save();host.render();});
 document.querySelectorAll('[data-sp-node]').forEach(e=>{e.onclick=()=>{b.selected=e.dataset.spNode;ui().properties=true;host.save();host.render();};e.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();e.onclick();}};});
 if($('#sp-source'))$('#sp-source').onsubmit=safe(e=>{e.preventDefault();const f=new FormData(e.target);b.name=f.get('name').trim();b.graph.domain=f.get('domain');b.graph.domainConfirmed=f.has('domainConfirmed');b.graph.amplitudeUnit=f.get('amplitudeUnit').trim();changed();});
 if($('#sp-step')){
  $('#sp-step').onsubmit=safe(e=>{e.preventDefault();const n=b.graph.nodes.find(n=>n.id===b.selected),f=new FormData(e.target),p={};for(const [k,v] of Object.entries(n.parameters))p[k]=typeof v==='boolean'?f.has(k):typeof v==='number'?Number(f.get(k)):typeof v==='string'?f.get(k):JSON.parse(f.get(k));n.input=f.get('input');n.parameters=p;changed();});
  $('#sp-output').onclick=()=>{b.graph.output=b.selected;changed();};$('#sp-remove').onclick=safe(()=>{if(b.graph.nodes.some(n=>n.input===b.selected))throw new Error('Reconnect downstream steps before removing this input.');b.graph.nodes=b.graph.nodes.filter(n=>n.id!==b.selected);if(b.graph.output===b.selected)b.graph.output=b.graph.nodes.at(-1)?.id||'';b.selected=b.graph.output||null;changed();});
 }
 $('#sp-validate').onclick=safe(async()=>{if(!b)throw new Error('Choose a source and add a processing step.');if(host.getProject().storage!=='cloud')throw new Error('Create an explicit Cloud copy before server validation. Local source contents have not been uploaded.');const g=generation,result=await api(`/api/projects/${host.getProject().id}/seismic/graphs/validate`,{method:'POST',body:b.graph});if(!scopeCurrent(g))return;b.validation=result;host.save();host.render();});
 $('#sp-save').onclick=safe(async()=>{if(!b)throw new Error('Choose a seismic source first.');if(host.getProject().storage==='cloud'){const g=generation,r=await api(`/api/projects/${host.getProject().id}/seismic/graphs/${b.id}`,{method:'PUT',body:b.graph});if(!scopeCurrent(g))return;b.graph=r.graph;}b.dirty=false;host.save();host.render();host.toast('Processing graph saved.');});
 $('#sp-export').onclick=safe(()=>{if(!b)throw new Error('Choose a processing workbook first.');host.download('seismic-processing-recipe.json',new Blob([JSON.stringify({name:b.name,graph:b.graph,selection:b.selection},null,2)],{type:'application/json'}));});
}
