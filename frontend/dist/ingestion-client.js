import {concurrent,registerEvidence} from './well-data.js';
import {api,session} from './auth.js';
import * as repository from './project-repository.js';

export async function browserRead(file,family,options,{previewOnly=true,onChunk,onProgress,signal}={}){
 if(signal?.aborted)throw new DOMException('Import cancelled','AbortError');
 return new Promise((resolve,reject)=>{
  const worker=new Worker('./ingestion-worker.js');
  const stop=()=>{worker.terminate();reject(Object.assign(new Error('Import cancelled. Originals already retained remain available.'),{name:'AbortError'}));};
  signal?.addEventListener('abort',stop,{once:true});
  const finish=()=>{worker.terminate();signal?.removeEventListener('abort',stop);};
  worker.onerror=()=>{finish();reject(new Error('The browser reader could not run. Retain the original or use a supported interchange export.'));};
  worker.onmessage=async event=>{const data=event.data;try{if(data.type==='chunk'){await onChunk?.(data);worker.postMessage({type:'ack',name:data.name});}if(data.type==='progress')onProgress?.(data);if(data.type==='error'){finish();reject(Object.assign(new Error(data.message),{code:data.code}));}if(data.type==='result'){finish();resolve(data);}}catch(error){finish();reject(error);}};
  worker.postMessage({type:'read',file,family,options,previewOnly});
 });
}

function uploadChunk(file,url,start,end,{signal,progress,checkScope}){
 return new Promise((resolve,reject)=>{if(signal?.aborted){reject(new DOMException('Cancelled','AbortError'));return;}checkScope();const request=new XMLHttpRequest(),abort=()=>request.abort(),finish=()=>signal?.removeEventListener('abort',abort);request.open('PUT',url);request.setRequestHeader('Content-Type','application/octet-stream');request.setRequestHeader('Content-Range',`bytes ${start}-${end-1}/${file.size}`);request.upload.onprogress=event=>progress?.({loaded:start+Math.min(event.loaded,end-start),total:file.size});request.onload=()=>{finish();resolve({status:request.status,ok:request.status>=200&&request.status<300,headers:{get:name=>request.getResponseHeader(name)}});};request.onerror=()=>{finish();reject(new Error('The transfer connection was interrupted.'));};request.onabort=()=>{finish();reject(new DOMException('Cancelled','AbortError'));};signal?.addEventListener('abort',abort,{once:true});request.send(file.slice(start,end));});
}
export async function resumableUpload(file,url,{signal,progress,checkScope=()=>{},fresh=false}={}){
 const size=file.size,baseChunk=8*1024*1024;
 let chunkSize=/\.zip$/i.test(file.name)&&size>32*1024*1024?4*baseChunk:baseChunk;
 async function offset(){checkScope();const response=await fetch(url,{method:'PUT',headers:{'Content-Range':`bytes */${size}`},body:new Blob(),signal});if(response.ok)return size;if(response.status===308){const range=response.headers.get('Range');return range?Number(range.split('-')[1])+1:0;}throw new Error('This upload session expired. Reopen this import to restart its transfer.');}
 let retries=0,position=fresh?0:await offset();progress?.({loaded:position,total:size});
 while(position<size){checkScope();const previous=position,end=Math.min(size,position+chunkSize);let response;
  try{response=await uploadChunk(file,url,position,end,{signal,progress,checkScope});}
  catch(error){if(signal?.aborted||error.name==='AbortError')throw error;chunkSize=baseChunk;if(++retries>8)throw new Error('Transfer interrupted repeatedly. Reopen this retained import to resume.');await new Promise(r=>setTimeout(r,1000));position=await offset();progress?.({loaded:position,total:size});continue;}
  if(response.status===308){const range=response.headers.get('Range');position=range?Number(range.split('-')[1])+1:0;}else if(response.ok)position=size;else if([408,429,500,502,503,504].includes(response.status)){chunkSize=baseChunk;if(++retries>8)throw new Error('Transfer interrupted repeatedly. Reopen this retained import to resume.');await new Promise(r=>setTimeout(r,1500));position=await offset();}else throw new Error('The file transfer was rejected. Reopen this import to resume.');
  if(position>previous)retries=0;else if(++retries>8)throw new Error('The server has not acknowledged this transfer. Reopen the import to resume.');progress?.({loaded:position,total:size});
 }
}

