"""Well-data activation requires retained well-header evidence."""
WELL_DATA_FAMILIES = {'logs', 'arrays', 'deviation', 'tops', 'checkshots', 'core',
                     'pressure', 'fluids', 'geochemistry', 'production'}
UNIT_ALIASES = {
    'meter': 'm', 'meters': 'm', 'metre': 'm', 'metres': 'm', 'm': 'm',
    'foot': 'ft', 'feet': 'ft', 'ft': 'ft', 'gapi': 'gAPI', 'api': 'gAPI',
    'v/v': 'v/v', 'vol/vol': 'v/v', 'fraction': 'v/v', 'percent': '%', 'percentage': '%',
    'g/cc': 'g/cm3', 'g/cm3': 'g/cm3', 'g/cm^3': 'g/cm3', 'ohm-m': 'ohm.m', 'ohm.m': 'ohm.m',
    'degree': 'degrees', 'degrees': 'degrees', 'deg': 'degrees',
    'radian': 'radians', 'radians': 'radians', 'rad': 'radians',
    'millisecond': 'ms', 'milliseconds': 'ms', 'ms': 'ms',
    'second': 's', 'seconds': 's', 's': 's', 'psi': 'psi',
}


def normalize_unit(value):
    return UNIT_ALIASES.get(str(value or '').strip().lower())


def header_well_ids(workspace, datasets=(), resolve=None, required=None):
    headers = [d for d in datasets if d.get('family') == 'well_headers']
    well_ids = {well['id'] for dataset in headers for well in dataset.get('wellRecords', [])}
    if resolve:
        visited = set()
        for well in workspace.get('wellDrafts', []):
            if well['id'] in well_ids or required is not None and well['id'] not in required:
                continue
            for dataset_id in well.get('evidence', []):
                if dataset_id in visited:
                    continue
                visited.add(dataset_id)
                saved = resolve(dataset_id)
                if saved and saved.get('active') is not False and saved.get('family') == 'well_headers':
                    well_ids.update(row['id'] for row in saved.get('wellRecords', []))
                    if well['id'] in well_ids:
                        break
    return well_ids


def missing_headers(datasets, well_ids):
    return [d for d in datasets if d.get('family') in WELL_DATA_FAMILIES
            and (not d.get('well') or d['well'] not in well_ids)]
