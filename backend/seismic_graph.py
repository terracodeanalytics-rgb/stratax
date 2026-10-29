"""Typed processing graphs; operation support is explicit, never inferred from a menu."""
import hashlib
import json
import math

from pydantic import BaseModel, ConfigDict, Field

VERSION = "stratax-seismic/1.0"

# These are implemented numerical operators. Hosted execution is a separate capability.
OPERATORS = {
    "detrend": {"parameters": {"mode": "linear"}, "required": []},
    "bandpass": {"parameters": {"low": None, "high": None, "order": 4}, "required": ["low", "high"]},
    "resample": {"parameters": {"up": 1, "down": 1}, "required": []},
    "static-shift": {"parameters": {"shifts": None}, "required": ["shifts"]},
    "nmo": {"parameters": {"offsets": None, "velocity": None, "maxStretch": .3}, "required": ["offsets", "velocity"]},
    "stack": {"parameters": {"weights": None}, "required": []},
    "fk-filter": {"parameters": {"spacing": None, "minimumVelocity": None}, "required": ["spacing", "minimumVelocity"]},
    "mute": {"parameters": {"top": None, "bottom": None, "taper": 0}, "required": []},
    "amplitude-balance": {"parameters": {"window": None}, "required": []},
    "spike-decon": {"parameters": {"operatorLength": 32, "noiseFloor": 0.001}, "required": []},
    "sweep-correlate": {"parameters": {"sweep": None}, "required": ["sweep"]},
    "residual-statics": {"parameters": {"maxLagSamples": 16}, "required": []},
    "dmo": {"parameters": {"offsets": None, "midpointSpacing": None, "velocity": None}, "required": ["offsets", "midpointSpacing", "velocity"]},
    "phase-shift-migration": {"parameters": {"velocity": None, "traceSpacing": None}, "required": ["velocity", "traceSpacing"]},
    "designature": {"parameters": {"signature": None, "noiseFloor": 0.01}, "required": ["signature"]},
    "deghost": {"parameters": {"ghostDelaySeconds": None, "reflectionCoeff": -1.0}, "required": ["ghostDelaySeconds"]},
    "swell-noise": {"parameters": {"timeHighpassHz": None, "spaceHighpass": None}, "required": ["timeHighpassHz", "spaceHighpass"]},
    "parabolic-radon": {
        "parameters": {"offsets": None, "pMin": None, "pMax": None, "pCount": 64, "multiplePCut": None, "mutePrimary": True},
        "required": ["offsets", "pMin", "pMax", "multiplePCut"],
    },
    "kirchhoff-pstm": {"parameters": {"offsets": None, "midpointSpacing": None, "velocity": None}, "required": ["offsets", "midpointSpacing", "velocity"]},
    "kirchhoff-psdm": {"parameters": {"offsets": None, "midpointSpacing": None, "velocity": None}, "required": ["offsets", "midpointSpacing", "velocity"]},
}


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)


class Node(Strict):
    id: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    operator: str
    input: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    parameters: dict = Field(default_factory=dict)


class Graph(Strict):
    revision: int = Field(default=0, ge=0)
    sourceId: str = Field(pattern=r"^[A-Za-z0-9_-]{1,100}$")
    sourceVersion: str = Field(min_length=1, max_length=100)
    domain: str
    domainConfirmed: bool = False
    amplitudeUnit: str = Field(min_length=1, max_length=80)
    nodes: list[Node] = Field(min_length=1, max_length=64)
    output: str
    notes: str = Field(default="", max_length=4000)