export async function loadCloud(project){return api(`/api/projects/${project.id}/imports`);}
export async function nativeImport(project,files,family,options,{signal,onProgress,onDetail,onSession}={}){
 const ownerUid=session.user?.uid,checkScope=()=>{if(session.user?.uid!==ownerUid)throw new Error('The signed-in account changed. The import was stopped.');},call=(path,settings={})=>api(path,{...settings,ownerUid});
 checkScope();onDetail?.({phase:'uploading',percent:null,message:'Preparing private transfer sessions'});
 const result=await call(`/api/projects/${project.id}/imports`,{method:'POST',body:{family,files:files.map(a=>({name:a.file.name,size:a.file.size,existing_id:a.existingId||null,client_id:a.id||null,family:a.family||family})),options}});onSession?.(result);
 const transferStarted=performance.now(),pending=result.assets.filter(a=>!a.existing),total=pending.reduce((n,a)=>n+a.size,0),loaded=new Map();
 const transferProgress=(asset,value,fileMessage)=>{loaded.set(asset.clientId||asset.id,value);const sum=[...loaded.values()].reduce((n,v)=>n+v,0),seconds=(performance.now()-transferStarted)/1000,rate=seconds>=2&&sum>0?' / '+(sum/1024**2/seconds).toFixed(1)+' MiB/s':'';onDetail?.({phase:'uploading',assetId:asset.clientId,percent:total?sum/total*100:100,filePercent:asset.size?value/asset.size*100:0,message:total?`${(sum/1024**2).toFixed(1)} of ${(total/1024**2).toFixed(1)} MiB transferred`+rate:'Reusing retained originals',fileMessage});};
 await concurrent(result.assets,3,async asset=>{if(signal?.aborted)throw new DOMException('Cancelled','AbortError');const candidates=files.filter(a=>a.file.name===asset.name),original=files.find(a=>a.id===asset.clientId)||(candidates.length===1?candidates[0]:null);if(!original)throw new Error('This source needs its stable asset association. Reopen the reviewed import.');if(asset.existing){onDetail?.({phase:'uploading',assetId:asset.clientId,percent:total?[...loaded.values()].reduce((n,v)=>n+v,0)/total*100:100,filePercent:100,message:'Reusing retained originals',fileMessage:'Retained original / no transfer needed'});return;}
  transferProgress(asset,0,'Preparing transfer');const transfer=await call(`/api/projects/${project.id}/imports/${result.id}/upload/${asset.id}`,{method:'POST',body:{}});if(!transfer.stored)await resumableUpload(original.file,transfer.upload_url,{signal,checkScope,fresh:transfer.fresh_session===true,progress:p=>{onProgress?.(`${asset.name} / ${Math.floor(p.loaded/p.total*100)}% uploaded`);transferProgress(asset,p.loaded,Math.floor(p.loaded/p.total*100)+'% transferred');}});transferProgress(asset,asset.size,'Confirming transfer');await call(`/api/projects/${project.id}/imports/${result.id}/complete/${asset.id}`,{method:'POST',body:{}});transferProgress(asset,asset.size,'Original retained');
 });
 const transferMs=performance.now()-transferStarted,inspectionStarted=performance.now();onDetail?.({phase:'inspecting',percent:null,message:'Starting private inspection. This can take a moment while the worker starts.'});for(const asset of result.assets)onDetail?.({phase:'inspecting',assetId:asset.clientId,filePercent:null,fileMessage:'Original retained / waiting for inspection'});await call(`/api/projects/${project.id}/imports/${result.id}/inspect`,{method:'POST',body:{}});
 checkScope();const inspected=await pollImport(project,result.id,{signal,onProgress,onDetail});inspected.timings={...(inspected.timings||{}),transferMs,inspectionWaitMs:performance.now()-inspectionStarted};return inspected;
}
function inspectionDetail(result,elapsedMs){
 const p=result.progress||{},startup={preparing:'Preparing inspection worker',starting:'Starting inspection worker',running:'Opening retained originals'},labels={expanding:'Expanding retained ZIP',queued:startup[result.workerStartup?.stage]||'Starting inspection worker',starting:'Opening retained originals',hashing:'Verifying the original',parsing:'Parsing source records',writing:'Saving parsed data',validating:'Checking mappings and references',saving:'Saving inspection manifests',complete:'Finishing this source',finalizing:'Finalizing inspection'},phase=p.phase||'queued';
 const count=Number(p.records||0),records=count.toLocaleString()+' records parsed',file=p.assetName||'',message=phase==='expanding'?`Expanding retained ZIP / ${((p.expandedBytes||0)/1024**2).toFixed(1)} MiB verified`:phase==='hashing'&&p.totalBytes?`${file} / ${(p.bytesRead/1024**2).toFixed(1)} of ${(p.totalBytes/1024**2).toFixed(1)} MiB verified`:['parsing','writing','validating','saving'].includes(phase)?`${file}${file?' / ':''}${count?records:'Reading the source structure'}${p.chunks?' / '+p.chunks+' chunks saved':''}`:phase==='queued'?'The inspection worker is starting. Your original is already retained.':phase==='finalizing'?'Saving the inspection results and review notes.':file||'Opening retained originals and preparing the reader.';
 const elapsed=Math.floor(elapsedMs/1000),age=p.updatedAt?Math.max(0,Math.floor(Date.now()/1000-p.updatedAt)):null,meta=`Elapsed ${Math.floor(elapsed/60)}m ${elapsed%60}s${p.totalAssets?' / '+p.completedAssets+' of '+p.totalAssets+' sources inspected':''}${age!==null&&phase!=='queued'?' / Last worker update '+age+'s ago':''}`;
 return {phase:'inspecting',label:labels[phase]||'Inspecting the evidence',percent:phase==='hashing'&&p.totalBytes?p.bytesRead/p.totalBytes*100:null,message,meta,...(p.assetKey?{assetId:p.assetKey,filePercent:phase==='complete'?100:null,fileMessage:phase==='complete'?'Inspection complete':labels[phase]+(count?' / '+records:'')}:{})};
}
export async function pollImport(project,id,{signal,onProgress,onDetail}={}){
 const ownerUid=session.user?.uid,started=performance.now();let latest;const pulse=setInterval(()=>{if(latest&&!signal?.aborted)onDetail?.(inspectionDetail(latest,performance.now()-started));},1000);
 try{for(let attempt=0;attempt<1800;attempt++){
  if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
  const result=await api(`/api/projects/${project.id}/imports/${id}`,{ownerUid});if(signal?.aborted)throw new DOMException('Cancelled','AbortError');latest=result;const detail=inspectionDetail(result,performance.now()-started);onProgress?.(detail.message);onDetail?.(detail);
  for(const assetId of result.progress?.completedAssetKeys||[])onDetail?.({phase:'inspecting',assetId,filePercent:100,fileMessage:'Inspection complete'});
  if(!['inspecting','importing'].includes(result.status))return result;
  await new Promise((resolve,reject)=>{const stop=()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));},timer=setTimeout(()=>{signal?.removeEventListener('abort',stop);resolve();},1500);signal?.addEventListener('abort',stop,{once:true});});
 }
 throw new Error('Inspection is still running. Reopen it from Import history.');
 }finally{clearInterval(pulse);}
}
export function importIssueApplies(issue,dataset,sourceName){
 return issue.datasetId?issue.datasetId===dataset.id:
  (!issue.sourceId&&!issue.source)||(issue.sourceId&&issue.sourceId===dataset.sourceId)||(issue.source&&issue.source===sourceName);
}

