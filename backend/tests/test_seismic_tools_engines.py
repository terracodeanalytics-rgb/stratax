"""Actual tool-route validation and numerical return paths, with isolated identity."""
import sys
from pathlib import Path

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from seismic_tools_api import install_seismic_tools


def client():
    app = FastAPI()
    def owner(): return dict(uid="owner")
    def project(uid, pid):
        if uid != "owner" or pid != "owned": raise HTTPException(404, "Project not found")
    def fail(code, kind, message): raise HTTPException(code, dict(code=kind, message=message))
    install_seismic_tools(app, owner, project, fail)
    return TestClient(app)


def test_new_tools_owner_scope_and_capability_truth():
    c = client()
    assert c.get("/api/projects/other/seismic/tools/capabilities").status_code == 404
    result = c.get("/api/projects/owned/seismic/tools/capabilities")
    assert result.status_code == 200
    acoustic = next(x for x in result.json()["engines"] if x["id"] == "acoustic-rtm-fwi")
    assert acoustic["available"] is False and acoustic["dimensions"] == [2, 3]
    assert not any(x["fieldScaleQualified"] for x in result.json()["engines"])


def test_imaging_model_to_migrate_uses_actual_point_geometry():
    c = client(); path = "/api/projects/owned/seismic/tools/imaging"
    body = dict(points=[[0, 0, 100]], sources=[[0, 0, 0]], receivers=[[0, 0, 0]], sampleCount=256,
                dt=.001, velocity=2000, apertureMetres=1000, operation="model", reflectivity=[1.])
    response = c.post(path, json=body)
    assert response.status_code == 200, response.text
    observed = np.asarray(response.json()["result"]["values"]).reshape(1, 256)
    assert observed[0, 100] == 1
    body.update(operation="migrate", samples=observed.tolist())
    migrated = c.post(path, json=body)
    assert migrated.status_code == 200 and migrated.json()["result"]["values"] == [1.]
    body["receivers"] = [[0, 0]]
    assert c.post(path, json=body).status_code == 400
    assert c.post(path.replace("owned", "other"), json=body).status_code == 404


def test_kriging_sis_and_srme_api_outputs():
    c = client(); root = "/api/projects/owned/seismic/tools/"
    body = dict(operation="kriging", points=[[0, 0], [1, 0], [0, 1]], values=[2, 2, 2], targets=[[.5, .5]],
                ranges=[1, 1], sill=1)
    response = c.post(root+"geostatistics", json=body)
    assert response.status_code == 200, response.text
    assert np.isclose(response.json()["mean"]["values"][0], 2)
    body.update(operation="sis", values=[0, 1, 0], categories=[0, 1], seed=8)
    response = c.post(root+"geostatistics", json=body)
    assert response.status_code == 200, response.text
    assert response.json()["values"]["values"][0] in [0, 1]
    response = np.zeros((2, 2, 16)); response[:, :, 2] = 1
    body = dict(operation="srme-predict", response=response.tolist(), dt=.002, surfaceCoordinates=[[0], [10]],
                quadratureWeights=[1, 1], sourceWavelet=[1], geometryConfirmed=True)
    result = c.post(root+"marine", json=body)
    assert result.status_code == 200, result.text
    out = np.asarray(result.json()["multiples"]["values"]).reshape(2, 2, 16)
    np.testing.assert_allclose(out[:, :, 4], -.004 / 1.001, atol=1e-12)
    body["geometryConfirmed"] = False
    assert c.post(root+"marine", json=body).status_code == 400
