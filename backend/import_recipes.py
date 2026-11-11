"""Evidence-backed interchange proposals. Originals are never modified."""
import copy
import csv
import hashlib
import itertools
import re
from pathlib import Path

ALIASES = {
    'well': ('well','wellname','wellid','borehole'), 'uwi': ('uwi','api','uniqueidentifier'),
    'index': ('dept','depth','md'), 'md': ('md','measureddepth'),
    'inclination': ('incl','inc','inclination','deviation'), 'azimuth': ('azim','azi','azimuth','direction','azimgn','azimtn'),
    'depth': ('depth','md','tvd','tvdss','tdmd','totaldepth'), 'time': ('twt','owt','time'),
    'x': ('x','easting','xcoord'), 'y': ('y','northing','ycoord'), 'elevation': ('kb','rkb','elevation'),
    'latitude': ('lat','latitude'), 'longitude': ('lon','longitude'),
}
FAMILY_ROLES = {
    'logs': {'index','well','uwi'}, 'arrays': {'index','well','uwi'},
    'deviation': {'md','inclination','azimuth','well','uwi','dx','dy','tvd','x','y','z'},
    'checkshots': {'depth','time','well','uwi'},
    'well_headers': {'well','uwi','x','y','latitude','longitude','elevation','depth'},
}

def normalized(value):
    return re.sub(r'[^a-z0-9]', '', str(value or '').lower())

def split_header(value):
    text=str(value or '').strip()
    match=re.fullmatch(r'(.+?)\s*[\[(]\s*(m|ft|feet|metres|meters|ms|s|seconds|deg|degrees|rad|radians)\s*[\])]',text,re.I)
    if not match:return normalized(text),''
    units={'feet':'ft','metres':'m','meters':'m','seconds':'s'}
    unit=match[2].lower()
    return normalized(match[1]),units.get(unit,unit)


def checkshot_references(names, mapping):
    references={}
    for role in ('depth','time'):
        index=mapping.get(role)
        if index is None:continue
        label,unit=split_header(names[int(index)])
        if role=='depth':
            if label in ('md','tvd','tvdss'):references['depthReference']=label.upper()
            if unit in ('m','ft'):references['depthUnit']=unit
        else:
            if label in ('twt','owt'):references['timeConvention']='Two-way time' if label=='twt' else 'One-way time'
            if unit in ('ms','s'):references['timeUnit']=unit
    return references


def suggested_mapping(names, family):
    result = {}
    for role in FAMILY_ROLES.get(family, set()):
        matches = [i for i,name in enumerate(names) if split_header(name)[0] in ALIASES.get(role, ())]
        if len(matches) == 1: result[role] = str(matches[0])
    return result

def survey_well_column(mapping):
    return mapping.get('uwi') if mapping.get('uwi') is not None else mapping.get('well')


def survey_references(names, mapping):
    references = {}
    if 'md' in mapping:
        _, unit = split_header(names[int(mapping['md'])])
        references['depthReference'] = 'MD'
        if unit in ('ft', 'm'):
            references['depthUnit'] = unit
    units = [split_header(names[int(mapping[role])])[1] for role in ('inclination', 'azimuth') if role in mapping]
    angles = {'deg': 'degrees', 'degrees': 'degrees', 'rad': 'radians', 'radians': 'radians'}
    if len(units) == 2 and units[0] in angles and units[1] in angles and angles[units[0]] == angles[units[1]]:
        references['angleUnit'] = angles[units[0]]
    if 'azimuth' in mapping:
        label, _ = split_header(names[int(mapping['azimuth'])])
        if label in ('azimgn', 'azimtn'):
            references['northReference'] = 'Grid north' if label == 'azimgn' else 'True north'
    return references


def table_measurements(measurements, mapping, number):
    identifiers = {int(mapping[role]) for role in ('well','uwi') if role in mapping}
    return [[str(v).strip() if i in identifiers and v is not None else number(v) for i,v in enumerate(row)]
            for _, row in measurements]


def canonical_options(options, family):
    value = copy.deepcopy(options or {})
    # A legacy generic Depth suggestion must not turn azimuth into a depth axis.
    if family == 'deviation':
        value['mapping'] = {k:v for k,v in value.get('mapping',{}).items() if k in FAMILY_ROLES[family]}
    return value

