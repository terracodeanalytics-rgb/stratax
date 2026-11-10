"""Bounded native ZIP intake using existing retained-source/import records."""
import copy
import csv
import hashlib
import json
import os
import re
import stat
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

from ingestion_core import ImportProblem, digest, las_header
from coordinate_reference import declared_crs
from import_recipes import checkshot_references, normalized, suggested_mapping, survey_references, survey_well_column, table_variants

MAX_EXPANDED=1024**3
MAX_MEMBERS=99
from import_scope import SEISMIC_SUFFIXES, checkshot_name, evidence_family, workflow_allows
EXECUTABLE=re.compile(r'\.(exe|dll|com|bat|cmd|ps1|sh|js|mjs|vbs|html?|lnk)$',re.I)

def classify(path, archive_path=''):
    path=Path(path);suffix=path.suffix.lower();name=(archive_path or path.name).lower()
    if suffix in ('.las','.dlis','.lis'):return 'logs'
    if suffix in SEISMIC_SUFFIXES:return 'seismic'
    if suffix in ('.pdf','.docx','.png','.jpg','.jpeg'):return 'documents'
    if suffix=='.zip':return 'documents'
    if suffix=='.xlsx':
        from openpyxl import load_workbook
        book=load_workbook(path,read_only=True,data_only=True,keep_links=False)
        try:
            headings=[next(sheet.iter_rows(values_only=True),()) for sheet in book]
            if any({'md','inclination','azimuth'}<=suggested_mapping(names,'deviation').keys() for names in headings):
                return 'deviation'
            if any({'well','uwi'}<=suggested_mapping(names,'well_headers').keys() for names in headings):
                return 'well_headers'
            if any({'depth','time'}<=suggested_mapping(names,'checkshots').keys() for names in headings):
                return 'checkshots'
        finally:book.close()
    with path.open('rb') as source:head=source.read(16384).decode('utf-8-sig',errors='replace')
    if checkshot_name(PurePosixPath(name).name) or re.search(r'^TDP[345]\b',head,re.M) or re.search(r'\b(?:depth|tvd|md)\b[^\n]*\b(?:twt|owt)\b',head,re.I):return 'checkshots'
    if suffix in ('.csv','.tsv'):
        line=next((line for line in head.splitlines() if line.strip()),'')
        names=next(csv.reader([line],delimiter='\t' if suffix=='.tsv' else ','),[])
        if {'md','inclination','azimuth'}<=suggested_mapping(names,'deviation').keys():
            return 'deviation'
    if re.search(r'^UWI\s*:',head,re.M|re.I) and re.search(r'^Measr\.\s+Depth\s+Deviation',head,re.M|re.I) or re.search(r'directional|deviation|surveys?',name):return 'deviation'
    if re.search(r'well.?header',name):return 'well_headers'
    for family, pattern in (
        ('tops', r'\btops?\b|formation[ _-]?markers?'),
        ('core', r'\bcore\b|\bscal\b'),
        ('pressure', r'\bpressure\b|\brft\b|\bmdt\b'),
        ('fluids', r'\bfluids?\b|\bpvt\b'),
        ('geochemistry', r'geochem|\btoc\b'),
        ('production', r'production|oil[ _-]?rate'),
    ):
        if re.search(pattern, name.replace('_',' ')):return family
    return 'documents'

def well_matches(value, wells, *, uwi_only=False, embedded=False):
    tokens=re.findall(r'[a-z0-9]+',str(value or '').lower())
    if not tokens:return []
    keys={normalized(value)}
    if embedded:
        keys.update(''.join(tokens[start:end]) for start in range(len(tokens)) for end in range(start+1,min(start+8,len(tokens))+1))
    matches=[]
    for well in wells:
        labels=[well.get('uwi')] if uwi_only else [well.get('uwi'),well.get('name'),*(well.get('aliases') or [])]
        if any(normalized(label) in keys and (not embedded or len(normalized(label))>=3) for label in labels if label):matches.append(well)
    return matches

def padded_well_name(value):
    label=normalized(re.sub(r'[_ -]plan$','',str(value or ''),flags=re.I))
    return re.sub(r'([a-z])0+(?=\d)',r'\1',label)


