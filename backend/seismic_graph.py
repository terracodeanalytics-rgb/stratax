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
        if node.operator in ("bandpass", "nmo", "fk-filter") and graph.domain != "TWT":
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
        values[node.id] = result
        consumers[node.input] -= 1
        if consumers[node.input] == 0:
            del values[node.input]
        progress(dict(step=node.id, completed=i+1, total=len(ordered)))
        checkpoint(dict(fingerprint=fingerprint, completed=i+1, values=values))
    return values[graph.output], fingerprint
