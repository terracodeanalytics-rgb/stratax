// Bounded section proposals. Original amplitudes and manual/locked picks are read-only.
export function trackSection(section,seeds,{event='peak',radius=4,window=5,minimumCorrelation=.8,barriers=[]}={}){
 if(!['peak','trough','zero'].includes(event)||!Number.isInteger(radius)||radius<1||radius>32||!Number.isInteger(window)||window<2||window>32||!Number.isFinite(minimumCorrelation)||minimumCorrelation<0||minimumCorrelation>1)throw new Error('Choose a supported event, search radius, correlation window and threshold.');
 if(!section?.analytical||section.displayOnly||!section.samples?.length)throw new Error('Tracking requires retained analytical samples.');
 if(section.sampleStarts?.some(start=>Math.abs(start-section.sampleStarts[0])>section.sampleInterval*1e-9))throw new Error('Review and explicitly align differing trace time origins before section tracking.');
 const rows=section.samples,n=rows.length,ns=rows[0].length,firstTrace=section.firstTrace,firstSample=section.firstSample;
 if(rows.some(r=>r.length!==ns))throw new Error('Track compatible sampled sections separately.');
 if(!Array.isArray(barriers)||barriers.length>512||barriers.some(t=>!Number.isInteger(t)||t<firstTrace||t>=firstTrace+n))throw new Error('Use barrier trace identities inside this retained section.');
 const fixed=new Map(),blocked=new Set(barriers),proposed=new Map(),stops=[];
 for(const p of seeds){
  if(!Number.isInteger(p.trace)||!Number.isFinite(p.sample))throw new Error('Seeds must retain finite source coordinates.');
  const t=p.trace-firstTrace,s=p.sample-firstSample;
  if(t>=0&&t<n&&s>=0&&s<ns){if(fixed.has(t))throw new Error('Use one reviewed seed per trace.');fixed.set(t,s);}
 }
 if(!fixed.size)throw new Error('Pick at least one seed inside this retained section.');
 const patch=(row,s)=>{const at=Math.round(s);if(at-window<0||at+window>=ns)return null;const a=row.slice(at-window,at+window+1);return a.every(v=>typeof v==='number'&&Number.isFinite(v))?a:null;};
 const correlate=(a,b)=>{if(!a||!b)return null;const ma=a.reduce((s,v)=>s+v,0)/a.length,mb=b.reduce((s,v)=>s+v,0)/b.length;let cross=0,aa=0,bb=0;for(let j=0;j<a.length;j++){const x=a[j]-ma,y=b[j]-mb;cross+=x*y;aa+=x*x;bb+=y*y;}return aa>0&&bb>0?Math.max(-1,Math.min(1,cross/Math.sqrt(aa*bb))):null;};
 const candidates=(row,previous)=>{const list=[];for(let s=Math.max(1,Math.ceil(previous-radius));s<=Math.min(ns-2,Math.floor(previous+radius));s++){
  const a=row[s-1],b=row[s],c=row[s+1];if(![a,b,c].every(v=>typeof v==='number'&&Number.isFinite(v)))continue;
  if(event==='peak'&&b>a&&b>=c||event==='trough'&&b<a&&b<=c)list.push(s);
  if(event==='zero'&&b*c<0)list.push(s+Math.abs(b)/(Math.abs(b)+Math.abs(c)));
  if(event==='zero'&&b===0&&a*c<0)list.push(s);
 }return list;};
 for(const [seed,seedSample] of [...fixed.entries()].sort((a,b)=>a[0]-b[0]))for(const direction of [-1,1]){
  let prior=seedSample;const reference=patch(rows[seed],seedSample);
  for(let t=seed+direction;t>=0&&t<n;t+=direction){
   let reason=null;
   if(blocked.has(t+firstTrace))reason='reviewed trace barrier';
   else if(fixed.has(t))break;
   else if(!reference)reason='seed lacks a complete correlation window';
   const ranked=reason?[]:candidates(rows[t],prior).map(s=>({sample:s,correlation:correlate(reference,patch(rows[t],s))})).filter(p=>p.correlation!==null&&p.correlation>=minimumCorrelation).sort((a,b)=>b.correlation-a.correlation||Math.abs(a.sample-prior)-Math.abs(b.sample-prior));
   if(!ranked.length){stops.push({trace:t+firstTrace,seed:seed+firstTrace,direction,reason:reason||'no supported event above the correlation threshold'});break;}
   const best=ranked[0],old=proposed.get(t);
   if(!old||best.correlation>old.correlation)proposed.set(t,{trace:t+firstTrace,sample:best.sample+firstSample,correlation:best.correlation,seed:seed+firstTrace});
   prior=best.sample;
  }
 }
 return {points:[...proposed.values()].sort((a,b)=>a.trace-b.trace),stops,seedCount:fixed.size,
  seeds:[...fixed].map(([trace,sample])=>({trace:trace+firstTrace,sample:sample+firstSample})),
  method:'bounded-section-event-correlation/v1',sourceVersion:section.sourceVersion,
  settings:{event,radius,window,minimumCorrelation,barriers:[...blocked].sort((a,b)=>a-b)},
  bounds:{firstTrace,traceCount:n,firstSample,sampleCount:ns},statisticalConfidence:false};
}
