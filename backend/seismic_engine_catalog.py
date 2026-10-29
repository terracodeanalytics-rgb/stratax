"""Runtime capability truth for bounded engines; no field qualification inferred."""
import importlib.metadata
import importlib.util


def engine_catalog():
    definitions = [
        ("kirchhoff", ["numpy", "scipy"], [2, 3], "imaging", "homogeneous or supplied one-way tables"),
        ("surface-multiple-prediction", ["numpy", "scipy"], [2, 3], "marine", "complete collocated common surface grid"),
        ("structure-attributes", ["numpy", "scipy"], [3], "attributes", "physical-coordinate structure tensors"),
        ("geostatistics", ["numpy", "scipy"], [2, 3], "geostatistics", "bounded local variograms/kriging/SGS/SIS"),
        ("calibrated-prediction", ["numpy", "sklearn"], [2, 3], "qi", "well-held-out regression/classification"),
        ("implicit-model", ["numpy", "gempy", "gempy_engine"], [3], "models", "headless reviewed structural groups"),
        ("resqml-exchange", ["numpy", "resqpy", "pyproj", "h5py"], [3], "models", "regular/explicit split-pillar EPC/HDF5"),
        ("deterministic-inversion", ["numpy", "scipy", "pylops"], [2], "qi", "bounded poststack and angle-gather prestack inversion"),
        ("stable-fir-4d", ["numpy", "scipy"], [2], "4d", "reviewed aligned trace blocks; full-window stable FIR fitting"),
        ("vintage-registration", ["numpy", "scipy"], [3], "4d", "stable-region bounded physical translation"),
        ("travel-times", ["numpy", "scipy"], [2, 3], "travel-times", "first-order isotropic fast marching"),
        ("depth-conversion", ["numpy", "scipy"], [3], "velocity", "explicit interval-velocity cube conversion"),
        ("fault-block-structure", ["numpy", "scipy"], [2, 3], "surfaces", "reviewed blocks, proportional layers and map closures"),
        ("surface-statics", ["numpy", "scipy"], [2, 3], "statics", "source/receiver delay inversion from reviewed timing residuals"),
        ("trace-regularisation", ["numpy", "scipy"], [2, 3], "regularise", "explicit acquisition-coordinate local RBF interpolation"),
        ("horizon-tracking", ["numpy", "scipy"], [3], "surfaces", "editable seed/event/correlation proposals and reviewed barriers"),
    ]
    result = []
    for name, dependencies, dimensions, route, scope in definitions:
        missing = [dependency for dependency in dependencies if importlib.util.find_spec(dependency) is None]
        result.append(dict(id=name, available=not missing, missingDependencies=missing,
                           dimensions=dimensions, route=f"tools/{route}", scope=scope, fieldScaleQualified=False))
    result.append(dict(id="acoustic-rtm-fwi", available=False, dimensions=[2, 3],
                       scope="compiled worker kernels; hosted acoustic dispatcher not commissioned", fieldScaleQualified=False))
    return dict(engineVersion="stratax-seismic/2.0", engines=result)
