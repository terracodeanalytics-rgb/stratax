"""RESQML 2.0.1 regular geometry/property exchange through resqpy."""
from pathlib import Path
from tempfile import TemporaryDirectory

import numpy as np

from seismic_processing import require


def export_regular_resqml(grid, *, property_name, property_unit, property_kind,
                          crs_epsg, z_increases_down, crs_confirmed=False):
    require(crs_confirmed is True and isinstance(crs_epsg, str) and crs_epsg.isdigit(),
            "Confirm a projected EPSG reference before model export.")
    require(type(z_increases_down) is bool, "Declare the depth-axis direction.")
    require(grid.get("grid") == "regular" and len(grid["shape"]) == 3,
            "This writer accepts regular 3D grids only; faulted topology needs the explicit grid writer.")
    require(all(isinstance(s, str) and s.strip() for s in (property_name, property_unit, property_kind)),
            "Declare property name, RESQML unit and property kind.")
    require(np.prod(grid["shape"]) <= 1_000_000, "Bound exchange to one million cells per request.")
    from pyproj import CRS
    require(CRS.from_epsg(int(crs_epsg)).is_projected, "Grid coordinates require a projected CRS, not angular degrees.")
    from resqpy.model import Model
    from resqpy.grid import RegularGrid
    from resqpy.crs import Crs
    from resqpy.property import Property
    with TemporaryDirectory(prefix="stratax-resqml-") as directory:
        path = Path(directory) / "model.epc"
        model = Model(epc_file=str(path), new_epc=True, create_basics=True, create_hdf5_ext=True)
        try:
            crs = Crs(model, epsg_code=crs_epsg, xy_units="m", z_units="m", z_inc_down=z_increases_down)
            crs.create_xml()
            # StrataX arrays are XYZ; RESQML cell arrays are KJI (ZYX).
            regular = RegularGrid(model, extent_kji=tuple(reversed(grid["shape"])),
                dxyz=tuple(grid["spacing"]), origin=tuple(grid["origin"]), crs_uuid=crs.uuid,
                as_irregular_grid=True, set_points_cached=True, title="StrataX reviewed regular grid")
            regular.write_hdf5()
            regular.create_xml(write_geometry=True, add_cell_length_properties=False)
            prop = Property.from_array(model, np.transpose(grid["values"], (2, 1, 0)),
                source_info="StrataX reviewed property", keyword=property_name, support_uuid=regular.uuid,
                property_kind=property_kind, uom=property_unit, indexable_element="cells")
            model.store_epc()
            model.h5_release()
            h5 = path.with_suffix(".h5")
            return dict(epc=path.read_bytes(), hdf5=h5.read_bytes(), gridUuid=str(regular.uuid),
                        propertyUuid=str(prop.uuid), schema="RESQML 2.0.1", shape=list(grid["shape"]))
        finally:
            model.h5_release()


def export_corner_resqml(corners, active, properties, *, crs_epsg, z_increases_down,
                         split_tolerance, geometry_confirmed=False):
    """Preserve explicit cell corners and split pillars; never interpolate faults."""
    require(geometry_confirmed is True and type(z_increases_down) is bool,
            "Confirm corner geometry, CRS/datum and depth direction.")
    cp, active = np.asarray(corners, float), np.asarray(active, bool)
    require(cp.ndim == 7 and cp.shape[-4:] == (2, 2, 2, 3) and cp.shape[:3] == active.shape
            and np.prod(active.shape) <= 100000 and np.all(np.isfinite(cp)),
            "Supply bounded KJI cell corners [nk,nj,ni,2,2,2,3] with an active mask.")
    require(np.isfinite(split_tolerance) and split_tolerance > 0, "Declare positive SI pillar split tolerance.")
    require(isinstance(properties, list) and properties, "Supply explicit cell property records.")
    from pyproj import CRS
    require(isinstance(crs_epsg, str) and crs_epsg.isdigit() and CRS.from_epsg(int(crs_epsg)).is_projected,
            "Confirm projected EPSG coordinates for explicit grid geometry.")
    from resqpy.model import Model
    from resqpy.crs import Crs
    from resqpy.property import Property
    from resqpy.rq_import import grid_from_cp
    with TemporaryDirectory(prefix="stratax-fault-grid-") as directory:
        path = Path(directory) / "model.epc"
        model = Model(epc_file=str(path), new_epc=True, create_basics=True, create_hdf5_ext=True)
        try:
            crs = Crs(model, epsg_code=crs_epsg, xy_units="m", z_units="m", z_inc_down=z_increases_down)
            crs.create_xml()
            grid = grid_from_cp(model, cp.copy(), crs.uuid, active_mask=active.copy(),
                dot_tolerance=0., morse_tolerance=1e12, split_pillars=True, split_tolerance=split_tolerance,
                ijk_handedness="auto")
            require(grid is not None, "Explicit corners do not form a representable corner-point grid.")
            if grid.inactive is not None:
                require(np.array_equal(~grid.inactive, active), "Grid conversion changed active support; review cell geometry.")
            grid.crs = crs
            grid.write_hdf5(); grid.create_xml()
            from resqpy.grid import any_grid
            grid = any_grid(model, uuid=grid.uuid)
            volumes = grid.volume()
            require(np.all(np.isfinite(volumes[active])) and np.all(volumes[active] > 0),
                    "Active cells require finite positive signed volumes; review twisted/inverted/pinched cells.")
            property_ids = []
            for record in properties:
                values = np.asarray(record["values"], float)
                require(values.shape == active.shape and np.all(np.isfinite(values)), "Property arrays must match the finite KJI cell grid.")
                prop = Property.from_array(model, values, source_info="StrataX reviewed explicit grid",
                    keyword=record["name"], support_uuid=grid.uuid, property_kind=record["kind"],
                    uom=record["unit"], indexable_element="cells")
                property_ids.append(str(prop.uuid))
            model.store_epc(); model.h5_release()
            return dict(epc=path.read_bytes(), hdf5=path.with_suffix(".h5").read_bytes(),
                        gridUuid=str(grid.uuid), propertyUuids=property_ids, splitPillars=bool(grid.has_split_coordinate_lines),
                        schema="RESQML 2.0.1", shapeKji=list(active.shape))
        finally:
            model.h5_release()
