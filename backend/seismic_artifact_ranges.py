"""Read-only, checksummed GCS byte ranges for immutable analytical Zarr stores."""
import asyncio
import hashlib
import math
import threading
from collections import OrderedDict

from seismic_processing import require


RANGE_BYTES = 256 * 1024


def range_checksums(raw, block_bytes=RANGE_BYTES):
    return dict(blockBytes=block_bytes, hashes=[hashlib.sha256(raw[i:i+block_bytes]).hexdigest()
                                               for i in range(0, len(raw), block_bytes)])


class ArtifactReader:
    def __init__(self, client, bucket, scope, *, maximum_bytes=128*1024**2,
                 cache_bytes=16*1024**2, cancelled=lambda:False):
        require(isinstance(scope, str) and scope.startswith('owners/') and scope.endswith('/'),
                'Analytical reads require an admitted private owner/project scope.')
        require(type(maximum_bytes) is int and maximum_bytes > 0 and type(cache_bytes) is int
                and 0 <= cache_bytes <= maximum_bytes, 'Invalid analytical read/cache budget.')
        self.client, self.bucket, self.scope = client, bucket, scope
        self.maximum, self.cache_limit, self.cancelled = maximum_bytes, cache_bytes, cancelled
        self.downloaded = self.cached = 0
        self.cache = OrderedDict()
        self.lock = threading.RLock()

    def check(self, reference):
        path = reference.get('path', '')
        require(path.startswith(self.scope) and not any(p in ('', '.', '..') for p in path.split('/'))
                and '\\' not in path, 'Analytical object leaves its admitted project.')
        require(isinstance(reference.get('sha256'), str) and len(reference['sha256']) == 64,
                'An immutable artifact checksum is required.')
        return path

    def _fetch(self, reference, start, stop, expected, *, full=False):
        path = self.check(reference)
        key = (path, reference.get('generation'), reference['sha256'], start, stop)
        with self.lock:
            require(not self.cancelled(), 'Analytical read cancelled.')
            if key in self.cache:
                self.cache.move_to_end(key)
                return self.cache[key]
            size = stop-start
            require(size >= 0 and self.downloaded+size <= self.maximum,
                    'Select a smaller analytical range; the download allowance is exhausted.')
            blob = self.client.bucket(self.bucket).blob(path, generation=reference.get('generation'))
            if not reference.get('generation'):
                blob.reload()
                require(blob.size == reference.get('bytes', blob.size), 'Analytical object size changed.')
                generation = blob.generation
            else:
                generation = reference['generation']
            if size:
                self.downloaded += size
                raw = blob.download_as_bytes(start=None if full else start,
                    end=None if full else stop-1, if_generation_match=int(generation))
            else:
                raw = b''
            require(len(raw) == size and hashlib.sha256(raw).hexdigest() == expected,
                    'Analytical range length or checksum changed.')
            if size <= self.cache_limit:
                while self.cached+size > self.cache_limit and self.cache:
                    _, removed = self.cache.popitem(last=False)
                    self.cached -= len(removed)
                self.cache[key] = raw
                self.cached += size
            return raw

    def read(self, reference, start=0, stop=None):
        self.check(reference)
        size = reference.get('bytes')
        if size is None:
            blob = self.client.bucket(self.bucket).blob(reference['path'], generation=reference.get('generation'))
            blob.reload()
            reference = reference | dict(bytes=blob.size, generation=str(blob.generation))
            size = blob.size
        require(type(size) is int and size >= 0, 'Invalid analytical artifact length.')
        stop = size if stop is None else min(stop, size)
        require(type(start) is int and type(stop) is int and 0 <= start <= stop <= size,
                'Invalid analytical byte range.')
        if start == stop:
            return b''
        checks = reference.get('ranges')
        if not checks:
            return self._fetch(reference, 0, size, reference['sha256'], full=True)[start:stop]
        width, hashes = checks['blockBytes'], checks['hashes']
        require(type(width) is int and 4096 <= width <= 4*1024**2
                and len(hashes) == math.ceil(size/width), 'Invalid analytical range checksum table.')
        parts = []
        for index in range(start//width, (stop-1)//width+1):
            a, b = index*width, min(size, (index+1)*width)
            raw = self._fetch(reference, a, b, hashes[index])
            parts.append(raw[max(0, start-a):min(b-a, stop-a)])
        return b''.join(parts)


def analytical_store(reader, objects, prefix):
    """Keep Zarr imports worker-side and implement its pinned v3 store interface."""
    from zarr.storage import WrapperStore, MemoryStore
    from zarr.abc.store import RangeByteRequest, OffsetByteRequest, SuffixByteRequest

    references = {}
    for reference in objects:
        reader.check(reference)
        require(reference['path'].startswith(prefix), 'Partition member leaves its immutable prefix.')
        key = reference['path'][len(prefix):]
        require(key and key not in references, 'Invalid or duplicate analytical store member.')
        references[key] = reference

    class CloudReadStore(WrapperStore):
        def __init__(self):
            super().__init__(MemoryStore(read_only=True))

        def __enter__(self):
            return self

        def __eq__(self, other):
            return self is other

        async def get(self, key, prototype, byte_range=None):
            reference = references.get(key)
            if reference is None:
                return None
            size = reference['bytes']
            if isinstance(byte_range, RangeByteRequest):
                first, last = byte_range.start, byte_range.end
            elif isinstance(byte_range, OffsetByteRequest):
                first, last = byte_range.offset, size
            elif isinstance(byte_range, SuffixByteRequest):
                first, last = max(0, size-byte_range.suffix), size
            else:
                require(byte_range is None, 'Unsupported analytical byte request.')
                first, last = 0, size
            raw = await asyncio.to_thread(reader.read, reference, first, last)
            return prototype.buffer.from_bytes(raw)

        async def get_partial_values(self, prototype, key_ranges):
            return [await self.get(key, prototype, byte_range) for key, byte_range in key_ranges]

        async def _get_many(self, requests):
            for key, prototype, byte_range in requests:
                yield key, await self.get(key, prototype, byte_range)

        async def exists(self, key):
            return key in references

        async def getsize(self, key):
            if key not in references:
                raise FileNotFoundError(key)
            return references[key]['bytes']

        async def getsize_prefix(self, prefix):
            return sum(reference['bytes'] for key, reference in references.items() if key.startswith(prefix))

        async def is_empty(self, prefix):
            return not any(key.startswith(prefix) for key in references)

        async def list(self):
            for key in sorted(references):
                yield key

        async def list_prefix(self, prefix):
            for key in sorted(references):
                if key.startswith(prefix):
                    yield key

        async def list_dir(self, prefix):
            prefix = prefix.rstrip('/')+'/' if prefix else ''
            for key in sorted({key[len(prefix):].split('/')[0] for key in references if key.startswith(prefix)}):
                yield key

    return CloudReadStore()
