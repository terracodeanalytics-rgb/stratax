"""Immutable field publication and bounded analytical directory pages."""
import hashlib
import json
from collections import OrderedDict

from seismic_processing import require
from seismic_artifact_ranges import range_checksums


def json_bytes(value):
    return json.dumps(value,sort_keys=True,separators=(',',':'),allow_nan=False).encode()


class FieldPublisher:
    def __init__(self, bucket, prefix, maximum_bytes, *, cancelled=lambda:False):
        require(prefix.startswith('owners/') and prefix.endswith('/') and '..' not in prefix.split('/'),
                'Field publication requires an admitted private scope.')
        self.bucket,self.prefix,self.maximum = bucket,prefix,maximum_bytes
        self.cancelled = cancelled
        self.objects = OrderedDict()
        self.total_bytes = 0

    def put(self,name,raw):
        from google.api_core.exceptions import PreconditionFailed
        require(name and not name.startswith('/') and '\\' not in name
                and all(part not in ('.','..','') for part in name.split('/')), 'Invalid field artifact name.')
        require(not self.cancelled(), 'Field publication cancelled.')
        digest = hashlib.sha256(raw).hexdigest()
        path = self.prefix+name
        if path in self.objects:
            require(self.objects[path]['sha256'] == digest, 'A field artifact cannot change within one execution.')
            return self.objects[path]
        require(self.total_bytes+len(raw) <= self.maximum,
                'The field task exceeded its approved artifact allowance.')
        blob = self.bucket.blob(path)
        blob.metadata = dict(sha256=digest)
        try:
            blob.upload_from_string(raw,if_generation_match=0)
        except PreconditionFailed:
            blob.reload()
            require(blob.size == len(raw) and (blob.metadata or {}).get('sha256') == digest,
                    'An existing field artifact conflicts with this retry. No object was overwritten.')
        reference = dict(path=path,generation=str(blob.generation),sha256=digest,bytes=len(raw),
                         ranges=range_checksums(raw))
        self.objects[path] = reference
        self.total_bytes += len(raw)
        while len(self.objects) > 2048:
            self.objects.popitem(last=False)
        return reference


def directory_tree(entries,put):
    """Stream sorted partition entries through a fanout-256 immutable directory."""
    pending = {}
    sequence = {}
    previous_end = None
    def page(level):
        values = pending.pop(level)
        index = sequence.get(level,0)
        sequence[level] = index+1
        ref = put(f'directory/{level}/{index}.json',json_bytes(dict(
            kind='stratax-analytical-directory/1',leaf=level == 0,entries=values)))
        bounds = {}
        for key in ('inline','crossline','cdp','shot'):
            if all(key in value.get('headerBounds',{}) for value in values):
                bounds[key] = [min(value['headerBounds'][key][0] for value in values),
                               max(value['headerBounds'][key][1] for value in values)]
        return dict(firstTrace=values[0]['firstTrace'],
                    traceCount=values[-1]['firstTrace']+values[-1]['traceCount']-values[0]['firstTrace'],
                    reference=ref,headerBounds=bounds)
    def add(level,entry):
        pending.setdefault(level,[]).append(entry)
        if len(pending[level]) == 256:
            add(level+1,page(level))
    for entry in entries:
        require(type(entry['firstTrace']) is int and type(entry['traceCount']) is int and entry['traceCount'] > 0,
                'Invalid analytical directory bounds.')
        require(previous_end is None or entry['firstTrace'] == previous_end,
                'Analytical partitions have missing or overlapping trace support.')
        previous_end = entry['firstTrace']+entry['traceCount']
        add(0,entry)
    require(pending, 'A completed field index requires partition entries.')
    while True:
        level = min(pending)
        if len(pending) == 1 and len(pending[level]) == 1 and level > 0:
            return pending[level][0]['reference']
        add(level+1,page(level))


def geometry_bounds(headers):
    """Bounds are raw header identities; reviewed physical geometry is not inferred."""
    result = {}
    for key in ('inline','crossline','cdp','shot'):
        values = [row.get('geometry',{}).get(key) for row in headers]
        values = [value for value in values if type(value) in (int,float)]
        if values:
            result[key] = [min(values),max(values)]
    return result
