"""Public, dependency-light contracts for the versioned scientific methods."""
VERSION = "stratax-science/1.0"
MAX_ROWS = 250_000
MAX_CELLS = 2_000_000
ARTIFACT_BUDGET = 256 * 1024**2
METHODS = {}


def method(key, tool, name, inputs, parameters=None, reference="", workflow="petrophysics", description=""):
    METHODS[key] = dict(id=key, tool=tool, name=name, version=VERSION,
                        inputs=[dict(role=r, dimension=d) for r, d in inputs],
                        parameters=parameters or {}, reference=reference,
                        workflows=workflow.split("+"), description=description,
                        limits=dict(rows=MAX_ROWS, cells=MAX_CELLS, artifactBytes=ARTIFACT_BUDGET))


def p(default, description, kind="number"):
    return dict(default=default, description=description, type=kind)


AAPG = "https://wiki.aapg.org/Standard_interpretation"
SCIPY = "https://docs.scipy.org/doc/scipy/reference/"
USGS = "https://pubs.usgs.gov/wri/1983/4275/report.pdf"
BRUGES = "https://code.agilescientific.com/bruges/"
GSTOOLS = "https://geostat-framework.readthedocs.io/projects/gstools/en/stable/"
RESQML = "https://resqpy.readthedocs.io/en/stable/"

method("log-view", "logs", "Reviewed curve view", [("depth", "length"), ("curve", "numeric")], reference=AAPG)
for operation in ["integrity", "despike", "interpolate", "smooth", "normalize", "shift", "borehole"]:
    params = {
        "integrity": {}, "despike": {"window": p(7, "Odd median window"), "threshold": p(4, "MAD multiplier")},
        "interpolate": {"maxGap": p(1, "Largest permitted interior gap in metres")},
        "smooth": {"window": p(5, "Odd moving mean window; nulls preserved")},
        "normalize": {"sourceLow": p(None, "Source low endpoint"), "sourceHigh": p(None, "Source high endpoint"), "targetLow": p(0, "Target low endpoint"), "targetHigh": p(1, "Target high endpoint")},
        "shift": {"shift": p(0, "Depth shift in metres; no automatic resampling")},
        "borehole": {"bitSize": p(None, "Bit diameter in metres"), "tolerance": p(0.0254, "Permitted excess diameter in metres")},
    }[operation]
    method("qc-"+operation, "qc", operation.capitalize(), [("depth", "length"), ("curve", "length" if operation == "borehole" else "numeric")], params, SCIPY)
method("qc-splice", "qc", "Explicit curve splice", [("depth", "length"), ("curve", "numeric"), ("alternate", "numeric")], {"boundary": p(None, "Use alternate at/after this MD in metres")}, SCIPY)
method("facies-rules", "lithology", "Reviewed threshold facies", [("curve", "numeric")], {"thresholds": p([], "Ascending thresholds", "json"), "labels": p([], "One more class label than thresholds", "json")}, AAPG)
method("facies-cluster", "lithology", "Standardized k-means screening", [("x", "numeric"), ("y", "numeric")], {"clusters": p(3, "2–12 clusters"), "seed": p(42, "Reproducible seed")}, SCIPY)
method("crossplot", "lithology", "Evidence crossplot", [("x", "numeric"), ("y", "numeric")], reference=AAPG)
method("fluid-indicators", "fluids", "Resistivity and neutron-density indicators", [("deep", "resistivity"), ("shallow", "resistivity"), ("densityPorosity", "fraction"), ("neutronPorosity", "fraction")], reference=AAPG, description="Indicators are not fluid classifications; matrix-corrected porosities are required.")
for model in ["linear", "larionov-tertiary", "larionov-older", "stieber", "clavier"]:
    method("shale-"+model, "shale", model.replace("-", " ").title(), [("gr", "api")], {"clean": p(None, "Reviewed clean GR endpoint, gAPI"), "shale": p(None, "Reviewed shale GR endpoint, gAPI")}, AAPG)
