// Also loaded by the classic browser import worker.
(function(root){
 const numeric=v=>v!==null&&v!==''&&Number.isFinite(Number(v))?Number(v):null;
 const length=u=>({m:1,ft:.3048,feet:.3048,metres:1,meters:1}[String(u||'').toLowerCase()]||null);
 function location(x,y,crs,order='X / Y'){
  x=numeric(x);y=numeric(y);if(x===null||y===null)return null;const code=String(crs||'').trim().toUpperCase().replace(/^EPSG:/,'');let lat,lng;
  if(['4326','WGS84','WGS 84'].includes(code)){[lng,lat]=order==='Latitude / longitude'?[y,x]:[x,y];}
  else if(code==='3857'){lng=x/6378137*180/Math.PI;lat=(2*Math.atan(Math.exp(y/6378137))-Math.PI/2)*180/Math.PI;}
  else if(/^32[67]\d\d$/.test(code)&&Number(code.slice(-2))>=1&&Number(code.slice(-2))<=60){
   const a=6378137,e2=.0066943799901413165,k=.9996,ep=e2/(1-e2),east=x-500000,north=y-(code.startsWith('327')?10000000:0),mu=north/k/(a*(1-e2/4-3*e2**2/64-5*e2**3/256)),e1=(1-Math.sqrt(1-e2))/(1+Math.sqrt(1-e2));
   const p=mu+(3*e1/2-27*e1**3/32)*Math.sin(2*mu)+(21*e1**2/16-55*e1**4/32)*Math.sin(4*mu)+151*e1**3/96*Math.sin(6*mu)+1097*e1**4/512*Math.sin(8*mu),n=a/Math.sqrt(1-e2*Math.sin(p)**2),t=Math.tan(p)**2,c=ep*Math.cos(p)**2,r=a*(1-e2)/(1-e2*Math.sin(p)**2)**1.5,d=east/(n*k);
   lat=(p-n*Math.tan(p)/r*(d*d/2-(5+3*t+10*c-4*c*c-9*ep)*d**4/24+(61+90*t+298*c+45*t*t-252*ep-3*c*c)*d**6/720))*180/Math.PI;
   lng=((Number(code.slice(-2))*6-183)*Math.PI/180+(d-(1+2*t+c)*d**3/6+(5-2*c+28*t-3*c*c+8*ep+24*t*t)*d**5/120)/Math.cos(p))*180/Math.PI;
  }else return null;
  return Number.isFinite(lat)&&Math.abs(lat)<=90&&Math.abs(lng)<=180?{lat,lng,confirmed:true,crs:'EPSG:4326',sourceCRS:crs}:null;
 }
 function at(row,mapping,role){const i=mapping?.[role];return i!==undefined&&i!==''?row[Number(i)]:null;}
 function headerIdentity(dataset){const h=dataset.metadata?.headers||{},v=(...names)=>{for(const n of names)if(h[n]?.value!==undefined)return h[n].value;return '';};return {name:v('WELL'),uwi:v('UWI','API'),latitude:numeric(v('LAT','LATI','LATITUDE')),longitude:numeric(v('LON','LONG','LONGITUDE')),x:numeric(v('X','XCOORD','EAST')),y:numeric(v('Y','YCOORD','NORTH')),elevation:numeric(v('KB','RKB','EKB')),totalDepth:numeric(v('STOP','TD'))};}
 function collect(dataset,rows,options={}){
  const refs=options.references||dataset.references||{},m=options.mapping||dataset.mapping||{},family=dataset.family,records=[],picks=[],issues=[],seen=new Map(),uwis=new Map(),exactRows=new Map(),coords=new Map(),source=options.assetId||dataset.sourceId||dataset.id;
  const identity=headerIdentity(dataset),owner=options.expectedWell;if(owner&&identity.name&&![owner.name||owner.id,...owner.aliases||[]].includes(String(identity.name).trim()))issues.push({code:'well_identity_conflict',severity:'warning',message:'The source header differs from the selected owning well. Confirm the association explicitly.'});
  const register=(raw,rowIndex,row)=>{const action=options.headerActions?.[rowIndex];if(action?.action==='skip')return;const name=String(raw??'').trim();if(!name){issues.push({code:'well_identity',severity:'blocking',row:rowIndex,message:'Header row '+(rowIndex+1)+' has no well name. Map its identifier or explicitly skip the row.'});return;}const binding=options.wellBindings?.[name],id=action?.well||binding||(dataset.metadata?.rowWell?dataset.well:options.well)||('well-'+source+'-'+rowIndex),uwi=String(at(row,m,'uwi')||dataset.metadata?.rowUwi||identity.uwi||'');
   const lat=at(row,m,'latitude')??identity.latitude,lon=at(row,m,'longitude')??identity.longitude,x=at(row,m,'x')??identity.x,y=at(row,m,'y')??identity.y;
   let point=lat!==null&&lon!==null?location(lon,lat,/^EPSG:32[67]\d\d$/i.test(refs.crs||'')?'EPSG:4326':refs.crs,'Longitude / latitude'):location(x,y,refs.crs,refs.coordinateOrder);
   const record={id,name,uwi,rowIndex,sourceId:source,elevation:numeric(at(row,m,'elevation')??identity.elevation),totalDepth:numeric(at(row,m,'depth')??identity.totalDepth),totalDepthUnit:refs.depthUnit||dataset.metadata?.headers?.STOP?.unit||'',elevationUnit:refs.elevationUnit||dataset.columns?.[Number(m.elevation)]?.unit||dataset.metadata?.headers?.KB?.unit||'',elevationDatum:refs.verticalDatum||'',sourceCoordinates:{x:numeric(x),y:numeric(y),crs:refs.crs||''}};if(point)record.location={...point,source:'Imported source · '+source};
   if(family==='well_headers'){const fingerprint=JSON.stringify(row);if(exactRows.has(fingerprint))issues.push({code:'duplicate_header_row',severity:'warning',row:rowIndex,message:'Identical header rows '+(exactRows.get(fingerprint)+1)+' and '+(rowIndex+1)+'. Both remain available.'});else exactRows.set(fingerprint,rowIndex);}if(uwi){if(uwis.has(uwi))issues.push({code:'duplicate_uwi',severity:'warning',row:rowIndex,message:'Repeated UWI '+uwi+' on rows '+(uwis.get(uwi)+1)+' and '+(rowIndex+1)+'.'});else uwis.set(uwi,rowIndex);}if(seen.has(name))issues.push({code:'duplicate_well',severity:'warning',row:rowIndex,message:'Repeated well identifier '+name+' (rows '+(seen.get(name)+1)+' and '+(rowIndex+1)+').'});else seen.set(name,rowIndex);
   const coordinate=point?point.lat+':'+point.lng:x!==null&&y!==null?x+':'+y:null;if(coordinate){if(coords.has(coordinate))issues.push({code:'duplicate_location',severity:'warning',row:rowIndex,message:name+' shares a coordinate with '+coords.get(coordinate)+'. Both can be retained.'});else coords.set(coordinate,name);}
   records.push(record);
  };
  if(family==='well_headers')rows.forEach((row,i)=>register(at(row,m,'well'),i,row));
  else if((dataset.well||options.well||identity.name)&&!(['logs','arrays'].includes(family)&&options.deriveWellHeader===false))register(dataset.metadata?.rowWell?dataset.metadata.wellName||dataset.metadata.well:identity.name||options.wellName||dataset.well||options.well,0,[]);
  if(family==='tops')rows.forEach((row,i)=>{const name=String(at(row,m,'name')||'').trim(),depth=numeric(at(row,m,'depth')),raw=String(at(row,m,'well')||dataset.well||options.well||'');if(name&&depth!==null&&raw)picks.push({id:source+'-pick-'+encodeURIComponent(dataset.well||options.well||'table')+'-'+i,markerId:'marker-'+encodeURIComponent(name.toLowerCase()).replace(/%/g,'_'),name,depth:depth*(length(refs.depthUnit)||1),wellId:dataset.metadata?.rowWell?dataset.well:options.wellBindings?.[raw]||options.well||raw,reference:refs.depthReference||'Unconfirmed',verticalDatum:refs.verticalDatum||'',unit:refs.depthUnit||'',sourceId:source,rowIndex:i});});
  return {wellRecords:records,markerPicks:picks,issues};
 }
 function crossWellIssues(workspace,datasets){
  const seen=new Map(),notes=[],coordinate=w=>{const p=w.location||workspace.mapWorkspace?.locations?.[w.id];if(p?.confirmed)return 'point:'+p.lat.toFixed(8)+':'+p.lng.toFixed(8);const c=w.sourceCoordinates;return c&&numeric(c.x)!==null&&numeric(c.y)!==null?'source:'+c.crs+':'+c.x+':'+c.y:null;},keys=w=>[['name',w.name||w.id],['uwi',w.uwi],['coordinate',coordinate(w)]].filter(([,value])=>value!==null&&value!==undefined&&value!=='').map(([kind,value])=>[kind,String(value).trim().toLowerCase()]),remember=w=>{for(const [kind,key]of keys(w)){const k=kind+':'+key;const ids=seen.get(k)||new Set();ids.add(w.id);seen.set(k,ids);}};
  for(const well of workspace.wellDrafts||[])remember(well);
  for(const dataset of datasets){for(const record of dataset.wellRecords||[])for(const [kind,key]of keys(record)){if([...(seen.get(kind+':'+key)||[])].some(id=>id!==record.id))notes.push({code:'existing_'+kind,severity:'warning',source:dataset.name,sourceId:dataset.sourceId,assetKey:dataset.assetKey||dataset.id,message:(record.name||record.id)+' shares '+kind+' with a separate well registration. Review the affected records; coordinates never merge wells.'});}for(const record of dataset.wellRecords||[])remember(record);}
  return notes;
 }
 function trajectory(rows,dataset,well){
  const refs=dataset.references||{},m=dataset.mapping||{},mode=dataset.surveyMethod||dataset.metadata?.surveyMethod||'angles',factor=length(refs.depthUnit),origin=well?.sourceCoordinates,points=[];
  if(!factor)throw new Error('Confirm survey depth units.');if(!refs.verticalDatum)throw new Error('Confirm the survey depth/elevation datum.');if(rows.length>50000)throw new Error('Use a survey of at most 50,000 stations.');
  if(!['angles','offsets','xy_tvd','coordinates'].includes(mode))throw new Error('Confirm the survey representation.');
  if(mode==='coordinates'&&!['Depth positive down','Elevation positive up'].includes(refs.verticalMeaning))throw new Error('Confirm whether Z is depth or elevation.');
  if(['offsets','xy_tvd'].includes(mode)&&refs.depthReference!=='TVD')throw new Error('Confirm TVD and its datum for supplied vertical-depth coordinates.');
  if(mode==='angles'&&refs.depthReference!=='MD')throw new Error('Angular surveys require an MD reference.');
  const needsOrigin=['angles','offsets'].includes(mode),projected=/^EPSG:(32[67]\d\d|3857)$/i.test(refs.crs||'');
  if(needsOrigin&&(!origin||numeric(origin.x)===null||numeric(origin.y)===null||!projected||String(origin.crs).toUpperCase()!==String(refs.crs).toUpperCase()))throw new Error('Confirm a matching projected well origin and survey CRS.');
  if(mode==='offsets'&&!length(refs.offsetUnit))throw new Error('Confirm the horizontal offset unit.');
  let previous=null,east=0,north=0,tvd=0,correction=0;
  if(mode==='angles'){
   if(!/^EPSG:32[67]\d\d$/i.test(refs.crs))throw new Error('Angular reconstruction currently supports WGS84 UTM coordinates.');
   if(!['Grid north','True north','Magnetic north'].includes(refs.northReference))throw new Error('Confirm the azimuth north reference.');
   if(refs.northReference!=='Grid north'){
    if(refs.northReference==='Magnetic north'&&numeric(refs.declination)===null)throw new Error('Supply documented magnetic declination.');
    if(numeric(refs.northCorrection)!==null)correction=numeric(refs.northCorrection);
    else{const p=location(origin.x,origin.y,refs.crs),q=location(origin.x,origin.y+1,refs.crs);if(!p||!q)throw new Error('Grid convergence could not be calculated.');correction=-Math.atan2((q.lng-p.lng)*Math.cos(p.lat*Math.PI/180),q.lat-p.lat)*180/Math.PI;}
    if(refs.northReference==='Magnetic north')correction+=numeric(refs.declination);
   }
  }
  for(const row of rows){const md=numeric(at(row,m,'md'));if(mode==='angles'&&md===null)throw new Error('A station has no measured depth.');if(md!==null&&previous?.md!==null&&previous?.md!==undefined&&md<=previous.md)throw new Error('Review repeated/decreasing MD records. No stations were discarded.');let x,y,z,stationTvd=null;
   if(mode==='angles'){
    let inc=numeric(at(row,m,'inclination')),az=numeric(at(row,m,'azimuth'));if(inc===null||az===null||!['degrees','radians'].includes(refs.angleUnit))throw new Error('Confirm station angles and units.');if(refs.angleUnit==='degrees'){inc*=Math.PI/180;az*=Math.PI/180;}if(inc<0||inc>Math.PI||az<0||az>2*Math.PI)throw new Error('Station angles are outside their supported range.');az+=correction*Math.PI/180;
    if(!previous&&md!==0)throw new Error('Include a referenced MD 0 tie-in before minimum-curvature reconstruction.');
    if(previous){const dl=Math.acos(Math.max(-1,Math.min(1,Math.cos(previous.inc)*Math.cos(inc)+Math.sin(previous.inc)*Math.sin(inc)*Math.cos(az-previous.az))));if(dl>=Math.PI-1e-8)throw new Error('A 180-degree dogleg is singular. Review the original stations.');const ratio=dl<1e-8?1:2*Math.tan(dl/2)/dl,step=(md-previous.md)*factor/2*ratio;east+=step*(Math.sin(previous.inc)*Math.sin(previous.az)+Math.sin(inc)*Math.sin(az));north+=step*(Math.sin(previous.inc)*Math.cos(previous.az)+Math.sin(inc)*Math.cos(az));tvd+=step*(Math.cos(previous.inc)+Math.cos(inc));}
    x=numeric(origin.x)+east;y=numeric(origin.y)+north;z=tvd;stationTvd=tvd;previous={md,inc,az};
   }else{
    x=numeric(at(row,m,mode==='offsets'?'dx':'x'));y=numeric(at(row,m,mode==='offsets'?'dy':'y'));z=numeric(at(row,m,mode==='coordinates'?'z':'tvd'));if(x===null||y===null||z===null)throw new Error('A station has missing coordinate/depth values.');z*=factor;
    if(mode==='offsets'){x=numeric(origin.x)+x*length(refs.offsetUnit);y=numeric(origin.y)+y*length(refs.offsetUnit);}
    if(mode!=='coordinates'||refs.verticalMeaning==='Depth positive down'&&refs.depthReference==='TVD')stationTvd=z;
    if(mode==='coordinates'&&refs.verticalMeaning==='Elevation positive up'&&well?.elevationDatum===refs.verticalDatum&&length(well.elevationUnit)&&numeric(well.elevation)!==null)stationTvd=numeric(well.elevation)*length(well.elevationUnit)-z;
    previous={md};
   }
   if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(z))throw new Error('A station cannot be reconstructed from its geometry.');const point=location(x,y,refs.crs,refs.coordinateOrder);if(!point)throw new Error('Transform this source to WGS84 geographic, Web Mercator or WGS84 UTM before map use.');points.push({...point,md:md===null?null:md*factor,tvd:stationTvd,z,derived:mode==='angles',method:mode==='angles'?'minimum curvature':'supplied coordinate observations',northCorrectionDegrees:mode==='angles'?correction:null});
  }return points;
 }
 root.StrataxWellEvidence={numeric,length,location,at,headerIdentity,collect,crossWellIssues,trajectory};
})(globalThis);
