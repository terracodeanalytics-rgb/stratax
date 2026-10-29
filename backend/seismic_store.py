"""Lossless analytical trace storage with separate display levels and bounded reads."""
import json
import sqlite3
from pathlib import Path

import numpy as np

from seismic_processing import SeismicError, require

VERSION = "stratax-seismic/1.0"
MAX_SECTION_CELLS = 2_000_000


def open_store(path, mode="r"):
    import zarr
    return zarr.open_group(str(path), mode=mode, zarr_format=3)


def create_store(path, trace_count, sample_count, dt, start=0., metadata=None, domain="time-unconfirmed"):
    import zarr
    from zarr.codecs import ZstdCodec
    require(type(trace_count) is int and type(sample_count) is int and trace_count > 0 and sample_count > 0,
            "Supply positive trace and sample counts.")
    require(np.isfinite(dt) and dt > 0 and np.isfinite(start), "Confirm the positive sample interval and axis origin.")
    require(domain in ("TWT", "time-unconfirmed"), "Confirm the time convention explicitly; this store adapter uses seconds.")
    root = zarr.open_group(str(path), mode="w-", zarr_format=3)
    root.attrs.update(dict(schemaVersion=1, version=VERSION, shape=[trace_count, sample_count],
                           sampleInterval=float(dt), sampleStart=float(start), domain=domain, axisUnit="s",
                           analytical=True, complete=False, metadata=metadata or {}))
    root.create_array("samples", shape=(trace_count, sample_count), dtype="float64",
                      chunks=(32, 1024), shards=(256, 4096), fill_value=np.nan,
                      compressors=[ZstdCodec(level=3)])
    root.create_array("valid", shape=(trace_count, sample_count), dtype="bool",
                      chunks=(32, 1024), shards=(256, 4096), fill_value=False,
                      compressors=[ZstdCodec(level=3)])
    return root


def write_block(root, first_trace, first_sample, samples):
    require(root.attrs.get("complete") is False, "Completed analytical stores are immutable; create a derived version.")
    data = np.asarray(samples, float)
    require(data.ndim == 2, "Write a trace-by-sample block.")
    traces, count = root.attrs["shape"]
    require(type(first_trace) is int and type(first_sample) is int and first_trace >= 0 and first_sample >= 0 and first_trace + data.shape[0] <= traces and first_sample + data.shape[1] <= count, "Block leaves its declared source bounds.")
    selection = np.s_[first_trace:first_trace+data.shape[0], first_sample:first_sample+data.shape[1]]
    root["samples"][selection] = data
    root["valid"][selection] = np.isfinite(data)


def section(root, trace_ids, first_sample, sample_count, level=0):
    require(root.attrs.get("complete") is True, "Wait for analytical indexing to complete.")
    trace_ids = list(trace_ids)
    require(0 < len(trace_ids) <= 512 and all(type(i) is int and 0 <= i < root.attrs["shape"][0] for i in trace_ids), "Select 1–512 retained trace identities.")
    require(type(level) is int and 0 <= level <= 12, "Choose a supported display level.")
    require(type(first_sample) is int and type(sample_count) is int and first_sample >= 0 and sample_count >= 1 and sample_count * len(trace_ids) <= MAX_SECTION_CELLS, "Select a bounded sample range.")
    key = "samples" if level == 0 else f"display/{level}"
    require(key in root, "This display level is unavailable; select full resolution.")
    array = root[key]
    require(first_sample + sample_count <= array.shape[1], "Selected samples exceed the stored axis.")
    values = array.oindex[trace_ids, slice(first_sample, first_sample+sample_count)]
    return dict(samples=np.where(np.isfinite(values), values, None).tolist(), traceIds=trace_ids,
                sampleStart=root.attrs["sampleStart"] + first_sample * root.attrs["sampleInterval"] * 2**level,
                sampleInterval=root.attrs["sampleInterval"] * 2**level,
                domain=root.attrs["domain"], axisUnit=root.attrs["axisUnit"], displayOnly=level > 0,
                analytical=level == 0, level=level)


def build_display_levels(root, levels=4, cancelled=lambda: False):
    require(root.attrs.get("complete") is False, "Build display levels before committing the index.")
    require(type(levels) is int and 0 <= levels <= 12, "Display level count must be 0–12.")
    traces, samples = root.attrs["shape"]
    for level in range(1, levels+1):
        factor = 2**level
        output_count = (samples + factor - 1) // factor
        dest = root.create_array(f"display/{level}", shape=(traces, output_count), dtype="float32",
                                 chunks=(32, 1024), shards=(256, 4096), fill_value=np.nan)
        for first in range(0, traces, 32):
            for start in range(0, output_count, 1024):
                require(not cancelled(), "Indexing cancelled.")
                end = min(output_count, start+1024)
                raw = root["samples"][first:first+32, start*factor:min(samples, end*factor)]
                padded = np.full((len(raw), (end-start)*factor), np.nan)
                padded[:, :raw.shape[1]] = raw
                blocks = padded.reshape(len(raw), end-start, factor)
                valid = np.isfinite(blocks)
                count = valid.sum(axis=2)
                means = np.divide(np.where(valid, blocks, 0).sum(axis=2), count,
                                  out=np.full(count.shape, np.nan), where=count > 0)
                dest[first:first+len(raw), start:end] = means
    root.attrs["displayLevels"] = levels


