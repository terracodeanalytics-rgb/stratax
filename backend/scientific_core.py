"""Bounded scientific operators. No source mutation, inferred units or silent model fallbacks."""
import math
import warnings

import numpy as np
from scipy import integrate, ndimage, optimize, signal, spatial, stats

from scientific_catalog import METHODS, VERSION, MAX_ROWS, MAX_CELLS


class ScienceProblem(ValueError):
    def __init__(self, code, message):
        self.code = code
        super().__init__(message)


def require(condition, message, code="invalid_inputs"):
    if not condition:
        raise ScienceProblem(code, message)


UNITS = {
    "length": {"m": 1, "metres": 1, "meters": 1, "ft": .3048, "feet": .3048, "km": 1000, "in": .0254, "inches": .0254},
    "fraction": {"v/v": 1, "fraction": 1, "1": 1, "%": .01, "pu": .01},
    "density": {"kg/m3": 1, "kg/m³": 1, "g/cm3": 1000, "g/cm³": 1000, "g/cc": 1000},
    "slowness": {"s/m": 1, "us/m": 1e-6, "µs/m": 1e-6, "us/ft": 1e-6/.3048, "µs/ft": 1e-6/.3048},
    "velocity": {"m/s": 1, "ft/s": .3048},
    "resistivity": {"ohm.m": 1, "ohm-m": 1, "ohm·m": 1, "ω.m": 1, "ω·m": 1, "ohmm": 1},
    "pressure": {"pa": 1, "kpa": 1000, "mpa": 1e6, "gpa": 1e9, "bar": 1e5, "psi": 6894.757293168},
    "permeability": {"md": 1, "d": 1000, "m2": 1/9.869233e-16},
    "angle": {"deg": np.pi/180, "degrees": np.pi/180, "rad": 1},
    "api": {"gapi": 1, "api": 1},
    "time": {"s":1,"sec":1,"ms":.001,"us":.000001},
}


def unit_factor(dimension, unit):
    if dimension.endswith("-array"):dimension=dimension[:-6]
    value = str(unit or "").strip().lower()
    require(value and value not in ("unknown", "unconfirmed", "none"), "Confirm each input unit before calculation.", "units_required")
    if dimension in ("numeric", "array", "category"):
        return 1
    require(value in UNITS[dimension], f"Choose a supported {dimension} unit; {unit!r} is not confirmed.", "units_required")
    return UNITS[dimension][value]


def clean(value):
    if isinstance(value, np.ndarray): return clean(value.tolist())
    if isinstance(value, np.generic): return clean(value.item())
    if isinstance(value, dict): return {str(k): clean(v) for k, v in value.items()}
    if isinstance(value, (tuple, list)): return [clean(v) for v in value]
    if isinstance(value, float) and not math.isfinite(value): return None
    return value


def number(params, key, low=None, high=None, positive=False):
    value = params.get(key)
    require(type(value) in (int, float) and math.isfinite(value), f"Enter a finite {key} value.", "parameters_required")
    require((low is None or value >= low) and (high is None or value <= high) and (not positive or value > 0), f"Check the permitted range for {key}.")
    return float(value)


def integer(params, key, low, high):
    value = number(params, key, low, high)
    require(value == int(value), f"{key} must be an integer.")
    return int(value)


def text(params, key):
    value = params.get(key)
    require(isinstance(value, str) and value.strip(), f"Provide {key} before calculating.", "parameters_required")
    return value.strip()


def increasing(depth):
    require(len(depth) >= 2 and np.all(np.isfinite(depth)) and np.all(np.diff(depth) > 0), "Depth must be finite and strictly increasing; review gaps, duplicate indices and direction first.")


def window(params, n):
    size = integer(params, "window", 3, 501)
    require(size % 2 == 1 and size <= n, "Choose an odd window no longer than the input.")
    return size


def fractional(a, label):
    require(np.all((a[np.isfinite(a)] >= 0) & (a[np.isfinite(a)] <= 1)), f"{label} must be a fraction between zero and one; review the input units.")


def fit_summary(x, y):
    mask = np.isfinite(x) & np.isfinite(y)
    require(mask.sum() >= 3 and np.ptp(x[mask]) > 0, "At least three valid pairs with varying predictor values are required.")
    fit = stats.linregress(x[mask], y[mask])
    return dict(slope=fit.slope, intercept=fit.intercept, rSquared=fit.rvalue**2,
                slopeStandardError=fit.stderr, pairs=int(mask.sum()))


def thickness(depth, top, base, max_gap):
    increasing(depth)
    require(base > top and max_gap > 0, "Confirm interval boundaries and maximum supported gap.")
    # Half-open intervals use the left station value; the last station has no assumed support.
    widths = np.maximum(0, np.minimum(depth[1:], base)-np.maximum(depth[:-1], top))
    widths[np.diff(depth) > max_gap] = 0
    return np.r_[widths, 0]


