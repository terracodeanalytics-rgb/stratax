import {api,session} from './auth.js';
import {openCloudCopy} from './workspace-cloud-copy.js';

let host,scope='',generation=0,notice='',busy=false,result=null,pollTimer;
const transient=new Map();
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state=()=>{const w=host.getState();w.seismicQi||={schemaVersion:2,books:[],active:null};const q=w.seismicQi;if(!q.books){q.books=[{id:crypto.randomUUID(),name:'Retained engine settings',tool:q.tool||'tie',payload:q.payload||'{}',sources:[]}];q.active=q.books[0].id;q.schemaVersion=2;}if(!q.books.length){q.books.push({id:crypto.randomUUID(),name:'Seismic workbook',tool:'tie',payload:'{}',sources:[]});q.active=q.books[0].id;}return q.books.find(b=>b.id===q.active)||q.books[0];};
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
 'index-manifest':{label:'Cloud index',path:'index-manifest',hint:'Partition manifest for GCS analytical shards'},
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
function normalize(){const next=`${session.user?.uid}:${host.getProject()?.id}`;if(next===scope)return;clearTimeout(pollTimer);transient.clear();scope=next;generation++;notice='';result=null;busy=false;}

function workbookControls(s){
 const q=host.getState().seismicQi,items=host.getState().ingestion?.datasets?.filter(d=>d.active!==false)||[];
 return `<div class="sw-book-tabs" role="tablist" aria-label="Engine workbooks">${q.books.map(b=>`<button role="tab" data-sq-book="${b.id}" aria-selected="${b.id===s.id}">${esc(b.name)}</button>`).join('')}<button id="sq-new-book">New workbook</button></div><section aria-label="Workbook sources and execution"><label>Workbook name<input id="sq-book-name" value="${esc(s.name)}" maxlength="80"></label><details open><summary>Retained sources · exact versions bound at estimation</summary>${items.map(d=>`<label><input type="checkbox" data-sq-source="${esc(d.id)}" ${(s.sources||[]).includes(d.id)?'checked':''}>${esc(d.name)}</label>`).join('')||'<p>Import and activate project data first.</p>'}</details><label>Seismic source field<select id="sq-source-role">${['samples','seismic','baseline','monitor','amplitudes'].map(k=>`<option>${k}</option>`).join('')}</select></label><button id="sq-load-section">Use bounded section from selected seismic source</button><p>Source samples stay transient; saved books contain settings and run references.</p><button id="sq-history">Refresh job history</button>${s.run?`<p role="status">${esc(s.run.status)} · ${esc(s.run.dispatchState||'')}</p><button id="sq-run-status">Refresh run</button>${!s.run.settled?'<button id="sq-cancel">Cancel</button>':''}${['completed','accepted','rejected'].includes(s.run.status)?'<button id="sq-download-artifact">Download result artifact</button><button id="sq-preview-result">Compare result preview</button>':''}${s.run.status==='completed'?'<button id="sq-review">Review result</button>':''}<pre>${esc(JSON.stringify(s.run.estimate,null,2))}</pre>`:''}</section>`;
}

