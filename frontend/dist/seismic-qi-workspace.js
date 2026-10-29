import {api,session} from './auth.js';
import {openCloudCopy} from './workspace-cloud-copy.js';
import {seismicIcon,ribbonGroup,bindRibbon} from './seismic-ui.js';
import {engineFields,resultSummary,readEnginePayload,prepareEnginePayload,selectOperation} from './seismic-engine-controls.js';
import {engineToolReady,unfinishedText,unavailableAttributes} from './seismic-ui-availability.js';

let host,scope='',generation=0,notice='',busy=false,result=null,pollTimer,sourceQuery='';
const transient=new Map();
const loadedSources=new Map();
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state=()=>{const w=host.getState();w.seismicQi||={schemaVersion:2,books:[],active:null};const q=w.seismicQi;if(!q.books){q.books=[{id:crypto.randomUUID(),name:'Retained engine settings',tool:q.tool||'slice',payload:q.payload||'{}',sources:[]}];q.active=q.books[0].id;q.schemaVersion=2;}if(!q.books.length){q.books.push({id:crypto.randomUUID(),name:'Seismic workbook',tool:'slice',payload:'{}',sources:[]});q.active=q.books[0].id;}return q.books.find(b=>b.id===q.active)||q.books[0];};
const scopeCurrent=g=>g===generation&&scope===`${session.user?.uid}:${host.getProject()?.id}`;
const safe=fn=>async e=>{try{await fn(e);}catch(error){host.toast(error.message);}};

const tools={
 tie:{label:'Well ties',path:'tie',hint:'Wavelet extract, bulk shift, stretch/squeeze, mistie table'},
 velocity:{label:'Velocity',path:'velocity',hint:'Dix convert, time–depth, thickness maps'},
 attributes:{label:'Attributes',path:'attributes',hint:'Envelope/phase/frequency, coherence, dip, spectral'},
 qi:{label:'AVO / inversion',path:'qi',hint:'Shuey AVO, poststack inversion, source estimation'},
 surfaces:{label:'Surfaces',path:'surfaces',hint:'Horizon grids and fault triangle strips'},
 models:{label:'Models',path:'models',hint:'Property grids, well blocking, export checks'},
 '4d':{label:'4D',path:'4d',hint:'Associate vintages, match and difference'},
 slice:{label:'Slices',path:'slice',hint:'Inline / crossline / time / linked triad'},
 'index-manifest':{label:'Cloud index',path:'index-manifest',hint:'Build resumable analytical partitions and display levels'},
 imaging:{label:'Kirchhoff',path:'imaging',hint:'2D/3D kinematic modelling and migration with reviewed geometry/aperture'},
 marine:{label:'SRME prediction',path:'marine',hint:'First-order surface prediction on a reviewed collocated grid'},
 geostatistics:{label:'Geostatistics',path:'geostatistics',hint:'Variograms, local kriging, Gaussian/indicator simulations'},
 'travel-times':{label:'Travel times',path:'travel-times',hint:'2D/3D interval-velocity fast marching on declared grid nodes'},
 regularise:{label:'Regularisation',path:'regularise',hint:'Reviewed acquisition coordinates, scales and target support'},
 statics:{label:'Surface statics',path:'statics',hint:'Source/receiver timing residual inversion and bounded correction proposals'},
 acoustic:{label:'Acoustic RTM / FWI',path:'acoustic',hint:'Reviewed acquisition/model configuration; CPU shot jobs with bounded resources'}
};

