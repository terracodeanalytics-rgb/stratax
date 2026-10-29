const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const source=fs.readFileSync('frontend/dist/auth.js','utf8').replace(/^import .*\r?\n/gm,'');
let sequence=0;
const loadAuth=()=>import('data:text/javascript;base64,'+Buffer.from(source+'\n// instance '+sequence++).toString('base64'));
test('account switch while acquiring a token prevents the request',async t=>{
 const auth=await loadAuth();let resolve,calls=0;auth.session.user={uid:'first',getIdToken:()=>new Promise(r=>resolve=r)};
 t.mock.method(globalThis,'fetch',async()=>{calls++;return {ok:true,json:async()=>({})};});
 const request=auth.api('/api/projects/a');auth.session.user={uid:'second'};resolve('fixture-token');
 await assert.rejects(request,/account changed/);assert.equal(calls,0);
});
test('response from a previous account cannot be applied to the next account',async t=>{
 const auth=await loadAuth();let resolve;auth.session.user={uid:'first',getIdToken:async()=>'fixture-token'};
 t.mock.method(globalThis,'fetch',async()=>({ok:true,json:()=>new Promise(r=>resolve=r)}));
 const request=auth.api('/api/projects/a');while(!resolve)await new Promise(r=>setImmediate(r));auth.session.user={uid:'second'};resolve({privateRecord:'first-account'});
 await assert.rejects(request,/previous response was not applied/);
});
test('explicit owner binding rejects a later stage under another account',async t=>{
 const auth=await loadAuth();auth.session.user={uid:'second',getIdToken:async()=>'fixture-token'};let calls=0;
 t.mock.method(globalThis,'fetch',async()=>{calls++;return {ok:true,json:async()=>({})};});
 await assert.rejects(auth.api('/api/projects/a',{ownerUid:'first'}),/account changed/);assert.equal(calls,0);
});
test('stable authenticated requests retain normal API behaviour',async t=>{
 const auth=await loadAuth();auth.session.user={uid:'first',getIdToken:async()=>'fixture-token'};
 t.mock.method(globalThis,'fetch',async(url,options)=>{assert.equal(options.headers.Authorization,'Bearer fixture-token');assert.equal(JSON.parse(options.body).value,3);return {ok:true,json:async()=>({saved:true})};});
 assert.deepEqual(await auth.api('/api/projects/a',{method:'PUT',body:{value:3}}),{saved:true});
});
test('native import stops between reservation and upload after an account switch',async t=>{
 const auth=await loadAuth();auth.session.user={uid:'first',getIdToken:async()=>'fixture-token'};let calls=0;
 t.mock.method(globalThis,'fetch',async()=>{calls++;return {ok:true,json:async()=>({id:'import',assets:[{id:'original',name:'fixture.segy',existing:false}]})};});
 globalThis.__seismicScopeFixture=auth;t.after(()=>delete globalThis.__seismicScopeFixture);
 const input=fs.readFileSync('frontend/dist/ingestion-client.js','utf8').replace(/^import .*\r?\n/gm,'');
 const module=await import('data:text/javascript;base64,'+Buffer.from('const {api,session}=globalThis.__seismicScopeFixture;\n'+input).toString('base64'));
 await assert.rejects(module.nativeImport({id:'a'},[{file:{name:'fixture.segy',size:10}}],'seismic',{}, {onSession:()=>{auth.session.user={uid:'second'};}}),/account changed/);
 assert.equal(calls,1);
});
