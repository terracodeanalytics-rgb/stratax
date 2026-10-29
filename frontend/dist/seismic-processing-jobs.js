import {api,session} from './auth.js';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let pollTimer;
const comparisons=new Map();
const activeStates=['queued','running','cancelling'];
const key=(host,b)=>`${session.user?.uid}:${host.getProject().id}:${b.id}:${b.run?.id}`;
export function jobsView(b){
 if(!b)return '';
 const s=b.selection||{firstTrace:0,traceCount:128,firstSample:0,sampleCount:1000},r=b.run;
 return `<section class="sp-jobs" aria-label="Processing execution"><form id="sp-range"><strong>Analytical preview selection</strong>${[['firstTrace','First source trace'],['traceCount','Trace count'],['firstSample','First source sample'],['sampleCount','Samples per trace']].map(([id,name])=>`<label>${name}<input name="${id}" type="number" min="${id.startsWith('first')?0:1}" step="1" value="${s[id]}" required></label>`).join('')}<button>Apply selection</button></form><div class="actions"><button id="sp-estimate">Estimate preview run</button>${r?`<button id="sp-run-refresh">Refresh run</button>${r.dispatchState==='pending'&&!r.settled?'<button id="sp-dispatch-retry">Retry approved scheduling</button>':''}${activeStates.includes(r.status)?'<button id="sp-cancel">Cancel run</button>':''}${['completed','accepted','rejected'].includes(r.status)?'<button id="sp-compare">Compare source / result</button>':''}${r.status==='completed'?'<button id="sp-review">Review result</button>':''}`:''}</div>${r?`<p role="status">${esc(r.status)}${r.progress?` · ${r.progress.completed}/${r.progress.total} steps`:''}${r.hasCheckpoint?' · checkpoint saved':''}${r.error?' · '+esc(r.error):''}</p>`:''}${r?`<details class="sp-provenance"><summary>Executed graph and resource provenance</summary><pre>${esc(JSON.stringify({graph:r.graphSnapshot,selection:r.selection,estimate:r.estimate,usage:r.usage},null,2))}</pre></details>`:''}${r?.hasCheckpoint&&['failed','cancelled'].includes(r.status)?'<label><input type="checkbox" id="sp-restart"> Restart from this run’s compatible checkpoint</label>':''}<div class="sp-comparison"><figure><figcaption>Retained source</figcaption><canvas id="sp-before" aria-label="Retained source amplitudes"></canvas></figure><figure><figcaption>Calculated proposal</figcaption><canvas id="sp-after" aria-label="Proposed processed amplitudes"></canvas></figure><figure><figcaption>Difference · identical sample grids only</figcaption><canvas id="sp-difference" aria-label="Calculated amplitude difference"></canvas><p id="sp-grid-note"></p></figure></div></section>`;
}
function paint(id,section,limit){
 const canvas=$(id);if(!canvas||!section)return;
 const w=section.samples.length,h=section.samples[0].length;canvas.width=w;canvas.height=h;
 const image=new ImageData(w,h);
 for(let t=0;t<w;t++)for(let s=0;s<h;s++){const v=section.samples[t][s],at=(s*w+t)*4;if(typeof v!=='number'||!Number.isFinite(v)){image.data.set([225,231,229,255],at);continue;}const a=Math.max(-1,Math.min(1,v/(limit||1))),level=Math.round(255*(1-Math.abs(a)));image.data.set(a>=0?[255,level,level,255]:[level,level,255,255],at);}
 canvas.getContext('2d').putImageData(image,0,0);
}
export function bindJobs(host,b,changed){
 clearTimeout(pollTimer);if(!b||!$('#sp-range'))return;
 const uid=session.user?.uid,pid=host.getProject().id,bid=b.id;
 const call=(path,options={})=>api(path,{...options,ownerUid:uid});
 const valid=()=>uid===session.user?.uid&&host.getProject()?.id===pid&&host.getState().seismicProcessing?.activeBook===bid&&!!document.querySelector('.sp');
 const safe=fn=>async e=>{try{if(valid())await fn(e);}catch(error){if(valid())host.toast(error.message);}};
 const cached=comparisons.get(key(host,b));if(cached){paint('#sp-before',cached.before,cached.limit);paint('#sp-after',cached.after,cached.limit);if(cached.difference)paint('#sp-difference',cached.difference,cached.diffLimit);else $('#sp-grid-note').textContent='The source and output have different sample grids. No silent resampling or subtraction was performed.';}
 $('#sp-range').onsubmit=safe(e=>{e.preventDefault();const values=Object.fromEntries([...new FormData(e.target)].map(([k,v])=>[k,Number(v)]));if(!Object.values(values).every(Number.isInteger)||values.firstTrace<0||values.firstSample<0||values.traceCount<1||values.traceCount>512||values.sampleCount<1||values.sampleCount>4096||values.traceCount*values.sampleCount>2000000)throw new Error('Select a bounded preview of up to 512 traces and 4096 samples per trace.');b.selection=values;changed();});
 $('#sp-estimate').onclick=safe(async()=>{
  if(host.getProject().storage!=='cloud')throw new Error('Create an explicit Cloud copy before server processing.');
  if(b.dirty||!b.graph.revision)throw new Error('Save the current graph before estimating its execution.');
  const restart=$('#sp-restart')?.checked?b.run.id:null;
  const estimate=await call(`/api/projects/${pid}/seismic/estimates`,{method:'POST',body:{graphId:b.id,revision:b.graph.revision,selection:b.selection}});if(!valid())return;
  b.estimate=estimate;b.submissionKey=crypto.randomUUID();host.save();
  host.modal('Review seismic preview estimate',`<p>Graph revision ${estimate.graphRevision}. Selected ${estimate.selection.traceCount} traces × ${estimate.selection.sampleCount} samples. This is a bounded preview.</p><p>${esc(estimate.resources.machineType)} · ${estimate.resources.cpuMilli/1000} CPU · ${estimate.resources.memoryMib} MiB · task limit ${estimate.resources.maxSeconds} seconds</p><p>Estimated compute and boot disk: USD ${estimate.resources.estimatedComputeAndBootDiskUsd}. Pricing: ${esc(estimate.resources.priceAsOf)}.</p><p>Output reservation ${Math.ceil(estimate.outputReservationBytes/1048576)} MiB; checkpoint reservation ${Math.ceil(estimate.checkpointReservationBytes/1048576)} MiB.</p><details class="sp-provenance"><summary>Exact source, graph and resource settings</summary><pre>${esc(JSON.stringify({graph:estimate.graphSnapshot,selection:estimate.selection,resources:estimate.resources,taskCount:estimate.taskCount,maximumRetries:estimate.maximumRetries,scratchBytes:estimate.scratchBytes},null,2))}</pre></details>${estimate.limitations.map(s=>`<p>${esc(s)}</p>`).join('')}<form id="sp-approve"><label><input type="checkbox" name="reviewed" required> I reviewed this exact source, graph, resource and cost estimate</label><button class="primary">Approve and run preview</button><p id="sp-approval-error" role="alert"></p></form>`);
  $('#sp-approve').onsubmit=async e=>{e.preventDefault();if(!valid())return;const button=e.target.querySelector('button');button.disabled=true;try{b.submissionKey||=crypto.randomUUID();host.save();const r=await call(`/api/projects/${pid}/seismic/runs`,{method:'POST',body:{estimateId:estimate.id,estimateFingerprint:estimate.fingerprint,idempotencyKey:b.submissionKey,reviewed:true,restartRunId:restart}});if(!valid())return;b.run=r;host.save();$('#dialog').close();host.render();}catch(error){if(valid()&&$('#sp-approval-error')){$('#sp-approval-error').textContent=error.message;button.disabled=false;}}};
 });
 const refresh=async()=>{const r=await call(`/api/projects/${pid}/seismic/runs/${b.run.id}`);if(!valid())return;b.run=r;host.save();host.render();};
 if($('#sp-run-refresh'))$('#sp-run-refresh').onclick=safe(refresh);
 if($('#sp-dispatch-retry'))$('#sp-dispatch-retry').onclick=safe(async()=>{const r=b.run;await call(`/api/projects/${pid}/seismic/runs`,{method:'POST',body:{estimateId:r.estimateId,estimateFingerprint:r.estimateFingerprint,idempotencyKey:r.idempotencyKey,reviewed:true,restartRunId:r.restartRunId||null}});if(valid())await refresh();});
 if(b.run&&activeStates.includes(b.run.status))pollTimer=setTimeout(safe(refresh),4000);
 if($('#sp-cancel'))$('#sp-cancel').onclick=safe(async()=>{const r=await call(`/api/projects/${pid}/seismic/runs/${b.run.id}/cancel`,{method:'POST',body:{}});if(!valid())return;b.run=r;host.save();host.render();});
 if($('#sp-compare'))$('#sp-compare').onclick=safe(async()=>{
  const s=b.run.selection,params=new URLSearchParams({first_trace:s.firstTrace,trace_count:Math.min(128,s.traceCount),first_sample:s.firstSample,sample_count:Math.min(1000,s.sampleCount)});
  const after=await call(`/api/projects/${pid}/seismic/runs/${b.run.id}/result?trace_count=${Math.min(128,s.traceCount)}&sample_count=${Math.min(1000,s.sampleCount)}`);if(!valid())return;
  const before=await call(`/api/projects/${pid}/seismic/sources/${after.provenance.sourceId}/section?${params}`);if(!valid())return;
  if(before.sourceVersion!==after.provenance.sourceVersion)throw new Error('The retained source version changed. A different version cannot be used for this comparison.');
  const compatible=before.samples.length===after.samples.length&&before.samples[0].length===after.samples[0].length&&Math.abs(before.sampleInterval-after.sampleInterval)<1e-12&&before.sampleStarts.every((v,i)=>Math.abs(v-after.sampleStarts[i])<1e-12);
  const difference=compatible?{samples:after.samples.map((row,t)=>row.map((v,s)=>Number.isFinite(v)&&v!==null&&Number.isFinite(before.samples[t][s])&&before.samples[t][s]!==null?v-before.samples[t][s]:null))}:null;
  const max=sections=>{let m=0;for(const section of sections)if(section)for(const row of section.samples)for(const v of row)if(typeof v==='number'&&Number.isFinite(v))m=Math.max(m,Math.abs(v));return m;};
  comparisons.clear();comparisons.set(key(host,b),{before,after,difference,limit:max([before,after]),diffLimit:max([difference])});host.render();
 });
 if($('#sp-review'))$('#sp-review').onclick=()=>{
  host.modal('Review processed seismic version','<form id="sp-result-review"><label>Decision<select name="decision"><option value="accept">Accept independent processing version</option><option value="reject">Reject proposal</option></select></label><label>Review comment<textarea name="comment" required maxlength="4000"></textarea></label><label><input name="reviewed" type="checkbox" required> I reviewed applicability, inputs, units, results and warnings</label><p>Acceptance preserves the original and records your review. It does not grant automatic scientific approval.</p><button class="primary">Record review</button><p id="sp-review-error" role="alert"></p></form>');
  $('#sp-result-review').onsubmit=async e=>{e.preventDefault();if(!valid())return;try{const f=new FormData(e.target),r=await call(`/api/projects/${pid}/seismic/runs/${b.run.id}/review`,{method:'POST',body:{revision:b.run.revision,decision:f.get('decision'),comment:f.get('comment')}});if(!valid())return;b.run=r;host.save();$('#dialog').close();host.render();}catch(error){if(valid()&&$('#sp-review-error'))$('#sp-review-error').textContent=error.message;}};
 };
}
