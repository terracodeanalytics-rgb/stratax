// Bounded reads from retained local originals. Never upload Local content to render a section.
const ensure=(condition,message)=>{if(!condition)throw new Error(message);};
const sizes={1:4,2:4,3:2,5:4,6:8,8:1};
export async function readLocalSection(blob,{kind='segy',endian='big',firstTrace=0,traceCount=128,firstSample=0,sampleCount=1000,headerBytes={}}={}){
 ensure(['segy','su'].includes(kind)&&['big','little'].includes(endian),'Choose a supported source format and byte order.');
 ensure([firstTrace,traceCount,firstSample,sampleCount].every(Number.isInteger)&&firstTrace>=0&&firstSample>=0&&traceCount>=1&&traceCount<=512&&sampleCount>=1&&sampleCount<=4096&&traceCount*sampleCount<=2000000,'Choose a section within 512 traces, 4096 samples and two million cells.');
 const little=endian==='little',read=async(offset,n)=>{const bytes=await blob.slice(offset,offset+n).arrayBuffer();ensure(bytes.byteLength===n,'The retained source ended before its declared samples.');return new DataView(bytes);};
 let ns,dt,format,begin;
 if(kind==='segy'){
  const binary=await read(3200,400);ns=binary.getUint16(20,little);dt=binary.getUint16(16,little);format=binary.getUint16(24,little);
  ensure(binary.getUint16(300,little)<=256,'The bounded reader supports fixed-length SEG-Y rev 0/1. Use native indexing for newer layouts.');
  const extended=binary.getInt16(304,little);ensure(extended>=0&&extended<=1024,'Unknown extended-header counts require native indexing.');begin=3600+extended*3200;
 }else{const h=await read(0,240);ns=h.getUint16(114,little);dt=h.getUint16(116,little);format=5;begin=0;}
 ensure(sizes[format]&&ns>0&&dt>0,'Review source sample encoding, count and time interval.');
 const width=240+ns*sizes[format],total=(blob.size-begin)/width;
 ensure(Number.isInteger(total)&&total>0,'This source needs a native trace-offset index; no variable-length trace was discarded.');
 ensure(firstTrace+traceCount<=total&&firstSample+sampleCount<=ns,'The selected section exceeds the source. Choose a smaller range.');
 const keys={inline:189,crossline:193,cdp:21,shot:9,offset:37,x:181,y:185,scalar:71,...headerBytes};
 ensure(Object.entries(keys).every(([k,v])=>Number.isInteger(v)&&v>=1&&v<=(k==='scalar'?239:237)),'Review the trace-header byte mapping.');
 const samples=[],traceHeaders=[],sampleStarts=[];
 for(let trace=firstTrace;trace<firstTrace+traceCount;trace++){
  const position=begin+trace*width,h=await read(position,240);
  ensure(h.getUint16(114,little)===ns&&[0,dt].includes(h.getUint16(116,little)),'Variable trace lengths/intervals require native indexing; no resampling was performed.');
  const header=Object.fromEntries(Object.entries(keys).map(([k,v])=>[k,k==='scalar'?h.getInt16(v-1,little):h.getInt32(v-1,little)]));
  const factor=header.scalar<0?1/Math.abs(header.scalar):header.scalar||1;header.x*=factor;header.y*=factor;delete header.scalar;
  header.trace=trace;header.coordinateUnits=h.getUint16(88,little);traceHeaders.push(header);
  sampleStarts.push(h.getInt16(108,little)*.001+firstSample*dt*1e-6);
  const view=await read(position+240+firstSample*sizes[format],sampleCount*sizes[format]),row=[];
  for(let i=0;i<sampleCount;i++){
   const at=i*sizes[format];let value;
   if(format===1){const word=view.getUint32(at,little);value=(word&0x80000000?-1:1)*(word&0xffffff)/2**24*16**(((word>>>24)&127)-64);}
   else value=({2:()=>view.getInt32(at,little),3:()=>view.getInt16(at,little),5:()=>view.getFloat32(at,little),6:()=>view.getFloat64(at,little),8:()=>view.getInt8(at)})[format]();
   row.push(Number.isFinite(value)?value:null);
  }
  samples.push(row);
 }
 return {samples,traceHeaders,sampleStarts,sampleStart:sampleStarts[0],sampleInterval:dt*1e-6,traceCount:total,samplesPerTrace:ns,firstTrace,firstSample,level:0,analytical:true,displayOnly:false,axisUnit:'s',sourceDomain:'time-unconfirmed',adapter:'fixed-length-rev0-1'};
}
