importScripts('./vendor/zip-native.min.js');
zip.configure({useWebWorkers:false,maxWorkers:1});
const LIMITS={entries:10000,files:99,total:1024**3,member:256*1024**2,depth:3};
const ignored=/(^|\/)(__MACOSX|\.DS_Store|Thumbs\.db|desktop\.ini|\._[^/]*)($|\/)/i;
const executable=/\.(exe|dll|com|bat|cmd|ps1|sh|js|mjs|vbs|html?|lnk)$/i;
onmessage=async({data})=>{
 const maxTotal=Math.max(0,Math.min(LIMITS.total,data.maxExpandedBytes??LIMITS.total)),maxFiles=Math.max(0,Math.min(LIMITS.files,data.maxFiles??LIMITS.files)),files=[],notes=[],budget={entries:0,bytes:0,metadata:0};let lastPost=0;
 const note=(path,message,code='zip_entry_review')=>notes.push({path:path.slice(0,1024),message,code});
 const progress=(path,loaded,total)=>{if(performance.now()-lastPost>120){postMessage({type:'progress',path,loaded,total,files:files.length});lastPost=performance.now();}};
 async function unpack(file,prefix='',depth=0,keyPrefix=''){
  if(depth>LIMITS.depth){note(prefix,'Nested ZIP depth exceeds three levels. Extract this archive separately.');return;}
  const reader=new zip.ZipReader(new zip.BlobReader(file),{checkCrc32:true,checkAuthenticationCode:true,checkOverlappingEntry:true,strictness:'strict',password:data.password||undefined});
  try{
   let ordinal=0;const seenNames=new Set();
   for await(const entry of reader.getEntriesGenerator()){
    if(++budget.entries>LIMITS.entries)throw new Error('ZIP inventory exceeds 10,000 entries. Split this archive.');
    const raw=entry.filename.replace(/\\/g,'/'),path=prefix+raw,key=keyPrefix+'#'+ordinal+++' / '+raw;
    budget.metadata+=raw.length+(entry.comment?.length||0);if(budget.metadata>8*1024**2)throw new Error('Archive metadata is too large. Split this ZIP.');
    if(raw.startsWith('/')||/^[a-z]:/i.test(raw)||/[\u0000-\u001f]/.test(raw)||raw.split('/').some(v=>v==='..')){note(path,'Unsafe archive path excluded.');continue;}
    if(entry.directory)continue;
    if(seenNames.has(raw))note(path,'Repeated archive path kept as a separate entry. Review before importing.','zip_duplicate_path');seenNames.add(raw);
    if(raw.split('/').pop().length>240||path.length>1024||key.length>2048){note(path,'Entry filename or path is too long. Shorten it before importing.');continue;}
    if(ignored.test(raw)){note(path,'Operating-system metadata excluded.','zip_metadata');continue;}
    const mode=(entry.externalFileAttributes>>>16)&0xf000;
    if(mode&&mode!==0x8000){note(path,'Links and special filesystem entries cannot be imported.');continue;}
    if(executable.test(raw)){note(path,'Executable or application content remains in the retained ZIP and is excluded from data import.');continue;}
    if(!entry.uncompressedSize){note(path,'Empty entry excluded.');continue;}
    if(entry.diskNumberStart){note(path,'This entry belongs to a multipart ZIP. Combine all parts before importing.');continue;}
    if(!Number.isSafeInteger(entry.uncompressedSize)||entry.uncompressedSize>LIMITS.member||budget.bytes+entry.uncompressedSize>maxTotal){note(path,'Entry exceeds the 256 MiB member or 1 GiB expanded-batch limit. Extract or split it separately.');continue;}
    if(entry.uncompressedSize>8*1024**2&&entry.uncompressedSize>Math.max(1,entry.compressedSize)*500){note(path,'Unusually high expansion ratio. Extract and review this entry separately.');continue;}
    if(files.length>=maxFiles){note(path,'The import supports 99 entries plus its retained ZIP. Split the archive to include more.');continue;}
    const chunks=[];let written=0;
    try{
     const sink=new WritableStream({write(chunk){written+=chunk.length;budget.bytes+=chunk.length;if(written>entry.uncompressedSize||written>LIMITS.member||budget.bytes>maxTotal)throw new Error('Expanded size exceeds the declared size or archive budget.');chunks.push(chunk);progress(path,written,entry.uncompressedSize);}});
     await entry.getData(sink,{password:data.password||undefined,checkCrc32:true,checkAuthenticationCode:true,checkOverlappingEntry:true,strictness:'strict'});
     if(written!==entry.uncompressedSize)throw new Error('The expanded entry length does not match its directory record.');
     const blob=new File(chunks,raw.split('/').pop(),{lastModified:entry.lastModDate?.getTime()||file.lastModified});
     if(/\.zip$/i.test(raw)){await unpack(blob,path+'!/',depth+1,key+'!/');continue;}
     files.push({file:blob,path,key,scope:keyPrefix+raw.split('/').slice(0,-1).join('/'),crc32:entry.crc32,encrypted:entry.encrypted});
    }catch(error){note(path,/password|encrypted/i.test(error.message)?'A ZIP password is required or was incorrect. Enter it and retry this archive.':/signature|crc|authentic/i.test(error.message)?'Integrity verification failed. This entry was excluded.':'This entry could not be read safely. Re-export or extract it separately.');}
   }
  }finally{await reader.close();}
 }
 try{await unpack(data.file);postMessage({type:'result',files,notes,expandedBytes:budget.bytes});}
 catch(error){postMessage({type:'result',files,notes:[...notes,{path:data.file.name,code:'zip_archive_review',message:/password|encrypted/i.test(error.message)?'Enter the ZIP password and retry.':'Archive inventory could not be completed. Re-export a complete ZIP; split or damaged containers require correction.'}],expandedBytes:budget.bytes});}
};
