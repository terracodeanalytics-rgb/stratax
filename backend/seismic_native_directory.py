"""Streaming SEG-Y/SU locators, persisted as bounded immutable directory pages."""
import json

from seismic_processing import require
from seismic_reader import _read, _integer
from seismic_trace_index import HEADERS, SHORT_HEADERS, SAMPLE_BYTES, layout
from seismic_field_artifacts import directory_tree, json_bytes, geometry_bounds


def native_directory(client,binding,put,*,load_chunk,save_chunk,cursor=None,
                     checkpoint=lambda value:None,cancelled=lambda:False):
    identity = binding['identity']
    require(identity['kind'] in ('segy','su'), 'This native field index supports the declared SEG-Y/SU adapters.')
    mapping = HEADERS | identity.get('indexHeaderBytes',identity.get('headerBytes',{}))
    require(set(mapping) == set(HEADERS) and all(type(v) is int and 1 <= v <= (239 if k in SHORT_HEADERS else 237)
            for k,v in mapping.items()), 'Invalid native header mapping.')
    retained = identity.get('indexManifest')
    if retained and (not cursor or cursor.get('readerMode') == 'retained-locators'):
        blob = client.bucket(retained['bucket']).blob(retained['object'],generation=retained['generation'])
        blob.reload()
        if blob.size <= 2*1024**2:
            from seismic_source_io import indexed_source
            from seismic_indexed_reader import select_locators
            manifest,load = indexed_source(client,identity)
            if HEADERS | manifest.get('metadata',{}).get('headerBytes',{}) == mapping:
                version = manifest['metadata']['traceIndex']['sourceVersion']
                require(manifest['rowCount'] == binding['traceCount'], 'Retained header count differs from admission.')
                expected = dict(sourceVersion=binding['sourceVersion'],readerMode='retained-locators',
                    headerBytes=mapping,layout=manifest['metadata']['traceIndex']['layout'])
                require(not cursor or all(cursor.get(key) == value for key,value in expected.items()),
                        'The retained native checkpoint changed its source/layout.')
                state = cursor or expected | dict(nextTrace=0,chunkCount=0)
                for first in range(state['nextTrace'],binding['traceCount'],512):
                    require(not cancelled(), 'Retained locator indexing cancelled.')
                    rows = select_locators(manifest,load,version,range(first,min(first+512,binding['traceCount'])))
                    reference = put(f'chunks/{state["chunkCount"]:09d}.json',json_bytes(dict(firstTrace=first,
                        traceCount=len(rows),rows=rows,sourceVersion=binding['sourceVersion'])))
                    state = expected | dict(nextTrace=first+len(rows),nextByte=rows[-1]['byteOffset']+240+
                        rows[-1]['sampleCount']*SAMPLE_BYTES[expected['layout']['format']],chunkCount=state['chunkCount']+1)
                    save_chunk(state['chunkCount']-1,dict(firstTrace=first,traceCount=len(rows),reference=reference,
                        headerBounds=geometry_bounds(rows)),state)
                    checkpoint(state)
                tree = directory_tree((load_chunk(i) for i in range(state['chunkCount'])),put)
                return dict(rowCount=binding['traceCount'],metadata=dict(headerBytes=mapping,traceIndex=dict(format='import-trace-locators/v1',
                    complete=True,sourceVersion=binding['sourceVersion'],sourceBytes=identity['size'],
                    layout=expected['layout'],locatorColumn=8,directory=tree)),
                    geometryReference='Unconfirmed; original scalars retained',sourceDomain='time-unconfirmed')
    source = client.bucket(identity['bucket']).blob(identity['object'],generation=identity['generation'])
    with source.open('rb',chunk_size=256*1024) as stream:
        physical = layout(stream,identity['size'],identity['kind'],identity['endian'])
        expected = dict(sourceVersion=binding['sourceVersion'],layout=physical,headerBytes=mapping)
        if cursor:
            require(all(cursor.get(k) == v for k,v in expected.items()), 'Native checkpoint belongs to another source/layout.')
        cursor = cursor or expected | dict(nextTrace=0,nextByte=physical['begin'],chunkCount=0)
        trace,offset = cursor['nextTrace'],cursor['nextByte']
        require(type(trace) is int and trace >= 0 and type(offset) is int and physical['begin'] <= offset <= identity['size'],
                'Invalid native checkpoint boundary.')
        rows = []
        def commit():
            nonlocal rows,cursor
            if not rows:
                return
            index = cursor['chunkCount']
            document = dict(firstTrace=rows[0]['trace'],traceCount=len(rows),rows=rows,
                            sourceVersion=binding['sourceVersion'])
            reference = put(f'chunks/{index:09d}.json',json_bytes(document))
            cursor = expected | dict(nextTrace=trace,nextByte=offset,chunkCount=index+1)
            save_chunk(index,dict(firstTrace=rows[0]['trace'],traceCount=len(rows),reference=reference,
                                  headerBounds=geometry_bounds(rows)),cursor)
            checkpoint(cursor)
            rows = []
        while offset < identity['size']:
            require(not cancelled(), 'Native header indexing cancelled at its last committed page.')
            require(offset+240 <= identity['size'], 'The retained native trace header is truncated.')
            header = _read(stream,offset,240)
            endian = identity['endian']
            ns = _integer(header,115,2,endian,False) or physical['ns']
            dt = _integer(header,117,2,endian,False) or physical['dt']
            require(ns > 0 and dt > 0, 'A native trace has no declared sample count/interval.')
            stop = offset+240+ns*SAMPLE_BYTES[physical['format']]
            require(stop <= identity['size'], 'A native trace leaves the immutable source bounds.')
            geometry = {key:_integer(header,byte,2 if key in SHORT_HEADERS else 4,endian,key != 'coordinateUnitsCode')
                        for key,byte in mapping.items()}
            scalar = geometry['coordinateScalar']
            factor = 1/abs(scalar) if scalar < 0 else scalar or 1
            for key in ('x','y','sourceX','sourceY','receiverX','receiverY'):
                geometry[key] *= factor
            rows.append(dict(trace=trace,byteOffset=offset,sampleCount=ns,sampleInterval=dt*1e-6,
                sampleStart=_integer(header,109,2,endian)*.001,geometry=geometry))
            trace += 1
            offset = stop
            if len(rows) == 512:
                commit()
        commit()
    require(trace == binding['traceCount'], 'Native trace count differs from the admitted source metadata.')
    tree = directory_tree((load_chunk(i) for i in range(cursor['chunkCount'])),put)
    return dict(rowCount=trace,metadata=dict(headerBytes=mapping,traceIndex=dict(format='import-trace-locators/v1',complete=True,
        sourceVersion=binding['sourceVersion'],sourceBytes=identity['size'],layout=physical,locatorColumn=8,
        directory=tree)),geometryReference='Unconfirmed; original scalars retained',sourceDomain='time-unconfirmed')


