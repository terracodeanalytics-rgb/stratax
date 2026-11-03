"""Complete calibration/composite/synthetic tie operations; proposals never replace sources."""
import csv
import io

import numpy as np

from seismic_processing import require,synthetic,finite_number
from seismic_tie_calibration import calibration,constrained_edit,trajectory_logs,quality,increasing,vector
from seismic_tie_wavelet import estimate_wavelet,assess_wavelet
from seismic_wavelets import wavelet_operation


def composite_trace(view,xy,sample_twt,frame,maximum_distance,interpolation,cancelled=lambda:False,checkpoint=lambda value:None,resumed=None):
    from seismic_point_sampler import PointSampler
    from seismic_crs import transform_xy
    times=increasing(sample_twt,'Synthetic TWT axis')
    require(view.get('sampleDomain')=='TWT' and view.get('sampleUnit')=='s',
            'A conventional reflection tie requires a declared TWT seismic source.')
    path=np.asarray(xy,float)
    require(path.shape==(len(times),2) and np.all(np.isfinite(path)), 'Provide one actual well position per TWT sample.')
    axis=np.asarray(view['axes'][2],float)
    require(len(axis)>=2 and np.all(np.diff(axis)>0), 'The seismic sample axis must increase.')
    values=np.full(len(times),np.nan);validity=np.zeros(len(times),bool)
    sampler=PointSampler(view,maximum_distance,interpolation)
    physical=np.asarray(transform_xy(path,frame,view['coordinateFrame'],engine='pyproj'),float)
    positions=np.interp(times,axis,np.arange(len(axis)),left=np.nan,right=np.nan)
    completed=0
    if resumed:
        require(resumed.get('kind')=='well-tie-composite/1', 'The checkpoint does not belong to this extraction operation.')
        completed=resumed['completedSamples']
        require(type(completed) is int and 0<=completed<=len(times)
                and np.shape(resumed['seismic'])==np.shape(resumed['validity'])==(completed,), 'Composite checkpoint support is invalid.')
        values[:completed]=resumed['seismic'];validity[:completed]=resumed['validity']
    previous=completed;spacing=max(4096,(len(times)+7)//8)
    for start in range(completed,len(times),4096):
        require(not cancelled(), 'Well composite extraction cancelled.')
        stop=min(len(times),start+4096)
        values[start:stop],validity[start:stop],_,_=sampler.paired(physical[start:stop],positions[start:stop])
        if stop-previous>=spacing or stop==len(times):
            checkpoint(dict(kind='well-tie-composite/1',completedSamples=stop,seismic=values[:stop].copy(),validity=validity[:stop].copy()))
            previous=stop
    return dict(seismic=values,validity=validity,sampleTwt=times,wellXY=path,
                interpolation=interpolation,timeInterpolation='linear',maximumDistanceMetres=maximum_distance)


def tie_workflow(body,*,cancelled=lambda:False,checkpoint=lambda value:None,resumed=None):
    require(body.get('referencesConfirmed') is True, 'Review well/seismic references and units before tying.')
    units=body['units']
    require(units==dict(depth='m',sonic='s/m',density='kg/m^3',time='s'), 'Declare SI log/time/density units.')
    view=body['view']
    require(body.get('checkshotDepthDomain')=='TVD' and view.get('referenceDatum')==body['referenceDatum'],
            'Checkshots and seismic must use the declared TVD/time datum; review explicit datum corrections first.')
    original_depth,tvd,xy=trajectory_logs(body,view['coordinateFrame'])
    model=calibration(dict(body,depth=tvd,depthDomain='TVD',units={key:units[key] for key in ('depth','sonic','time')}))
    if body.get('timeEdit'):
        edit=body['timeEdit']
        mapped=constrained_edit(model['twt'],edit['controlFrom'],edit['controlTo'],
                                edit['minimumStretchRatio'],edit['maximumStretchRatio'])
        allowed=finite_number(edit['maximumCheckshotResidualSeconds'],'permitted checkshot residual',0)
        residual=np.interp(model['checkshotDepth'],model['depth'],mapped)-model['checkshotTwt']
        require(np.max(np.abs(residual))<=allowed+1e-10, 'The proposed time edit violates checkshot constraints.')
        velocity=2*np.diff(model['depth'])/np.diff(mapped)
        bounds=body['velocityBoundsMps']
        require(np.all((velocity>=bounds[0]) & (velocity<=bounds[1])), 'Edited interval velocity violates the reviewed bounds.')
        model=dict(model,twt=mapped,intervalVelocity=velocity,checkshotResidual=residual,timeEdit=edit)
    times=increasing(body['sampleTimes'],'Synthetic TWT samples')
    dt=finite_number(body['dt'],'synthetic sample interval',np.finfo(float).eps)
    require(np.allclose(np.diff(times),dt,atol=1e-12,rtol=1e-10) and times[0]>=model['twt'][0]
            and times[-1]<=model['twt'][-1], 'The synthetic needs a uniform axis inside calibrated support.')
    density=vector(body['density'],'Density')
    require(density.shape==original_depth.shape and np.all(density>0), 'Density must be positive on the original log depths.')
    depth_at_time=np.interp(times,model['twt'],model['depth'])
    sampled_density=np.interp(depth_at_time,tvd,density)
    mode=body['impedanceVelocity']
    require(mode in ('calibrated','original'), 'Choose whether impedance uses original or checkshot-calibrated velocity.')
    if mode=='calibrated':
        intervals=np.minimum(np.searchsorted(model['twt'],times,side='right')-1,len(model['intervalVelocity'])-1)
        velocity=model['intervalVelocity'][intervals]
    else:velocity=1/np.interp(depth_at_time,tvd,np.asarray(body['sonic'],float))
    positions=np.column_stack([np.interp(depth_at_time,tvd,xy[:,i]) for i in range(2)])
    observed=composite_trace(view,positions,times,view['coordinateFrame'],body['maximumSeismicDistanceMetres'],
                              body['interpolation'],cancelled,checkpoint,resumed)
    impedance=velocity*sampled_density
    require(np.all(np.isfinite(impedance)), 'Impedance overflowed; review velocity/density units.')
    reflection=np.r_[0,np.diff(impedance)/(impedance[1:]+impedance[:-1])]
    source=body['waveletSource']
    if source=='estimate':
        settings=body['waveletSettings']
        wavelet=estimate_wavelet([dict(reflectivity=reflection,seismic=observed['seismic'],validity=observed['validity'],
            dt=dt,weight=settings['wellWeight'])],dt,settings['sampleCount'],settings['regularization'],
            iterations=settings.get('iterations',500),cancelled=cancelled)
    elif source in ('provided','ricker'):
        settings=dict(body['waveletSettings'],dt=dt,operation='wavelet-import' if source=='provided' else 'wavelet-create')
        wavelet=wavelet_operation(settings)
    else:raise ValueError('Choose provided, ricker or estimate wavelet source.')
    reflection,calculated=synthetic(velocity,sampled_density,wavelet['wavelet'])
    return dict(timeDepth=model,wavelet=wavelet,sampleTwt=times,wellXY=positions,
        impedanceVelocity=mode,velocity=velocity,density=sampled_density,impedance=impedance,
        reflectivity=reflection,synthetic=calculated,observed=observed['seismic'],
        quality=quality(observed['seismic'],calculated,observed['validity']),
        sourceVersion=view.get('sourceVersion'),geometryRevision=view.get('geometryRevision'),
        referenceDatum=body['referenceDatum'],domain='TWT',timeUnit='s',depthUnit='m',
        originalLogsModified=False,proposal=True,scientificApproval=False)


def multiwell_qc(wells):
    require(isinstance(wells,list) and 1<=len(wells)<=256, 'Provide a bounded set of reviewed well ties.')
    require(sum(len(well['seismic']) for well in wells)<=2_000_000, 'Multiwell QC exceeds the admitted observation budget.')
    summaries=[]
    for well in wells:
        require(isinstance(well.get('id'),str) and well['id'], 'Identify each well tie.')
        metrics=quality(well['seismic'],well['synthetic'],well.get('validity'))
        summaries.append(dict(id=well['id'],**{key:value for key,value in metrics.items() if key not in ('residual','validity')}))
    require(len({well['id'] for well in summaries})==len(summaries), 'Well identifiers must be distinct.')
    return dict(wells=summaries,scientificApproval=False)


def export_tie(tie,kind):
    output=io.StringIO();writer=csv.writer(output,lineterminator='\n')
    if kind=='time-depth-csv':
        model=tie.get('timeDepth',tie)
        columns=[model['depth'],model['twt']]
        writer.writerow(['depth_m','twt_s'])
    elif kind=='wavelet-csv':
        model=tie['wavelet'] if isinstance(tie.get('wavelet'),dict) else tie
        columns=[model['lags'],model['wavelet']]
        writer.writerow(['lag_s','amplitude'])
    elif kind=='synthetic-csv':
        columns=[tie['sampleTwt'],tie['synthetic'],tie['observed'],tie['quality']['validity']]
        writer.writerow(['twt_s','synthetic','observed','valid'])
    else:raise ValueError('Choose time-depth-csv, wavelet-csv or synthetic-csv.')
    require(all(np.ndim(column)==1 for column in columns) and len({len(column) for column in columns})==1,
            'Export columns must share the same one-dimensional support; no rows were truncated.')
    for row in zip(*columns):writer.writerow(['' if not np.isfinite(value) else format(float(value),'.17g') for value in row])
    return dict(exports=[dict(name=kind+'.csv',contentType='text/csv',text=output.getvalue())],
                referenceDatum=tie.get('referenceDatum',tie.get('timeDepth',{}).get('referenceDatum')),scientificApproval=False)


def tie_operation(body,*,cancelled=lambda:False,checkpoint=lambda value:None,resumed=None):
    operation=body['operation']
    if operation=='workflow':return tie_workflow(body,cancelled=cancelled,checkpoint=checkpoint,resumed=resumed)
    if operation=='calibrate':return dict(timeDepth=calibration(body))
    if operation=='time-depth-edit':
        model=body['timeDepth']
        require(model['domain']=='TWT' and model['timeUnit']=='s' and model['depthUnit']=='m', 'Edit an SI calibrated TWT/depth resource.')
        depth=increasing(model['depth'],'Calibrated TVD')
        mapped=constrained_edit(model['twt'],body['controlFrom'],body['controlTo'],body['minimumStretchRatio'],body['maximumStretchRatio'])
        require(depth.shape==mapped.shape,'Calibrated time and depth axes must match.')
        velocity=2*np.diff(depth)/np.diff(mapped);bounds=vector(body['velocityBoundsMps'],'Reviewed velocity bounds')
        require(len(bounds)==2 and 0<bounds[0]<bounds[1] and np.all((velocity>=bounds[0])&(velocity<=bounds[1])),
                'Edited interval velocities violate the reviewed bounds.')
        residual=np.interp(model['checkshotDepth'],depth,mapped)-model['checkshotTwt']
        allowed=finite_number(body['maximumCheckshotResidualSeconds'],'maximum checkshot residual',0)
        require(np.max(np.abs(residual))<=allowed+1e-10,'The proposed edit violates its checkshot constraints.')
        return dict(timeDepth=dict(model,twt=mapped,intervalVelocity=velocity,checkshotResidual=residual),proposal=True)
    if operation=='wavelet-estimate':return estimate_wavelet(body['wells'],body['dt'],body['sampleCount'],
        body['regularization'],iterations=body.get('iterations',500),cancelled=cancelled)
    if operation=='wavelet-assess':return assess_wavelet(body['wavelet'],body['dt'])
    if operation=='extract-composite':return composite_trace(body['view'],body['wellXY'],body['sampleTwt'],body['wellFrame'],
        body['maximumSeismicDistanceMetres'],body['interpolation'],cancelled,checkpoint,resumed)
    if operation=='multiwell-qc':return multiwell_qc(body['wells'])
    if operation in ('align','mistie-network'):
        from seismic_tie_alignment import alignment,mistie_network
        return (alignment if operation=='align' else mistie_network)(body,cancelled)
    if operation=='export':return export_tie(body['tie'],body['format'])
    raise ValueError('Choose a documented well-tie workflow operation.')