export function seismicQiView(){
 normalize();const s=state(),tool=tools[s.tool]||tools.tie;
 return `<section class="sw sq" aria-label="Seismic quantitative tools"><header class="sw-heading"><div><div class="study-kicker">SEISMIC ENGINES</div><h1>${esc(host.getProject().name)}</h1><p>Ties · velocity · attributes · surfaces · models · 4D</p></div><button id="sq-refresh">Clear result</button>${host.getProject().storage!=='cloud'?'<button id="sq-cloud-copy">Create Cloud copy…</button>':''}</header><nav class="sw-ribbon" aria-label="Seismic engine tools">${Object.entries(tools).map(([id,t])=>`<button data-sq-tool="${id}" aria-pressed="${s.tool===id}">${esc(t.label)}</button>`).join('')}</nav><div class="sw-body"><aside class="sw-browser" aria-label="Tool notes"><header><strong>${esc(tool.label)}</strong></header><p class="sub">${esc(tool.hint)}</p><p class="sub">Review engine parameters and retained source versions. Jobs store private result artifacts for comparison and review.</p><button id="sq-example">Load explicit example</button></aside><div class="sw-workspace"><label class="field">Request JSON<textarea id="sq-payload" rows="18" spellcheck="false">${esc(s.payload)}</textarea></label><div class="actions" style="margin-top:12px"><button class="primary" id="sq-run" ${busy?'disabled':''}>Estimate ${esc(tool.label)}</button><button id="sq-export" ${result?'':'disabled'}>Export result</button></div></div><aside class="sw-properties" aria-label="Engine result"><header><strong>Result</strong></header>${result?`<pre class="sq-result">${esc(JSON.stringify(result,null,2))}</pre>`:'<p class="sub">No result yet.</p>'}</aside></div><div class="sw-status" role="status">${esc(notice||'Choose a tool, review parameters, then run against the Cloud project.')}</div></section>`;
}

