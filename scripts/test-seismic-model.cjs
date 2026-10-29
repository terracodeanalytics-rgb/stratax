const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const moduleFrom=path=>import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(path,'utf8')).toString('base64'));

function fixture(){
 const raw=Buffer.alloc(3600+3*(240+16*4));raw.writeUInt16BE(2000,3216);raw.writeUInt16BE(16,3220);raw.writeUInt16BE(5,3224);raw.writeUInt16BE(256,3500);
 for(let t=0;t<3;t++){const at=3600+t*304;raw.writeInt16BE(-10,at+70);raw.writeUInt16BE(16,at+114);raw.writeUInt16BE(2000,at+116);raw.writeInt32BE(10,at+188);raw.writeInt32BE(t+20,at+192);raw.writeInt32BE(1000+t*100,at+180);for(let s=0;s<16;s++)raw.writeFloatBE(t*100+s,at+240+s*4);}
 return new Blob([raw]);
}
test('local section reads exact source samples, scalars and time axis',async()=>{
 const {readLocalSection}=await moduleFrom('frontend/dist/seismic-reader.js');
 const section=await readLocalSection(fixture(),{firstTrace:1,traceCount:2,firstSample:3,sampleCount:4});
 assert.deepEqual(section.samples,[[103,104,105,106],[203,204,205,206]]);assert.equal(section.traceHeaders[0].x,110);assert.equal(section.sampleStart,.006);assert.equal(section.sourceDomain,'time-unconfirmed');
 await assert.rejects(()=>readLocalSection(fixture(),{traceCount:4,sampleCount:1}),/exceeds/);
});
test('seismic state is separate from petrophysics, with locked source picks',async()=>{
 const m=await moduleFrom('frontend/dist/seismic-model.js'),workspace={interpretation:{board:{sentinel:'existing petrophysics'}}};
 const s=m.seismicState(workspace);assert.equal(s.books.length,1);assert.equal(workspace.interpretation.board.sentinel,'existing petrophysics');
 const b=m.activeSeismicBook(workspace),i={points:[]};m.addSeismicPick(i,{trace:3,sample:5});m.addSeismicPick(i,{trace:3,sample:6});assert.equal(i.points.length,1);assert.equal(i.points[0].sample,6);
 i.points[0].locked=true;assert.throws(()=>m.addSeismicPick(i,{trace:3,sample:7}),/Unlock/);assert.throws(()=>m.removeSeismicPick(i,0),/Unlock/);
 i.points[0].locked=false;m.removeSeismicPick(i,0);assert.equal(i.points.length,0);assert.equal(b.id,s.activeBook);
 const fault={kind:'fault',points:[]};m.addSeismicPick(fault,{trace:4,sample:3});m.addSeismicPick(fault,{trace:4,sample:8});assert.equal(fault.points.length,2);
 m.addSeismicPick(fault,{trace:4,sample:9},{index:0});assert.deepEqual(fault.points.map(p=>p.sample),[9,8]);
});
test('canvas picks resolve to retained trace/sample identity',async()=>{
 const m=await moduleFrom('frontend/dist/seismic-model.js');const point=m.sectionPoint({firstTrace:100,firstSample:200,samples:[[1,2],[3,4]],sampleStarts:[.4,.4],sampleInterval:.002,traceHeaders:[{inline:1},{inline:2}]},.75,.75);
 assert.equal(point.trace,101);assert.equal(point.sample,201);assert.equal(point.amplitude,4);assert.equal(point.axis,.402);assert.equal(point.header.inline,2);
 assert.throws(()=>m.sectionPoint(null,0,0),/inside/);
});

const trackingFixture=()=>({analytical:true,firstTrace:100,firstSample:200,sourceVersion:'truth-v1',samples:Array.from({length:20},(_,t)=>Array.from({length:80},(_,s)=>{const x=s-25-t;return (1-x*x/2)*Math.exp(-x*x/4);}))});
test('section tracking recovers planted events without replacing manual or locked seeds',async()=>{
 const {trackSection}=await moduleFrom('frontend/dist/seismic-tracking.js'),s=trackingFixture(),seeds=[{trace:105,sample:230,locked:true},{trace:112,sample:237,locked:false}],before=JSON.stringify({s,seeds});
 const proposal=trackSection(s,seeds,{radius:2,window:5,minimumCorrelation:.99});
 assert.equal(proposal.points.length,18);assert.equal(proposal.stops.length,0);
 assert.ok(proposal.points.every(p=>p.sample===200+25+p.trace-100&&p.correlation>.999999));
 assert.equal(proposal.statisticalConfidence,false);assert.equal(JSON.stringify({s,seeds}),before);
});
test('section tracking stops at reviewed barriers and missing/flat support',async()=>{
 const {trackSection}=await moduleFrom('frontend/dist/seismic-tracking.js'),s=trackingFixture(),seeds=[{trace:105,sample:230}];
 let proposal=trackSection(s,seeds,{barriers:[108]});assert.equal(Math.max(...proposal.points.map(p=>p.trace)),107);assert.ok(proposal.stops.some(p=>p.trace===108&&/barrier/.test(p.reason)));
 s.samples[7].fill(null);proposal=trackSection(s,seeds);assert.equal(Math.max(...proposal.points.map(p=>p.trace)),106);assert.ok(proposal.stops.some(p=>p.trace===107));
 s.samples.forEach(r=>r.fill(0));assert.equal(trackSection(s,seeds).points.length,0);
 assert.throws(()=>trackSection({...s,displayOnly:true},seeds),/analytical/);
 assert.throws(()=>trackSection({...s,sampleStarts:Array.from({length:20},(_,i)=>i*.004),sampleInterval:.002},seeds),/time origins/);
 assert.throws(()=>trackSection(s,[]),/seed/);
});
