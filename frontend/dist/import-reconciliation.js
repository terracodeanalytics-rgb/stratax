// Three-way merge of import-owned changes and unrelated edits made during inspection.
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function reconcileImportWorkspace(base,local,remote,path='workspace'){
 if(equal(local,base))return structuredClone(remote);
 if(equal(remote,base)||equal(local,remote))return structuredClone(local);
 if(Array.isArray(local)&&Array.isArray(remote)&&[...(base||[]),...local,...remote].every(v=>v&&typeof v==='object'&&v.id)){
  const before=new Map((base||[]).map(v=>[v.id,v])),ours=new Map(local.map(v=>[v.id,v])),theirs=new Map(remote.map(v=>[v.id,v]));
  return [...new Set([...theirs.keys(),...ours.keys()])].map(id=>reconcileImportWorkspace(before.get(id),ours.get(id),theirs.get(id),path+'.'+id)).filter(v=>v!==undefined);
 }
 if(local&&remote&&!Array.isArray(local)&&!Array.isArray(remote)&&typeof local==='object'&&typeof remote==='object'){
  const result={};for(const key of new Set([...Object.keys(base||{}),...Object.keys(local),...Object.keys(remote)]))result[key]=reconcileImportWorkspace(base?.[key],local[key],remote[key],path+'.'+key);return result;
 }
 throw Object.assign(new Error('Import completed, but '+path+' also changed elsewhere. Your edits remain on this device. Use Review save conflict to recover both versions.'),{code:'project_conflict'});
}
