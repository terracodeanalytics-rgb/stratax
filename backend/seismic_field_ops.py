"""Geometry-explicit processing operations for 2D and 3D acquisition."""
import numpy as np
from scipy import signal
from seismic_processing import TraceBlock,require,nmo,stack,semblance,elevation_statics,static_shift


def land_operation(body,*,cancelled=lambda:False):
    operation=body['operation']
    if operation=='fk-volume':
        data=np.asarray(body['volume'],float);spacing=np.asarray(body['spacing'],float);dt=float(body['dt'])
        require(data.ndim==3 and data.size<=2_000_000 and np.all(np.isfinite(data)),'Provide a complete 3D spatial/time volume.')
        require(spacing.shape==(2,) and np.all(np.isfinite(spacing)) and np.all(spacing>0) and np.isfinite(dt) and dt>0,
                'Provide two physical spatial increments and time sampling.')
        velocity=float(body['minimumVelocity']);require(np.isfinite(velocity) and velocity>0,'Declare a positive rejection velocity.')
        kx=np.fft.fftfreq(data.shape[0],spacing[0])[:,None,None]
        ky=np.fft.fftfreq(data.shape[1],spacing[1])[None,:,None]
        frequency=np.fft.rfftfreq(data.shape[-1],dt)[None,None,:]
        ratio=velocity*np.sqrt(kx*kx+ky*ky)/np.maximum(frequency,np.finfo(float).eps)
        transition=float(body.get('transitionFraction',.1));require(0<transition<=1,'Use a positive tapered FK transition no greater than one.')
        weight=np.clip((1+transition-ratio)/transition,0,1);weight=.5-.5*np.cos(np.pi*weight)
        weight[:,:,0]=1
        output=np.fft.irfftn(np.fft.rfftn(data)*weight,s=data.shape)
        return dict(volume=output,dimension=3,method='physical-kx-ky-frequency-cone',spacingMetres=spacing,sampleInterval=dt)
    block=TraceBlock(body['samples'],body['dt'],body.get('start',0),history=body.get('history',[]))
    if operation=='semblance':return dict(semblance=np.asarray(semblance(block,body['offsets'],body['velocities'],body.get('window',11),body.get('maxStretch',.3))))
    if operation=='elevation-statics':
        shifts=elevation_statics(body['sourceElevations'],body['receiverElevations'],body['datum'],body['replacementVelocity'])
        return dict(samples=static_shift(block,shifts).samples,shifts=shifts,unit='s')
    if operation=='surface-consistent-statics':
        from seismic_statics import fit_surface_statics
        result=fit_surface_statics(body['observedTimes'],body['predictedTimes'],body['sourceIds'],body['receiverIds'],
            maximum_shift_seconds=body['maximumShiftSeconds'],regularization=body.get('regularization',.001))
        result['samples']=static_shift(block,result['correctionShifts']).samples
        return result
    if operation=='cmp-stack':
        require(body.get('geometryReviewed') is True,'Review physical gather identities before CMP processing.')
        bins=np.asarray(body['cmpIds']);offsets=np.asarray(body['offsets'],float)
        require(bins.shape==offsets.shape==(len(block.samples),) and np.all(np.isfinite(offsets)),'Provide one CMP identity and offset per trace.')
        velocity=np.asarray(body['velocity'],float);velocity=float(velocity) if velocity.ndim==0 else velocity
        output=[];fold=[];labels=[]
        weights=np.asarray(body.get('weights',np.ones(len(bins))),float)
        require(weights.shape==bins.shape and np.all(np.isfinite(weights)) and np.all(weights>=0),'Provide nonnegative finite trace weights.')
        for label in np.unique(bins):
            require(not cancelled(),'CMP processing cancelled between gathers.')
            selected=np.flatnonzero(bins==label);gather=TraceBlock(block.samples[selected],block.dt,block.start,mask=block.mask[selected],history=block.history)
            corrected=nmo(gather,offsets[selected],velocity,body.get('maxStretch',.3))
            stacked,support=stack(corrected,weights[selected])
            output.append(stacked.samples[0]);fold.append(support);labels.append(label.item() if isinstance(label,np.generic) else label)
        return dict(samples=np.asarray(output),fold=np.asarray(fold),cmpIds=labels,dt=block.dt,start=block.start,
                    history=[*block.history,dict(method='reviewed-cmp-nmo-weighted-stack')])
    raise ValueError('Choose fk-volume, semblance, elevation-statics, surface-consistent-statics or cmp-stack.')
