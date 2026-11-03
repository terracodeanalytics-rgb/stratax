export function readArchive(file,{password='',signal,onProgress,maxExpandedBytes=1024**3,maxFiles=99}={}){
 if(signal?.aborted)return Promise.reject(new DOMException('Cancelled','AbortError'));
 return new Promise((resolve,reject)=>{
  const worker=new Worker('./archive-worker.js'),finish=()=>{clearTimeout(timer);worker.terminate();signal?.removeEventListener('abort',stop);},stop=()=>{finish();reject(new DOMException('Archive reading cancelled','AbortError'));},timer=setTimeout(()=>{finish();reject(new Error('ZIP reading exceeded two minutes. Split the archive into smaller batches.'));},120000);
  signal?.addEventListener('abort',stop,{once:true});worker.onerror=()=>{finish();reject(new Error('The ZIP reader could not run. Extract the files and add them directly.'));};
  worker.onmessage=({data})=>{if(data.type==='progress')onProgress?.(data);if(data.type==='result'){finish();resolve(data);}};worker.postMessage({file,password,maxExpandedBytes,maxFiles});
 });
}

const tokens=value=>String(value||'').toLowerCase().replace(/\.[^.]+$/,'').replace(/[_./-]+/g,' ').replace(/\b(logs?|las|plan|deviations?|dev|surveys?|trajectory|tops?|headers?|checkshots?)\b/g,'').replace(/[^a-z0-9]/g,'');
export function relatedLogSuggestions(assets){
 const logs=assets.filter(a=>['logs','arrays'].includes(a.family)&&!a.retainOnly);
 for(const source of assets.filter(a=>a.archive&&!a.relatedTo&&!a.requiredOwner&&['deviation','tops','checkshots','core','pressure','fluids','geochemistry','production'].includes(a.family))){
  if(Object.keys(source.bindings||{}).length>1){source.archiveAssociationNote='Multi-well table / review row-level associations in Match.';continue;}
  const strongOwner=source.matches?.length===1?source.matches[0].id:Object.values(source.bindings||{})[0],strong=strongOwner?logs.filter(log=>log.options.well===strongOwner):[],directory=source.archive.path.split('/').slice(0,-1).join('/'),stem=tokens(source.file.name),matches=logs.filter(log=>log.archive?.rootId===source.archive.rootId&&(tokens(log.file.name)===stem&&stem||tokens(log.wellName)===stem&&stem));
  const scoped=strong.length?strong:matches.length?matches:logs.filter(log=>log.archive?.rootId===source.archive.rootId&&log.archive.path.split('/').slice(0,-1).join('/')===directory);
  if(scoped.length===1||scoped.length>1&&scoped.every(log=>log.options.well)&&new Set(scoped.map(log=>log.options.well)).size===1){source.relatedTo=scoped[0].id;source.autoRelated=true;}else if(scoped.length>1)source.archiveAssociationNote='Several logs could own this source. Choose its well in Match.';
 }
}
