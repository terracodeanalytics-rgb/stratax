"""Native-format adapters; imports are lazy to keep the account API lightweight."""
import itertools
import json
import re
import struct
import zipfile
from pathlib import Path, PurePosixPath

from ingestion_core import ImportProblem, column, issue, number, output_dataset, scalar


def safe_members(path):
    archive = zipfile.ZipFile(path)
    total = 0
    for member in archive.infolist():
        name = PurePosixPath(member.filename.replace("\\", "/"))
        if name.is_absolute() or ".." in name.parts or ":" in str(name) or (member.external_attr >> 16) & 0o170000 == 0o120000:
            archive.close()
            raise ImportProblem("unsafe_archive", "This archive contains unsafe paths or links.")
        total += member.file_size
        if member.file_size > 10 * 1024**3 or total > 50 * 1024**3 or (member.file_size > 1024**2 and member.file_size / max(member.compress_size, 1) > 1000):
            archive.close()
            raise ImportProblem("archive_limits", "The archive exceeds safe expansion limits.")
    return archive


def xml_root(data):
    from defusedxml.ElementTree import fromstring
    if len(data) > 32 * 1024 * 1024:
        raise ImportProblem("xml_limit", "Split this XML document into smaller exchange objects before importing.")
    return fromstring(data)


def tag(element):
    return element.tag.rsplit("}", 1)[-1].lower()


def read_binary_logs(kind, path, output, options):
    from dlisio import dlis, lis
    datasets = []
    # dlisio materializes a frame. Bound this adapter explicitly rather than risking a worker OOM.
    if Path(path).stat().st_size > 512 * 1024 * 1024:
        raise ImportProblem("frame_memory_limit", "Export selected runs/frames smaller than 512 MiB for this DLIS/LIS reader. The original can still be retained.")
    if kind == "dlis":
        with dlis.load(str(path)) as logicals:
            for logical_index, logical in enumerate(logicals):
                for frame_index, frame in enumerate(logical.frames):
                    selection = options.get("frames", [])
                    key = f"{logical_index}:{frame_index}"
                    if selection and key not in selection:
                        continue
                    channels = list(frame.channels)
                    data = frame.curves(strict=False)
                    columns = [column(name, "", index) for index, name in enumerate(data.dtype.names)]
                    for c in columns:
                        channel = next((ch for ch in channels if str(ch.name) == c["mnemonic"].split(".")[0]), None)
                        if channel:
                            c.update(unit=str(channel.units or ""), dimensions=list(channel.dimension or []))
                    rows = ([row[name] for name in data.dtype.names] for row in data)
                    metadata = {"format": "DLIS/RP66 v1", "logicalFile": logical_index, "frame": str(frame.name), "frameKey": key, "index": str(frame.index), "channels": [{"name": str(ch.name), "unit": str(ch.units or ""), "dimensions": list(ch.dimension or [])} for ch in channels]}
                    datasets.append(output_dataset(output, f"{Path(path).name} / {frame.name}", columns, rows, metadata))
    else:
        with lis.load(str(path)) as logicals:
            for logical_index, logical in enumerate(logicals):
                for dfs_index, dfs in enumerate(logical.data_format_specs()):
                    data = lis.curves(logical, dfs, strict=False)
                    columns = [column(name, "", index) for index, name in enumerate(data.dtype.names)]
                    specs = list(dfs.specs)
                    for c in columns:
                        spec = next((s for s in specs if str(s.mnemonic).strip() == c["mnemonic"]), None)
                        if spec:
                            c["unit"] = str(spec.units).strip()
                    datasets.append(output_dataset(output, f"{Path(path).name} / logical {logical_index}, DFS {dfs_index}", columns, ([row[name] for name in data.dtype.names] for row in data), {"format": "LIS79", "logicalFile": logical_index, "dataFormat": dfs_index}))
    if not datasets:
        raise ImportProblem("empty_binary_log", "No selected readable frame or data-format specification was found.")
    return datasets


