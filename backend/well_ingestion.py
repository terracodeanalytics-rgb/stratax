"""Well registrations and marker picks derived from retained import evidence."""
import gzip
import hashlib
import json
import math
from pathlib import Path

from pyproj import CRS
from pyproj.exceptions import CRSError

from coordinate_reference import declared_crs, geographic_conflict, merge_coordinate_evidence


def numeric(value):
    if value is None or value == '':
        return None
    try:
        value = float(value)
        return value if math.isfinite(value) else None
    except (TypeError, ValueError):
        return None


def mapped(row, mapping, role):
    value = mapping.get(role)
    return row[int(value)] if value is not None and value != '' and 0 <= int(value) < len(row) else None


def source_rows(dataset, output):
    for chunk in dataset.get('chunks', []):
        path = Path(output) / chunk['name']
        with gzip.open(path, 'rt', encoding='utf-8') as stream:
            for line in stream:
                if line.strip():
                    yield json.loads(line)


def point(x, y, refs, geographic=False):
    if numeric(x) is None or numeric(y) is None or not refs.get('crs'):
        return None
    from pyproj import Transformer
    try:
        if geographic:
            source = CRS.from_user_input(refs['crs']).geodetic_crs
        else:
            source = refs['crs']
            if refs.get('coordinateOrder') == 'Latitude / longitude':
                x, y = y, x
        lng, lat = Transformer.from_crs(source, 'EPSG:4326', always_xy=True, allow_ballpark=False).transform(float(x), float(y), errcheck=True)
        if math.isfinite(lat) and math.isfinite(lng) and abs(lat) <= 90 and abs(lng) <= 180:
            return {'lat': lat, 'lng': lng, 'confirmed': True, 'crs': 'EPSG:4326', 'sourceCRS': refs['crs']}
    except Exception:
        return None
    return None