export function readyImportDatasets(record,pendingIds=[]){
 if(!record||record.committedAt||!['awaiting confirmation','retained/unresolved'].includes(record.status))return [];
 const sourceNames=new Map((record.assets||[]).map(asset=>[asset.id,asset.name]));
 const blockers=(record.issues||[]).filter(issue=>issue.severity==='blocking');
 const pending=new Set(pendingIds);
 return (record.datasets||[]).filter(dataset=>!pending.has(dataset.id)&&
  !dataset.issues?.some(issue=>issue.severity==='blocking')&&
  !blockers.some(issue=>importIssueApplies(issue,dataset,sourceNames.get(dataset.sourceId))));
}

export async function commitNative(project,record,acknowledgeWarnings,templateName,replaceId,selection={}){return api(`/api/projects/${project.id}/imports/${record.id}/commit`,{method:'POST',body:{revision:record.revision,acknowledge_warnings:acknowledgeWarnings,template_name:templateName||null,replace_dataset_id:replaceId||null,...selection}});}
export async function cancelNative(project,id){return api(`/api/projects/${project.id}/imports/${id}/cancel`,{method:'POST',body:{}});}
export async function nativePreview(project,importId,datasetId){return api(`/api/projects/${project.id}/imports/${importId}/preview/${datasetId}`);}