def selected_rows(rows, ranges):
    from ingestion_core import ImportProblem
    if ranges is None:
        yield from rows
        return
    if not isinstance(ranges,list) or not ranges or len(ranges)>100:
        raise ImportProblem('row_selection','Choose one or more reviewed source-row ranges.')
    previous = 0
    for pair in ranges:
        if not isinstance(pair,list) or len(pair)!=2 or any(type(v) is not int for v in pair) or pair[0]<previous or pair[0]<0 or pair[1]<=pair[0]:
            raise ImportProblem('row_selection','Source-row ranges must be ordered, non-overlapping, zero-based half-open intervals.')
        previous=pair[1]
    position=0;count=0
    for index,row in enumerate(rows):
        count=index+1
        while position<len(ranges) and index>=ranges[position][1]:position+=1
        if position<len(ranges) and ranges[position][0]<=index<ranges[position][1]:yield row
    if ranges[-1][1]>count:
        raise ImportProblem('row_selection','The reviewed row range exceeds this retained source.')

def mixed_survey_blocks(rows):
    if len(rows)<12 or len(rows)%2:return None
    half=len(rows)//2;left,right=rows[:half],rows[half:]
    try:
        if all(len(a)>=3 and len(b)>=3 and all(abs(float(a[i])-float(b[i]))<1e-8 for i in (1,2)) for a,b in zip(left,right)):
            error=max(abs(float(a[0])-float(b[0])*0.3048) for a,b in zip(left,right))
            if error<=0.02:return {'ranges':[[0,half],[half,len(rows)]],'metresFeetMaxError':error,'kind':'possible-metre-feet-duplicates'}
    except (TypeError,ValueError):pass
    return None

def source_segments(indices):
    segments=[]
    for logical,physical in enumerate(indices):
        if segments and segments[-1][0]+segments[-1][2]==logical and segments[-1][1]+segments[-1][2]==physical:segments[-1][2]+=1
        else:segments.append([logical,physical,1])
    return segments


