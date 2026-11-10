// Inventory actual rendered controls and the browser cases that exercise them.
const fs=require('node:fs');
const stores=new Map();
exports.install=async(page,filename)=>{
 const previous=fs.existsSync(filename)?JSON.parse(fs.readFileSync(filename,'utf8')):null;
 const keyFor=item=>[item.selector,item.label,item.context,item.width,item.disabled?'disabled':'enabled',item.reason].join('|');
 const store=stores.get(filename)||{entries:new Map((previous?.controls||[]).map(item=>[keyFor(item),item])),passed:new Set(previous?.passedCases||[])};stores.set(filename,store);
 const {entries,passed}=store;let current='initial';const consoleErrors=[],networkErrors=[];
 page.on('console',message=>{if(message.type()==='error')consoleErrors.push({caseName:current,text:message.text()});});
 page.on('response',response=>{if(response.status()>=400)networkErrors.push({caseName:current,path:new URL(response.url()).pathname,status:response.status()});});
 page.on('requestfailed',request=>networkErrors.push({caseName:current,path:new URL(request.url()).pathname,failure:request.failure()?.errorText}));
 await page.exposeFunction('__interpretationControls',batch=>{for(const item of batch){const key=keyFor(item);const record=entries.get(key)||{...item,seenCases:[],clickedCases:[]};for(const [field,flag]of [['seenCases',true],['clickedCases',item.clicked]])if(flag&&!record[field].includes(item.caseName))record[field].push(item.caseName);entries.set(key,record);}});
 await page.addInitScript(()=>{
  try{window.__interpretationCase=sessionStorage.getItem('interpretation-control-case')||'initial';}catch{window.__interpretationCase='initial';}let timer;
  function item(element,clicked=false){const attributes=[...element.attributes].filter(a=>a.name==='id'||a.name.startsWith('data-')&&!['data-partial','data-wb-drag','data-wb-context'].includes(a.name)),selector=attributes.map(a=>a.name==='id'?'#'+a.value:'['+a.name+'='+a.value+']').join('')||element.tagName.toLowerCase()+':'+(element.getAttribute('name')||element.getAttribute('aria-label')||element.textContent.trim()).slice(0,100);return {selector,label:(element.getAttribute('aria-label')||element.textContent||element.value||'').trim().replace(/\s+/g,' ').slice(0,160),context:(document.querySelector('[data-pp-tab][aria-selected=true]')?.textContent||'')+' / '+(element.closest('dialog')?.querySelector('h2')?.textContent||element.closest('[aria-label]')?.getAttribute('aria-label')||''),width:innerWidth,disabled:!!element.disabled,reason:element.title||element.getAttribute('aria-description')||'',visible:!!element.getClientRects().length,clicked,caseName:window.__interpretationCase};}
  const selector='button,summary,input[type=submit],input[type=button],[role=button]';
  const scan=()=>{clearTimeout(timer);timer=setTimeout(()=>{const rows=[...document.querySelectorAll(['.iw','#dialog','#wb-context-menu'].map(root=>root+' '+selector.split(',').join(','+root+' ')).join(','))].map(el=>item(el));window.__interpretationControls(rows);},40);};
  document.addEventListener('DOMContentLoaded',()=>{new MutationObserver(scan).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','open','aria-selected']});scan();});
  document.addEventListener('click',event=>{const button=event.target.closest(selector);if(button)window.__interpretationControls([item(button,true)]);},true);
  for(const type of ['pointerdown','keydown','dragstart'])document.addEventListener(type,event=>{if(type==='keydown'&&!['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','F10'].includes(event.key))return;const button=event.target.closest(selector);if(button)window.__interpretationControls([item(button,true)]);},true);
 });
 return {async start(name){current=name;passed.delete(name);await page.evaluate(name=>{window.__interpretationCase=name;try{sessionStorage.setItem('interpretation-control-case',name);}catch{}},name);},pass(){passed.add(current);},save(){fs.writeFileSync(filename,JSON.stringify({passedCases:[...passed],controls:[...entries.values()],consoleErrors,networkErrors},null,2));}};
};
