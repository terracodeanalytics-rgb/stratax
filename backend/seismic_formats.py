"""Supported seismic format and header-mapping contracts (M0.02).

Dialect certification is per fixture; this catalog only declares what the engines
accept, reject, or retain without inventing geometry or amplitude history.
"""
from __future__ import annotations

from typing import Any


# Byte positions are 1-based SEG-Y standard field starts unless noted.
STANDARD_TRACE_HEADERS = {
    "tracl": dict(byte=1, width=4, signed=True, role="trace-sequence-line"),
    "tracr": dict(byte=5, width=4, signed=True, role="trace-sequence-reel"),
    "fldr": dict(byte=9, width=4, signed=True, role="field-record"),
    "tracf": dict(byte=13, width=4, signed=True, role="trace-number-field"),
    "ep": dict(byte=17, width=4, signed=True, role="energy-source-point"),
    "cdp": dict(byte=21, width=4, signed=True, role="cdp"),
    "cdpt": dict(byte=25, width=4, signed=True, role="cdp-trace"),
    "trid": dict(byte=29, width=2, signed=True, role="trace-id"),
    "offset": dict(byte=37, width=4, signed=True, role="offset"),
    "sx": dict(byte=73, width=4, signed=True, role="source-x"),
    "sy": dict(byte=77, width=4, signed=True, role="source-y"),
    "gx": dict(byte=81, width=4, signed=True, role="receiver-x"),
    "gy": dict(byte=85, width=4, signed=True, role="receiver-y"),
    "counit": dict(byte=89, width=2, signed=True, role="coordinate-units"),
    "scalco": dict(byte=71, width=2, signed=True, role="coordinate-scalar"),
    "scalel": dict(byte=69, width=2, signed=True, role="elevation-scalar"),
    "selev": dict(byte=45, width=4, signed=True, role="source-elevation"),
    "gelev": dict(byte=41, width=4, signed=True, role="receiver-elevation"),
    "ns": dict(byte=115, width=2, signed=False, role="samples-per-trace"),
    "dt": dict(byte=117, width=2, signed=False, role="sample-interval-us"),
    "inline": dict(byte=189, width=4, signed=True, role="inline"),
    "crossline": dict(byte=193, width=4, signed=True, role="crossline"),
}

FORMAT_CONTRACTS: dict[str, dict[str, Any]] = {
    "segy-rev0-fixed": dict(
        id="segy-rev0-fixed",
        family="SEG-Y",
        revision="0",
        layout="fixed-length",
        encodings=("ibm32", "int32", "int16", "ieee32"),
        textualHeader=3200,
        binaryHeader=400,
        traceHeader=240,
        variableTraceLength=False,
        directSectionReader=True,
        notes="Fixed-length rev 0; sample interval and ns from binary/trace headers.",
    ),
    "segy-rev1-fixed": dict(
        id="segy-rev1-fixed",
        family="SEG-Y",
        revision="1",
        layout="fixed-length",
        encodings=("ibm32", "int32", "int16", "ieee32", "ieee64"),
        textualHeader=3200,
        binaryHeader=400,
        traceHeader=240,
        variableTraceLength=False,
        directSectionReader=True,
        notes="Fixed-length rev 1; extended textual headers retained when present.",
    ),
    "segy-variable-indexed": dict(
        id="segy-variable-indexed",
        family="SEG-Y",
        revision="0/1",
        layout="variable-length",
        encodings=("ibm32", "int32", "int16", "ieee32"),
        textualHeader=3200,
        binaryHeader=400,
        traceHeader=240,
        variableTraceLength=True,
        directSectionReader=False,
        requiresIndex=True,
        notes="Requires resumable SQLite/Cloud index; section reads use verified locators.",
    ),
    "su-ieee": dict(
        id="su-ieee",
        family="SU",
        revision="SU",
        layout="fixed-length",
        encodings=("ieee32",),
        textualHeader=0,
        binaryHeader=0,
        traceHeader=240,
        variableTraceLength=False,
        directSectionReader=True,
        notes="Seismic Unix IEEE float traces with SEG-Y-like 240-byte headers.",
    ),
    "zgy-native": dict(
        id="zgy-native",
        family="ZGY",
        revision="openzgy",
        layout="bricked",
        encodings=("native",),
        directSectionReader=False,
        importRetained=True,
        notes="Retained via native OpenZGY import; not a direct SEG-Y section adapter.",
    ),
    "sgz-native": dict(
        id="sgz-native",
        family="SGZ",
        revision="openvds-compatible-retained",
        layout="compressed-brick",
        encodings=("native",),
        directSectionReader=False,
        importRetained=True,
        notes="Retained import product; direct VDS SDK reading is out of scope.",
    ),
    "analytical-zarr-v3": dict(
        id="analytical-zarr-v3",
        family="analytical",
        revision="zarr-v3",
        layout="sharded-ragged",
        encodings=("float32", "float64"),
        directSectionReader=True,
        notes="Private analytical arrays with masks; display pyramids are separate.",
    ),
}

ROLE_GROUPS = {
    "source": ("sx", "sy", "selev", "ep", "fldr"),
    "receiver": ("gx", "gy", "gelev"),
    "midpoint": ("cdp", "inline", "crossline"),
    "timing": ("ns", "dt"),
    "scalars": ("scalco", "scalel", "counit"),
}


def format_catalog():
    return dict(
        formats=list(FORMAT_CONTRACTS.values()),
        standardTraceHeaders=STANDARD_TRACE_HEADERS,
        roleGroups=ROLE_GROUPS,
        rules=[
            "Never invent missing geometry, CRS, datum or amplitude history.",
            "Header role mapping must be reviewed before processing-qualified geometry.",
            "Variable-length SEG-Y requires an indexed adapter; fixed-layout readers refuse it.",
            "ZGY/SGZ remain import-retained formats until their native section contracts are selected.",
            "Dialect certification is per fixture hash, never by file extension alone.",
        ],
    )


def resolve_format(format_id: str) -> dict[str, Any]:
    if format_id not in FORMAT_CONTRACTS:
        raise ValueError(f"Unsupported seismic format contract: {format_id}")
    return dict(FORMAT_CONTRACTS[format_id])


def header_mapping_contract(roles: dict[str, str] | None = None) -> dict[str, Any]:
    """
    Build a reviewed mapping declaration. Unknown roles stay unconfirmed; no defaults
    invent inline/crossline from arbitrary bytes.
    """
    roles = roles or {}
    mapped = {}
    for role, field_name in roles.items():
        if field_name not in STANDARD_TRACE_HEADERS:
            raise ValueError(f"Unknown header field '{field_name}' for role '{role}'.")
        mapped[role] = dict(field=field_name, **STANDARD_TRACE_HEADERS[field_name])
    return dict(
        version="stratax-seismic-header-map/1",
        mapped=mapped,
        unconfirmed=[r for r in ("source-xy", "receiver-xy", "inline", "crossline", "offset") if r not in mapped],
        processingQualified=False,
    )