export function bindSeismicQi(){
 if(!$('.sq'))return;const s=state();
 clearTimeout(pollTimer);
 const heading=$('.sw-workspace');heading.insertAdjacentHTML('afterbegin',workbookControls(s));
 const g=generation,pid=host.getProject().id,book=s.id,valid=()=>scopeCurrent(g)&&state().id===book;
 const call=async(path,options={})=>{if(!valid())throw new Error('The workbook changed.');return api(path,{...options,ownerUid:session.user?.uid});};
 document.querySelectorAll('[data-sq-book]').forEach(b=>b.onclick=()=>{host.getState().seismicQi.active=b.dataset.sqBook;result=null;host.save();host.render();});
 $('#sq-new-book').onclick=()=>{const q=host.getState().seismicQi,id=crypto.randomUUID();q.books.push({id,name:`Workbook ${q.books.length+1}`,tool:s.tool,payload:'{}',sources:[]});q.active=id;result=null;host.save();host.render();};
 $('#sq-book-name').onchange=e=>{s.name=e.target.value.trim()||'Seismic workbook';host.save();};
 document.querySelectorAll('[data-sq-source]').forEach(e=>e.onchange=()=>{s.sources=[...document.querySelectorAll('[data-sq-source]:checked')].map(e=>e.dataset.sqSource);host.save();});
 $('#sq-load-section').onclick=safe(async()=>{const selected=host.getState().ingestion.datasets.find(d=>(s.sources||[]).includes(d.id)&&d.family==='seismic');if(!selected)throw new Error('Select an activated seismic source.');const role=$('#sq-source-role').value;const section=await call(`/api/projects/${pid}/seismic/sources/${selected.id}/section?trace_count=8&sample_count=256`);if(!valid())return;const values=transient.get(book)||{};values[role]=role==='seismic'?section.samples[0]:section.samples;values.dt=section.sampleInterval;transient.set(book,values);notice=`Loaded ${selected.name}: 8 traces × up to 256 samples for ${role}.`;host.render();});
 const refresh=async()=>{if(!s.run)return;const value=await call(`/api/projects/${pid}/seismic/runs/${s.run.id}`);if(!valid())return;s.run=value;host.save();host.render();};
 $('#sq-history').onclick=safe(async()=>{const values=await call(`/api/projects/${pid}/seismic/runs`);if(!valid())return;result={runs:values.runs.filter(r=>r.kind==='seismic-tool')};host.render();});
 if($('#sq-preview-result'))$('#sq-preview-result').onclick=safe(async()=>{const value=await call(`/api/projects/${pid}/seismic/tool-runs/${s.run.id}/preview`);if(!valid())return;result=value;host.render();});
 if($('#sq-run-status'))$('#sq-run-status').onclick=safe(refresh);
 if(s.run&&!s.run.settled)pollTimer=setTimeout(safe(refresh),5000);
 if($('#sq-cancel'))$('#sq-cancel').onclick=safe(async()=>{await call(`/api/projects/${pid}/seismic/runs/${s.run.id}/cancel`,{method:'POST',body:{}});if(valid())await refresh();});
 if($('#sq-download-artifact'))$('#sq-download-artifact').onclick=safe(async()=>{const a=await call(`/api/projects/${pid}/seismic/tool-runs/${s.run.id}/artifact`);if(!valid())return;const response=await fetch(a.url,{referrerPolicy:'no-referrer'});if(!response.ok)throw new Error('Artifact access expired. Refresh and retry.');const blob=await response.blob();if(valid())host.download(`seismic-${s.run.id}.npz`,blob);});
 if($('#sq-review'))$('#sq-review').onclick=()=>{host.modal('Review seismic result','<form id="sq-review-form"><label>Decision<select name="decision"><option value="accept">Accept independent result</option><option value="reject">Reject</option></select></label><label>Review notes<textarea name="comment" required maxlength="4000"></textarea></label><label><input name="reviewed" type="checkbox" required>I reviewed the result, sources, units and limitations</label><button>Record review</button><p id="sq-review-error" role="alert"></p></form>');$('#sq-review-form').onsubmit=async e=>{e.preventDefault();try{const f=new FormData(e.target);const value=await call(`/api/projects/${pid}/seismic/tool-runs/${s.run.id}/review`,{method:'POST',body:{revision:s.run.revision,decision:f.get('decision'),comment:f.get('comment')}});if(!valid())return;s.run=value;host.save();$('#dialog').close();host.render();}catch(error){if(valid())$('#sq-review-error').textContent=error.message;}};};
 if($('#sq-cloud-copy'))$('#sq-cloud-copy').onclick=()=>openCloudCopy(host,'seismic-qi');
 $('#sq-refresh').onclick=()=>{result=null;notice='';host.render();};
 document.querySelectorAll('[data-sq-tool]').forEach(e=>e.onclick=()=>{s.tool=e.dataset.sqTool;s.payload='{}';result=null;notice='';host.save();host.render();});
 $('#sq-example').onclick=()=>{s.payload=examples[s.tool]||'{}';host.save();host.render();};
 $('#sq-payload').oninput=()=>{s.payload=$('#sq-payload').value;host.save();};
 $('#sq-run').onclick=safe(async()=>{
  if(host.getProject().storage!=='cloud')throw new Error('Create an explicit Cloud copy before running seismic engines. Local contents have not been uploaded.');
  let body;try{body={...JSON.parse(s.payload),...(transient.get(book)||{})};}catch{throw new Error('Request JSON is not valid.');}
  if(!s.sources?.length)throw new Error('Select the retained input sources before estimating a job.');
  const g=generation,tool=tools[s.tool];busy=true;notice=`Running ${tool.label}…`;host.render();
  try{
   const estimate=await call(`/api/projects/${pid}/seismic/tool-estimates`,{method:'POST',body:{tool:tool.path,parameters:body,sources:s.sources}});
   if(!valid())return;result=estimate;notice='Review the exact estimate before scheduling.';
   host.modal('Review engine run estimate',`<form id="sq-approve"><pre>${esc(JSON.stringify(estimate,null,2))}</pre><label><input name="reviewed" type="checkbox" required>I approve these exact inputs, resource limits and compute ceiling</label><button>Approve and schedule</button><p id="sq-approve-error" role="alert"></p></form>`);
   $('#sq-approve').onsubmit=async e=>{e.preventDefault();try{const run=await call(`/api/projects/${pid}/seismic/tool-runs`,{method:'POST',body:{estimateId:estimate.id,fingerprint:estimate.fingerprint,idempotencyKey:crypto.randomUUID(),reviewed:true}});if(!valid())return;s.run=run;host.save();$('#dialog').close();host.render();}catch(error){if(valid())$('#sq-approve-error').textContent=error.message;}};
  }finally{busy=false;host.render();}
 });
 if($('#sq-export'))$('#sq-export').onclick=safe(()=>{if(!result)throw new Error('Run a tool first.');host.download(`seismic-${s.tool}-result.json`,new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));});
}
