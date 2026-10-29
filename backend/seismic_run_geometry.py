"""Admission of geometry-coupled analytical graphs using retained source headers."""
import numpy as np
from seismic_processing import require
from seismic_crs import unit_scale_to_metres


def qualify_selection(review,rows,nodes,tolerance):
    from pyproj import CRS
    require(review.get('reviewed') is True and review.get('timeConvention')=='TWT',
            'Review the physical geometry and TWT time convention before gather processing.')
    try:projected=CRS.from_user_input(review['crs']).is_projected
    except Exception as error:raise ValueError('The reviewed CRS could not be parsed; supply its supported EPSG or WKT definition.') from error
    require(projected and review['coordinateUnit'] in ('m','ft','us-ft'),
            'Geometry-coupled previews require reviewed projected coordinates; transform angular acquisition first.')
    require(len(rows)>0,'No retained geometry is available in the selected trace range.')
    scale=unit_scale_to_metres(review['coordinateUnit'])
    reverse=review['axisOrder']=='northing-easting'
    def xy(prefix):
        value=np.asarray([[row['scaled'][prefix+'X'],row['scaled'][prefix+'Y']] for row in rows],float)*scale
        return value[:,::-1] if reverse else value
    if review['dataKind']=='unstacked':
        sources,receivers=xy('source'),xy('receiver');midpoints=(sources+receivers)/2
        offsets=np.linalg.norm(sources-receivers,axis=1)
    else:midpoints=xy('midpoint');offsets=None
    for node in nodes:
        operation=node['operator'];p=node['parameters']
        if operation in ('nmo','stack'):
            require(offsets is not None,'NMO and gather stacking require reviewed unstacked acquisition.')
            require(np.max(np.linalg.norm(midpoints-midpoints.mean(axis=0),axis=1))<=tolerance,
                    'Select one common-midpoint gather; these traces span different midpoints.')
            if operation=='nmo':
                supplied=np.asarray(p['offsets'],float)
                require(supplied.shape==offsets.shape and np.allclose(np.abs(supplied),offsets,atol=tolerance,rtol=0),
                        'NMO offsets do not match the retained source/receiver coordinates.')
        if operation=='fk-filter':
            require(len(midpoints)>=4,'FK filtering requires at least four spatial traces.')
            steps=np.diff(midpoints,axis=0);reference=steps.mean(axis=0);spacing=np.linalg.norm(reference)
            require(spacing>0 and np.max(np.linalg.norm(steps-reference,axis=1))<=tolerance,
                    'FK preview requires ordered, regularly spaced spatial traces. Regularise the acquisition explicitly first.')
            require(abs(spacing-p['spacing'])<=tolerance,'FK spacing differs from retained physical coordinates.')
    return dict(revision=review['revision'],sourceVersion=review['sourceVersion'],traceCount=len(rows),
                coordinateUnit='m',toleranceMetres=tolerance,selectionQualified=True,fullSurveyQualified=False)