def table_variants(path, family, options):
    """Return normalized logical tables only for recognized source layouts."""
    from ingestion_core import number
    path=Path(path);suffix=path.suffix.lower();variants=[]
    if suffix=='.xlsx' and family in ('deviation','well_headers','checkshots'):
        from openpyxl import load_workbook
        with path.open('rb') as source:
            book=load_workbook(source,read_only=True,data_only=True,keep_links=False)
            try:
                companion={}
                if family=='deviation':
                    for metadata_sheet in book:
                        if metadata_sheet.title=='Mapping Sheet':
                            companion['mappingSheet']=[[str(v) if v is not None else None for v in row] for row in metadata_sheet.iter_rows(values_only=True)][:100]
                        else:
                            for index,row in enumerate(metadata_sheet.iter_rows(max_row=min(metadata_sheet.max_row or 2000,2000),max_col=24,values_only=True),1):
                                text=' '.join(str(v) for v in row if v is not None)
                                if len(row)>2 and row[0]=='DSV1' and row[1]=='UWI:' and row[2]:
                                    uwis=companion.setdefault('coordinateWellIds',[])
                                    if str(row[2]) not in uwis and len(uwis)<100:uwis.append(str(row[2]))
                                if index>8:continue
                                if text.startswith('Cartographic System :'):companion['crsDescription']=text.split(':',1)[1].strip()
                                if text.startswith('Depth Mode :'):companion['depthReference']=text.split(':',1)[1].strip()
                                if text.startswith('Depth Unit :'):companion['depthUnitDescription']=text.split(':',1)[1].strip()
                                if text.startswith('Distance Unit :'):companion['distanceUnitDescription']=text.split(':',1)[1].strip()
                sheets=[options['sheet']] if options.get('sheet') else [name for name in book.sheetnames if name not in options.get('excludedSheets',[])]
                for name in sheets:
                    sheet=book[name];iterator=sheet.iter_rows(values_only=True);head=next(iterator,())
                    names=[str(v or '') for v in head];mapping=suggested_mapping(names,family)
                    recognized=(family=='deviation' and all(k in mapping for k in ('md','inclination','azimuth')) or family=='well_headers' and 'well' in mapping and 'uwi' in mapping or family=='checkshots' and 'depth' in mapping and 'time' in mapping)
                    if recognized:
                        measurements=[(index,row) for index,row in enumerate(iterator,2) if any(v is not None for v in row)]
                        rows=table_measurements([(index,row[:len(names)]) for index,row in measurements],mapping,number)
                        variants.append({'names':names,'rows':rows,'sheet':name,'mapping':mapping,'metadata':{'format':'Excel','sheet':name,'sheets':book.sheetnames,'sourceRecipe':'reviewed-table/1','companionEvidence':companion,'sourceRowSegments':source_segments([index for index,_ in measurements])}})
            finally:book.close()
        return variants or None
    delimited_survey = suffix in ('.csv','.tsv') or suffix in ('.dat','.txt','.asc') and options.get('delimiter') in (',','\t',';','|')
    if family=='deviation' and delimited_survey and path.stat().st_size<=16*1024**2 and not options.get('noHeader') and not options.get('widths'):
        with path.open(encoding=options.get('encoding') or 'utf-8-sig',newline='') as source:
            delimiter=options.get('delimiter') or ('\t' if suffix=='.tsv' else ',')
            if len(delimiter)!=1:return None
            reader=csv.reader(source,delimiter=delimiter)
            for _ in range(max(0,int(options.get('headerRow') or 1)-1)):next(reader,None)
            names=next(reader,[])
            mapping=suggested_mapping(names,'deviation')
            if {'md','inclination','azimuth'}<=mapping.keys():
                measurements=[(index,row) for index,row in enumerate(reader,reader.line_num+1) if any(str(v).strip() for v in row)]
                rows=table_measurements(measurements,mapping,number)
                return [{'names':names,'rows':rows,'mapping':mapping,'metadata':{'format':'Delimited directional survey','sourceRecipe':'reviewed-table/1','sourceRowSegments':source_segments([index for index,_ in measurements])}}]
    if suffix not in ('.asc','.txt','.dev','.survey'):return None
    if path.stat().st_size>16*1024**2:return None
    text=path.read_text(encoding=options.get('encoding','utf-8-sig'),errors='replace');source_lines=[(index,s.strip()) for index,s in enumerate(text.splitlines(),1) if s.strip()];lines=[s for _,s in source_lines]
    if family=='deviation' and len(lines)>2 and re.match(r'^UWI\s*:',lines[0],re.I) and re.match(r'^Measr\.\s+Depth\s+Deviation',lines[1],re.I):
        uwi=re.split(r'\s+',re.sub(r'^UWI\s*:\s*','',lines[0],flags=re.I))[0]
        rows=[[number(v) for v in line.split()] for line in lines[2:]]
        if any(len(row)!=3 or any(not isinstance(v,(int,float)) for v in row) for row in rows):return None
        return [{'names':['MD','Inclination','Azimuth'],'rows':rows,'mapping':{'md':'0','inclination':'1','azimuth':'2'},'metadata':{'format':'OpenWorks directional ASCII','sourceRecipe':'openworks-directional/1','uwi':uwi,'headers':{'UWI':{'value':uwi}},'sourceRowSegments':source_segments([index for index,_ in source_lines[2:]]),'originalHeaderLines':lines[:2],'well':uwi}}]
    if family=='checkshots' and any(re.match(r'^TDP5\s+',s) for s in lines):
        rows=[[number(v) for v in line.split()[1:]] for line in lines if re.match(r'^TDP5\s+',line)]
        if any(len(row)!=2 for row in rows):return None
        identity=next((s for s in lines if re.fullmatch(r'TM\d+[_\w-]*',s,re.I)), '')
        return [{'names':['Source column 1','Source column 2'],'rows':rows,'mapping':{},'metadata':{'format':'OpenWorks TDP','sourceRecipe':'openworks-tdp/1','uwi':identity,'sourceRowSegments':source_segments([index for index,line in source_lines if re.match(r'^TDP5\s+',line)]),'originalHeaderLines':lines[:4]}}]
    return None

def survey_groups(variant, mapping):
    from ingestion_core import ImportProblem
    index = survey_well_column(mapping)
    if index is None or not str(index).isdigit():
        return [('', variant['rows'], variant['metadata'])]
    groups = {}
    physical_rows = {logical+i:physical+i for logical,physical,length in variant['metadata'].get('sourceRowSegments',[]) for i in range(length)}
    for logical,row in enumerate(variant['rows']):
        identity = str(row[int(index)] or '').strip() if int(index)<len(row) else ''
        if identity not in groups and len(groups)>=100:
            raise ImportProblem('well_groups','Split surveys into at most 100 wells per file.')
        groups.setdefault(identity,[]).append((logical,row))
    return [(identity,[row for _,row in items],{
        **variant['metadata'],'well':identity,'rowWell':True,
        'rowUwi':identity if index==mapping.get('uwi') else '',
        'sourceRowSegments':source_segments([physical_rows.get(i,i+1) for i,_ in items])})
        for identity,items in groups.items()]


