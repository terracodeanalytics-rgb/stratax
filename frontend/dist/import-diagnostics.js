// Support traces contain control states only: never file contents, names, wells or tokens.
const key='stratax.import.diagnostics.v2',limit=200;
export const importDiagnosticVersion='import/2026-11-08.2';
let entries=[];
try{const saved=JSON.parse(sessionStorage.getItem(key)||'[]');if(Array.isArray(saved))entries=saved.slice(-limit);}catch{}
export function startImportDiagnostics(){
 const session=crypto.randomUUID();
 return (event,fields={})=>{const entry={time:new Date().toISOString(),version:importDiagnosticVersion,session,event,...fields};entries.push(entry);entries=entries.slice(-limit);try{sessionStorage.setItem(key,JSON.stringify(entries));}catch{}console.info('[StrataX import]',JSON.stringify(entry));return entry;};
}
export function importDiagnosticSnapshot(){return {version:importDiagnosticVersion,events:structuredClone(entries)};}
