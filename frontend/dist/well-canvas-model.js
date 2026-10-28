// Persist only display/interpretation metadata; samples stay in the project repository.
export const palette=['#167e73','#b07036','#527fa3','#975b81','#6c8447','#c0534c'];
export const uid=()=>crypto.randomUUID();
export const finite=v=>typeof v==='number'&&Number.isFinite(v);
export const depthFactor=unit=>({'m':1,'metres':1,'meters':1,'ft':.3048,'feet':.3048,'km':1000}[String(unit||'').trim().toLowerCase()]||null);
export function freshBook(name='Log interpretation'){return {id:uid(),name,wells:[],range:null,linked:true,flatten:null,selected:null,selectionRange:null,crossplot:null,markers:[],correlation:false};}
export function ensureBoard(interpretation){interpretation.board||={schemaVersion:1,books:[freshBook()],activeBook:null,templates:[],recipes:[],versions:[],focus:'logs'};const b=interpretation.board;if(!b.books.length)b.books.push(freshBook());if(!b.books.some(w=>w.id===b.activeBook))b.activeBook=b.books[0].id;return b;}
export const activeBook=board=>board.books.find(b=>b.id===board.activeBook);
export function numericColumns(dataset){return(dataset?.columns||[]).filter(c=>!dataset.activeColumns||dataset.activeColumns.includes(c.id));}
export function indexColumn(dataset){const cols=numericColumns(dataset);return cols.find(c=>c.id===dataset?.indexColumnId)||cols.find(c=>/^(DEPT|DEPTH|MD|TVD|TVDSS)$/i.test(c.mnemonic))||(dataset?.scientificRunId?null:cols[0])||null;}
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
 let track=well.tracks.find(t=>t.id===trackId);if(!track){if(well.tracks.length>=30)throw new Error('Use another well display/workbook for more than 30 tracks.');track={id:uid(),name:column.mnemonic,width:140,curves:[]};well.tracks.push(track);}
 if(track.curves.some(c=>c.datasetId===dataset.id&&c.columnId===columnId))return track;
 if(track.curves.length>=12)throw new Error('Use another track for more than 12 overlaid curves.');
 const curve={id:uid(),datasetId:dataset.id,columnId,indexColumnId:indexColumn(dataset)?.id||'',name:column.mnemonic,unit:column.effectiveUnit||column.unit||'',color:palette[track.curves.length%palette.length],visible:true,log:false,reverse:false,min:null,max:null,dashed:dataset.well!==well.wellId};
 track.curves.push(curve);return track;
}
export function selectedObjects(book){const well=book.wells.find(w=>w.id===book.selected?.wellId),track=well?.tracks.find(t=>t.id===book.selected?.trackId),curve=track?.curves.find(c=>c.id===book.selected?.curveId);return {well,track,curve};}
export function rangeOf(values){let lo=Infinity,hi=-Infinity;for(const v of values)if(finite(v)){lo=Math.min(lo,v);hi=Math.max(hi,v);}return lo===Infinity?null:lo===hi?[lo-.5,hi+.5]:[lo,hi];}
export function curvePath(rows,index,value,range,axis,width,height,offset=0,factor=1){
 const [top,base]=range,[lo,hi]=axis;if(!(base>top&&hi>lo))return '';
 // Retain min/max samples per vertical screen pixel; gaps remain separate segments.
 let result='',bucket=-1,points=[],previous=false;
 const flush=()=>{if(!points.length)return;const picks=[points[0],points.reduce((a,b)=>a.v<b.v?a:b),points.reduce((a,b)=>a.v>b.v?a:b),points[points.length-1]];for(const p of [...new Map(picks.map(p=>[p.i,p])).values()].sort((a,b)=>a.i-b.i)){const x=axis.reverse?width-(p.v-lo)/(hi-lo)*width:(p.v-lo)/(hi-lo)*width,y=(p.z-top)/(base-top)*height;result+=(previous?'L':'M')+x.toFixed(2)+','+y.toFixed(2);previous=true;}points=[];};
 for(let i=0;i<rows.length;i++){const row=rows[i],raw=row[value],z=finite(row[index])?row[index]*factor-offset:null,v=axis.log&&finite(raw)?raw>0?Math.log10(raw):null:raw;if(!finite(z)||!finite(v)||z<top||z>base){flush();previous=false;bucket=-1;continue;}const bin=Math.floor((z-top)/(base-top)*height);if(bin!==bucket){flush();bucket=bin;}points.push({i,v,z});}flush();return result;
}
export function axisFor(rows,column,curve){const values=rows.map(r=>curve.log&&finite(r[column])?r[column]>0?Math.log10(r[column]):null:r[column]);const ext=rangeOf(values);if(!ext)return null;let lo=finite(curve.min)?curve.log?Math.log10(curve.min):curve.min:ext[0],hi=finite(curve.max)?curve.log?Math.log10(curve.max):curve.max:ext[1];if(!finite(lo)||!finite(hi)||hi<=lo)return null;const axis=[lo,hi];axis.reverse=curve.reverse;axis.log=curve.log;return axis;}
export function applyTemplate(well,template,datasets){
 const sources=datasets.filter(d=>d.well===well.wellId),missing=[];well.tracks=[];
 for(const saved of template.tracks){const track={id:uid(),name:saved.name,width:saved.width,curves:[]};well.tracks.push(track);for(const pattern of saved.curves){const matches=[];for(const ds of sources)for(const col of numericColumns(ds))if(col.mnemonic===pattern.mnemonic&&String(col.effectiveUnit||col.unit||'')===pattern.unit)matches.push({ds,col});if(matches.length!==1){missing.push(pattern.mnemonic+(matches.length?' (multiple matching runs)':' (no exact mnemonic/unit match)'));continue;}addCurve(well,matches[0].ds,matches[0].col.id,track.id);Object.assign(track.curves.at(-1),{color:pattern.color,log:pattern.log,reverse:pattern.reverse,min:pattern.min,max:pattern.max});}}
 return missing;
}
