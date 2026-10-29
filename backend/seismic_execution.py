"""Bound estimates and Batch requests. The provider never receives client-authored commands."""
import hashlib
import json
import math
import os
import re

from pydantic import BaseModel, ConfigDict, Field

from seismic_graph import Graph, validate_graph


def execution_capabilities():
    try:
        profile = json.loads(os.environ.get('STRATAX_SEISMIC_BATCH_PROFILE', '{}'))
        available = bool(isinstance(profile, dict) and re.search(r'@sha256:[a-f0-9]{64}$', profile.get('image', '')) and
                         all(k in profile for k in ('vmHourlyUsd', 'diskGibHourUsd', 'priceAsOf', 'priceSource', 'machineType', 'cpuMilli', 'memoryMib', 'maxSeconds', 'bootDiskGib')) and os.environ.get('STRATAX_SEISMIC_BATCH_ACCOUNT'))
    except (ValueError, TypeError):
        available = False
    return dict(id='analytical-preview', available=available, maximumCells=2_000_000,
                operators=['detrend', 'bandpass', 'resample', 'static-shift'], fieldScaleQualified=False)


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
    if not profile or not re.search(r'@sha256:[a-f0-9]{64}$', profile.get('image', '')):
        raise ValueError("The seismic Batch worker requires a commissioned immutable image before estimates can be approved.")
    required = ('machineType', 'cpuMilli', 'memoryMib', 'maxSeconds', 'bootDiskGib', 'vmHourlyUsd', 'diskGibHourUsd', 'priceAsOf', 'priceSource')
    if any(k not in profile for k in required):
        raise ValueError("The worker resource and pricing profile is incomplete; no paid job was submitted.")
    for name in ('cpuMilli', 'memoryMib', 'maxSeconds', 'bootDiskGib'):
        if type(profile[name]) is not int or profile[name] <= 0:
            raise ValueError("Worker resource limits must be positive reviewed integers.")
    for name in ('vmHourlyUsd', 'diskGibHourUsd'):
        if type(profile[name]) not in (int, float) or not math.isfinite(profile[name]) or profile[name] < 0:
            raise ValueError("Worker rates must be finite, nonnegative and reviewed.")
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
    quote = {k: profile[k] for k in required} | dict(image=profile['image'])
    quote['estimatedComputeAndBootDiskUsd'] = math.ceil((profile['vmHourlyUsd']+profile['bootDiskGib']*profile['diskGibHourUsd'])*profile['maxSeconds']/3600*10000)/10000
    value = dict(kind='analytical-preview', graphFingerprint=graph_hash, sourceVersion=graph.sourceVersion,
                 selection=selection.model_dump(), sourceDimensions=dimensions, outputShape=list(output[:2]),
                 outputSampleInterval=output[2], estimatedPeakMemoryBytes=memory_bytes,
                 outputReservationBytes=output_bytes, checkpointReservationBytes=checkpoint_bytes,
                 scratchBytes=memory_bytes+output_bytes*2,
                 resources=quote, taskCount=1, maximumRetries=0,
                 limitations=['Preview only; no field-scale capacity qualification.',
                              'Compute estimate excludes persistent artifact storage, transfer and provider shutdown/billing delays; project storage admission remains separate.'])
    return value | dict(fingerprint=digest(value))


def batch_request(project, region, service_account, run_path, run_id, estimate_value):
    r = estimate_value['resources']
    return dict(taskGroups=[dict(taskCount=1, parallelism=1, taskSpec=dict(
        runnables=[dict(container=dict(imageUri=r['image'], commands=['python', 'seismic_batch_worker.py']),
                        environment=dict(variables=dict(STRATAX_SEISMIC_RUN=run_path, GOOGLE_CLOUD_PROJECT=project)))],
        computeResource=dict(cpuMilli=r['cpuMilli'], memoryMib=r['memoryMib']),
        maxRunDuration=str(r['maxSeconds'])+'s', maxRetryCount=0))],
        allocationPolicy=dict(instances=[dict(policy=dict(machineType=r['machineType'], provisioningModel='STANDARD',
                                                         bootDisk=dict(sizeGb=r['bootDiskGib'], type='pd-balanced')))],
                              location=dict(allowedLocations=['regions/'+region]),
                              serviceAccount=dict(email=service_account, scopes=['https://www.googleapis.com/auth/cloud-platform'])),
        logsPolicy=dict(destination='CLOUD_LOGGING'), labels=dict(application='stratax', workload='seismic-preview', run=run_id))
