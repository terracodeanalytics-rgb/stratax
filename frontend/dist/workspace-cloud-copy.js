import {session} from './auth.js';
import * as repository from './project-repository.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function openCloudCopy(host,route='interpretation'){
 const project=host.getProject(),uid=session.user?.uid;
 const same=()=>session.user?.uid===uid&&host.getProject()?.id===project.id;
 host.modal('Create an independent Cloud copy',`<p>This uploads retained originals into a new private Cloud project. Your Local project is preserved. Source versions are rebound only where the same bytes are retained; processing inputs must be reviewed again.</p><form id="workspace-cloud-copy"><label>Cloud project name<input name="name" maxlength="100" required value="${esc(project.name+' · Cloud copy')}"></label><label><input type="checkbox" required> I authorize uploading this project’s retained source files to StrataX Cloud storage</label><p id="workspace-copy-status" role="status"></p><button class="primary">Create Cloud copy</button></form>`);
 document.querySelector('#workspace-cloud-copy').onsubmit=async e=>{
  e.preventDefault();const button=e.target.querySelector('button'),status=document.querySelector('#workspace-copy-status');button.disabled=true;
  try{
   if(!same())throw new Error('The active project/account changed. Reopen the copy operation.');
   const workspace=structuredClone(host.getState());await host.flush();
   if(!same())throw new Error('The active project/account changed. The copy was stopped.');
   const record=await repository.copyToCloud(project,workspace,e.target.elements.name.value,text=>{if(session.user?.uid===uid)status.textContent=text;});
   if(!same()){if(session.user?.uid===uid)host.toast('The independent Cloud copy is available in My projects.');return;}
   await host.attachCloud(record);document.querySelector('#dialog').close();host.navigate(route);
  }catch(error){if(session.user?.uid===uid){status.textContent=error.message;button.disabled=false;}}
 };
}
