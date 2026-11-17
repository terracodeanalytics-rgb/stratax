export const wellDataFamilies=new Set(['logs','arrays','deviation','tops','checkshots','core','pressure','fluids','geochemistry','production']);
export function headerWellIds(workspace,datasets=[]){
 const headers=[...(workspace.ingestion?.datasets||[]).filter(d=>d.active!==false),...datasets].filter(d=>d.family==='well_headers');
 return new Set(headers.flatMap(d=>(d.wellRecords||[]).map(w=>w.id)));
}
export function requireWellHeaders(workspace,datasets){
 const wells=headerWellIds(workspace,datasets),pending=datasets.filter(d=>wellDataFamilies.has(d.family)&&(!d.well||!wells.has(d.well)));
 if(pending.length)throw Object.assign(new Error('Import a well header first, then match each well dataset to a well in that header. '+pending.map(d=>d.name||d.id).slice(0,3).join(', ')),{code:'well_header_required'});
}