const examples={
 tie:`{\n  "operation": "bulk-shift",\n  "seismic": [0, 0.2, 0.8, 0.2, 0],\n  "synthetic": [0, 0, 0.2, 0.8, 0.2],\n  "maxLagSamples": 2\n}`,
 velocity:`{\n  "operation": "convert",\n  "times": [0, 0.5, 1.0],\n  "values": [2000, 2200, 2500],\n  "fromType": "rms",\n  "toType": "interval"\n}`,
 attributes:`{\n  "kind": "basic",\n  "dt": 0.004,\n  "domain": "TWT",\n  "samples": [[0,0.2,0.8,0.2,0],[0,0.1,0.7,0.3,0]]\n}`,
 qi:`{\n  "operation": "avo",\n  "angles": [5, 15, 25],\n  "amplitudes": [[0.1, 0.2], [0.12, 0.18], [0.15, 0.16]],\n  "model": "shuey2"\n}`,
 surfaces:`{\n  "kind": "horizon",\n  "inlineRange": [1, 2],\n  "crosslineRange": [10, 11],\n  "picks": [{"inline": 1, "crossline": 10, "value": 1.2}, {"inline": 2, "crossline": 11, "value": 1.25}]\n}`,
 models:`{\n  "operation": "export-check",\n  "faultsHaveYSplits": false,\n  "target": "RESQML"\n}`,
 '4d':`{\n  "operation": "difference",\n  "dt": 0.004,\n  "baseline": [[0, 0.2, 0.5], [0, 0.1, 0.4]],\n  "monitor": [[0, 0.25, 0.55], [0, 0.15, 0.45]]\n}`,
 slice:`{\n  "kind": "linked",\n  "inline": 0,\n  "crossline": 0,\n  "sample": 0,\n  "volume": [[[0,1],[1,2]],[[2,3],[3,4]]]\n}`,
 'index-manifest':`{\n  "sourceId": "demo",\n  "sourceVersion": "v1",\n  "sourceSha256": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",\n  "traceCount": 1000,\n  "tracesPerPartition": 250,\n  "samplesPerTrace": 500,\n  "sampleInterval": 0.004,\n  "indexObject": "owners/u/projects/p/index.sqlite",\n  "arrayPrefix": "owners/u/projects/p/zarr/",\n  "partitionIndex": 0,\n  "halo": 1\n}`
};

export function configureSeismicQi(context){host=context;}
function normalize(){const next=`${session.user?.uid}:${host.getProject()?.id}`;if(next===scope)return;clearTimeout(pollTimer);transient.clear();loadedSources.clear();scope=next;generation++;notice='';result=null;busy=false;sourceQuery='';}

