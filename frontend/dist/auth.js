import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import {getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailLink, isSignInWithEmailLink, updatePassword, linkWithCredential, EmailAuthProvider, applyActionCode, signOut} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

export const API_ORIGIN = 'https://stratax-api-227436363119.us-central1.run.app';
export const session = {ready:false, user:null, accepted:false, account:null, error:''};
export const policyPages = [
  ['terms_of_use','terms','Terms of Use'],['privacy_policy','privacy','Privacy Policy'],
  ['acceptable_use_policy','acceptable-use','Acceptable Use Policy'],['ai_processing_disclosure','ai-processing','AI and Third-Party Processing Disclosure'],
  ['data_confidentiality','data-ownership','Data Ownership and Confidentiality'],['disclaimer','disclaimer','Disclaimer and Limitation of Liability'],['cookie_policy','cookies','Cookie Policy']
];
let client, config, changed = ()=>{}, initialization, authenticating=false;
const memory = new Map();
export function localGet(key){try{return localStorage.getItem(key);}catch{return memory.get(key)??null;}}
export function localSet(key,value){try{localStorage.setItem(key,value);}catch{memory.set(key,value);}}
export function localRemove(key){try{localStorage.removeItem(key);}catch{}memory.delete(key);}
export function storageKey(base){return session.user?`${base}:${session.user.uid}`:null;}
export function configVersions(){return config?.policy_versions||{};}
export function notify(){changed();}
export function rememberChoice(){return localGet('stratax.keepSignedIn')!=='0';}
export function hasActionLink(){return new URLSearchParams(location.search).has('oobCode');}
export function clearActionLink(){history.replaceState(null,'',location.pathname+'#email-action');}

