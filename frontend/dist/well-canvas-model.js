import './import-normalization.js';
// Persist only display/interpretation metadata; samples stay in the project repository.
export const MIN_TRACK_WIDTH=48,MAX_TRACK_WIDTH=480,DEFAULT_TRACK_WIDTH=48;
export const palette=['#167e73','#b07036','#527fa3','#975b81','#6c8447','#c0534c'];
export const uid=()=>crypto.randomUUID();
export const finite=v=>typeof v==='number'&&Number.isFinite(v);
export const depthFactor=unit=>({'m':1,'metres':1,'meters':1,'ft':.3048,'feet':.3048,'km':1000}[String(unit||'').trim().toLowerCase()]||null);
export function freshBook(name='Log interpretation'){return {id:uid(),name,wells:[],range:null,linked:true,flatten:null,selected:null,selectionRange:null,crossplot:null,markers:[],correlation:false};}
export function ensureBoard(interpretation){interpretation.board||={schemaVersion:1,books:[freshBook()],activeBook:null,templates:[],recipes:[],versions:[],focus:'logs'};const b=interpretation.board;if(!b.books.length)b.books.push(freshBook());if(!b.books.some(w=>w.id===b.activeBook))b.activeBook=b.books[0].id;return b;}
export const activeBook=board=>board.books.find(b=>b.id===board.activeBook);
export function numericColumns(dataset){const metadata=new Set(Object.entries(dataset?.mapping||{}).filter(([role,index])=>['well','uwi','name','sample'].includes(role)&&index!==''&&index!==undefined).map(([,index])=>'column-'+index));return(dataset?.columns||[]).filter((c,i)=>c.valueType!=='array'&&!dataset.preview?.some(row=>Array.isArray(row[i]))&&(!dataset.activeColumns||dataset.activeColumns.includes(c.id))&&(!metadata.has(c.id)||c.id==='column-'+dataset.mapping?.index));}
export function indexColumn(dataset){const cols=numericColumns(dataset);return cols.find(c=>c.id===dataset?.indexColumnId)||cols.find(c=>c.id==='column-'+dataset?.mapping?.index)||cols.find(c=>/^(DEPT|DEPTH|MD|TVD|TVDSS)$/i.test(c.mnemonic))||(dataset?.scientificRunId?null:cols[0])||null;}
export function addWell(book,wellId,datasets){
 let well=book.wells.find(w=>w.wellId===wellId);if(well)return well;
 if(book.wells.length>=30)throw new Error('Use another workbook for more than 30 well displays.');
 well={id:uid(),wellId,name:wellId,tracks:[],range:null,linked:true,offset:0};book.wells.push(well);
 const source=datasets.find(d=>d.well===wellId&&d.family==='logs')||datasets.find(d=>d.well===wellId);
 if(source){const depth=indexColumn(source);for(const col of numericColumns(source).filter(c=>c.id!==depth?.id).slice(0,3))addCurve(well,source,col.id);}
 book.selected={wellId:well.id};return well;
}
export function addCurve(well,dataset,columnId,trackId=null){
 const column=numericColumns(dataset).find(c=>c.id===columnId);if(!column)throw new Error('Choose an active source curve.');
 let track=well.tracks.find(t=>t.id===trackId);if(!track){if(well.tracks.length>=30)throw new Error('Use another well display/workbook for more than 30 tracks.');track={id:uid(),name:column.mnemonic,width:DEFAULT_TRACK_WIDTH,curves:[]};well.tracks.push(track);}
 if(track.curves.some(c=>c.datasetId===dataset.id&&c.columnId===columnId))return track;
 if(track.curves.length>=12)throw new Error('Use another track for more than 12 overlaid curves.');
 const mnemonic=String(column.mnemonic||'').trim();
 const property=String(column.propertyType||'').trim();
 const color=/^(VSH|VSHALE|SHALE VOLUME)$/i.test(mnemonic)||/^shale volume$/i.test(property)?palette[1]:
  /^(GR|GRD|GRC|SGR|CGR|GAMMA[ _-]?RAY)$/i.test(mnemonic)||/^gamma[ -]ray$/i.test(property)?palette[0]:palette[track.curves.length%palette.length];
 const curve={id:uid(),datasetId:dataset.id,columnId,indexColumnId:indexColumn(dataset)?.id||'',name:column.mnemonic,unit:column.effectiveUnit||column.unit||'',color,visible:true,log:false,reverse:false,min:null,max:null,dashed:dataset.well!==well.wellId};
 track.curves.push(curve);return track;
}
export function selectedObjects(book){const well=book.wells.find(w=>w.id===book.selected?.wellId),track=well?.tracks.find(t=>t.id===book.selected?.trackId),curve=track?.curves.find(c=>c.id===book.selected?.curveId);return {well,track,curve};}
export function rangeOf(values){let lo=Infinity,hi=-Infinity;for(const v of values)if(finite(v)){lo=Math.min(lo,v);hi=Math.max(hi,v);}return lo===Infinity?null:lo===hi?[lo-.5,hi+.5]:[lo,hi];}
export function curvePath(rows,index,value,range,axis,width,height,offset=0,factor=1,convert=z=>z){
 const [top,base]=range,[lo,hi]=axis;if(!(base>top&&hi>lo))return '';
 // Retain min/max samples per vertical screen pixel; gaps remain separate segments.
 let result='',bucket=-1,points=[],previous=false;
 const flush=()=>{if(!points.length)return;const picks=[points[0],points.reduce((a,b)=>a.v<b.v?a:b),points.reduce((a,b)=>a.v>b.v?a:b),points[points.length-1]];for(const p of [...new Map(picks.map(p=>[p.i,p])).values()].sort((a,b)=>a.i-b.i)){const x=axis.reverse?width-(p.v-lo)/(hi-lo)*width:(p.v-lo)/(hi-lo)*width,y=(p.z-top)/(base-top)*height;result+=(previous?'L':'M')+x.toFixed(2)+','+y.toFixed(2);previous=true;}points=[];};
 for(let i=0;i<rows.length;i++){const row=rows[i],raw=row[value],converted=finite(row[index])?convert(row[index]*factor):null,z=finite(converted)?converted-offset:null,v=axis.log&&finite(raw)?raw>0?Math.log10(raw):null:raw;if(!finite(z)||!finite(v)||z<top||z>base){flush();previous=false;bucket=-1;continue;}const bin=Math.floor((z-top)/(base-top)*height);if(bin!==bucket){flush();bucket=bin;}points.push({i,v,z});}flush();return result;
}
export function axisFor(rows,column,curve){const values=rows.map(r=>curve.log&&finite(r[column])?r[column]>0?Math.log10(r[column]):null:r[column]);const ext=rangeOf(values);if(!ext)return null;let lo=finite(curve.min)?curve.log?Math.log10(curve.min):curve.min:ext[0],hi=finite(curve.max)?curve.log?Math.log10(curve.max):curve.max:ext[1];if(!finite(lo)||!finite(hi)||hi<=lo)return null;const axis=[lo,hi];axis.reverse=curve.reverse;axis.log=curve.log;return axis;}
export function cutoffPosition(value,axis,width){
 if(!finite(value))return null;
 const [lo,hi]=axis,scaled=axis.log?Math.log10(value):value;
 if(!finite(scaled)||scaled<lo||scaled>hi)return null;
 const fraction=(scaled-lo)/(hi-lo);
 return (axis.reverse===true?1-fraction:fraction)*width;
}
export const displayColor=value=>/^#[\da-f]{6}$/i.test(String(value||''))?value:null;
export function fillStyle(curve){
 return {fill:['left','right','cutoff'].includes(curve.fill)?curve.fill:'none',
  fillOpacity:finite(curve.fillOpacity)?Math.max(0,Math.min(1,curve.fillOpacity)):.12,
  cutoffColor:displayColor(curve.cutoffColor),belowColor:displayColor(curve.belowColor),aboveColor:displayColor(curve.aboveColor)};
}
export function cutoffFillPaths(path,axis,width,value){
 const scaled=axis.log?Math.log10(value):value;
 if(!finite(value)||!finite(scaled))return [];
 const fraction=(scaled-axis[0])/(axis[1]-axis[0]);
 const cutoff=(axis.reverse?1-fraction:fraction)*width;
 const paths=[];
 for(const segment of path.split('M').filter(Boolean)){
  const points=segment.split('L').map(pair=>pair.split(',').map(Number));
  let start=points[0],side=null,run=[start];
  const flush=()=>{if(run.length>1)paths.push({side,path:`M${cutoff},${run[0][1]}L${run.map(p=>p.join(',')).join('L')}L${cutoff},${run.at(-1)[1]}Z`});};
  for(const end of points.slice(1)){
   const from=start[0]-cutoff,to=end[0]-cutoff;
   const endSide=(axis.reverse?-1:1)*(to||from)>0?'above':'below';
   if(side===null)side=(axis.reverse?-1:1)*(from||to)>0?'above':'below';
   if(from*to<0){
    const crossing=[cutoff,start[1]+(end[1]-start[1])*from/(from-to)];
    run.push(crossing);flush();run=[crossing];side=endSide;
   }else if(side!==null&&side!==endSide){flush();run=[start];side=endSide;}
   side=endSide;run.push(end);start=end;
  }
  flush();
 }
 return paths;
}
export function trackStyleMatches(source,target,getColumn){
 const identity=curve=>{
  const column=getColumn(curve);
  if(!column)return null;
  const unit=globalThis.StrataxNormalization.canonicalUnit(column.effectiveUnit||column.unit||'');
  const type=column.propertyType;
  return JSON.stringify(type&&type!=='Unclassified'?['type',type,unit]:['mnemonic',column.mnemonic,unit]);
 };
 return source.curves.map(curve=>{
  const key=identity(curve),matches=key===null?[]:target.curves.filter(candidate=>identity(candidate)===key);
  const ambiguous=matches.length>1||matches.length===1&&source.curves.filter(candidate=>identity(candidate)===key).length>1;
  return {curve,target:!ambiguous&&matches.length===1?matches[0]:null,status:ambiguous?'Ambiguous match':matches.length?'Matched':'No matching curve and unit'};
 });
}
export function applyTemplate(well,template,datasets){
 const sources=datasets.filter(d=>d.well===well.wellId),missing=[];well.tracks=[];
 for(const saved of template.tracks){const track={id:uid(),name:saved.name,width:saved.width,curves:[]};well.tracks.push(track);for(const pattern of saved.curves){const matches=[];for(const ds of sources)for(const col of numericColumns(ds))if((pattern.propertyType&&pattern.propertyType!=='Unclassified'?col.propertyType===pattern.propertyType:col.mnemonic===pattern.mnemonic)&&globalThis.StrataxNormalization.canonicalUnit(col.effectiveUnit||col.unit||'')===globalThis.StrataxNormalization.canonicalUnit(pattern.unit))matches.push({ds,col});if(matches.length!==1){missing.push(pattern.mnemonic+(matches.length?' (multiple matching runs)':' (no exact mnemonic/unit match)'));continue;}addCurve(well,matches[0].ds,matches[0].col.id,track.id);Object.assign(track.curves.at(-1),{color:pattern.color,log:pattern.log,reverse:pattern.reverse,min:pattern.min,max:pattern.max,cutoff:finite(pattern.cutoff)?pattern.cutoff:null,visible:pattern.visible!==false,dashed:pattern.dashed===true,...fillStyle(pattern)});}}
 return missing;
}
