import {automaticZipSummary,prepareAutomaticZip,startAutomaticZip,watchAutomaticZip} from './automatic-zip.js';
import {applyImportedEvidence} from './well-data.js';
import {sourceActionTrigger,openSourceActions,closeSourceActions,downloadOriginal} from './source-actions.js';
import {importCompletion,groupedImportIssues} from './well-import-ui.js';
import {suggest} from './well-data.js';
import {openWellQC} from './well-qc.js';
import {openWellImporter,sourceTextViewer} from './well-importer.js';
import {families,formatCatalog,mappingRoles,labels,visibleFamily,intakeFamilyAllowed,bytes} from './ingestion-catalog.js';
import {browserRead,loadCloud,nativeImport,commitNative,cancelNative,nativePreview,importLocal,commitLocal,pollImport,resumableUpload,readyImportDatasets,importIssueApplies} from './ingestion-client.js';
import * as repository from './project-repository.js';
import {api,session} from './auth.js';
import {ingestionState,rememberImport} from './import-drafts.js';

let lastProject=null,lastViewRoute=null,lastViewProject=null;
let host,tab='wells',query='',typeFilter='',statusFilter='',loading=false,lastCloud=0,refreshTimer;
const $=s=>document.querySelector(s);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=value=>value===null||value===undefined?'':typeof value==='object'?JSON.stringify(value):String(value);
const short=value=>{const result=text(value);return esc(result.length>160?result.slice(0,160)+'…':result);};
const nameOf=id=>families.find(f=>f.id===id)?.name||id;
export function configureData(context){host=context;}
function context(){return ingestionState(host.getState());}
const automaticZipAvailable=project=>project?.storage==='cloud'&&context().automaticZipEnabled===true;
const datasetKey=d=>`${d.importId||'science-'+d.scientificRunId}:${d.id}`;
export function dataPageView(route){
 const projectId=host.getProject()?.id;
 if(route!==lastViewRoute||projectId!==lastViewProject){
  tab=route==='documents'?'sources':'wells';
  typeFilter=route==='documents'?'documents':'';query='';statusFilter='';
  lastViewRoute=route;lastViewProject=projectId;
 }
 const state=host.getState(),project=host.getProject(),data=context();
 const wellNames=new Map((state.wellDrafts||[]).map(w=>[w.id,w.name||w.id]));for(const dataset of data.datasets||[])for(const well of dataset.wellRecords||[])if(!wellNames.has(well.id))wellNames.set(well.id,well.name||well.id);
 const wellName=id=>{const name=wellNames.get(id)||id||'';return /^[a-f0-9-]{30,}$/i.test(name)?'Well name needs review':name;};
 const matching=item=>(text(item.displayName||item.name||item.id)+' '+text(wellName(item.well))).toLowerCase().includes(query.toLowerCase())&&(!typeFilter||(item.family||item.type)===typeFilter)&&(!statusFilter||statusFilter==='Trash'&&(item.trashed===true)||(item.status||'').includes(statusFilter));
 const files=state.files||[],datasets=data.datasets||[],imports=data.imports||[];
 const active=datasets.filter(d=>d.active!==false);
 const shownSources=files.filter(f=>statusFilter==='Trash'?f.trashed:!f.trashed).filter(matching);
 const canSelect=tab==='sources'&&statusFilter!=='Trash'&&shownSources.length>0;
 const tabs=[['wells','Wells',(state.wellDrafts||[]).length],['sources','Sources',files.filter(f=>!f.trashed).length],['history','Import history',imports.length],['datasets','Datasets',active.length]];
 const automaticZip=automaticZipAvailable(project);
 const awaitingWells=tab==='wells'&&imports.find(r=>readyImportDatasets(r,unavailableDatasetIds(r,project)).some(d=>['logs','well_headers','arrays'].includes(d.family)));
 let body;
 if(tab==='sources')body=table([...(canSelect?['<input type="checkbox" id="source-select-all" aria-label="Select all shown sources">']:[]),'Original source','Data type','Well / survey','Status','Size','Actions'],shownSources.map(f=>`<tr>${canSelect?`<td><input type="checkbox" data-source-select="${esc(f.id||f.name)}" aria-label="Select ${esc(f.displayName||f.name)}"></td>`:''}<td><strong>${esc(f.displayName||f.name)}</strong><small>${f.external?'Linked external original':f.sha256?'SHA-256 verified':'Original retained'}</small></td><td>${esc(nameOf(f.type))}</td><td>${esc(f.well?wellName(f.well):'Not assigned')}</td><td>${pill(f.trashed?'In Trash':f.status||'Stored original · classification required')}</td><td class="mono">${typeof f.size==='number'?bytes(f.size):esc(f.size)}</td><td>${sourceActionTrigger(f)}</td></tr>`),'No sources yet','Add original files, then confirm their identity, mapping and references.');
 else if(tab==='datasets')body=table(['Dataset','Data type','Records','Well','Status',''],active.filter(matching).map(d=>`<tr><td><strong>${esc(d.name)}</strong><small>${esc(d.parserVersion||'')} · original linked</small></td><td>${esc(nameOf(d.family))}</td><td class="mono">${Number(d.rowCount||0).toLocaleString()}</td><td>${esc(d.well?wellName(d.well):'Not assigned')}</td><td>${pill(d.status)}</td><td><button data-dataset="${esc(datasetKey(d))}">Preview</button>${['checkshots','deviation'].includes(d.family)?`<button data-well-qc="${esc(d.id)}">Observations & QC</button>`:''}</td></tr>`),'No imported datasets','Originals become datasets only after inspection and your final confirmation.');
 else if(tab==='wells')body=table(['Well identifier','Evidence','Registration state',''],(state.wellDrafts||[]).filter(w=>[w.id,w.name,w.uwi,...(w.aliases||[])].some(value=>String(value||'').toLowerCase().includes(query.toLowerCase()))).map(w=>`<tr><td><strong>${esc(w.name||w.id)}</strong><small>${esc(w.uwi||w.id)}</small></td><td>${active.filter(d=>d.well===w.id).length} datasets</td><td>${pill(w.status)}</td><td><button data-well-evidence="${esc(w.id)}">View evidence</button><button data-well-open-map="${esc(w.id)}">Map</button><button data-well-open-interpretation="${esc(w.id)}">Interpretation</button></td></tr>`),'No wells registered','Confirm well identities while importing logs, headers or survey evidence.');
 else body=table(['Import','Data type','Sources','State',''],imports.filter(matching).map(r=>`<tr><td><strong>${esc(new Date(r.createdAt).toLocaleString())}</strong><small>${esc(r.id.slice(0,16))}</small></td><td>${esc(nameOf(r.family))}</td><td>${r.assets?.length||0}</td><td>${pill(r.status)}${r.automaticResult?'<small>'+esc(automaticZipSummary(r))+'</small>':''}</td><td><button data-import="${esc(r.id)}">${['inspecting','importing','uploading'].includes(r.status)?'View progress':'Review'}</button></td></tr>`),'Your import history starts here','Completed imports, warnings and retained originals stay traceable.');
 if(awaitingWells)body='<p class="sub">Inspection finished. Activate the ready datasets to register their wells. <button class="primary" id="activate-well-import" data-import-id="'+esc(awaitingWells.id)+'">Import ready datasets</button></p>'+body;
 return `<section class="data-library"><div class="data-page-head"><div><div class="study-kicker">PROJECT EVIDENCE</div><h1>Data</h1><p>${automaticZip?'Choose a ZIP or drop it on Upload ZIP. Review any items that need your input.':'Keep the originals. Confirm the meaning. Import with confidence.'}</p></div><div class="actions"><button id="data-formats">Supported formats</button>${automaticZip?'<input id="automatic-zip-file" type="file" accept=".zip,application/zip" hidden><button id="automatic-zip-upload" class="primary" type="button">'+host.icon('plus')+'Upload ZIP</button><button data-action="upload">Guided import</button>':'<button class="primary" data-action="upload">'+host.icon('plus')+'Add data</button>'}</div></div><div class="data-summary"><span><strong>${files.filter(f=>!f.trashed).length}</strong> originals</span><span><strong>${active.length}</strong> datasets</span><span><strong>${active.filter(d=>d.status==='retained/unresolved').length}</strong> need reference review</span><span>${project.storage==='cloud'?'Cloud storage':project.storage==='local'?'Local folder':'Portable project'}${data.quota?` · ${bytes(data.quota.used)} / ${bytes(data.quota.projectLimit)}`:''}</span></div><div class="data-surface"><nav class="data-tabs" aria-label="Data sections">${tabs.map(([id,title,count])=>`<button data-data-section="${id}" aria-current="${id===tab?'page':'false'}">${title}<span>${count}</span></button>`).join('')}</nav><div class="data-filter-bar"><label class="data-search">${host.icon('search')}<input id="data-query" aria-label="Search project data" placeholder="Search by name or well…" value="${esc(query)}"></label>${tab!=='wells'?`<select id="data-type-filter" aria-label="Filter data type"><option value="">All data types</option>${families.map(f=>`<option value="${f.id}" ${typeFilter===f.id?'selected':''}>${f.name}</option>`).join('')}</select><select id="data-status-filter" aria-label="Filter import status"><option value="">All states</option>${['ready','retained','awaiting','failed','cancelled','inspecting',...(tab==='sources'?['Trash']:[])].map(v=>`<option ${statusFilter===v?'selected':''}>${v}</option>`).join('')}</select>`:''}<button id="refresh-data" class="quiet">${loading?'Refreshing…':'Refresh'}</button></div>${canSelect?`<div class="data-filter-bar source-bulk-actions"><span id="source-selection-count" role="status">0 selected</span><button type="button" id="source-delete-selected" disabled>Delete selected</button><button type="button" id="source-delete-all">Delete all shown (${shownSources.length})</button></div>`:''}${body}</div><p class="data-footnote">Ready means imported—not scientifically approved. Unconfirmed units, coordinates and datums remain visible.</p></section>`;
}
function table(headers,rows,title,description){const filtered=!!(query||typeFilter||statusFilter)&&((host.getState().files||[]).length+(context().datasets||[]).length+(host.getState().wellDrafts||[]).length)>0;return rows.length?`<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`:`<div class="data-empty"><span>${host.icon('file')}</span><h2>${filtered?'No matching data':title}</h2><p>${filtered?'Your saved data is still here. Change or clear the filters to see it.':description}</p>${filtered?'<button id="clear-data-filters">Clear filters</button>':automaticZipAvailable(host.getProject())?`<button type="button" data-automatic-zip-open>Upload ZIP ${host.icon('arrow')}</button>`:`<button data-action="upload">Add data ${host.icon('arrow')}</button>`}</div>`;}
function pill(status){return `<span class="data-status ${/failed|blocking/.test(status)?'failed':/ready/.test(status)?'ready':'neutral'}">${esc(status||'Not classified')}</span>`;}
export function bindDataPage(){closeSourceActions();if(lastProject!==host.getProject()?.id){lastProject=host.getProject()?.id;lastCloud=0;}
 document.querySelectorAll('[data-data-section]').forEach(b=>b.onclick=()=>{tab=b.dataset.dataSection;if(statusFilter==='Trash'&&tab!=='sources')statusFilter='';host.render();});
 $('#data-query')?.addEventListener('input',e=>{query=e.target.value;const position=e.target.selectionStart;host.render();$('#data-query').focus();$('#data-query').setSelectionRange(position,position);});
 $('#data-type-filter')?.addEventListener('change',e=>{typeFilter=e.target.value;host.render();});$('#data-status-filter')?.addEventListener('change',e=>{statusFilter=e.target.value;host.render();});
 $('#clear-data-filters')?.addEventListener('click',()=>{query='';typeFilter='';statusFilter='';host.render();});
 $('#data-formats')?.addEventListener('click',()=>host.modal('Format coverage',`<p class="sub">Coverage depends on the documented version and selected storage. Closed variants require conversion; no format is accepted by extension alone.</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Format</th><th>Versions / boundaries</th><th>Cloud</th><th>Local</th></tr></thead><tbody>${formatCatalog.map(f=>`<tr><td>${esc(f.name)}</td><td>${esc(f.versions)}</td><td>${esc(f.server)}</td><td>${esc(f.local)}</td></tr>`).join('')}</tbody></table></div>`));
 $('#refresh-data')?.addEventListener('click',()=>refreshData(true));
 const zipButton=$('#automatic-zip-upload'),zipFile=$('#automatic-zip-file');
 if(zipButton&&zipFile){
  const launch=file=>startAutomaticZip(host,host.getProject(),file,{
   remember:record=>rememberImport(host.getState(),record),
   finished:async(record,visible,timings)=>{
    await host.reload();tab='wells';
    await refreshData(true);
    if(visible&&$('#dialog [data-zip-task]'))showAutomaticResult(record,host.getProject(),timings);
    else if(record.automaticResult)host.toast(automaticZipSummary(record));
   }
  });
  zipButton.onclick=()=>zipFile.click();
  document.querySelectorAll('[data-automatic-zip-open]').forEach(button=>button.onclick=()=>zipFile.click());
  zipFile.onchange=()=>{const file=zipFile.files[0];zipFile.value='';if(file)launch(file);};
  zipButton.ondragover=event=>{if(event.dataTransfer.types.includes('Files'))event.preventDefault();};
  zipButton.ondrop=event=>{event.preventDefault();const files=event.dataTransfer.files;if(files.length===1)launch(files[0]);else host.toast('Drop one ZIP at a time.');};
 }

 const all=$('#source-select-all'),rows=[...document.querySelectorAll('[data-source-select]')],remove=$('#source-delete-selected');
 const updateSelection=()=>{const count=rows.filter(input=>input.checked).length;if(!all||!remove)return;all.checked=count===rows.length;all.indeterminate=count>0&&count<rows.length;remove.disabled=count===0;$('#source-selection-count').textContent=count+' selected';};
 if(all)all.onchange=()=>{for(const input of rows)input.checked=all.checked;updateSelection();};
 for(const input of rows)input.onchange=updateSelection;
 if(remove)remove.onclick=()=>confirmSourceTrash(rows.filter(input=>input.checked).map(input=>input.dataset.sourceSelect));
 const deleteAll=$('#source-delete-all');
 if(deleteAll)deleteAll.onclick=()=>confirmSourceTrash(rows.map(input=>input.dataset.sourceSelect));
 document.querySelectorAll('[data-source-actions]').forEach(button=>button.onclick=()=>{const file=host.getState().files.find(f=>(f.id||f.name)===button.dataset.sourceActions);if(file)openSourceActions(host,file,button,{inspect:f=>sourceDetail(f.id||f.name),reclassify:f=>openImporter({existing:f,family:families.some(category=>category.id===f.type)?f.type:undefined})});});
 document.querySelectorAll('[data-source]').forEach(b=>b.onclick=()=>sourceDetail(b.dataset.source));
 document.querySelectorAll('[data-dataset]').forEach(b=>b.onclick=()=>datasetDetail(b.dataset.dataset));
 document.querySelectorAll('[data-well-open-map],[data-well-open-interpretation]').forEach(button=>button.onclick=()=>{const id=button.dataset.wellOpenMap||button.dataset.wellOpenInterpretation;host.openWellWorkspace(button.dataset.wellOpenMap?'map':'interpretation',id);});
 document.querySelectorAll('[data-well-qc]').forEach(b=>b.onclick=()=>openWellQC(host,context().datasets.find(d=>d.id===b.dataset.wellQc)).catch(e=>host.toast(e.message)));
 $('#activate-well-import')?.addEventListener('click',event=>reviewImport(event.currentTarget.dataset.importId,[],{readyOnly:true}));
 document.querySelectorAll('[data-import]').forEach(b=>b.onclick=()=>reviewImport(b.dataset.import));
 document.querySelectorAll('[data-well-evidence]').forEach(b=>b.onclick=()=>{query=b.dataset.wellEvidence;tab='datasets';host.render();});
 if(host.getProject()?.storage==='cloud'&&Date.now()-lastCloud>10000&&!loading)refreshData();
}
async function refreshData(force=false){
 const project=host.getProject();if(!project||project.storage!=='cloud')return;
 loading=true;try{const data=await loadCloud(project);if(host.getProject()?.id!==project.id)return;applyImportedEvidence(host.getState(),data);lastCloud=Date.now();loading=false;host.render();if(data.imports.some(r=>['inspecting','importing'].includes(r.status))){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>refreshData(),5000);}}catch(error){host.toast(error.message);}finally{loading=false;}
}
async function sourceDetail(id){
 const source=host.getState().files.find(f=>(f.id||f.name)===id);if(!source)return;
 host.modal('Original source',`<h3>${esc(source.displayName||source.name)}</h3><dl class="data-details"><dt>Original filename</dt><dd>${esc(source.name)}</dd><dt>Size</dt><dd>${typeof source.size==='number'?bytes(source.size):esc(source.size)}</dd><dt>Storage</dt><dd>${source.external?'Linked external file':'Retained original'}</dd><dt>Fingerprint</dt><dd class="mono">${esc(source.sha256||'Computed during inspection')}</dd><dt>Status</dt><dd>${esc(source.status||'Classification required')}</dd></dl><div class="actions"><button id="source-text">View complete source</button><button id="source-download">Download original</button><button id="source-classify" class="primary">Import / classify</button></div>`);
 $('#source-download').onclick=()=>downloadOriginal(host,source).catch(error=>host.toast(error.message));
 $('#source-text').onclick=async()=>{try{if(/\.(dlis|lis|xlsx|xls|pdf|docx|png|jpg|segy|sgy)$/i.test(source.name))throw new Error('Use the structured dataset preview or download this binary original.');if(source.size>128*1024**2&&host.getProject().storage==='cloud')throw new Error('Download this large original for local text inspection.');await sourceTextViewer(host,new File([await repository.source(host.getProject(),source)],source.name));}catch(e){host.toast(e.message);}};
 $('#source-classify').onclick=()=>{ $('#dialog').close();openImporter({existing:source});};
}
function confirmSourceTrash(ids){
 const project=host.getProject(),workspace=host.getState(),ownerUid=session.user?.uid;
 const selected=new Set(ids),sources=(workspace.files||[]).filter(file=>selected.has(file.id||file.name)&&!file.trashed);
 if(!sources.length)return;
 const linked=context().datasets.filter(dataset=>dataset.active!==false&&selected.has(dataset.sourceId)).length;
 const count=sources.length;
 host.modal('Move '+count+' sources to Trash?',`<p>This removes the selected sources from the active inventory. You can restore them from the Trash filter.</p><p>${linked?linked+' active datasets still reference these retained originals. ':''}Moving to Trash keeps the original bytes and does not reclaim storage.</p><p id="source-bulk-error" role="alert"></p><div class="actions"><button type="button" id="source-bulk-cancel">Cancel</button><button type="button" class="primary" id="source-bulk-confirm">Move ${count} to Trash</button></div>`);
 const modal=$('#dialog'),button=$('#source-bulk-confirm'),cancel=$('#source-bulk-cancel');
 let saving=false;
 cancel.onclick=()=>modal.close();cancel.focus();
 modal.querySelector('[data-close]').onclick=()=>{if(!saving)modal.close();};
 modal.oncancel=event=>{if(saving)event.preventDefault();};
 button.onclick=async()=>{
  if(host.getProject()?.id!==project.id||session.user?.uid!==ownerUid||host.getState()!==workspace){$('#source-bulk-error').textContent='The project or source list changed. Refresh and select again.';return;}
  saving=true;button.disabled=true;cancel.disabled=true;
  try{
   if(project.storage==='cloud'){
    if(count>1000)throw new Error('Select at most 1,000 sources per action. Filter the inventory to delete in batches.');
    await host.importTask(()=>api(`/api/projects/${project.id}/sources/trash`,{method:'POST',body:{source_ids:sources.map(file=>file.id)},ownerUid}));
   }else{
    const now=new Date().toISOString();
    for(const file of sources)Object.assign(file,{trashed:true,deletedAt:now});
    workspace.audit=[{action:'Moved '+count+' sources to Trash',time:now},...(workspace.audit||[])].slice(0,200);
    host.save();await host.flush();
   }
   modal.close();host.render();host.toast(count+' sources moved to Trash.');
  }catch(error){const node=$('#source-bulk-error');if(node)node.textContent=error.message;button.disabled=false;cancel.disabled=false;}
  finally{saving=false;}
 };
}