const engineGroups=[['Sources & views','section',['slice','index-manifest','regularise']],['Calibration','velocity',['tie','velocity','statics']],['Imaging','cube',['imaging','marine','travel-times','acoustic']],['Analysis','spectrum',['attributes','qi','4d']],['Structure & models','fault',['surfaces','models','geostatistics']]];
function engineSources(s){
 const items=host.getState().ingestion?.datasets?.filter(d=>d.active!==false)||[],missing=(s.sources||[]).filter(id=>!items.some(item=>item.id===id)),shown=items.filter(d=>d.name.toLowerCase().includes(sourceQuery.toLowerCase()));
 return `<header><strong>Sources & inputs</strong><span class="sw-count">${items.length}</span></header><label class="sw-source-search">${host.icon('search')}<input id="sq-source-search" type="search" placeholder="Find a dataset…" aria-label="Find engine input dataset" value="${esc(sourceQuery)}"></label><div class="sw-browser-section-title">PROJECT DATASETS</div><div class="sq-source-list">${shown.map(d=>`<label class="sq-source-item"><input type="checkbox" data-sq-source="${esc(d.id)}" ${(s.sources||[]).includes(d.id)?'checked':''}><span>${host.icon(d.family==='seismic'?'layers':'file')}</span><span><strong>${esc(d.name)}</strong><small>${esc(d.family||'Retained source')}</small></span></label>`).join('')||'<div class="sw-browser-empty"><p>No matching datasets.</p><small>Import and activate project data to begin.</small></div>'}${missing.map(id=>`<div class="sq-missing-source"><span><strong>Source unavailable</strong><small>${esc(id)}</small></span><button data-sq-remove-source="${esc(id)}" aria-label="Remove unavailable source from this calculation">×</button></div>`).join('')}</div><button id="sq-import" class="sw-full">${host.icon('plus')}Import sources</button><div class="sw-browser-foot">Select the evidence used by this calculation.</div>`;
}
function volumeSourceFields(s){
 if(s.tool!=='slice')return '';
 const values=s.volumeBounds||{};
 return `<details class="sq-volume-bounds" open><summary>3D source selection</summary><p class="sw-help">Use a saved 3D poststack geometry revision. Enter the source's actual inline and crossline identities.</p><div class="sq-parameter-grid">${[['geometryRevision','Geometry revision','',1],['inlineStart','First inline','',-2147483648],['crosslineStart','First crossline','',-2147483648],['inlineStep','Inline step',1,1],['crosslineStep','Crossline step',1,1],['inlineCount','Inline count',8,2],['crosslineCount','Crossline count',8,2],['firstSample','First sample',0,0],['sampleCount','Samples per trace',128,2]].map(([key,label,fallback,min])=>`<label>${label}<input data-sq-volume="${key}" type="number" min="${min}" step="1" value="${esc(values[key]??fallback)}" placeholder="From reviewed source"></label>`).join('')}</div></details>`;
}
function engineExecution(s){
 const r=s.run;
 return `<section class="sq-execution" aria-label="Engine execution"><div class="sw-section-heading"><strong>Execution & review</strong><span class="sw-tag">${esc(r?.status||'Not submitted')}</span></div>${r?`<p class="sw-help" role="status">${esc(tools[r.estimate?.tool]?.label||'Engine')} · ${esc(r.status)}${r.dispatchState?' · '+esc(r.dispatchState):''}</p><div class="sq-run-actions"><button id="sq-run-status">${host.icon('clock')}Refresh run</button>${!r.settled?'<button id="sq-cancel">Cancel run</button>':''}${['completed','accepted','rejected'].includes(r.status)?'<button id="sq-preview-result">Compare result</button><button id="sq-download-artifact">Download artifact</button>':''}${r.status==='completed'?'<button id="sq-review" class="primary">Review result</button>':''}</div>${r.error?`<p class="sw-error">${esc(r.error)}</p>`:''}<details class="sw-inspector-section"><summary>Run provenance</summary><pre class="sq-result">${esc(JSON.stringify(r.estimate,null,2))}</pre></details>`:'<p class="sw-help">An estimate is prepared first. Computing starts after you approve it.</p>'}<button id="sq-history" class="sw-full">${host.icon('clock')}Job history</button></section>`;
}
export function seismicQiView(){
 normalize();const s=state(),tool=tools[s.tool]||tools.tie,q=host.getState().seismicQi;
 const menus=engineGroups.map(([label,icon,ids])=>`<details class="sp-menu ${ids.every(id=>!engineToolReady(id))?'sw-unfinished-group':''}" ${ids.includes(s.tool)?'data-current-group="true"':''}><summary>${seismicIcon(icon)}<span>${label}</span>${host.icon('down')}</summary><div><strong>${label}</strong>${ids.map(id=>`<button data-sq-tool="${id}" ${unavailableAttributes(engineToolReady(id))} aria-pressed="${s.tool===id}">${seismicIcon(icon)}<span>${esc(tools[id].label)}</span>${!engineToolReady(id)?'<small>Unfinished</small>':s.tool===id?host.icon('check'):''}</button>`).join('')}</div></details>`).join('');
 const history=result?.runs;
 return `<section class="sw sq" aria-label="Seismic quantitative tools"><header class="sw-heading"><div><div class="study-kicker">PROCESSING · SEISMIC ENGINES</div><h1>${esc(host.getProject().name)}</h1><p>Configure a calculation, choose its evidence and review the result.</p></div><div class="sw-heading-actions"><button id="sq-refresh">${host.icon('close')}Clear result</button>${host.getProject().storage!=='cloud'?'<button id="sq-cloud-copy">Create Cloud copy…</button>':''}</div></header><nav class="sw-ribbon" aria-label="Seismic engine tools">${ribbonGroup('Seismic engines',menus)}${ribbonGroup('Results',`<button id="sq-export" ${result?'':'disabled'}>${host.icon('download')}<span>Export result</span></button>`)}</nav><div class="sw-body"><aside class="sw-browser" aria-label="Engine sources">${engineSources(s)}</aside><div class="sw-workspace"><nav class="sw-books" aria-label="Engine workbooks">${q.books.map(b=>`<button data-sq-book="${b.id}" aria-pressed="${b.id===s.id}">${seismicIcon('graph')}${esc(b.name)}</button>`).join('')}<button id="sq-new-book" class="sw-new-book" aria-label="New engine workbook">${host.icon('plus')}</button></nav><div class="sw-canvas-toolbar"><span>Calculation setup</span><span class="sw-tag">${esc(tool.label)}</span></div><div class="sq-editor"><div class="sq-editor-heading"><span class="sw-node-icon">${seismicIcon(engineGroups.find(group=>group[2].includes(s.tool))?.[1]||'wave')}</span><div><h2>${esc(tool.label)}</h2><p>${esc(tool.hint)}</p></div></div><form id="sq-parameters" aria-label="Engine operation parameters"><fieldset ${engineToolReady(s.tool)?'':'disabled'}>${!engineToolReady(s.tool)?'<p class="sw-unfinished-note">This engine is still being implemented. Saved settings and previous results remain available for review.</p>':''}${engineFields(s)}</fieldset></form><section class="sq-input-section"><div class="sw-section-heading"><strong>Seismic observations</strong><span class="sw-tag">${s.sources?.length||0} selected</span></div><p class="sw-help">Bind a retained source to this calculation, or supply reviewed arrays and source bindings in Advanced inputs.</p><div class="sq-input-row"><label>Input argument<select id="sq-source-role">${(s.tool==='slice'?['volume']:['samples','seismic','baseline','monitor','amplitudes']).map(k=>`<option>${k}</option>`).join('')}</select></label><button id="sq-load-section" ${unavailableAttributes(engineToolReady(s.tool))}>${host.icon('plus')}Use selected source</button></div>${transient.has(s.id)?'<p class="sq-input-loaded">Source section loaded for this workbook.</p>':''}${volumeSourceFields(s)}</section><details class="sq-advanced" ${(()=>{try{readEnginePayload(s);return '';}catch{return 'open';}})()}><summary>Advanced inputs & source bindings</summary><p class="sw-help">Arrays, geometry and advanced options. Changes are retained in this workbook.</p><textarea id="sq-payload" aria-label="Advanced engine input JSON" spellcheck="false">${esc(s.payload)}</textarea><div class="sw-inspector-actions"><button id="sq-apply-json" type="button">Apply advanced inputs</button><button id="sq-example" type="button">Load explicit example</button></div></details><div class="sq-calculate"><p>Review the resource estimate before scheduling.</p><button class="primary" id="sq-run" ${unavailableAttributes(engineToolReady(s.tool))} ${busy?'disabled':''}>${host.icon('arrow')}${!engineToolReady(s.tool)?'Engine unfinished':busy?'Preparing estimate…':'Estimate '+esc(tool.label)}</button></div>${history?`<section class="sq-job-history"><div class="sw-section-heading"><strong>Recent engine jobs</strong><span class="sw-count">${history.length}</span></div>${history.map(r=>`<button data-sq-history-run="${esc(r.id)}"><span><strong>${esc(tools[r.estimate?.tool]?.label||r.estimate?.tool||'Engine job')}</strong><small>${esc(r.id)}</small></span><span class="sw-tag">${esc(r.status)}</span></button>`).join('')||'<p class="sw-help">No engine jobs have been submitted.</p>'}</section>`:''}</div></div><aside class="sw-properties" aria-label="Engine properties and result"><header><strong>Properties & result</strong>${s.run?`<span class="sw-tag">${esc(s.run.status)}</span>`:''}</header><label>Workbook name<input id="sq-book-name" value="${esc(s.name)}" maxlength="80"></label>${engineExecution(s)}<section class="sq-result-section"><div class="sw-section-heading"><strong>${result?.fingerprint?'Resource estimate':'Result preview'}</strong></div>${resultSummary(result)}</section></aside></div><div class="sw-status" role="status"><span class="sw-status-indicator"></span>${esc(notice||'Choose an engine, select its sources and configure the operation.')}<span class="sw-status-end">${esc(tool.label)} · ${s.sources?.length||0} sources</span></div></section>`;
}

