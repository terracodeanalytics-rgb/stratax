"""Headless GemPy structural modelling from reviewed points and orientations."""
import numpy as np
from seismic_processing import require


def compute_implicit_model(extent, resolution, groups, *, geometry_confirmed=False):
    require(geometry_confirmed is True, "Review common depth units, CRS/datum and chronology first.")
    extent = np.asarray(extent, float)
    require(extent.shape == (6,) and np.all(np.isfinite(extent)) and np.all(extent[1::2] > extent[::2]),
            "Supply three increasing SI depth extent pairs.")
    require(isinstance(resolution, list) and len(resolution) == 3
            and all(type(n) is int and 2 <= n <= 128 for n in resolution)
            and np.prod(resolution) <= 250000, "Use a bounded genuine 3D model resolution.")
    require(isinstance(groups, list) and 1 <= len(groups) <= 32, "Provide ordered structural groups.")
    import gempy as gp
    from gempy.core.color_generator import ColorsGenerator
    from gempy.core.data.options import InterpolationOptionsType
    from gempy_engine.config import AvailableBackends
    color = ColorsGenerator()
    structural_groups = []; names = set(); pending_relations = {}
    for group in groups:
        require(isinstance(group, dict) and isinstance(group.get("name"), str)
                and group["name"] not in names, "Groups require distinct reviewed names.")
        names.add(group["name"])
        relation = group.get("relation")
        require(relation in ("ERODE", "ONLAP", "FAULT"), "Declare ERODE, ONLAP or FAULT relationships.")
        require(isinstance(group.get("elements"), list) and group["elements"], "Each group needs surfaces.")
        elements = []
        for element in group["elements"]:
            name = element["name"]
            require(isinstance(name, str) and name and name not in names, "Surface names must be distinct.")
            names.add(name)
            points, orientations = np.asarray(element["points"], float), np.asarray(element["orientations"], float)
            require(points.ndim == 2 and points.shape[1] == 3 and 2 <= len(points) <= 2000
                    and np.all(np.isfinite(points)), "Supply finite XYZ depth surface points.")
            require(orientations.ndim == 2 and orientations.shape[1] == 6 and 1 <= len(orientations) <= 2000
                    and np.all(np.isfinite(orientations)), "Supply measured XYZ and gradient XYZ orientations.")
            require(np.all(np.linalg.norm(orientations[:, 3:], axis=1) > 0), "Orientation gradients cannot vanish.")
            sp = gp.data.SurfacePointsTable.from_arrays(*points.T, names=name)
            ori = gp.data.OrientationsTable.from_arrays(*orientations.T, names=name)
            elements.append(gp.data.StructuralElement(name=name, surface_points=sp, orientations=ori, color=next(color)))
        structural_groups.append(gp.data.StructuralGroup(name=group["name"], elements=elements,
            structural_relation=getattr(gp.data.StackRelationType, relation)))
        if relation == "FAULT":
            require(isinstance(group.get("affects"), list), "Specify affected groups for each fault.")
            pending_relations[group["name"]] = group["affects"]
    by_name = {g.name: g for g in structural_groups}
    for name, affected in pending_relations.items():
        require(all(a in by_name and a != name for a in affected), "Fault relations must reference distinct existing groups.")
        by_name[name].fault_relations = [by_name[a] for a in affected]
    frame = gp.data.StructuralFrame(structural_groups, color)
    model = gp.create_geomodel(project_name="StrataX reviewed structure", extent=extent.tolist(),
        resolution=resolution, structural_frame=frame,
        intpolation_options_tye=InterpolationOptionsType.DENSE_GRID)
    solution = gp.compute_model(model, engine_config=gp.data.GemPyEngineConfig(
        backend=AvailableBackends.numpy, use_gpu=False, dtype="float64"))
    lithology = np.asarray(solution.raw_arrays.lith_block).reshape(resolution)
    require(np.all(np.isfinite(lithology)), "Implicit model produced non-finite lithology.")
    return dict(lithology=lithology, extent=extent, resolution=resolution, engine="GemPy",
                engineVersion=gp.__version__, groups=[g.name for g in structural_groups],
                limitations=["Implicit lithology model; split-pillar conversion requires a separate reviewed operation."])