function previewTable(dataset){if(!dataset.columns?.length)return '<p class="sub">No parsed preview yet. Choose a format and reinspect the retained source.</p>';return `<div class="data-preview-meta"><span>${dataset.rowCount.toLocaleString()} records</span><span>${dataset.columns.length} columns</span><span>${esc(dataset.metadata?.format||'')}</span></div><div class="table-wrap data-preview"><table><thead><tr>${dataset.columns.slice(0,16).map(c=>`<th>${esc(c.mnemonic)}<small>${esc(c.effectiveUnit||c.unit||'Unit unconfirmed')}</small></th>`).join('')}</tr></thead><tbody>${dataset.preview.slice(0,30).map(row=>`<tr>${row.slice(0,16).map(v=>`<td>${short(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${curvePlot(dataset)}<details class="source-metadata"><summary>Source metadata and references</summary><pre>${esc(JSON.stringify(dataset.metadata||{},null,2))}</pre></details>`;}
function curvePlot(dataset){if(dataset.columns.length<2||dataset.family!=='logs')return '';const data=dataset.preview.filter(row=>typeof row[0]==='number'&&typeof row[1]==='number');if(data.length<2)return '';const xs=data.map(r=>r[1]),ys=data.map(r=>r[0]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);const pts=data.map(r=>`${40+(r[1]-xmin)/(xmax-xmin||1)*500},${20+(r[0]-ymin)/(ymax-ymin||1)*180}`).join(' ');return `<div class="data-curve"><p>Source preview · ${esc(dataset.columns[1].mnemonic)} against ${esc(dataset.columns[0].mnemonic)} · first ${data.length} valid samples</p><svg viewBox="0 0 580 230" role="img" aria-label="Imported source curve preview"><path d="M40 15v185h510" stroke="#a8b9b1" fill="none"/><polyline points="${pts}" stroke="#087c73" stroke-width="1.6" fill="none"/><text x="40" y="220">${xmin}</text><text x="480" y="220">${xmax}</text></svg></div>`;}
async function datasetDetail(key){const [importId,id]=key.split(':');const dataset=context().datasets.find(d=>d.id===id&&(d.importId===importId||'science-'+d.scientificRunId===importId));if(!dataset)return;try{const result=host.getProject().storage==='cloud'?await (dataset.scientificRunId?api(`/api/projects/${host.getProject().id}/science/datasets/${id}/rows?limit=2000`).then(r=>({...r,preview:r.rows})):nativePreview(host.getProject(),importId,id)):dataset;if(dataset.activeColumns){const indices=result.columns.map((c,i)=>dataset.activeColumns.includes(c.id)?i:-1).filter(i=>i>=0);result.columns=indices.map(i=>result.columns[i]);result.preview=result.preview.map(row=>indices.map(i=>row[i]));}host.modal('Dataset preview',`<h3>${esc(dataset.name)}</h3><p class="sub">Imported evidence · scientific approval has not been granted.</p>${previewTable(result)}${issuesView(dataset.issues||[])}`);}catch(error){host.toast(error.message);}}
function issuesView(issues){return issues.length?`<div class="import-issues">${issues.slice(0,80).map(i=>`<div class="import-issue ${i.severity==='blocking'?'blocking':''}"><strong>${i.severity==='blocking'?'Resolve before activation':'Review'}</strong><p>${esc(i.message)}</p></div>`).join('')}</div>`:'<div class="import-clear">No import validation issues found. Scientific review is separate.</div>';}

export async function openImporter(options={}){return openWellImporter(host,options,(record,pendingIds,options)=>{rememberImport(host.getState(),record);return reviewImport(record.id,pendingIds,options);},editNativeMapping);}
function recordView(record,pendingIds=[]){const blocking=(record.issues||[]).some(i=>i.severity==='blocking'&&!i.sourceId&&!i.source)||!(record.datasets||[]).some(d=>!d.issues?.some(i=>i.severity==='blocking'));return `<div class="import-result-head">${pill(record.status)}<span>${record.assets?.length||0} retained originals · ${record.datasets?.filter(d=>d.active).length||0} active datasets · ${record.datasets?.filter(d=>!d.active).length||0} pending datasets</span></div>${issuesView(record.issues||[])}${record.assets.map(a=>`<p><strong>${esc(a.name)}</strong> · ${a.archiveExpanded?'retained ZIP':record.datasets.some(d=>d.sourceId===a.id&&d.active)?'active evidence':record.datasets.some(d=>d.sourceId===a.id)?'pending review':'retained / needs review'} <button type="button" data-fix-source="${esc(a.clientId||a.id)}">Review source / resolve issues</button></p>`).join('')}<div class="import-dataset-list">${(record.datasets||[]).map(d=>`<label class="layer"><input type="checkbox" data-select-dataset="${esc(d.id)}" ${pendingIds.includes(d.id)||d.issues?.some(i=>i.severity==='blocking')?'':'checked'}>Include dataset</label><button type="button" data-review-dataset="${esc(d.id)}"><span><strong>${esc(d.name)}</strong><small>${Number(d.rowCount||0).toLocaleString()} records · ${d.columns?.length||0} columns</small></span>Preview →</button>`).join('')}</div>${!record.committedAt&&['awaiting confirmation','retained/unresolved'].includes(record.status)?`<label class="layer"><input type="checkbox" id="ack-import-warnings">I reviewed the remaining warnings. Imported data is not scientifically approved.</label><label class="field">Save mapping template <small>Optional</small><input id="import-template-name" maxlength="100" placeholder="For example: deviation survey export"></label><button type="button" class="primary" id="commit-import" ${blocking?'disabled':''}>Confirm import</button>${blocking?'<p class="sub">Originals are retained. Resolve the blocking format or mapping issues before activation.</p>':''}`:''}`;}
function bindRecordActions(record,project,onComplete){
 const commitButton=$('#commit-import');
 if(commitButton){
  const previous=(context().datasets||[]).filter(d=>d.active!==false);
  if(previous.length){const field=document.createElement('label');field.className='field';field.innerHTML='Version handling<select id="import-replace"><option value="">Create independent datasets (recommended)</option>'+previous.map(d=>'<option value="'+esc(d.id)+'">Replace active: '+esc(d.name)+'</option>').join('')+'</select><small>Replacement preserves the previous version. Select one new dataset.</small>';commitButton.before(field);}
  if(project.storage==='cloud'){const edit=document.createElement('button');edit.type='button';edit.textContent='Edit mapping / references';edit.onclick=()=>editNativeMapping(record,project);commitButton.before(edit);}
 }
 $('#commit-import')?.addEventListener('click',async()=>{try{if(record.issues?.length&&!$('#ack-import-warnings').checked)throw new Error('Acknowledge the remaining warnings before confirming.');$('#commit-import').disabled=true;const name=$('#import-template-name').value.trim(),replaceId=$('#import-replace')?.value||null;const selection={selected_dataset_ids:[...document.querySelectorAll('[data-select-dataset]:checked')].map(e=>e.dataset.selectDataset),selected_columns:{}};document.querySelectorAll('[data-select-column]').forEach(input=>{const id=input.dataset.columnDataset;selection.selected_columns[id]||=[];if(input.checked)selection.selected_columns[id].push(input.dataset.selectColumn);});if(project.storage==='cloud'){Object.assign(record,await host.importTask(()=>commitNative(project,record,true,name,replaceId,selection)));await host.reload();await refreshData(true);}else Object.assign(record,await commitLocal(host.getState(),record,{templateName:name,replaceId,selection,onSave:async()=>{host.save();await host.flush();}}));onComplete();}catch(error){host.toast(error.message);if($('#commit-import'))$('#commit-import').disabled=false;}});
 document.querySelectorAll('[data-review-dataset]').forEach(button=>button.onclick=async()=>{try{const d=record.datasets.find(d=>d.id===button.dataset.reviewDataset),preview=project.storage==='cloud'?await nativePreview(project,record.id,d.id):d;const panel=document.createElement('section');panel.className='inline-dataset-preview';panel.innerHTML='<h3>'+esc(d.name)+'</h3>'+previewTable(preview)+'<details><summary>Select active columns / channels</summary>'+preview.columns.map(c=>'<label class="layer"><input type="checkbox" data-select-column="'+esc(c.id)+'" data-column-dataset="'+esc(d.id)+'" checked>'+esc(c.mnemonic)+' · '+esc(c.effectiveUnit||c.unit||'unit unconfirmed')+'</label>').join('')+'</details>';button.after(panel);button.disabled=true;}catch(error){host.toast(error.message);}});
}
async function editNativeMapping(record,project,assetKey,sheetName,{datasetId,issue,onBack,onSaved}={}){
 try{const asset=record.assets.find(a=>a.clientId===assetKey||a.id===assetKey)||record.assets[0],dataset=record.datasets?.find(d=>(d.assetKey===(asset.clientId||asset.id)||d.sourceId===asset.id)&&(datasetId?d.id===datasetId:!sheetName||d.metadata?.sheet===sheetName)),preview=dataset?await nativePreview(project,record.id,dataset.id):{columns:[],preview:[],rowCount:0},root=structuredClone(record.options||{}),key=asset.clientId||asset.id,family=asset.family||record.family,base=structuredClone(root.perAsset?.[key]||root.perFile?.[asset.name]||root),sheet=dataset?.metadata?.sheet,options=suggest(preview,family,{...base,...base.sheetSettings?.[sheet],mapping:{...preview.mapping,...base.mapping,...base.sheetSettings?.[sheet]?.mapping}}),refs=options.references||{},mapping=options.mapping||{};
  const wells=[...(host.getState().wellDrafts||[]),...record.datasets.flatMap(d=>d.wellRecords||[])].filter((w,i,list)=>list.findIndex(candidate=>candidate.id===w.id)===i);
  const selectedWell=options.well||dataset?.well||'';
  const wellField=onBack?`<label class="field">Owning well<select name="well"><option value="">Unassigned</option>${selectedWell&&!wells.some(w=>w.id===selectedWell)?`<option selected value="${esc(selectedWell)}">${esc(options.wellName||selectedWell)}</option>`:''}${wells.map(w=>`<option value="${esc(w.id)}" ${w.id===selectedWell?'selected':''}>${esc(w.name||w.id)}${w.uwi?' / '+esc(w.uwi):''}</option>`).join('')}</select></label>`:null;
  const profile=dataset?.metadata?.profileSignature;
  const comparisons=profile?record.datasets.filter(d=>d.family==='checkshots'&&d.metadata?.profileSignature===profile):[];
  const comparison=comparisons.length>1?`<details ${issue==='checkshot_heading_conflict'?'open':''}><summary>Compare headings for identical checkshot measurements</summary><p>Check the column labels against your survey documentation before confirming their meaning.</p><ul>${comparisons.map(d=>`<li><strong>${esc(d.name)}</strong> / ${d.columns.map(c=>esc(c.mnemonic)).join(' / ')}</li>`).join('')}</ul></details>`:'';
  const field=(name,label,value='')=>`<label class="field">${esc(label)}<input name="${esc(name)}" value="${esc(value)}"></label>`;
  host.modal(onBack?'Step 2 - Resolve source issues':'Review retained source',`${onBack?'<button id="native-back-to-review" type="button">Back to Review</button>':''}<p>Each asset retains its own classification and associations. Reinspection reuses originals.</p><label class="field">Source asset<select id="native-asset">${record.assets.map(a=>`<option value="${esc(a.clientId||a.id)}" ${a===asset?'selected':''}>${esc(a.name)} · ${esc(a.clientId||a.id)}</option>`).join('')}</select></label>${record.datasets.filter(d=>d.sourceId===asset.id&&d.metadata?.sheet).length>1?`<label class="field">Measurement worksheet<select id="native-sheet">${record.datasets.filter(d=>d.sourceId===asset.id).map(d=>`<option value="${esc(d.metadata?.sheet)}" ${d===dataset?'selected':''}>${esc(d.metadata?.sheet)}</option>`).join('')}</select></label>`:''}<div class="native-mapping-layout"><section class="native-mapping-evidence" aria-label="Retained source rows"><h3>Retained source rows</h3>${previewTable(preview)}${comparison}${preview.metadata?.surveyBlockProposal?`<section><h3>Compare station blocks</h3><p>These blocks have matching angles and scaled depths. Review the original and choose the authoritative block and its depth unit. Neither block is selected automatically.</p>${(preview.metadata.surveyBlockProposal.blocks||[]).map((block,index)=>`<details><summary>Block ${index+1} · logical rows [${block.range.join(', ')})</summary>${previewTable({columns:block.columns.map(mnemonic=>({mnemonic})),preview:block.rows})}<button type="button" data-station-block="${esc(JSON.stringify([block.range]))}">Use this block</button></details>`).join('')}</section>`:''}<details><summary>Structured source metadata</summary><pre>${esc(JSON.stringify(preview.metadata||{},null,2))}</pre></details></section><form id="native-mapping"><label class="field">Data category<select name="family">${families.map(f=>`<option value="${f.id}" ${family===f.id?'selected':''}>${esc(f.name)}</option>`).join('')}</select></label><div class="form-grid">${(mappingRoles[family]||[]).map(role=>`<label class="field">${esc(labels[role]||role)}<select name="mapping:${esc(role)}"><option value="">Unconfirmed</option>${preview.columns.map((c,i)=>`<option value="${i}" ${String(mapping[role])===String(i)?'selected':''}>${esc(c.mnemonic)} · ${esc(c.unit||'unit unknown')}</option>`).join('')}</select></label>`).join('')}${['depthReference','depthUnit','depthSign','northReference','angleUnit','timeConvention','timeUnit','timeSign','timeDatum','verticalDatum','crs','coordinateOrder','domain','northCorrection','declination'].map(k=>field('ref:'+k,k,refs[k])).join('')}${wellField||field('well','Default owning well ID',selectedWell)}${field('wellName','Source well name',options.wellName)}${field('surveyMethod','Survey representation: angles / offsets / xy_tvd / coordinates',options.surveyMethod)}${field('rowRanges','Reviewed logical row ranges (JSON, zero-based half-open)',JSON.stringify(options.rowRanges||[]))}<label class="layer"><input type="checkbox" name="rowSelectionReviewed" ${options.rowSelectionReviewed?'checked':''}>I reviewed the station block and its units.</label><label class="layer"><input type="checkbox" name="checkshotHeadingsReviewed" ${options.checkshotHeadingsReviewed?'checked':''}>I reviewed checkshot depth/time headings against independent evidence.</label><label class="layer"><input type="checkbox" name="retainOnly" ${options.retainOnly?'checked':''}>Retain original without processing (enable its project workflow later).</label>${field('hdfPaths','HDF5 dataset paths',(options.hdfPaths||[]).join(','))}${field('frames','Frame names (blank = all)',(options.frames||[]).join(','))}</div><details open><summary>Inspected dataset associations</summary>${record.datasets.filter(d=>(d.assetKey===key||d.sourceId===asset.id)&&d.metadata?.rowWell&&d.metadata.well).map(d=>{const raw=d.metadata.well,list=[...(host.getState().wellDrafts||[]),...record.datasets.flatMap(item=>item.wellRecords||[])].filter((w,i,all)=>all.findIndex(v=>v.id===w.id)===i);return `<label class="field">${esc(d.name)} / ${esc(raw)}<select name="binding:${esc(raw)}"><option value="">Resolve association</option>${list.map(w=>`<option value="${esc(w.id)}" ${w.id===(options.wellBindings?.[raw]||d.well)?'selected':''}>${esc(w.name||w.id)} / ${esc(w.uwi||w.id)}</option>`).join('')}</select></label>`;}).join('')}</details><details><summary>Row associations and duplicate decisions</summary><p>Use stable registered well IDs. Header actions use zero-based source rows and explicit keep, skip or merge.</p><label class="field">Row well bindings (JSON)<textarea name="wellBindings">${esc(JSON.stringify(options.wellBindings||{},null,2))}</textarea></label><label class="field">Header row actions (JSON)<textarea name="headerActions">${esc(JSON.stringify(options.headerActions||{},null,2))}</textarea></label></details><details><summary>Column units</summary>${preview.columns.map((c,i)=>field('unit:'+i,c.mnemonic+' · '+(c.unit||'unresolved'),options.units?.[i])).join('')}</details><p id="native-mapping-progress" role="status"></p><p id="native-mapping-error" role="alert"></p><button class="primary">Save & reinspect selected source</button></form></div>`);
  document.querySelectorAll('[data-station-block]').forEach(button=>button.onclick=()=>{$('[name=rowRanges]').value=button.dataset.stationBlock;$('[name=rowSelectionReviewed]').checked=false;$('[name="ref:depthUnit"]').focus();});
  const editorState={issue,onBack,onSaved};
  $('#native-sheet')?.addEventListener('change',event=>editNativeMapping(record,project,key,event.target.value,editorState));
  $('#native-asset').onchange=e=>editNativeMapping(record,project,e.target.value,undefined,editorState);
  let saving=false;
  if(onBack){
   const back=()=>{if(!saving)onBack();};
   $('#native-back-to-review').onclick=back;
   $('#dialog [data-close]').onclick=back;
   $('#dialog').oncancel=event=>{event.preventDefault();back();};
   const fields={association:'well',depth_units:'ref:depthUnit',depth_unit:'ref:depthUnit',depth_reference:'ref:depthReference',time_reference:'ref:timeConvention',checkshot_heading_conflict:'checkshotHeadingsReviewed',survey_blocks_review:'rowRanges'};
   const field=issue?.startsWith('mapping_')?'mapping:'+issue.slice(8):fields[issue];
   if(field)$('#native-mapping').elements.namedItem(field)?.focus();
  }
  $('#native-mapping').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget,button=form.querySelector('button');button.disabled=true;saving=true;try{const values=new FormData(form);options.references||={};options.mapping||={};options.units||={};for(const [name,value]of values){if(name.startsWith('ref:'))options.references[name.slice(4)]=String(value).trim();if(name.startsWith('mapping:'))options.mapping[name.slice(8)]=String(value);if(name.startsWith('unit:'))options.units[name.slice(5)]=String(value).trim();}for(const name of ['family','well','wellName','surveyMethod'])options[name]=String(values.get(name)||'');for(const name of ['frames','hdfPaths'])options[name]=String(values.get(name)||'').split(',').map(v=>v.trim()).filter(Boolean);for(const name of ['wellBindings','headerActions']){const parsed=JSON.parse(values.get(name)||'{}');if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')throw new Error('Enter an object for '+name);options[name]=parsed;}for(const [name,value]of values)if(name.startsWith('binding:')&&name.slice(8).trim())options.wellBindings[name.slice(8)]=String(value);delete options.wellBindings[''];root.perAsset||={};options.mapping=globalThis.StrataxImportRecipes.canonicalMapping(options.mapping,family);const ranges=JSON.parse(values.get('rowRanges')||'[]');if(!Array.isArray(ranges))throw new Error('Enter row ranges as [start,end] pairs.');if(ranges.length)options.rowRanges=ranges;else delete options.rowRanges;options.rowSelectionReviewed=values.has('rowSelectionReviewed');options.checkshotHeadingsReviewed=values.has('checkshotHeadingsReviewed');options.retainOnly=values.has('retainOnly');options.autoPrepare=false;
  if(family==='checkshots'&&options.mapping.depth&&options.mapping.depth===options.mapping.time)throw new Error('Depth and time must use different columns.');
  if(onBack&&options.well!==selectedWell){
   const owner=wells.find(w=>w.id===options.well);
   options.wellName=owner?.name||'';
   options.expectedWell=owner?{id:owner.id,name:owner.name,uwi:owner.uwi,aliases:owner.aliases||[]}:null;
  }
  delete options.sheetSettings;root.perAsset[key]=sheet?{...base,autoPrepare:false,sheetSettings:{...base.sheetSettings,[sheet]:options}}:options;
  if(sheet)root.perAsset[key].family=options.family;
  const updated=await host.importTask(async()=>{
   if(record.mode==='automatic_zip'&&record.committedAt){
    return nativeImport(project,[{id:key,existingId:asset.id,family:options.family,file:{name:asset.name,size:asset.size}}],'mixed',
     {schemaVersion:2,parentImportId:record.id,perAsset:{[key]:root.perAsset[key]}},
     {onProgress:message=>{const status=$('#native-mapping-progress');if(status)status.textContent=message;}});
   }await api(`/api/projects/${project.id}/imports/${record.id}/configuration`,{method:'PUT',body:{revision:record.revision,options:root}});await api(`/api/projects/${project.id}/imports/${record.id}/inspect`,{method:'POST',body:{}});return pollImport(project,record.id,{onProgress:message=>{const status=$('#native-mapping-progress');if(status)status.textContent=message;}});});
   if(onSaved){onSaved(updated);return;}
   $('#dialog').close();await refreshData(true);host.toast('Reinspection finished. Open Import history to review the updated source.');
  }catch(error){const message=$('#native-mapping-error');if(message)message.textContent=error.message;button.disabled=false;}finally{saving=false;}};
 }catch(error){host.toast(error.message);onBack?.();}
}
function unavailableDatasetIds(record,project){
 const trashed=new Set((host.getState().files||[]).filter(source=>source.trashed).map(source=>source.id));
 return (record.datasets||[]).filter(d=>trashed.has(d.sourceId)||!intakeFamilyAllowed(d.family,project)).map(d=>d.id);
}
function confirmReadyImport(record,project,pendingIds,{onBack,onCommitted}={}){
 const ready=readyImportDatasets(record,[...pendingIds,...unavailableDatasetIds(record,project)]);
 if(!ready.length){host.toast('There are no ready datasets in this inspection. Review the pending sources for details.');return;}
 const selectedIds=new Set(ready.map(d=>d.id));
 const pending=record.datasets.filter(d=>!selectedIds.has(d.id));
 const sourceNames=new Map(record.assets.map(asset=>[asset.id,asset.name]));
 const warnings=(record.issues||[]).filter(issue=>ready.some(d=>importIssueApplies(issue,d,sourceNames.get(d.sourceId))));
 const names=datasets=>'<ul>'+datasets.map(d=>'<li>'+esc(d.name)+'</li>').join('')+'</ul>';
 const uid=session.user?.uid;
 host.modal('Import ready datasets', `<p><strong>${ready.length} ready to import into ${esc(project.name||'this project')}${pending.length?' · '+pending.length+' pending':''}</strong></p>
  <details open><summary>Ready datasets</summary>${names(ready)}</details>
  ${pending.length?`<details><summary>Pending datasets</summary>${names(pending)}<p>Resolve these later in Import history using the retained originals.</p></details>`:''}
  ${warnings.length?`<details open><summary>Review notes for ready datasets (${warnings.length})</summary>${groupedImportIssues(warnings)}</details>`:''}
  <form id="quick-import-form">
   <label class="layer"><input type="checkbox" id="quick-import-authority" required> I have authority to import these datasets and have reviewed the listed datasets and any notes. Scientific approval is separate.</label>
   <p id="quick-import-error" role="alert"></p>
   <div class="actions"><button type="button" id="quick-import-back">Back</button><button class="primary" type="submit">Confirm import</button></div>
  </form>`);
 let busy=false;
 const dialog=$('#dialog'),form=$('#quick-import-form');
 const back=()=>{if(!busy){if(onBack)onBack();else reviewImport(record.id,pendingIds);}};
 $('#quick-import-back').onclick=back;
 dialog.querySelector('[data-close]').onclick=back;
 dialog.oncancel=event=>{event.preventDefault();back();};
 form.onsubmit=async event=>{
  event.preventDefault();
  if(busy)return;
  const submit=form.querySelector('button[type=submit]'),message=$('#quick-import-error');
  let committed=false;
  try{
   if(host.getProject()?.id!==project.id||session.user?.uid!==uid)throw new Error('Reopen the import in its original project.');
   busy=true;submit.disabled=true;submit.textContent='Importing…';message.textContent='';
   const selection={selected_dataset_ids:[...selectedIds],selected_columns:{}};
   for(const dataset of ready){
    const asset=record.assets.find(a=>a.id===dataset.sourceId);
    const base=record.options?.perAsset?.[asset?.clientId||asset?.id]||record.options?.perFile?.[asset?.name];
    const settings=base?.sheetSettings?.[dataset.metadata?.sheet]||base;
    if(!Object.values(settings?.curves||{}).some(curve=>curve.selected===false))continue;
    selection.selected_columns[dataset.id]=dataset.columns.filter(c=>c.id==='column-'+settings.mapping?.index||settings.curves[c.id]?.selected!==false).map(c=>c.id);
   }
   Object.assign(record,await host.importTask(()=>commitNative(project,record,true,null,null,selection)));
   committed=true;
   onCommitted?.();
   await host.reload();await refreshData(true);
   showImportCompletion(record,project);host.render();
  }catch(error){
   if(committed){showImportCompletion(record,project);host.toast('Import accepted. Refresh project data to load the new datasets.');}
   else message.textContent=error.message;
  }finally{busy=false;submit.disabled=false;submit.textContent='Confirm import';}
 };
}
export async function reviewImport(id,pendingIds=[],options={}){
 const project=host.getProject(),uid=session.user?.uid;let record=context().imports.find(r=>r.id===id);if(project.storage==='cloud'){try{record=await api(`/api/projects/${project.id}/imports/${id}`);if(host.getProject()?.id!==project.id||session.user?.uid!==uid)return;rememberImport(host.getState(),record);}catch(error){host.toast('Refresh Import history or inspect its retained original again. '+error.message);return;}}if(!record){host.toast('This pending inspection is missing. Open Import history or select the retained source and choose Inspect.');return;}if(options.readyOnly){
  if(options.revision!==undefined&&record.revision!==options.revision){host.toast('This inspection changed. Review the latest version in Import history.');return;}
  return confirmReadyImport(record,project,pendingIds,options);
 }
 if(record.mode==='automatic_zip'){
  if(['inspecting','importing'].includes(record.status))return watchAutomaticZip(host,project,record,async result=>{
   await host.reload();await refreshData(true);
   if($('#dialog [data-zip-task]'))showAutomaticResult(result,project);
  });
  if(record.automaticResult)return showAutomaticResult(record,project);
 }
 pendingIds=[...pendingIds,...unavailableDatasetIds(record,project)];host.modal('Import details',`<h3>${esc(nameOf(record.family))}</h3>${project.storage==='cloud'&&readyImportDatasets(record,pendingIds).length?'<button type="button" class="primary" id="history-import-ready">Import ready datasets</button>':''}${recordView(record,pendingIds)}${['stored','failed'].includes(record.status)?'<button id="retry-inspection">Retry native inspection</button>':''}${record.status==='uploading'?`<p class="sub">Reselect each original by its asset identity to resume.</p>${record.assets.filter(a=>a.state!=='stored').map(a=>`<label class="field">${esc(a.name)} · ${esc(a.clientId||a.id)}<input data-resume-asset="${esc(a.clientId||a.id)}" type="file"></label>`).join('')}<button id="resume-import-files">Resume selected assets</button>`:''}${!record.committedAt&&record.status!=='cancelled'?'<button id="cancel-stored-import">Cancel import · keep retained originals</button>':''}`);bindRecordActions(record,project,()=>{showImportCompletion(record,project);host.render();});$('#history-import-ready')?.addEventListener('click',()=>confirmReadyImport(record,project,pendingIds));document.querySelectorAll('[data-fix-source]').forEach(button=>button.onclick=()=>editNativeMapping(record,project,button.dataset.fixSource));if(record.committedAt&&record.datasets.some(d=>!d.active)){const button=document.createElement('button');button.id='resolve-pending-sources';button.textContent='Resolve pending sources · reuse retained originals';$('#dialog').append(button);button.onclick=async()=>{button.disabled=true;try{const pending=new Set(record.datasets.filter(d=>!d.active).map(d=>d.sourceId));for(const asset of record.assets)if(!record.datasets.some(d=>d.sourceId===asset.id)&&!asset.archiveExpanded)pending.add(asset.id);const assets=record.assets.filter(a=>pending.has(a.id)&&intakeFamilyAllowed(a.family,project)&&!host.getState().files?.find(f=>f.id===a.id)?.trashed).map(a=>({id:a.clientId||a.id,existingId:a.id,family:a.family,file:{name:a.name,size:a.size}}));if(!assets.length)throw new Error('There are no pending sources for the enabled project workflows.');const next=await host.importTask(()=>nativeImport(project,assets,'mixed',{...record.options,parentImportId:record.id}));rememberImport(host.getState(),next);await host.reload();await reviewImport(next.id);}catch(error){host.toast(error.message);button.disabled=false;}};}$('#retry-inspection')?.addEventListener('click',async()=>{try{await api(`/api/projects/${project.id}/imports/${record.id}/inspect`,{method:'POST',body:{}});await refreshData(true);host.toast('Inspection started. Reopen Import history to check progress.');$('#dialog').close();}catch(error){host.toast(error.message);}});$('#resume-import-files')?.addEventListener('click',async e=>{try{for(const asset of record.assets.filter(a=>a.state!=='stored')){let file=[...document.querySelectorAll('[data-resume-asset]')].find(input=>input.dataset.resumeAsset===(asset.clientId||asset.id))?.files?.[0];if(file&&record.mode==='automatic_zip'){
 const saved=record.options?.perAsset?.[asset.clientId]?.archiveTransfer;
 if(saved?.fingerprint){
  if(file.name!==asset.name||file.size!==saved.originalSize)throw new Error('Reselect the same original ZIP to resume.');
  const prepared=await prepareAutomaticZip(project,file);
  if(prepared.fingerprint!==saved.fingerprint||prepared.notes.length!==saved.excludedCount||prepared.notes.slice(0,99).some((note,index)=>note.path!==saved.excluded[index]?.path))throw new Error('Reselect the original ZIP with the same project workflow to resume.');
  file=prepared.file;
 }
}
if(!file||file.name!==asset.name||file.size!==asset.size)throw new Error('Select the same file name and size for every incomplete source.');const transfer=await api(`/api/projects/${project.id}/imports/${record.id}/upload/${asset.id}`,{method:'POST',body:{}});if(!transfer.stored)await resumableUpload(file,transfer.upload_url);await api(`/api/projects/${project.id}/imports/${record.id}/complete/${asset.id}`,{method:'POST',body:{}});}await api(`/api/projects/${project.id}/imports/${record.id}/inspect`,{method:'POST',body:{}});await refreshData(true);$('#dialog').close();}catch(error){host.toast(error.message);}});$('#cancel-stored-import')?.addEventListener('click',async()=>{try{if(project.storage==='cloud')await cancelNative(project,record.id);else{record.status='cancelled';host.save();await host.flush();}await refreshData(true);$('#dialog').close();host.render();}catch(error){host.toast(error.message);}});}

function showAutomaticResult(record,project,timings={}){
 const result=record.automaticResult;
 if(!result){reviewImport(record.id);return;}
 const resolved=record.followUpAccepted||[];
 const matches=(a,b)=>a.sourceId===b.sourceId&&(!a.metadata?.sheet||!b.metadata?.sheet||a.metadata.sheet===b.metadata.sheet)
  &&(!a.metadata?.rowWell||!b.metadata?.rowWell||a.metadata.well===b.metadata.well);
 const pending=record.datasets.filter(d=>!d.active&&!resolved.some(r=>matches(d,r)));
 const assets=new Map(record.assets.map(a=>[a.id,a]));
 const reviewRows=[...pending.map(d=>({asset:assets.get(d.sourceId),dataset:d})),
  ...result.pendingSourceIds.map(id=>({asset:assets.get(id)}))].filter(item=>item.asset);
 const notesFor=({asset,dataset})=>(record.issues||[]).filter(i=>i.datasetId?i.datasetId===dataset?.id:i.sourceId?i.sourceId===asset.id:i.source===asset.name);
 const explanation=({asset})=>{
  const proposal=record.modelSuggestions?.[asset.id];
  if(!proposal)return '';
  const well=host.getState().wellDrafts?.find(w=>w.id===proposal.wellId);
  return '<small>Suggested: '+esc([nameOf(proposal.family),well?.name,proposal.run,proposal.rowGroup,proposal.evidenceRow?'header row '+proposal.evidenceRow:'',
   ...proposal.companionIds.map(id=>assets.get(id)?.name)].filter(Boolean).join(' · ')||'Review source evidence')+'</small>';
 };
 const metrics={...record.timings,...timings};
 const elapsed=Number.isFinite(metrics.totalMs)?'<p class="sub">Completed in '+(metrics.totalMs/1000).toFixed(1)+' s</p>':'';
 host.modal('ZIP import results',`<h3 data-zip-timings="${esc(JSON.stringify(metrics))}">${esc(automaticZipSummary(record))}</h3>${elapsed}
  ${(record.issues||[]).filter(i=>!i.sourceId&&!i.datasetId&&!i.source).map(i=>'<p>'+esc(i.message)+'</p>').join('')}
  ${reviewRows.length?`<h4>Needs review</h4><ul>${reviewRows.map((item,index)=>`<li><strong>${esc(item.dataset?.name||item.asset.name)}</strong>
   ${notesFor(item).map(issue=>'<small>'+esc(issue.message)+'</small>').join('')}${explanation(item)}
   <button type="button" data-zip-review="${index}">Review ${item.dataset?.metadata?.rowWell?'well group':item.dataset?.metadata?.sheet?'worksheet':'source'}</button></li>`).join('')}</ul>`:''}
  ${result.skipped.length?`<details><summary>Skipped files (${result.skippedCount??result.skipped.length})</summary><ul>${result.skipped.map(item=>`<li>${esc(item.path)} · ${esc(item.reason)}</li>`).join('')}</ul>${result.skippedCount>result.skipped.length?'<p>Additional excluded entries are included in the total.</p>':''}</details>`:''}
  <div class="actions"><button type="button" class="primary" id="zip-view-wells">View wells</button></div>`);
 $('#zip-view-wells').onclick=()=>{$('#dialog').close();tab='wells';host.navigate('data');host.render();};
 document.querySelectorAll('[data-zip-review]').forEach(button=>button.onclick=()=>{
  const item=reviewRows[Number(button.dataset.zipReview)];
  editNativeMapping(record,project,item.asset.clientId||item.asset.id,item.dataset?.metadata?.sheet,{
   datasetId:item.dataset?.id,issue:notesFor(item)[0]?.code,onBack:()=>showAutomaticResult(record,project),
   onSaved:async next=>{rememberImport(host.getState(),next);await reviewImport(next.id);}
  });
 });
}

function showImportCompletion(record,project){host.modal('Import complete',`<div class="ie-main"><div class="ie-content">${importCompletion({record,project,assets:record.assets.map(a=>({id:a.clientId||a.id,file:{name:a.name,size:a.size}}))})}</div></div>`);document.querySelector('#dialog').classList.add('import-evidence-dialog');document.querySelector('#wi-done')?.addEventListener('click',()=>document.querySelector('#dialog').close());document.querySelector('#wi-view-logs')?.addEventListener('click',()=>{document.querySelector('#dialog').close();host.navigate('interpretation');});document.querySelector('#wi-view-map')?.addEventListener('click',()=>{document.querySelector('#dialog').close();host.navigate('map');});document.querySelector('#wi-view-data')?.addEventListener('click',()=>{document.querySelector('#dialog').close();host.navigate('data');});}
