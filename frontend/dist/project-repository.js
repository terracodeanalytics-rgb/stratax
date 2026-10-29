import {api, session, API_ORIGIN} from './auth.js';
import {remapSeismicCopy} from './seismic-transfer.js';

const handles = new Map();
let activeUid = null;
export const folderSupported = () => typeof window.showDirectoryPicker === 'function' && window.self === window.top;
const id = () => crypto.randomUUID();
const db = () => new Promise((resolve, reject) => {
  const req = indexedDB.open('stratax-project-storage', 1);
  req.onupgradeneeded = () => req.result.createObjectStore('items');
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(new Error('Device storage is unavailable.'));
});
async function item(key, value) {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction('items', value === undefined ? 'readonly' : 'readwrite');
    const req = value === undefined ? tx.objectStore('items').get(key) : tx.objectStore('items').put(value, key);
    tx.oncomplete = () => { database.close(); resolve(req.result); };
    tx.onerror = () => { database.close(); reject(new Error('Your device could not save this project.')); };
  });
}
function key(projectId, suffix = 'handle') { return `${session.user.uid}:${projectId}:${suffix}`; }
export function resetRepository() { activeUid = session.user?.uid; handles.clear(); }
async function directory(projectId, request = false) {
  let handle = handles.get(projectId) || await item(key(projectId));
  if (!handle) throw new Error('Reconnect the project folder to save changes.');
  const options = {mode:'readwrite'};
  let permission = await handle.queryPermission(options);
  if (permission !== 'granted' && request) permission = await handle.requestPermission(options);
  if (permission !== 'granted') throw new Error('Reconnect the project folder to allow saving.');
  handles.set(projectId, handle);
  return handle;
}
async function writeFile(dir, name, value) {
  const file = await dir.getFileHandle(name, {create:true});
  const stream = await file.createWritable();
  try { await stream.write(value); await stream.close(); } catch (error) { await stream.abort().catch(()=>{}); throw error; }
}
export async function chooseFolder(projectId) {
  const root = await window.showDirectoryPicker({mode:'readwrite'});
  const handle = await root.getDirectoryHandle(`StrataX-${projectId}`, {create:true});
  handles.set(projectId, handle);
  await item(key(projectId), handle);
  return handle.name;
}
export async function reconnect(projectId) { return directory(projectId, true); }
export async function listCloud() {
  let cursor = null, records = [];
  do { const result = await api('/api/projects' + (cursor ? '?cursor='+encodeURIComponent(cursor) : '')); records.push(...result.projects); cursor = result.next_cursor; } while (cursor);
  return records;
}
export async function load(project) {
  if (project.storage === 'cloud') return api('/api/projects/'+project.id);
  if (project.storage === 'local') {
    const dir = await directory(project.id, true);
    const text = await (await (await dir.getFileHandle('project.stratax.json')).getFile()).text();
    return validate(JSON.parse(text));
  }
  const cached = await item(key(project.id, 'draft'));
  if (!cached) throw new Error('Open the project package to recover this workspace.');
  return cached;
}
export async function save(project, workspace) {
  const uid=session.user?.uid;
  const record = {schemaVersion:1, project:structuredClone(project), workspace:structuredClone(workspace), revision:project.revision || 0};
  // Recovery cache is never represented as a destination save.
  try {await item(key(project.id, 'draft'), record);} catch(error) {if(project.storage !== 'cloud' && project.storage !== 'local')throw error;}
  if (!uid || activeUid !== uid || session.user?.uid !== uid) throw new Error('Sign in again before saving.');
  if (project.storage === 'cloud') {delete record.workspace.ingestion;return api('/api/projects/'+project.id, {method:'PUT', body:{revision:record.revision, project:record.project, workspace:record.workspace}});}
  if (project.storage === 'local') {
    const dir = await directory(project.id);
    await writeFile(dir, 'project.stratax.json', JSON.stringify(record, null, 2));
    return record;
  }
  return {...record, unsaved:true};
}
export async function upload(project, file) {
  if (!file.size || file.size > (project.storage==='cloud'?64*1024*1024:10*1024**3)) throw new Error('This file exceeds the selected storage transfer limit. Use the guided Cloud importer for large uploads.');
  if(project.storage==='portable'&&file.size>128*1024**2)throw new Error('Use a local folder or Cloud project for this large file. Portable packages cannot retain it safely.');
  const fileId = id();
  if (project.storage === 'cloud') {
    const response = await fetch(API_ORIGIN+`/api/projects/${project.id}/files/${fileId}`, {method:'PUT', headers:{Authorization:'Bearer '+await session.user.getIdToken(), 'Content-Type':'application/octet-stream', 'X-File-Name':encodeURIComponent(file.name)}, body:file});
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'The source file could not be stored.');
    return data;
  }
  if (project.storage === 'local') {
    const root = await directory(project.id);
    const originals = await root.getDirectoryHandle('originals', {create:true});
    await writeFile(originals, fileId, file);
  } else await item(key(project.id, 'file:'+fileId), file);
  return {file:{id:fileId, name:file.name, size:file.size, type:'Source file', well:'', status:'Stored · not parsed', local:true, uploadedAt:new Date().toISOString()}};
}
export async function source(project, file) {
  if (!file.id) throw new Error('This legacy record has no original file. Import the original to retain it.');
  if (project.storage === 'cloud') {
    const response = await fetch(API_ORIGIN+`/api/projects/${project.id}/files/${file.id}`, {headers:{Authorization:'Bearer '+await session.user.getIdToken()}});
    if (!response.ok) throw new Error('The original file could not be opened.');
    return response.blob();
  }
  if(file.external){const handle=await item(key(project.id,'external:'+file.id));if(!handle)throw new Error('Reconnect the linked original file.');if(await handle.queryPermission({mode:'read'})!=='granted')throw new Error('Permission to the linked original is required. Reconnect it from the import panel.');return handle.getFile();}
  if (project.storage === 'local') return (await (await directory(project.id)).getDirectoryHandle('originals')).getFileHandle(file.id).then(h=>h.getFile());
  const value = await item(key(project.id, 'file:'+file.id));
  if (!value) throw new Error('The original file is missing from this device.');
  return value;
}
export async function exportPackage(project, workspace) {
  if(project.storage==='cloud'&&workspace.ingestion?.datasets?.length)throw new Error('This Cloud project includes native parsed artifacts. Keep it in Cloud storage or download its originals individually; a complete Cloud-to-portable conversion is not available yet. No partial package was created.');
  if((workspace.files||[]).reduce((sum,f)=>sum+(Number(f.size)||0),0)>128*1024**2)throw new Error('This project is too large for a portable download. Keep the complete local folder bundle, or download originals individually from Cloud. No originals have been omitted.');
  const originals = [];
  for (const file of workspace.files || []) {
    if (!file.id) continue;
    const blob = await source(project, file);
    const data = await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob);});
    originals.push({id:file.id, data});
  }
  const artifacts=[];let total=0;
  for(const session of workspace.ingestion?.imports||[])for(const dataset of session.datasets||[])for(const chunk of dataset.chunks||[]){const blob=await getArtifact(project,session.id,chunk.name);total+=blob.size;if(total>64*1024**2)throw new Error('Derived data exceeds the portable package budget. Retain the complete project folder instead.');const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob);});artifacts.push({importId:session.id,name:chunk.name,data});}
  return new Blob([JSON.stringify({schemaVersion:1, project, workspace, originals, artifacts})], {type:'application/json'});
}
function validate(record) {
  if (record.schemaVersion !== 1 || !record.project || !record.workspace || !Array.isArray(record.workspace.files)) throw new Error('Choose a valid StrataX project package.');
  const p = record.project;
  if (!/^[\w-]{1,100}$/.test(p.id) || typeof p.name !== 'string' || !p.name.trim() || p.name.length>100 || !Array.isArray(p.workflows) || !p.workflows.length || p.workflows.some(w=>!['petrophysics','seismic'].includes(w))) throw new Error('This project has invalid setup information.');
  if (p.coordinates && (!Number.isFinite(p.coordinates.lat)||!Number.isFinite(p.coordinates.lng)||Math.abs(p.coordinates.lat)>90||Math.abs(p.coordinates.lng)>180)) throw new Error('This project has invalid coordinates.');
  if (record.workspace.files.some(f=>!f.id || !/^[\w-]{1,100}$/.test(f.id))) throw new Error('This project contains invalid source references.');
  return record;
}
export async function openLocal() {
  if (folderSupported()) {
    const handle = await window.showDirectoryPicker({mode:'readwrite'});
    const record = validate(JSON.parse(await (await (await handle.getFileHandle('project.stratax.json')).getFile()).text()));
    record.project.storage='local';record.project.directoryName=handle.name;
    handles.set(record.project.id,handle);await item(key(record.project.id),handle);
    return record;
  }
  return new Promise(resolve=>{const input=document.createElement('input');input.type='file';input.accept='.json,.stratax';input.onchange=async()=>{try{resolve(await importPackage(input.files[0]));}catch(error){resolve({error});}};input.oncancel=()=>resolve(null);input.click();});
}
export async function importPackage(file) {
  if (!file || file.size>256*1024*1024) throw new Error('Choose a project package smaller than 256 MiB.');
  const record = validate(JSON.parse(await file.text()));
  const originals=record.originals||[];
  if (record.workspace.files.some(f=>!originals.some(o=>o.id===f.id))) throw new Error('This package is missing original files.');
  record.project.id=id();record.project.storage='portable';record.project.revision=0;
  for (const f of originals) {
    if (!/^[\w-]{1,100}$/.test(f.id)) throw new Error('Invalid original file reference.');
    const bytes=Uint8Array.from(atob(f.data),c=>c.charCodeAt(0));
    await item(key(record.project.id,'file:'+f.id),new Blob([bytes]));
  }
  for(const artifact of record.artifacts||[]){await putArtifact(record.project,artifact.importId,artifact.name,new Blob([Uint8Array.from(atob(artifact.data),c=>c.charCodeAt(0))]));}
  delete record.artifacts;
  delete record.originals;
  await item(key(record.project.id,'draft'),record);
  return record;
}

