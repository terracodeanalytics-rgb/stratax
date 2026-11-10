"""Server-owned Google Batch profiles and conservative, version-bound field quotes."""
import hashlib
import json
import math
import re
from datetime import date

from pydantic import BaseModel, ConfigDict, Field, model_validator
from seismic_processing import require


class FieldExecution(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    profileId: str = Field(pattern=r'^[a-z][a-z0-9-]{0,63}$')
    outputLimitBytes: int = Field(ge=1024)
    scratchLimitBytes: int = Field(ge=1024)
    retentionDays: int = Field(ge=1, le=3650)
    parallelism: int = Field(default=1, ge=1, le=10000)


class FieldProfile(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True, allow_inf_nan=False)
    project: str = Field(pattern=r'^[a-z][a-z0-9-]{4,61}[a-z0-9]$')
    region: str = 'us-central1'
    serviceAccount: str = Field(pattern=r'^[a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com$')
    image: str = Field(pattern=r'^us-central1-docker\.pkg\.dev/[^\s]+@sha256:[a-f0-9]{64}$')
    machineType: str = Field(pattern=r'^[a-z0-9]+-[a-z0-9-]+$')
    cpu: int = Field(ge=1)
    memoryMib: int = Field(ge=1024)
    provisioningModel: str = 'SPOT'
    coupling: str = 'independent'
    accelerator: str | None = None
    acceleratorCount: int = Field(default=0, ge=0)
    maxSeconds: int = Field(ge=60, le=604800)
    maxTaskCount: int = Field(ge=1, le=100000)
    maxParallelism: int = Field(default=1, ge=1, le=10000)
    bootDiskGib: int = Field(ge=10)
    maximumAttempts: int = Field(default=2, ge=1, le=2)
    machineUsdPerSecond: float = Field(gt=0)
    acceleratorUsdPerSecond: float = Field(ge=0)
    diskGiBMonthUsd: float = Field(ge=0)
    storageGiBMonthUsd: float = Field(ge=0)
    classAUsdPer1000: float = Field(ge=0)
    classBUsdPer1000: float = Field(ge=0)
    firestoreReadUsdPer100000: float = Field(ge=0)
    firestoreWriteUsdPer100000: float = Field(ge=0)
    logGiBUsd: float = Field(ge=0)
    controlPlaneAllowanceUsd: float = Field(gt=0)
    maximumLogBytesPerTask: int = Field(ge=1024, le=1024**3)
    transferGiBUsd: float = Field(ge=0)
    retrievalGiBUsd: float = Field(ge=0)
    priceAsOf: str
    priceSource: str = Field(min_length=8)
    billingQuantumSeconds: int = Field(default=60, ge=1)
    startupSecondsAllowance: int = Field(default=300, ge=0, le=3600)
    shutdownSecondsAllowance: int = Field(default=120, ge=0, le=3600)
    maximumPriceAgeDays: int = Field(default=30, ge=1, le=90)

    @model_validator(mode='after')
    def policies(self):
        require(self.region == 'us-central1', 'Field profiles require explicit support before changing the compute region.')
        require(self.coupling in ('independent','mpi') and self.provisioningModel in ('SPOT','STANDARD'),
                'Choose independent or MPI coupling and a supported provisioning model.')
        require(self.provisioningModel == ('STANDARD' if self.coupling == 'mpi' else 'SPOT'),
                'Independent field partitions use Spot; tightly coupled MPI uses a reviewed standard profile.')
        require(self.accelerator is not None or self.acceleratorCount == 0, 'Declare the selected accelerator type.')
        require(self.accelerator is None or self.acceleratorCount > 0, 'Declare the selected accelerator count.')
        require(self.accelerator is None or self.acceleratorUsdPerSecond > 0, 'Accelerator pricing is missing.')
        require(self.maxParallelism <= self.maxTaskCount, 'Parallelism exceeds the profile task limit.')
        try:
            age = (date.today()-date.fromisoformat(self.priceAsOf)).days
        except ValueError as error:
            raise ValueError('Use an ISO date for reviewed Google Cloud pricing.') from error
        return self

    def require_current_pricing(self):
        age = (date.today()-date.fromisoformat(self.priceAsOf)).days
        require(0 <= age <= self.maximumPriceAgeDays, 'Refresh the reviewed Google Cloud pricing before estimating.')


def fingerprint(value):
    return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()


def index_plan(binding, manifest, parameters, execution, profile, storage_policy):
    """Produce arithmetic work units, not an in-memory list proportional to survey size."""
    require(profile.coupling == 'independent' and profile.accelerator is None,
            'Analytical indexing requires an independent CPU profile.')
    total = manifest['rowCount']
    first = parameters.get('firstTrace',0)
    count = parameters.get('traceCount',total-first)
    width = parameters.get('tracesPerPartition',64)
    levels = parameters.get('displayLevels',4)
    require(all(type(v) is int for v in (total,first,count,width,levels)) and total > 0
            and 0 <= first < total and 0 < count <= total-first and 1 <= width <= 512
            and 0 <= levels <= 12, 'Choose an explicit supported native indexing range and partition width.')
    partitions = math.ceil(count/width)
    per_task = max(1,math.ceil(partitions/profile.maxTaskCount))
    tasks = math.ceil(partitions/per_task)
    require(execution.parallelism <= min(tasks,profile.maxParallelism),
            'Indexing exceeds the reviewed task/concurrency profile.')
    require(isinstance(storage_policy,dict) and type(storage_policy.get('maximumBytes')) is int
            and storage_policy['maximumBytes'] > 0, 'An explicit seismic storage policy is required for field runs.')
    require(execution.outputLimitBytes <= storage_policy['maximumBytes']
            and execution.scratchLimitBytes <= profile.bootDiskGib*1024**3,
            'Requested output or scratch exceeds the configured seismic policy.')
    # SEG-Y rev0/1: signed/unsigned sample encodings expand to float64 plus masks,
    # display levels and object/range/geometry metadata. Use a conservative source upper bound.
    output_upper = binding['identity']['size']*16+count*4096+partitions*512*1024+2*1024**2
    require(execution.outputLimitBytes >= output_upper,
            'The approved output allowance is below the conservative lossless index estimate.')
    require(execution.scratchLimitBytes >= width*65535*24+64*1024**2,
            'The scratch allowance cannot hold a worst-case native partition and its display levels.')
    require(profile.memoryMib*1024**2 >= 256*1024**2+65535*24,
            'The CPU profile cannot hold bounded decoder/display workspaces.')
    input_location = binding['identity'].get('location') or storage_policy.get('sourceLocation')
    output_location = storage_policy.get('location')
    require(isinstance(input_location,str) and isinstance(output_location,str),
            'Record actual input/output bucket locations before estimating transfer costs.')
    colocated = input_location.lower() == output_location.lower() == profile.region
    transfer = 0 if colocated else binding['identity']['size']+output_upper
    # Include failed-attempt work, VM minimum billing, final metadata publication and disk time.
    seconds = math.ceil((profile.maxSeconds+profile.startupSecondsAllowance+
                         profile.shutdownSecondsAllowance)/profile.billingQuantumSeconds)*profile.billingQuantumSeconds
    attempts = profile.maximumAttempts
    vm_seconds = (tasks+1)*seconds*attempts
    native_pages = math.ceil(total/512)
    objects_upper = partitions*(48+levels*12)+math.ceil(partitions/256)*2+native_pages*2+8
    month_seconds = 30*24*3600
    components = dict(controlPlane=profile.controlPlaneAllowanceUsd,compute=vm_seconds*profile.machineUsdPerSecond,
        accelerators=vm_seconds*profile.acceleratorUsdPerSecond,
        scratch=vm_seconds*profile.bootDiskGib*profile.diskGiBMonthUsd/month_seconds,
        retainedOutput=execution.outputLimitBytes/1024**3*profile.storageGiBMonthUsd*execution.retentionDays/30,
        objectWrites=objects_upper*attempts*profile.classAUsdPer1000/1000,
        objectReads=(objects_upper*4+total*8)*attempts*profile.classBUsdPer1000/1000,
        firestoreReads=(partitions*16+native_pages*8+vm_seconds)*profile.firestoreReadUsdPer100000/100000,
        firestoreWrites=(partitions*8+native_pages*4+math.ceil(partitions/128))*attempts*profile.firestoreWriteUsdPer100000/100000,
        logs=(tasks+1)*attempts*profile.maximumLogBytesPerTask/1024**3*profile.logGiBUsd,
        transfer=transfer/1024**3*attempts*profile.transferGiBUsd,
        sourceRetrieval=binding['identity']['size']/1024**3*attempts*2*profile.retrievalGiBUsd)
    plan = dict(schemaVersion=1,engine='index-manifest',sourceVersion=binding['sourceVersion'],
        firstTrace=first,traceCount=count,tracesPerPartition=width,displayLevels=levels,
        taskCount=tasks,partitionCount=partitions,partitionsPerTask=per_task,
        parallelism=execution.parallelism,maximumAttempts=attempts,
        outputLimitBytes=execution.outputLimitBytes,scratchLimitBytes=execution.scratchLimitBytes,
        retentionDays=execution.retentionDays,profile=profile.model_dump(),pricingComponentsUsd=components,
        estimatedCeilingUsd=math.ceil(sum(components.values())*10000)/10000,
        sourceLocation=input_location,outputLocation=output_location,
        assumptions=['Worst-case task runtime and permitted infrastructure retry included.',
                     'Cloud billing confirmation is separate; no automatic standard-VM fallback.',
                     'Storage retention estimate does not authorize deletion of accepted or recovery assets.'])
    plan['fingerprint'] = fingerprint(plan)
    return plan


def reuse_cost(profile,input_bytes,retention_days):
    p = FieldProfile(**profile)
    parts = dict(controlPlane=p.controlPlaneAllowanceUsd,
        metadataStorage=input_bytes/1024**3*p.storageGiBMonthUsd*retention_days/30,
        objectWrites=p.classAUsdPer1000/1000,objectReads=8*p.classBUsdPer1000/1000,
        firestoreReads=256*p.firestoreReadUsdPer100000/100000,
        firestoreWrites=8*p.firestoreWriteUsdPer100000/100000)
    return parts,math.ceil(sum(parts.values())*10000)/10000


def batch_job(plan, run_path, task_manifest):
    p = FieldProfile(**plan['profile'])
    require(plan['fingerprint'] == fingerprint({k:v for k,v in plan.items() if k != 'fingerprint'}),
            'Field execution plan changed after review.')
    require(re.fullmatch(r'stratax_projects/[\w-]{1,128}/records/[\w-]{1,100}/seismicRuns/sx-[a-f0-9]{32}',run_path),
            'Invalid field run scope.')
    policy = dict(machineType=p.machineType,provisioningModel=p.provisioningModel,
                  bootDisk=dict(type='pd-balanced',sizeGb=p.bootDiskGib))
    if p.accelerator:
        policy['accelerators']=[dict(type=p.accelerator,count=p.acceleratorCount)]
    task = dict(maxRetryCount=plan['maximumAttempts']-1,maxRunDuration=f'{p.maxSeconds}s',
        computeResource=dict(cpuMilli=p.cpu*1000,memoryMib=p.memoryMib),
        environment=dict(variables=dict(STRATAX_SEISMIC_RUN=run_path,
            STRATAX_SEISMIC_FIELD_MANIFEST=json.dumps(task_manifest,separators=(',',':')))),
        lifecyclePolicies=[dict(action='RETRY_TASK',actionCondition=dict(exitCodes=[75,50001,50002,50003,50006]))],
        runnables=[dict(container=dict(imageUri=p.image,commands=['python','-m','seismic_field_worker']))])
    return dict(taskGroups=[dict(taskCount=plan['taskCount'],parallelism=plan['parallelism'],taskCountPerNode=1,taskSpec=task)],
        allocationPolicy=dict(location=dict(allowedLocations=['regions/'+p.region]),
            instances=[dict(policy=policy)],serviceAccount=dict(email=p.serviceAccount)),
        logsPolicy=dict(destination='CLOUD_LOGGING'))