method("porosity-density", "porosity", "Density porosity", [("density", "density")], {"matrix": p(None, "Matrix density kg/m³"), "fluid": p(None, "Fluid density kg/m³")}, AAPG)
method("porosity-sonic", "porosity", "Wyllie time-average porosity", [("slowness", "slowness")], {"matrix": p(None, "Matrix slowness s/m"), "fluid": p(None, "Fluid slowness s/m")}, AAPG)
method("porosity-neutron", "porosity", "Calibrated neutron response", [("neutron", "fraction")], {"scale": p(None, "Documented matrix-response scale"), "offset": p(None, "Documented matrix-response offset"), "calibration": p("", "Calibration citation", "text")}, AAPG)
method("porosity-effective", "porosity", "Shale porosity subtraction", [("total", "fraction"), ("vsh", "fraction")], {"shalePorosity": p(None, "Reviewed shale porosity v/v")}, AAPG)
for model in ["archie", "indonesian", "simandoux"]:
    inputs = [("porosity", "fraction"), ("rt", "resistivity")]
    if model != "archie": inputs += [("vsh", "fraction")]
    params = {"rw": p(None, "Water resistivity at formation temperature, ohm·m"), "a": p(1, "Tortuosity"), "m": p(2, "Cementation exponent"), "n": p(2, "Saturation exponent")}
    if model != "archie": params["rsh"] = p(None, "Reviewed shale resistivity ohm·m")
    method("saturation-"+model, "saturation", model.title(), inputs, params, AAPG)
method("permeability-regression", "permeability", "Core-calibrated log-linear regression", [("porosity", "fraction"), ("coreK", "permeability")], {"validationFraction": p(0.2, "Contiguous held-out tail fraction")}, SCIPY)
for model in ["timur", "coates"]:
    method("permeability-"+model, "permeability", "Calibrated "+model.title(), [("porosity", "fraction"), ("swi", "fraction")], {"coefficient": p(None, "Calibrated coefficient giving mD"), "phiExponent": p(4.4 if model == "timur" else 4, "Porosity exponent"), "swiExponent": p(2, "Irreducible-water exponent"), "calibration": p("", "Core-calibration reference", "text")}, AAPG)
method("hydraulic-units", "permeability", "RQI and flow-zone indicator", [("porosity", "fraction"), ("k", "permeability")], reference=AAPG)
method("mineral-inversion", "mineralogy", "Nonnegative volume-closure response inversion", [("responses", "array")], {"matrix": p([], "Rows=responses, columns=minerals; consistent response units", "json"), "minerals": p([], "Column labels", "json"), "closureWeight": p(100, "Volume closure weighting")}, SCIPY)
method("nmr-partition", "nmr", "T2 partition and calibrated SDR", [("spectrum", "array")], {"t2": p([], "T2 bins in milliseconds", "json"), "cutoff": p(33, "Reviewed bound/free cutoff ms"), "coefficient": p(None, "Calibrated SDR coefficient giving mD"), "phiExponent": p(4, "SDR porosity exponent"), "t2Exponent": p(2, "SDR T2 log-mean exponent")}, AAPG)
method("core-fit", "core", "Core/log depth-aligned comparison", [("core", "numeric"), ("log", "numeric")], reference=SCIPY)
for model in ["brooks-corey", "thomeer"]:
    method("height-"+model, "height", model.title()+" capillary fit", [("pc", "pressure"), ("sw", "fraction")], {"swr": p(None, "Reviewed irreducible water fraction")}, SCIPY)
method("leverett-j", "height", "Leverett J normalization", [("pc", "pressure"), ("porosity", "fraction"), ("k", "permeability")], {"ift": p(None, "Interfacial tension N/m"), "contactAngle": p(None, "Contact angle degrees")}, AAPG)
method("image-normalize", "images", "Static/dynamic image normalization", [("image", "array")], {"mode": p("static", "static or dynamic", "text"), "low": p(2, "Low percentile"), "high": p(98, "High percentile")}, SCIPY)
method("pressure-gradient", "pressure", "Calibrated pressure-depth regression", [("depth", "length"), ("pressure", "pressure")], {"depthReference": p("", "TVD or TVDSS", "text"), "datum": p("", "Documented vertical datum", "text")}, SCIPY)
for model in ["ridge", "forest"]:
    method("predict-"+model, "reconstruct", model.title()+" blind-well prediction", [("features", "array"), ("target", "numeric"), ("wellGroup", "category")], {"seed": p(42, "Seed"), "heldOutWell": p("", "Well group withheld from training", "text")}, "https://scikit-learn.org/stable/modules/cross_validation.html")
