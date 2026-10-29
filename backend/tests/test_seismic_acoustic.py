import json
import os
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from seismic_acoustic import AcousticSession

pytestmark=pytest.mark.skipif(os.environ.get('STRATAX_COMPILED_ACOUSTIC_TESTS')!='1',reason='Requires the isolated pinned Linux compiler profile')
REFERENCE=json.loads((Path(__file__).parent/'fixtures/acoustic-reference-v1.json').read_text())


def session(dim):
    f=REFERENCE;n=f['shapePerAxis'];shape=(n,)*dim;spacing=f['spacingMetres']
    source=np.full(dim,(n//2)*spacing,dtype=float);source[-1]=30
    receivers=np.tile(source,(3,1));receivers[:,0]=[40,80,120];receivers[:,-1]=40
    return AcousticSession(np.full(shape,f['velocityMetresPerSecond']),[spacing]*dim,[0]*dim,source,receivers,
                           dt=f['timeStepSeconds'],end_seconds=f['endSeconds'],frequency_hz=f['sourceFrequencyHz'],
                           maximum_velocity=f['maximumVelocityMetresPerSecond'],nbl=f['absorbingBoundaryCells'],
                           space_order=f['spaceOrder'])


@pytest.mark.parametrize('dim',REFERENCE['dimensions'])
def test_source_and_born_adjoint_in_actual_spatial_dimensions(dim):
    s=session(dim);rng=np.random.default_rng(38+dim)
    predicted,wavefield=s.forward(save=True)
    assert predicted.shape==(3,s.nt) and np.max(np.abs(predicted))>0 and np.all(np.isfinite(predicted))
    observations=rng.normal(size=predicted.shape)
    lhs=float(np.vdot(predicted,observations))
    rhs=float(np.vdot(s.geometry.src.data[:,0],s.source_adjoint(observations)))
    error=abs(lhs-rhs)/max(abs(lhs),abs(rhs),1e-30)
    print(json.dumps(dict(case='source-adjoint',dimension=dim,relativeError=error)),flush=True)
    assert error<=REFERENCE['forwardAdjointRelativeTolerance']
    perturbation=np.zeros(s.shape);perturbation[(slice(5,12),)*dim]=rng.normal(size=(7,)*dim)*1e-9
    born=s.born(perturbation);gradient=s.mass_adjoint(observations,wavefield)
    lhs=float(np.vdot(born,observations));rhs=float(np.vdot(perturbation,gradient))
    error=abs(lhs-rhs)/max(abs(lhs),abs(rhs),1e-30)
    print(json.dumps(dict(case='born-adjoint',dimension=dim,relativeError=error)),flush=True)
    assert error<=REFERENCE['bornAdjointRelativeTolerance']


@pytest.mark.parametrize('dim',REFERENCE['dimensions'])
def test_objective_gradient_has_second_order_taylor_remainder(dim):
    s=session(dim);vp=np.full(s.shape,REFERENCE['velocityMetresPerSecond'],dtype=float)
    target=vp.copy();target[(slice(5,12),)*dim]+=100
    s.set_velocity(target);observed,_=s.forward()
    s.set_velocity(vp);objective,gradient,_=s.objective_gradient(observed)
    direction=np.zeros(s.shape);direction[(slice(5,12),)*dim]=1e-8
    derivative=float(np.vdot(gradient,direction));remainders=[]
    for step in REFERENCE['taylorStepSizes']:
        s.set_velocity(1/np.sqrt(1/vp**2+step*direction))
        predicted,_=s.forward();value=.5*float(np.sum((predicted-observed)**2))
        remainders.append(abs(value-objective-step*derivative))
    slopes=np.log2(np.asarray(remainders[:-1])/remainders[1:])
    print(json.dumps(dict(case='taylor',dimension=dim,remainders=remainders,slopes=slopes.tolist())),flush=True)
    lo,hi=REFERENCE['taylorSlopeRange']
    assert np.all((slopes>=lo)&(slopes<=hi))


@pytest.mark.parametrize('dim', REFERENCE['dimensions'])
def test_rtm_correlation_and_velocity_update_descent(dim):
    from seismic_rtm_work import rtm_image, fwi_gradient_step
    s = session(dim)
    initial = np.full(s.shape, REFERENCE['velocityMetresPerSecond'], dtype=float)
    target = initial.copy(); target[(slice(5, 12),)*dim] += 100
    s.set_velocity(target); observed, _ = s.forward()
    s.set_velocity(initial)
    image = rtm_image(s, observed)
    assert image['image'].shape == s.shape
    assert np.all(np.isfinite(image['image'])) and np.max(np.abs(image['image'])) > 0
    assert np.max(image['illumination']) > 0
    step = fwi_gradient_step(s, observed, max_update_fraction=.01)
    assert step['accepted'] and step['objectiveAfter'] < step['objective']
    np.testing.assert_allclose(s.model.vp.data[s.crop] * 1000, initial)
    print(json.dumps(dict(case='rtm-fwi-descent', dimension=dim, before=step['objective'],
                          after=step['objectiveAfter'], lineSearch=step['lineSearch'])), flush=True)
