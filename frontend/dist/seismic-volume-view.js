import {api,session} from './auth.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let host,views,dataset,edit,selectView,engine,scope='';
const cache=new Map(),failures=new Map(),pending=new Set(),scenes=new Map();
const signature=v=>JSON.stringify([session.user?.uid,host.getProject()?.id,v.datasetId,dataset(v.datasetId)?.sourceVersion,v.brick]);
export function configureVolumes(context,getViews,getDataset,change,select){host=context;views=getViews;dataset=getDataset;edit=change;selectView=select;}
export function volumeDefaults(ds){const m=ds?.metadata||{};return {geometryRevision:1,inline:{start:m.inlineRange?.[0]??0,step:1,count:3},crossline:{start:m.crosslineRange?.[0]??0,step:1,count:3},firstSample:0,sampleCount:Math.min(128,m.sampleCountRange?.[0]||m.sampleCount||128)};}
export function volumeWindow(v,ds){
 const key=signature(v),data=cache.get(key),error=failures.get(key);
 return `<article class="sw-window sv-window" data-sw-window="${v.id}" style="width:${v.width||700}px;height:${v.height||600}px" aria-label="${esc(ds?.name||'Unavailable source')} 3D volume"><header><strong>${esc(ds?.name)} · 3D amplitudes</strong><button data-sw-close="${v.id}" aria-label="Close seismic section">×</button></header><div class="sv-tools"><button data-sv-reset="${v.id}">Reset camera</button><button data-sv-camera="${v.id}">Save camera</button><button data-sv-export="${v.id}" ${data?'':'disabled'}>Export brick</button><button data-sv-retry="${v.id}">Reload brick</button></div>${error?`<div class="sw-error" role="alert">${esc(error)}</div>`:data?`<div data-sv-render="${v.id}" class="sv-render" tabindex="0" aria-label="Interactive 3D amplitudes; drag to rotate, wheel to zoom"></div><p class="sv-axes">Inline ${data.inlines[0]}–${data.inlines.at(-1)} · crossline ${data.crosslines[0]}–${data.crosslines.at(-1)} · ${data.sampleStart.toFixed(4)}–${(data.sampleStart+(data.shape[2]-1)*data.sampleInterval).toFixed(4)} s (${esc(data.sourceDomain)})</p>`:'<div class="sw-message" role="status">Loading bounded 3D samples…</div>'}<footer>${data?`${data.shape.join(' × ')} native samples · ${data.valid.filter(x=>!x).length} missing · nearest-neighbour display · bin coordinates`:'Reviewed 3D poststack roles required; no raw gathers are implicitly stacked.'}</footer></article>`;
}
export function volumeProperties(v,ds){
 const b=v.brick;
 return `<form id="sw-volume-form" data-view="${v.id}"><p>${esc(ds?.name)} · bounded 3D samples</p><label>Geometry revision<input name="geometryRevision" type="number" min="1" step="1" value="${b.geometryRevision}" required></label>${['inline','crossline'].map(axis=>`<fieldset><legend>${axis==='inline'?'Inline':'Crossline'} bins</legend>${[['start','First bin',b[axis].start],['step','Bin step',b[axis].step],['count','Bin count',b[axis].count]].map(([key,label,value])=>`<label>${label}<input name="${axis}.${key}" type="number" step="1" ${key==='start'?'':`min="${key==='count'?2:1}"`} value="${value}" required></label>`).join('')}</fieldset>`).join('')}<label>First sample<input name="firstSample" type="number" min="0" step="1" value="${b.firstSample}" required></label><label>Sample count<input name="sampleCount" type="number" min="2" max="1024" step="1" value="${b.sampleCount}" required></label><label>Display vertical scale<input name="verticalScale" type="number" min="0.1" max="10" step="0.1" value="${v.verticalScale||1}" required></label><button>Apply 3D view</button></form><p class="sub">Rotate with drag; zoom with the wheel. Vertical scaling changes display only. Physical-coordinate geometry QC remains required. Use sections for exact sample picking.</p>`;
}
function release(scene){scene.observer?.disconnect();scene.cleanupObserver?.disconnect();scene.subscription?.unsubscribe();scene.window.delete();for(const object of scene.objects)object.delete();}
async function mount(v,container,data){
 const key=signature(v),uid=session.user?.uid,pid=host.getProject()?.id;
 const valid=()=>uid===session.user?.uid&&pid===host.getProject()?.id&&container.isConnected&&views().includes(v)&&signature(v)===key;
 const vtk=await (engine||=import('./vendor/vtk-seismic.js'));if(!valid()||scenes.has(container))return;
 const renderWindow=vtk.vtkGenericRenderWindow.newInstance({background:[.94,.97,.96],listenWindowResize:false});
 const objects=[],scene={window:renderWindow,objects};scenes.set(container,scene);
 try{
  renderWindow.setContainer(container);renderWindow.resize();
  const image=vtk.vtkImageData.newInstance(),array=vtk.vtkDataArray.newInstance({name:'Display amplitudes',numberOfComponents:1,values:new Float32Array(data.samples.map((value,i)=>data.valid[i]?value:0))});objects.push(array,image);
  image.setDimensions(...data.shape);image.getPointData().setScalars(array);
  const mapper=vtk.vtkVolumeMapper.newInstance(),actor=vtk.vtkVolume.newInstance(),colours=vtk.vtkColorTransferFunction.newInstance(),opacity=vtk.vtkPiecewiseFunction.newInstance();objects.push(mapper,actor,colours,opacity);
  mapper.setInputData(image);mapper.setSampleDistance(.5);actor.setMapper(mapper);actor.setScale(1,1,-(v.verticalScale||1)*Math.max(data.shape[0],data.shape[1])/data.shape[2]);
  let limit=0;for(let i=0;i<data.samples.length;i++)if(data.valid[i])limit=Math.max(limit,Math.abs(data.samples[i]));limit||=1;
  colours.addRGBPoint(-limit,.08,.25,.8);colours.addRGBPoint(0,1,1,1);colours.addRGBPoint(limit,.85,.12,.08);
  opacity.addPoint(-limit,.2);opacity.addPoint(0,0);opacity.addPoint(limit,.2);
  actor.getProperty().setRGBTransferFunction(0,colours);actor.getProperty().setScalarOpacity(0,opacity);actor.getProperty().setInterpolationTypeToNearest();actor.getProperty().setShade(false);
  const renderer=renderWindow.getRenderer();renderer.addVolume(actor);const camera=renderer.getActiveCamera();
  scene.reset=()=>{renderer.resetCamera();const f=camera.getFocalPoint(),d=camera.getDistance();camera.setPosition(f[0]+d*.7,f[1]-d*.7,f[2]+d*.7);camera.setViewUp(0,0,1);renderer.resetCameraClippingRange();};scene.reset();
  if(v.camera){camera.setPosition(...v.camera.position);camera.setFocalPoint(...v.camera.focalPoint);camera.setViewUp(...v.camera.viewUp);renderer.resetCameraClippingRange();}
  scene.camera=camera;scene.renderer=renderer;scene.draw=()=>renderWindow.getRenderWindow().render();scene.draw();
  scene.store=()=>{if(valid()){v.camera={position:[...camera.getPosition()],focalPoint:[...camera.getFocalPoint()],viewUp:[...camera.getViewUp()]};host.save();}};scene.subscription=renderWindow.getInteractor().onEndAnimation(scene.store);
  const canvas=container.querySelector('canvas');if(!canvas?.getContext('webgl2'))throw new Error('WebGL 2 is unavailable. Enable graphics support and reload this brick; sections remain available.');
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(valid()){failures.set(key,'The 3D graphics context was lost. Reload this brick to recover.');host.render();}});
  scene.observer=new ResizeObserver(()=>{if(valid()){renderWindow.resize();scene.draw();}});scene.observer.observe(container);
  scene.cleanupObserver=new MutationObserver(()=>{if(!container.isConnected&&scenes.get(container)===scene){release(scene);scenes.delete(container);}});scene.cleanupObserver.observe(document.body,{childList:true,subtree:true});
  container.dataset.ready='true';
 }catch(error){if(scenes.get(container)===scene){scenes.delete(container);release(scene);}if(valid()){failures.set(key,error.message||'The 3D renderer could not start. Reload or open a section.');host.render();}}
}
async function load(v){
 const key=signature(v);if(cache.has(key)||failures.has(key)||pending.has(key))return;
 const uid=session.user?.uid,pid=host.getProject()?.id;
 const valid=()=>uid===session.user?.uid&&pid===host.getProject()?.id&&views().includes(v)&&signature(v)===key;
 pending.add(key);
 try{
  if(host.getProject().storage!=='cloud')throw new Error('Create an explicit Cloud copy to access the indexed 3D brick service. Local contents have not been uploaded.');
  const data=await api(`/api/projects/${encodeURIComponent(pid)}/seismic/sources/${encodeURIComponent(v.datasetId)}/brick`,{method:'POST',body:v.brick,ownerUid:uid});
  if(!valid())return;cache.set(key,data);while(cache.size>4)cache.delete(cache.keys().next().value);
 }catch(error){if(valid())failures.set(key,error.message);}finally{pending.delete(key);if(valid())host.render();}
}
export function bindVolumes(){
 const next=`${session.user?.uid}:${host.getProject()?.id}`;if(next!==scope){scope=next;cache.clear();failures.clear();}
 for(const [container,scene] of scenes)if(!container.isConnected){release(scene);scenes.delete(container);}
 for(const v of views().filter(v=>v.kind==='volume')){const container=document.querySelector(`[data-sv-render="${v.id}"]`),data=cache.get(signature(v));if(container&&data)mount(v,container,data).catch(error=>{failures.set(signature(v),error.message);host.render();});else load(v);const bar=document.querySelector(`[data-sw-window="${v.id}"] .sv-tools`);if(bar&&!bar.querySelector('[data-sv-select]')){const button=document.createElement('button');button.dataset.svSelect=v.id;button.textContent='View properties';button.onclick=()=>selectView(v.id);bar.append(button);}}
 const find=id=>views().find(v=>v.id===id),scene=id=>{const container=document.querySelector(`[data-sv-render="${id}"]`);return scenes.get(container);};
 document.querySelectorAll('[data-sv-reset]').forEach(button=>button.onclick=()=>{const current=scene(button.dataset.svReset);if(current){current.reset();current.draw();current.store();}});
 document.querySelectorAll('[data-sv-camera]').forEach(button=>button.onclick=()=>{const v=find(button.dataset.svCamera),current=scene(v.id);if(current){v.camera={position:[...current.camera.getPosition()],focalPoint:[...current.camera.getFocalPoint()],viewUp:[...current.camera.getViewUp()]};host.save();host.toast('3D camera saved.');}});
 document.querySelectorAll('[data-sv-export]').forEach(button=>button.onclick=()=>{const v=find(button.dataset.svExport),data=cache.get(signature(v));if(data)host.download('seismic-brick.json',new Blob([JSON.stringify(data)],{type:'application/json'}));});
 document.querySelectorAll('[data-sv-retry]').forEach(button=>button.onclick=()=>{const v=find(button.dataset.svRetry),key=signature(v);cache.delete(key);failures.delete(key);host.render();});
 const form=document.querySelector('#sw-volume-form');if(form)form.onsubmit=event=>{event.preventDefault();const v=find(form.dataset.view),f=new FormData(form),brick={geometryRevision:Number(f.get('geometryRevision')),inline:{},crossline:{},firstSample:Number(f.get('firstSample')),sampleCount:Number(f.get('sampleCount'))};for(const axis of ['inline','crossline'])for(const field of ['start','step','count'])brick[axis][field]=Number(f.get(axis+'.'+field));edit('Change 3D view',()=>{v.brick=brick;v.verticalScale=Number(f.get('verticalScale'));});};
}