function artifactName(value){if(!/^[\w.-]{1,180}$/.test(value)||value==='.'||value==='..')throw new Error('Invalid artifact reference.');return value;}
export async function putArtifact(project,importId,name,blob){artifactName(importId);artifactName(name);if(project.storage==='local'){const root=await directory(project.id);const dir=await(await root.getDirectoryHandle('datasets',{create:true})).getDirectoryHandle(importId,{create:true});await writeFile(dir,name,blob);}else await item(key(project.id,'artifact:'+importId+':'+name),blob);}
export async function getArtifact(project,importId,name){artifactName(importId);artifactName(name);if(project.storage==='local'){const root=await directory(project.id);const dir=await(await root.getDirectoryHandle('datasets')).getDirectoryHandle(importId);return(await dir.getFileHandle(name)).getFile();}const blob=await item(key(project.id,'artifact:'+importId+':'+name));if(!blob)throw new Error('A derived artifact is missing. Reinspect the retained original.');return blob;}
export async function linkOriginal(project,handle){if(project.storage!=='local')throw new Error('Linked originals require a local folder project.');const file=await handle.getFile();const fileId=id();await item(key(project.id,'external:'+fileId),handle);return {id:fileId,name:file.name,size:file.size,type:'Source file',well:'',status:'Linked original · not parsed',external:true,local:true};}