method("correction-table", "corrections", "Documented tool-response correction table", [("curve", "numeric")], {"tool": p("", "Exact vendor/tool/version", "text"), "citation": p("", "Authorized correction-table reference", "text"), "x": p([], "Source response knots", "json"), "delta": p([], "Additive corrections in source units", "json")}, "https://glossary.slb.com/en/terms/e/environmental_corrections")
method("cutoff-rules", "cutoffs", "Zonal reservoir/pay rules", [("depth", "length"), ("vsh", "fraction"), ("porosity", "fraction"), ("sw", "fraction"), ("k", "permeability")], {"rules": p([], "Objects: role, operator (<, <=, >, >=), value (SI; permeability mD)", "json"), "combine": p("AND", "AND or OR", "text"), "zones": p([], "Optional {top,base,rules}; MD metres", "json"), "minimumBed": p(0, "Minimum contiguous bed metres")}, AAPG)
method("reservoir-summary", "summaries", "Coverage-aware reservoir summary", [("depth", "length"), ("porosity", "fraction"), ("sw", "fraction"), ("k", "permeability"), ("reservoir", "fraction"), ("pay", "fraction")], {"depthReference": p("", "MD, TVD or TVDSS; reported without conversion", "text"), "top": p(None, "Interval top metres"), "base": p(None, "Interval base metres"), "maxGap": p(None, "Largest supported sample interval metres")}, AAPG)
method("seismic-attributes", "seismic", "Bounded seismic section and attributes", [("traces", "array")], {"sampleInterval": p(None, "Sample interval in seconds or metres"), "domain": p("", "TWT or depth", "text"), "rmsWindow": p(11, "RMS sample window")}, BRUGES, "seismic")
method("domain-conversion", "seismic", "Explicit constant-velocity conversion", [("axis", "numeric")], {"velocity": p(None, "Documented constant interval velocity m/s"), "direction": p("twt-to-depth", "twt-to-depth or depth-to-twt", "text"), "datum": p("", "Shared time/depth reference", "text")}, BRUGES, "seismic")
method("surface-interpolation", "structure", "Reviewed horizon interpolation", [("x", "length"), ("y", "length"), ("z", "numeric")], {"nx": p(40, "Grid X cells, maximum 200"), "ny": p(40, "Grid Y cells, maximum 200"), "domain": p("", "Depth or TWT", "text"), "crs": p("", "Documented projected CRS", "text")}, SCIPY, "seismic")
method("property-kriging", "properties", "Ordinary kriging and conditional realizations", [("x", "length"), ("y", "length"), ("value", "numeric")], {"range": p(None, "Covariance length scale metres"), "variance": p(None, "Covariance variance"), "nx": p(30, "Grid X cells"), "ny": p(30, "Grid Y cells"), "realizations": p(1, "1–10 conditional realizations"), "seed": p(42, "Seed")}, GSTOOLS, "seismic")
method("log-upscale", "properties", "Thickness-weighted grid upscaling", [("depth", "length"), ("value", "numeric")], {"edges": p([], "Increasing cell boundaries metres", "json")}, RESQML)
method("elastic-properties", "rockphysics", "Isotropic elastic properties", [("vp", "velocity"), ("vs", "velocity"), ("density", "density")], reference=BRUGES, workflow="petrophysics+seismic")
method("gassmann", "rockphysics", "Gassmann fluid substitution", [("kDry", "pressure"), ("porosity", "fraction")], {"kMineral": p(None, "Mineral bulk modulus Pa"), "kFluid": p(None, "New fluid modulus Pa")}, BRUGES, "petrophysics+seismic")
method("synthetic-seismogram", "rockphysics", "Normal-incidence synthetic and Ricker wavelet", [("vp", "velocity"), ("density", "density")], {"sampleInterval": p(None, "Uniform TWT sample interval seconds"), "frequency": p(25, "Peak frequency Hz"), "axisConfirmed": p(False, "Inputs explicitly resampled in uniform TWT", "boolean")}, BRUGES, "petrophysics+seismic")
method("geomechanics-1d", "geomechanics", "Calibrated 1D stress and pore-pressure screening", [("depth", "length"), ("density", "density"), ("sonic", "slowness")], {"surfaceStress": p(None, "Stress at first station Pa"), "hydrostaticGradient": p(None, "Calibrated hydrostatic gradient Pa/m"), "normalSonic": p(None, "Normal-compaction slowness s/m"), "eatonExponent": p(None, "Calibrated Eaton exponent"), "poisson": p(None, "Calibrated Poisson ratio"), "tectonicStress": p(None, "Tectonic horizontal stress addition Pa")}, AAPG)
method("production-allocation", "production", "Calibrated spinner-response allocation", [("response", "numeric")], {"zero": p(None, "Calibration zero response"), "slope": p(None, "Calibrated flow rate per response unit"), "calibration": p("", "Sensor/calibration reference", "text"), "flowUnit": p("", "Result flow-rate unit", "text")}, SCIPY)
method("trajectory-minimum-curvature", "planning", "Minimum-curvature survey and DLS", [("md", "length"), ("inclination", "angle"), ("azimuth", "angle")], {"northReference": p("", "True or Grid; magnetic requires prior correction", "text"), "crs": p("", "Documented projected CRS", "text"), "north": p(None, "Surface northing metres"), "east": p(None, "Surface easting metres"), "tvd": p(None, "Tie-in TVD metres"), "maxDls": p(3, "Maximum degrees/30m")}, USGS)
method("trajectory-clearance", "planning", "Sampled offset-point clearance screening", [("planned", "array"), ("offset", "array")], {"threshold": p(None, "Minimum separation metres; Nx3 projected XYZ inputs")}, SCIPY)
method("simulation-compare", "simulation", "Imported case/history comparison", [("observed", "numeric"), ("forecast", "numeric")], {"case": p("", "Imported simulation case identifier", "text")}, RESQML)
method("in-place-volumes", "volumes", "STOIIP/GIIP volumetrics", [], {"area": p(None, "Area m²"), "netThickness": p(None, "Net thickness m"), "porosity": p(None, "Porosity v/v"), "sw": p(None, "Water saturation v/v"), "fvf": p(None, "Formation volume factor reservoir m³ / standard m³"), "fluid": p("oil", "oil or gas", "text")}, AAPG, "either")
method("opportunity-score", "opportunities", "Transparent evidence-weighted screening", [("quality", "fraction"), ("evidence", "fraction")], {"qualityWeight": p(0.5, "Nonnegative weight"), "evidenceWeight": p(0.5, "Nonnegative weight")}, SCIPY, "either")
method("volume-uncertainty", "uncertainty", "Seeded volumetric Monte Carlo / Latin hypercube", [], {"distributions": p({}, "area,netThickness,porosity,sw,fvf: {low,mode,high}; triangular distributions", "json"), "samples": p(1000, "100–100000"), "seed": p(42, "Seed"), "sampling": p("monte-carlo", "monte-carlo or latin-hypercube", "text")}, SCIPY, "either")

