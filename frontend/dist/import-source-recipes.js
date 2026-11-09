// Shared by the browser worker and editor. Parsed originals remain immutable.
(()=>{
 const deviationRoles=new Set(['md','inclination','azimuth','well','uwi','dx','dy','tvd','x','y','z']);
 const canonicalMapping=(mapping,family)=>Object.fromEntries(Object.entries(mapping||{}).filter(([role])=>family!=='deviation'||deviationRoles.has(role)));
 function textRecipe(text,family){
  const source=text.split(/\r\n|\n|\r/).map(s=>s.trim()).filter(Boolean);
  if(family==='deviation'&&/^UWI\s*:/i.test(source[0]||'')&&/^Measr\.\s+Depth\s+Deviation/i.test(source[1]||''))return {names:['MD','Inclination','Azimuth'],mapping:{md:'0',inclination:'1',azimuth:'2'},uwi:source[0].replace(/^UWI\s*:\s*/i,'').split(/\s+/)[0],headerLines:source.slice(0,2),recipe:'openworks-directional/1'};
  if(family==='checkshots'&&source.some(s=>/^TDP5\s+/.test(s)))return {names:['Source column 1','Source column 2'],mapping:{},prefix:'TDP5',headerLines:source.slice(0,4),recipe:'openworks-tdp/1'};
  return null;
 }
 function mixedBlocks(rows){if(rows.length<12||rows.length%2)return null;const n=rows.length/2,a=rows.slice(0,n),b=rows.slice(n);if(a.every((r,i)=>r.length>=3&&b[i].length>=3&&r.slice(1,3).every((v,j)=>Math.abs(v-b[i][j+1])<1e-8))&&Math.max(...a.map((r,i)=>Math.abs(r[0]-b[i][0]*.3048)))<=.02)return {ranges:[[0,n],[n,rows.length]],kind:'possible-metre-feet-duplicates'};return null;}
 globalThis.StrataxImportRecipes={canonicalMapping,textRecipe,mixedBlocks};
})();
