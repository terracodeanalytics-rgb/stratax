"""Distributed Cloud analytical index manifests (metadata only; no GCS I/O)."""
from __future__ import annotations

import math

from seismic_processing import require


def partition_spec(trace_count, traces_per_partition):
    require(type(trace_count) is int and trace_count >= 1, "trace_count must be a positive integer.")
    require(type(traces_per_partition) is int and traces_per_partition >= 1, "traces_per_partition must be a positive integer.")
    count = int(math.ceil(trace_count / traces_per_partition))
    partitions = []
    for index in range(count):
        first = index * traces_per_partition
        last = min(trace_count, first + traces_per_partition)
        partitions.append(dict(index=index, firstTrace=first, traceCount=last - first))
    return dict(traceCount=trace_count, tracesPerPartition=traces_per_partition, partitionCount=count, partitions=partitions)


def partition_halo(partition_index, partition_count, halo):
    require(type(partition_index) is int and type(partition_count) is int and 0 <= partition_index < partition_count, "partition_index leaves the partition set.")
    require(type(halo) is int and halo >= 0, "halo must be a nonnegative integer.")
    return dict(
        partitionIndex=partition_index,
        leftHaloPartitions=min(halo, partition_index),
        rightHaloPartitions=min(halo, partition_count - 1 - partition_index),
    )


def manifest_document(
    *,
    source_id,
    source_version,
    source_sha256,
    trace_count,
    samples_per_trace,
    sample_interval,
    partitions,
    index_object,
    array_prefix,
    geometry_revision=None,
):
    require(isinstance(partitions, dict) and partitions.get("partitionCount", 0) >= 1, "Provide partition_spec output.")
    require(len(source_sha256) == 64, "Source SHA-256 must be 64 hex characters.")
    return dict(
        kind="stratax-seismic-cloud-index/1",
        sourceId=source_id,
        sourceVersion=source_version,
        sourceSha256=source_sha256,
        geometryRevision=geometry_revision,
        dimensions=dict(traceCount=trace_count, samplesPerTrace=samples_per_trace, sampleInterval=sample_interval),
        partitions=partitions,
        objects=dict(sqliteIndex=index_object, zarrPrefix=array_prefix),
        limitations=[
            "Manifest identifies private shard objects; arrays are not embedded.",
            "Distributed reductions still require an approved execution profile.",
        ],
    )