# Seismic inputs are read from full-resolution originals, never the importer's decimated sample previews.
METHODS["seismic-attributes"]["parameters"].update(
    selection=p("trace-range", "trace-range, inline or crossline", "text"),
    sectionValue=p(0, "Inline/crossline header value when selecting a section"),
    firstTrace=p(0, "First retained trace within the selected section"),
    traceCount=p(128, "1–512 full-resolution traces"),
    firstSample=p(0, "First source sample"),
    sampleCount=p(1000, "1–4096 full-resolution samples per trace"))
for key in ("surface-interpolation", "property-kriging"):
    METHODS[key]["workflows"]=["either"]
METHODS["nmr-partition"]["inputs"][0]["dimension"]="fraction-array"
for item in METHODS["trajectory-clearance"]["inputs"]:
    item["dimension"]="length-array"


def allowed(spec, workflows):
    needed = spec["workflows"]
    return needed == ["either"] or all(w in workflows for w in needed)


def capabilities(workflows):
    return dict(schemaVersion=1, version=VERSION,
                methods=[s for s in METHODS.values() if allowed(s, workflows)],
                restrictions=["Vendor corrections require an authorized documented response table; no generic substitute.",
                              "Waxman–Smits and Dual Water require validated calibration adapters and are not executable in this version.",
                              "Complex faulted-grid generation, proprietary cased-hole inversions and simulator execution are not implemented.",
                              "Modeling results are bounded surface/property models, not full reservoir simulator models."])
