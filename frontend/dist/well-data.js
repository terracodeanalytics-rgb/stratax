// Shared intake suggestions and well relationships. Source measurements are immutable.
import './import-source-recipes.js';
export const wellFamilies=['well_headers','logs','deviation','tops','checkshots','core','pressure','fluids','geochemistry','production','arrays'];
export const normalize=value=>String(value??'').trim().toLocaleLowerCase();
const key=value=>normalize(value).replace(/[^a-z0-9]/g,'');
export const roleAliases={well:['well','wellname','name','borehole'],uwi:['uwi','api','uniqueidentifier'],index:['dept','depth','md'],md:['md','measureddepth'],inclination:['incl','inc','inclination','deviation'],azimuth:['azim','azi','azimuth','direction','azimgn','azimtn'],dx:['dx','eastoffset'],dy:['dy','northoffset'],tvd:['tvd','trueverticaldepth'],x:['x','xcoord','surfacex','easting'],y:['y','ycoord','surfacey','northing'],z:['z','elevationz'],latitude:['lat','latitude'],longitude:['lon','long','longitude'],elevation:['kb','rkb','elevation','welldatumvalue'],depth:['depth','md','tvd','tvdss','td','totaldepth'],base:['base','bottomdepth'],name:['surface','marker','formation','top','name'],type:['type','markertype'],time:['twt','twtpicked','owt','time'],sample:['sample','sampleid'],pressure:['pressure','rft','psi'],date:['date','timestamp'],value:['value','rate']};
export const curveTypes={gamma:['gr','gamma','gammaray'],resistivity:['rt','ild','lld','resd','resistivity'],porosity:['phi','phie','phit','porosity'],density:['rhob','density'],neutron:['nphi','neutron'],sonic:['dt','dtc','sonic'],caliper:['cali','caliper'],permeability:['perm','permeability'],facies:['facies','lith','lithology']};
export function curveType(column){return column.propertyType||Object.entries(curveTypes).find(([,names])=>names.includes(key(column.mnemonic)))?.[0]||'';}
export async function concurrent(items,limit,task){let next=0,failed;const results=new Array(items.length);await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(next<items.length&&!failed){const i=next++;try{results[i]=await task(items[i],i);}catch(error){failed=error;}}}));if(failed)throw failed;return results;}
export function inferFamily(name,text='',fallback='logs'){
 const source=(name.replace(/[_-]/g,' ')+' '+text.slice(0,12000)).toLowerCase();
 if(/^\s*~(?:v|version)/im.test(text)||/\.(las|dlis|lis)$/i.test(name))return 'logs';
 if(/\.(sgy|segy|su|zgy|sgz|vds)$/i.test(name))return 'seismic';
 if(/^\s*TDP[345]\b/im.test(text)||/check[ _-]?sho|chech[ _-]?sho|time.?depth/i.test(name.split(/[\\/]/).pop())||/twt.*\bmd\b|\b(?:md|depth|tvd)\b[^\n]*\b(?:twt|owt)\b/i.test(text))return 'checkshots';
 if(/\.(dev|deviation|survey)$/i.test(name)||/deviation|well trace|surveys?|trajector(?:y|ies)|\bdx\b[^\n]*\bdy\b[^\n]*\btvd\b|inclination|\binc\b|\bincl\b|\bazi\b|\bazim\b|\.dev$/.test(source))return 'deviation';
 if(/well.?head|well.?header|surface.?x|well datum|\bwell(?:\s*name)?\b[^\n]*\b(?:x|easting)\b[^\n]*\b(?:y|northing)\b/.test(source))return 'well_headers';
 if(/well.?tops|formation.?tops|\btops?\b|\bmarkers?\b|\bhorizon\b/.test(source))return 'tops';
 for(const [family,pattern]of [['pressure',/pressure|\brft\b/],['core',/core|plug sample/],['production',/production|oil.?rate/],['geochemistry',/geochem|toc|vitrinite/],['fluids',/fluid|\bpvt\b/]])if(pattern.test(source))return family;
 if(/(?:^|[\s_/-])arrays?(?:[\s_/.]|$)|\.(npy|npz|h5|hdf5|nc)$/i.test(name))return 'arrays';
 if(/\.(pdf|docx|png|jpg|jpeg|bmp|gif)$/i.test(name)||/(?:^|[\s_/-])(readme|license|notes?)(?:[\s_/.]|$)/i.test(name))return 'documents';
 if(/\b(?:dept|depth|md)\b[^\n]*\b(?:gr|rhob|nphi|resistivity)\b/i.test(text))return 'logs';
 return fallback;
}
export function sourceHints(text){const references={},values={};for(const line of text.split(/\r?\n/)){const match=/^\s*[#!]?\s*(CRS|EPSG|DEPTH[_ ]UNIT|DEPTH[_ ]REFERENCE|ANGLE[_ ]UNIT|NORTH[_ ]REFERENCE|TIME[_ ]UNIT|TIME[_ ]CONVENTION|VERTICAL[_ ]DATUM)\s*[:=]\s*(.+?)\s*$/i.exec(line);if(match)values[match[1].toUpperCase().replace(/ /g,'_')]=match[2];}const crs=values.CRS||(values.EPSG?'EPSG:'+values.EPSG:'');if(/^EPSG:\d+$/i.test(crs))references.crs=crs.toUpperCase();for(const [key,source,allowed]of [['depthUnit','DEPTH_UNIT',['m','ft']],['depthReference','DEPTH_REFERENCE',['MD','TVD','TVDSS']],['angleUnit','ANGLE_UNIT',['degrees','radians']],['northReference','NORTH_REFERENCE',['Grid north','True north','Magnetic north']],['timeUnit','TIME_UNIT',['ms','s']],['timeConvention','TIME_CONVENTION',['One-way time','Two-way time']]]){const found=allowed.find(value=>value.toLowerCase()===values[source]?.toLowerCase());if(found)references[key]=found;}if(values.VERTICAL_DATUM)references.verticalDatum=values.VERTICAL_DATUM;return references;}
export function suggest(dataset,family,previous={}){
 const columns=dataset?.columns||[],mapping={},references={},headers=dataset?.metadata?.headers||{};
 for(const [role,names]of Object.entries(roleAliases)){const found=columns.map((c,i)=>names.includes(key(c.mnemonic))?i:-1).filter(i=>i>=0);if(found.length===1)mapping[role]=String(found[0]);}

 if(mapping.index===undefined&&dataset?.metadata?.index){const matches=columns.map((c,i)=>[c,i]).filter(([c])=>c.mnemonic===dataset.metadata.index);if(matches.length===1)mapping.index=String(matches[0][1]);}
 if(family==='tops'&&mapping.name===mapping.well)delete mapping.name;
 const index=columns[Number(mapping.index??mapping.md??mapping.depth)],unit=index?.unit;
 if(/^(m|ft)$/i.test(unit||''))references.depthUnit=unit.toLowerCase();
 if(/^(md|tvd|tvdss)$/i.test(index?.mnemonic||''))references.depthReference=index.mnemonic.toUpperCase();
 if(family==='logs'&&/^(dept|depth)$/i.test(index?.mnemonic||''))references.depthReference='MD';
 const offset=columns[Number(mapping.dx)];if(/^(m|ft)$/i.test(offset?.unit||''))references.offsetUnit=offset.unit.toLowerCase();const elevation=columns[Number(mapping.elevation)]?.unit||headers.KB?.unit||headers.RKB?.unit;if(/^(m|ft)$/i.test(elevation||''))references.elevationUnit=elevation.toLowerCase();const time=columns[Number(mapping.time)];if(/^(ms|s)$/i.test(time?.unit||''))references.timeUnit=time.unit.toLowerCase();
 if(/^twt/i.test(time?.mnemonic||''))references.timeConvention='Two-way time';if(/^owt/i.test(time?.mnemonic||''))references.timeConvention='One-way time';
 const az=columns[Number(mapping.azimuth)];if(/gn$/i.test(az?.mnemonic||''))references.northReference='Grid north';if(/tn$/i.test(az?.mnemonic||''))references.northReference='True north';
 if(/deg/i.test(az?.unit||''))references.angleUnit='degrees';if(/rad/i.test(az?.unit||''))references.angleUnit='radians';
 Object.assign(references,dataset?.metadata?.references||{});
 const curves=Object.fromEntries(columns.map(c=>[c.id,{propertyType:curveType(c),selected:true}]));
 return {...previous,mapping:globalThis.StrataxImportRecipes.canonicalMapping({...mapping,...dataset?.metadata?.suggestedMapping,...previous.mapping},family),references:{...references,...previous.references},units:previous.units||{},curves:{...curves,...previous.curves},null:previous.null??dataset?.metadata?.null??'',surveyMethod:previous.surveyMethod||(mapping.dx!==undefined?'offsets':mapping.x!==undefined?mapping.tvd!==undefined?'xy_tvd':'coordinates':'angles'),sourceIdentity:{name:headers.WELL?.value||dataset?.well||'',uwi:headers.UWI?.value||headers.API?.value||''}};
}
export function matchWell(identity,wells,{field='name',exact=true}={}){const value=exact?String(identity||'').trim():normalize(identity);return wells.filter(w=>[field==='uwi'?w.uwi:w.name||w.id,...(field==='name'?w.aliases||[]:[])].some(v=>(exact?String(v||'').trim():normalize(v))===value&&value!==''));}
export function upgradeWells(workspace){workspace.wellDrafts||=[];for(const well of workspace.wellDrafts){well.name||=well.id;well.aliases||=[];}workspace.wellModelVersion=2;return workspace.wellDrafts;}
export function registerEvidence(workspace,datasets){
 const wells=upgradeWells(workspace);workspace.mapWorkspace||={locations:{},symbols:{}};workspace.mapWorkspace.locations||={};workspace.stratigraphy||={markers:[],picks:[]};workspace.stratigraphy.markers||=[];workspace.stratigraphy.picks||=[];
 for(const d of datasets){for(const record of d.wellRecords||[]){let well=wells.find(w=>w.id===record.id);if(!well){well={id:record.id,name:record.name||record.id,uwi:record.uwi||'',aliases:[],source:d.importId,status:'Imported registration'};wells.push(well);}if(record.name&&record.name!==well.name&&!well.aliases.includes(record.name))well.aliases.push(record.name);if(!well.uwi&&record.uwi)well.uwi=record.uwi;well.evidence||=[];if(!well.evidence.includes(d.id))well.evidence.push(d.id);for(const prop of ['elevation','elevationUnit','elevationDatum','totalDepth','totalDepthUnit','locationSource','sourceCoordinates'])if(record[prop]!==undefined&&record[prop]!==null&&(well[prop]===undefined||well[prop]===null||well[prop]===''||prop==='sourceCoordinates'&&(well[prop].x===null||well[prop].y===null)))well[prop]=record[prop];if(record.location&&!workspace.mapWorkspace.locations[well.id])workspace.mapWorkspace.locations[well.id]=record.location;}
  let well=wells.find(w=>w.id===d.well);if(!well&&d.well){well={id:d.well,name:d.well,aliases:[],source:d.importId,status:'Imported association',evidence:[d.id]};wells.push(well);}if(well){if(d.family==='deviation'&&!well.activeSurveyId)well.activeSurveyId=d.id;if(d.family==='checkshots'&&!well.activeCheckshotId)well.activeCheckshotId=d.id;}
  for(const pick of d.markerPicks||[]){const marker=workspace.stratigraphy.markers.find(m=>normalize(m.name)===normalize(pick.name));if(!marker)workspace.stratigraphy.markers.push({id:pick.markerId,name:pick.name,color:pick.color||'#b78540'});pick.markerId=marker?.id||pick.markerId;if(!workspace.stratigraphy.picks.some(p=>p.id===pick.id))workspace.stratigraphy.picks.push({...pick,datasetId:d.id,importId:d.importId});}
 }
}

export function applyImportedEvidence(workspace,ingestion){workspace.ingestion=ingestion;registerEvidence(workspace,(ingestion?.datasets||[]).filter(d=>d.active!==false));return ingestion;}