def decorate(dataset, output, options):
    family, refs, mapping = dataset['family'], dataset.get('references', {}), dataset.get('mapping', {})
    source = options.get('assetId') or dataset.get('sourceId') or dataset['id']
    headers = dataset.get('metadata', {}).get('headers', {})
    value = lambda *names: next((headers[n].get('value') for n in names if n in headers), None)
    owner = next((w for w in options.get('_knownWells', []) if w['id'] == options.get('well')), None)
    actual_name = value('WELL')
    same_uwi=bool(owner and owner.get('uwi') and str(value('UWI','API') or '').strip()==str(owner['uwi']).strip())
    if owner and actual_name and not same_uwi and str(actual_name).strip() not in [owner.get('name', owner['id']), *owner.get('aliases', [])]:
        dataset['issues'].append({'code': 'well_identity_conflict', 'severity': 'warning', 'message': 'The source well header differs from the selected owning well. Confirm the association explicitly.'})
    rows = source_rows(dataset, output) if family in ('well_headers', 'tops') else [] if family in ('logs', 'arrays') and options.get('deriveWellHeader') is False else [[]]
    if family in ('logs', 'arrays'):
        dataset.setdefault('metadata', {})['deriveWellHeader'] = options.get('deriveWellHeader', True)
    registrations, picks, identities, coordinates, uwis, exact_rows = [], [], {}, {}, {}, {}
    for field, header in [('name', 'WELL'), ('uwi', 'UWI')]:
        expected = options.get('sourceIdentity', {}).get(field)
        actual = value(header)
        if expected and actual and str(expected).strip() != str(actual).strip():
            dataset['issues'].append({'code': 'identity_changed', 'severity': 'warning', 'message': 'Native inspection found a different well identity from the reviewed preview.'})
    for index, row in enumerate(rows):
        if index >= 1000 and family in ('well_headers', 'tops'):
            dataset['issues'].append({'code': 'well_evidence_limit', 'severity': 'blocking', 'message': 'Split well header/marker collections into groups of at most 1,000 records. Originals remain retained.'})
            break
        if family == 'tops':
            name, depth = mapped(row, mapping, 'name'), numeric(mapped(row, mapping, 'depth'))
            raw = str(mapped(row, mapping, 'well') or dataset.get('well') or '')
            if name and depth is not None and raw:
                marker = 'marker-' + hashlib.sha256(str(name).casefold().encode()).hexdigest()[:20]
                picks.append({'id': str(source) + '-pick-' + str(dataset.get('well', 'table')) + '-' + str(index), 'markerId': marker, 'name': str(name), 'depth': depth * (0.3048 if refs.get('depthUnit') == 'ft' else 1), 'wellId': dataset['well'] if dataset.get('metadata', {}).get('rowWell') else options.get('wellBindings', {}).get(raw) or options.get('well') or raw, 'reference': refs.get('depthReference', 'Unconfirmed'), 'verticalDatum': refs.get('verticalDatum',''), 'unit': refs.get('depthUnit', ''), 'sourceId': source, 'rowIndex': index})
            continue
        if family not in ('well_headers', 'logs', 'arrays', 'deviation', 'checkshots', 'core', 'pressure', 'fluids', 'geochemistry', 'production'):
            break
        action = options.get('headerActions', {}).get(str(index), {}) if family == 'well_headers' else {}
        if action.get('action') == 'skip':
            continue
        name = str(mapped(row, mapping, 'well') or (dataset.get('metadata', {}).get('wellName') or dataset.get('metadata', {}).get('well') if dataset.get('metadata', {}).get('rowWell') else None) or value('WELL') or options.get('wellName') or dataset.get('well') or '').strip()
        if same_uwi:name=owner.get('name',name)
        if not name:
            if family == 'well_headers':
                dataset['issues'].append({'code':'well_identity', 'severity':'blocking', 'row':index, 'message':f'Header row {index+1} has no well name. Map its identifier or explicitly skip the row.'})
            continue
        identifier = action.get('well') or options.get('wellBindings', {}).get(name) or (dataset.get('well') if dataset.get('metadata', {}).get('rowWell') else options.get('well') if family != 'well_headers' else None) or ('well-' + str(source) + '-' + (str(index) if family == 'well_headers' else hashlib.sha256(name.encode()).hexdigest()[:10]))
        if family != 'well_headers' and not options.get('well') and not dataset.get('metadata', {}).get('rowWell'):
            field = options.get('matching', {}).get('field', 'name')
            raw_identity = str(value('UWI', 'API') or '') if field == 'uwi' else name
            exact = options.get('matching', {}).get('exact', True)
            normalized = raw_identity.strip() if exact else raw_identity.strip().casefold()
            matches = [w for w in options.get('_knownWells', []) if normalized and any((str(v or '').strip() if exact else str(v or '').strip().casefold()) == normalized for v in ([w.get('uwi')] if field == 'uwi' else [w.get('name', w['id']), *w.get('aliases', [])]))]
            if len(matches) == 1:
                identifier = matches[0]['id']
            elif len(matches) > 1:
                dataset['issues'].append({'code': 'well_match_required', 'severity': 'blocking', 'message': 'Multiple registered wells match the binary header. Confirm a stable owning well ID.'})
            dataset['well'] = identifier
        lat, lng = mapped(row, mapping, 'latitude'), mapped(row, mapping, 'longitude')
        if lat is None:
            lat = value('LAT', 'LATI', 'LATITUDE')
        if lng is None:
            lng = value('LON', 'LONG', 'LONGITUDE')
        x, y = mapped(row, mapping, 'x'), mapped(row, mapping, 'y')
        x = x if x is not None else value('X', 'XCOORD', 'EAST')
        y = y if y is not None else value('Y', 'YCOORD', 'NORTH')
        uwi = str(mapped(row, mapping, 'uwi') or dataset.get('metadata', {}).get('rowUwi') or value('UWI', 'API') or '')
        proposal = options.get('coordinateProposals', {}).get(uwi, {})
        header_crs = declared_crs(value('EPSG', 'CRS', 'COORDSYS', 'PROJECTION'))
        crs = declared_crs(refs.get('crs')) or refs.get('crs') or header_crs or proposal.get('crs', '')
        geographic = {'lat': numeric(lat), 'lng': numeric(lng)}
        has_geographic = geographic['lat'] is not None and geographic['lng'] is not None
        has_xy = numeric(x) is not None and numeric(y) is not None
        try:
            geographic_crs = bool(crs and CRS.from_user_input(crs).is_geographic)
        except CRSError:
            geographic_crs = False
        coords = {'x': numeric(x), 'y': numeric(y), 'crs': crs}
        if has_geographic:
            if geographic_crs:
                geographic['crs'] = crs
                coords.update(x=geographic['lng'], y=geographic['lat'], coordinateKind='geographic')
            coords['geographicCoordinates'] = geographic
        if proposal:
            coords['crsEvidence'] = proposal
        location = None
        if crs and (refs.get('crs') or header_crs):
            if has_geographic and (geographic_crs or not has_xy):
                location = point(lng, lat, {**refs, 'crs': crs}, True)
            elif has_xy:
                location = point(x, y, {**refs, 'crs': crs})
        candidate = point(x, y, {**refs, 'crs': crs}) if has_xy and crs and not geographic_crs else None
        conflict = bool(proposal and crs != proposal['crs'] or header_crs and crs != header_crs)
        if candidate and geographic_conflict(candidate['lng'], candidate['lat'], coords.get('geographicCoordinates')):
            conflict = True
        if conflict:
            coords['coordinateConflict'] = True
            dataset['issues'].append({'code':'coordinate_evidence_conflict','severity':'warning','message':f'{name}: coordinate sources disagree. Review the well location before plotting.'})
            location = None
        registration = {'id': identifier, 'name': name, 'uwi': uwi, 'rowIndex': index, 'sourceId': source, 'elevation': numeric(mapped(row, mapping, 'elevation') or value('KB', 'RKB', 'EKB')), 'totalDepth': numeric(mapped(row, mapping, 'depth') if family == 'well_headers' else value('STOP', 'TD')), 'elevationUnit': refs.get('elevationUnit') or headers.get('KB', {}).get('unit', ''), 'elevationDatum': refs.get('verticalDatum', ''), 'totalDepthUnit': refs.get('depthUnit') or headers.get('STOP', {}).get('unit', ''), 'sourceCoordinates': coords}
        if same_uwi and actual_name and actual_name!=name:registration['aliases']=[actual_name]
        if location:
            registration['location'] = {**location, 'source': 'Imported source · ' + str(source)}
        if family == 'well_headers':
            fingerprint = json.dumps(row, sort_keys=True)
            if fingerprint in exact_rows:
                dataset['issues'].append({'code': 'duplicate_header_row', 'severity': 'warning', 'row': index, 'message': f'Identical header rows {exact_rows[fingerprint]+1} and {index+1}. Both remain available.'})
            exact_rows[fingerprint] = index
        uwi = registration['uwi']
        if uwi and uwi in uwis:
            dataset['issues'].append({'code': 'duplicate_uwi', 'severity': 'warning', 'row': index, 'message': f'Repeated UWI {uwi} on source rows {uwis[uwi]+1} and {index+1}.'})
        if uwi:
            uwis[uwi] = index
        if name in identities:
            dataset['issues'].append({'code': 'duplicate_well', 'severity': 'warning', 'message': f'Repeated well identifier {name} on source rows {identities[name]+1} and {index+1}; independent registrations are retained unless explicitly merged.'})
        identities[name] = index
        coordinate = (numeric(x), numeric(y)) if location is None else (location['lat'], location['lng'])
        if all(v is not None for v in coordinate):
            if coordinate in coordinates:
                dataset['issues'].append({'code': 'duplicate_location', 'severity': 'warning', 'message': f'{name} shares coordinates with {coordinates[coordinate]}. Both can be imported.'})
            coordinates[coordinate] = name
        registrations.append(registration)
    if family == 'tops' and dataset.get('well'):
        registrations.append({'id': dataset['well'], 'name': dataset.get('metadata', {}).get('wellName') or options.get('wellName') or dataset.get('metadata', {}).get('well') or dataset['well'], 'uwi':dataset.get('metadata',{}).get('rowUwi',''), 'sourceId':source})
    dataset.update(wellRecords=registrations, markerPicks=picks, surveyMethod=options.get('surveyMethod', 'angles'))
    for column in dataset['columns']:
        assignment = options.get('curves', {}).get(column['id'], {})
        if assignment.get('propertyType'):
            column['propertyType'] = str(assignment['propertyType'])[:80]
    dataset['status'] = 'retained/unresolved' if dataset['issues'] else 'ready'
    return dataset


