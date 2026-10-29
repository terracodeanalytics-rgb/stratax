import copy
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
import pytest

from seismic_execution import estimate, batch_request
from seismic_graph import execute_graph
from seismic_processing import TraceBlock
from seismic_batch_worker import pack_checkpoint, unpack_checkpoint


def graph():
    return dict(sourceId='source', sourceVersion='fixed-version', domain='TWT', domainConfirmed=True,
                amplitudeUnit='recorded amplitude', nodes=[dict(id='centre', operator='detrend', input='source', parameters=dict(mode='constant')),
                dict(id='sample', operator='resample', input='centre', parameters=dict(up=1, down=2))], output='sample')


def profile():
    return dict(image='us-central1-docker.pkg.dev/project/repo/worker@sha256:'+'a'*64, machineType='e2-standard-2', cpuMilli=2000,
                memoryMib=8192, maxSeconds=900, bootDiskGib=10, vmHourlyUsd=.1, diskGibHourUsd=.0001,
                priceAsOf='fixture-only-not-a-market-price', priceSource='independent test fixture')


def test_estimate_binds_inputs_limits_price_and_image():
    selection=dict(firstTrace=0, traceCount=3, firstSample=0, sampleCount=128)
    dimensions=dict(traceCount=3, samplesPerTrace=128, sampleInterval=.002)
    result = estimate(graph(), selection, dimensions, profile())
    assert result['outputShape'] == [3,64] and result['outputSampleInterval'] == .004
    assert result['checkpointReservationBytes'] > 0 and result['taskCount'] == 1
    assert estimate(graph(), selection | dict(sampleCount=100), dimensions, profile())['fingerprint'] != result['fingerprint']
    assert estimate(graph(), selection, dimensions, profile() | dict(vmHourlyUsd=.2))['fingerprint'] != result['fingerprint']
    with pytest.raises(ValueError, match='retained source'):
        estimate(graph(), selection | dict(firstTrace=2), dimensions, profile())
    bad=graph();bad['nodes'][0].update(operator='bandpass', parameters=dict(low=5, high=300))
    with pytest.raises(ValueError, match='Nyquist'):
        estimate(bad, selection, dimensions, profile())
    request = batch_request('project', 'us-central1', 'worker@project.iam.gserviceaccount.com', 'safe/run', 'sx-test', result)
    task=request['taskGroups'][0]['taskSpec']
    assert task['maxRetryCount'] == 0 and task['maxRunDuration'] == '900s'
    assert task['runnables'][0]['container']['commands'] == ['python','seismic_batch_worker.py']


def test_checkpoint_restart_matches_uninterrupted_solution_and_rejects_mismatch():
    original=TraceBlock(np.arange(384).reshape(3,128), .002)
    saved=[]
    def checkpoint(state):
        saved.append(pack_checkpoint(state))
        if state['completed'] == 1:
            raise RuntimeError('simulated infrastructure interruption')
    with pytest.raises(RuntimeError, match='interruption'):
        execute_graph(graph(), original, checkpoint=checkpoint)
    resumed = unpack_checkpoint(saved[0], 1024**2)
    output, _ = execute_graph(graph(), original, resumed=resumed)
    expected, _ = execute_graph(graph(), original)
    np.testing.assert_allclose(output.samples, expected.samples, rtol=1e-8)
    assert output.history == expected.history
    changed=copy.deepcopy(graph());changed['nodes'][0]['parameters']['mode']='linear'
    with pytest.raises(ValueError, match='checkpoint'):
        execute_graph(changed, original, resumed=resumed)
