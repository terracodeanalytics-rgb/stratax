"""Bounded random-access SEG-Y/SU sections from seekable local or private object streams.

This adapter certifies fixed-length rev 0/1 layouts. It never substitutes importer previews.
"""
import math
import struct
import gzip
import hashlib
import io
import json


class SectionError(ValueError):
    pass


def read_preview(manifest, load_chunk, *, first_trace=0, trace_count=128, first_sample=0, sample_count=1000):
    need(manifest.get('format') == 'seismic-trace-preview/v1' and manifest.get('complete') is True, 'This analytical result is incomplete.')
    need(all(type(v) is int for v in (first_trace, trace_count, first_sample, sample_count)) and first_trace >= 0 and first_sample >= 0 and 1 <= trace_count <= 512 and 1 <= sample_count <= 4096 and trace_count*sample_count <= 2_000_000,
         'Choose a bounded analytical result section.')
    need(first_trace+trace_count <= manifest['traceCount'] and first_sample+sample_count <= manifest['samplesPerTrace'], 'This section exceeds the calculated result.')
    rows = []
    expected_trace = 0
    for chunk in manifest['chunks']:
        need(type(chunk['firstTrace']) is int and type(chunk['traceCount']) is int and chunk['firstTrace'] == expected_trace and 1 <= chunk['traceCount'] <= 16,
             'Analytical chunks must retain ordered, non-overlapping trace support.')
        expected_trace += chunk['traceCount']
    need(expected_trace == manifest['traceCount'], 'Analytical chunk support does not match its manifest.')
    for chunk in manifest['chunks']:
        start, stop = chunk['firstTrace'], chunk['firstTrace']+chunk['traceCount']
        if stop <= first_trace or start >= first_trace+trace_count:
            continue
        raw = load_chunk(chunk['path'])
        need(len(raw) <= 2*1024**2 and hashlib.sha256(raw).hexdigest() == chunk['sha256'], 'An analytical chunk exceeded its budget or changed checksum.')
        with gzip.GzipFile(fileobj=io.BytesIO(raw)) as stream:
            expanded = stream.read(4*1024**2+1)
        need(len(expanded) <= 4*1024**2, 'An analytical chunk exceeded its expanded-byte budget.')
        values = json.loads(expanded)
        need(len(values) == chunk['traceCount'], 'Analytical chunk trace count changed.')
        for t in range(max(start, first_trace), min(stop, first_trace+trace_count)):
            row = values[t-start]
            need(len(row) == manifest['samplesPerTrace'], 'Analytical sample counts changed.')
            picked = row[first_sample:first_sample+sample_count]
            need(all(v is None or type(v) in (int, float) and math.isfinite(v) for v in picked), 'Analytical samples contain unsupported values.')
            rows.append(picked)
    need(len(rows) == trace_count, 'The selected result has missing or duplicate chunk support.')
    start = manifest['sampleStart']+first_sample*manifest['sampleInterval']
    return dict(samples=rows, traceHeaders=manifest['traceHeaders'][first_trace:first_trace+trace_count],
                traceCount=manifest['traceCount'], samplesPerTrace=manifest['samplesPerTrace'], sampleInterval=manifest['sampleInterval'],
                sampleStarts=[start]*trace_count, sampleStart=start, firstTrace=first_trace, firstSample=first_sample,
                level=0, displayOnly=False, analytical=True, axisUnit='s', sourceDomain=manifest['domain'],
                history=manifest.get('history', []), adapter='processed-analytical-traces/v1')


def need(condition, message):
    if not condition:
        raise SectionError(message)


def _read(stream, offset, count):
    stream.seek(offset)
    value = stream.read(count)
    need(len(value) == count, "The source ended before its declared samples; inspect the original.")
    return value


def _integer(header, byte, size, endian, signed=True):
    need(type(byte) is int and 1 <= byte <= len(header)-size+1, "Review the trace-header byte mapping.")
    return int.from_bytes(header[byte-1:byte-1+size], endian, signed=signed)


def decode_samples(raw, sample_format, endian):
    sizes = {1: 4, 2: 4, 3: 2, 5: 4, 6: 8, 8: 1}
    need(sample_format in sizes and len(raw) % sizes[sample_format] == 0, "This sample encoding is not supported by the bounded section reader.")
    if sample_format == 1:
        result = []
        for i in range(0, len(raw), 4):
            word = int.from_bytes(raw[i:i+4], endian)
            sign = -1 if word & 0x80000000 else 1
            result.append(sign * (word & 0xffffff) / 2**24 * 16.**(((word >> 24) & 127)-64))
        return result
    codes = {2: "i", 3: "h", 5: "f", 6: "d", 8: "b"}
    return [x[0] if math.isfinite(x[0]) else None for x in struct.iter_unpack((">" if endian == "big" else "<")+codes[sample_format], raw)]


