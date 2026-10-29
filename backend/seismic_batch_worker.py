"""Bounded analytical Batch execution with immutable checkpoints and atomic result manifests."""
import gzip
import hashlib
import io
import json
import logging
import os
import re
import tempfile
import time
import uuid
import zipfile
from pathlib import Path

import numpy as np
from google.cloud import firestore, storage

from scientific_api import firestore_value, restore_value, now
from seismic_graph import execute_graph
from seismic_processing import TraceBlock, require, SeismicError
from seismic_reader import read_section, read_preview, SectionError
from seismic_indexed_reader import read_traces,aligned_section
from seismic_runs_api import settle
from seismic_store import create_store, write_block, build_display_levels

logger = logging.getLogger('stratax-seismic')


def usage(started, cpu_started):
    try:
        import resource
        peak = int(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)*1024
    except ImportError:
        peak = None
    return dict(workerWallSeconds=time.monotonic()-started, processCpuSeconds=time.process_time()-cpu_started,
                peakRssBytes=peak, billingConfirmed=False)


def pack_checkpoint(state):
    arrays, metadata = {}, {}
    for i, (key, block) in enumerate(state['values'].items()):
        arrays[f'samples{i}'], arrays[f'mask{i}'] = block.samples, block.mask
        metadata[key] = dict(index=i, dt=block.dt, start=block.start, domain=block.domain, history=block.history)
    meta = dict(schemaVersion=1, fingerprint=state['fingerprint'], completed=state['completed'], blocks=metadata)
    arrays['_metadata'] = np.frombuffer(json.dumps(meta, allow_nan=False).encode(), dtype=np.uint8)
    buffer = io.BytesIO()
    np.savez_compressed(buffer, **arrays)
    return buffer.getvalue()


def unpack_checkpoint(payload, maximum_bytes):
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        require(sum(f.file_size for f in archive.infolist()) <= maximum_bytes, 'Checkpoint exceeds its approved memory budget.')
    with np.load(io.BytesIO(payload), allow_pickle=False) as arrays:
        meta = json.loads(arrays['_metadata'].tobytes())
        require(meta.get('schemaVersion') == 1, 'Unsupported checkpoint schema.')
        values = {}
        for key, b in meta['blocks'].items():
            i = b['index']
            values[key] = TraceBlock(arrays[f'samples{i}'], b['dt'], b['start'], b['domain'], arrays[f'mask{i}'], b['history'])
    return dict(fingerprint=meta['fingerprint'], completed=meta['completed'], values=values)