def validate_parameters(node):
    p = OPERATORS[node.operator]["parameters"] | node.parameters

    def number(value, name, low=None):
        if type(value) not in (int, float) or not math.isfinite(value) or (low is not None and value < low):
            raise ValueError(f"Provide a finite {name} in its supported range.")

    def vector(value, name, low=None, scalar=False):
        if scalar and type(value) in (int, float):
            number(value, name, low)
            return
        if not isinstance(value, list) or not 1 <= len(value) <= 4096:
            raise ValueError(f"Provide a bounded {name} vector; reference large arrays through indexed resources.")
        for item in value:
            number(item, name, low)

    if node.operator == "detrend" and p["mode"] not in ("linear", "constant"):
        raise ValueError("Choose linear or constant detrending.")
    if node.operator == "bandpass":
        number(p["low"], "low frequency", 1e-12)
        number(p["high"], "high frequency", 1e-12)
        if p["high"] <= p["low"] or type(p["order"]) is not int or not 1 <= p["order"] <= 12:
            raise ValueError("Choose increasing bandpass frequencies and a filter order of 1–12.")
    if node.operator == "resample" and any(type(p[k]) is not int or not 1 <= p[k] <= 100 for k in ("up", "down")):
        raise ValueError("Use integer resampling factors from 1 to 100.")
    if node.operator == "static-shift":
        vector(p["shifts"], "static shifts")
    if node.operator == "nmo":
        vector(p["offsets"], "offsets")
        vector(p["velocity"], "positive RMS/stacking velocity", 1e-12, scalar=True)
        number(p["maxStretch"], "maximum stretch", 0)
        if p["maxStretch"] > 10:
            raise ValueError("Maximum stretch must be within 0–10.")
    if node.operator == "stack" and p["weights"] is not None:
        vector(p["weights"], "stack weights", 0)
        if not any(p["weights"]):
            raise ValueError("At least one stack weight must be positive.")
    if node.operator == "fk-filter":
        number(p["spacing"], "trace spacing", 1e-12)
        number(p["minimumVelocity"], "minimum velocity", 1e-12)
    if node.operator == "mute":
        if p.get("top") is None and p.get("bottom") is None:
            raise ValueError("Provide a top and/or bottom mute.")
        number(p.get("taper", 0), "mute taper", 0)
    if node.operator == "amplitude-balance" and p.get("window") is not None:
        window = p["window"]
        if not (isinstance(window, list) and len(window) == 2 and all(type(v) is int for v in window)):
            raise ValueError("Amplitude-balance window must be [start, stop) sample indices.")
    if node.operator == "spike-decon":
        if type(p["operatorLength"]) is not int or not 3 <= p["operatorLength"] <= 256:
            raise ValueError("Spike-decon operator length must be 3–256.")
        number(p["noiseFloor"], "noise floor", 1e-12)
    if node.operator == "sweep-correlate":
        vector(p["sweep"], "supplied sweep")
    if node.operator == "residual-statics":
        if type(p["maxLagSamples"]) is not int or not 0 <= p["maxLagSamples"] <= 64:
            raise ValueError("Residual-statics lag search must be 0–64 samples.")
    if node.operator == "dmo":
        vector(p["offsets"], "DMO offsets")
        number(p["midpointSpacing"], "midpoint spacing", 1e-12)
        number(p["velocity"], "DMO velocity", 1e-12)
    if node.operator == "phase-shift-migration":
        number(p["velocity"], "migration velocity", 1e-12)
        number(p["traceSpacing"], "trace spacing", 1e-12)
    if node.operator == "designature":
        vector(p["signature"], "source signature")
        number(p["noiseFloor"], "designature noise floor", 1e-12)
    if node.operator == "deghost":
        number(p["ghostDelaySeconds"], "ghost delay", 1e-12)
        number(p["reflectionCoeff"], "reflection coefficient", -1.0)
        if p["reflectionCoeff"] > 1.0:
            raise ValueError("Reflection coefficient must be within -1 to 1.")
    if node.operator == "swell-noise":
        number(p["timeHighpassHz"], "time high-pass", 1e-12)
        number(p["spaceHighpass"], "space high-pass", 0)
    if node.operator == "parabolic-radon":
        vector(p["offsets"], "Radon offsets")
        number(p["pMin"], "minimum curvature")
        number(p["pMax"], "maximum curvature")
        if p["pMax"] < p["pMin"]:
            raise ValueError("Radon curvature range must be non-decreasing.")
        if type(p["pCount"]) is not int or not 4 <= p["pCount"] <= 256:
            raise ValueError("Radon curvature sample count must be 4–256.")
        number(p["multiplePCut"], "multiple curvature cut")
        if type(p["mutePrimary"]) is not bool:
            raise ValueError("mutePrimary must be boolean.")
    if node.operator in ("kirchhoff-pstm", "kirchhoff-psdm"):
        vector(p["offsets"], "migration offsets")
        number(p["midpointSpacing"], "midpoint spacing", 1e-12)
        number(p["velocity"], "migration velocity", 1e-12)


