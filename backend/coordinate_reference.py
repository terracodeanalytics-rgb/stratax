"""Resolve declared horizontal references and compare independent coordinates."""
import re

from pyproj import CRS, Geod, Transformer
from pyproj.exceptions import CRSError

GEOGRAPHIC_CONFLICT_METRES = 1000


def declared_crs(value):
    text = ' '.join(str(value or '').upper().split())
    match = re.fullmatch(r'(?:EPSG\s*:?\s*)?([0-9]{3,7})', text)
    if match:
        try:
            crs = CRS.from_epsg(int(match[1]))
            return crs.to_string() if crs.is_geographic or crs.is_projected else ''
        except (CRSError, ValueError):
            return ''
    if re.fullmatch(r'WGS[ _-]*84', text):
        return 'EPSG:4326'
    if text in ('MINNA / NIGERIA WEST BELT', 'POWERPLAN:NIGERIWB') or re.fullmatch(
        r'NIGERIA MINNA(?: \(DMA\))? TM WBELT CM 0?4\.5\s*E', text
    ):
        return 'EPSG:26391'
    return ''


def geographic_conflict(lng, lat, alternate):
    """Screen for gross disagreement even if the alternate geographic datum is unstated."""
    if not alternate:
        return False
    x, y = alternate.get('lng'), alternate.get('lat')
    if not isinstance(x, (float, int)) or not isinstance(y, (float, int)) or abs(x) > 180 or abs(y) > 90:
        return False
    if alternate.get('crs'):
        x, y = Transformer.from_crs(alternate['crs'], 'EPSG:4326', always_xy=True, allow_ballpark=False).transform(x, y, errcheck=True)
    return Geod(ellps='WGS84').inv(lng, lat, x, y)[2] > GEOGRAPHIC_CONFLICT_METRES


def merge_coordinate_evidence(current, incoming):
    if not incoming:
        return current
    if not current:
        return incoming
    current_xy = (current.get('x'), current.get('y'))
    incoming_xy = (incoming.get('x'), incoming.get('y'))
    if None in current_xy:
        if None not in incoming_xy:
            return {**current, **incoming}
        return current if current.get('geographicCoordinates') else incoming
    if None in incoming_xy:
        return {**incoming, **current}
    if current_xy != incoming_xy:
        return {**current, 'coordinateConflict': True}
    merged = {**incoming, **{k: v for k, v in current.items() if v is not None and v != ''}}
    if current.get('crs') and incoming.get('crs') and current['crs'] != incoming['crs']:
        merged['conflictingCRS'] = incoming['crs']
    return merged
