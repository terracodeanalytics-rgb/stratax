import {api,session} from './auth.js';
import * as repository from './project-repository.js';

export async function browserRead(file,family,options,{previewOnly=true,onChunk,onProgress,signal}={}){
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

export async function resumableUpload(file,url,{signal,progress,checkScope=()=>{}}={}){
 const size=file.size,chunkSize=8*1024*1024;
 async function offset(){checkScope();const response=await fetch(url,{method:'PUT',headers:{'Content-Range':`bytes */${size}`},body:new Blob(),signal});if(response.ok)return size;if(response.status===308){const range=response.headers.get('Range');return range?Number(range.split('-')[1])+1:0;}throw new Error('This upload session expired. Restart the transfer; the original on your device is unchanged.');}
 let position=await offset();
 while(position<size){checkScope();const end=Math.min(size,position+chunkSize);let response;
  try{response=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/octet-stream','Content-Range':`bytes ${position}-${end-1}/${size}`},body:file.slice(position,end),signal});}
  catch(error){if(signal?.aborted)throw error;await new Promise(r=>setTimeout(r,1000));position=await offset();continue;}
  if(response.status===308){const range=response.headers.get('Range');position=range?Number(range.split('-')[1])+1:end;}else if(response.ok)position=size;else if([408,429,500,502,503,504].includes(response.status)){await new Promise(r=>setTimeout(r,1500));position=await offset();}else throw new Error('The file transfer was rejected. Reopen this import to resume or start a new transfer.');
  progress?.({loaded:position,total:size});
 }
}

export async function loadCloud(project){return api(`/api/projects/${project.id}/imports`);}
export async function nativeImport(project,files,family,options,{signal,onProgress,onSession}={}){
 const ownerUid=session.user?.uid,checkScope=()=>{if(session.user?.uid!==ownerUid)throw new Error('The signed-in account changed. The import was stopped.');},call=(path,options={})=>api(path,{...options,ownerUid});
 checkScope();
 const result=await call(`/api/projects/${project.id}/imports`,{method:'POST',body:{family,files:files.map(a=>({name:a.file.name,size:a.file.size,existing_id:a.existingId||null})),options}});
 onSession?.(result);
 for(const asset of result.assets){if(signal?.aborted)throw new DOMException('Cancelled','AbortError');const original=files.find(a=>a.file.name===asset.name);if(!asset.existing){const transfer=await call(`/api/projects/${project.id}/imports/${result.id}/upload/${asset.id}`,{method:'POST',body:{}});if(!transfer.stored)await resumableUpload(original.file,transfer.upload_url,{signal,checkScope,progress:p=>onProgress?.(`${asset.name} · ${Math.round(p.loaded/p.total*100)}% uploaded`)});await call(`/api/projects/${project.id}/imports/${result.id}/complete/${asset.id}`,{method:'POST',body:{}});}}
 await call(`/api/projects/${project.id}/imports/${result.id}/inspect`,{method:'POST',body:{}});
 checkScope();
 return pollImport(project,result.id,{signal,onProgress});
}
export async function pollImport(project,id,{signal,onProgress}={}){
 const ownerUid=session.user?.uid;let delay=1500;
 for(let attempt=0;attempt<900;attempt++){if(signal?.aborted)throw new DOMException('Cancelled','AbortError');const result=await api(`/api/projects/${project.id}/imports/${id}`,{ownerUid});onProgress?.(result.status==='inspecting'?'Inspecting retained originals…':result.status);if(!['inspecting','importing'].includes(result.status))return result;await new Promise(resolve=>setTimeout(resolve,delay));delay=Math.min(5000,delay+250);}
 throw new Error('Inspection is still running. You can reopen it from Import history.');
}
export async function commitNative(project,record,acknowledgeWarnings,templateName,replaceId,selection={}){return api(`/api/projects/${project.id}/imports/${record.id}/commit`,{method:'POST',body:{revision:record.revision,acknowledge_warnings:acknowledgeWarnings,template_name:templateName||null,replace_dataset_id:replaceId||null,...selection}});}
export async function cancelNative(project,id){return api(`/api/projects/${project.id}/imports/${id}/cancel`,{method:'POST',body:{}});}
export async function nativePreview(project,importId,datasetId){return api(`/api/projects/${project.id}/imports/${importId}/preview/${datasetId}`);}

export async function importLocal(project,workspace,assets,family,options,{signal,onProgress,onSave}={}){
 workspace.ingestion||={imports:[],datasets:[],templates:[]};
 const record={id:crypto.randomUUID(),schemaVersion:1,family,status:'importing',createdAt:new Date().toISOString(),options:structuredClone(options),assets:[],datasets:[],issues:[]};workspace.ingestion.imports.unshift(record);await onSave();
 for(const asset of assets){if(signal?.aborted){record.status='cancelled';await onSave();throw new DOMException('Cancelled','AbortError');}const file=asset.file;const fileOptions={...options,...options.perFile?.[file.name]};
  try{
   let meta=asset.existingId?workspace.files.find(f=>f.id===asset.existingId):null;
   if(!meta){if(asset.handle&&options.linkOriginals)meta=await repository.linkOriginal(project,asset.handle);else meta=(await repository.upload(project,file)).file;meta.type=family;meta.well=fileOptions.well||'';workspace.files.push(meta);}
   record.assets.push({id:meta.id,name:file.name,size:file.size,state:'stored'});await onSave();
   const result=await browserRead(file,family,fileOptions,{previewOnly:false,signal,onProgress:p=>onProgress?.(`${file.name} · ${p.rows.toLocaleString()} records`),onChunk:chunk=>repository.putArtifact(project,record.id,chunk.name,chunk.blob)});
   meta.sha256=result.sha256;
   if(workspace.ingestion.datasets.some(d=>d.sourceSha256&&d.sourceSha256===result.sha256)){record.issues.push({code:'exact_duplicate',severity:'warning',message:file.name+': an identical dataset already exists; duplicate activation was skipped.'});continue;}
   for(const dataset of result.datasets){dataset.importId=record.id;dataset.sourceId=meta.id;dataset.active=false;record.datasets.push(dataset);record.issues.push(...dataset.issues.map(i=>({...i,source:file.name})));}
  }catch(error){if(error.name==='AbortError'){record.status='cancelled';await onSave();throw error;}record.issues.push({code:error.code||'reader_failed',source:file.name,message:file.name+': '+error.message,severity:'blocking'});}
 }
 record.status=record.issues.some(i=>i.severity==='blocking')?'retained/unresolved':'awaiting confirmation';await onSave();return record;
}
export async function commitLocal(workspace,record,{templateName,replaceId,onSave,selection={}}){
 const selected=record.datasets.filter(d=>!selection.selected_dataset_ids||selection.selected_dataset_ids.includes(d.id));const sourceNames=new Set(record.assets.filter(a=>selected.some(d=>d.sourceId===a.id)).map(a=>a.name));if(!selected.length||record.issues.some(i=>i.severity==='blocking'&&(!i.source||sourceNames.has(i.source))))throw new Error('Resolve the selected datasets’ blocking issues before activation. Originals are retained.');
 if(replaceId&&selected.length!==1)throw new Error('Select one new dataset when replacing an active version.');for(const d of selected){const columns=selection.selected_columns?.[d.id];if(columns&&(!columns.length||columns.some(id=>!d.columns.some(c=>c.id===id))))throw new Error('Select at least one valid active column.');}record.status=record.issues.length?'retained/unresolved':'ready';for(const source of workspace.files){if(record.assets.some(a=>a.id===source.id)){source.status=record.status==='ready'?'Imported':'Imported · references unresolved';source.type=record.family;}}record.committedAt=new Date().toISOString();
 for(const dataset of selected){if(selection.selected_columns?.[dataset.id])dataset.activeColumns=selection.selected_columns[dataset.id];dataset.active=true;dataset.scientificApproval=false;workspace.ingestion.datasets.push(dataset);if(replaceId){const old=workspace.ingestion.datasets.find(d=>d.id===replaceId);if(old){old.active=false;old.supersededBy=dataset.id;dataset.previousVersion=old.id;}}}
 for(const [name,selection]of Object.entries(record.options.perFile||{})){if(sourceNames.has(name)&&selection.createWell&&selection.well&&!workspace.wellDrafts?.some(w=>w.id===selection.well)){workspace.wellDrafts||=[];workspace.wellDrafts.push({id:selection.well,source:record.id,status:'Imported registration',curves:record.datasets.filter(d=>d.well===selection.well).reduce((n,d)=>n+d.columns.length,0),depth:'Source reference'});}}
 if(templateName)workspace.ingestion.templates.push({id:crypto.randomUUID(),name:templateName,family:record.family,options:structuredClone(record.options),schemaVersion:1});
 workspace.audit.unshift({action:'Imported '+record.family+' evidence',time:record.committedAt});await onSave();return record;
}