def register_evidence(workspace, datasets):
    wells = workspace.setdefault('wellDrafts', [])
    workspace['wellModelVersion'] = 2
    locations = workspace.setdefault('mapWorkspace', {}).setdefault('locations', {})
    previously_located = set(locations)
    stratigraphy = workspace.setdefault('stratigraphy', {'markers': [], 'picks': []})
    stratigraphy.setdefault('markers', [])
    stratigraphy.setdefault('picks', [])
    for well in wells:
        well.setdefault('name', well['id'])
        well.setdefault('aliases', [])
    for dataset in datasets:
        for registration in dataset.get('wellRecords', []):
            well = next((w for w in wells if w['id'] == registration['id']), None)
            if well is None:
                well = {k: v for k, v in registration.items() if k != 'location'}
                well.update(aliases=[], status='Imported registration', source=dataset['importId'])
                wells.append(well)
            for alias in registration.get('aliases',[]):
                if alias!=well.get('name') and alias not in well.setdefault('aliases',[]):well['aliases'].append(alias)
            for field in ('elevation', 'elevationUnit', 'elevationDatum', 'totalDepth', 'totalDepthUnit'):
                if well.get(field) in (None, '') and registration.get(field) is not None:
                    well[field] = registration[field]
            if registration.get('sourceCoordinates'):
                well['sourceCoordinates'] = merge_coordinate_evidence(well.get('sourceCoordinates'), registration['sourceCoordinates'])
            if registration.get('name') and registration['name'] != well['name'] and registration['name'] not in well['aliases']:
                well['aliases'].append(registration['name'])
            if not well.get('uwi') and registration.get('uwi'):
                well['uwi'] = registration['uwi']
            well.setdefault('evidence', [])
            if dataset['id'] not in well['evidence']:
                well['evidence'].append(dataset['id'])
            if well['id'] not in previously_located:
                source = well.get('sourceCoordinates', {})
                if source.get('coordinateConflict') or source.get('conflictingCRS'):
                    locations.pop(well['id'], None)
                elif registration.get('location') and well['id'] not in locations:
                    locations[well['id']] = registration['location']
        well = next((w for w in wells if w['id'] == dataset.get('well')), None)
        if well and dataset['family'] in ('deviation', 'checkshots'):
            well.setdefault('activeSurveyId' if dataset['family'] == 'deviation' else 'activeCheckshotId', dataset['id'])
        for pick in dataset.get('markerPicks', []):
            marker = next((m for m in stratigraphy['markers'] if m['name'].casefold() == pick['name'].casefold()), None)
            if marker is None:
                marker = {'id': pick['markerId'], 'name': pick['name'], 'color': '#b78540'}
                stratigraphy['markers'].append(marker)
            if not any(p['id'] == pick['id'] for p in stratigraphy['picks']):
                stratigraphy['picks'].append({**pick, 'markerId': marker['id'], 'datasetId': dataset['id'], 'importId': dataset['importId']})


