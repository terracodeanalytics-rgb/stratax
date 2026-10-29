"""4D association and QC helpers built on repeatability/equalisation foundations."""
from __future__ import annotations

import numpy as np

from seismic_processing import TraceBlock, equalise, repeatability, require
from seismic_resources import FourDPairResource


def associate_vintages(baseline_source_id, baseline_version, monitor_source_id, monitor_version,
                      coordinates, domain, amplitude_unit, geometry_qualified=False, common_support=False):
    return FourDPairResource(
        id=f"{baseline_source_id}-{monitor_source_id}",
        label=f"{baseline_source_id}→{monitor_source_id}",
        revision=0,
        coordinates=coordinates,
        domain=domain,
        amplitudeUnit=amplitude_unit,
        baselineSourceId=baseline_source_id,
        monitorSourceId=monitor_source_id,
        baselineVersion=baseline_version,
        monitorVersion=monitor_version,
        geometryQualifiedForProcessing=geometry_qualified,
        commonSupportConfirmed=common_support and geometry_qualified,
    )


def difference_volume(baseline, monitor, mask=None):
    require(isinstance(baseline, TraceBlock) and isinstance(monitor, TraceBlock), "Provide TraceBlock vintages.")
    require(baseline.samples.shape == monitor.samples.shape and baseline.dt == monitor.dt and baseline.start == monitor.start,
            "Vintages must be co-registered before differencing.")
    metrics = repeatability(baseline.samples, monitor.samples, mask=mask)
    diff = monitor.samples - baseline.samples
    if mask is not None:
        diff = np.where(mask, diff, np.nan)
    return TraceBlock(diff, baseline.dt, baseline.start, baseline.domain,
                      np.isfinite(diff), [*baseline.history, {"method": "4d-difference", "parameters": metrics}]), metrics


def match_and_difference(baseline, monitor, stable_mask, max_lag=10):
    matched, report = equalise(baseline, monitor, stable_mask, max_lag=max_lag)
    diff, metrics = difference_volume(baseline, matched, mask=stable_mask)
    return matched, diff, dict(equalisation=report, difference=metrics)