def directory_loader(client,index_reference,manifest):
    from seismic_artifact_ranges import ArtifactReader
    from seismic_cloud_index_reader import partition_references
    prefix = index_reference['object'].split('/seismic/runs/',1)[0]+'/seismic/runs/'
    require('/seismic/runs/' in index_reference['object'], 'Invalid native directory project scope.')
    reader = ArtifactReader(client,index_reference['bucket'],prefix)
    index = manifest['metadata']['traceIndex']
    def unsupported(name):
        raise ValueError('This native locator directory requires indexed trace lookup.')
    def locators(ids):
        found = {}
        wanted = set(ids)
        model = dict(kind='stratax-cloud-analytical-index/2',partitionTree=index['directory'])
        # Contiguous requested identities share one directory traversal/page read.
        ordered = sorted(wanted)
        groups = []
        for trace in ordered:
            if groups and trace == groups[-1][-1]+1:
                groups[-1].append(trace)
            else:
                groups.append([trace])
        visited = set()
        for group in groups:
            for ref in partition_references(reader,model,group[0],len(group)):
                if ref['path'] in visited:
                    continue
                visited.add(ref['path'])
                page = json.loads(reader.read(ref))
                require(page.get('sourceVersion') == index['sourceVersion'] and len(page['rows']) <= 512,
                        'Native locator page changed source or exceeded its bounds.')
                for row in page['rows']:
                    if row['trace'] in wanted:
                        require(row['trace'] not in found, 'A native directory contains duplicate trace identities.')
                        found[row['trace']] = row
        require(set(found) == wanted, 'The native directory has missing trace support.')
        return [found[trace] for trace in ids]
    unsupported.trace_locators = locators
    return unsupported


