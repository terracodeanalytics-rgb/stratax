import io
import struct
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
import pytest

from seismic_processing import SeismicError
from seismic_reader import SectionError, decode_samples, read_section
from seismic_store import build_display_levels, create_store, section, write_block, index_segy, open_store, select_traces


def segy_bytes(endian="big", traces=3, samples=16):
    order = ">" if endian == "big" else "<"
    binary = bytearray(400)
    for byte, value in [(17, 2000), (21, samples), (25, 5), (301, 256), (303, 1)]:
        struct.pack_into(order+"H", binary, byte-1, value)
    result = bytearray(b" "*3200+binary)
    for i in range(traces):
        h = bytearray(240)
        for byte, value in [(21, i+1), (181, 1000+i*100), (185, 2000), (189, 10), (193, 20+i)]:
            struct.pack_into(order+"i", h, byte-1, value)
        struct.pack_into(order+"h", h, 70, -10)
        struct.pack_into(order+"H", h, 114, samples)
        struct.pack_into(order+"H", h, 116, 2000)
        result.extend(h)
        result.extend(struct.pack(order+str(samples)+"f", *[i*100+x for x in range(samples)]))
    return bytes(result)


@pytest.mark.parametrize('endian', ['big', 'little'])
def test_bounded_reader_original_values_geometry_and_origin(endian):
    raw = segy_bytes(endian)
    result = read_section(io.BytesIO(raw), len(raw), endian=endian, first_trace=1, trace_count=2, first_sample=3, sample_count=4)
    assert result['samples'] == [[103, 104, 105, 106], [203, 204, 205, 206]]
    assert result['traceHeaders'][0]['x'] == 110
    assert result['traceHeaders'][0]['crossline'] == 21
    assert result['sampleInterval'] == .002 and result['sampleStart'] == .006
    assert result['analytical'] and not result['displayOnly']
    assert result['sourceDomain'] == 'time-unconfirmed'
    with pytest.raises(SectionError):
        read_section(io.BytesIO(raw), len(raw)-1, trace_count=1, sample_count=1)
    with pytest.raises(SectionError):
        read_section(io.BytesIO(raw), len(raw), trace_count=4, sample_count=1)


def test_ibm_and_ieee_missing_values():
    assert decode_samples(bytes.fromhex('41100000c120000000000000'), 1, 'big') == [1., -2., 0.]
    assert decode_samples(struct.pack('>3f', 1, float('nan'), 3), 5, 'big') == [1, None, 3]


def test_native_index_roundtrip_and_geometry_query(tmp_path):
    raw = tmp_path/'source.segy'
    raw.write_bytes(segy_bytes())
    manifest = index_segy(raw, tmp_path/'index')
    assert manifest['complete'] and manifest['domain'] == 'time-unconfirmed'
    root = open_store(tmp_path/'index/traces.zarr')
    traces = select_traces(tmp_path/'index/geometry.sqlite', 'crossline', 21)
    assert traces == [1]
    assert section(root, traces, 3, 4)['samples'] == [[103, 104, 105, 106]]


def test_store_analytical_immutability_and_display_separation(tmp_path):
    root = create_store(tmp_path/'survey.zarr', 3, 16, .002)
    values = np.arange(48, dtype=float).reshape(3, 16)
    values[1, 4] = np.nan
    write_block(root, 0, 0, values)
    with pytest.raises(SeismicError, match='complete'):
        section(root, [0], 0, 4)
    build_display_levels(root, 2)
    root.attrs['complete'] = True
    result = section(root, [1, 2], 2, 5)
    assert result['samples'][0] == [18, 19, None, 21, 22]
    assert result['analytical'] and not result['displayOnly']
    display = section(root, [0], 0, 4, 1)
    assert display['samples'] == [[.5, 2.5, 4.5, 6.5]]
    assert display['displayOnly'] and not display['analytical']
    with pytest.raises(SeismicError, match='immutable'):
        write_block(root, 0, 0, [[1]])
    with pytest.raises(SeismicError):
        section(root, [3], 0, 1)


def test_sparse_store_shape_does_not_materialise_volume(tmp_path):
    root = create_store(tmp_path/'large.zarr', 1_000_000, 16384, .002)
    # This tests allocation behaviour only, not a field-scale storage/throughput benchmark.
    write_block(root, 999_999, 16380, [[1, 2, 3, 4]])
    root.attrs['complete'] = True
    assert section(root, [999_999], 16380, 4)['samples'] == [[1, 2, 3, 4]]
    assert sum(p.stat().st_size for p in (tmp_path/'large.zarr').rglob('*') if p.is_file()) < 1024**2
