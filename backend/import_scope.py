"""Workflow rules for uploaded and retained evidence."""
import re
from pathlib import PurePosixPath

SEISMIC_SUFFIXES = {'.sgy', '.segy', '.su', '.zgy', '.sgz', '.vds'}
WELL_FAMILIES = {'logs', 'deviation', 'well_headers', 'tops', 'checkshots', 'core',
                 'pressure', 'fluids', 'geochemistry', 'production', 'arrays'}


def checkshot_name(name):
    return bool(re.search(r'check[ _-]?sho|chech[ _-]?sho|time[ _-]+depth', name, re.I))


def evidence_family(family, name):
    suffix = PurePosixPath(name.replace('\\', '/')).suffix.lower()
    if suffix in SEISMIC_SUFFIXES:
        return 'seismic'
    if suffix not in ('.zip', '.las', '.dlis', '.lis', '.npy', '.npz', '.h5', '.hdf5', '.nc') and checkshot_name(name):
        return 'checkshots'
    return family


def workflow_allows(family, workflows):
    if family == 'seismic':
        return 'seismic' in workflows
    if family == 'checkshots':
        return 'petrophysics' in workflows and 'seismic' in workflows
    return family not in WELL_FAMILIES or 'petrophysics' in workflows