def survey_row_matches(identity, known):
    exact=well_matches(identity,known,uwi_only=True) or well_matches(identity,known)
    if exact:
        return exact
    label=padded_well_name(identity)
    return [well for well in known if label and any(padded_well_name(alias)==label
            for alias in [well.get('name'),*(well.get('aliases') or [])])]


def propose_owner(uwi, name, path, archive, known):
    for label, candidates in (
        ('Source UWI', well_matches(uwi,known,uwi_only=True)),
        ('Source well name or alias',well_matches(name,known)),
        ('Filename or known alias',well_matches(Path(path).stem,known,embedded=True)),
    ):
        if candidates:return (candidates[0],label) if len(candidates)==1 else (None,'Multiple wells match the '+label.lower())
    folders=PurePosixPath(archive.get('path','')).parts[:-1]
    for folder in reversed(folders):
        candidates=well_matches(folder,known)
        if candidates:return (candidates[0],'Well folder') if len(candidates)==1 else (None,'Multiple wells match the folder')
    return None,'Choose the owning well in Review or Match'

def expand_zip(path, destination, root_id, cancelled=lambda:False, progress=lambda **kw:None,*,skip_seismic=False,skip_checkshots=False):
    """Yield byte-exact staged members; never write an archive path to disk."""
    destination=Path(destination);destination.mkdir(parents=True,exist_ok=True)
    budget={'bytes':0,'files':0,'entries':0};seen=set()
    def visit(source,prefix='',depth=0):
        if depth>3:raise ImportProblem('archive_depth','Split ZIP bundles nested beyond three levels.')
        with zipfile.ZipFile(source) as archive:
            for entry in archive.infolist():
                budget['entries']+=1
                name=entry.filename.replace('\\','/');parts=PurePosixPath(name)
                if parts.is_absolute() or '..' in parts.parts or ':' in name or '\x00' in name or stat.S_ISLNK(entry.external_attr>>16):raise ImportProblem('unsafe_archive','The ZIP contains an unsafe path or link.')
                if budget['entries']>10000:raise ImportProblem('archive_entries','The ZIP contains too many entries.')
                if entry.is_dir():continue
                full=prefix+name
                if full in seen:raise ImportProblem('archive_duplicate_path','The ZIP repeats a member path. Resolve duplicate entries before inspection.')
                seen.add(full)
                budget['files']+=1
                if budget['files']>MAX_MEMBERS:raise ImportProblem('archive_files','Use ZIP batches with at most 99 files.')
                identifier='zip-'+hashlib.sha256((root_id+'|'+full+'|'+str(entry.CRC)+'|'+str(entry.file_size)).encode()).hexdigest()[:40]
                declared=evidence_family('logs' if parts.suffix.lower() in ('.las','.dlis','.lis') else 'documents',parts.name)
                if (skip_seismic and declared=='seismic') or (skip_checkshots and declared=='checkshots'):
                    yield {'id':identifier,'name':parts.name,'path':full,'size':entry.file_size,'excluded':True,'code':'workflow_skipped','reason':declared.capitalize()+' skipped for the enabled project workflows.'}
                    continue
                if entry.file_size>MAX_EXPANDED or budget['bytes']+entry.file_size>MAX_EXPANDED:raise ImportProblem('archive_limits','Expanded ZIP contents exceed the 1 GiB batch limit.')
                if entry.file_size>1024**2 and entry.file_size/max(entry.compress_size,1)>1000:raise ImportProblem('archive_ratio','This member exceeds the safe ZIP expansion ratio.')
                target=destination/(identifier+Path(name).suffix.lower());checksum=hashlib.sha256();written=0
                if cancelled():raise ImportProblem('cancelled','ZIP inspection cancelled. Retained originals are unchanged.')
                with archive.open(entry) as incoming,target.open('wb') as outgoing:
                    while True:
                        chunk=incoming.read(1024**2)
                        if not chunk:break
                        written+=len(chunk);budget['bytes']+=len(chunk)
                        if written>entry.file_size or budget['bytes']>MAX_EXPANDED:raise ImportProblem('archive_limits','ZIP expansion exceeds its declared budget.')
                        if cancelled():raise ImportProblem('cancelled','ZIP inspection cancelled. Retained originals are unchanged.')
                        outgoing.write(chunk);checksum.update(chunk)
                        progress(phase='expanding',expandedBytes=budget['bytes'],memberBytes=written)
                if written!=entry.file_size:raise ImportProblem('archive_size','ZIP member size does not match its declaration.')
                excluded=bool(EXECUTABLE.search(name)) or any(p in ('__MACOSX','.DS_Store','Thumbs.db','desktop.ini') for p in parts.parts) or written==0
                member={'id':identifier,'name':parts.name,'path':full,'size':written,'sha256':checksum.hexdigest(),'crc32':f'{entry.CRC:08x}','localPath':str(target),'excluded':excluded,**({'reason':'Executable, system metadata, or empty member; retained in the original archive.'} if excluded else {})}
                yield member
                if target.suffix=='.zip' and not excluded:yield from visit(target,full+'/',depth+1)
    try:yield from visit(path)
    except (zipfile.BadZipFile,RuntimeError) as e:raise ImportProblem('archive_read','The ZIP could not be verified. Check corruption or extract encrypted contents locally.') from e

