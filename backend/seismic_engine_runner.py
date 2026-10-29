"""Offline/private-worker JSON engine runner with atomic NPZ result artifacts.

Accepts explicit local manifests; cloud launch/owner/estimate admission belongs to
the existing control plane. This entry point performs no uploads or job dispatch.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile

import numpy as np
from seismic_processing import require


def _atomic_npz(path, arrays):
    path = Path(path)
    require(path.parent.is_dir(), "Choose an existing private output directory.")
    handle, temporary = tempfile.mkstemp(prefix=".stratax-", suffix=".npz", dir=path.parent)
    try:
        with os.fdopen(handle, "wb") as stream:
            np.savez_compressed(stream, **arrays)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary): os.unlink(temporary)


def pack_result(value):
    arrays = {}
    def pack(item):
        if isinstance(item, np.ndarray):
            key = f"array{len(arrays)}"; arrays[key] = item
            require(item.dtype.kind in "biuf", "Only numeric arrays may enter engine artifacts.")
            return dict(array=key, shape=list(item.shape), dtype=str(item.dtype))
        if isinstance(item, dict): return {str(k):pack(v) for k,v in item.items()}
        if isinstance(item, (list,tuple)): return [pack(v) for v in item]
        if isinstance(item, np.generic): return item.item()
        return item
    tree = pack(value)
    arrays["metadata"] = np.frombuffer(json.dumps(tree,allow_nan=False).encode(),dtype=np.uint8)
    return arrays


def execute_manifest(manifest, *, checkpoint=lambda value:None):
    require(isinstance(manifest,dict) and manifest.get("engineVersion") == "stratax-seismic/2.0",
            "Provide an explicit engine-version-2 manifest.")
    operation = manifest["engine"]; arguments = manifest["arguments"]
    require(isinstance(arguments,dict), "Engine arguments must be an object.")
    if operation == "acoustic":
        from seismic_acoustic_engine import execute_acoustic
        return execute_acoustic(arguments["configuration"],arguments.get("observed"),
                                checkpoint=checkpoint,resumed=arguments.get("resumed"))
    if operation == "implicit-model":
        from seismic_implicit_model import compute_implicit_model
        return compute_implicit_model(**arguments)
    if operation == "srme":
        from seismic_srme import predict_surface_multiples
        return predict_surface_multiples(**arguments)
    if operation == "structure-attributes":
        from seismic_volume_attributes import structure_attributes
        return structure_attributes(**arguments)
    if operation == "travel-times":
        from seismic_travel_times import first_arrival_times
        return dict(times=first_arrival_times(**arguments))
    if operation == "depth-conversion":
        from seismic_depth_model import convert_cube
        return convert_cube(**arguments)
    if operation == "regularisation":
        from seismic_regularization import regularise_traces
        return regularise_traces(**arguments)
    if operation == "statics":
        from seismic_statics import fit_surface_statics
        return fit_surface_statics(**arguments)
    if operation == "horizon-tracking":
        from seismic_horizon_tracking import track_volume
        return track_volume(**arguments)
    if operation == "prediction":
        from seismic_prediction import calibrated_prediction
        return calibrated_prediction(**arguments)
    if operation in ("kriging","simulation","variogram"):
        from seismic_geostatistics import ordinary_kriging,sequential_simulation,empirical_variogram
        return dict(kriging=ordinary_kriging,simulation=sequential_simulation,variogram=empirical_variogram)[operation](**arguments)
    raise ValueError("The requested engine is not available through this manifest runner.")


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest");parser.add_argument("output")
    parser.add_argument("--checkpoint")
    options=parser.parse_args()
    source=Path(options.manifest)
    require(source.stat().st_size <= 64*1024**2,"Manifest exceeds the bounded private-worker input budget.")
    raw=source.read_bytes();manifest=json.loads(raw)
    def checkpoint(value):
        if options.checkpoint: _atomic_npz(options.checkpoint,pack_result(value))
    result=execute_manifest(manifest,checkpoint=checkpoint)
    _atomic_npz(options.output,pack_result(dict(sourceSha256=hashlib.sha256(raw).hexdigest(),result=result)))


if __name__ == "__main__": main()
