import {filterCloudArchive} from './archive-intake.js';
import {cancelNative,inspectionDetail,nativeImport,pollImport} from './ingestion-client.js';
import {session} from './auth.js';
import {bytes} from './ingestion-catalog.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeTransfer=null;

export function automaticZipSummary(record){
 const result=record.automaticResult;
 if(!result)return '';
 return `${result.accepted} datasets imported · ${result.pending} need review · ${result.skippedCount??result.skipped.length} skipped`;
}

export function prepareAutomaticZip(project,file,onProgress,signal){
 return filterCloudArchive(file,{skipSeismic:!project.workflows?.includes('seismic'),skipCheckshots:false,identify:true,onProgress,signal});
}

function progressDialog(host,project,name,controller,onCancel,onClose,elapsedBefore=0){
 const started=performance.now(),token=crypto.randomUUID();
 const current=()=>document.querySelector(`[data-zip-task="${token}"]`);
 host.modal('ZIP import',`<section data-zip-task="${token}"><p><strong>${esc(name)}</strong> · ${esc(project.name||'Current project')}</p>
  <h3 data-zip-phase>Preparing ZIP</h3><progress aria-label="Progress for the current import phase" max="100"></progress>
  <p data-zip-detail role="status">Reading the archive inventory.</p><p class="sub" data-zip-elapsed></p>
  <div class="actions"><button type="button" data-zip-cancel>Cancel import</button></div></section>`);
 const dialog=document.querySelector('#dialog');
 dialog.addEventListener('close',onClose,{once:true});
 current().querySelector('[data-zip-cancel]').onclick=async event=>{
  const button=event.currentTarget;button.disabled=true;
  try{await onCancel();}catch(error){host.toast(error.message);button.disabled=false;}
 };
 return {
  current,
  report(detail){
   const panel=current();
   if(!panel||controller.signal.aborted)return;
   panel.querySelector('[data-zip-phase]').textContent=detail.label||
    (detail.phase==='uploading'?'Uploading ZIP':detail.phase==='activating'?'Saving datasets':detail.phase==='preparing'?'Preparing ZIP':'Inspecting ZIP');
   const progress=panel.querySelector('progress');
   if(Number.isFinite(detail.percent))progress.value=Math.max(0,Math.min(100,detail.percent));
   else progress.removeAttribute('value');
   const status=panel.querySelector('[data-zip-detail]');
   const message=detail.message+(/^(Retrying|Confirming)/.test(detail.fileMessage||'')?' · '+detail.fileMessage:'');
   if(status.textContent!==message)status.textContent=message;
   const seconds=Math.floor((elapsedBefore+performance.now()-started)/1000);
   panel.querySelector('[data-zip-elapsed]').textContent=`${Math.floor(seconds/60)}m ${seconds%60}s elapsed${detail.meta?.includes(' / ')?' · '+detail.meta.split(' / ').slice(1).join(' · '):''}`;
  },
  ready(){
   if(current())current().querySelector('.actions').insertAdjacentHTML('afterbegin','<button type="button" data-zip-background>Close and keep importing</button>');
   if(current())current().querySelector('[data-zip-background]').onclick=()=>dialog.close();
  },
  failed(message){
   const panel=current();
   if(!panel)return;
   panel.querySelector('[data-zip-phase]').textContent='Import needs attention';
   panel.querySelector('progress').hidden=true;
   panel.querySelector('[data-zip-detail]').textContent=message;
   panel.querySelector('[data-zip-cancel]').hidden=true;
  }
 };
}

export async function startAutomaticZip(host,project,file,{remember,finished}){
 if(!file||!file.size||!/\.zip$/i.test(file.name)){host.toast('Choose one non-empty ZIP file.');return;}
 if(activeTransfer){host.toast('A ZIP transfer is already in progress. Check Import history for its status.');return;}
 const ownerUid=session.user?.uid,controller=new AbortController(),started=performance.now();
 const sameProject=()=>session.user?.uid===ownerUid&&host.getProject()?.id===project.id;
 let record,queued=false,cancelled=false,preparedAt=started;
 const cancel=async()=>{
  if(record)await cancelNative(project,record.id,ownerUid);
  cancelled=true;controller.abort();
  if(panel.current())document.querySelector('#dialog').close();
 };
 const panel=progressDialog(host,project,file.name,controller,cancel,()=>{});
 activeTransfer=controller;
 let detail={phase:'preparing',message:`Scanning ${bytes(file.size)} for files relevant to this project.`};
 const report=next=>{if(!sameProject()||next.assetId&&next.phase!=='uploading')return;detail=next;panel.report(detail);};
 const pulse=setInterval(()=>panel.report(detail),1000);
 report(detail);
 try{
  const prepared=await prepareAutomaticZip(project,file,p=>report({phase:'preparing',
   message:`${p.scanned} entries scanned · ${p.excluded} excluded${p.packing?' · Preparing transfer ZIP':''}`}),controller.signal);
  preparedAt=performance.now();
  if(!sameProject())throw new Error('Open the original project to start its transfer.');
  const id=crypto.randomUUID(),options={schemaVersion:2,perAsset:{[id]:{nativeArchive:true,autoPrepare:true,
   archiveTransfer:{originalSize:file.size,excluded:prepared.notes.slice(0,99),excludedCount:prepared.notes.length,fingerprint:prepared.fingerprint}}}};
  const handoff=await host.importTask(()=>nativeImport(project,[{id,file:prepared.file,family:'documents'}],'mixed',options,{
   mode:'automatic_zip',waitForInspection:false,signal:controller.signal,onDetail:report,
   onSession:value=>{record=value;if(sameProject())remember(value);if(cancelled)cancelNative(project,value.id,ownerUid).catch(()=>{});},
   onQueued:value=>{queued=true;activeTransfer=null;if(sameProject())remember(value);panel.ready();}
  }));
  if(session.user?.uid!==ownerUid)return;
  const result=await pollImport(project,handoff.id,{signal:controller.signal,onDetail:report});
  if(sameProject())await finished(result,!!panel.current(),{prepareMs:preparedAt-started,totalMs:performance.now()-started,
   bytesSent:prepared.file.size,transferMs:handoff.timings.transferMs});
 }catch(error){
  if(!cancelled&&sameProject()){
   const message=error.message+(record?' Reopen this import in Import history to resume.':'');
   if(panel.current())panel.failed(message);else host.toast(message);
  }
 }finally{
  clearInterval(pulse);
  if(!queued&&activeTransfer===controller)activeTransfer=null;
 }
}

export async function watchAutomaticZip(host,project,record,finished){
 const controller=new AbortController(),ownerUid=session.user?.uid;
 const elapsed=Math.max(0,Date.now()-Date.parse(record.createdAt))||0;
 const panel=progressDialog(host,project,record.assets[0]?.name||'Retained ZIP',controller,async()=>{
  await cancelNative(project,record.id,ownerUid);
  document.querySelector('#dialog').close();
 },()=>controller.abort(),elapsed);
 panel.report(inspectionDetail(record,elapsed));
 panel.ready();
 try{
  const result=await pollImport(project,record.id,{signal:controller.signal,onDetail:panel.report});
  if(panel.current()&&host.getProject()?.id===project.id&&session.user?.uid===ownerUid)await finished(result);
 }catch(error){if(error.name!=='AbortError')panel.failed(error.message);}
}