def retain_bundle_members(project, ref, data, raw_root, dispatch, cancelled, progress, db):
    """Reserve, stream and attach children atomically under the existing owner scope."""
    from google.cloud import firestore,storage
    roots=[a for a in data['assets'] if data.get('options',{}).get('perAsset',{}).get(a.get('clientId',a['id']),{}).get('nativeArchive')]
    if not roots:return data
    for root in roots:
        if root.get('archiveExpanded'):continue
        with tempfile.TemporaryDirectory() as scratch:
            workflows=project.get().to_dict().get('project',{}).get('workflows',[])
            members=list(expand_zip(Path(raw_root)/root['id'],scratch,root['id'],cancelled,progress,skip_seismic=not workflow_allows('seismic',workflows),skip_checkshots=not workflow_allows('checkshots',workflows)))
            needed=[]
            for member in members:
                if member['excluded']:
                    continue
                family=classify(member['localPath'],member['path'])
                if not workflow_allows(family,workflows):
                    member.update(excluded=True,code='workflow_skipped',reason=family.capitalize()+' skipped for the enabled project workflows.')
                    continue
                member['family']=family
                needed.append(member)
            @firestore.transactional
            def reserve(tx):
                current=ref.get(transaction=tx).to_dict();record=project.get(transaction=tx).to_dict()
                if current.get('dispatchToken')!=dispatch or current.get('status')!='inspecting':raise ImportProblem('cancelled','The import changed while expanding its ZIP.')
                files=record.get('workspace',{}).get('files',[]);known={f['id'] for f in files};amount=sum(m['size'] for m in needed if m['id'] not in known)
                quota=record.setdefault('importQuota',{});used=sum(f.get('size',0) for f in files)+quota.get('reservedBytes',0)+quota.get('derivedBytes',0)
                extra=max(0,amount-current.get('bundleReservation',0))
                if used+extra>50*1024**3:raise ImportProblem('archive_quota','Expanded originals would exceed this project’s storage quota.')
                quota['reservedBytes']=quota.get('reservedBytes',0)+extra;current['bundleReservation']=current.get('bundleReservation',0)+extra
                tx.set(project,record);tx.set(ref,current)
            reserve(db.transaction())
            bucket=storage.Client().bucket(os.environ['STRATAX_PROJECT_BUCKET']);owner_prefix=str(Path(raw_root)).replace('\\','/').split('/owners/',1)[1]
            root_checksum=digest(Path(raw_root)/root['id'])
            for member in needed:
                if cancelled():raise ImportProblem('cancelled','ZIP inspection cancelled. Originals remain retained.')
                family=member['family'];object_name='owners/'+owner_prefix+'/'+member['id']
                if bucket.get_blob(object_name) is None:
                    with open(member['localPath'],'rb') as source:bucket.blob(object_name).upload_from_file(source,content_type='application/octet-stream',if_generation_match=0)
                @firestore.transactional
                def attach(tx):
                    current=ref.get(transaction=tx).to_dict();record=project.get(transaction=tx).to_dict();files=record.setdefault('workspace',{}).setdefault('files',[])
                    archive={'rootId':root['id'],'path':member['path'],'directoryKey':str(PurePosixPath(member['path']).parent),'crc32':member['crc32'],'sourceZipSha256':root_checksum}
                    if not any(f['id']==member['id'] for f in files):
                        files.append({'id':member['id'],'name':member['name'],'size':member['size'],'sha256':member['sha256'],'archive':archive,'type':family,'well':'','local':False,'importId':current['id'],'status':'Stored original · classification pending'})
                        record.setdefault('importQuota',{})['reservedBytes']=max(0,record['importQuota'].get('reservedBytes',0)-member['size']);current['bundleReservation']=max(0,current.get('bundleReservation',0)-member['size'])
                    if current.get('dispatchToken')==dispatch and current.get('status')=='inspecting' and not any(a['id']==member['id'] for a in current['assets']):
                        current['assets'].append({'id':member['id'],'clientId':member['id'],'name':member['name'],'size':member['size'],'sha256':member['sha256'],'family':family,'state':'stored','existing':True,'archive':archive})
                        current.setdefault('options',{}).setdefault('perAsset',{})[member['id']]={'archive':archive,'autoPrepare':True,**({'retainOnly':True} if member['name'].lower().endswith('.zip') else {})}
                    tx.set(project,record);tx.set(ref,current)
                attach(db.transaction())
            @firestore.transactional
            def complete(tx):
                current=ref.get(transaction=tx).to_dict()
                if current.get('dispatchToken')!=dispatch or current.get('status')!='inspecting':return
                for a in current['assets']:
                    if a['id']==root['id']:a['archiveExpanded']=True
                current.setdefault('options',{}).setdefault('perAsset',{}).setdefault(root.get('clientId',root['id']),{})['retainOnly']=True
                current['archiveEntries']=[{k:v for k,v in m.items() if k!='localPath'} for m in members]
                tx.set(ref,current)
            complete(db.transaction())
    return ref.get().to_dict()