def index_segy(source_path, destination, header_bytes=None, references=None, cancelled=lambda: False):
    """Index all retained traces. Geometry scalar is applied, CRS and datum stay explicit."""
    import segyio
    header_bytes = dict(inline=189, crossline=193, cdp=21, shot=9, offset=37,
                        sourceX=73, sourceY=77, receiverX=81, receiverY=85,
                        coordinateScalar=71, coordinateUnits=89) | (header_bytes or {})
    require(all(type(v) is int and 1 <= v <= 239 for v in header_bytes.values()), "Header byte mappings must be valid SEG-Y trace-header positions.")
    destination = Path(destination)
    destination.mkdir(parents=True, exist_ok=False)
    opener = segyio.su.open if Path(source_path).suffix.lower() == ".su" else segyio.open
    try:
        with opener(str(source_path), "r", strict=False, ignore_geometry=True) as source:
            dt_us = int(source.bin[segyio.BinField.Interval]) if Path(source_path).suffix.lower() != ".su" else int(source.header[0][117])
            start_ms = int(source.header[0][109])
            require(dt_us > 0, "Confirm a positive source sampling interval; no value was inferred.")
            require(source.tracecount > 0 and len(source.samples) > 0, "This survey has no readable traces.")
            root = create_store(destination/"traces.zarr", source.tracecount, len(source.samples), dt_us*1e-6,
                                start_ms*.001, {"references": references or {}, "headerBytes": header_bytes})
            connection = sqlite3.connect(destination/"geometry.sqlite")
            try:
                connection.execute("CREATE TABLE traces (id INTEGER PRIMARY KEY, inline INTEGER, crossline INTEGER, cdp INTEGER, shot INTEGER, offset REAL, sourceX REAL, sourceY REAL, receiverX REAL, receiverY REAL, coordinateUnits INTEGER)")
                for first in range(0, source.tracecount, 32):
                    require(not cancelled(), "Indexing cancelled.")
                    end = min(source.tracecount, first+32)
                    traces = []
                    records = []
                    for i in range(first, end):
                        h = source.header[i]
                        require(int(h[117]) in (0, dt_us) and int(h[109]) == start_ms,
                                "Variable sample intervals/origins need separate trace families; this indexer did not resample them.")
                        row = np.asarray(source.trace[i], float)
                        require(len(row) == len(source.samples), "Variable trace lengths require a dedicated index adapter; no samples were padded or discarded.")
                        traces.append(row)
                        values = {k: int(h[v]) for k, v in header_bytes.items()}
                        scalar = values["coordinateScalar"]
                        factor = 1/scalar.__abs__() if scalar < 0 else scalar if scalar > 0 else 1
                        records.append((i, *[values[k] for k in ("inline", "crossline", "cdp", "shot", "offset")],
                                        *[values[k]*factor for k in ("sourceX", "sourceY", "receiverX", "receiverY")], values["coordinateUnits"]))
                    write_block(root, first, 0, traces)
                    connection.executemany("INSERT INTO traces VALUES (?,?,?,?,?,?,?,?,?,?,?)", records)
                    connection.commit()
                for field in ("inline", "crossline", "cdp", "shot"):
                    connection.execute(f"CREATE INDEX by_{field} ON traces ({field}, id)")
                connection.commit()
            finally:
                connection.close()
            build_display_levels(root, cancelled=cancelled)
            root.attrs["complete"] = True
            manifest = dict(root.attrs)
            (destination/"manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
            return manifest
    except (SeismicError, OSError, RuntimeError, ValueError) as error:
        # Keep the incomplete store for diagnosis/restart; it is never a readable analytical source.
        if isinstance(error, SeismicError):
            raise
        raise SeismicError("The SEG-Y index could not be completed. Review the source format/header mapping.") from error


def select_traces(index_path, mode, value=None, start=0, count=128):
    require(mode in ("trace-range", "inline", "crossline", "cdp", "shot"), "Choose a trace range or reviewed geometry key.")
    require(type(start) is int and start >= 0 and type(count) is int and 1 <= count <= 512, "Choose a bounded trace selection.")
    with sqlite3.connect(f"file:{Path(index_path).as_posix()}?mode=ro", uri=True) as connection:
        if mode == "trace-range":
            rows = connection.execute("SELECT id FROM traces ORDER BY id LIMIT ? OFFSET ?", (count, start))
        else:
            require(type(value) is int, "Supply an integer geometry label.")
            rows = connection.execute(f"SELECT id FROM traces WHERE {mode}=? ORDER BY id LIMIT ? OFFSET ?", (value, count, start))
        return [r[0] for r in rows]
