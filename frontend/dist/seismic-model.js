export const workbookKinds=['Sections','Interpretation'];
export const freshSeismicBook=(name='Seismic sections')=>({id:crypto.randomUUID(),name,kind:'Sections',views:[],interpretations:[],activeInterpretation:null,linked:true});
export function seismicState(workspace){
 workspace.seismicWorkspace||={schemaVersion:1,books:[freshSeismicBook()],activeBook:null,versions:[],templates:[]};
 const state=workspace.seismicWorkspace;
 if(!state.books.length)state.books.push(freshSeismicBook());
 if(!state.books.some(b=>b.id===state.activeBook))state.activeBook=state.books[0].id;
 return state;
}
export const activeSeismicBook=workspace=>{const s=seismicState(workspace);return s.books.find(b=>b.id===s.activeBook);};
export function sectionPoint(section,x,y){
 if(!section?.samples?.length||!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>1||y<0||y>1)throw new Error('Select a point inside the retained seismic section.');
 const traceIndex=Math.min(section.samples.length-1,Math.floor(x*section.samples.length));
 const sampleIndex=Math.min(section.samples[traceIndex].length-1,Math.floor(y*section.samples[traceIndex].length));
 return {trace:section.firstTrace+traceIndex,sample:section.firstSample+sampleIndex,amplitude:section.samples[traceIndex][sampleIndex],
  axis:section.sampleStarts[traceIndex]+sampleIndex*section.sampleInterval,header:section.traceHeaders[traceIndex]};
}
export function addSeismicPick(interpretation,point,{index}={}){
 if(!Number.isInteger(point.trace)||point.trace<0||!Number.isFinite(point.sample)||point.sample<0)throw new Error('Use retained trace/sample coordinates.');
 const old=index===undefined?interpretation.points.find(p=>p.trace===point.trace&&(interpretation.kind!=='fault'||p.sample===point.sample)):interpretation.points[index];
 if(index!==undefined&&!old)throw new Error('This pick no longer exists.');
 if(!old&&interpretation.points.length>=500)throw new Error('Use a separate interpretation object after 500 picks.');
 if(old?.locked)throw new Error('Unlock this pick before replacing it.');
 if(old)Object.assign(old,{sample:point.sample});else interpretation.points.push({trace:point.trace,sample:point.sample,locked:false});
 if(interpretation.kind!=='fault')interpretation.points.sort((a,b)=>a.trace-b.trace);interpretation.dirty=true;
}
export function removeSeismicPick(interpretation,index){
 if(!interpretation.points[index])throw new Error('This pick no longer exists.');
 if(interpretation.points[index].locked)throw new Error('Unlock this pick before removing it.');
 interpretation.points.splice(index,1);interpretation.dirty=true;
}
export function pickPolyline(interpretation,view,section){
 if(interpretation.sourceVersion&&section.sourceVersion&&interpretation.sourceVersion!==section.sourceVersion)return '';
 return interpretation.points.filter(p=>p.trace>=section.firstTrace&&p.trace<section.firstTrace+section.samples.length&&p.sample>=section.firstSample&&p.sample<section.firstSample+section.samples[0].length)
  .map(p=>`${(p.trace-section.firstTrace+.5)/section.samples.length*1000},${(p.sample-section.firstSample+.5)/section.samples[0].length*1000}`).join(' ');
}