def validate_graph(graph):
    """Only a source-rooted acyclic trace-block graph is executable in this version."""
    if isinstance(graph, dict):
        graph = Graph(**graph)
    if graph.domain not in ("TWT", "depth") or not graph.domainConfirmed:
        raise ValueError("Confirm the source domain before validating a processing graph.")
    if graph.amplitudeUnit.strip().lower() in ("", "unknown", "unconfirmed"):
        raise ValueError("Confirm the source amplitude meaning and unit.")
    by_id = {n.id: n for n in graph.nodes}
    if len(by_id) != len(graph.nodes) or "source" in by_id:
        raise ValueError("Use unique step identifiers; source is reserved.")
    if graph.output not in by_id:
        raise ValueError("Select an existing output step.")
    ordered, visiting, done = [], set(), set()

    def visit(key):
        if key == "source" or key in done:
            return
        if key not in by_id:
            raise ValueError("A processing input references a missing step.")
        if key in visiting:
            raise ValueError("Processing graphs cannot contain cycles.")
        visiting.add(key)
        node = by_id[key]
        if node.operator not in OPERATORS:
            raise ValueError(f"The {node.operator} operator is not executable in this graph version.")
        spec = OPERATORS[node.operator]
        if set(node.parameters) - set(spec["parameters"]):
            raise ValueError(f"Remove parameters not defined for {node.operator}.")
        if any(node.parameters.get(k) is None for k in spec["required"]):
            raise ValueError(f"Provide required parameters for {node.operator}.")
        validate_parameters(node)
        twt_only = (
            "bandpass", "nmo", "fk-filter", "dmo", "phase-shift-migration",
            "swell-noise", "parabolic-radon", "kirchhoff-pstm", "kirchhoff-psdm", "deghost",
        )
        if node.operator in twt_only and graph.domain != "TWT":
            raise ValueError(f"{node.operator} requires TWT seconds.")
        visit(node.input)
        visiting.remove(key)
        done.add(key)
        ordered.append(node)

    visit(graph.output)
    if len(done) != len(by_id):
        raise ValueError("Remove disconnected steps or connect them to the output.")
    # Reject non-finite JSON and bind the hash to exact parameters and source revision.
    encoded = json.dumps(graph.model_dump(exclude={"revision"}), sort_keys=True, separators=(",", ":"), allow_nan=False)
    if len(encoded.encode()) > 128*1024:
        raise ValueError("The graph exceeds its metadata budget. Store large models/arrays as referenced resources.")
    return ordered, hashlib.sha256(encoded.encode()).hexdigest()


