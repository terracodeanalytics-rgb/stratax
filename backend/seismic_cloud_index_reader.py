"""Bounded reads from accepted immutable Cloud analytical partitions."""
import hashlib
import json
import re
import tempfile
from pathlib import Path

import numpy as np
from seismic_processing import require


def read_cloud_section(client,bucket_name,result,scope,first_trace,trace_count,first_sample,sample_count):
    import zarr
    from seismic_execution import Selection
    Selection(firstTrace=first_trace,traceCount=trace_count,firstSample=first_sample,sampleCount=sample_count)
    require(trace_count*sample_count<=2_000_000,'Select a bounded analytical section.')
    require(result.get('kind')=='stratax-cloud-analytical-index/1' and result.get('complete') is True,
            'Select a completed analytical index resource.')
    require(first_trace>=result['firstTrace'] and first_trace+trace_count<=result['firstTrace']+result['traceCount'],
            'This selection leaves the indexed trace support.')
    rows={};budget=0
    def fetch(reference,maximum):
        nonlocal budget
        path=reference['path']
        require(path.startswith(scope) and '..' not in path.split('/') and '\\' not in path,'Analytical object leaves this project.')
        blob=client.bucket(bucket_name).blob(path);blob.reload()
        require(blob.size<=maximum and budget+blob.size<=128*1024**2,'Select a smaller analytical section.')
        budget+=blob.size;raw=blob.download_as_bytes()
        require(hashlib.sha256(raw).hexdigest()==reference['sha256'],'Analytical object checksum changed.')
        return raw
    for part in result['partitions']:
        # The trace boundary is retained in the immutable partition object name.
        match=re.search(r'/analytical/([0-9]+)/partition\.json$',part['path'])
        require(match is not None,'Invalid analytical partition reference.')
        start=int(match[1]);width=result.get('tracesPerPartition',512)
        if start>=first_trace+trace_count or start+width<=first_trace:continue
        manifest=json.loads(fetch(part,2*1024**2));end=start+manifest['traceCount']
        if end<=first_trace:continue
        with tempfile.TemporaryDirectory() as directory:
            prefix=part['path'].removesuffix('partition.json')
            for reference in manifest['objects']:
                require(reference['path'].startswith(prefix),'Partition object leaves its immutable version.')
                relative=reference['path'][len(prefix):]
                require(relative and not relative.startswith('/') and '..' not in relative.split('/'),'Invalid partition member.')
                target=Path(directory)/relative;target.parent.mkdir(parents=True,exist_ok=True)
                target.write_bytes(fetch(reference,32*1024**2))
            root=zarr.open_group(directory,mode='r',zarr_format=3)
            require(root.attrs.get('complete') is True,'Analytical partition is incomplete.')
            for trace in range(max(first_trace,start),min(first_trace+trace_count,end)):
                position=trace-start;offset=int(root['offsets'][position]);limit=int(root['offsets'][position+1])
                available=max(0,min(sample_count,limit-offset-first_sample))
                data=np.asarray(root['samples'][offset+first_sample:offset+first_sample+available]) if available else np.asarray([])
                dt=float(root['intervals'][position]);origin=float(root['origins'][position])+first_sample*dt
                rows[trace]=dict(traceId=trace,samples=np.where(np.isfinite(data),data,None).tolist(),
                    sampleInterval=dt,sampleStart=origin,firstSample=first_sample,originalSampleCount=limit-offset)
    require(len(rows)==trace_count,'The analytical selection has missing partitions.')
    return dict(traces=[rows[i] for i in range(first_trace,first_trace+trace_count)],
                sourceVersion=result['sourceVersion'],analytical=True,displayOnly=False,axisUnit='s',
                adapter='cloud-sharded-ragged-zarr/v1')
