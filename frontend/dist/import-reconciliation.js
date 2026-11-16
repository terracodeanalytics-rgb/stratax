// Three-way merge of import-owned changes and unrelated edits made during inspection.
export const workspaceValuesEqual=(a,b)=>{
 if(a===b)return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a).filter(k=>a[k]!==undefined);
 return keys.length===Object.keys(b).filter(k=>b[k]!==undefined).length&&keys.every(k=>Object.hasOwn(b,k)&&workspaceValuesEqual(a[k],b[k]));
};
const equal=workspaceValuesEqual;
export function reconcileImportWorkspace(base,local,remote,path='workspace'){
 if(equal(local,base))return structuredClone(remote);
 if(equal(remote,base)||equal(local,remote))return structuredClone(local);
 if(path==='workspace.audit'&&[base,local,remote].every(Array.isArray)){
  const added=value=>value.length>=base.length&&equal(value.slice(value.length-base.length),base)?value.slice(0,value.length-base.length):null;
  const ours=added(local),theirs=added(remote);
  if(ours&&theirs)return structuredClone([...ours,...theirs.filter(v=>!ours.some(w=>equal(v,w))),...base]);
 }
 if(/^workspace\.mapWorkspace\.(hiddenWells|removedWells)$/.test(path)&&[base??[],local,remote].every(v=>Array.isArray(v)&&v.every(id=>typeof id==='string'))){
  const before=new Set(base||[]),ours=new Set(local),theirs=new Set(remote);
  return [...new Set([...theirs,...ours])].filter(id=>ours.has(id)===before.has(id)?theirs.has(id):ours.has(id));
 }
 if(Array.isArray(local)&&Array.isArray(remote)&&(base===undefined||Array.isArray(base))&&[...(base||[]),...local,...remote].every(v=>v&&typeof v==='object'&&v.id)){
  const before=new Map((base||[]).map(v=>[v.id,v])),ours=new Map(local.map(v=>[v.id,v])),theirs=new Map(remote.map(v=>[v.id,v]));
  return [...new Set([...theirs.keys(),...ours.keys()])].map(id=>reconcileImportWorkspace(before.get(id),ours.get(id),theirs.get(id),path+'.'+id)).filter(v=>v!==undefined);
 }
 if(local&&remote&&!Array.isArray(local)&&!Array.isArray(remote)&&typeof local==='object'&&typeof remote==='object'){
  return Object.fromEntries([...new Set([...Object.keys(base||{}),...Object.keys(local),...Object.keys(remote)])].map(key=>[key,reconcileImportWorkspace(base?.[key],local[key],remote[key],path+'.'+key)]).filter(([,value])=>value!==undefined));
 }
 throw Object.assign(new Error('Cloud and device edits overlap at '+path+'. Your edits remain on this device. Use Review save conflict to recover both versions.'),{code:'project_conflict'});
}
