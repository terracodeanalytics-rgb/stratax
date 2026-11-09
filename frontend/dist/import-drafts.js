// Device File objects stay in memory; only metadata enters project state.
const sessions=new Map();
export function ingestionState(workspace){const value=workspace.ingestion||={};for(const key of ['imports','datasets','templates'])value[key]||=[];return value;}
export function draftKey(owner,project){return owner+':'+project;}
export function retainImportDraft(key,workspace,value){sessions.set(key,value);ingestionState(workspace).draft={step:value.step,importId:value.record?.id||null,sources:value.assets.map(a=>({id:a.id,name:a.file.name,size:a.file.size,existingId:a.existingId||null})),requiresReselection:value.assets.some(a=>!a.existingId),updatedAt:new Date().toISOString()};}
export function restoreImportDraft(key){return sessions.get(key);}
export function clearImportDraft(key,workspace){sessions.delete(key);delete ingestionState(workspace).draft;}
export function rememberImport(workspace,record){const state=ingestionState(workspace),index=state.imports.findIndex(i=>i.id===record.id);if(index<0)state.imports.unshift(record);else state.imports[index]=record;return record;}
