import {api,session} from './auth.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fields={sourceX:73,sourceY:77,receiverX:81,receiverY:85,midpointX:181,midpointY:185,inline:189,crossline:193,shot:9,receiver:13,channel:25,traceCode:29,offset:37,coordinateScalar:71,elevationScalar:69,sourceElevation:45,receiverElevation:41};
const keys=['revision','sourceVersion','dimension','dataKind','coordinateUnit','axisOrder','crs','datum','elevationUnit','elevationPositive','timeConvention','roles','notes','reviewed'];
export async function openGeometryReview(host,book){
 if(!book)throw new Error('Choose a retained source before reviewing its geometry.');
 const uid=session.user?.uid,pid=host.getProject().id,did=book.graph.sourceId;
 if(host.getProject().storage!=='cloud')throw new Error('Create an explicit Cloud copy to save a server geometry revision. Local source contents have not been uploaded.');
 const valid=()=>session.user?.uid===uid&&host.getProject()?.id===pid&&host.getState().seismicProcessing?.books.includes(book);
 const path=`/api/projects/${encodeURIComponent(pid)}/seismic/sources/${encodeURIComponent(did)}/geometry`;
 const call=(suffix='',options={})=>api(path+suffix,{...options,ownerUid:uid});
 const remote=await call();if(!valid())return;
 const saved=remote.review;
 const defaults={revision:0,sourceVersion:remote.sourceVersion,dimension:3,dataKind:'unstacked',coordinateUnit:'m',axisOrder:'easting-northing',crs:'',datum:'',elevationUnit:'m',elevationPositive:'up',timeConvention:'unconfirmed',notes:'',reviewed:false,
  roles:Object.fromEntries(['sourceX','sourceY','receiverX','receiverY','coordinateScalar'].map(k=>[k,{byte:fields[k],width:k==='coordinateScalar'?2:4,signed:true}]))};
 const draft=book.geometryDraft||(remote.stale?{...saved,sourceVersion:remote.sourceVersion,reviewed:false}:saved)||defaults;
 const select=(name,label,options)=>`<label>${label}<select name="${name}">${options.map(([value,title])=>`<option value="${value}" ${String(draft[name])===String(value)?'selected':''}>${title}</option>`).join('')}</select></label>`;
 host.modal('Review survey header geometry',`<p>Source ${esc(did)} · saved revision ${saved?.revision||0}. Assign only roles supported by the source documentation. These declarations do not establish complete survey geometry or enable geometry-dependent processing.</p>${remote.stale?'<p role="alert">The saved review belongs to an older source. Keep a copy and review the current source explicitly.</p>':''}<form id="sg-review">
 ${select('dimension','Survey dimension',[[2,'2D'],[3,'3D']])}${select('dataKind','Source observations',[['unstacked','Unstacked field traces'],['poststack','Stacked survey']])}
 ${select('coordinateUnit','Coordinate unit',[['m','Metres'],['ft','International feet'],['us-ft','US survey feet'],['degrees','Degrees'],['arcseconds','Arcseconds']])}
 ${select('axisOrder','Recorded first / second axis',[['easting-northing','Easting / northing'],['northing-easting','Northing / easting'],['longitude-latitude','Longitude / latitude'],['latitude-longitude','Latitude / longitude']])}
 <label>Source CRS description<textarea name="crs" maxlength="4096" required>${esc(draft.crs)}</textarea></label><label>Vertical datum<input name="datum" maxlength="240" value="${esc(draft.datum)}" required></label>
 ${select('elevationUnit','Elevation unit',[['m','Metres'],['ft','International feet'],['us-ft','US survey feet']])}${select('elevationPositive','Positive elevation',[['up','Up'],['down','Down']])}
 ${select('timeConvention','Recorded time convention',[['unconfirmed','Unconfirmed'],['TWT','Two-way time'],['one-way','One-way time']])}
 <div class="sg-roles"><table><caption>Trace-header roles · first byte is one-based. Unchecked fields have no assigned role.</caption><thead><tr><th>Use</th><th>Role</th><th>First byte</th><th>Width</th><th>Signed</th></tr></thead><tbody>${Object.entries(fields).map(([k,byte])=>{const r=draft.roles?.[k],width=r?.width||(['coordinateScalar','elevationScalar','traceCode'].includes(k)?2:4);return `<tr><td><input name="use:${k}" type="checkbox" aria-label="Use ${k}" ${r?'checked':''}></td><th scope="row">${k}</th><td><input name="byte:${k}" type="number" min="1" max="239" step="1" value="${r?.byte||byte}" aria-label="${k} first byte"></td><td><select name="width:${k}" aria-label="${k} width"><option value="2" ${width===2?'selected':''}>2</option><option value="4" ${width===4?'selected':''}>4</option></select></td><td><input name="signed:${k}" type="checkbox" aria-label="${k} signed" ${r?.signed!==false?'checked':''}></td></tr>`;}).join('')}</tbody></table></div>
 <label>Review evidence / unresolved survey QC<textarea name="notes" maxlength="4000" required>${esc(draft.notes)}</textarea></label><label><input type="checkbox" name="reviewed" required> I reviewed these roles, units, axes, CRS and datum against the source documentation</label>
 <button type="button" id="sg-preview">Preview retained headers</button><button id="sg-save" disabled>Save new geometry revision</button><button type="button" id="sg-export">Export review draft</button><button type="button" id="sg-reload">Reload saved review</button><p id="sg-error" role="alert"></p></form><pre id="sg-preview-result" class="sg-preview" aria-label="Retained geometry header preview"></pre>`);
 const form=document.querySelector('#sg-review'),error=document.querySelector('#sg-error'),output=document.querySelector('#sg-preview-result'),save=document.querySelector('#sg-save');let previewed=null;
 const still=()=>valid()&&document.querySelector('#sg-review')===form;
 function capture(){
  const values=new FormData(form),body=Object.fromEntries(keys.filter(k=>!['roles','revision','sourceVersion','dimension','reviewed'].includes(k)).map(k=>[k,values.get(k)]));
  body.revision=draft.revision;body.sourceVersion=draft.sourceVersion;body.dimension=Number(values.get('dimension'));body.reviewed=values.has('reviewed');body.roles={};
  for(const k of Object.keys(fields))if(values.has('use:'+k))body.roles[k]={byte:Number(values.get('byte:'+k)),width:Number(values.get('width:'+k)),signed:values.has('signed:'+k)};
  book.geometryDraft=body;host.save();return body;
 }
 const safe=fn=>async e=>{try{if(still())await fn(e);}catch(failure){if(still())error.textContent=failure.message;}};
 form.oninput=()=>{previewed=null;save.disabled=true;};
 document.querySelector('#sg-preview').onclick=safe(async()=>{if(!form.reportValidity())return;error.textContent='';const body=capture(),value=await call('/preview',{method:'POST',body});if(!still())return;previewed=JSON.stringify(body);output.textContent=JSON.stringify(value,null,2);save.disabled=false;});
 form.onsubmit=safe(async e=>{e.preventDefault();const body=capture();if(JSON.stringify(body)!==previewed)throw new Error('Preview these exact settings before saving a geometry revision.');save.disabled=true;const value=await call('',{method:'PUT',body});if(!still())return;book.geometryDraft=Object.fromEntries(keys.map(k=>[k,value.review[k]]));book.geometryReviewRevision=value.review.revision;host.save();document.querySelector('#dialog').close();host.render();host.toast('Geometry declaration saved. Full survey QC remains required.');});
 document.querySelector('#sg-export').onclick=safe(()=>host.download('seismic-geometry-review.json',new Blob([JSON.stringify(capture(),null,2)],{type:'application/json'})));
 document.querySelector('#sg-reload').onclick=safe(async()=>{book.geometryDraftBackup=capture();delete book.geometryDraft;host.save();await openGeometryReview(host,book);});
}
