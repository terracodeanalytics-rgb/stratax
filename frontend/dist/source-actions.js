import {api,session} from './auth.js';
import * as repository from './project-repository.js';
import {evidenceIcon,escapeImport as esc} from './well-import-ui.js';

let menuController;
export function closeSourceActions(restoreFocus=false){const menu=document.querySelector('#source-action-menu'),trigger=menu?.trigger;menuController?.abort();menuController=null;menu?.remove();trigger?.setAttribute('aria-expanded','false');trigger?.removeAttribute('aria-controls');if(restoreFocus&&trigger?.isConnected)trigger.focus();}
export function sourceActionTrigger(file){return `<button class="source-action-trigger" type="button" data-source-actions="${esc(file.id||file.name)}" aria-label="Actions for ${esc(file.displayName||file.name)}" aria-haspopup="menu" aria-expanded="false">⋯</button>`;}

export async function downloadOriginal(host,file){
 const project=host.getProject();
 if(project.storage==='cloud'&&file.size>128*1024**2){const result=await api(`/api/projects/${project.id}/files/${file.id}/download-link`),link=document.createElement('a');link.href=result.url;link.rel='noreferrer';link.click();return;}
 host.download(file.name,await repository.source(project,file));
}

async function updateSource(host,file,change){
 if(!host.getState().files?.includes(file))throw new Error('The source list changed. Reopen its Actions menu.');
 const project=host.getProject(),workspace=host.getState(),uid=session.user?.uid;await host.flush();
 if(host.getProject()?.id!==project.id||session.user?.uid!==uid||host.getState()!==workspace)throw new Error('The project changed. Reopen this source in its original project.');
 if(project.storage==='cloud'){await api(`/api/projects/${project.id}/files/${file.id}/metadata`,{method:'POST',body:change,ownerUid:uid});if(host.getProject()?.id!==project.id||session.user?.uid!==uid)throw new Error('The source was updated in its original project. Reopen that project to review it.');await host.reload();}
 else{if(change.display_name!==undefined)file.displayName=change.display_name;if(change.trashed!==undefined){file.trashed=change.trashed;file.deletedAt=change.trashed?new Date().toISOString():null;}workspace.audit||=[];workspace.audit.unshift({action:(change.trashed?'Moved source to Trash':change.trashed===false?'Restored source':'Renamed source')+': '+(file.displayName||file.name),time:new Date().toISOString()});host.save();await host.flush();}
}

function renameSource(host,file){
 host.modal('Rename source',`<form id="source-rename-form" class="source-action-modal"><label class="field">Display name<input name="name" required maxlength="200" autocomplete="off" value="${esc(file.displayName||file.name)}"></label><p class="source-original-caption">Original filename: ${esc(file.name)}. Renaming the display label keeps the original format and existing well associations.</p><p id="source-action-error" class="source-action-error" role="alert"></p><div class="actions"><button type="button" id="source-action-cancel">Cancel</button><button class="primary" type="submit">Save name</button></div></form>`);
 document.querySelector('#source-action-cancel').onclick=()=>document.querySelector('#dialog').close();const input=document.querySelector('#source-rename-form input');input.focus();input.select();
 document.querySelector('#source-rename-form').onsubmit=async event=>{event.preventDefault();const button=event.currentTarget.querySelector('[type=submit]'),name=String(new FormData(event.currentTarget).get('name')||'').trim();if(!name||/[\u0000-\u001f]/.test(name)){document.querySelector('#source-action-error').textContent='Enter a name without line breaks or control characters.';return;}button.disabled=true;try{await updateSource(host,file,{display_name:name});document.querySelector('#dialog').close();host.render();host.toast('Source renamed.');}catch(error){const errorNode=document.querySelector('#source-action-error');if(errorNode)errorNode.textContent=error.message;else host.toast(error.message);button.disabled=false;}};
}

