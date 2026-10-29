"""Runtime capability truth for bounded engines; no field qualification inferred."""
import importlib.metadata
import importlib.util
import json
import os


def engine_catalog():
    definitions = [
        ("kirchhoff", ["numpy", "scipy"], [2, 3], "imaging", "homogeneous or supplied one-way tables"),
        ("surface-multiple-prediction", ["numpy", "scipy"], [2, 3], "marine", "complete collocated common surface grid"),
        ("structure-attributes", ["numpy", "scipy"], [3], "attributes", "physical-coordinate structure tensors"),
        ("geostatistics", ["numpy", "scipy"], [2, 3], "geostatistics", "bounded local variograms/kriging/SGS/SIS"),
        ("calibrated-prediction", ["numpy", "sklearn"], [2, 3], "qi", "well-held-out regression/classification"),
        ("implicit-model", ["numpy", "gempy", "gempy_engine"], [3], "models", "headless reviewed structural groups"),
        ("resqml-exchange", ["numpy", "resqpy", "pyproj", "h5py"], [3], "models", "regular/explicit split-pillar EPC/HDF5"),
        ("deterministic-inversion", ["numpy", "scipy", "pylops"], [2,3], "qi", "poststack/prestack gathers and explicit inline/crossline volumes"),
        ("stable-fir-4d", ["numpy", "scipy"], [2,3], "4d", "reviewed aligned traces/volumes; full-window stable FIR fitting"),
        ("vintage-registration", ["numpy", "scipy"], [3], "4d", "stable-region bounded physical translation"),
        ("travel-times", ["numpy", "scipy"], [2, 3], "travel-times", "first-order isotropic fast marching"),
        ("depth-conversion", ["numpy", "scipy"], [3], "velocity", "explicit interval-velocity cube conversion"),
        ("fault-block-structure", ["numpy", "scipy"], [2, 3], "surfaces", "reviewed blocks, proportional layers and map closures"),
        ("surface-statics", ["numpy", "scipy"], [2, 3], "statics", "source/receiver delay inversion from reviewed timing residuals"),
        ("trace-regularisation", ["numpy", "scipy"], [2, 3], "regularise", "explicit acquisition-coordinate local RBF interpolation"),
        ("horizon-tracking", ["numpy", "scipy"], [3], "surfaces", "editable seed/event/correlation proposals and reviewed barriers"),
        ("cloud-analytical-index", ["numpy", "zarr"], [2,3], "index-manifest", "resumable lossless ragged Zarr v3 partitions and display pyramids"),
        ("slices", ["numpy", "scipy"], [2,3], "slice", "bounded inline, crossline, time and arbitrary sections"),
        ("acoustic-rtm-fwi", ["numpy", "devito"], [2,3], "acoustic", "CPU multishot modelling, RTM and FWI with compatible checkpoints"),
    ]
    try:profiles=json.loads(os.environ.get('STRATAX_SEISMIC_TOOL_PROFILES','{}'))
    except (ValueError,TypeError):profiles={}
    result = []
    for name, dependencies, dimensions, route, scope in definitions:
        missing = [dependency for dependency in dependencies if importlib.util.find_spec(dependency) is None]
        kind='acoustic' if route=='acoustic' else 'models' if route in ('models','qi','geometry') else 'seismic'
        commissioned=bool(profiles.get(kind,{}).get('job') and profiles.get(kind,{}).get('resources',{}).get('image'))
        result.append(dict(id=name,available=commissioned or not missing,directAvailable=not missing,jobAvailable=commissioned,
                           missingLocalDependencies=missing,dimensions=dimensions,route=f"tools/{route}",scope=scope,
                           execution='approved-private-job' if commissioned else 'local-runtime',
                           fieldScaleQualified=False,testingStatus='pending',fullProgrammeImplemented=False))
    return dict(engineVersion="stratax-seismic/2.1", engines=result)
