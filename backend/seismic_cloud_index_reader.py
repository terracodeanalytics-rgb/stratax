"""Bounded, verified range reads from immutable private analytical partitions."""
import json
import re

import numpy as np
from seismic_processing import require
from seismic_artifact_ranges import ArtifactReader, analytical_store


def partition_references(reader, result, first_trace, trace_count):
    end = first_trace+trace_count
    if result.get('kind') == 'stratax-cloud-analytical-index/1':
        for reference in result['partitions']:
            match = re.search(r'/analytical/([0-9]+)/partition\.json$', reference['path'])
            require(match is not None, 'Invalid analytical partition reference.')
            start = int(match[1])
            if start < end and start+result.get('tracesPerPartition',512) > first_trace:
                yield reference
        return
    require(result.get('kind') == 'stratax-cloud-analytical-index/2', 'Unsupported analytical index version.')
    seen = set()
    def walk(reference, depth):
        require(depth <= 8 and reference['path'] not in seen, 'Invalid analytical directory topology.')
        seen.add(reference['path'])
        node = json.loads(reader.read(reference))
        require(node.get('kind') == 'stratax-analytical-directory/1' and len(node['entries']) <= 256,
                'Invalid analytical directory page.')
        for entry in node['entries']:
            if entry['firstTrace'] < end and entry['firstTrace']+entry['traceCount'] > first_trace:
                if node['leaf']:
                    yield entry['reference']
                else:
                    yield from walk(entry['reference'], depth+1)
    yield from walk(result['partitionTree'],0)


def read_cloud_section(client,bucket_name,result,scope,first_trace,trace_count,first_sample,sample_count,*,reader=None):
    import zarr
    from seismic_execution import Selection
    Selection(firstTrace=first_trace,traceCount=trace_count,firstSample=first_sample,sampleCount=sample_count)
    require(trace_count*sample_count <= 2_000_000, 'Select a bounded analytical section.')
    require(result.get('complete') is True, 'Select a completed analytical index resource.')
    require(first_trace >= result['firstTrace'] and first_trace+trace_count <= result['firstTrace']+result['traceCount'],
            'This selection leaves the indexed trace support.')
    reader = reader or ArtifactReader(client,bucket_name,scope)
    rows = {}
    for reference in partition_references(reader,result,first_trace,trace_count):
        manifest = json.loads(reader.read(reference))
        start, count = manifest['firstTrace'], manifest['traceCount']
        require(type(start) is int and type(count) is int and 0 < count <= 512,
                'Invalid analytical partition bounds.')
        prefix = reference['path'].removesuffix('partition.json')
        store = analytical_store(reader,manifest['objects'],prefix)
        root = zarr.open_group(store=store,mode='r',zarr_format=3)
        require(root.attrs.get('complete') is True and root.attrs.get('sourceVersion') == result['sourceVersion'],
                'Analytical partition is incomplete or belongs to another source.')
        headers_ref = next((r for r in manifest['objects'] if r['path'] == prefix+'headers.json'),None)
        headers = json.loads(reader.read(headers_ref)) if headers_ref else None
        for trace in range(max(first_trace,start),min(first_trace+trace_count,start+count)):
            require(trace not in rows, 'Duplicate analytical partitions overlap this selection.')
            position = trace-start
            offset, limit = int(root['offsets'][position]), int(root['offsets'][position+1])
            available = max(0,min(sample_count,limit-offset-first_sample))
            a,b = offset+first_sample,offset+first_sample+available
            data = np.asarray(root['samples'][a:b]) if available else np.empty(0)
            valid = np.asarray(root['valid'][a:b],bool) if available else np.empty(0,bool)
            valid = valid & np.isfinite(data)
            data = np.where(valid,data,np.nan)
            dt = float(root['intervals'][position])
            origin = float(root['origins'][position])+first_sample*dt
            rows[trace] = dict(traceId=trace,samples=np.where(np.isfinite(data),data,None).tolist(),
                validity=valid.tolist(),sampleInterval=dt,sampleStart=origin,firstSample=first_sample,
                originalSampleCount=limit-offset,geometry=headers[position].get('geometry',{}) if headers else {})
    require(len(rows) == trace_count, 'The analytical selection has missing partitions.')
    return dict(traces=[rows[i] for i in range(first_trace,first_trace+trace_count)],
        sourceVersion=result['sourceVersion'],analytical=True,displayOnly=False,axisUnit='s',
        adapter='cloud-sharded-ragged-zarr/range-v2',downloadedBytes=reader.downloaded)


def read_cloud_traces(client,bucket,result,scope,trace_ids,first_sample,sample_count,*,reader=None):
    require(isinstance(trace_ids,list) and 0<len(trace_ids)<=512 and len(set(trace_ids))==len(trace_ids)
            and all(type(trace) is int for trace in trace_ids) and len(trace_ids)*sample_count<=2_000_000,
            'Choose bounded, distinct analytical trace identities.')
    reader=reader or ArtifactReader(client,bucket,scope)
    groups=[]
    for trace in sorted(trace_ids):
        if groups and trace==groups[-1][-1]+1:groups[-1].append(trace)
        else:groups.append([trace])
    rows={}
    for group in groups:
        value=read_cloud_section(client,bucket,result,scope,group[0],len(group),first_sample,sample_count,reader=reader)
        rows.update({trace['traceId']:trace for trace in value['traces']})
    return [rows[trace] for trace in trace_ids]
