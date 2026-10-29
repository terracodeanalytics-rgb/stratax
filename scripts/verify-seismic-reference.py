"""Local reference receipt; never submits compute jobs or changes user projects."""
import argparse
import hashlib
import json
import sys
import threading
import time
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'backend'))
from seismic_trace_index import index_traces,indexed_traces
from seismic_trace_store import index_trace_samples,trace_samples


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path)
    parser.add_argument('--write-analytical',action='store_true')
    args=parser.parse_args();source=args.source.resolve()
    start=time.monotonic();peak=[0];stop=threading.Event()
    import psutil
    process=psutil.Process()
    def sample_memory():
        while not stop.wait(.25):peak[0]=max(peak[0],process.memory_info().rss)
    monitor=threading.Thread(target=sample_memory,daemon=True);monitor.start()
    try:
        with source.open('rb') as stream:sha=hashlib.file_digest(stream,'sha256').hexdigest()
        with source.open('rb') as stream:
            summary=index_traces(stream,source.stat().st_size,source.with_suffix('.sqlite'),sha)
        report=dict(sourceBytes=source.stat().st_size,sha256=sha,summary=summary,
                    geometryReviewed=False,fieldProcessingQualified=False,capacityTargetQualified=False)
        if args.write_analytical:
            import numpy as np
            import zarr
            destination=source.with_suffix('.zarr')
            with source.open('rb') as stream:
                analytical=index_trace_samples(stream,source.with_suffix('.sqlite'),destination,sha,
                    progress=lambda p:print(json.dumps(p),flush=True) if p['traces']%10000<512 else None)
            root=zarr.open_group(str(destination),mode='r')
            ids=np.unique(np.linspace(0,summary['traceCount']-1,17,dtype=int)).tolist()
            with source.open('rb') as stream:reference=indexed_traces(stream,source.with_suffix('.sqlite'),sha,ids,sample_count=3000)
            selected=trace_samples(root,sha,ids,sample_count=3000)
            for expected,actual in zip(reference['traces'],selected['traces']):
                assert expected['traceId']==actual['traceId']
                assert expected['samples']==actual['samples']
                assert expected['sampleInterval']==actual['sampleInterval'] and expected['sampleStart']==actual['sampleStart']
            report['analytical']=dict(complete=analytical['complete'],samples=analytical['sampleCount'],
                analyticalBytes=sum(p.stat().st_size for p in destination.rglob('*') if p.is_file()),
                independentlyDecodedTraceIds=ids,referenceSampleCount=sum(len(t['samples']) for t in selected['traces']))
        report.update(wallSeconds=time.monotonic()-start,peakSampledRssBytes=peak[0],
                      memorySamplingSeconds=.25,memoryIncludesOSFileCache=False)
        source.with_suffix('.verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        print(json.dumps(report),flush=True)
    finally:stop.set();monitor.join()


if __name__=='__main__':main()