export async function importLocal(project,workspace,assets,family,options,{signal,onProgress,onDetail,onSave}={}){
 workspace.ingestion||={imports:[],datasets:[],templates:[]};
 const started=performance.now();const record={id:crypto.randomUUID(),schemaVersion:2,family,status:'importing',createdAt:new Date().toISOString(),options:structuredClone(options),assets:[],datasets:[],issues:[]};workspace.ingestion.imports.unshift(record);await onSave();
 for(const asset of assets){if(signal?.aborted){record.status='cancelled';await onSave();throw new DOMException('Cancelled','AbortError');}const file=asset.file;const fileOptions={...options,...options.perFile?.[file.name],...options.perAsset?.[asset.id]},sourceFamily=asset.family||family;
  try{
   onDetail?.({phase:'retaining',assetId:asset.id,percent:null,filePercent:null,message:'Retaining '+file.name,fileMessage:'Saving original'});let meta=asset.existingId?workspace.files.find(f=>f.id===asset.existingId):null;
   if(!meta&&asset.sha256)meta=workspace.files.find(f=>f.sha256===asset.sha256&&f.size===file.size);
   if(!meta){if(asset.handle&&fileOptions.linkOriginals)meta=await repository.linkOriginal(project,asset.handle);else meta=(await repository.upload(project,file)).file;meta.type=sourceFamily;meta.well=fileOptions.well||'';workspace.files.push(meta);}
   record.assets.push({id:meta.id,clientId:asset.id,name:file.name,size:file.size,family:sourceFamily,state:'stored'});if(fileOptions.archive)meta.archive=fileOptions.archive;await onSave();if(fileOptions.retainOnly){if(!meta.sha256){const fingerprint=await browserRead(file,'documents',{fingerprintOnly:true},{signal,onProgress:p=>onDetail?.({phase:'hashing',assetId:asset.id,percent:p.loaded/p.total*100,filePercent:p.loaded/p.total*100,message:'Verifying retained ZIP original',fileMessage:Math.floor(p.loaded/p.total*100)+'% verified'})});meta.sha256=fingerprint.sha256;await onSave();}onDetail?.({phase:'retaining',assetId:asset.id,filePercent:100,message:'ZIP original retained',fileMessage:'Original archive retained'});continue;}
   const result=await browserRead(file,sourceFamily,{...fileOptions,knownSha256:asset.sha256},{previewOnly:false,signal,onProgress:p=>{onProgress?.(p.hashing?`Checking ${file.name}`:`Reading ${file.name} / ${Number(p.rows||0).toLocaleString()} records`);onDetail?.({phase:p.hashing?'hashing':'parsing',assetId:asset.id,percent:p.total?p.loaded/p.total*100:null,filePercent:p.total?p.loaded/p.total*100:null,message:p.total?`${file.name} / ${(p.loaded/1024**2).toFixed(1)} of ${(p.total/1024**2).toFixed(1)} MiB read`:file.name,fileMessage:p.rows?Number(p.rows).toLocaleString()+' records read':'Reading original'});},onChunk:chunk=>repository.putArtifact(project,record.id,chunk.name,chunk.blob)});
   meta.sha256=result.sha256;onDetail?.({phase:'parsing',assetId:asset.id,percent:null,filePercent:100,message:file.name+' inspected',fileMessage:'Inspected'});
   for(const dataset of result.datasets){if(fileOptions.archive)dataset.metadata.archive=fileOptions.archive;dataset.importId=record.id;dataset.sourceId=meta.id;dataset.assetKey=asset.id;dataset.active=false;record.datasets.push(dataset);record.issues.push(...dataset.issues.map(i=>({...i,source:file.name})));}
  }catch(error){if(error.name==='AbortError'){record.status='cancelled';await onSave();throw error;}record.issues.push({code:error.code||'reader_failed',source:file.name,message:file.name+': '+error.message,severity:'blocking'});}
 }
 const crossNotes=globalThis.StrataxWellEvidence.crossWellIssues(workspace,record.datasets);record.issues.push(...crossNotes);for(const dataset of record.datasets)dataset.issues.push(...crossNotes.filter(n=>n.assetKey===dataset.assetKey));record.timings={parseAndRetentionMs:performance.now()-started};record.status=record.issues.some(i=>i.severity==='blocking')?'retained/unresolved':'awaiting confirmation';await onSave();return record;
}
export async function commitLocal(workspace,record,{templateName,replaceId,onSave,selection={}}){
 if(record.committedAt)throw new Error('Accepted evidence is retained. Resolve pending sources in a linked inspection.');
 const selected=record.datasets.filter(d=>!selection.selected_dataset_ids||selection.selected_dataset_ids.includes(d.id));const sourceNames=new Set(record.assets.filter(a=>selected.some(d=>d.sourceId===a.id)).map(a=>a.name));if(!selected.length||record.issues.some(i=>i.severity==='blocking'&&(!i.source||sourceNames.has(i.source))))throw new Error('Resolve the selected datasets’ blocking issues before activation. Originals are retained.');
 if(replaceId&&selected.length!==1)throw new Error('Select one new dataset when replacing an active version.');for(const d of selected){const columns=selection.selected_columns?.[d.id];if(columns&&(!columns.length||columns.some(id=>!d.columns.some(c=>c.id===id))))throw new Error('Select at least one valid active column.');}record.status=record.issues.length?'retained/unresolved':'ready';for(const source of workspace.files){if(selected.some(d=>d.sourceId===source.id)){source.status=record.status==='ready'?'Imported':'Imported · references unresolved';source.type=record.assets.find(a=>a.id===source.id)?.family||record.family;}}record.committedAt=new Date().toISOString();
 for(const dataset of selected){if(selection.selected_columns?.[dataset.id])dataset.activeColumns=selection.selected_columns[dataset.id];dataset.active=true;dataset.scientificApproval=false;workspace.ingestion.datasets.push(dataset);if(replaceId){const old=workspace.ingestion.datasets.find(d=>d.id===replaceId);if(old){old.active=false;old.supersededBy=dataset.id;dataset.previousVersion=old.id;}}}
 registerEvidence(workspace,selected);
 for(const [name,selection]of Object.entries(record.options.perFile||{})){if(sourceNames.has(name)&&selection.createWell&&selection.well&&!workspace.wellDrafts?.some(w=>w.id===selection.well)){workspace.wellDrafts||=[];workspace.wellDrafts.push({id:selection.well,source:record.id,status:'Imported registration',curves:record.datasets.filter(d=>d.well===selection.well).reduce((n,d)=>n+d.columns.length,0),depth:'Source reference'});}}
 if(templateName)workspace.ingestion.templates.push({id:crypto.randomUUID(),name:templateName,family:record.family,options:structuredClone(record.options),schemaVersion:1});
 workspace.audit||=[];workspace.audit.unshift({action:'Imported '+record.family+' evidence',time:record.committedAt});await onSave();return record;
}