def cross_well_issues(workspace, datasets):
    """Warn about separate registrations; never infer identity from coordinates."""
    seen, notes = {}, []

    def keys(well):
        point = well.get('location') or workspace.get('mapWorkspace', {}).get('locations', {}).get(well['id'])
        source = well.get('sourceCoordinates') or {}
        coordinate = None
        if point and point.get('confirmed'):
            coordinate = f"point:{point['lat']:.8f}:{point['lng']:.8f}"
        elif numeric(source.get('x')) is not None and numeric(source.get('y')) is not None:
            coordinate = f"source:{source.get('crs', '')}:{float(source['x']):g}:{float(source['y']):g}"
        return [(kind, str(value).strip().lower()) for kind, value in
                [('name', well.get('name') or well['id']), ('uwi', well.get('uwi')), ('coordinate', coordinate)] if value]

    def remember(well):
        for key in keys(well):
            seen.setdefault(key, set()).add(well['id'])

    for well in workspace.get('wellDrafts', []):
        remember(well)
    for dataset in datasets:
        for well in dataset.get('wellRecords', []):
            for kind, value in keys(well):
                if any(identifier != well['id'] for identifier in seen.get((kind, value), set())):
                    notes.append({'code': 'existing_' + kind, 'severity': 'warning', 'source': dataset['name'],
                                  'sourceId': dataset['sourceId'], 'assetKey': dataset.get('assetKey'),
                                  'message': f"{well.get('name', well['id'])} shares {kind} with a separate registration. Review the affected records; coordinates never merge wells."})
        for well in dataset.get('wellRecords', []):
            remember(well)
    return notes