def read_section(stream, size, *, kind="segy", endian="big", first_trace=0, trace_count=128,
                 first_sample=0, sample_count=1000, header_bytes=None):
    need(kind in ("segy", "su") and endian in ("big", "little"), "Choose a supported source format and byte order.")
    need(all(type(v) is int for v in (first_trace, trace_count, first_sample, sample_count)) and first_trace >= 0 and first_sample >= 0 and 1 <= trace_count <= 512 and 1 <= sample_count <= 4096 and trace_count*sample_count <= 2_000_000,
         "Choose 1–512 traces and 1–4096 samples within the two-million-cell section limit.")
    if kind == "segy":
        binary = _read(stream, 3200, 400)
        ns = _integer(binary, 21, 2, endian, False)
        dt = _integer(binary, 17, 2, endian, False)
        fmt = _integer(binary, 25, 2, endian, False)
        revision = _integer(binary, 301, 2, endian, False)
        need(revision <= 0x100, "This section adapter supports fixed-length SEG-Y rev 0/1. Use an indexed native adapter for newer revisions.")
        extended = _integer(binary, 305, 2, endian)
        need(0 <= extended <= 1024, "Variable/unknown extended headers require native indexing.")
        begin = 3600 + extended*3200
    else:
        header = _read(stream, 0, 240)
        ns, dt, fmt, begin = _integer(header, 115, 2, endian, False), _integer(header, 117, 2, endian, False), 5, 0
    sizes = {1: 4, 2: 4, 3: 2, 5: 4, 6: 8, 8: 1}
    need(fmt in sizes and ns > 0 and dt > 0, "Review sample encoding, sample count and time interval in the source headers.")
    width = 240 + ns*sizes[fmt]
    need(size >= begin and (size-begin) % width == 0, "This is not a verified fixed-length layout. Index its native trace offsets before reading sections.")
    total = (size-begin)//width
    need(first_trace+trace_count <= total and first_sample+sample_count <= ns, "The selected section exceeds the retained source. Choose a smaller range.")
    keys = dict(inline=189, crossline=193, cdp=21, shot=9, offset=37, x=181, y=185, scalar=71)
    keys.update(header_bytes or {})
    need(set(keys) == {"inline", "crossline", "cdp", "shot", "offset", "x", "y", "scalar"}, "Remove unsupported header mappings.")
    headers, rows, starts = [], [], []
    for i in range(first_trace, first_trace+trace_count):
        offset = begin+i*width
        header = _read(stream, offset, 240)
        need(_integer(header, 115, 2, endian, False) == ns and _integer(header, 117, 2, endian, False) in (0, dt), "Selected traces have variable lengths/intervals. Use a native trace index; no samples were resampled.")
        values = {k: _integer(header, pos, 2 if k == "scalar" else 4, endian) for k, pos in keys.items()}
        scalar = values.pop("scalar")
        factor = 1/abs(scalar) if scalar < 0 else scalar if scalar > 0 else 1
        values["x"] *= factor
        values["y"] *= factor
        values.update(trace=i, sourceX=_integer(header, 73, 4, endian)*factor,
                      sourceY=_integer(header, 77, 4, endian)*factor,
                      receiverX=_integer(header, 81, 4, endian)*factor,
                      receiverY=_integer(header, 85, 4, endian)*factor,
                      coordinateUnits=_integer(header, 89, 2, endian, False))
        headers.append(values)
        starts.append(_integer(header, 109, 2, endian)*.001 + first_sample*dt*1e-6)
        raw = _read(stream, offset+240+first_sample*sizes[fmt], sample_count*sizes[fmt])
        rows.append(decode_samples(raw, fmt, endian))
    return dict(samples=rows, traceHeaders=headers, traceCount=total, samplesPerTrace=ns,
                sampleInterval=dt*1e-6, sampleStarts=starts, sampleStart=starts[0],
                firstTrace=first_trace, firstSample=first_sample, level=0, displayOnly=False,
                analytical=True, axisUnit="s", sourceDomain="time-unconfirmed",
                geometry="Retained source coordinates; CRS/datum require review", adapter="fixed-length-rev0-1")
