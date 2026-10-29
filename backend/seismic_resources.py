"""Canonical versioned seismic resource contracts (M0.03 / M0.04).

Resources are metadata + private artifact references. Arrays never enter Firestore
as samples. Unknown CRS/datum/time conventions stay unconfirmed until reviewed.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

RESOURCE_KINDS = (
    "survey",
    "gather",
    "angle-stack",
    "velocity",
    "model",
    "wavelet",
    "horizon",
    "fault-surface",
    "4d-pair",
)

VELOCITY_TYPES = ("interval", "rms", "average", "interval-depth", "rms-time")
DOMAINS = ("TWT", "one-way", "depth", "unconfirmed")
SI_LENGTH = "m"
SI_TIME = "s"
SI_VELOCITY = "m/s"
SI_DENSITY = "kg/m^3"
SI_IMPEDANCE = "kg/(m^2·s)"


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True, allow_inf_nan=False)


class ArtifactRef(Strict):
    bucket: str = Field(min_length=3, max_length=220)
    object: str = Field(min_length=1, max_length=1024)
    generation: str = Field(min_length=1, max_length=64)
    sha256: str = Field(min_length=64, max_length=64)
    contentType: str = Field(min_length=3, max_length=120)
    byteLength: int = Field(ge=0)


class CoordinateFrame(Strict):
    crs: str = Field(min_length=3, max_length=4096)
    datum: str = Field(min_length=1, max_length=240)
    axisOrder: Literal[
        "easting-northing",
        "northing-easting",
        "longitude-latitude",
        "latitude-longitude",
        "inline-crossline",
        "unconfirmed",
    ]
    unit: Literal["m", "ft", "us-ft", "degrees", "arcseconds", "bin", "unconfirmed"]
    confirmed: bool = False

    @model_validator(mode="after")
    def require_confirmation(self):
        if self.confirmed and (
            self.axisOrder == "unconfirmed"
            or self.unit == "unconfirmed"
            or self.crs.strip().lower() in ("", "unknown", "unconfirmed", "none")
        ):
            raise ValueError("A confirmed coordinate frame cannot leave CRS, axis or unit unconfirmed.")
        return self


class DomainFrame(Strict):
    domain: Literal["TWT", "one-way", "depth", "unconfirmed"]
    unit: Literal["s", "m", "ft", "us-ft", "unconfirmed"]
    start: float | None = None
    interval: float | None = None
    confirmed: bool = False

    @model_validator(mode="after")
    def consistent(self):
        if self.confirmed:
            if self.domain == "unconfirmed" or self.unit == "unconfirmed":
                raise ValueError("Confirm domain and unit together.")
            if self.domain in ("TWT", "one-way") and self.unit != "s":
                raise ValueError("Time domains use SI seconds.")
            if self.domain == "depth" and self.unit not in ("m", "ft", "us-ft"):
                raise ValueError("Depth domains require an explicit length unit.")
            if self.interval is None or self.interval <= 0:
                raise ValueError("Confirmed domains need a positive sample interval.")
        return self


class SeismicResource(Strict):
    id: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    kind: Literal[
        "survey",
        "gather",
        "angle-stack",
        "velocity",
        "model",
        "wavelet",
        "horizon",
        "fault-surface",
        "4d-pair",
    ]
    label: str = Field(min_length=1, max_length=200)
    revision: int = Field(ge=0)
    sourceIds: list[str] = Field(default_factory=list, max_length=64)
    sourceVersions: list[str] = Field(default_factory=list, max_length=64)
    coordinates: CoordinateFrame
    domain: DomainFrame
    amplitudeUnit: str = Field(min_length=1, max_length=80)
    artifacts: list[ArtifactRef] = Field(default_factory=list, max_length=32)
    notes: str = Field(default="", max_length=4000)
    geometryQualifiedForProcessing: bool = False


class SurveyResource(SeismicResource):
    kind: Literal["survey"] = "survey"
    dimension: Literal[2, 3]
    dataKind: Literal["unstacked", "poststack"]
    traceCount: int = Field(ge=1)
    geometryRevision: int = Field(ge=0)


class GatherResource(SeismicResource):
    kind: Literal["gather"] = "gather"
    gatherType: Literal["shot", "cdp", "receiver", "offset", "angle"]
    offsetsMetres: list[float] | None = None
    anglesDegrees: list[float] | None = None

    @model_validator(mode="after")
    def gather_axes(self):
        if self.gatherType == "angle":
            if not self.anglesDegrees:
                raise ValueError("Angle gathers require reviewed incidence angles; stacked cubes cannot invent them.")
            if any(not (0 <= a < 60) for a in self.anglesDegrees):
                raise ValueError("Incidence angles must be finite values from 0 to below 60 degrees.")
        if self.gatherType == "offset" and not self.offsetsMetres:
            raise ValueError("Offset gathers require reviewed offsets in metres.")
        return self


class VelocityResource(SeismicResource):
    kind: Literal["velocity"] = "velocity"
    velocityType: Literal["interval", "rms", "average", "interval-depth", "rms-time"]
    siUnit: Literal["m/s"] = "m/s"

    @model_validator(mode="after")
    def velocity_domain(self):
        if self.velocityType in ("interval", "rms", "average", "rms-time") and self.domain.confirmed and self.domain.domain not in ("TWT", "one-way"):
            raise ValueError("Time-domain velocity types require a confirmed time domain.")
        if self.velocityType == "interval-depth" and self.domain.confirmed and self.domain.domain != "depth":
            raise ValueError("Depth-interval velocities require a confirmed depth domain.")
        return self


class ModelResource(SeismicResource):
    kind: Literal["model"] = "model"
    modelKind: Literal["velocity", "density", "impedance", "property", "structural"]
    siUnit: str = Field(min_length=1, max_length=40)
    grid: Literal["regular", "corner-point", "unstructured"] = "regular"


class FourDPairResource(SeismicResource):
    kind: Literal["4d-pair"] = "4d-pair"
    baselineSourceId: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    monitorSourceId: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    baselineVersion: str = Field(min_length=1, max_length=100)
    monitorVersion: str = Field(min_length=1, max_length=100)
    commonSupportConfirmed: bool = False

    @model_validator(mode="after")
    def distinct_vintages(self):
        if self.baselineSourceId == self.monitorSourceId and self.baselineVersion == self.monitorVersion:
            raise ValueError("Baseline and monitor must identify distinct vintages.")
        if self.commonSupportConfirmed and not self.geometryQualifiedForProcessing:
            raise ValueError("Common 4D support requires reviewed, processing-qualified geometry.")
        return self


def si_labels():
    return dict(
        length=SI_LENGTH,
        time=SI_TIME,
        velocity=SI_VELOCITY,
        density=SI_DENSITY,
        impedance=SI_IMPEDANCE,
        resourceKinds=list(RESOURCE_KINDS),
        velocityTypes=list(VELOCITY_TYPES),
        domains=list(DOMAINS),
    )
