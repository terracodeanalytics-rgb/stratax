import {chooseFolder, folderSupported} from './project-repository.js';
import {mountMap} from './project-map.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function projectSetup({project, modal, complete}) {
  const draft={id:crypto.randomUUID(), name:'', description:'', workflows:[], siteName:'', region:'', country:'', coordinates:null, storage:'', status:'Active', ...structuredClone(project||{})};
  let step=0, busy=false, touched=false;
  const dialog=document.querySelector('#dialog');
  function close(event) {
    event?.preventDefault();
    if (busy) return;
    if (!touched) return dialog.close();
    const body=dialog.querySelector('.dialog-body');
    body.innerHTML='<h3>Discard project setup?</h3><p>Your unsaved changes will be cleared.</p><div class="actions"><button id="keep-setup" class="primary">Keep editing</button><button id="discard-setup">Discard changes</button></div>';
    body.querySelector('#keep-setup').onclick=render;
    body.querySelector('#discard-setup').onclick=()=>dialog.close();
  }
  function capture() {
    const form=dialog.querySelector('#setup-form');if(!form)return;
    const f=new FormData(form);
    if(step===0){draft.name=String(f.get('name')||'').trim();draft.description=String(f.get('description')||'');draft.workflows=f.getAll('workflow');}
    if(step===1){for(const k of ['siteName','region','country'])draft[k]=String(f.get(k)||'');const lat=String(f.get('lat')||'').trim(),lng=String(f.get('lng')||'').trim();draft.coordinates=lat!==''&&lng!==''?{lat:Number(lat),lng:Number(lng)}:null;}
    if(step===2){const chosen=f.get('storage');if(chosen)draft.storage=chosen;}
  }
  function render(){
    const steps=['Project','Location','Storage','Review'];
    const label=draft.workflows.map(w=>w==='seismic'?'Seismic interpretation':'Petrophysics').join(' + ');
    const content=step===0?`<h3>What are you working on?</h3><p class="sub">Choose the tools your study needs. You can change this later.</p><label class="field">Project name<input name="name" required maxlength="100" value="${esc(draft.name)}" autocomplete="off"></label><fieldset class="setup-options"><legend>Interpretation workflows</legend>${[['petrophysics','Petrophysics','Well logs, rock properties and reservoir evaluation.'],['seismic','Seismic interpretation','Survey evidence, horizons and structural interpretation.']].map(([v,t,d])=>`<label class="setup-option"><input type="checkbox" name="workflow" value="${v}" ${draft.workflows.includes(v)?'checked':''}><span><strong>${t}</strong><small>${d}</small></span></label>`).join('')}</fieldset><label class="field">Study objective <small>Optional</small><textarea name="description" maxlength="1000">${esc(draft.description)}</textarea></label>`:
      step===1?`<h3>Where is your study?</h3><p class="sub">Optional. Add a location now or return to it in Project settings.</p><label class="field">Site / field name<input name="siteName" maxlength="150" value="${esc(draft.siteName)}"></label><div class="form-grid"><label class="field">Region<input name="region" maxlength="100" value="${esc(draft.region)}"></label><label class="field">Country<input name="country" maxlength="100" value="${esc(draft.country)}"></label></div><div class="form-grid"><label class="field">Latitude<input name="lat" type="number" min="-90" max="90" step="any" value="${draft.coordinates?.lat??''}" placeholder="−90 to 90"></label><label class="field">Longitude<input name="lng" type="number" min="-180" max="180" step="any" value="${draft.coordinates?.lng??''}" placeholder="−180 to 180"></label></div><p class="sub">WGS84 · decimal degrees. Select a point on the map or enter coordinates.</p><button type="button" id="setup-map-toggle">Choose on map</button><div id="setup-map-area" hidden><div class="map-search"><input id="place-search" aria-label="Search location" placeholder="Search for a place"><button type="button" id="place-find">Find</button></div><div id="setup-map" class="real-map"></div><p id="map-feedback" role="status"></p></div>`:
      step===2?`<h3>Where should your project live?</h3><p class="sub">Choose one destination. Local projects are not uploaded to StrataX cloud storage.</p><fieldset class="setup-options"><legend>Storage destination</legend><label class="setup-option"><input type="radio" name="storage" value="cloud" ${draft.storage==='cloud'?'checked':''} ${project?.storage&&project.storage!=='legacy'?'disabled':''}><span><strong>Cloud storage</strong><small>Save securely to your account and continue on another device.</small></span></label><label class="setup-option"><input type="radio" name="storage" value="${folderSupported()?'local':'portable'}" ${['local','portable'].includes(draft.storage)?'checked':''} ${project?.storage&&project.storage!=='legacy'?'disabled':''}><span><strong>Local ${folderSupported()?'folder':'project file'}</strong><small>${folderSupported()?'Save original files and your work in a folder on this computer.':'Folder saving is unavailable here. Download a complete project file to keep your changes.'}</small></span></label></fieldset>${folderSupported()?'<button type="button" id="choose-folder">Choose project folder</button>':''}<p id="storage-destination" class="destination">${esc(draft.directoryName||(['local','portable'].includes(draft.storage)?'Download a portable project file to save your work.':draft.storage==='cloud'?'Your StrataX cloud account':'Choose a destination'))}</p><p class="sub">Online basemaps and location search contact Google in either storage mode.</p>${project?.storage&&project.storage!=='legacy'?'<p class="note">Storage mode is fixed for this project. Export a project package to make a separate copy.</p>':''}`:
      `<h3>Ready to begin.</h3><p class="sub">Review your setup before ${project?'saving':'creating the project'}.</p><dl class="setup-review"><dt>Project</dt><dd>${esc(draft.name)}</dd><dt>Workflows</dt><dd>${esc(label)}</dd><dt>Location</dt><dd>${esc([draft.siteName,draft.region,draft.country].filter(Boolean).join(', ')||'Add later')}${draft.coordinates?`<small>${draft.coordinates.lat}, ${draft.coordinates.lng} · WGS84</small>`:''}</dd><dt>Storage</dt><dd>${draft.storage==='cloud'?'StrataX cloud':esc(draft.directoryName||'Portable project file')}</dd></dl>`;
    if(dialog.open)dialog.close();
    modal(project?'Project settings':'Create a project',`<div class="setup-steps" aria-label="Setup progress">${steps.map((s,i)=>`<span class="${i===step?'current':i<step?'complete':''}" ${i===step?'aria-current="step"':''}>${i+1}<small>${s}</small></span>`).join('')}</div><form id="setup-form" class="setup-form">${content}<p id="setup-error" class="setup-error" role="alert"></p><div class="setup-footer"><button type="button" id="setup-back">${step?'Back':'Cancel'}</button><button class="primary" type="submit">${step===3?(project?'Save project':'Create project'):'Continue'}</button></div></form>`);
    dialog.classList.add('setup-dialog');
    dialog.querySelector('[data-close]').onclick=close;dialog.oncancel=close;
    dialog.querySelector('#setup-form').oninput=()=>{touched=true;};
    dialog.querySelector('#setup-back').onclick=()=>{capture();if(step){step--;render();}else close();};
    dialog.querySelector('#choose-folder')?.addEventListener('click',async()=>{try{const name=await chooseFolder(draft.id);draft.directoryName=name;draft.storage='local';touched=true;render();}catch(error){if(error.name!=='AbortError')dialog.querySelector('#setup-error').textContent=error.message;}});
    dialog.querySelector('#setup-map-toggle')?.addEventListener('click',async()=>{
      capture();dialog.querySelector('#setup-map-area').hidden=false;
      await mountMap(dialog.querySelector('#setup-map'),draft.coordinates,{pick:point=>{draft.coordinates=point;touched=true;dialog.querySelector('[name=lat]').value=point.lat;dialog.querySelector('[name=lng]').value=point.lng;},search:dialog.querySelector('#place-search'),searchButton:dialog.querySelector('#place-find'),feedback:dialog.querySelector('#map-feedback')});
    });
    dialog.querySelector('#setup-form').onsubmit=async event=>{
      event.preventDefault();if(busy)return;capture();const error=dialog.querySelector('#setup-error');
      if(step===0&&(!draft.name||!draft.workflows.length)){error.textContent='Enter a project name and select at least one workflow.';return;}
      if(step===1){const form=event.target;const a=form.elements.lat.value,b=form.elements.lng.value;if((a==='')!==(b==='')){error.textContent='Enter both latitude and longitude, or leave both blank.';return;}}
      if(step===2&&(!draft.storage||(draft.storage==='local'&&!draft.directoryName))){error.textContent='Choose a storage destination and a folder for local saving.';return;}
      if(step<3){step++;render();return;}
      busy=true;const button=event.target.querySelector('[type=submit]');button.disabled=true;button.textContent='Saving…';
      try{draft.location=[draft.siteName,draft.region,draft.country].filter(Boolean).join(', ');draft.type=label;await complete(draft);dialog.close();dialog.oncancel=null;}
      catch(e){error.textContent=e.message;button.disabled=false;button.textContent=project?'Save project':'Create project';}
      finally{busy=false;}
    };
  }
  render();
}