def query_headers(client,index_reference,filters,*,after_trace=0,limit=128,bin_pairs=None,reader=None):
    from seismic_source_io import checked_json
    from seismic_artifact_ranges import ArtifactReader
    require(isinstance(filters,dict) and set(filters) <= {'inline','crossline','cdp','shot'},
            'Choose native inline/crossline/CDP/shot header filters.')
    require(type(after_trace) is int and after_trace >= 0 and type(limit) is int and 1 <= limit <= 512,
            'Choose a bounded native header query.')
    for bounds in filters.values():
        require(isinstance(bounds,list) and len(bounds) == 2 and all(type(v) is int for v in bounds)
                and bounds[0] <= bounds[1], 'Header filters require inclusive integer bounds.')
    pairs=None
    if bin_pairs is not None:
        require(isinstance(bin_pairs,list) and 0<len(bin_pairs)<=512 and all(isinstance(pair,list) and len(pair)==2
                and all(type(value) is int for value in pair) for pair in bin_pairs), 'Choose up to 512 explicit bin pairs.')
        pairs={tuple(pair) for pair in bin_pairs}
    manifest = checked_json(client,index_reference) if reader is None else json.loads(reader.read(
        index_reference|dict(path=index_reference['object'])))
    index = manifest['metadata']['traceIndex']
    require(index.get('directory') and after_trace <= manifest['rowCount'], 'Select an indexed header directory and valid trace cursor.')
    prefix = index_reference['object'].split('/seismic/runs/',1)[0]+'/seismic/runs/'
    require('/seismic/runs/' in index_reference['object'], 'Invalid native header query scope.')
    reader = reader or ArtifactReader(client,index_reference['bucket'],prefix)
    rows = []
    def overlap(entry):
        if entry['firstTrace']+entry['traceCount'] <= after_trace:
            return False
        bounds = entry.get('headerBounds',{})
        if pairs and 'inline' in bounds and 'crossline' in bounds:
            if not any(bounds['inline'][0]<=i<=bounds['inline'][1] and bounds['crossline'][0]<=j<=bounds['crossline'][1]
                       for i,j in pairs):return False
        return all(key not in bounds or bounds[key][1] >= value[0] and bounds[key][0] <= value[1]
                   for key,value in filters.items())
    seen = set()
    def walk(reference,depth):
        require(depth <= 8 and reference['path'] not in seen, 'Invalid native header directory topology.')
        seen.add(reference['path'])
        node = json.loads(reader.read(reference))
        require(node.get('kind') == 'stratax-analytical-directory/1' and len(node['entries']) <= 256,
                'Invalid native header directory page.')
        for entry in node['entries']:
            if not overlap(entry):
                continue
            if node['leaf']:
                page = json.loads(reader.read(entry['reference']))
                require(page['sourceVersion'] == index['sourceVersion'] and len(page['rows']) <= 512,
                        'Native locator page belongs to another source.')
                for row in page['rows']:
                    geometry = row['geometry']
                    if (pairs is None or (geometry.get('inline'),geometry.get('crossline')) in pairs) and row['trace'] >= after_trace and all(key in geometry and value[0] <= geometry[key] <= value[1]
                                                           for key,value in filters.items()):
                        rows.append(row)
                        if len(rows) > limit:
                            return True
            elif walk(entry['reference'],depth+1):
                return True
        return False
    more = walk(index['directory'],0)
    visible = rows[:limit]
    return dict(rows=visible,nextTrace=visible[-1]['trace']+1 if more else None,
        sourceVersion=index['sourceVersion'],geometryReviewed=False,coordinateScalarsRetained=True,
        downloadedBytes=reader.downloaded)
