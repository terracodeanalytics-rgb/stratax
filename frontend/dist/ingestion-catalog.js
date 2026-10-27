export const families=[
 ['logs','Well logs','Wells','LAS, DLIS, LIS and tabular curves','Log curves, acquisition runs and original measurements.'],
 ['well_headers','Well headers & locations','Wells','CSV, Excel, ASCII','Well identifiers, coordinates, elevations and datums.'],
 ['deviation','Deviation surveys','Wells','DEV, CSV, Excel, ASCII','MD / inclination / azimuth or supplied coordinates.'],
 ['tops','Tops & intervals','Wells','CSV, Excel, ASCII','Formation markers, faults, intervals and stratigraphy.'],
 ['checkshots','Checkshots & velocity','Wells','Tables, SEG-Y/VSP exports','Time-depth observations with explicit references.'],
 ['core','Core & SCAL','Wells','CSV, Excel, ASCII','Plug measurements, experimental conditions and intervals.'],
 ['pressure','Pressure tests','Wells','CSV, Excel, ASCII','Pressure observations, depth references and test conditions.'],
 ['fluids','Fluid samples','Wells','CSV, Excel, ASCII','Fluid properties and sampling conditions.'],
 ['geochemistry','Geochemistry','Wells','CSV, Excel, ASCII','Sample analyses and source references.'],
 ['production','Production & operational','Wells','Tables, WITSML/PRODML files','Time-series observations with well associations.'],
 ['arrays','Images, NMR & waveforms','Wells','DLIS, LIS, array tables','Multidimensional channels and acquisition metadata.'],
 ['seismic','Seismic surveys','Seismic','SEG-Y, SU, ZGY, SGZ','Survey headers, original geometry and sample previews.'],
 ['surfaces','Horizons, faults & surfaces','Spatial / models','XYZ, IRAP, ZMAP+, CPS-3, GOCAD','Interpretation geometry with explicit time/depth domain.'],
 ['spatial','Spatial layers','Spatial / models','GeoJSON, SHP, GPKG, KML, GeoTIFF','Georeferenced vector and raster evidence.'],
 ['models','Reservoir / model exchange','Spatial / models','RESQML, ECLIPSE, GRDECL','Inspect exported model objects, grids and properties.'],
 ['documents','Documents & photographs','Documents','PDF, DOCX, text, images','Supporting evidence; no OCR or digitization is implied.']
].map(([id,name,group,formats,description])=>({id,name,group,formats,description}));
export const formatCatalog=[
 {name:'LAS',versions:'1.2, 2.0, 3.0',server:'native',local:'native'},
 {name:'CSV / TSV / ASCII / fixed-width / Excel',versions:'Delimited and mapped columns; XLS/XLSX',server:'native',local:'native'},
 {name:'DLIS / LIS',versions:'RP66 v1 / LIS79; supported TIF wrappers',server:'native · 512 MiB materialized-frame budget',local:'conversion required'},
 {name:'SEG-Y / SU',versions:'SEG-Y 0/1 and supported 2.x layouts; explicit byte mapping',server:'native',local:'streamed headers / bounded samples'},
 {name:'ZGY / SGZ',versions:'Reader-compatible variants',server:'native',local:'conversion required'},
 {name:'VDS',versions:'Licensed reader not installed',server:'retain / export SEG-Y or ZGY',local:'conversion required'},
 {name:'IRAP / ZMAP+ / CPS-3 / GOCAD',versions:'Documented grid / vertex dialects; bounded materialization',server:'native',local:'mapped XYZ or Cloud project'},
 {name:'GeoJSON / KML / GeoTIFF / Shapefile / GeoPackage',versions:'Complete bundles; source CRS required',server:'native',local:'GeoJSON / image metadata; others convert'},
 {name:'RESQML EPC + HDF5 / ECLIPSE / GRDECL',versions:'Object/array or keyword inspection; no simulation',server:'native',local:'conversion required'},
 {name:'WITSML / PRODML files',versions:'Recognized XML objects; no live ETP',server:'native structural reader',local:'conversion required'},
 {name:'PDF / DOCX / photographs',versions:'Embedded text / metadata; no OCR',server:'native',local:'text / image metadata; others retain or convert'},
 {name:'Generic HDF5 / XML / JSON',versions:'Explicit dataset paths or recognized schema required',server:'mapped / schema-specific',local:'mapped JSON only'}
];
export const mappingRoles={
 logs:['index'],well_headers:['well','latitude','longitude','x','y','elevation'],deviation:['md','inclination','azimuth','x','y','z'],tops:['name','depth','base','well'],checkshots:['depth','time','well'],core:['depth','sample','well'],pressure:['depth','pressure','well'],fluids:['sample','well'],geochemistry:['depth','sample','well'],production:['date','well','value'],arrays:['index'],surfaces:['x','y','z'],spatial:[],models:[],documents:[],seismic:[]
};
export const labels={index:'Depth / time index',md:'Measured depth',inclination:'Inclination',azimuth:'Azimuth',well:'Well identifier',latitude:'Latitude',longitude:'Longitude',x:'X / easting',y:'Y / northing',z:'Z / vertical coordinate',elevation:'Reference elevation',depth:'Depth',base:'Interval base',name:'Marker / interval name',time:'Observed time',sample:'Sample identifier',pressure:'Pressure',date:'Date / time',value:'Observed value'};
export function visibleFamily(family,project){return family.group==='Documents'||family.id==='spatial'||family.id==='surfaces'||family.id==='models'||family.group==='Seismic'&&project.workflows?.includes('seismic')||family.group==='Wells'&&project.workflows?.includes('petrophysics');}
export const bytes=n=>n>=1024**3?(n/1024**3).toFixed(2)+' GiB':n>=1024**2?(n/1024**2).toFixed(1)+' MiB':n>=1024?(n/1024).toFixed(1)+' KiB':n+' B';
