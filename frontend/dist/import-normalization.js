(function(root){
 const aliases={meter:'m',meters:'m',metre:'m',metres:'m',m:'m',foot:'ft',feet:'ft',ft:'ft',
  gapi:'gAPI','api':'gAPI','v/v':'v/v','vol/vol':'v/v',fraction:'v/v',percent:'%',percentage:'%',
  'g/cc':'g/cm3','g/cm3':'g/cm3','g/cm^3':'g/cm3','ohm-m':'ohm.m','ohm.m':'ohm.m',
  degree:'degrees',degrees:'degrees',deg:'degrees',radian:'radians',radians:'radians',rad:'radians',
  millisecond:'ms',milliseconds:'ms',ms:'ms',second:'s',seconds:'s',s:'s',psi:'psi'};
 const canonicalUnit=value=>aliases[String(value||'').trim().toLowerCase()]||String(value||'').trim();
 function normalizeColumns(dataset){
  for(const column of dataset.columns||[]){
   const value=column.effectiveUnit||column.unit;
   const unit=aliases[String(value||'').trim().toLowerCase()];
   if(unit)column.effectiveUnit=unit;
  }
  return dataset;
 }
 function describe(dataset){
  const unresolved=(dataset.issues||[]).some(issue=>issue.severity==='blocking');
  return {schemaVersion:1,format:'stratax-dataset/1',status:unresolved?'needs_review':'normalized',
   rowEncoding:'json-array',nullValue:null,columnIds:(dataset.columns||[]).map(c=>c.id),
   mapping:{...dataset.mapping},references:{...dataset.references},
   sourceUnitsRetained:true};
 }
 root.StrataxNormalization={describe,normalizeColumns,canonicalUnit};
})(globalThis);
