"""SI-facing adapter to the pinned open acoustic operators, not a field RTM/FWI service."""
import importlib.metadata

import numpy as np

from seismic_processing import require


class AcousticSession:
    def __init__(self,velocity,spacing,origin,source,receivers,*,dt,end_seconds,frequency_hz,
                 maximum_velocity,nbl=20,space_order=4,maximum_saved_bytes=512*1024**2):
        from examples.seismic import Model,AcquisitionGeometry
        from examples.seismic.acoustic import AcousticWaveSolver

        vp=np.asarray(velocity,dtype=np.float64)
        self.shape=vp.shape;self.dim=vp.ndim
        require(self.dim in (2,3) and min(vp.shape)>=9,'Provide a genuine 2D or 3D acoustic velocity model.')
        require(np.all(np.isfinite(vp)) and np.all(vp>0) and np.isfinite(maximum_velocity) and np.max(vp)<=maximum_velocity,'Review finite positive interval velocities and their upper bound in m/s.')
        spacing=np.asarray(spacing,dtype=float);origin=np.asarray(origin,dtype=float)
        require(spacing.shape==origin.shape==(self.dim,) and np.all(np.isfinite(spacing)) and np.all(spacing>0) and np.all(np.isfinite(origin)),'Confirm one SI spacing and origin per model axis.')
        require(type(nbl) is int and nbl>=8 and space_order in (2,4,6,8),'Confirm absorbing-boundary width and a supported finite-difference order.')
        require(np.isfinite(dt) and 0<dt<=.4*min(spacing)/(np.sqrt(self.dim)*maximum_velocity),'The explicit time step exceeds the conservative velocity-bound stability limit.')
        require(np.isfinite(end_seconds) and end_seconds>dt and np.isfinite(frequency_hz) and frequency_hz>0,'Declare a positive recording duration and Ricker modelling frequency.')
        source=np.asarray(source,dtype=float);receivers=np.asarray(receivers,dtype=float)
        require(source.shape==(self.dim,) and receivers.ndim==2 and receivers.shape[1]==self.dim and len(receivers)>0,'Provide one shot and its explicitly located receivers.')
        positions=np.vstack([source,receivers]);upper=origin+(np.asarray(vp.shape)-1)*spacing
        require(np.all(np.isfinite(positions)) and np.all(positions>=origin) and np.all(positions<=upper),'Source/receiver coordinates leave the declared physical model; no positions were manufactured.')
        require(type(maximum_saved_bytes) is int and maximum_saved_bytes>0,'Declare a positive approved saved-wavefield memory budget.')
        self.dt=float(dt);self.maximum_velocity=float(maximum_velocity);self.maximum_saved_bytes=maximum_saved_bytes
        # The upstream seismic examples use metres, milliseconds and kilometres/second.
        self.model=Model(vp=vp/1000,origin=tuple(origin),shape=vp.shape,spacing=tuple(spacing),
                         space_order=space_order,nbl=nbl,dtype=np.float64,bcs='damp')
        self.geometry=AcquisitionGeometry(self.model,receivers,source.reshape(1,-1),0,end_seconds*1000,
                                         src_type='Ricker',f0=frequency_hz/1000).resample(dt*1000)
        self.solver=AcousticWaveSolver(self.model,self.geometry,space_order=space_order,kernel='OT2')
        self.nt=self.geometry.time_axis.num
        self.crop=tuple(slice(nbl,nbl+n) for n in self.shape)
        self.saved_bytes=self.nt*int(np.prod(np.asarray(vp.shape)+2*nbl))*8
        self.provenance=dict(engine='Devito',engineVersion=importlib.metadata.version('devito'),
                             dimension=self.dim,shape=list(self.shape),precision='float64',spacingMetres=spacing.tolist(),
                             originMetres=origin.tolist(),sourceMetres=source.tolist(),receiversMetres=receivers.tolist(),
                             sampleIntervalSeconds=self.dt,samples=self.nt,source=dict(kind='ricker',frequencyHz=frequency_hz),
                             boundary=dict(kind='upstream-damping-sponge',cells=nbl),spaceOrder=space_order,
                             engineUnits=dict(time='ms',velocity='km/s',coordinates='m'),fieldScaleQualified=False)

    def set_velocity(self,velocity):
        vp=np.asarray(velocity,dtype=np.float64)
        require(vp.shape==self.shape and np.all(np.isfinite(vp)) and np.all(vp>0) and np.max(vp)<=self.maximum_velocity,'The proposed interval velocity leaves the model shape or reviewed positive velocity bounds.')
        self.model.update('vp',vp/1000)

    def _receiver(self,values):
        data=np.asarray(values,dtype=np.float64)
        require(data.shape==(self.geometry.nrec,self.nt) and np.all(np.isfinite(data)),'Supply finite observations on this exact receiver/time grid; no resampling was inferred.')
        rec=self.geometry.new_rec()
        rec.data[:]=data.T
        return rec

    def forward(self,*,save=False):
        from devito import TimeFunction
        require(not save or self.saved_bytes<=self.maximum_saved_bytes,'Saved wavefields exceed the approved memory budget. Use a qualified checkpoint/distributed profile.')
        u=TimeFunction(name='forward_wavefield',grid=self.model.grid,save=self.nt if save else None,
                       time_order=2,space_order=self.solver.space_order)
        u.data[:]=0
        rec,u,_=self.solver.forward(u=u,save=save,dt=self.dt*1000)
        return np.array(rec.data.T,copy=True),u

    def source_adjoint(self,values):
        from devito import TimeFunction
        v=TimeFunction(name='source_backprop',grid=self.model.grid,time_order=2,space_order=self.solver.space_order)
        v.data[:]=0
        src,_,_=self.solver.adjoint(rec=self._receiver(values),v=v,dt=self.dt*1000)
        return np.array(src.data[:,0],copy=True)

    def born(self,mass_perturbation):
        from devito import Function,TimeFunction
        dm=np.asarray(mass_perturbation,dtype=np.float64)
        require(dm.shape==self.shape and np.all(np.isfinite(dm)),'Provide a finite squared-slowness perturbation in s²/m² on this model.')
        # BornOperator declares dm with zero halo. Matching that layout is
        # essential: passing a default-halo Function shifts the perturbation.
        perturbation=Function(name='dm',grid=self.model.grid,dtype=np.float64,space_order=0)
        perturbation.data[:]=0
        perturbation.data[self.crop]=dm*1e6
        u=TimeFunction(name='born_background',grid=self.model.grid,time_order=2,space_order=self.solver.space_order)
        scattered=TimeFunction(name='born_scattered',grid=self.model.grid,time_order=2,space_order=self.solver.space_order)
        u.data[:]=0;scattered.data[:]=0
        rec,_,_,_=self.solver.jacobian(perturbation,u=u,U=scattered,dt=self.dt*1000)
        return np.array(rec.data.T,copy=True)

    def mass_adjoint(self,values,wavefield):
        from devito import Function,TimeFunction
        v=TimeFunction(name='mass_backprop',grid=self.model.grid,time_order=2,space_order=self.solver.space_order)
        gradient=Function(name='mass_gradient',grid=self.model.grid,dtype=np.float64)
        v.data[:]=0;gradient.data[:]=0
        gradient,_=self.solver.jacobian_adjoint(rec=self._receiver(values),u=wavefield,v=v,grad=gradient,dt=self.dt*1000)
        return np.array(gradient.data[self.crop],copy=True)*1e6

    def objective_gradient(self,observed):
        observations=self._receiver(observed)
        predicted,wavefield=self.forward(save=True)
        residual=predicted-np.asarray(observations.data.T,dtype=float)
        gradient=self.mass_adjoint(residual,wavefield)
        return .5*float(np.sum(residual**2)),gradient,predicted