def evaluate(method_id, raw_inputs, parameters=None, units=None):
    require(method_id in METHODS, "This method is not available.", "method_unavailable")
    spec = METHODS[method_id]
    parameters = parameters or {}
    require(not set(parameters)-set(spec["parameters"]), "Remove parameters not defined by this method.")
    p = {k: item["default"] for k, item in spec["parameters"].items()} | parameters
    arrays = {}
    for item in spec["inputs"]:
        role, dimension = item["role"], item["dimension"]
        require(role in raw_inputs, f"Select the {role} input.")
        factor = unit_factor(dimension, (units or {}).get(role))
        try:
            a = np.asarray(raw_inputs[role], dtype=str if dimension == "category" else float)
        except (TypeError, ValueError):
            raise ScienceProblem("numeric_input", f"{role} contains unsupported text or inconsistent arrays.") from None
        require(a.ndim in (1, 2) and 0 < len(a) <= MAX_ROWS and a.size <= MAX_CELLS, "This input exceeds the bounded calculation limits.")
        if dimension == "array" or dimension.endswith("-array"): require(a.ndim == 2, f"{role} requires a rectangular array channel.")
        else: require(a.ndim == 1, f"{role} requires a scalar column.")
        arrays[role] = a if dimension == "category" else a*factor
    lengths = {len(a) for a in arrays.values()}
    require(len(lengths) <= 1 or method_id == "trajectory-clearance", "Inputs must have identical reviewed row alignment; join or resample explicitly first.")
    require(sum(a.size for a in arrays.values()) <= MAX_CELLS, "Selected inputs exceed the cell budget.")
    notes, summary, out, output_units = [], {}, {}, {}
    a = arrays
    m = method_id
    with np.errstate(all="ignore"), warnings.catch_warnings():
        warnings.simplefilter("ignore", RuntimeWarning)
        if m == "log-view":
            out = dict(depth=a["depth"], curve=a["curve"])
            output_units = dict(depth="m", curve=units["curve"])
        elif m.startswith("qc-"):
            d, x = a["depth"], a["curve"]
            operation = m[3:]
            summary.update(rows=len(d), missing=int(np.isnan(x).sum()), repeatedDepths=int(np.sum(np.diff(d)==0)), decreasingDepths=int(np.sum(np.diff(d)<0)))
            y = x.copy()
            if operation not in ("integrity", "shift"): increasing(d)
            if operation == "despike":
                size = window(p, len(x)); threshold = number(p, "threshold", positive=True)
                median = ndimage.generic_filter(x, np.nanmedian, size=size, mode="nearest")
                mad = ndimage.generic_filter(np.abs(x-median), np.nanmedian, size=size, mode="nearest")
                flag = np.abs(x-median) > threshold*np.maximum(1.4826*mad, np.finfo(float).eps)
                y[flag & np.isfinite(x)] = median[flag & np.isfinite(x)]
            elif operation == "interpolate":
                max_gap = number(p, "maxGap", positive=True)
                good = np.flatnonzero(np.isfinite(x))
                require(len(good)>=2, "Interpolation requires two valid bounding samples.")
                for left, right in zip(good[:-1], good[1:]):
                    if right-left>1 and d[right]-d[left]<=max_gap:
                        y[left+1:right] = np.interp(d[left+1:right], d[[left,right]], x[[left,right]])
            elif operation == "smooth":
                size = window(p, len(x)); y = ndimage.generic_filter(x, np.nanmean, size=size, mode="nearest"); y[~np.isfinite(x)] = np.nan
            elif operation == "normalize":
                lo, hi, tl, th = [number(p, k) for k in ("sourceLow","sourceHigh","targetLow","targetHigh")]
                require(hi>lo and th>tl, "Normalization endpoints must increase."); y = tl+(x-lo)/(hi-lo)*(th-tl)
            elif operation == "shift": d = d+number(p,"shift")
            elif operation == "splice":
                boundary=number(p,"boundary"); y=np.where(d>=boundary,a["alternate"],x)
                require(units["curve"]==units["alternate"], "Spliced curves must use identical confirmed units.")
            elif operation == "borehole":
                bit=number(p,"bitSize",positive=True); tol=number(p,"tolerance",low=0)
                out["washoutFlag"]=np.where(np.isfinite(x),(x-bit)>tol,np.nan).astype(float)
            summary["changedSamples"] = int(np.sum(~np.isclose(x,y,equal_nan=True)))
            out.update(depth=d, original=x, proposed=y, difference=y-x)
            output_units.update(depth="m", original="m" if operation=="borehole" else units["curve"], proposed="m" if operation=="borehole" else units["curve"], difference="m" if operation=="borehole" else units["curve"])
        elif m == "crossplot":
            out=dict(x=a["x"],y=a["y"]); summary=fit_summary(a["x"],a["y"])
        elif m == "facies-rules":
            thresholds=np.asarray(p["thresholds"],float); labels=p["labels"]
            require(thresholds.ndim==1 and np.all(np.isfinite(thresholds)) and np.all(np.diff(thresholds)>0) and 0<len(thresholds)<=30 and isinstance(labels,list) and len(labels)==len(thresholds)+1, "Provide increasing thresholds and one label per class.")
            classes=np.digitize(a["curve"],thresholds).astype(float); classes[~np.isfinite(a["curve"])]=np.nan
            out=dict(classIndex=classes); summary=dict(labels=labels, interpretation="User-defined rule classification")
        elif m == "facies-cluster":
            from sklearn.cluster import KMeans
            x=np.column_stack([a["x"],a["y"]]); valid=np.all(np.isfinite(x),axis=1); k=integer(p,"clusters",2,12)
            require(valid.sum()>=k*3 and np.all(np.std(x[valid],axis=0)>0), "Clustering needs varying inputs and at least three valid observations per class.")
            mean=x[valid].mean(axis=0); scale=x[valid].std(axis=0)
            model=KMeans(n_clusters=k,random_state=integer(p,"seed",0,2**31-1),n_init=10).fit((x[valid]-mean)/scale)
            classes=np.full(len(x),np.nan); classes[valid]=model.labels_;out=dict(classIndex=classes);summary=dict(centers=model.cluster_centers_*scale+mean,interpretation="Unlabelled statistical clusters; geological review required")
        elif m == "fluid-indicators":
            require(np.all(a["deep"][np.isfinite(a["deep"])]>0) and np.all(a["shallow"][np.isfinite(a["shallow"])]>0), "Resistivity must be positive.")
            out=dict(resistivityRatio=a["deep"]/a["shallow"],porositySeparation=a["densityPorosity"]-a["neutronPorosity"])
            notes.append("Separation is an indicator with alternative explanations, not a fluid determination.")
        elif m.startswith("shale-"):
            lo, hi=number(p,"clean"),number(p,"shale"); require(hi>lo,"Shale endpoint must exceed the clean endpoint.")
            igr=(a["gr"]-lo)/(hi-lo); x=np.clip(igr,0,1)
            model=m[6:]; raw=igr if model=="linear" else .083*(2**(3.7*x)-1) if model=="larionov-tertiary" else .33*(2**(2*x)-1) if model=="larionov-older" else x/(3-2*x) if model=="stieber" else 1.7-np.sqrt(3.38-(x+.7)**2)
            out=dict(igrUnclipped=igr,vsh=np.clip(raw,0,1)); summary["outsideEndpointRange"]=int(np.sum((igr<0)|(igr>1)))
            notes.append("Nonlinear transforms use bounded IGR; original unbounded IGR is retained.")
        elif m in ("porosity-density","porosity-sonic"):
            matrix, fluid=number(p,"matrix",positive=True),number(p,"fluid",positive=True);require(matrix!=fluid,"Matrix and fluid responses must differ.")
            value=(matrix-a["density"])/(matrix-fluid) if m.endswith("density") else (a["slowness"]-matrix)/(fluid-matrix)
            out=dict(porosity=value);output_units["porosity"]="v/v"
        elif m == "porosity-neutron":
            text(p,"calibration");out=dict(porosity=a["neutron"]*number(p,"scale")+number(p,"offset"));output_units["porosity"]="v/v"
        elif m == "porosity-effective":
            fractional(a["vsh"],"Shale volume");fractional(a["total"],"Total porosity")
            out=dict(effectivePorosity=a["total"]-a["vsh"]*number(p,"shalePorosity",0,1));output_units["effectivePorosity"]="v/v"
        elif m.startswith("saturation-"):
            phi,rt=a["porosity"],a["rt"];fractional(phi,"Porosity")
            rw,aa,mm,nn=[number(p,k,positive=True) for k in ("rw","a","m","n")]
            valid=(phi>0)&(rt>0); sw=np.full(len(phi),np.nan);f=aa/phi**mm
            if m.endswith("archie"): sw[valid]=(f[valid]*rw/rt[valid])**(1/nn)
            else:
                v=a["vsh"];fractional(v,"Shale volume");rsh=number(p,"rsh",positive=True)
                if m.endswith("indonesian"):
                    denominator=v**(1-v/2)/np.sqrt(rsh)+np.sqrt(phi**mm/(aa*rw));sw[valid]=(1/(np.sqrt(rt[valid])*denominator[valid]))**(2/nn)
                else:
                    require(nn==2,"This documented Simandoux quadratic uses n=2; choose Archie for other calibrated exponents.")
                    c=aa*rw/phi**mm;b=v*c/rsh;sw[valid]=(-b[valid]+np.sqrt(b[valid]**2+4*c[valid]/rt[valid]))/2
            out=dict(swUnclipped=sw,sw=np.clip(sw,0,1));output_units=dict(sw="v/v",swUnclipped="v/v")
            summary["invalidDomainRows"]=int(np.sum(~valid)); notes.append("Unclipped saturation is retained; clipped values are not scientific approval.")
        elif m == "permeability-regression":
            x,y=a["porosity"],a["coreK"];valid=np.flatnonzero(np.isfinite(x)&np.isfinite(y)&(x>0)&(y>0)); f=number(p,"validationFraction",.1,.5)
            require(len(valid)>=10,"Provide at least ten depth-matched core/log pairs.")
            split=int(len(valid)*(1-f));train,test=valid[:split],valid[split:];fit=fit_summary(np.log(x[train]),np.log(y[train]));pred=np.exp(fit["intercept"]+fit["slope"]*np.log(x));pred[x<=0]=np.nan
            out=dict(predictedK=pred);output_units["predictedK"]="mD";summary=fit|dict(heldOutPairs=len(test),holdoutLogRmse=float(np.sqrt(np.mean((np.log(pred[test])-np.log(y[test]))**2))))
        elif m in ("permeability-timur","permeability-coates"):
            text(p,"calibration");phi,sw=a["porosity"],a["swi"];fractional(phi,"Porosity");fractional(sw,"Swi")
            value=number(p,"coefficient",positive=True)*phi**number(p,"phiExponent",positive=True)/(sw**number(p,"swiExponent",positive=True))
            if m.endswith("coates"):value*= (1-sw)**number(p,"swiExponent",positive=True)
            value[sw<=0]=np.nan;out=dict(permeability=value);output_units["permeability"]="mD"
        elif m == "hydraulic-units":
            phi,k=a["porosity"],a["k"];fractional(phi,"Porosity");rqi=.0314*np.sqrt(k/phi);fzi=rqi/(phi/(1-phi));rqi[(phi<=0)|(k<0)]=np.nan;fzi[(phi<=0)|(phi>=1)|(k<0)]=np.nan
            out=dict(rqi=rqi,fzi=fzi);output_units=dict(rqi="µm",fzi="µm")
        elif m == "mineral-inversion":
            matrix=np.asarray(p["matrix"],float); response=a["responses"];labels=p["minerals"];weight=number(p,"closureWeight",positive=True)
            require(matrix.ndim==2 and matrix.shape[0]==response.shape[1] and matrix.shape[1]==len(labels) and 1<=len(labels)<=12 and np.all(np.isfinite(matrix)),"Response matrix dimensions must match channels and mineral labels.")
            require(len(response)<=20000,"Limit mineral inversions to 20,000 rows per run.")
            augmented=np.vstack([matrix,np.ones((1,len(labels)))*weight]);volumes=np.full((len(response),len(labels)),np.nan);residual=np.full(len(response),np.nan)
            for i,row in enumerate(response):
                if np.all(np.isfinite(row)):
                    volumes[i],_=optimize.nnls(augmented,np.r_[row,weight]);residual[i]=np.linalg.norm(matrix@volumes[i]-row)
            out=dict(volumes=volumes,residual=residual,closureError=volumes.sum(axis=1)-1);summary=dict(minerals=labels,matrixRank=int(np.linalg.matrix_rank(matrix)),conditionNumber=float(np.linalg.cond(augmented)))
            notes.append("Response units must match each matrix row. Volume closure is a weighted constraint, not proof of a unique mineral model.")
        elif m == "nmr-partition":
            spectrum=a["spectrum"];t2=np.asarray(p["t2"],float);cut=number(p,"cutoff",positive=True)
            require(t2.ndim==1 and len(t2)==spectrum.shape[1] and np.all(t2>0) and np.all(np.diff(t2)>0) and np.all(spectrum[np.isfinite(spectrum)]>=0),"Provide increasing positive T2 bins and nonnegative porosity-bin amplitudes.")
            total=np.sum(spectrum,axis=1);bound=np.sum(spectrum[:,t2<=cut],axis=1);free=total-bound;lm=np.exp(np.sum(spectrum*np.log(t2),axis=1)/total)
            out=dict(totalPorosity=total,boundPorosity=bound,freePorosity=free,t2LogMean=lm);output_units=dict(totalPorosity="v/v",boundPorosity="v/v",freePorosity="v/v",t2LogMean="ms")
            if p["coefficient"] is not None:
                out["sdrPermeability"]=number(p,"coefficient",positive=True)*total**number(p,"phiExponent",positive=True)*lm**number(p,"t2Exponent",positive=True);output_units["sdrPermeability"]="mD"
            else: notes.append("No SDR permeability calculated: core-calibrated coefficient is missing.")
        elif m in ("core-fit","simulation-compare"):
            x,y=(a["core"],a["log"]) if m=="core-fit" else (a["observed"],a["forecast"])
            if m=="simulation-compare":text(p,"case")
            summary=fit_summary(x,y);valid=np.isfinite(x)&np.isfinite(y);summary["rmse"]=float(np.sqrt(np.mean((y[valid]-x[valid])**2)));out=dict(reference=x,comparison=y,residual=y-x)
        elif m.startswith("height-"):
            pc,sw=a["pc"],a["sw"];swr=number(p,"swr",0,.99);fractional(sw,"Water saturation");valid=np.isfinite(pc)&np.isfinite(sw)&(pc>0)&(sw>swr)&(sw<1)
            require(valid.sum()>=5,"Provide at least five positive capillary-pressure and saturation pairs above Swr.")
            se=(sw[valid]-swr)/(1-swr)
            if m.endswith("brooks-corey"):
                fit=fit_summary(np.log(pc[valid]),np.log(se));lam=-fit["slope"];require(lam>0,"Brooks–Corey fit requires decreasing saturation with increasing capillary pressure.")
                entry=np.exp(fit["intercept"]/lam);pred=swr+(1-swr)*np.minimum(1,(pc/entry)**(-lam));summary=fit|dict(entryPressurePa=entry,lambdaExponent=lam)
            else:
                def thomeer(pressure,entry,g):return np.exp(-g/np.maximum(np.log(pressure/entry),1e-12))
                # Fit nonwetting saturation fraction, with entry pressure below the observed pressures.
                fitted,_=optimize.curve_fit(thomeer,pc[valid],1-se,bounds=([1e-6,1e-6],[float(pc[valid].min())*.999,100]),p0=[float(pc[valid].min())*.5,1],maxfev=10000)
                pred=1-(1-swr)*thomeer(pc,*fitted);summary=dict(entryPressurePa=fitted[0],geometricFactor=fitted[1])
            out=dict(pc=pc,observedSw=sw,fittedSw=pred);output_units=dict(pc="Pa",observedSw="v/v",fittedSw="v/v")
        elif m == "leverett-j":
            phi=a["porosity"];fractional(phi,"Porosity");sigma=number(p,"ift",positive=True);cos=np.cos(np.deg2rad(number(p,"contactAngle",0,89.9)))
            value=a["pc"]*np.sqrt(a["k"]*9.869233e-16/phi)/(sigma*cos);value[(phi<=0)|(a["k"]<=0)]=np.nan;out=dict(j=value)
        elif m == "image-normalize":
            x=a["image"];low,high=number(p,"low",0,100),number(p,"high",0,100);require(high>low,"High percentile must exceed low percentile.");require(p["mode"] in ("static","dynamic"),"Choose static or dynamic normalization.")
            axis=None if p["mode"]=="static" else 1;lo=np.nanpercentile(x,low,axis=axis,keepdims=True);hi=np.nanpercentile(x,high,axis=axis,keepdims=True);out=dict(normalized=np.clip((x-lo)/(hi-lo),0,1));notes.append("Orientation and structural picks remain explicit user interpretations.")
        elif m == "pressure-gradient":
            require(text(p,"depthReference") in ("TVD","TVDSS"),"Pressure gradient requires TVD or TVDSS, not MD.");text(p,"datum");summary=fit_summary(a["depth"],a["pressure"]);summary["gradientPaPerM"]=summary["slope"];summary["equivalentDensityKgM3"]=summary["slope"]/9.80665;out=dict(depth=a["depth"],observed=a["pressure"],fitted=summary["slope"]*a["depth"]+summary["intercept"]);output_units=dict(depth="m",observed="Pa",fitted="Pa")
        elif m.startswith("predict-"):
            from sklearn.ensemble import RandomForestRegressor
            from sklearn.linear_model import Ridge
            from sklearn.pipeline import make_pipeline
            from sklearn.preprocessing import StandardScaler
            features,target,groups=a["features"],a["target"],a["wellGroup"];hold=text(p,"heldOutWell");valid=np.all(np.isfinite(features),axis=1)&np.isfinite(target);test=valid&(groups==hold);train=valid&(groups!=hold)
            require(train.sum()>=20 and test.sum()>=5 and len(set(groups[valid]))>=2,"Prediction requires at least two well groups, 20 training and five withheld-well observations.");seed=integer(p,"seed",0,2**31-1)
            model=make_pipeline(StandardScaler(),Ridge(alpha=1)) if m.endswith("ridge") else RandomForestRegressor(n_estimators=100,max_depth=12,min_samples_leaf=3,random_state=seed,n_jobs=1)
            model.fit(features[train],target[train]);good=np.all(np.isfinite(features),axis=1);pred=np.full(len(target),np.nan);pred[good]=model.predict(features[good]);residual=target[test]-pred[test];q=float(np.quantile(np.abs(residual),.9));out=dict(reconstructed=pred,empiricalLower=pred-q,empiricalUpper=pred+q);summary=dict(heldOutWell=hold,trainingRows=int(train.sum()),validationRows=int(test.sum()),validationRmse=float(np.sqrt(np.mean(residual**2))),intervalBasis="Empirical held-out absolute-error 90th percentile; not calibrated predictive coverage")
            notes.append("Reconstructed curves require independent review before downstream use.")
        elif m == "correction-table":
            text(p,"tool");text(p,"citation");x,y=np.asarray(p["x"],float),np.asarray(p["delta"],float);require(x.ndim==y.ndim==1 and len(x)==len(y) and len(x)>=2 and np.all(np.isfinite(x)) and np.all(np.isfinite(y)) and np.all(np.diff(x)>0),"Provide a finite increasing authorized response table.")
            curve=a["curve"];delta=np.interp(curve,x,y,left=np.nan,right=np.nan);out=dict(original=curve,correction=delta,proposed=curve+delta);notes.append("No extrapolation outside the documented calibration table; acquisition applicability must be reviewed.")
        elif m == "cutoff-rules":
            d=a["depth"];increasing(d);require(p["combine"] in ("AND","OR"),"Choose AND or OR.");rules=p["rules"];require(isinstance(rules,list) and 0<len(rules)<=20,"Define at least one cutoff rule.");ops={"<":np.less,"<=":np.less_equal,">":np.greater,">=":np.greater_equal}
            def mask_for(items):
                tests=[];valid=np.ones(len(d),bool)
                for rule in items:
                    require(isinstance(rule,dict) and rule.get("role") in ("vsh","porosity","sw","k") and rule.get("operator") in ops and type(rule.get("value")) in (int,float) and math.isfinite(rule["value"]),"Check cutoff roles, operators and finite thresholds.")
                    x=a[rule["role"]];valid&=np.isfinite(x);tests.append(ops[rule["operator"]](x,rule["value"]))
                require(tests,"Each zone needs at least one rule.")
                result=(np.logical_and.reduce(tests) if p["combine"]=="AND" else np.logical_or.reduce(tests)).astype(float);result[~valid]=np.nan;return result
            mask=mask_for(rules);zones=p["zones"];require(isinstance(zones,list) and len(zones)<=100,"Check zone definitions.")
            occupied=np.zeros(len(d),bool)
            for zone in zones:
                top,base=number(zone,"top"),number(zone,"base");require(base>top,"Zone base must exceed top.");inside=(d>=top)&(d<base);require(not np.any(occupied&inside),"Zonal overrides must not overlap.");occupied|=inside;mask[inside]=mask_for(zone["rules"])[inside]
            bed=number(p,"minimumBed",low=0)
            for label in range(1,ndimage.label(mask==1)[1]+1):
                indices=np.flatnonzero(ndimage.label(mask==1)[0]==label);end=min(indices[-1]+1,len(d)-1)
                if d[end]-d[indices[0]]<bed:mask[indices]=0
            out=dict(depth=d,qualified=mask);summary=dict(unknownRows=int(np.isnan(mask).sum()),ruleType="User-defined; reservoir/pay meaning must be assigned explicitly")
        elif m == "reservoir-summary":
            text(p,"depthReference");require(p["depthReference"] in ("MD","TVD","TVDSS"),"Confirm the summary depth basis.");top,base,gap=number(p,"top"),number(p,"base"),number(p,"maxGap",positive=True);w=thickness(a["depth"],top,base,gap);gross=base-top
            reservoir=a["reservoir"];pay=a["pay"];require(np.all(np.isin(reservoir[np.isfinite(reservoir)],[0,1])) and np.all(np.isin(pay[np.isfinite(pay)],[0,1])),"Reservoir and pay inputs must be reviewed binary masks.");require(not np.any((pay==1)&(reservoir!=1)),"Pay must be a subset of reservoir.")
            net=float(np.sum(w*(reservoir==1)));pay_h=float(np.sum(w*(pay==1)));summary=dict(grossM=gross,netM=net,payM=pay_h,ntg=net/gross,depthCoverage=float(w.sum()/gross),depthReference=p["depthReference"],support="Left-station values on bounded half-open sample intervals")
            valid=np.isfinite(a["porosity"])&np.isfinite(a["sw"]);summary["phiH"]=float(np.sum(w[valid]*(pay[valid]==1)*a["porosity"][valid]));summary["hcph"]=float(np.sum(w[valid]*(pay[valid]==1)*a["porosity"][valid]*(1-a["sw"][valid])))
            for role in ("porosity","sw","k"):
                ok=np.isfinite(a[role])&(pay==1);covered=float(w[ok].sum());summary[role+"CoverageM"]=covered;summary[role+"Weighted"]=float(np.sum(w[ok]*a[role][ok])/covered) if covered else None
            ok=np.isfinite(a["k"])&(pay==1);summary["khMdM"]=float(np.sum(w[ok]*a["k"][ok]));out=dict(depth=a["depth"],supportM=w)
        elif m == "seismic-attributes":
            x=a["traces"];dt=number(p,"sampleInterval",positive=True);require(p["domain"] in ("TWT","depth"),"Confirm TWT or depth domain.");require(np.all(np.isfinite(x)),"Resolve missing seismic samples before attribute processing.");size=integer(p,"rmsWindow",1,501);require(size<=x.shape[1],"RMS window exceeds trace length.")
            envelope=np.abs(signal.hilbert(x,axis=1));rms=np.sqrt(ndimage.uniform_filter1d(x*x,size=size,axis=1,mode="nearest"));out=dict(amplitude=x,envelope=envelope,rms=rms);summary=dict(traceCount=len(x),samplesPerTrace=x.shape[1],sampleInterval=dt,domain=p["domain"],geometry="Source trace order preserved; no regular-grid inference")
        elif m == "domain-conversion":
            v=number(p,"velocity",positive=True);text(p,"datum");require(p["direction"] in ("twt-to-depth","depth-to-twt"),"Choose the conversion direction.");forward=p["direction"]=="twt-to-depth";factor=unit_factor("time" if forward else "length",units["axis"]);out=dict(convertedAxis=a["axis"]*factor*v/2 if forward else a["axis"]*factor*2/v);output_units["convertedAxis"]="m" if forward else "s";notes.append("Constant-velocity scenario only; no velocity model was inferred.")
        elif m in ("surface-interpolation","property-kriging"):
            x,y=a["x"],a["y"];z=a["z" if m.startswith("surface") else "value"];valid=np.isfinite(x)&np.isfinite(y)&np.isfinite(z);require(3<=valid.sum()<=2000,"Use 3–2000 valid conditioning points per bounded model.");points=np.column_stack([x[valid],y[valid]]);require(np.linalg.matrix_rank(points-points.mean(axis=0))==2,"Surface points must span two dimensions.")
            nx,ny=integer(p,"nx",2,200),integer(p,"ny",2,200);gx=np.linspace(x[valid].min(),x[valid].max(),nx);gy=np.linspace(y[valid].min(),y[valid].max(),ny);xx,yy=np.meshgrid(gx,gy)
            if m.startswith("surface"):
                text(p,"crs");require(p["domain"] in ("Depth","TWT"),"Confirm Depth or TWT domain.");from scipy.interpolate import griddata
                zz=griddata(points,z[valid],(xx,yy),method="linear");out=dict(xAxis=gx,yAxis=gy,surface=zz);notes.append("No extrapolation outside the convex hull; faults do not automatically constrain this surface.")
            else:
                import gstools as gs
                require(nx*ny<=10000,"Limit conditional models to 10,000 cells.");model=gs.Exponential(dim=2,var=number(p,"variance",positive=True),len_scale=number(p,"range",positive=True));krige=gs.krige.Ordinary(model,cond_pos=points.T,cond_val=z[valid],exact=True);field,variance=krige((gx,gy),mesh_type="structured");count=integer(p,"realizations",1,10);seed=integer(p,"seed",0,2**31-1);cond=gs.CondSRF(krige);realizations=[cond((gx,gy),mesh_type="structured",seed=seed+i).T for i in range(count)];out=dict(xAxis=gx,yAxis=gy,mean=field.T,variance=variance.T,realizations=np.asarray(realizations).reshape(count*ny,nx));summary=dict(realizations=count,seed=seed,covariance="Exponential",conditioningPoints=int(valid.sum()))
        elif m == "log-upscale":
            d,x=a["depth"],a["value"];increasing(d);edges=np.asarray(p["edges"],float);require(edges.ndim==1 and 2<=len(edges)<=10001 and np.all(np.isfinite(edges)) and np.all(np.diff(edges)>0),"Provide increasing finite cell boundaries.");values=[];coverage=[]
            for top,base in zip(edges[:-1],edges[1:]):
                widths=np.r_[np.maximum(0,np.minimum(d[1:],base)-np.maximum(d[:-1],top)),0];valid=np.isfinite(x);support=widths[valid].sum();values.append(np.sum(widths[valid]*x[valid])/support if support else np.nan);coverage.append(support/(base-top))
            out=dict(cellTop=edges[:-1],cellBase=edges[1:],upscaled=np.asarray(values),coverage=np.asarray(coverage))
        elif m == "elastic-properties":
            vp,vs,rho=a["vp"],a["vs"],a["density"];valid=(vp>0)&(vs>0)&(rho>0)&(vp**2>4/3*vs**2);mu=rho*vs**2;bulk=rho*(vp**2-4/3*vs**2);nu=(vp**2-2*vs**2)/(2*(vp**2-vs**2));young=2*mu*(1+nu)
            out=dict(bulkModulus=np.where(valid,bulk,np.nan),shearModulus=np.where(valid,mu,np.nan),youngModulus=np.where(valid,young,np.nan),poisson=np.where(valid,nu,np.nan),acousticImpedance=np.where(valid,rho*vp,np.nan));output_units=dict(bulkModulus="Pa",shearModulus="Pa",youngModulus="Pa",poisson="v/v",acousticImpedance="kg/m²/s")
        elif m == "gassmann":
            kd,phi=a["kDry"],a["porosity"];km,kf=number(p,"kMineral",positive=True),number(p,"kFluid",positive=True);fractional(phi,"Porosity");value=kd+(1-kd/km)**2/(phi/kf+(1-phi)/km-kd/km**2);value[(kd<0)|(kd>=km)|(phi<=0)]=np.nan;out=dict(saturatedBulkModulus=value);output_units["saturatedBulkModulus"]="Pa"
        elif m == "synthetic-seismogram":
            require(p["axisConfirmed"] is True,"Explicitly resample inputs to uniform TWT before convolution.");dt=number(p,"sampleInterval",positive=True);frequency=number(p,"frequency",positive=True);require(frequency<1/(2*dt),"Wavelet frequency must be below Nyquist.");imp=a["vp"]*a["density"];require(np.all(np.isfinite(imp)) and np.all(imp>0),"Synthetic inputs must be finite positive impedance samples.");r=np.r_[0,np.diff(imp)/(imp[1:]+imp[:-1])];half=min(2000,max(2,int(3/(frequency*dt))));t=np.arange(-half,half+1)*dt;z=(np.pi*frequency*t)**2;wavelet=(1-2*z)*np.exp(-z);synthetic=signal.convolve(r,wavelet,mode="same");out=dict(twt=np.arange(len(imp))*dt,reflectivity=r,synthetic=synthetic,waveletTime=t,wavelet=wavelet);output_units=dict(twt="s",waveletTime="s")
        elif m == "geomechanics-1d":
            d,rho,sonic=a["depth"],a["density"],a["sonic"];increasing(d);require(np.all(np.isfinite(rho)) and np.all(rho>0),"Complete positive density coverage is required for overburden integration.");sv=number(p,"surfaceStress",low=0)+integrate.cumulative_trapezoid(rho*9.80665,d,initial=0);hydro=number(p,"hydrostaticGradient",positive=True)*d;normal=number(p,"normalSonic",positive=True);exponent=number(p,"eatonExponent",positive=True);nu=number(p,"poisson",0,.499);tectonic=number(p,"tectonicStress");pp=sv-(sv-hydro)*(normal/sonic)**exponent;sh=nu/(1-nu)*(sv-pp)+pp+tectonic;pp[sonic<=0]=np.nan;out=dict(depth=d,overburden=sv,porePressure=pp,minimumHorizontalStress=sh);output_units=dict(depth="m",overburden="Pa",porePressure="Pa",minimumHorizontalStress="Pa");notes.append("Calibrated 1D screening; not a validated operational mud-weight window or sand-failure model.")
        elif m == "production-allocation":
            text(p,"calibration");unit=text(p,"flowUnit");rate=(a["response"]-number(p,"zero"))*number(p,"slope",positive=True);out=dict(calibratedFlow=rate);output_units["calibratedFlow"]=unit;notes.append("Calibrated sensor response only; multiphase holdup/slip and vendor cased-hole inversions are not inferred.")
        elif m == "trajectory-minimum-curvature":
            d,inc,az=a["md"],a["inclination"],a["azimuth"];increasing(d);require(np.all(np.isfinite(inc)) and np.all(np.isfinite(az)) and np.all((inc>=0)&(inc<=np.pi)) and np.all((az>=0)&(az<=2*np.pi)),"Survey angles must be finite and within inclination 0–180° / azimuth 0–360°.");require(text(p,"northReference") in ("True","Grid"),"Confirm true/grid north; magnetic surveys need a documented correction first.");text(p,"crs")
            dogleg=np.arccos(np.clip(np.cos(inc[:-1])*np.cos(inc[1:])+np.sin(inc[:-1])*np.sin(inc[1:])*np.cos(np.diff(az)),-1,1));rf=np.ones(len(dogleg));nonzero=dogleg>1e-10;require(np.all(dogleg<np.pi-1e-6),"A 180-degree station dogleg is not physically supported.");rf[nonzero]=2/dogleg[nonzero]*np.tan(dogleg[nonzero]/2);step=np.diff(d)*.5*rf
            north=number(p,"north")+np.r_[0,np.cumsum(step*(np.sin(inc[:-1])*np.cos(az[:-1])+np.sin(inc[1:])*np.cos(az[1:])))];east=number(p,"east")+np.r_[0,np.cumsum(step*(np.sin(inc[:-1])*np.sin(az[:-1])+np.sin(inc[1:])*np.sin(az[1:])))];tvd=number(p,"tvd")+np.r_[0,np.cumsum(step*(np.cos(inc[:-1])+np.cos(inc[1:])))];dls=np.r_[0,np.rad2deg(dogleg)/np.diff(d)*30];limit=number(p,"maxDls",positive=True);out=dict(md=d,north=north,east=east,tvd=tvd,dls=dls,exceedsLimit=(dls>limit).astype(float));output_units=dict(md="m",north="m",east="m",tvd="m",dls="deg/30m")
        elif m == "trajectory-clearance":
            planned,offset=a["planned"],a["offset"];require(planned.shape[1]==offset.shape[1]==3 and np.all(np.isfinite(planned)) and np.all(np.isfinite(offset)),"Provide finite projected XYZ coordinates in metres for both paths.");distance,idx=spatial.cKDTree(offset).query(planned);threshold=number(p,"threshold",positive=True);out=dict(distance=distance,nearestOffsetStation=idx,belowThreshold=(distance<threshold).astype(float));summary=dict(minimumSampledDistanceM=float(distance.min()));notes.append("Sampled-point screening only, not continuous-segment anti-collision or positional-uncertainty analysis.")
        elif m in ("in-place-volumes","volume-uncertainty"):
            if m=="in-place-volumes":
                area,h,phi,sw,b=[number(p,k,0,1) if k in ("porosity","sw") else number(p,k,positive=True) for k in ("area","netThickness","porosity","sw","fvf")];require(p["fluid"] in ("oil","gas"),"Choose oil or gas.");value=area*h*phi*(1-sw)/b;summary=dict(standardVolumeM3=value,fluid=p["fluid"],reservoirHydrocarbonPoreM3=area*h*phi*(1-sw))
            else:
                count=integer(p,"samples",100,100000);seed=integer(p,"seed",0,2**31-1);require(p["sampling"] in ("monte-carlo","latin-hypercube"),"Choose Monte Carlo or Latin hypercube.");distributions=p["distributions"];require(isinstance(distributions,dict) and set(distributions)=={"area","netThickness","porosity","sw","fvf"},"Define the five volumetric parameter distributions.");rng=np.random.default_rng(seed);uniform=stats.qmc.LatinHypercube(d=5,seed=seed).random(count) if p["sampling"]=="latin-hypercube" else rng.random((count,5));draws=[]
                for i,key in enumerate(("area","netThickness","porosity","sw","fvf")):
                    dist=distributions[key];lo,mode,hi=[number(dist,k) for k in ("low","mode","high")];require(lo<=mode<=hi and (lo>=0 if key in ("porosity","sw") else lo>0) and (hi<=1 if key in ("porosity","sw") else True),"Check triangular bounds and physical ranges.");draws.append(np.full(count,lo) if hi==lo else stats.triang.ppf(uniform[:,i],(mode-lo)/(hi-lo),loc=lo,scale=hi-lo))
                area,h,phi,sw,b=draws;v=area*h*phi*(1-sw)/b;out=dict(standardVolumeM3=v);summary=dict(samples=count,seed=seed,p90Exceedance=float(np.quantile(v,.1)),p50=float(np.quantile(v,.5)),p10Exceedance=float(np.quantile(v,.9)),mean=float(v.mean()),parameterSpearman={key:float(stats.spearmanr(value,v).statistic) for key,value in zip(("area","netThickness","porosity","sw","fvf"),draws)});notes.append("Independent triangular inputs; correlation is not modeled. P90/P10 use exceedance convention.")
        elif m == "opportunity-score":
            q,e=a["quality"],a["evidence"];fractional(q,"Quality");fractional(e,"Evidence");qw,ew=number(p,"qualityWeight",low=0),number(p,"evidenceWeight",low=0);require(qw+ew>0,"At least one weight must be positive.");out=dict(score=(qw*q+ew*e)/(qw+ew));notes.append("User-specified evidence score, not a discovery probability or automatic overlooked-pay claim.")
        else:
            raise ScienceProblem("method_unavailable","This method has no executable implementation.")
    known_units={"vsh":"v/v","igrUnclipped":"v/v","sw":"v/v","swUnclipped":"v/v", "qualified":"v/v","score":"v/v", "classIndex":"class index", "coverage":"v/v", "j":"dimensionless", "volumes":"v/v", "closureError":"v/v", "standardVolumeM3":"standard m3", "tvd":"m", "supportM":"m", "cellTop":"m", "cellBase":"m", "distance":"m", "nearestOffsetStation":"station index", "exceedsLimit":"v/v", "belowThreshold":"v/v"}
    for key in out:
        if key not in output_units and key in known_units:output_units[key]=known_units[key]
    if m.startswith("qc-") and "washoutFlag" in out:output_units["washoutFlag"]="v/v"
    if m in ("correction-table","core-fit","simulation-compare"):
        original_unit=next(iter(units.values()))
        output_units.update({key:original_unit for key in out})
    for key, value in out.items():
        if isinstance(value,np.ndarray) and value.dtype.kind in "fc" and np.any(~np.isfinite(value)):
            notes.append(f"{key}: {int(np.sum(~np.isfinite(value)))} missing/out-of-domain cells retained as null.")
    require(sum(np.asarray(value).size for value in out.values())<=MAX_CELLS*5,"Output exceeds the bounded artifact cell limit.")
    return clean(dict(schemaVersion=1,method=m,methodVersion=VERSION,parameters=p,
                      series=out,units=output_units,summary=summary,warnings=list(dict.fromkeys(notes)),
                      scientificApproval=False,reference=spec["reference"]))
