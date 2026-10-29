"""Bound estimates and on-demand Cloud Run Job dispatch. No standby VMs or disks."""
import hashlib
import json
import math
import os
import re

from pydantic import BaseModel, ConfigDict, Field

from seismic_graph import OPERATORS, Graph, validate_graph
from seismic_profiles import PREVIEW_PROFILE_ID, batch_available, estimate_ceiling_usd, profile_catalog, validate_batch_profile


def execution_capabilities():
    available = batch_available()
    return dict(
        id=PREVIEW_PROFILE_ID,
        available=available,
        maximumCells=2_000_000,
        operators=sorted(OPERATORS),
        fieldScaleQualified=False,
        profiles=profile_catalog(),
    )


class Selection(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    firstTrace: int = Field(ge=0)
    traceCount: int = Field(ge=1, le=512)
    firstSample: int = Field(ge=0)
    sampleCount: int = Field(ge=1, le=4096)


class EstimateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    graphId: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    revision: int = Field(ge=1)
    selection: Selection


class RunRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    estimateId: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    estimateFingerprint: str = Field(min_length=64, max_length=64)
    idempotencyKey: str = Field(pattern=r"^[A-Za-z0-9_-]{8,100}$")
    reviewed: bool = False
    restartRunId: str | None = Field(default=None, pattern=r"^[A-Za-z0-9_-]{1,100}$")


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()).hexdigest()


def estimate(graph, selection, dimensions, profile):
    """A bounded analytical preview, explicitly distinct from a field-scale graph run."""
    if isinstance(selection, dict):
        selection = Selection(**selection)
    graph = Graph(**graph) if isinstance(graph, dict) else graph
    ordered, graph_hash = validate_graph(graph)
    if selection.traceCount*selection.sampleCount > 2_000_000 or selection.firstTrace+selection.traceCount > dimensions['traceCount'] or selection.firstSample+selection.sampleCount > dimensions['samplesPerTrace']:
        raise ValueError("Choose an analytical preview inside the retained source and the two-million-cell budget.")
    try:
        profile = validate_batch_profile(profile or {}, require_account=False)
    except ValueError as error:
        raise ValueError("The seismic Cloud Run worker requires a commissioned immutable image and complete pricing before estimates can be approved.") from error
    required = ('cpu', 'memoryMib', 'maxSeconds', 'vcpuSecondUsd', 'memoryGibSecondUsd', 'priceAsOf', 'priceSource')
    shapes = {'source': (selection.traceCount, selection.sampleCount, dimensions['sampleInterval'])}
    for node in ordered:
        traces, samples, dt = shapes[node.input]
        p = node.parameters
        if node.operator == 'bandpass' and p['high'] >= .5/dt:
            raise ValueError("A bandpass frequency exceeds this step's Nyquist frequency.")
        if node.operator == 'static-shift' and len(p['shifts']) != traces:
            raise ValueError("Provide one reviewed static shift per selected trace.")
        if node.operator == 'nmo':
            if len(p['offsets']) != traces or isinstance(p['velocity'], list) and len(p['velocity']) != samples:
                raise ValueError("NMO offsets and RMS/stacking velocity must match the selected gather and sample axis.")
        if node.operator == 'stack':
            weights = p.get('weights')
            if weights is not None and len(weights) != traces:
                raise ValueError("Stack weights must match the selected trace count.")
            traces = 1
        if node.operator == 'resample':
            up, down = p.get('up', 1), p.get('down', 1)
            samples = math.ceil(samples*up/down)
            dt *= down/up
        if node.operator == 'rmo-scan':
            traces = len(p['velocities'])
        if node.operator == 'kirchhoff-psdm':
            dt *= p['velocity'] / 2
        if samples*traces > 2_000_000:
            raise ValueError("An intermediate step exceeds the analytical preview cell budget. Use the field-scale execution profile.")
        shapes[node.id] = (traces, samples, dt)
    peak_cells = max(t*s for t, s, _ in shapes.values())
    # Account for live branches and FFT/filter workspaces rather than only output size.
    history_bytes = dimensions.get('historyBytes', 0)
    memory_bytes = (len(shapes)*9+128)*peak_cells+history_bytes*(len(shapes)+1)
    if memory_bytes > profile['memoryMib']*1024**2*.75:
        raise ValueError("The graph's conservative memory estimate exceeds this approved worker profile.")
    output = shapes[graph.output]
    output_bytes = output[0]*output[1]*32 + 1024**2
    consumers = {'source': 0} | {n.id: 0 for n in ordered}
    for n in ordered:
        consumers[n.input] += 1
    live = {'source'}
    checkpoint_bytes = 0
    for n in ordered:
        live.add(n.id)
        consumers[n.input] -= 1
        if not consumers[n.input]:
            live.discard(n.input)
        checkpoint_bytes += sum(shapes[k][0]*shapes[k][1]*9 for k in live)+len(live)*(history_bytes+2*len(json.dumps(graph.model_dump()).encode())+65536)
    quote = {k: profile[k] for k in required} | dict(image=profile['image'], provider='cloud-run-jobs', minInstances=0, standby=False)
    quote['estimatedComputeUsd'] = estimate_ceiling_usd(profile)
    value = dict(kind='analytical-preview', graphFingerprint=graph_hash, sourceVersion=graph.sourceVersion,
                 selection=selection.model_dump(), sourceDimensions=dimensions, outputShape=list(output[:2]),
                 outputSampleInterval=output[2], estimatedPeakMemoryBytes=memory_bytes,
                 outputReservationBytes=output_bytes, checkpointReservationBytes=checkpoint_bytes,
                 scratchBytes=memory_bytes+output_bytes*2,
                 resources=quote, taskCount=1, maximumRetries=0,
                 limitations=['Preview only; no field-scale capacity qualification.',
                              'On-demand Cloud Run Jobs only (min instances 0); artifacts stay on GCS.',
                              'Compute estimate excludes persistent GCS storage, transfer and provider shutdown/billing delays; project storage admission remains separate.'])
    return value | dict(fingerprint=digest(value))


def batch_request(project, region, service_account, run_path, run_id, estimate_value, job_name='stratax-seismic-worker'):
    """Build the Cloud Run Jobs :run override payload (compatibility name retained)."""
    r = estimate_value['resources']
    return dict(
        provider='cloud-run-jobs',
        job=f'projects/{project}/locations/{region}/jobs/{job_name}',
        overrides=dict(containerOverrides=[dict(env=[
            dict(name='STRATAX_SEISMIC_RUN', value=run_path),
            dict(name='GOOGLE_CLOUD_PROJECT', value=project),
            dict(name='STRATAX_SEISMIC_RUN_ID', value=run_id),
        ])]),
        resources=dict(cpu=r['cpu'], memoryMib=r['memoryMib'], maxSeconds=r['maxSeconds'], image=r['image'],
                       minInstances=0, standby=False, serviceAccount=service_account),
    )
