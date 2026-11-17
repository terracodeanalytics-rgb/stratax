import {mappingRoles} from './ingestion-catalog.js';

export function importSample(family='well_headers',surveyMethod='angles'){
 if(family==='logs')return {name:'well-logs-example.las',type:'text/plain',text:
  '~Version\nVERS. 2.0\nWRAP. NO\n~Well\nWELL. EXAMPLE_1\nUWI. EXAMPLE-001\nNULL. -999.25\n~Curve\nDEPT.M : Measured depth\nGR.GAPI : Gamma ray\nVSH.V/V : Shale volume\n~ASCII\n1000 35 0.15\n1001 80 0.55\n1002 -999.25 -999.25\n'};
 const layouts={
  well_headers:[['WELL','UWI','X(m)','Y(m)','CRS','ELEVATION(m)','TOTAL_DEPTH(m)'],['EXAMPLE_1','EXAMPLE-001',481200,69280,'EPSG:26391',12,2500]],
  deviation:surveyMethod==='offsets'?[['WELL','MD(m)','DX(m)','DY(m)','TVD(m)'],['EXAMPLE_1',100,5,3,99]]:
   ['coordinates','xy_tvd'].includes(surveyMethod)?[['WELL','MD(m)','X(m)','Y(m)',surveyMethod==='xy_tvd'?'TVD(m)':'Z(m)'],['EXAMPLE_1',100,481205,69283,99]]:
   [['WELL','MD(m)','INCLINATION(deg)','AZIMUTH(deg)'],['EXAMPLE_1',100,2,45]],
  tops:[['WELL','NAME','DEPTH(m)','BASE(m)'],['EXAMPLE_1','ZONE_A',1000,1050]],
  checkshots:[['WELL','DEPTH(m)','TIME(ms)'],['EXAMPLE_1',1000,800]],
  core:[['WELL','DEPTH(m)','SAMPLE','POROSITY(v/v)'],['EXAMPLE_1',1000,'CORE_1',.18]],
  pressure:[['WELL','DEPTH(m)','PRESSURE(psi)'],['EXAMPLE_1',1000,2500]],
  production:[['WELL','DATE','VALUE'],['EXAMPLE_1','2026-01-01T00:00:00Z',100]],
  surfaces:[['X(m)','Y(m)','Z(m)'],[481200,69280,1000]]
 };
 if(['spatial','models','seismic','documents'].includes(family)&&family!=='surfaces')return {
  name:family+'-format-guide.txt',type:'text/plain',text:{
   spatial:'Use GeoJSON with declared coordinates, or a complete georeferenced GIS export. Include the source CRS and all companion files.\n',
   models:'Export the complete model as RESQML EPC with its HDF5 companion, ECLIPSE, or GRDECL. Preserve grids, units and object references.\n',
   seismic:'Export SEG-Y with sample format, sample interval, coordinate scalars and source CRS. Preserve the trace and binary headers.\n',
   documents:'Upload the original PDF, DOCX, photograph or text file as supporting evidence. For numeric measurements, export a table with named columns and units.\n'
  }[family]};
 const roles=mappingRoles[family]||['well','depth','value'];
 const [columns,row]=layouts[family]||[roles.map(role=>role==='index'?'DEPTH(m)':role.toUpperCase()),roles.map(role=>role==='well'?'EXAMPLE_1':role==='sample'?'SAMPLE_1':1000)];
 return {name:family+'-example.csv',type:'text/csv',text:columns.join(',')+'\n'+row.join(',')+'\n'};
}
