import {api, session, API_ORIGIN} from './auth.js';

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
  await item(key(project.id, 'draft'), record);
  if (!uid || activeUid !== uid || session.user?.uid !== uid) throw new Error('Sign in again before saving.');
  if (project.storage === 'cloud') return api('/api/projects/'+project.id, {method:'PUT', body:{revision:record.revision, project:record.project, workspace:record.workspace}});
  if (project.storage === 'local') {
    const dir = await directory(project.id);
    await writeFile(dir, 'project.stratax.json', JSON.stringify(record, null, 2));
    return record;
  }
  return {...record, unsaved:true};
}
export async function upload(project, file) {
  if (!file.size || file.size > 64*1024*1024) throw new Error('Choose a non-empty source file smaller than 64 MiB.');
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
  if (project.storage === 'local') return (await (await directory(project.id)).getDirectoryHandle('originals')).getFileHandle(file.id).then(h=>h.getFile());
  const value = await item(key(project.id, 'file:'+file.id));
  if (!value) throw new Error('The original file is missing from this device.');
  return value;
}
export async function exportPackage(project, workspace) {
  const originals = [];
  for (const file of workspace.files || []) {
    if (!file.id) continue;
    const blob = await source(project, file);
    const data = await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(blob);});
    originals.push({id:file.id, data});
  }
  return new Blob([JSON.stringify({schemaVersion:1, project, workspace, originals})], {type:'application/json'});
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
  delete record.originals;
  await item(key(record.project.id,'draft'),record);
  return record;
}
