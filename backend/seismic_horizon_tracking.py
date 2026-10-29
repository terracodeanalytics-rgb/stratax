"""Seeded 3D event tracking as an editable proposal, preserving reviewed picks."""
from collections import deque
import numpy as np
from seismic_processing import require


def track_volume(volume, seeds, *, event, search_samples, correlation_window,
                 minimum_correlation, barriers=None, maximum_picks=100000):
    data = np.asarray(volume, float)
    require(data.ndim == 3 and data.size <= 2_000_000 and min(data.shape) >= 3,
            "Provide a bounded genuine 3D cube in inline/crossline/sample order.")
    require(event in ("peak", "trough", "zero-up", "zero-down"), "Choose a peak, trough or directed zero crossing.")
    require(type(search_samples) is int and 1 <= search_samples <= 64
            and type(correlation_window) is int and 3 <= correlation_window <= 101 and correlation_window % 2 == 1,
            "Review bounded search and odd correlation windows.")
    require(np.isfinite(minimum_correlation) and 0 <= minimum_correlation <= 1,
            "Review a correlation threshold from zero to one.")
    require(type(maximum_picks) is int and 1 <= maximum_picks <= 100000,
            "Bound the proposal to 100000 picks.")
    blocked = np.zeros(data.shape[:2], bool) if barriers is None else np.asarray(barriers, bool)
    require(blocked.shape == data.shape[:2], "Barrier map must match the survey bins.")
    require(isinstance(seeds, list) and seeds, "Provide reviewed seeds/manual picks first.")
    picks = {}; queue = deque(); scores = {}; half = correlation_window//2
    for seed in seeds:
        require(all(type(seed.get(k)) is int for k in ("inline", "crossline", "sample")),
                "Seed picks require exact integer analytical coordinates.")
        i,j,k = (seed[key] for key in ("inline", "crossline", "sample"))
        require(0 <= i < data.shape[0] and 0 <= j < data.shape[1] and half <= k < data.shape[2]-half
                and np.all(np.isfinite(data[i,j,k-half:k+half+1])), "Seed leaves readable analytical support.")
        require((i,j) not in picks or picks[(i,j)]["sample"] == k, "Resolve conflicting reviewed seeds in the same bin.")
        picks[(i,j)] = dict(seed); queue.append((i,j)); scores[(i,j)] = 1.
    stopped = {}; attempted = set()
    while queue and len(picks) < maximum_picks:
        i,j = queue.popleft(); k = picks[(i,j)]["sample"]
        reference = data[i,j,k-half:k+half+1]; reference = reference-reference.mean()
        for a,b in ((i-1,j),(i+1,j),(i,j-1),(i,j+1)):
            if not (0 <= a < data.shape[0] and 0 <= b < data.shape[1]) or (a,b) in picks: continue
            edge = (i,j,a,b)
            if edge in attempted: continue
            attempted.add(edge)
            if blocked[a,b]: stopped[(a,b)] = "barrier"; continue
            candidates = []
            for sample in range(max(half,k-search_samples), min(data.shape[2]-half,k+search_samples+1)):
                trace = data[a,b]; value = trace[sample]
                accepted = ((event == "peak" and value >= trace[sample-1] and value > trace[sample+1])
                    or (event == "trough" and value <= trace[sample-1] and value < trace[sample+1])
                    or (event == "zero-up" and trace[sample-1] < 0 <= value)
                    or (event == "zero-down" and trace[sample-1] > 0 >= value))
                if not accepted: continue
                window = trace[sample-half:sample+half+1]
                if not np.all(np.isfinite(window)): continue
                window = window-window.mean(); norm = np.linalg.norm(reference)*np.linalg.norm(window)
                if norm <= 0: continue
                score = float(np.dot(reference,window)/norm)
                candidates.append((score,-abs(sample-k),sample))
            if not candidates or max(candidates)[0] < minimum_correlation:
                stopped[(a,b)] = "insufficient-event-correlation"; continue
            score,_,sample = max(candidates)
            picks[(a,b)] = dict(inline=a,crossline=b,sample=sample,manual=False,locked=False,
                               proposal=True,parent=[i,j],correlation=score)
            scores[(a,b)] = score; stopped.pop((a,b),None); queue.append((a,b))
            if len(picks) >= maximum_picks: break
    return dict(picks=list(picks.values()), stops=[dict(inline=i,crossline=j,reason=reason)
        for (i,j),reason in stopped.items() if (i,j) not in picks], truncated=bool(queue),
        reviewRequired=True, scoreMeaning="waveform correlation; not geological probability")