def prepare_assets(paths, data, known_wells):
    """Associate using retained header UWIs; names/filenames remain aliases."""
    settings=data.setdefault('options',{}).setdefault('perAsset',{});known=copy.deepcopy(known_wells);companion_evidence={};tables={};coordinate_sources={}
    for asset in data['assets']:
        if asset.get('family')=='deviation' and asset['name'].lower().endswith('.xlsx'):
            variants=table_variants(paths[asset.get('clientId',asset['id'])],'deviation',{})
            if variants:
                tables[asset['id']]=variants
                evidence=variants[0]['metadata'].get('companionEvidence',{})
                if evidence and not companion_evidence:companion_evidence={'sourceId':asset['id'],**evidence}
                root=asset.get('archive',{}).get('rootId')
                description=evidence.get('crsDescription','')
                crs=declared_crs(description)
                if root and crs:
                    for uwi in evidence.get('coordinateWellIds',[]):
                        coordinate_sources.setdefault((root,normalized(uwi)),{})[crs]={
                            'crs':crs,'description':description,'sourceId':asset['id'],'sourceName':asset['name']}
    checkshot_companions={}
    for asset in data['assets']:
        if asset.get('family',data.get('family'))!='checkshots':continue
        key=asset.get('clientId',asset['id'])
        options=settings.get(key,{})
        if not options.get('autoPrepare') or options.get('retainOnly'):continue
        path=paths[key]
        variants=table_variants(path,'checkshots',options)
        if not variants:continue
        tables[asset['id']]=variants
        archive=asset.get('archive') or {}
        if not archive.get('rootId'):continue
        folder=PurePosixPath(archive['path']).parent
        scope=(archive['rootId'],str(folder),normalized(path.stem))
        checkshot_companions.setdefault(scope,[]).extend(variants)
    for asset in sorted(data['assets'],key=lambda a:a.get('family')!='well_headers'):
        key=asset.get('clientId',asset['id']);options=settings.setdefault(key,{})
        if not options.get('autoPrepare'):continue
        path=paths[key];family=asset['family']
        if options.get('retainOnly'):continue
        variants=table_variants(path,family,options) if path.suffix.lower() in ('.xlsx','.asc','.txt') else None
        if family=='well_headers' and variants:
            mapping=variants[0]['mapping'];options.setdefault('mapping',mapping);bindings=options.setdefault('wellBindings',{})
            root=asset.get('archive',{}).get('rootId')
            for row in variants[0]['rows']:
                uwi=str(row[int(mapping['uwi'])]);name=str(row[int(mapping['well'])]);matches=well_matches(uwi,known,uwi_only=True)
                if len(matches)>1:continue
                identity=matches[0]['id'] if matches else 'well-'+hashlib.sha256(uwi.encode()).hexdigest()[:24]
                bindings.setdefault(name,identity);bindings.setdefault(uwi,identity)
                proposals=coordinate_sources.get((root,normalized(uwi)),{})
                if len(proposals)==1:options.setdefault('coordinateProposals',{})[uwi]=next(iter(proposals.values()))
                if not matches:known.append({'id':identity,'name':name,'uwi':uwi,'aliases':[]})
    for asset in sorted(data['assets'],key=lambda a:a.get('family')!='logs'):
        key=asset.get('clientId',asset['id']);options=settings.setdefault(key,{})
        if not options.get('autoPrepare') or options.get('retainOnly'):continue
        path=paths[key];family=asset['family'];uwi='';name='';names=[]
        if family=='logs' and path.suffix.lower()=='.las':
            headers={}
            with path.open(encoding='utf-8-sig',errors='replace') as source:
                for line in source:
                    if line.strip().upper().startswith('~A'):break
                    parsed=las_header(line)
                    if parsed:headers[parsed['mnemonic'].upper()]=parsed
            uwi=headers.get('UWI',headers.get('API',{})).get('value','');name=headers.get('WELL',{}).get('value','');options.setdefault('mapping',{'index':'0'});references=options.setdefault('references',{})
            unit=headers.get('STRT',{}).get('unit','').lower()
            if unit in ('m','ft'):references.setdefault('depthUnit',unit)
            references.setdefault('depthReference','MD');options.setdefault('matching',{'field':'uwi','exact':True})
            proposals=coordinate_sources.get((asset.get('archive',{}).get('rootId'),normalized(uwi)),{})
            if len(proposals)==1:options['coordinateProposals']={uwi:next(iter(proposals.values()))}
            if asset.get('archive') and not options.get('well') and options.get('deriveWellHeader') is not False:
                matches=well_matches(uwi,known,uwi_only=True) if uwi else well_matches(name,known)
                if not matches and (uwi or name):
                    identity='well-'+hashlib.sha256((uwi or 'LAS well '+normalized(name)).encode()).hexdigest()[:24]
                    well={'id':identity,'name':name or uwi,'uwi':uwi,'aliases':[]}
                    known.append(well)
                    matches=[well]
                if len(matches)==1:
                    well=matches[0]
                    options.update(well=well['id'],wellName=well['name'])
                    well['aliases']=list(dict.fromkeys([*(well.get('aliases') or []),path.stem]))
        elif family in ('deviation','checkshots'):
            variants=tables.get(asset['id']) or table_variants(path,family,options)
            if variants:
                if len(variants)==1:uwi=variants[0]['metadata'].get('uwi') or ''
                for variant in variants:
                    sheet=variant.get('sheet');identity=variant['metadata'].get('uwi') or sheet
                    owner=well_matches(identity,known)
                    if sheet and len(owner)==1:
                        settings_for_sheet=options.setdefault('sheetSettings',{}).setdefault(sheet,{})
                        settings_for_sheet.setdefault('well',owner[0]['id']);settings_for_sheet.setdefault('wellName',owner[0]['name'])
                    column=survey_well_column(variant['mapping'])
                    if column is not None:
                        identities={str(row[int(column)]) for row in variant['rows'] if len(row)>int(column) and row[int(column)] is not None}
                        names.extend(identities)
                        if family=='deviation':
                            scope=options.setdefault('sheetSettings',{}).setdefault(sheet,{}) if sheet else options
                            bindings=scope.setdefault('wellBindings',{})
                            for raw in identities:
                                matches=survey_row_matches(raw,known)
                                if len(matches)==1:bindings.setdefault(raw,matches[0]['id'])
                    if family=='deviation':
                        scope=options.setdefault('sheetSettings',{}).setdefault(sheet,{}) if sheet else options
                        for role,value in survey_references(variant['names'],variant['mapping']).items():
                            if role not in options.get('references',{}):scope.setdefault('references',{}).setdefault(role,value)
                mapping=variants[0]['mapping'] if len(variants)==1 else {}
                references={}
                if family=='checkshots' and len(variants)==1:
                    variant=variants[0]
                    references=checkshot_references(variant['names'],mapping)
                    archive=asset.get('archive') or {}
                    if not mapping and archive.get('rootId'):
                        scope=(archive['rootId'],str(PurePosixPath(archive['path']).parent),normalized(path.stem))
                        copies=[v for v in checkshot_companions.get(scope,[]) if v['rows']==variant['rows'] and {'depth','time'}<=set(v['mapping'])]
                        directions={tuple(sorted(v['mapping'].items())) for v in copies}
                        if copies and len(directions)==1:
                            mapping={key:copies[0]['mapping'][key] for key in ('depth','time')}
                            # Other filenames may have contradictory labels for this numeric profile.
                            conflicts=any(v['rows']==variant['rows'] and 'depth' in v['mapping'] and 'time' in v['mapping'] and
                                          (v['mapping']['depth'],v['mapping']['time'])!=(mapping['depth'],mapping['time'])
                                          for candidates in checkshot_companions.values() for v in candidates)
                            if conflicts:mapping={}
                            else:
                                proposed=[checkshot_references(v['names'],v['mapping']) for v in copies]
                                references={key:value for key,value in proposed[0].items() if all(p.get(key)==value for p in proposed)}
                                options.setdefault('proposalSources',{})['mapping']='Same-name companion with identical measurements and consistent headers.'
                    for role,index in mapping.items():
                        options.setdefault('mapping',{}).setdefault(role,index)
                    for key,value in references.items():
                        options.setdefault('references',{}).setdefault(key,value)
                options.setdefault('mapping',variants[0]['mapping'] if len(variants)==1 else {})
                if family=='deviation':
                    references=options.setdefault('references',{})
                    if companion_evidence:
                        options.setdefault('proposalSources',{})['surveyMetadata']=companion_evidence
                        if companion_evidence.get('depthReference')=='MD':references.setdefault('depthReference','MD')
                        if 'feet' in companion_evidence.get('depthUnitDescription','').lower():references.setdefault('depthUnit','ft')
        if family in ('well_headers','documents','seismic','surfaces','spatial','models'):continue
        archive=asset.get('archive') or {}
        owner,reason=propose_owner(uwi,name,path,archive,known)
        if family=='deviation' and uwi and not well_matches(uwi,known,uwi_only=True):
            owner,reason=None,'Source UWI requires a reviewed well association'
        if family=='deviation' and not uwi and not owner and reason.startswith('Choose'):
            matches=survey_row_matches(re.sub(r'(?i)(?:directional|deviation|survey|trajectory)s?[_ -]*','',path.stem).strip(' _-'),known)
            if len(matches)==1:owner,reason=matches[0],'Survey filename and well alias'
        if family=='deviation' and archive:
            options['requireSurveyOwner']=True
        if owner and not names:
            if not options.get('well'):
                options.update(well=owner['id'],wellName=owner['name'])
            if family=='logs' and reason=='Source UWI':
                owner['aliases']=list(dict.fromkeys([*(owner.get('aliases') or []),path.stem]))
        bindings=options.setdefault('wellBindings',{})
        for identity in set(names):
            candidates=well_matches(identity,known) or well_matches(re.sub(r'[_ -]plan$','',identity,flags=re.I),known)
            if len(candidates)==1:bindings.setdefault(identity,candidates[0]['id'])
        options.setdefault('proposalSources',{})['association']='Source table well identifiers' if bindings and names else reason
    return known
