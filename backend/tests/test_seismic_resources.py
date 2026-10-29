import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest

from seismic_profiles import batch_available, estimate_ceiling_usd, validate_batch_profile
from seismic_resources import (
    CoordinateFrame,
    DomainFrame,
    FourDPairResource,
    GatherResource,
    VelocityResource,
    si_labels,
)


def coords(confirmed=True):
    return CoordinateFrame(
        crs="NAD27 / Texas South Zone (reviewed declaration; EPSG not guessed)",
        datum="NAD27",
        axisOrder="northing-easting",
        unit="ft",
        confirmed=confirmed,
    )


def domain(confirmed=True):
    return DomainFrame(domain="TWT", unit="s", start=0.0, interval=0.002, confirmed=confirmed)


def test_si_labels_and_velocity_domain_guards():
    labels = si_labels()
    assert labels["velocity"] == "m/s" and "survey" in labels["resourceKinds"]
    VelocityResource(
        id="v1",
        label="RMS",
        revision=0,
        coordinates=coords(),
        domain=domain(),
        amplitudeUnit="m/s",
        velocityType="rms",
    )
    with pytest.raises(ValueError, match="depth"):
        VelocityResource(
            id="v2",
            label="depth interval",
            revision=0,
            coordinates=coords(),
            domain=domain(),
            amplitudeUnit="m/s",
            velocityType="interval-depth",
        )


def test_angle_gathers_reject_invented_angles():
    with pytest.raises(ValueError, match="angles"):
        GatherResource(
            id="g1",
            label="angles",
            revision=0,
            coordinates=coords(),
            domain=domain(),
            amplitudeUnit="recorded amplitude",
            gatherType="angle",
        )
    GatherResource(
        id="g2",
        label="angles",
        revision=0,
        coordinates=coords(),
        domain=domain(),
        amplitudeUnit="recorded amplitude",
        gatherType="angle",
        anglesDegrees=[5.0, 15.0, 25.0],
    )


def test_4d_pair_requires_distinct_vintages_and_geometry():
    with pytest.raises(ValueError, match="distinct"):
        FourDPairResource(
            id="p1",
            label="pair",
            revision=0,
            coordinates=coords(),
            domain=domain(),
            amplitudeUnit="recorded amplitude",
            baselineSourceId="s",
            monitorSourceId="s",
            baselineVersion="1",
            monitorVersion="1",
        )
    with pytest.raises(ValueError, match="geometry"):
        FourDPairResource(
            id="p2",
            label="pair",
            revision=0,
            coordinates=coords(),
            domain=domain(),
            amplitudeUnit="recorded amplitude",
            baselineSourceId="a",
            monitorSourceId="b",
            baselineVersion="1",
            monitorVersion="2",
            commonSupportConfirmed=True,
            geometryQualifiedForProcessing=False,
        )


def test_batch_profile_validation_and_ceiling():
    profile = dict(
        image="us-central1-docker.pkg.dev/project-9afac/stratax/stratax-seismic-worker@sha256:" + "a" * 64,
        cpu=4,
        memoryMib=16384,
        maxSeconds=1800,
        vcpuSecondUsd=0.000024,
        memoryGibSecondUsd=0.0000025,
        priceAsOf="2026-10-29",
        priceSource="https://cloud.google.com/products/calculator",
        minInstances=0,
    )
    validate_batch_profile(profile, require_account=False)
    assert estimate_ceiling_usd(profile) > 0
    with pytest.raises(ValueError, match="standby|minInstances"):
        validate_batch_profile(profile | dict(minInstances=1), require_account=False)
    assert batch_available(env={"STRATAX_SEISMIC_BATCH_PROFILE": "{}", "STRATAX_SEISMIC_BATCH_ACCOUNT": "x"}) is False