export function bindSeismicQi(){
 if(!$('.sq'))return;const s=state();
 clearTimeout(pollTimer);
 bindRibbon($('.sq .sw-ribbon'));
 const g=generation,pid=host.getProject().id,book=s.id,valid=()=>scopeCurrent(g)&&state().id===book&&!!document.querySelector('.sq');
 const call=async(path,options={})=>{if(!valid())throw new Error('The workbook changed.');return api(path,{...options,ownerUid:session.user?.uid});};
 document.querySelectorAll('[data-sq-remove-source]').forEach(button=>button.onclick=()=>{s.sources=(s.sources||[]).filter(id=>id!==button.dataset.sqRemoveSource);host.save();host.render();});
 $('#sq-import').onclick=()=>host.openImporter({family:'seismic'});
 $('#sq-source-search').oninput=e=>{sourceQuery=e.target.value;const position=e.target.selectionStart;host.render();const field=$('#sq-source-search');field.focus();field.setSelectionRange(position,position);};
 if($('#sq-operation'))$('#sq-operation').onchange=safe(e=>{selectOperation(s,e.target.value);result=null;host.save();host.render();});
 document.querySelectorAll('[data-sq-parameter]').forEach(field=>field.onchange=safe(()=>{const body=readEnginePayload(s),key=field.dataset.sqParameter,type=field.dataset.valueType;if(type==='boolean')body[key]=field.checked;else if(type==='number'){if(field.value==='')delete body[key];else{const value=Number(field.value);if(!Number.isFinite(value))throw new Error('Enter a finite numerical parameter.');body[key]=value;}}else body[key]=field.value;s.payload=JSON.stringify(body,null,2);$('#sq-payload').value=s.payload;host.save();}));
 $('#sq-apply-json').onclick=safe(()=>{readEnginePayload(s);host.save();host.render();});
 $('#sq-source-role').value=s.tool==='slice'?'volume':s.sourceRole||'samples';$('#sq-source-role').onchange=e=>{s.sourceRole=e.target.value;host.save();};
 document.querySelectorAll('[data-sq-volume]').forEach(field=>field.onchange=()=>{s.volumeBounds||={};s.volumeBounds[field.dataset.sqVolume]=field.value===''?'':Number(field.value);host.save();});
 document.querySelectorAll('[data-sq-book]').forEach(b=>b.onclick=()=>{host.getState().seismicQi.active=b.dataset.sqBook;result=null;host.save();host.render();});
 $('#sq-new-book').onclick=()=>{const q=host.getState().seismicQi,id=crypto.randomUUID();q.books.push({id,name:`Workbook ${q.books.length+1}`,tool:engineToolReady(s.tool)?s.tool:'slice',payload:'{}',sources:[]});q.active=id;result=null;host.save();host.render();};
 $('#sq-book-name').onchange=e=>{s.name=e.target.value.trim()||'Seismic workbook';host.save();};
 document.querySelectorAll('[data-sq-source]').forEach(e=>e.onchange=()=>{s.sources=e.checked?[...new Set([...(s.sources||[]),e.dataset.sqSource])]:(s.sources||[]).filter(id=>id!==e.dataset.sqSource);host.save();host.render();});
 $('#sq-load-section').onclick=safe(async()=>{
  if(!engineToolReady(s.tool))throw new Error(unfinishedText);
  const selected=host.getState().ingestion?.datasets?.find(d=>(s.sources||[]).includes(d.id)&&d.family==='seismic');if(!selected)throw new Error('Select an activated seismic source.');
  const role=$('#sq-source-role').value,body=readEnginePayload(s),m=selected.metadata||{},selection={firstTrace:0,traceCount:role==='seismic'?1:Math.min(8,m.traceCount||8),firstSample:0,sampleCount:Math.min(256,m.sampleCountRange?.[0]||m.sampleCount||256)};
  if(role==='volume'){
   const fields=[...document.querySelectorAll('[data-sq-volume]')];if(fields.some(field=>field.value===''||!field.reportValidity()||!Number.isInteger(Number(field.value))))throw new Error('Enter the reviewed geometry revision and actual inline/crossline bounds.');
   const values=Object.fromEntries(fields.map(field=>[field.dataset.sqVolume,Number(field.value)]));
   if(values.inlineCount>64||values.crosslineCount>64||values.inlineCount*values.crosslineCount>512||values.sampleCount>1024||values.inlineCount*values.crosslineCount*values.sampleCount>500000)throw new Error('Select at most 512 bins and 500,000 samples for this volume input.');
   body.$inputs||={};body.$inputs.volume={kind:'brick',datasetId:selected.id,brick:{geometryRevision:values.geometryRevision,inline:{start:values.inlineStart,step:values.inlineStep,count:values.inlineCount},crossline:{start:values.crosslineStart,step:values.crosslineStep,count:values.crosslineCount},firstSample:values.firstSample,sampleCount:values.sampleCount}};delete body.volume;
  }else if(role==='seismic'){
   const section=await call(`/api/projects/${pid}/seismic/sources/${selected.id}/section?trace_count=1&sample_count=${selection.sampleCount}`);if(!valid())return;
   const values=transient.get(book)||{};values.seismic=section.samples[0];values.dt=section.sampleInterval;transient.set(book,values);loadedSources.set(book,{id:selected.id,version:section.sourceVersion});
   delete body.seismic;if(body.$inputs)delete body.$inputs.seismic;
  }else{
   body.$inputs||={};body.$inputs[role]={kind:'section',datasetId:selected.id,selection};delete body[role];
   const values=transient.get(book);if(values)delete values[role];
  }
  s.payload=JSON.stringify(body,null,2);notice=`${selected.name} selected for ${role}. Review the source bounds in Advanced inputs.`;host.save();host.render();
 });
 document.querySelectorAll('[data-sq-history-run]').forEach(button=>button.onclick=()=>{const run=result?.runs?.find(r=>r.id===button.dataset.sqHistoryRun);if(!run)return;s.run=run;host.save();host.render();});
 const refresh=async()=>{if(!s.run)return;const value=await call(`/api/projects/${pid}/seismic/runs/${s.run.id}`);if(!valid())return;s.run=value;host.save();host.render();};
 $('#sq-history').onclick=safe(async()=>{const values=await call(`/api/projects/${pid}/seismic/runs`);if(!valid())return;result={runs:values.runs.filter(r=>r.kind==='seismic-tool')};host.render();});
 if($('#sq-preview-result'))$('#sq-preview-result').onclick=safe(async()=>{const value=await call(`/api/projects/${pid}/seismic/tool-runs/${s.run.id}/preview`);if(!valid())return;result=value;host.render();});
 if($('#sq-run-status'))$('#sq-run-status').onclick=safe(refresh);
 if(s.run&&!s.run.settled)pollTimer=setTimeout(()=>{if(valid())safe(refresh)();},5000);
 if($('#sq-cancel'))$('#sq-cancel').onclick=safe(async()=>{await call(`/api/projects/${pid}/seismic/runs/${s.run.id}/cancel`,{method:'POST',body:{}});if(valid())await refresh();});
 if($('#sq-download-artifact'))$('#sq-download-artifact').onclick=safe(async()=>{const a=await call(`/api/projects/${pid}/seismic/tool-runs/${s.run.id}/artifact`);if(!valid())return;const response=await fetch(a.url,{referrerPolicy:'no-referrer'});if(!response.ok)throw new Error('Artifact access expired. Refresh and retry.');const blob=await response.blob();if(valid())host.download(`seismic-${s.run.id}.npz`,blob);});
 if($('#sq-review'))$('#sq-review').onclick=()=>{host.modal('Review seismic result','<form id="sq-review-form"><label>Decision<select name="decision"><option value="accept">Accept independent result</option><option value="reject">Reject</option></select></label><label>Review notes<textarea name="comment" required maxlength="4000"></textarea></label><label><input name="reviewed" type="checkbox" required>I reviewed the result, sources, units and limitations</label><button>Record review</button><p id="sq-review-error" role="alert"></p></form>');$('#sq-review-form').onsubmit=async e=>{e.preventDefault();try{const f=new FormData(e.target);const value=await call(`/api/projects/${pid}/seismic/tool-runs/${s.run.id}/review`,{method:'POST',body:{revision:s.run.revision,decision:f.get('decision'),comment:f.get('comment')}});if(!valid())return;s.run=value;host.save();$('#dialog').close();host.render();}catch(error){if(valid())$('#sq-review-error').textContent=error.message;}};};
 if($('#sq-cloud-copy'))$('#sq-cloud-copy').onclick=()=>openCloudCopy(host,'seismic-qi');
 $('#sq-refresh').onclick=()=>{result=null;notice='';host.render();};
 document.querySelectorAll('[data-sq-tool]').forEach(e=>e.onclick=()=>{const next=e.dataset.sqTool;if(!engineToolReady(next)||s.tool===next)return;s.toolDrafts||={};s.toolDrafts[s.tool]={payload:s.payload,sources:[...(s.sources||[])],sourceRole:s.sourceRole,run:s.run};const retained=s.toolDrafts[next];s.tool=next;s.payload=retained?.payload||'{}';s.sources=retained?.sources||s.sources||[];s.sourceRole=retained?.sourceRole||'samples';s.run=retained?.run||null;transient.delete(book);loadedSources.delete(book);result=null;notice='';host.save();host.render();});
 $('#sq-example').onclick=()=>{s.payload=examples[s.tool]||'{}';host.save();host.render();};
 $('#sq-payload').oninput=()=>{s.payload=$('#sq-payload').value;host.save();};
 $('#sq-run').onclick=safe(async()=>{
  if(!engineToolReady(s.tool))throw new Error(unfinishedText);
  if(host.getProject().storage!=='cloud')throw new Error('Create an explicit Cloud copy before running seismic engines. Local contents have not been uploaded.');
  let body;try{body={...prepareEnginePayload(s),...(transient.get(book)||{})};}catch{throw new Error('Review the advanced input JSON before estimating.');}
  if(!s.sources?.length)throw new Error('Select the retained input sources before estimating a job.');
  const loaded=loadedSources.get(book);if(loaded){if(!s.sources.includes(loaded.id))throw new Error('The loaded trace is no longer selected. Reload the source section.');const metadata=await call(`/api/projects/${pid}/seismic`);if(!valid())return;if(metadata.sources.find(d=>d.id===loaded.id)?.sourceVersion!==loaded.version)throw new Error('The loaded source changed. Load the current trace before estimating.');}
  const g=generation,tool=tools[s.tool],requestSettings=JSON.stringify({payload:s.payload,sources:s.sources,tool:s.tool});busy=true;notice=`Preparing ${tool.label} estimate…`;host.render();
  try{
   const estimate=await call(`/api/projects/${pid}/seismic/tool-estimates`,{method:'POST',body:{tool:tool.path,parameters:body,sources:s.sources}});
   if(!valid())return;if(requestSettings!==JSON.stringify({payload:s.payload,sources:s.sources,tool:s.tool}))throw new Error('Settings changed while the estimate was being prepared. Prepare a new estimate.');result=estimate;notice='Review the exact estimate before scheduling.';
   host.modal('Review engine run estimate',`<form id="sq-approve"><pre>${esc(JSON.stringify(estimate,null,2))}</pre><label><input name="reviewed" type="checkbox" required>I approve these exact inputs, resource limits and compute ceiling</label><button>Approve and schedule</button><p id="sq-approve-error" role="alert"></p></form>`);
   $('#sq-approve').onsubmit=async e=>{e.preventDefault();try{const run=await call(`/api/projects/${pid}/seismic/tool-runs`,{method:'POST',body:{estimateId:estimate.id,fingerprint:estimate.fingerprint,idempotencyKey:crypto.randomUUID(),reviewed:true}});if(!valid())return;s.run=run;host.save();$('#dialog').close();host.render();}catch(error){if(valid())$('#sq-approve-error').textContent=error.message;}};
  }finally{if(scopeCurrent(g)){busy=false;if(valid())host.render();}}
 });
 if($('#sq-export'))$('#sq-export').onclick=safe(()=>{if(!result)throw new Error('Run a tool first.');host.download(`seismic-${s.tool}-result.json`,new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));});
}