function trashSource(host,file){
 const linked=(host.getState().ingestion?.datasets||[]).filter(d=>d.sourceId===file.id),name=file.displayName||file.name;
 host.modal('Move source to Trash?',`<div class="source-action-modal"><p><strong>${esc(name)}</strong> will be hidden from the Sources list.</p><p class="source-original-caption">The original bytes and imported datasets stay available to existing work. Restore the source from the Trash filter whenever you need it. This does not free its retained storage.</p>${linked.length?`<div class="source-dependent-list"><strong>${linked.length} known linked ${linked.length===1?'dataset':'datasets'}</strong>${linked.slice(0,20).map(d=>`<span>${esc(d.name)}</span><small>${Number(d.rowCount||0).toLocaleString()} records / ${d.active===false?'previous version':'active dataset'}</small>`).join('')}${linked.length>20?`<small>Plus ${linked.length-20} more datasets.</small>`:''}</div>`:''}<p id="source-action-error" class="source-action-error" role="alert"></p><div class="actions"><button type="button" id="source-action-cancel">Keep source</button><button type="button" id="source-action-trash">${evidenceIcon('trash')}Move to Trash</button></div></div>`);
 document.querySelector('#source-action-cancel').onclick=()=>document.querySelector('#dialog').close();document.querySelector('#source-action-trash').onclick=async event=>{const button=event.currentTarget;button.disabled=true;try{await updateSource(host,file,{trashed:true});document.querySelector('#dialog').close();host.render();host.toast('Source moved to Trash. Imported datasets are preserved.');}catch(error){const errorNode=document.querySelector('#source-action-error');if(errorNode)errorNode.textContent=error.message;else host.toast(error.message);button.disabled=false;}};
}

export function openSourceActions(host,file,trigger,{inspect,reclassify}){
 closeSourceActions();const scope=host.getState(),owner=session.user?.uid;menuController=new AbortController();const signal=menuController.signal,menu=document.createElement('div');menu.id='source-action-menu';menu.className='source-action-menu';menu.setAttribute('role','menu');menu.setAttribute('aria-label','Source actions');menu.trigger=trigger;
 const items=file.trashed?[['inspect','Inspect','inspect'],['restore','Restore source','refresh'],['download','Download original','download']]:[['inspect','Inspect','inspect'],['rename','Rename','rename'],['download','Download original','download'],['classify','Import / reclassify','mapping'],['delete','Delete','trash']];
 menu.innerHTML=items.map(([id,label,icon])=>`<button type="button" role="menuitem" data-source-command="${id}" ${id==='delete'?'class="is-destructive"':''}>${evidenceIcon(icon)}${label}</button>`).join('');document.body.append(menu);trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-controls',menu.id);
 const rect=trigger.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(rect.right-menu.offsetWidth,innerWidth-menu.offsetWidth-8))+'px';menu.style.top=(rect.bottom+menu.offsetHeight+8>innerHeight?Math.max(8,rect.top-menu.offsetHeight-5):rect.bottom+5)+'px';menu.querySelector('button').focus();
 document.addEventListener('pointerdown',event=>{if(!menu.contains(event.target)&&!trigger.contains(event.target))closeSourceActions();},{capture:true,signal});window.addEventListener('resize',()=>closeSourceActions(),{signal});
 menu.onkeydown=event=>{if(event.key==='Escape'){event.preventDefault();closeSourceActions(true);return;}const buttons=[...menu.querySelectorAll('button')],index=buttons.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();}if(event.key==='Tab')closeSourceActions();};
 menu.querySelectorAll('button').forEach(button=>button.onclick=async()=>{const action=button.dataset.sourceCommand;closeSourceActions();try{if(host.getState()!==scope||session.user?.uid!==owner)throw new Error('The project changed. Reopen the source Actions menu.');if(action==='inspect')inspect(file);else if(action==='rename')renameSource(host,file);else if(action==='download')await downloadOriginal(host,file);else if(action==='classify')reclassify(file);else if(action==='delete')trashSource(host,file);else if(action==='restore'){await updateSource(host,file,{trashed:false});host.render();host.toast('Source restored.');}}catch(error){host.toast(error.message);}});
}