def execute_graph(graph, source, cancelled=lambda: False, progress=lambda value: None,
                  checkpoint=lambda value: None, resumed=None):
    from seismic_land import (
        amplitude_balance,
        apply_residual_statics,
        dmo_approximate,
        mute,
        poststack_phase_shift_migration,
        residual_statics_shifts,
        spiking_deconvolution,
        supplied_sweep_correlation,
    )
    from seismic_marine import (
        kirchhoff_psdm_constant_velocity,
        kirchhoff_pstm_constant_velocity,
        parabolic_radon_demultiple,
        simple_deghost,
        source_signature_designature,
        swell_noise_attenuation,
    )
    from seismic_processing import bandpass, detrend, fk_filter, nmo, resample, stack, static_shift
    if isinstance(graph, dict):
        graph = Graph(**graph)
    ordered, fingerprint = validate_graph(graph)
    if source.domain != graph.domain:
        raise ValueError("Graph domain does not match its analytical source.")
    completed = resumed.get('completed', 0) if resumed else 0
    if type(completed) is not int or not 0 <= completed <= len(ordered) or resumed and resumed.get('fingerprint') != fingerprint:
        raise ValueError("The checkpoint does not identify this exact processing graph.")
    processed = {n.id for n in ordered[:completed]}
    needed = {n.input for n in ordered[completed:] if n.input == 'source' or n.input in processed}
    if completed == len(ordered):
        needed = {graph.output}
    values = dict(resumed['values']) if resumed else {"source": source}
    if resumed and set(values) != needed:
        raise ValueError("The checkpoint does not contain the graph's required live inputs.")
    consumers = {"source": 0} | {n.id: 0 for n in ordered}
    for n in ordered[completed:]:
        consumers[n.input] += 1
    for i, node in enumerate(ordered[completed:], start=completed):
        if cancelled():
            raise ValueError("Processing cancelled at a completed step boundary.")
        b, p = values[node.input], OPERATORS[node.operator]["parameters"] | node.parameters
        operation = node.operator
        if operation == "detrend":
            result = detrend(b, p["mode"])
        elif operation == "bandpass":
            result = bandpass(b, p["low"], p["high"], p["order"])
        elif operation == "resample":
            result = resample(b, p["up"], p["down"])
        elif operation == "static-shift":
            result = static_shift(b, p["shifts"])
        elif operation == "nmo":
            result = nmo(b, p["offsets"], p["velocity"], p["maxStretch"])
        elif operation == "stack":
            result, _ = stack(b, p["weights"])
        elif operation == "fk-filter":
            result = fk_filter(b, p["spacing"], p["minimumVelocity"])
        elif operation == "mute":
            result = mute(b, p.get("top"), p.get("bottom"), p.get("taper", 0))
        elif operation == "amplitude-balance":
            window = p.get("window")
            result = amplitude_balance(b, tuple(window) if window is not None else None)
        elif operation == "spike-decon":
            result = spiking_deconvolution(b, p["operatorLength"], p["noiseFloor"])
        elif operation == "sweep-correlate":
            result = supplied_sweep_correlation(b, p["sweep"])
        elif operation == "residual-statics":
            shifts, _ = residual_statics_shifts(b, p["maxLagSamples"])
            result = apply_residual_statics(b, shifts)
        elif operation == "dmo":
            result = dmo_approximate(b, p["offsets"], p["midpointSpacing"], p["velocity"])
        elif operation == "phase-shift-migration":
            result = poststack_phase_shift_migration(b, p["velocity"], p["traceSpacing"])
        elif operation == "designature":
            result = source_signature_designature(b, p["signature"], p["noiseFloor"])
        elif operation == "deghost":
            result = simple_deghost(b, p["ghostDelaySeconds"], p["reflectionCoeff"])
        elif operation == "swell-noise":
            result = swell_noise_attenuation(b, p["timeHighpassHz"], p["spaceHighpass"])
        elif operation == "parabolic-radon":
            result = parabolic_radon_demultiple(
                b, p["offsets"], p["pMin"], p["pMax"], p["pCount"], p["multiplePCut"], p["mutePrimary"],
            )
        elif operation == "kirchhoff-pstm":
            result = kirchhoff_pstm_constant_velocity(b, p["offsets"], p["midpointSpacing"], p["velocity"])
        elif operation == "kirchhoff-psdm":
            result = kirchhoff_psdm_constant_velocity(b, p["offsets"], p["midpointSpacing"], p["velocity"])
        else:
            raise ValueError(f"The {operation} operator is not executable in this graph version.")
        values[node.id] = result
        consumers[node.input] -= 1
        if consumers[node.input] == 0:
            del values[node.input]
        progress(dict(step=node.id, completed=i+1, total=len(ordered)))
        checkpoint(dict(fingerprint=fingerprint, completed=i+1, values=values))
    return values[graph.output], fingerprint