def read_seismic(kind, path, output, options):
    import numpy as np
    if kind in ('segy','su'):
        if kind=='segy':
            with open(path,'rb') as retained:retained.seek(3200);binary=retained.read(400)
            order=options.get('endian','big')
            if len(binary)==400 and (int.from_bytes(binary[300:302],order)>256 or int.from_bytes(binary[24:26],order) not in (1,2,3,5,6,8) or int.from_bytes(binary[304:306],order,signed=True)<0):
                return read_native_segy(path,output,options)
        from seismic_import_index import import_indexed_traces
        return import_indexed_traces(kind,path,output,options)
    if kind == "vds":
        raise ImportProblem("licensed_reader", "This VDS variant requires a licensed compatible reader. Export SEG-Y or ZGY; the original may be retained.")
    if kind == "zgy":
        from pyzgy.read import SeismicReader
        reader = SeismicReader(str(path))
    else:
        from seismic_zfp.read import SgzReader
        reader = SgzReader(str(path))
    with reader as source:
        ilines, xlines = list(map(int, source.ilines)), list(map(int, source.xlines))
        samples = getattr(source, "samples", getattr(source, "zslices", []))
        metadata = {"format": kind.upper(), "inlineCount": len(ilines), "crosslineCount": len(xlines), "sampleCount": len(samples), "ilines": ilines[:100], "xlines": xlines[:100], "samples": scalar(samples[:100])}
        def rows():
            for i in range(0, len(ilines), max(1, len(ilines)//8)):
                section = source.read_inline(i)
                yield [ilines[i], scalar(section[::max(1, section.shape[0]//64), ::max(1, section.shape[1]//128)])]
        return [output_dataset(output, Path(path).name, [column("Inline", index=0), column("Sample preview", index=1)], rows(), metadata, [issue("bounded_preview", "Only bounded section previews are materialized. Full samples remain in the original.")])]


def read_native_segy(path,output,options):
    """Retain existing segyio import for dialects not certified by the indexed decoder."""
    import segyio
    keys={'inline':189,'crossline':193,'x':181,'y':185,'scalar':71,'cdp':21}
    keys.update({k:int(v) for k,v in options.get('headerBytes',{}).items() if v is not None and str(v)!=''})
    if any(v<1 or v>237 for v in keys.values()):raise ImportProblem('header_bytes','Trace header byte positions must lie within the trace header.')
    with segyio.open(str(path),'r',strict=False,ignore_geometry=True,endian=options.get('endian','big')) as source:
        ns,nt=len(source.samples),source.tracecount
        metadata=dict(format='SEGY',traceCount=nt,sampleCount=ns,sampleAxis=list(map(float,source.samples[:100])),headerBytes=keys,
                      endian=options.get('endian','big'),geometry=options.get('geometry','unclassified'),domain=options.get('references',{}).get('domain',''),
                      originalGeometryPreserved=True,sampleFormat=int(source.bin[segyio.BinField.Format]),sampleInterval=int(source.bin[segyio.BinField.Interval]),textHeader=source.text[0].decode('ascii',errors='replace')[:3200])
        def rows():
            for i in range(nt):
                h=source.header[i];scale=h[keys['scalar']];factor=scale if scale>0 else 1/abs(scale) if scale<0 else 1
                samples=source.trace[i][::max(1,ns//256)] if i%max(1,nt//100)==0 else []
                yield [i,int(h[keys['inline']]),int(h[keys['crossline']]),int(h[keys['cdp']]),float(h[keys['x']])*factor,float(h[keys['y']])*factor,int(scale),scalar(samples)]
        columns=[column(n,'',i) for i,n in enumerate(['Trace','Inline','Crossline','CDP','X','Y','Coordinate scalar','Sample preview'])]
        return [output_dataset(output,Path(path).name,columns,rows(),metadata,[issue('native_trace_index_pending','Native SEG-Y import retained. This dialect needs a qualified trace-offset adapter before exact indexed section access; display samples are previews.')])]


def read_spatial(kind, path, output, options, companions):
    if kind == "geotiff":
        import rasterio
        from rasterio.enums import Resampling
        with rasterio.open(path) as source:
            metadata = {"format": "GeoTIFF", "width": source.width, "height": source.height, "bands": source.count, "crs": str(source.crs or ""), "transform": list(source.transform), "bounds": list(source.bounds), "nodata": source.nodata}
            arrays = source.read(out_shape=(source.count, min(source.height, 128), min(source.width, 128)), resampling=Resampling.nearest, masked=True).astype('float64')
            rows = ([i+1, scalar(arrays[i].filled(float('nan')).astype(float))] for i in range(source.count))
            return [output_dataset(output, Path(path).name, [column("Band", index=0), column("Raster preview", index=1)], rows, metadata)]
    if kind == "kml":
        if Path(path).suffix.lower() == ".kmz":
            with safe_members(path) as archive:
                names = [n for n in archive.namelist() if n.lower().endswith('.kml')]
                if not names:
                    raise ImportProblem("missing_kml", "The KMZ contains no KML document.")
                root = xml_root(archive.read(names[0]))
        else:
            root = xml_root(Path(path).read_bytes())
        rows = []
        for placemark in root.iter():
            if tag(placemark) == "placemark":
                name = next((e.text for e in placemark if tag(e) == "name"), "")
                coordinates = [e.text for e in placemark.iter() if tag(e) == "coordinates"]
                rows.append([name, coordinates])
        return [output_dataset(output, Path(path).name, [column("Name", index=0), column("Coordinate strings", index=1)], rows, {"format": "KML", "crs": "EPSG:4326", "externalLinksFollowed": False})]
    import fiona
    from fiona.model import to_dict
    if kind == "shapefile":
        for extension in (".shp", ".shx", ".dbf"):
            if not Path(path).with_suffix(extension).exists():
                raise ImportProblem("missing_companion", "Select the matching SHP, SHX and DBF files together; include PRJ to confirm the source CRS.")
    datasets = []
    for layer in fiona.listlayers(str(path)):
        with fiona.open(str(path), layer=layer) as source:
            metadata = {"format": kind, "layer": layer, "crs": str(source.crs or ""), "bounds": list(source.bounds), "schema": source.schema}
            rows = ([feature.id, to_dict(feature.geometry) if feature.geometry else None, dict(feature.properties)] for feature in source)
            datasets.append(output_dataset(output, f"{Path(path).name} / {layer}", [column(n, index=i) for i, n in enumerate(["Feature ID", "Geometry", "Properties"])], rows, metadata))
    return datasets


def read_surface(kind, path, output, options):
    if kind == "gocad":
        rows, topology = [], []
        with open(path, errors="replace") as source:
            for line in source:
                values = line.split()
                if not values:
                    continue
                if values[0] in ("VRTX", "PVRTX"):
                    rows.append([int(values[1]), float(values[2]), float(values[3]), float(values[4]), [number(v) for v in values[5:]]])
                elif values[0] in ("TRGL", "SEG", "ATOM"):
                    topology.append([values[0], *map(int, values[1:])])
                if len(rows) + len(topology) > 1000000:
                    raise ImportProblem("gocad_budget", "Split this GOCAD object into smaller exports for the current importer.")
        if not rows:
            raise ImportProblem("gocad_variant", "This GOCAD dialect has no readable vertices. Export a TSurf/PLine or mapped XYZ file.")
        datasets = [output_dataset(output, Path(path).name, [column(n, index=i) for i,n in enumerate(["ID", "X", "Y", "Z", "Properties"])], rows, {"format":"GOCAD"})]
        if topology:
            datasets += [output_dataset(output, Path(path).name + " topology", [column("Record type", index=0), column("Vertex references", index=1)], ([r[0],r[1:]] for r in topology), {"format":"GOCAD topology"})]
        return datasets
    if Path(path).suffix.lower() == ".cps":
        return read_cps(path, output)
    import xtgeo
    fmt = options.get("surfaceFormat") or "guess"
    try:
        surface = xtgeo.surface_from_file(str(path), fformat=fmt, values=False)
        surface.load_values()
    except (ValueError, NotImplementedError):
        if Path(path).stat().st_size > 128 * 1024 * 1024:
            raise ImportProblem('surface_budget','Export smaller surface tiles for this ASCII dialect.')
        surface = xtgeo.surface_from_file(str(path), fformat=fmt)
    # Inspect dimensions before allocating native arrays.
    if surface.ncol * surface.nrow > 10_000_000:
        raise ImportProblem("surface_budget", "This surface is too large for full materialization. Export tiled surfaces or XYZ chunks; the original remains retained.")
    metadata = {"format": "surface", "ncol": surface.ncol, "nrow": surface.nrow, "xori": surface.xori, "yori": surface.yori, "xinc": surface.xinc, "yinc": surface.yinc, "rotation": surface.rotation, "yflip": surface.yflip}
    rows = ([i,j,scalar(surface.values[i,j])] for i in range(surface.ncol) for j in range(surface.nrow))
    return [output_dataset(output, Path(path).name, [column(n,index=i) for i,n in enumerate(["I", "J", "Z"])], rows, metadata)]


def read_cps(path, output):
    # CPS-3 FSASCI is a grid-header dialect; arbitrary .cps text is never accepted by extension alone.
    if Path(path).stat().st_size > 64 * 1024 * 1024:
        raise ImportProblem("cps_budget", "Export this CPS surface as smaller tiles or mapped XYZ chunks.")
    text = Path(path).read_text(errors="replace")
    if not text.lstrip().upper().startswith("FSASCI"):
        raise ImportProblem("cps_dialect", "This CPS-3 dialect is not recognized. Export FSASCI grid or mapped XYZ.")
    lines = text.splitlines()
    header = {}
    data = []
    for line in lines[1:]:
        parts = line.split()
        if not parts:
            continue
        if parts[0].upper() in ("FSATTR", "FSLIMI", "FSNROW", "FSXINC", "FSYINC"):
            header[parts[0].upper()] = parts[1:]
        elif re.match(r"^[+\-\d.]", parts[0]):
            data.extend(number(v) for v in parts)
    if "FSNROW" not in header or not data:
        raise ImportProblem("cps_header", "The CPS grid dimensions or data are missing.")
    return [output_dataset(output, Path(path).name, [column("Sample",index=0),column("Value",index=1)], enumerate(data), {"format":"CPS-3 FSASCI","header":header})]


def read_hdf(path, output, options):
    import h5py
    paths = options.get("hdfPaths", [])
    if not paths:
        raise ImportProblem("hdf_mapping", "Choose the HDF5 dataset paths and scientific meaning before importing this generic container.")
    datasets=[]
    with h5py.File(path,"r") as source:
        for name in paths:
            parts = PurePosixPath(name).parts
            current = source
            for part in parts:
                if part == '/':
                    continue
                link = current.get(part, getlink=True)
                if isinstance(link, (h5py.ExternalLink, h5py.SoftLink)):
                    raise ImportProblem("external_hdf", "HDF5 symbolic/external references are not followed.")
                if part not in current:
                    raise ImportProblem("hdf_dataset", "A selected HDF5 dataset is missing.")
                current = current[part]
            if not isinstance(current,h5py.Dataset):
                raise ImportProblem("hdf_dataset", "A selected HDF5 dataset is missing.")
            obj=current
            if obj.is_virtual:
                raise ImportProblem("external_hdf", "External and virtual HDF5 references are not followed.")
            metadata={"format":"HDF5","path":name,"shape":list(obj.shape),"dtype":str(obj.dtype),"attributes":{k:scalar(v) for k,v in obj.attrs.items()}}
            if obj.ndim and obj.size/max(obj.shape[0],1)>100000:
                raise ImportProblem("hdf_slice", "Select a dataset with bounded slices or export smaller array chunks.")
            rows=([i,scalar(obj[i])] for i in range(obj.shape[0])) if obj.ndim else [[0,scalar(obj[()])]]
            datasets.append(output_dataset(output,Path(path).name+" / "+name,[column("Index",index=0),column("Value",index=1)],rows,metadata))
    return datasets


def read_models(kind,path,output,options,companions):
    if kind=="resqml":
        objects=[];hdf_paths={}
        with safe_members(path) as archive:
            for member in archive.infolist():
                if not member.filename.lower().endswith((".xml",".rels")):
                    continue
                root=xml_root(archive.read(member))
                for element in root.iter():
                    if tag(element)=="relationship" and element.attrib.get("TargetMode")=="External":
                        target=element.attrib.get("Target","")
                        pure=PurePosixPath(target.replace('\\','/'))
                        if pure.is_absolute() or '..' in pure.parts or ':' in target:
                            raise ImportProblem("external_reference", "This EPC references an unsafe external path.")
                        if pure.name not in companions:
                            raise ImportProblem("missing_hdf", "Select the EPC and all referenced HDF5 companion files together.")
                    if tag(element)=="pathinhdffile" and element.text:
                        hdf_paths[element.text]=True
                if 'uuid' in root.attrib and 'resqml' in root.tag.lower():
                    objects.append([root.attrib['uuid'],tag(root),next((e.text for e in root.iter() if tag(e)=='title'),''),member.filename])
        if not objects:
            raise ImportProblem("resqml_objects", "No documented RESQML objects were found in this EPC.")
        datasets=[output_dataset(output,Path(path).name,[column(n,index=i) for i,n in enumerate(['UUID','Object type','Title','XML source'])],objects,{"format":"RESQML EPC","hdfPaths":list(hdf_paths),"externalReferencesValidated":True})]
        for name,companion in companions.items():
            if name.lower().endswith(('.h5','.hdf5')) and hdf_paths:
                datasets.extend(read_hdf(companion,output,{"hdfPaths":list(hdf_paths)}))
        return datasets
    if kind=="grdecl":
        with open(path, errors='replace') as source:
            for line in source:
                if re.search(r'\bINCLUDE\b',line,re.I):
                    raise ImportProblem('deck_include','Export a self-contained GRDECL grid. INCLUDE paths are not followed by this reader.')
        import xtgeo
        grid=xtgeo.grid_from_file(str(path),fformat='grdecl')
        metadata={"format":"GRDECL","dimensions":list(grid.dimensions),"activeCells":int(grid.nactive)}
        return [output_dataset(output,Path(path).name,[column('I',index=0),column('J',index=1),column('K',index=2)],[],metadata)]
    return read_eclipse_records(path,output)


def read_eclipse_records(path,output):
    """Decode Fortran keyword records in bounded blocks, preserving all property values."""
    import numpy as np
    metadata={'format':'ECLIPSE binary','keywords':[],'originalArraysPreserved':True}
    with open(path,'rb') as source:
        first=source.read(4)
        endian='>' if first==struct.pack('>i',16) else '<' if first==struct.pack('<i',16) else None
        if not endian:raise ImportProblem('eclipse_header','This is not a supported ECLIPSE Fortran-record stream.')
        source.seek(0);occurrences={}
        def rows():
            while marker:=source.read(4):
                if len(marker)!=4 or struct.unpack(endian+'i',marker)[0]!=16:raise ImportProblem('eclipse_record','An ECLIPSE keyword header is malformed.')
                header=source.read(16)
                if len(header)!=16 or source.read(4)!=marker:raise ImportProblem('eclipse_record','An ECLIPSE keyword header is truncated.')
                keyword=header[:8].decode('ascii',errors='replace').strip();count=struct.unpack(endian+'i',header[8:12])[0];kind=header[12:16].decode('ascii')
                if count<0:raise ImportProblem('eclipse_count','An ECLIPSE array has an invalid item count.')
                types={'INTE':('i4',4),'REAL':('f4',4),'DOUB':('f8',8),'LOGI':('i4',4),'CHAR':('S8',8),'MESS':('S1',1)}
                if kind.startswith('C') and kind[1:].isdigit():dtype,length='S'+str(int(kind[1:])),int(kind[1:])
                elif kind in types:dtype,length=types[kind]
                else:raise ImportProblem('eclipse_type','This ECLIPSE keyword uses an unsupported array type.')
                occurrence=occurrences.get(keyword,0);occurrences[keyword]=occurrence+1
                if len(metadata['keywords'])<1000:metadata['keywords'].append({'name':keyword,'occurrence':occurrence,'count':count,'type':kind})
                consumed=0
                if not count:yield [keyword,occurrence,0,[]]
                while consumed<count:
                    marker=source.read(4)
                    if len(marker)!=4:raise ImportProblem('eclipse_data','An ECLIPSE property block is missing.')
                    byte_count=struct.unpack(endian+'i',marker)[0]
                    if byte_count<0 or byte_count>8*1024*1024 or not length or byte_count%length:raise ImportProblem('eclipse_block','An ECLIPSE property block exceeds the reader bounds.')
                    block=source.read(byte_count)
                    if len(block)!=byte_count or source.read(4)!=marker:raise ImportProblem('eclipse_data','An ECLIPSE property block is truncated.')
                    values=np.frombuffer(block,dtype=(endian+dtype if not dtype.startswith('S') else dtype))
                    if consumed+len(values)>count:raise ImportProblem('eclipse_count','ECLIPSE property values exceed the declared count.')
                    yield [keyword,occurrence,consumed,scalar(values)]
                    consumed+=len(values)
        return [output_dataset(output,Path(path).name,[column(n,index=i) for i,n in enumerate(['Keyword','Occurrence','Offset','Values'])],rows(),metadata)]


def read_documents(kind,path,output,options):
    if kind=='pdf':
        if Path(path).stat().st_size > 128 * 1024 * 1024:
            raise ImportProblem('pdf_budget','Export selected pages to a PDF smaller than 128 MiB; the complete original can be retained.')
        from pypdf import PdfReader
        book=PdfReader(path)
        if book.is_encrypted:
            raise ImportProblem('encrypted_pdf','Provide an unencrypted copy of this PDF.')
        rows=([i+1,page.extract_text() or ''] for i,page in enumerate(book.pages))
        return [output_dataset(output,Path(path).name,[column('Page',index=0),column('Embedded text',index=1)],rows,{"format":"PDF","ocrPerformed":False})]
    if kind=='docx':
        with safe_members(path) as archive:
            root=xml_root(archive.read('word/document.xml'))
        paragraphs=[''.join(e.itertext()) for e in root.iter() if tag(e)=='p']
        return [output_dataset(output,Path(path).name,[column('Paragraph',index=0),column('Text',index=1)],enumerate(paragraphs,1),{"format":"DOCX","externalLinksFollowed":False})]
    from PIL import Image
    with Image.open(path) as image:
        metadata={"format":image.format,"width":image.width,"height":image.height,"mode":image.mode,"frames":getattr(image,'n_frames',1),"ocrPerformed":False}
        return [output_dataset(output,Path(path).name,[column('Attribute',index=0),column('Value',index=1)],metadata.items(),metadata)]


def read_xml(path,output,options):
    if Path(path).stat().st_size > 32 * 1024 * 1024:
        raise ImportProblem('xml_limit','Split this XML into file-based objects smaller than 32 MiB.')
    root=xml_root(Path(path).read_bytes())
    namespace=root.tag.split('}')[0].lstrip('{')
    if not any(name in namespace.lower() for name in ('witsml','prodml','energistics')):
        raise ImportProblem('xml_schema','This XML has no recognized WITSML/PRODML namespace. Supply an explicit supported export.')
    datasets=[]
    for node in root.iter():
        if tag(node)=='log':
            mnemonics=next((e.text for e in node.iter() if tag(e)=='mnemoniclist'),None)
            units=next((e.text for e in node.iter() if tag(e)=='unitlist'),'') or ''
            if mnemonics:
                names=mnemonics.split(',');unit_values=units.split(',')
                columns=[column(n.strip(),unit_values[i].strip() if i<len(unit_values) else '',i) for i,n in enumerate(names)]
                rows=([number(v) for v in next(csv_reader((e.text or ''))) ] for e in node.iter() if tag(e)=='data')
                datasets.append(output_dataset(output,Path(path).name,columns,rows,{"format":"WITSML file","namespace":namespace}))
    if not datasets:
        records=[]
        for element in root.iter():
            if list(element) and all(not list(child) for child in element):
                records.append([tag(element),{tag(child):child.text for child in element}])
        if not records:
            raise ImportProblem('energyml_object','No supported file-based data objects were found. Live ETP connections are not supported.')
        datasets=[output_dataset(output,Path(path).name,[column('Object type',index=0),column('Fields',index=1)],records,{"format":"EnergyML file","namespace":namespace,"schemaValidation":"structural; references require review"})]
    return datasets


def csv_reader(text):
    import csv
    return csv.reader([text])


def read_native(kind,path,output,options,companions):
    if kind in ('dlis','lis'):
        return read_binary_logs(kind,path,output,options)
    if kind in ('segy','su','zgy','sgz','vds'):
        return read_seismic(kind,path,output,options)
    if kind in ('geojson','gpkg','shapefile','geotiff','kml'):
        return read_spatial(kind,path,output,options,companions)
    if kind in ('gocad','surface'):
        return read_surface(kind,path,output,options)
    if kind=='hdf5':
        return read_hdf(path,output,options)
    if kind in ('resqml','eclipse','grdecl'):
        return read_models(kind,path,output,options,companions)
    if kind in ('pdf','docx','image'):
        return read_documents(kind,path,output,options)
    if kind=='xml':
        return read_xml(path,output,options)
    raise ImportProblem('conversion_required','Select a documented exchange file or its complete companion bundle. This container needs explicit schema mapping or conversion.')
