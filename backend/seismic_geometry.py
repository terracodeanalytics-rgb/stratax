"""Declared header roles and bounded QC; metadata review never fabricates geometry."""
from typing import Literal

from pydantic import BaseModel,ConfigDict,Field,model_validator

from seismic_reader import _read,_integer,need
from seismic_trace_index import layout,SAMPLE_BYTES

ROLES={'sourceX','sourceY','receiverX','receiverY','midpointX','midpointY','inline','crossline',
       'shot','receiver','channel','traceCode','offset','coordinateScalar','elevationScalar','sourceElevation','receiverElevation'}


class HeaderRole(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    byte:int=Field(ge=1,le=239)
    width:Literal[2,4]
    signed:bool=True

    @model_validator(mode='after')
    def within_header(self):
        if self.byte+self.width>241:raise ValueError('A mapped field leaves the 240-byte trace header.')
        return self


class GeometryReview(BaseModel):
    model_config=ConfigDict(extra='forbid',strict=True)
    revision:int=Field(ge=0)
    sourceVersion:str=Field(min_length=1,max_length=100)
    dimension:Literal[2,3]
    dataKind:Literal['unstacked','poststack']
    coordinateUnit:Literal['m','ft','us-ft','degrees','arcseconds']
    axisOrder:Literal['easting-northing','northing-easting','longitude-latitude','latitude-longitude']
    crs:str=Field(min_length=3,max_length=4096)
    datum:str=Field(min_length=1,max_length=240)
    elevationUnit:Literal['m','ft','us-ft']
    elevationPositive:Literal['up','down']
    timeConvention:Literal['TWT','one-way','unconfirmed']
    roles:dict[str,HeaderRole]=Field(min_length=2,max_length=18)
    notes:str=Field(min_length=1,max_length=4000)
    reviewed:bool

    @model_validator(mode='after')
    def consistent(self):
        if not self.reviewed:raise ValueError('Review the source header roles, units, axes, CRS and datum explicitly.')
        if not set(self.roles)<=ROLES:raise ValueError('Choose supported header roles; unused source words retain no inferred role.')
        for a,b in [('sourceX','sourceY'),('receiverX','receiverY'),('midpointX','midpointY'),('inline','crossline')]:
            if (a in self.roles)!=(b in self.roles):raise ValueError('Map coordinate and bin fields in complete pairs.')
        required={'sourceX','sourceY','receiverX','receiverY'} if self.dataKind=='unstacked' else {'midpointX','midpointY'}
        required.add('coordinateScalar')
        if not required<=set(self.roles):raise ValueError('Map source/receiver coordinates for unstacked records or midpoint coordinates for a stack.')
        if any(role in self.roles for role in ('sourceElevation','receiverElevation')) and 'elevationScalar' not in self.roles:raise ValueError('Map the elevation scalar explicitly before using elevations.')
        geographic=self.coordinateUnit in ('degrees','arcseconds')
        if geographic!=(self.axisOrder in ('longitude-latitude','latitude-longitude')):raise ValueError('Coordinate units must agree with the declared axis order.')
        if not self.crs.strip() or self.crs.strip().lower() in ('unknown','unconfirmed','none'):raise ValueError('Supply the source CRS description without guessing an EPSG code.')
        if not self.datum.strip() or not self.notes.strip():raise ValueError('Record the datum and the source evidence used for review.')
        return self


def header_preview(stream,size,review,*,kind='segy',endian='big',first_trace=0,trace_count=8,locators=None,total_traces=None):
    need(type(first_trace) is int and first_trace>=0 and type(trace_count) is int and 1<=trace_count<=64,'Choose a bounded preview of 1–64 retained headers.')
    source=layout(stream,size,kind,endian)
    if locators is None:
        first=_read(stream,source['begin'],240)
        ns=_integer(first,115,2,endian,False) or source['ns']
        need(ns>0,'The source needs a native variable-trace index before header review.')
        width=240+ns*SAMPLE_BYTES[source['format']]
        need((size-source['begin'])%width==0,'Review indexed variable trace offsets before selecting headers from this layout.')
        total=(size-source['begin'])//width
        selected=[dict(trace=i,byteOffset=source['begin']+i*width,sampleCount=ns) for i in range(first_trace,min(total,first_trace+trace_count))]
    else:
        total=total_traces;selected=locators
        need(type(total) is int and total>0 and len(selected)==min(trace_count,total-first_trace),'Indexed header support is incomplete.')
    need(first_trace<total,'The selected header begins beyond the retained source.')
    rows=[]
    for position,item in enumerate(selected):
        trace,offset,ns=item['trace'],item['byteOffset'],item['sampleCount']
        need(trace==first_trace+position and type(offset) is int and offset>=source['begin'] and type(ns) is int and ns>0 and offset+240+ns*SAMPLE_BYTES[source['format']]<=size,'A geometry preview locator leaves the original trace support.')
        raw=_read(stream,offset,240)
        need((_integer(raw,115,2,endian,False) or source['ns'])==ns,'The source header does not match this retained trace locator.')
        values={role:_integer(raw,f.byte,f.width,endian,f.signed) for role,f in review.roles.items()}
        scaled=dict(values)
        for scalar,roles in [('coordinateScalar',['sourceX','sourceY','receiverX','receiverY','midpointX','midpointY']),
                             ('elevationScalar',['sourceElevation','receiverElevation'])]:
            if any(role in values for role in roles):
                need(scalar in values,'Map the applicable coordinate/elevation scalar explicitly, including zero-valued source scalars.')
                value=values[scalar];factor=1/abs(value) if value<0 else value or 1
                for role in roles:
                    if role in values:scaled[role]=values[role]*factor
        rows.append(dict(trace=trace,raw=values,scaled=scaled,sourceCoordinateUnitsCode=_integer(raw,89,2,endian,False)))
    return dict(rows=rows,totalTraces=total,coordinateUnit=review.coordinateUnit,axisOrder=review.axisOrder,
                crs=review.crs,datum=review.datum,sourceVersion=review.sourceVersion,sourceMeasurementSystemCode=source.get('measurementSystemCode'),
                coordinateConversionApplied=False,geometryQualifiedForProcessing=False,
                warnings=['Only the selected headers were inspected; geometry completeness, auxiliary traces, duplicates and binning still require survey QC.',
                          'The CRS is a reviewed declaration; no CRS parsing, reprojection, axis swap or unit conversion was performed.'])
