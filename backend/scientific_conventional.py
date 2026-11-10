"""Explicit conventional-log preparation and calibration; no inferred geology."""
import numpy as np
from scipy import stats

IDS = {"depth-match", "align-curve", "endpoint-proposal", "temperature-profile",
       "resistivity-temperature", "porosity-combine", "pickett-fit"}


def evaluate_conventional(method, a, p, units):
    from scientific_core import require, number, increasing, fractional, text
    out, summary, output_units, notes = {}, {}, {}, []
    if method == "depth-match":
        d = a["depth"]
        increasing(d)
        anchors = np.asarray(p["anchors"], float)
        require(anchors.ndim == 2 and anchors.shape[1] == 2 and len(anchors) >= 2
                and len(anchors) <= 100 and np.all(np.isfinite(anchors)),
                "Provide 2–100 finite source/target depth anchors in metres.")
        require(np.all(np.diff(anchors, axis=0) > 0),
                "Source and target anchors must both increase; depth folding is not permitted.")
        text(p, "sourceRun")
        out = dict(depth=np.interp(d, anchors[:, 0], anchors[:, 1], left=np.nan, right=np.nan), originalDepth=d, curve=a["curve"])
        output_units = dict(depth="m", originalDepth="m", curve=units["curve"])
        summary = dict(sourceRun=p["sourceRun"], anchors=anchors.tolist(), support="Only between reviewed anchors")
        notes.append("Apply these anchors only to explicitly selected curves from the same logging run; this is not interwell correlation.")
    elif method == "align-curve":
        d, x = a["depth"], a["curve"]
        increasing(d)
        top, base, spacing, gap = [number(p, k) for k in ("top", "base", "spacing", "maxGap")]
        require(base > top and spacing > 0 and gap > 0, "Review alignment bounds, spacing and maximum gap.")
        text(p, "depthReference")
        require(p["depthReference"] in ("MD", "TVD", "TVDSS"), "Confirm the alignment depth reference.")
        require(p["interpolation"] in ("linear", "nearest"), "Choose linear or nearest interpolation.")
        count = int(np.floor((base-top)/spacing))+1
        require(1 < count <= 250000, "Alignment must contain 2–250,000 target stations.")
        target = top+np.arange(count)*spacing
        right = np.searchsorted(d, target, side="left")
        left = np.maximum(0, right-1)
        bounded = (right > 0) & (right < len(d))
        safe_right = np.minimum(right, len(d)-1)
        nearest = np.where(np.abs(target-d[left]) <= np.abs(d[safe_right]-target), left, safe_right)
        exact = np.isclose(d[nearest],target,rtol=0,atol=1e-8)
        supported = bounded & ((d[safe_right]-d[left]) <= gap+1e-8) & np.isfinite(x[left]) & np.isfinite(x[safe_right])
        y = np.full(count, np.nan)
        if p["interpolation"] == "linear":
            y[supported] = x[left[supported]]+(x[safe_right[supported]]-x[left[supported]])*(target[supported]-d[left[supported]])/(d[safe_right[supported]]-d[left[supported]])
        else:
            y[supported] = x[nearest[supported]]
        y[exact] = x[nearest[exact]]
        out = dict(depth=target, curve=y, supported=np.isfinite(y).astype(float))
        output_units = dict(depth="m", curve=units["curve"], supported="v/v")
        summary = dict(depthReference=p["depthReference"], sourceRows=len(d), targetRows=count, supportedRows=int(np.isfinite(y).sum()))
        notes.append("No extrapolation or interpolation across null observations or gaps exceeding the reviewed limit.")
    elif method == "endpoint-proposal":
        d, x = a["depth"], a["curve"]
        top, base = number(p, "top"), number(p, "base")
        lo, hi = number(p, "lowPercentile", 0, 100), number(p, "highPercentile", 0, 100)
        require(base > top and hi > lo, "Review the calibration interval and percentile order.")
        selected = np.isfinite(d) & (d >= top) & (d < base) & np.isfinite(x)
        require(selected.sum() >= 5, "Select at least five finite calibration samples.")
        low, high = np.percentile(x[selected], [lo, hi])
        require(high > low, "This interval does not span distinct endpoints.")
        out = dict(depth=d, curve=x, calibrationSelection=selected.astype(float))
        output_units = dict(depth="m", curve=units["curve"], calibrationSelection="v/v")
        summary = dict(proposedLow=float(low), proposedHigh=float(high), selectedRows=int(selected.sum()), excludedRows=int((~selected).sum()), interval=dict(top=top, base=base), percentiles=[lo, hi])
        notes.append("Statistical endpoints are proposals only. They do not identify clean rock or shale; review the supporting interval and geology.")
    elif method == "temperature-profile":
        d = a["depth"]
        increasing(d)
        text(p, "citation")
        require(p["depthReference"] in ("TVD", "TVDSS"), "A geothermal profile requires a reviewed vertical depth reference.")
        top, base = number(p, "top"), number(p, "base")
        require(base > top, "Review the temperature profile's supported interval.")
        gradient = None
        if p["anchors"]:
            anchors = np.asarray(p["anchors"], float)
            require(anchors.ndim == 2 and anchors.shape[1] == 2 and 2 <= len(anchors) <= 100 and np.all(np.isfinite(anchors)) and np.all(np.diff(anchors[:,0]) > 0) and np.all(anchors[:,1] > -273.15), "Supply 2–100 increasing vertical-depth/Celsius anchors above absolute zero.")
            y = np.interp(d, anchors[:,0], anchors[:,1], left=np.nan, right=np.nan)
        else:
            temperature, gradient = number(p, "temperatureC"), number(p, "gradientCPerM")
            require(temperature > -273.15, "Review the anchor temperature.")
            y = temperature+(d-top)*gradient
        y[(d < top) | (d > base)] = np.nan
        require(np.all(y[np.isfinite(y)] > -273.15), "The temperature profile crosses absolute zero.")
        out = dict(depth=d, temperatureC=y)
        output_units = dict(depth="m", temperatureC="degC")
        summary = dict(depthReference=p["depthReference"], citation=p["citation"], gradientCPerM=gradient, anchors=p["anchors"])
        notes.append("Supplied temperature anchor/gradient scenario; no bottom-hole temperature correction is inferred.")
    elif method == "resistivity-temperature":
        temperature_unit=str(units["temperature"]).strip().lower()
        require(temperature_unit in ("degc","°c","celsius","degf","°f","fahrenheit","k","kelvin"), "Confirm the retained temperature unit as Celsius, Fahrenheit or Kelvin.")
        t = (a["temperature"]-32)*5/9 if temperature_unit in ("degf","°f","fahrenheit") else a["temperature"]-273.15 if temperature_unit in ("k","kelvin") else a["temperature"]
        sample_r, sample_t = number(p, "sampleResistivity", positive=True), number(p, "sampleTemperatureC")
        constant = number(p, "constantC", positive=True)
        text(p, "citation")
        require(p["fluidKind"] in ("formation-water", "mud", "mud-filtrate", "mud-cake"), "Identify the measured fluid separately.")
        require(sample_t > -273.15 and np.all(t[np.isfinite(t)] > -273.15) and sample_t+constant > 0 and np.all(t[np.isfinite(t)]+constant > 0), "Temperature is outside this documented correction's domain.")
        out = dict(resistivity=sample_r*(sample_t+constant)/(t+constant))
        output_units = dict(resistivity="ohm.m")
        summary = dict(fluidKind=p["fluidKind"], citation=p["citation"], inputTemperatureUnit=units["temperature"], equation="R(T)=R(sample)*(Tsample+C)/(T+C); Celsius")
        notes.append("The user must establish this empirical equation and constant apply to the measured fluid and temperature range. Mud resistivity is not formation-water Rw.")
    elif method == "porosity-combine":
        x = a["estimates"]
        weights = np.asarray(p["weights"], float)
        require(weights.ndim == 1 and len(weights) == x.shape[1] and np.all(np.isfinite(weights)) and np.all(weights >= 0) and weights.sum() > 0, "Supply one nonnegative weight per porosity estimate.")
        require(p["basis"] in ("total", "effective"), "Combine only estimates of the same reviewed porosity basis.")
        require(p["missing"] in ("strict", "renormalize"), "Choose explicit missing-estimate handling.")
        fractional(x, "Porosity estimates")
        valid = np.isfinite(x)
        denominator = (valid*weights).sum(axis=1)
        combined = np.divide(np.where(valid, x, 0)@weights, denominator, out=np.full(len(x), np.nan), where=denominator > 0)
        if p["missing"] == "strict": combined[~np.all(valid[:, weights > 0], axis=1)] = np.nan
        out = dict(porosity=combined)
        output_units = dict(porosity="v/v")
        summary = dict(basis=p["basis"], weights=weights.tolist(), missing=p["missing"])
    elif method == "pickett-fit":
        phi, rt = a["porosity"], a["rt"]
        fractional(phi, "Porosity")
        text(p, "waterZoneEvidence")
        valid = np.isfinite(phi) & np.isfinite(rt) & (phi > 0) & (rt > 0)
        require(valid.sum() >= 5 and np.ptp(np.log10(phi[valid])) > 0, "Provide at least five paired clean water-zone samples spanning porosity.")
        fit = stats.linregress(np.log10(phi[valid]), np.log10(rt[valid]))
        m, product = -float(fit.slope), float(10**fit.intercept)
        require(m > 0 and np.isfinite(product), "These selected samples do not support a positive Archie cementation exponent.")
        out = dict(porosity=phi, observedRt=rt, fittedRt=product*phi**(-m))
        output_units = dict(porosity="v/v", observedRt="ohm.m", fittedRt="ohm.m")
        summary = dict(m=m, aRw=product, rSquared=float(fit.rvalue**2), pairs=int(valid.sum()), waterZoneEvidence=p["waterZoneEvidence"])
        require(p["knownParameter"] in ("none", "a", "rw"), "Identify which independently known parameter constrains the fit.")
        if p["knownParameter"] != "none":
            value = number(p, "knownValue", positive=True)
            summary.update({p["knownParameter"]: value, "rw" if p["knownParameter"] == "a" else "a": product/value})
        notes.append("Fit assumes Sw=1 in independently selected clean water-bearing rock. Only m and a·Rw are identifiable without independent a or Rw; n is not fitted.")
    return out, output_units, summary, notes
