// Physical reads are cached separately from editable interpretation settings.
export function previewReadKey(family,options,matchField){
 const mapping=Object.entries(options.mapping||{}).filter(([,value])=>value!==''&&value!==undefined).sort(([a],[b])=>a.localeCompare(b));
 return JSON.stringify([family,Number(options.headerRow||1),options.delimiter||'',!!options.noHeader,options.sheet||'',options.encoding||'utf-8',options.widths||[],options.columnNames||[],options.jsonPath||'',options.hdfPaths||[],options.frames||[],family==='seismic'?options.endian||'big':'',family==='seismic'?options.headerBytes||{}:{},family==='surfaces'?options.surfaceFormat||'':'',options.null??'',mapping,matchField]);
}

export function interpretPreview(source,family,options){
 const references=options.references||{},mapping=options.mapping||{},columns=source.columns.map((column,index)=>({...column,effectiveUnit:options.units?.[index]||column.unit,propertyType:options.curves?.[column.id]?.propertyType||column.propertyType}));
 const interpreted=/^(mapping_|range_|station_order_|duplicate_|existing_|well_identity|depth_|time_reference|north_reference|unknown_units|unconfirmed_crs|domain)/;
 const issues=(source.issues||[]).filter(issue=>!interpreted.test(issue.code));
 const add=(code,message,severity='warning')=>issues.push({code,message,severity});
 const required=family==='deviation'?({coordinates:['x','y','z'],xy_tvd:['x','y','tvd'],offsets:['dx','dy','tvd']}[options.surveyMethod]||['md','inclination','azimuth']):({well_headers:['well'],tops:['name','depth'],checkshots:['depth','time'],production:['date']}[family]||[]);
 for(const role of required)if(mapping[role]===undefined||mapping[role]==='')add('mapping_'+role,'Map the '+role+' field before importing.','blocking');
 for(const [role,index]of Object.entries(mapping))if(index!==''&&(!Number.isInteger(Number(index))||Number(index)<0||Number(index)>=columns.length))add('mapping_'+role,'The '+role+' mapping points to a missing column.','blocking');
 const radians=references.angleUnit==='radians';
 for(const [role,range]of Object.entries({inclination:[0,radians?Math.PI:180],azimuth:[0,radians?2*Math.PI:360],latitude:[-90,90],longitude:[-180,180]})){
  const index=mapping[role];if(index===undefined||index==='')continue;const stats=source.columnStatistics?.[Number(index)],values=stats?[stats.min,stats.max]:(source.preview||[]).map(row=>row[Number(index)]);
  if(values.some(value=>typeof value==='number'&&(value<range[0]||value>range[1])))add('range_'+role,'Some '+role+' values are outside the confirmed range.','blocking');
 }
 for(const issue of source.issues||[])if(issue.code?.startsWith('station_order_'))issues.push(issue);
 if(['logs','deviation','tops','checkshots','core','pressure'].includes(family)&&!references.depthReference)add('depth_reference','Depth reference is unconfirmed.');
 if(family==='checkshots'&&(!references.timeConvention||!references.timeUnit))add('time_reference','Confirm the time convention and units before scientific use.');
 if(family==='deviation'&&!references.northReference)add('north_reference','North reference is unconfirmed; no angular trajectory is calculated.');
 if(['logs','arrays'].includes(family)&&columns.some(c=>!(c.effectiveUnit||c.unit)||c.unit==='UNKNOWN'&&!options.units?.[c.id.split('-')[1]]))add('unknown_units','Some curve units are unconfirmed.');
 if((['well_headers','seismic','spatial','surfaces','models'].includes(family)||source.metadata?.headers?.LAT)&&!references.crs)add('unconfirmed_crs','Source coordinates require a confirmed CRS or datum before map use.');
 if(['seismic','surfaces','models'].includes(family)&&!references.domain)add('domain','Confirm the time or depth domain before scientific use.');
 return {...source,family,columns,mapping:{...mapping},references:{...references},surveyMethod:options.surveyMethod,issues};
}