def parse_variants(path, output, family, options):
    from ingestion_core import output_dataset,column,issue
    variants=table_variants(path,family,options)
    if variants is None:return None
    result=[]
    for variant in variants:
        settings=canonical_options(options,family);sheet=settings.get('sheetSettings',{}).get(variant.get('sheet'),{})
        settings.update({**sheet,'wellBindings':{**settings.get('wellBindings',{}),**sheet.get('wellBindings',{})},'references':{**settings.get('references',{}),**sheet.get('references',{})}})
        settings['mapping']={**variant['mapping'],**settings.get('mapping',{})}
        settings=canonical_options(settings,family)
        if family=='checkshots':
            explicit=checkshot_references(variant['names'],variant['mapping'])
            # Apply declarations only to the columns whose meanings still agree with the source.
            for role,keys in (('depth',('depthReference','depthUnit')),('time',('timeConvention','timeUnit'))):
                if settings['mapping'].get(role)==variant['mapping'].get(role):
                    for key in keys:
                        if key in explicit:settings.setdefault('references',{}).setdefault(key,explicit[key])
        groups=survey_groups(variant,settings['mapping']) if family=='deviation' else [('',variant['rows'],variant['metadata'])]
        if family=='deviation' and len(groups)==1 and groups[0][0] and settings.get('well') and not settings.get('autoPrepare'):
            settings['wellBindings'].setdefault(groups[0][0],settings['well'])
        if len(groups)>1 and settings.get('rowRanges'):
            raise ImportProblem('row_selection','Review station blocks per well in separate source sheets.')
        for identity,source_rows,source_metadata in groups:
            metadata={**source_metadata,'mapping':settings['mapping'],'sourceRowRanges':settings.get('rowRanges'),'logicalRowCount':len(source_rows),'sourceRowOrigin':{'kind':'logical-measurement-rows','zeroBased':True,'headerLines':2 if source_metadata.get('sourceRecipe')=='openworks-directional/1' else 1}}
            mixed=mixed_survey_blocks(source_rows) if family=='deviation' else None
            notes=[]
            if mixed:
                metadata['surveyBlockProposal']={**mixed,'blocks':[{'range':pair,'rows':source_rows[pair[0]:pair[1]],'columns':variant['names']} for pair in mixed['ranges']]}
                if not settings.get('rowRanges') or not settings.get('rowSelectionReviewed') or settings.get('references',{}).get('depthUnit') not in ('m','ft'):
                    notes.append(issue('survey_blocks_review','This survey contains matching station blocks with metre/feet scaling. Select and review the authoritative block and its units.','blocking'))
            rows=selected_rows(source_rows,settings.get('rowRanges'))
            name=Path(path).name+(' · '+variant['sheet'] if variant.get('sheet') else '')
            if len(groups)>1:name+=' · '+(identity or 'Unassigned well')
            dataset=output_dataset(output,name,[column(name,split_header(name)[1],i) for i,name in enumerate(variant['names'])],rows,metadata,notes)
            dataset['_recipeOptions']=settings
            result.append(dataset)
    return result

def profile_signature(dataset, output):
    import gzip,json
    h=hashlib.sha256()
    for chunk in dataset.get('chunks',[]):
        with gzip.open(Path(output)/chunk['name'],'rt',encoding='utf-8') as stream:
            for line in stream:
                row=json.loads(line);numeric=[format(v,'.12g') for v in row if isinstance(v,(int,float))]
                h.update(('|'.join(numeric)+'\n').encode())
    return h.hexdigest()


def reusable_assets(current, incoming, wells):
    """Reuse only byte-verified, unchanged source recipes and unchanged well evidence."""
    import json
    if current.get('inspectionWells')!=wells:return []
    ignored={'perAsset','perFile','timings','reviewed','reviewedAssets','archiveReview','parentImportId','allowDuplicateContent'}
    def settings(root,asset):
        value={k:v for k,v in root.items() if k not in ignored}
        value.update(root.get('perFile',{}).get(asset['name'],{}));value.update(root.get('perAsset',{}).get(asset.get('clientId',asset['id']),{}))
        return json.dumps(value,sort_keys=True,default=str)
    old=current.get('options',{});assets=current['assets']
    if any(a.get('family')=='well_headers' and settings(old,a)!=settings(incoming,a) for a in assets):return []
    return [a['id'] for a in assets if settings(old,a)==settings(incoming,a) and any(d.get('sourceId')==a['id'] and d.get('sourceSha256')==a.get('sha256') for d in current.get('datasets',[]))]