export async function api(path,{method='GET',body,authenticated=true}={}){
  const headers = {'Content-Type':'application/json'};
  if(authenticated){if(!session.user)throw new Error('Sign in to continue.');headers.Authorization='Bearer '+await session.user.getIdToken();}
  const response=await fetch(API_ORIGIN+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',referrerPolicy:'no-referrer'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const error=new Error(data.message||'StrataX is temporarily unavailable. Please try again.');error.code=data.code;throw error;}
  return data;
}

export function initializeAuth(onChange){
  changed=onChange;
  if(initialization)return initialization;
  initialization=(async()=>{
    try{
      config=await api('/api/runtime-config',{authenticated:false});
      if(!config.firebase?.apiKey||!config.firebase?.appId)throw new Error('Secure sign-in is temporarily unavailable.');
      client=getAuth(initializeApp(config.firebase));
      await new Promise(resolve=>onAuthStateChanged(client,async user=>{
        session.ready=false;session.user=user;session.accepted=false;session.account=null;session.error='';
        try{
          if(user&&rememberChoice()&&!authenticating){
            const until=Number(localGet('stratax.rememberUntil:'+user.uid)||0);
            if(!until||until<=Date.now()){await signOut(client);return;}
          }
          if(user?.emailVerified&&!hasActionLink()&&!authenticating)await loadAccount();
        }catch(error){session.error=error.message;}
        session.ready=true;if(!authenticating)changed();resolve();
      },()=>{session.error='Your session could not be restored. Please reload.';session.ready=true;changed();resolve();}));
    }catch(error){session.error=error.message;session.ready=true;changed();}
  })();
  return initialization;
}

export async function loadAccount(){
  const [account,legal]=await Promise.all([api('/api/account'),api('/api/legal-acceptance')]);
  session.account=account;session.accepted=legal.accepted;return legal;
}

async function persistence(remember){
  if(!client)throw new Error('Secure sign-in is unavailable. Reload and try again.');
  localSet('stratax.keepSignedIn',remember?'1':'0');
  await setPersistence(client,remember?browserLocalPersistence:browserSessionPersistence);
  authenticating=true;
}
function record(user,remember){
  session.user=user;
  if(remember)localSet('stratax.rememberUntil:'+user.uid,String(Date.now()+30*86400000));
  else localRemove('stratax.rememberUntil:'+user.uid);
}
export async function login(email,password,remember){
  try{await persistence(remember);
    const {user}=await signInWithEmailAndPassword(client,email.trim(),password);record(user,remember);
    if(!user.emailVerified){await signOut(client);throw Object.assign(new Error('Verify your email address before signing in. Request a verification email below.'),{code:'email_not_verified'});}
    return user;
  }finally{authenticating=false;}
}
export async function googleLogin(remember){
  try{await persistence(remember);const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
    const {user}=await signInWithPopup(client,provider);record(user,remember);return user;
  }finally{authenticating=false;}
}
export async function requestEmail(email,purpose,name=''){
  const result=await api('/api/auth/action-email',{method:'POST',body:{email:email.trim(),purpose,name:name.trim()},authenticated:false});
  localSet('stratax.emailAddress',email.trim());localSet('stratax.emailPurpose',purpose);return result;
}
export async function savePassword(email,password,remember,url){
  try{await persistence(remember);
  if(!isSignInWithEmailLink(client,url))throw new Error('This account link is invalid. Request a new link.');
  const {user}=await signInWithEmailLink(client,email.trim(),url);record(user,remember);
  // Once consumed, retain the verified session for retrying password/profile saves.
  session.setupUser=user;clearActionLink();
  return await finishPassword(password);
  }finally{authenticating=false;}
}
export async function finishPassword(password){
  const user=session.setupUser;
  if(!user)throw new Error('Request a new secure account link.');
  if(user.providerData.some(p=>p.providerId==='password'))await updatePassword(user,password);
  else await linkWithCredential(user,EmailAuthProvider.credential(user.email,password));
  await user.reload();session.user=user;return user;
}
export async function verifyEmailAction(code){
  if(!client)throw new Error('Secure sign-in is unavailable. Reload and try again.');
  await applyActionCode(client,code);clearActionLink();
  if(client.currentUser){await client.currentUser.reload();session.user=client.currentUser;}
}
export async function acceptPolicies(){
  await api('/api/legal-acceptance',{method:'POST',body:{accepted:true,accepted_versions:configVersions()}});session.accepted=true;
}
export async function finishLogin(profile){
  await acceptPolicies();
  if(profile)session.account=await api('/api/account',{method:'PUT',body:profile});
  else await loadAccount();
  session.setupUser=null;['stratax.emailAddress','stratax.emailPurpose','stratax.emailName'].forEach(localRemove);
  history.replaceState(null,'',location.pathname+'#home');changed();
}
export async function logout(){
  if(session.user)localRemove('stratax.rememberUntil:'+session.user.uid);
  if(client)await signOut(client);
  session.user=null;session.setupUser=null;session.accepted=false;session.account=null;
  history.replaceState(null,'',location.pathname+'#home');changed();
}
export function friendlyError(error){
  return ({'auth/invalid-credential':'Incorrect email or password.','auth/invalid-email':'Enter a valid email address.','auth/invalid-action-code':'This link is invalid or has already been used. Request a new one.','auth/expired-action-code':'This link has expired. Request a new one.','auth/popup-closed-by-user':'Google sign-in was cancelled.','auth/popup-blocked':'Allow the Google sign-in popup, then try again.','auth/too-many-requests':'Too many attempts. Please wait and try again.','auth/network-request-failed':'Check your connection and try again.','auth/user-disabled':'This account is unavailable. Contact support.','auth/unauthorized-domain':'Sign-in is not yet configured for this domain.','auth/requires-recent-login':'Request a new secure link before changing your password.','auth/account-exists-with-different-credential':'Sign in using your existing TerraCode account method.'})[error.code]||(String(error.code||'').startsWith('auth/')?'Sign-in could not be completed. Please try again.':error.message)||'Sign-in could not be completed. Please try again.';
}
