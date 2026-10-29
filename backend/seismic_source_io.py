"""Generation-pinned project inputs for workers; paths never come from client URLs."""
import hashlib
import json
import re

import numpy as np

from seismic_processing import require


def checked_json(client, reference, maximum=2*1024**2):
    blob = client.bucket(reference['bucket']).blob(reference['object'], generation=reference['generation'])
    blob.reload()
    require(blob.size <= maximum, 'Source metadata exceeds its read budget.')
    raw = blob.download_as_bytes()
    if reference.get('sha256'):
        require(hashlib.sha256(raw).hexdigest() == reference['sha256'], 'Source metadata checksum changed.')
    return json.loads(raw)


def indexed_source(client, identity):
    index = identity.get('indexManifest')
    require(index and index.get('generation'), 'This source requires a completed retained trace index.')
    manifest = checked_json(client, index)
    bucket = client.bucket(index['bucket'])
    prefix = index['object'].rsplit('/', 1)[0]+'/'
    def load(name):
        require(re.fullmatch(r'dataset-[a-f0-9]{20}-[0-9]{6,}\.ndjson\.gz', name), 'Invalid trace chunk reference.')
        blob = bucket.blob(prefix+name); blob.reload()
        require(blob.size <= 5*1024**2, 'Trace index chunk exceeds its read budget.')
        return blob.download_as_bytes()
    return manifest, load


def section_input(client, identity, selection):
    bounds = dict(first_trace=selection['firstTrace'], trace_count=selection['traceCount'],
                  first_sample=selection['firstSample'], sample_count=selection['sampleCount'])
    from seismic_execution import Selection
    Selection(**selection)
    blob = client.bucket(identity['bucket']).blob(identity['object'], generation=identity['generation'])
    if identity['kind'] == 'trace-preview':
        from seismic_reader import read_preview
        manifest = checked_json(client, identity)
        prefix = identity['object'].removesuffix('manifest.json')
        def load(path):
            require(re.fullmatch(re.escape(prefix)+r'preview/[0-9]+\.json\.gz', path), 'Derived chunk scope mismatch.')
            chunk = client.bucket(identity['bucket']).blob(path); chunk.reload()
            require(chunk.size <= 2*1024**2, 'Derived chunk exceeds its read budget.')
            return chunk.download_as_bytes()
        return read_preview(manifest, load, **bounds)
    with blob.open('rb', chunk_size=256*1024) as stream:
        if identity.get('indexManifest'):
            from seismic_indexed_reader import read_traces, aligned_section
            manifest, load = indexed_source(client, identity)
            rows = read_traces(stream, identity['size'], manifest, load, identity['indexManifest']['sourceVersion'],
                range(bounds['first_trace'], bounds['first_trace']+bounds['trace_count']),
                first_sample=bounds['first_sample'], sample_count=bounds['sample_count'], endian=identity['endian'])
            return aligned_section(rows, **bounds)
        from seismic_reader import read_section
        return read_section(stream, identity['size'], kind=identity['kind'], endian=identity['endian'],
                            header_bytes=identity['headerBytes'], **bounds)


def resolve_inputs(parameters, bindings, client, *, cancelled=lambda: False, maximum_cells=2_000_000):
    """Resolve reviewed bindings to tool arguments, including nested acoustic inputs."""
    from seismic_engine_runner import unpack_result
    result = dict(parameters)
    consumed = 0
    recording_axis=None
    def sampling(data,target):
        nonlocal recording_axis
        if '.' in target or target not in ('samples','seismic','baseline','monitor','amplitudes','volume'):return
        axis=(float(data['sampleInterval']),float(data['sampleStart']))
        if recording_axis is not None:
            require(np.allclose(recording_axis,axis,rtol=1e-10,atol=1e-12),
                    'Bound observations have different sampling/origins. Review an explicit alignment operation first.')
        if 'dt' in result:require(np.isclose(result['dt'],axis[0],rtol=1e-10,atol=1e-12),'Requested dt differs from the bound analytical source.')
        if 'start' in result:require(np.isclose(result['start'],axis[1],rtol=0,atol=1e-12),'Requested start differs from the bound analytical source.')
        recording_axis=axis;result.update(dt=axis[0],start=axis[1])
    for target, binding in bindings.items():
        require(not cancelled(), 'Input loading cancelled.')
        path = target.split('.')
        require(1 <= len(path) <= 6 and all(re.fullmatch(r'[A-Za-z][A-Za-z0-9_]*', part) for part in path),
                'Use explicit argument names for source bindings.')
        if binding['kind'] == 'section':
            data = section_input(client, binding['identity'], binding['selection'])
            value = np.asarray(data['samples'], float)
            sampling(data,target)
            if len(path)==1 and target in ('samples','volume','amplitudes'):
                result.setdefault('history',data.get('history',[]))
        elif binding['kind'] == 'brick':
            from seismic_brick import BrickRequest, read_brick
            identity = binding['identity']; manifest, load = indexed_source(client, identity)
            blob = client.bucket(identity['bucket']).blob(identity['object'], generation=identity['generation'])
            with blob.open('rb', chunk_size=256*1024) as stream:
                data = read_brick(stream, identity['size'], manifest, load, identity['indexManifest']['sourceVersion'],
                                  binding['geometry'], BrickRequest(**binding['brick']))
            ni, nj, nk = data['shape']
            value = np.asarray(data['samples'], float).reshape(nk, nj, ni).transpose(2, 1, 0)
            sampling(data,target)
        elif binding['kind'] in ('resource','indexed-section'):
            artifact = binding['artifact']
            blob = client.bucket(binding['bucket']).blob(artifact['path']); blob.reload()
            require(blob.size <= 64*1024**2, 'Select a bounded result resource.')
            raw = blob.download_as_bytes()
            require(hashlib.sha256(raw).hexdigest() == artifact['sha256'], 'Accepted result checksum changed.')
            value = unpack_result(raw)
            if binding['kind']=='indexed-section':
                from seismic_cloud_index_reader import read_cloud_section
                selection=binding['selection']
                data=read_cloud_section(client,binding['bucket'],value['result'],binding['scope'],
                    selection['firstTrace'],selection['traceCount'],selection['firstSample'],selection['sampleCount'])
                traces=data['traces'];dt=traces[0]['sampleInterval'];start=traces[0]['sampleStart']
                require(all(len(t['samples'])==selection['sampleCount'] and abs(t['sampleInterval']-dt)<1e-12
                            and abs(t['sampleStart']-start)<1e-12 for t in traces),
                        'Align variable trace origins/lengths explicitly before rectangular processing.')
                value=np.asarray([t['samples'] for t in traces],float)
                sampling(dict(sampleInterval=dt,sampleStart=start),target)
            else:
                for key in binding['field'].split('.'):
                    require(isinstance(value, dict) and key in value, 'The selected result field is unavailable.')
                    value = value[key]
            if isinstance(value, dict) and set(('shape', 'values')) <= set(value):
                value = np.asarray(value['values'], float).reshape(value['shape'])
        else:
            raise ValueError('Unsupported source binding kind.')
        if isinstance(value, (list, np.ndarray)):
            value = np.asarray(value)
            consumed += value.size
            require(consumed <= maximum_cells, 'Resolved source inputs exceed the admitted cell budget.')
            value = value.tolist()
        destination = result
        for key in path[:-1]:
            require(key not in destination or isinstance(destination[key], dict), 'Input target is not an object.')
            destination = destination.setdefault(key, {})
        require(path[-1] not in destination, 'A source binding cannot overwrite a supplied argument.')
        destination[path[-1]] = value
    return result
