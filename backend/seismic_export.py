"""Processed seismic product export. Writes IEEE float SEG-Y / SU without inventing geometry."""
from __future__ import annotations

import io
import struct

import numpy as np

from seismic_processing import TraceBlock, complete, require


def _pack_text_header(text: str) -> bytes:
    raw = (text or "C01 STRATAX PROCESSED SEISMIC PRODUCT").encode("ascii", errors="replace")
    raw = raw[:3200].ljust(3200, b" ")
    return raw


def _pack_binary_header(samples: int, dt_us: int, format_code: int = 5) -> bytes:
    buf = bytearray(400)
    struct.pack_into(">HH", buf, 16, dt_us, dt_us)
    struct.pack_into(">HH", buf, 20, samples, samples)
    struct.pack_into(">H", buf, 24, format_code)
    struct.pack_into(">HHh", buf, 300, 0x100, 1, 0)
    return bytes(buf)


def _pack_trace_header(index: int, samples: int, dt_us: int, *, start_ms=0, inline=None, crossline=None, offset=None) -> bytes:
    buf = bytearray(240)
    struct.pack_into(">i", buf, 0, index + 1)
    struct.pack_into(">i", buf, 4, index + 1)
    struct.pack_into(">i", buf, 8, 1)
    struct.pack_into(">i", buf, 12, index + 1)
    if offset is not None:
        struct.pack_into(">i", buf, 36, int(offset))
    struct.pack_into(">hHH", buf, 108, start_ms, 0, 0)
    struct.pack_into(">HH", buf, 114, samples, dt_us)
    if inline is not None:
        struct.pack_into(">i", buf, 188, int(inline))
    if crossline is not None:
        struct.pack_into(">i", buf, 192, int(crossline))
    return bytes(buf)


def _time_headers(block):
    complete(block)
    require(block.domain == "TWT", "This writer supports TWT time products; use a depth-aware exchange writer for depth products.")
    dt_us = int(round(block.dt * 1e6))
    start_ms = int(round(block.start * 1000))
    require(1 <= dt_us <= 65535 and abs(dt_us * 1e-6 - block.dt) <= 1e-12,
            "Sample interval must be exactly representable as 1–65535 microseconds.")
    require(-32768 <= start_ms <= 32767 and abs(start_ms / 1000 - block.start) <= 1e-12,
            "Trace start must be exactly representable as signed milliseconds.")
    require(block.samples.shape[1] <= 65535, "Trace length exceeds the uint16 sample count.")
    require(np.max(np.abs(block.samples)) <= np.finfo(np.float32).max, "Samples overflow IEEE float32 export.")
    return dt_us, start_ms


def export_ieee_segy(block: TraceBlock, *, text_header: str = "", inlines=None, crosslines=None, offsets=None) -> bytes:
    """
    Export a TraceBlock as big-endian IEEE float SEG-Y (format code 5).
    NaN/invalid samples are written as 0 with no geometry invention.
    """
    dt_us, start_ms = _time_headers(block)
    samples = np.asarray(block.samples, dtype=np.float32)
    n_traces, n_samples = samples.shape
    dt_us = int(round(block.dt * 1e6))
    require(1 <= dt_us <= 65535, "Sample interval in microseconds must fit a SEG-Y uint16 field.")
    require(n_samples <= 65535, "Trace length exceeds classic SEG-Y sample count field.")
    if inlines is not None:
        inlines = np.asarray(inlines)
        require(inlines.shape == (n_traces,), "Inline vector must match trace count.")
    if crosslines is not None:
        crosslines = np.asarray(crosslines)
        require(crosslines.shape == (n_traces,), "Crossline vector must match trace count.")
    if offsets is not None:
        offsets = np.asarray(offsets)
        require(offsets.shape == (n_traces,), "Offset vector must match trace count.")
    for vector in (inlines, crosslines, offsets):
        if vector is not None:
            require(np.all(np.isfinite(vector)) and np.all(vector == np.rint(vector))
                    and np.all(vector >= -(2**31)) and np.all(vector < 2**31),
                    "Geometry header vectors must be exactly representable signed 32-bit integers; no truncation was applied.")

    out = io.BytesIO()
    out.write(_pack_text_header(text_header or f"C01 STRATAX EXPORT DOMAIN={block.domain} DT={block.dt}S"))
    out.write(_pack_binary_header(n_samples, dt_us, format_code=5))
    for i in range(n_traces):
        out.write(
            _pack_trace_header(
                i,
                n_samples,
                dt_us,
                start_ms=start_ms,
                inline=None if inlines is None else inlines[i],
                crossline=None if crosslines is None else crosslines[i],
                offset=None if offsets is None else offsets[i],
            )
        )
        trace = np.where(np.isfinite(samples[i]), samples[i], 0.0).astype(">f4")
        out.write(trace.tobytes())
    return out.getvalue()


def export_su_ieee(block: TraceBlock) -> bytes:
    """Export TraceBlock as SU-style 240-byte header + IEEE float traces (little-endian samples)."""
    dt_us, start_ms = _time_headers(block)
    samples = np.asarray(block.samples, dtype=np.float32)
    n_traces, n_samples = samples.shape
    dt_us = int(round(block.dt * 1e6))
    require(1 <= dt_us <= 65535 and n_samples <= 65535, "SU export bounds exceeded.")
    out = io.BytesIO()
    for i in range(n_traces):
        hdr = bytearray(240)
        struct.pack_into("<i", hdr, 0, i + 1)
        struct.pack_into("<h", hdr, 108, start_ms)
        struct.pack_into("<HH", hdr, 114, n_samples, dt_us)
        out.write(hdr)
        trace = np.where(np.isfinite(samples[i]), samples[i], 0.0).astype("<f4")
        out.write(trace.tobytes())
    return out.getvalue()


def describe_export(block: TraceBlock, fmt: str = "segy-ieee"):
    complete(block)
    require(fmt in ("segy-ieee", "su-ieee"), "Choose segy-ieee or su-ieee.")
    return dict(
        format=fmt,
        traces=int(block.samples.shape[0]),
        samples=int(block.samples.shape[1]),
        dt=block.dt,
        start=block.start,
        domain=block.domain,
        amplitudeEncoding="ieee32",
        invalidSamples="rejected",
        limitations=["Geometry headers are only written when explicit inline/crossline/offset vectors are supplied."],
    )