def main():
    path = os.environ.get('STRATAX_SEISMIC_RUN', '')
    require(re.fullmatch(r'stratax_projects/([A-Za-z0-9_-]{1,128})/records/([A-Za-z0-9_-]{1,100})/seismicRuns/(sx-[a-f0-9]{32})', path), 'Invalid seismic run identity.')
    _, uid, _, pid, _, rid = path.split('/')
    db = firestore.Client()
    project_ref, run_ref = db.document('/'.join(path.split('/')[:4])), db.document(path)
    @firestore.transactional
    def claim(tx):
        value = restore_value(run_ref.get(transaction=tx).to_dict())
        require(value is not None, 'This run is absent.')
        if value.get('settled') or value.get('workerClaim'):
            return None
        value['workerClaim'] = uuid.uuid4().hex
        tx.set(run_ref, firestore_value(value))
        return value
    run = claim(db.transaction())
    if run is None:
        logger.info('Run %s already has a worker claim or is settled', rid)
        return
    quota = run['reservation']
    cloud = storage.Client()
    bucket = cloud.bucket(run['input']['outputBucket'])
    prefix = f'owners/{uid}/projects/{pid}/seismic/runs/{rid}/'
    actual = 0
    started = time.monotonic()
    cpu_started = time.process_time()

    def cancelled():
        current = restore_value(run_ref.get().to_dict())
        return not current or current.get('cancelRequested') or current.get('settled')

    def put(name, data, content_type):
        nonlocal actual
        require(not cancelled(), 'Seismic processing cancelled.')
        require(actual+len(data) <= quota, 'Artifacts exceeded the approved reservation; no larger allocation was made.')
        blob = bucket.blob(prefix+name)
        blob.upload_from_string(data, content_type=content_type, if_generation_match=0)
        actual += len(data)
        return dict(path=prefix+name, sha256=hashlib.sha256(data).hexdigest(), bytes=len(data))

    try:
        require(not cancelled(), 'Seismic processing cancelled before execution.')
        run_ref.update(dict(status='running', startedAt=now()))
        original = run['input']['original']
        raw_source = original['object'].startswith(f'owners/{uid}/projects/{pid}/originals/')
        derived_source = re.fullmatch(re.escape(f'owners/{uid}/projects/{pid}/seismic/runs/')+r'sx-[a-f0-9]{32}/manifest\.json', original['object'])
        require((raw_source or derived_source) and original.get('generation') is not None,
                'The original object must retain its reviewed generation and project scope.')
        blob = cloud.bucket(original['bucket']).blob(original['object'], generation=original['generation'])
        s = run['selection']
        bounds = dict(first_trace=s['firstTrace'], trace_count=s['traceCount'], first_sample=s['firstSample'], sample_count=s['sampleCount'])
        if original['kind'] == 'trace-preview':
            require(derived_source and original['size'] <= 2*1024**2, 'Invalid calculated-source manifest.')
            encoded = blob.download_as_bytes()
            require(hashlib.sha256(encoded).hexdigest() == original['sha256'], 'Calculated source manifest changed checksum.')
            manifest = json.loads(encoded)
            def load(path):
                require(re.fullmatch(re.escape(original['object'].removesuffix('manifest.json'))+r'preview/[0-9]+\.json\.gz', path), 'Calculated source chunk leaves its run scope.')
                chunk = cloud.bucket(original['bucket']).blob(path)
                chunk.reload()
                require(chunk.size <= 2*1024**2, 'Calculated source chunk exceeds its budget.')
                return chunk.download_as_bytes()
            data = read_preview(manifest, load, **bounds)
        else:
            require(raw_source, 'Invalid original source identity.')
            with blob.open('rb', chunk_size=256*1024) as stream:
                indexed=original.get('indexManifest')
                if indexed:
                    require(indexed['bucket']==run['input']['outputBucket'] and indexed.get('generation') is not None and re.fullmatch(re.escape(f'owners/{uid}/projects/{pid}/imports/')+r'[A-Za-z0-9_/-]+/dataset-[a-f0-9]{20}\.json',indexed['object']), 'Invalid retained trace-index scope or generation.')
                    source_bucket=cloud.bucket(indexed['bucket'])
                    metadata=source_bucket.blob(indexed['object'],generation=indexed['generation']);metadata.reload()
                    require(metadata.size<=2*1024**2,'The retained trace-index manifest exceeds its read budget.')
                    encoded=metadata.download_as_bytes()
                    require(hashlib.sha256(encoded).hexdigest()==indexed['sha256'],'The retained trace index changed checksum.')
                    manifest=json.loads(encoded)
                    def load_index(name):
                        chunk=source_bucket.blob(indexed['object'].rsplit('/',1)[0]+'/'+name);chunk.reload()
                        require(chunk.size<=5*1024**2,'The retained trace chunk exceeds its read budget.')
                        return chunk.download_as_bytes()
                    rows=read_traces(stream,original['size'],manifest,load_index,indexed['sourceVersion'],range(s['firstTrace'],s['firstTrace']+s['traceCount']),first_sample=s['firstSample'],sample_count=s['sampleCount'],endian=original['endian'])
                    data=aligned_section(rows,**bounds)
                else:
                    data = read_section(stream, original['size'], kind=original['kind'], endian=original['endian'], header_bytes=original['headerBytes'], **bounds)
        require(all(abs(t-data['sampleStart']) < data['sampleInterval']*1e-9 for t in data['sampleStarts']), 'Explicitly align differing trace time origins before this preview.')
        block = TraceBlock(data['samples'], data['sampleInterval'], data['sampleStart'], run['input']['graph']['domain'], history=data.get('history', []))
        resumed = None
        restart = run.get('restartCheckpoint')
        if restart:
            require(re.fullmatch(re.escape(f'owners/{uid}/projects/{pid}/seismic/runs/')+r'sx-[a-f0-9]{32}/checkpoints/[0-9]+\.npz', restart['path']), 'Checkpoint leaves this project.')
            previous = bucket.blob(restart['path'])
            previous.reload()
            require(previous.size <= quota, 'Checkpoint exceeds the approved storage budget.')
            payload = previous.download_as_bytes()
            require(hashlib.sha256(payload).hexdigest() == restart['sha256'], 'Checkpoint checksum changed.')
            resumed = unpack_checkpoint(payload, run['estimate']['estimatedPeakMemoryBytes'])

        def checkpoint(value):
            reference = put(f'checkpoints/{value["completed"]}.npz', pack_checkpoint(value), 'application/octet-stream')
            run_ref.update(dict(checkpoint=reference | dict(completed=value['completed']), artifactBytes=actual))

        output, graph_hash = execute_graph(run['input']['graph'], block, cancelled=cancelled,
                                          progress=lambda p:run_ref.update(dict(progress=p)), checkpoint=checkpoint, resumed=resumed)
        require(not cancelled(), 'Seismic processing cancelled before result commit.')
        chunks = []
        for first in range(0, len(output.samples), 16):
            rows = np.where(output.mask[first:first+16], output.samples[first:first+16], None).tolist()
            payload = gzip.compress(json.dumps(rows, allow_nan=False, separators=(',', ':')).encode())
            chunks.append(put(f'preview/{first}.json.gz', payload, 'application/gzip') | dict(firstTrace=first, traceCount=len(rows)))
        with tempfile.TemporaryDirectory(prefix='stratax-seismic-') as tmp:
            root_path = Path(tmp)/'analytical.zarr'
            root = create_store(root_path, len(output.samples), output.samples.shape[1], output.dt, output.start, domain=output.domain)
            for first in range(0, len(output.samples), 32):
                write_block(root, first, 0, output.samples[first:first+32])
            build_display_levels(root, cancelled=cancelled)
            root.attrs['complete'] = True
            for file in sorted(root_path.rglob('*')):
                if file.is_file():
                    put('analytical.zarr/'+file.relative_to(root_path).as_posix(), file.read_bytes(), 'application/octet-stream')
        manifest = dict(schemaVersion=1, format='seismic-trace-preview/v1', runId=rid, graphFingerprint=graph_hash,
                        sourceId=run['input']['datasetId'], sourceVersion=run['input']['datasetVersion'],
                        traceCount=len(output.samples), samplesPerTrace=output.samples.shape[1], sampleInterval=output.dt,
                        sampleStart=output.start, domain=output.domain, amplitudeUnit=run['input']['graph']['amplitudeUnit'],
                        history=output.history, sourceSelection=s, traceHeaders=[h | dict(originalTrace=h.get('originalTrace', h['trace']), sourceTrace=h['trace'], trace=i) for i,h in enumerate(data['traceHeaders'])],
                        chunks=chunks, analyticalStore=prefix+'analytical.zarr/', complete=True)
        reference = put('manifest.json', json.dumps(manifest, allow_nan=False).encode(), 'application/json')
        settle(db, project_ref, run_ref, 'completed', actual, dict(outputManifest=reference) | usage(started, cpu_started))
    except Exception as error:
        logger.exception('Seismic run %s stopped', rid)
        message = str(error) if isinstance(error, (SeismicError, SectionError)) else 'The seismic worker stopped. Review its input/algorithm diagnostics; parameters were not changed automatically.'
        settle(db, project_ref, run_ref, 'failed', actual, dict(error=message) | usage(started, cpu_started))
        raise


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()
