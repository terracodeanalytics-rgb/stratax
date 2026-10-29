"""Known structural truth, qualified with the isolated headless model profile."""
import importlib.util
import os
from pathlib import Path
import sys

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
if os.environ.get("STRATAX_MODEL_RUNTIME"):
    sys.path.insert(0, os.environ["STRATAX_MODEL_RUNTIME"])
pytestmark = pytest.mark.skipif(importlib.util.find_spec("gempy") is None, reason="Requires pinned headless model runtime")


def surface(points, orientations):
    return dict(name="interface", points=points, orientations=orientations)


def test_gempy_recovers_known_horizontal_plane():
    from seismic_implicit_model import compute_implicit_model
    groups = [dict(name="strata", relation="ERODE", elements=[surface(
        [[10, 10, 50], [90, 10, 50], [10, 90, 50], [90, 90, 50]], [[50, 50, 50, 0, 0, 1]])])]
    out = compute_implicit_model([0, 100, 0, 100, 0, 100], [5, 5, 10], groups, geometry_confirmed=True)
    lithology = out["lithology"]
    assert np.unique(lithology[..., :5]).tolist() == [2]
    assert np.unique(lithology[..., 5:]).tolist() == [1]


def test_gempy_preserves_planted_fault_throw():
    from seismic_implicit_model import compute_implicit_model
    groups = [dict(name="faultgroup", relation="FAULT", affects=["strata"], elements=[
        dict(name="fault", points=[[50, 10, 10], [50, 90, 10], [50, 10, 90], [50, 90, 90]],
             orientations=[[50, 50, 50, 1, 0, 0]])]),
        dict(name="strata", relation="ERODE", elements=[surface(
            [[10, 10, 40], [10, 90, 40], [90, 10, 60], [90, 90, 60]],
            [[10, 50, 40, 0, 0, 1], [90, 50, 60, 0, 0, 1]])])]
    out = compute_implicit_model([0, 100, 0, 100, 0, 100], [10, 10, 20], groups, geometry_confirmed=True)
    left, right = out["lithology"][1, 5], out["lithology"][8, 5]
    assert np.flatnonzero(np.diff(left))[0] == 7
    assert np.flatnonzero(np.diff(right))[0] == 11
    assert left[9] != right[9]
