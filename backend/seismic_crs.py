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
        from pyproj import Transformer
    except Exception as error:
        raise ValueError("pyproj is unavailable in this runtime; inject another reviewed CRS engine.") from error

    transformer = Transformer.from_crs(source_frame["crs"], target_frame["crs"], always_xy=True)

    def engine(xy, src, dst):
        import numpy as np

        require_confirmed_frame(src)
        require_confirmed_frame(dst)
        x, y = _axis_components(xy, src["axisOrder"])
        # Linear unit scaling only when both frames are projected length units.
        if src["unit"] in ("m", "ft", "us-ft") and dst["unit"] in ("m", "ft", "us-ft"):
            metres = unit_scale_to_metres(src["unit"])
            x = x * metres
            y = y * metres
            ox, oy = transformer.transform(x, y)
            scale = unit_scale_to_metres(dst["unit"])
            ox = np.asarray(ox, float) / scale
            oy = np.asarray(oy, float) / scale
        else:
            ox, oy = transformer.transform(x, y)
            ox = np.asarray(ox, float)
            oy = np.asarray(oy, float)
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