export async function copyToCloud(project,workspace,name,onProgress=()=>{}){
  if(project.storage==='cloud')throw new Error('This project is already stored in Cloud.');
  if(!name.trim()||name.length>100)throw new Error('Enter a Cloud project name up to 100 characters.');
  const ownerUid=session.user?.uid,checkScope=()=>{if(!ownerUid||session.user?.uid!==ownerUid)throw new Error('The signed-in account changed. The copy was stopped.');};
  checkScope();
  const {nativeImport,commitNative}=await import('./ingestion-client.js');
  const copy={...structuredClone(project),id:id(),name:name.trim(),storage:'cloud',status:'Active',revision:0,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  delete copy.directoryName;delete copy.pendingSave;
  const context=structuredClone(workspace);context.project=copy.name;context.files=[];delete context.ingestion;
  if(context.interpretation){for(const w of context.interpretation.windows||[]){delete w.runId;delete w.configurationId;delete w.configurationRevision;}}
  let record=await save(copy,context);copy.revision=record.revision;
  checkScope();
  onProgress('Cloud copy created. Retaining originals…');
  const datasetIds={},sourceIds={};let completed=0;
  try{
    for(const original of workspace.files||[]){
      const blob=await source(project,original),file=new File([blob],original.name,{type:blob.type});
      checkScope();
      const previous=workspace.ingestion?.imports?.find(r=>r.assets?.some(a=>a.id===original.id));
      const family=previous?.family||(workspace.ingestion?.datasets||[]).find(d=>d.sourceId===original.id)?.family||'documents',options=structuredClone(previous?.options||{});
      const imported=await nativeImport(copy,[{file}],family,options,{onProgress:text=>onProgress(`${completed+1}/${workspace.files.length} · ${text}`)});
      checkScope();
      sourceIds[original.id]=imported.assets[0].id;
      const oldActive=(workspace.ingestion?.datasets||[]).filter(d=>d.sourceId===original.id&&d.active!==false);
      const chosen=(imported.datasets||[]).filter(d=>oldActive.some(old=>old.name===d.name&&old.rowCount===d.rowCount));
      for(const d of chosen){const old=oldActive.find(v=>v.name===d.name&&v.rowCount===d.rowCount);if(old)datasetIds[old.id]=d.id;}
      if(chosen.length&&!imported.issues?.some(i=>i.severity==='blocking'))await commitNative(copy,imported,true,null,null,{selected_dataset_ids:chosen.map(d=>d.id)});
      completed++;onProgress(`${completed}/${workspace.files.length} originals retained in Cloud.`);
    }
    record=await load(copy);copy.revision=record.revision;
    checkScope();
    for(const w of context.interpretation?.windows||[]){if(w.datasetId)w.datasetId=datasetIds[w.datasetId]||'';for(const b of Object.values(w.bindings||{})){b.datasetId=datasetIds[b.datasetId]||'';b.confirmed=false;}}
    for(const note of context.interpretation?.annotations||[])if(note.datasetId)note.datasetId=datasetIds[note.datasetId]||null;
    for(const b of context.interpretation?.board?.books||[])for(const well of b.wells||[])for(const track of well.tracks||[])for(const curve of track.curves||[])curve.datasetId=datasetIds[curve.datasetId]||curve.datasetId;
    if(context.seismicWorkspace||context.seismicProcessing){const resources=copy.workflows.includes('seismic')?await api(`/api/projects/${copy.id}/seismic`,{ownerUid}):{sources:[]};checkScope();remapSeismicCopy(context,workspace,datasetIds,resources.sources,project.id);}
    context.files=record.workspace.files;
    context.audit||=[];context.audit.unshift({action:'Created independent Cloud copy from Local originals',time:new Date().toISOString()});
    record=await save(copy,context);
    return record;
  }catch(error){checkScope();throw new Error(`Cloud copy “${copy.name}” retains ${completed} completed source transfers and is available in My projects. Your Local project is unchanged. ${error.message}`);}
}
