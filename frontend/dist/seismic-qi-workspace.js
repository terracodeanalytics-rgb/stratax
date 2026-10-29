import {api,session} from './auth.js';
import {openCloudCopy} from './workspace-cloud-copy.js';

let host,scope='',generation=0,notice='',busy=false,result=null;
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state=()=>{const w=host.getState();w.seismicQi||={schemaVersion:1,tool:'tie',payload:'{\n  "operation": "bulk-shift",\n  "seismic": [0, 0.2, 0.8, 0.2, 0],\n  "synthetic": [0, 0, 0.2, 0.8, 0.2],\n  "maxLagSamples": 2\n}'};return w.seismicQi;};
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
 statics:{label:'Surface statics',path:'statics',hint:'Source/receiver timing residual inversion and bounded correction proposals'}
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
function normalize(){const next=`${session.user?.uid}:${host.getProject()?.id}`;if(next===scope)return;scope=next;generation++;notice='';result=null;busy=false;}

export function seismicQiView(){
 normalize();const s=state(),tool=tools[s.tool]||tools.tie;
 return `<section class="sw sq" aria-label="Seismic quantitative tools"><header class="sw-heading"><div><div class="study-kicker">SEISMIC ENGINES</div><h1>${esc(host.getProject().name)}</h1><p>Ties · velocity · attributes · surfaces · models · 4D</p></div><button id="sq-refresh">Clear result</button>${host.getProject().storage!=='cloud'?'<button id="sq-cloud-copy">Create Cloud copy…</button>':''}</header><nav class="sw-ribbon" aria-label="Seismic engine tools">${Object.entries(tools).map(([id,t])=>`<button data-sq-tool="${id}" aria-pressed="${s.tool===id}">${esc(t.label)}</button>`).join('')}</nav><div class="sw-body"><aside class="sw-browser" aria-label="Tool notes"><header><strong>${esc(tool.label)}</strong></header><p class="sub">${esc(tool.hint)}</p><p class="sub">Paste reviewed JSON parameters. Arrays stay ephemeral on the server — nothing is invented.</p><button id="sq-example">Load example</button></aside><div class="sw-workspace"><label class="field">Request JSON<textarea id="sq-payload" rows="18" spellcheck="false">${esc(s.payload)}</textarea></label><div class="actions" style="margin-top:12px"><button class="primary" id="sq-run" ${busy?'disabled':''}>Run ${esc(tool.label)}</button><button id="sq-export" ${result?'':'disabled'}>Export result</button></div></div><aside class="sw-properties" aria-label="Engine result"><header><strong>Result</strong></header>${result?`<pre class="sq-result">${esc(JSON.stringify(result,null,2))}</pre>`:'<p class="sub">No result yet.</p>'}</aside></div><div class="sw-status" role="status">${esc(notice||'Choose a tool, review parameters, then run against the Cloud project.')}</div></section>`;
}

export function bindSeismicQi(){
 if(!$('.sq'))return;const s=state();
 if($('#sq-cloud-copy'))$('#sq-cloud-copy').onclick=()=>openCloudCopy(host,'seismic-qi');
 $('#sq-refresh').onclick=()=>{result=null;notice='';host.render();};
 document.querySelectorAll('[data-sq-tool]').forEach(e=>e.onclick=()=>{s.tool=e.dataset.sqTool;s.payload=examples[s.tool]||s.payload;result=null;notice='';host.save();host.render();});
 $('#sq-example').onclick=()=>{s.payload=examples[s.tool]||'{}';host.save();host.render();};
 $('#sq-payload').oninput=()=>{s.payload=$('#sq-payload').value;host.save();};
 $('#sq-run').onclick=safe(async()=>{
  if(host.getProject().storage!=='cloud')throw new Error('Create an explicit Cloud copy before running seismic engines. Local contents have not been uploaded.');
  let body;try{body=JSON.parse(s.payload);}catch{throw new Error('Request JSON is not valid.');}
  const g=generation,tool=tools[s.tool];busy=true;notice=`Running ${tool.label}…`;host.render();
  try{
   result=await api(`/api/projects/${host.getProject().id}/seismic/tools/${tool.path}`,{method:'POST',body});
   if(!scopeCurrent(g))return;notice=`${tool.label} completed.`;
  }finally{busy=false;host.render();}
 });
 if($('#sq-export'))$('#sq-export').onclick=safe(()=>{if(!result)throw new Error('Run a tool first.');host.download(`seismic-${s.tool}-result.json`,new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));});
}
