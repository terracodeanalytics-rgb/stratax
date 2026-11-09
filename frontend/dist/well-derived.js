import {api,session} from './auth.js';
import * as repository from './project-repository.js';
import './well-evidence.js';
const evidence=globalThis.StrataxWellEvidence;
export async function retainedRows(host,dataset,maxRows=250000){
 if(dataset.rowCount>maxRows)throw new Error('This view supports '+maxRows.toLocaleString()+' records. Prepare a bounded dataset.');
 const ownerUid=session.user?.uid,project=host.getProject(),workspace=host.getState(),rows=[];let columns=dataset.columns,references=dataset.references||{},metadata=dataset.metadata||{};
 if(project.storage==='cloud'){for(let start=0;start<dataset.rowCount;start+=5000){const page=await api(`/api/projects/${project.id}/science/datasets/${dataset.id}/rows?start=${start}&limit=5000`);if(host.getProject()?.id!==project.id||session.user?.uid!==ownerUid)throw new Error('The project changed while loading evidence.');if(!page.rows.length)throw new Error('The stored row index ended before its manifest.');rows.push(...page.rows);columns=page.columns;metadata=page.metadata||metadata;references=page.references||references;}}
 else{const full=workspace.ingestion?.imports?.find(r=>r.id===dataset.importId)?.datasets?.find(d=>d.id===dataset.id)||dataset;columns=full.columns;metadata=full.metadata||metadata;for(const chunk of full.chunks||[]){const blob=await repository.getArtifact(project,dataset.importId,chunk.name);if(blob.size>16*1024**2)throw new Error('A stored chunk exceeds the view reader budget.');const text=chunk.name.endsWith('.gz')?await new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).text():await blob.text();if(text.length>64*1024**2)throw new Error('The expanded chunk exceeds the view reader budget.');for(const line of text.split('\n'))if(line.trim()){rows.push(JSON.parse(line));if(rows.length>maxRows)throw new Error('The retained source exceeds its row budget.');}}}
 if(host.getProject()?.id!==project.id||session.user?.uid!==ownerUid)throw new Error('The evidence scope changed while loading.');if(rows.length!==dataset.rowCount)throw new Error('Stored records do not match their manifest. A partial view was not displayed.');return {rows,columns,references,metadata};
}
const monotonic=new WeakMap();
export function interpolate(stations,from,to,value){
 if(!Number.isFinite(value)||stations.length<2)return null;let fields=monotonic.get(stations);if(!fields){fields=new Map();monotonic.set(stations,fields);}if(!fields.has(from))fields.set(from,stations.every((p,i)=>Number.isFinite(p[from])&&(!i||p[from]>stations[i-1][from])));if(!fields.get(from)||value<stations[0][from]||value>stations.at(-1)[from])return null;
 let lo=0,hi=stations.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(stations[mid][from]<=value)lo=mid;else hi=mid;}const a=stations[lo],b=stations[hi];return Number.isFinite(a[to])&&Number.isFinite(b[to])?a[to]+(b[to]-a[to])*(value-a[from])/(b[from]-a[from]):null;
}
const scopes=new WeakMap();
export function surveySupport(host,wellId,datasets,onReady){
 const workspace=host.getState();let cache=scopes.get(workspace);if(!cache){cache=new Map();scopes.set(workspace,cache);}const well=workspace.wellDrafts?.find(w=>w.id===wellId),surveys=datasets.filter(d=>d.family==='deviation'&&d.well===wellId&&d.active!==false),survey=surveys.find(d=>d.id===well?.activeSurveyId)||(surveys.length===1?surveys[0]:null);if(!survey)return null;
 const key=survey.id+JSON.stringify(survey.references||{})+JSON.stringify(well?.sourceCoordinates||{});if(!cache.has(key)){const entry={loading:true,stations:null,error:'',references:survey.references||{}};cache.set(key,entry);entry.promise=retainedRows(host,survey,50000).then(source=>{entry.stations=evidence.trajectory(source.rows,{...survey,metadata:source.metadata},well);}).catch(e=>entry.error=e.message).finally(()=>{entry.loading=false;onReady?.();});}return cache.get(key);
}
export function checkshotQC(dataset,rows,stations=[]){
 const refs=dataset.references||{},m=dataset.mapping||{},factor=evidence.length(refs.depthUnit),timeFactor=refs.timeUnit==='ms'?.001:refs.timeUnit==='s'?1:null,multiplier=refs.timeConvention==='Two-way time'?2:refs.timeConvention==='One-way time'?1:null;
 if(!factor||!timeFactor||!multiplier)throw new Error('Confirm depth/time units and one-way/two-way convention before QC.');let previous=null;
 return rows.map((row,index)=>{const rawDepth=evidence.numeric(evidence.at(row,m,'depth')),rawTime=evidence.numeric(evidence.at(row,m,'time')),depth=rawDepth===null?null:rawDepth*factor*(refs.depthSign==='-1'?-1:1),time=rawTime===null?null:rawTime*timeFactor*(refs.timeSign==='-1'?-1:1),calibrated=refs.depthReference==='MD'?interpolate(stations,'md','tvd',depth):depth;let velocity=null,issue='';
  if(depth===null||time===null)issue='Missing observation';else if(previous&&(depth<=previous.depth||time<=previous.time))issue='Repeated/decreasing observation; segment retained but not used';else if(refs.depthReference==='MD'&&calibrated===null)issue='MD observations: interval velocity requires a referenced TVD conversion';else if(previous&&calibrated!==null&&previous.calibrated!==null&&(['TVD','TVDSS'].includes(refs.depthReference)||refs.depthReference==='MD')){if(calibrated>previous.calibrated)velocity=multiplier*(calibrated-previous.calibrated)/(time-previous.time);else issue='Nonpositive vertical interval; no velocity derived';}else if(!previous)issue='First observation; no preceding interval';
  previous=depth===null||time===null?null:{depth,time,calibrated};return {row:index+1,depth:calibrated??depth,time,velocity,issue,derivedDepth:refs.depthReference==='MD'&&calibrated!==null};
 });
}
