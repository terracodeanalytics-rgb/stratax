"""CRS helpers. Never guess EPSG codes or silently reproject."""
from __future__ import annotations

from seismic_processing import require


def require_confirmed_frame(frame: dict):
    require(isinstance(frame, dict), "Provide a coordinate frame declaration.")
    require(frame.get("confirmed") is True, "Confirm CRS, axis order and units before transformation.")
    crs = str(frame.get("crs", "")).strip()
    require(crs and crs.lower() not in ("unknown", "unconfirmed", "none"), "CRS remains unconfirmed.")
    require(frame.get("axisOrder") not in (None, "unconfirmed"), "Axis order remains unconfirmed.")
    require(frame.get("unit") not in (None, "unconfirmed"), "Coordinate unit remains unconfirmed.")
    return frame


def _axis_components(xy, axis_order: str):
    """Return easting/northing or lon/lat components from declared axis order."""
    import numpy as np

    arr = np.asarray(xy, float)
    require(arr.ndim == 2 and arr.shape[1] == 2 and np.all(np.isfinite(arr)), "Provide finite N×2 coordinates.")
    if axis_order in ("easting-northing", "longitude-latitude"):
        return arr[:, 0].copy(), arr[:, 1].copy()
    if axis_order in ("northing-easting", "latitude-longitude"):
        return arr[:, 1].copy(), arr[:, 0].copy()
    raise ValueError("Axis order must be an easting/northing or lon/lat pair for CRS transforms.")


def _pack_axis(a, b, axis_order: str):
    import numpy as np

    if axis_order in ("easting-northing", "longitude-latitude"):
        return np.column_stack([a, b])
    return np.column_stack([b, a])


def unit_scale_to_metres(unit: str) -> float:
    if unit == "m":
        return 1.0
    if unit == "ft":
        return 0.3048
    if unit == "us-ft":
        return 1200.0 / 3937.0
    if unit in ("degrees", "arcseconds"):
        return 1.0  # angular; pyproj handles CRS units
    raise ValueError(f"Unsupported length unit for linear CRS scaling: {unit}")


def pyproj_available() -> bool:
    try:
        from pyproj import Transformer  # noqa: F401
        return True
    except Exception:
        return False


def make_pyproj_engine(source_frame: dict, target_frame: dict):
    """
    Build an explicit reviewed transformer from confirmed frames.
    CRS strings must already be user-reviewed (EPSG:… / WKT / PROJ).
    """
    require_confirmed_frame(source_frame)
    require_confirmed_frame(target_frame)
    try:
        from pyproj import Transformer, CRS
    except Exception as error:
        raise ValueError("pyproj is unavailable in this runtime; inject another reviewed CRS engine.") from error

    try:
        source_crs=CRS.from_user_input(source_frame['crs']);target_crs=CRS.from_user_input(target_frame['crs'])
        transformer = Transformer.from_crs(source_crs,target_crs,always_xy=True,allow_ballpark=False,only_best=True)
    except Exception as error:
        raise ValueError('The reviewed CRS/datum transformation is unavailable. Confirm the EPSG/WKT definitions and required datum grids.') from error

    def engine(xy, src, dst):
        import numpy as np

        require_confirmed_frame(src)
        require_confirmed_frame(dst)
        x, y = _axis_components(xy, src["axisOrder"])
        if source_crs.is_geographic:
            require(src['unit'] in ('degrees','arcseconds'),'Geographic CRS coordinates require angular units.')
            scale=1/3600 if src['unit']=='arcseconds' else 1
            x,y=x*scale,y*scale
        else:
            require(source_crs.is_projected and src['unit'] in ('m','ft','us-ft'),'Provide a projected or geographic working CRS.')
            require(len(source_crs.axis_info)>=2,'Source CRS does not declare horizontal units.')
            x=x*unit_scale_to_metres(src['unit'])/source_crs.axis_info[0].unit_conversion_factor
            y=y*unit_scale_to_metres(src['unit'])/source_crs.axis_info[1].unit_conversion_factor
        ox,oy=transformer.transform(x,y,errcheck=True)
        ox,oy=np.asarray(ox,float),np.asarray(oy,float)
        if target_crs.is_geographic:
            require(dst['unit'] in ('degrees','arcseconds'),'Geographic output requires angular units.')
            scale=3600 if dst['unit']=='arcseconds' else 1
            ox,oy=ox*scale,oy*scale
        else:
            require(target_crs.is_projected and dst['unit'] in ('m','ft','us-ft'),'Output CRS must declare projected length units.')
            require(len(target_crs.axis_info)>=2,'Target CRS does not declare horizontal units.')
            ox=ox*target_crs.axis_info[0].unit_conversion_factor/unit_scale_to_metres(dst['unit'])
            oy=oy*target_crs.axis_info[1].unit_conversion_factor/unit_scale_to_metres(dst['unit'])
        require(np.all(np.isfinite(ox)) and np.all(np.isfinite(oy)),'CRS transformation leaves the supported coordinate domain.')
        return _pack_axis(ox, oy, dst["axisOrder"]).tolist()

    return engine


def transform_xy(xy, source_frame, target_frame, engine=None):
    """
    Reproject XY only when both frames are confirmed and an explicit engine callable is supplied.
    Pass engine='pyproj' to use the reviewed pyproj factory when installed.
    """
    require_confirmed_frame(source_frame)
    require_confirmed_frame(target_frame)
    if engine == "pyproj" or engine == "auto":
        engine = make_pyproj_engine(source_frame, target_frame)
    require(callable(engine), "Supply an explicit reviewed CRS transformer; no EPSG was guessed.")
    require(
        source_frame.get("crs") != target_frame.get("crs")
        or source_frame.get("unit") != target_frame.get("unit")
        or source_frame.get("axisOrder") != target_frame.get("axisOrder"),
        "Source and target frames are identical; no transform required.",
    )
    return engine(xy, source_frame, target_frame)


def crs_capabilities():
    return dict(
        transformAvailable=pyproj_available(),
        engine="pyproj" if pyproj_available() else None,
        rules=[
            "CRS, axis order and units must be confirmed before any transform.",
            "EPSG/WKT codes are never inferred from file headers alone.",
            "Angular and projected frames must not be silently mixed.",
        ],
    )
