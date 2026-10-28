"""One bounded, explicit scientific execution; arrays never enter Firestore."""
import gzip
import json
import logging
import os
import re
from pathlib import Path

from google.cloud import firestore
from ingestion_core import column, output_dataset
from scientific_api import fingerprint, settle_run, restore_value
from scientific_catalog import ARTIFACT_BUDGET, MAX_ROWS, MAX_CELLS, METHODS
from scientific_core import ScienceProblem, evaluate, require, unit_factor, clean

logger = logging.getLogger("stratax-science")


def safe_child(root, relative):
    require(isinstance(relative,str) and "\\" not in relative and ".." not in relative.split("/") and not relative.startswith("/"),"An artifact reference is invalid.","unsafe_artifact")
    target=(root/relative).resolve()
    require(target.is_relative_to(root.resolve()),"An artifact reference leaves its project scope.","unsafe_artifact")
    return target


def read_inputs(root, snapshots, bindings, cancelled=lambda:False):
    inputs, units = {}, {}
    cells=0
    for did, source in snapshots.items():
        manifest_path=safe_child(root,source["manifest"])
        require(manifest_path.stat().st_size<=2*1024**2,"Input manifest exceeds its bounded size.")
        manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
        selected={role:binding for role,binding in bindings.items() if binding["datasetId"]==did}
        columns={c["id"]:i for i,c in enumerate(manifest["columns"])}
        for role,binding in selected.items():
            require(binding["columnId"] in columns,"A selected column is missing from the stored manifest.")
            inputs[role]=[];units[role]=binding["unit"]
        count=0
        for chunk in manifest.get("chunks",[]):
            require(not cancelled(),"Calculation cancelled.","cancelled")
            name=chunk["name"]
            require(isinstance(name,str) and re.fullmatch(r"[\w.-]{1,180}",name) and name not in (".",".."),"Unsafe input chunk reference.")
            path=safe_child(root,str(Path(source["manifest"]).parent/name).replace("\\","/"))
            require(path.stat().st_size<=16*1024**2,"Input chunk exceeds its compressed-byte budget.")
            expanded=0
            with gzip.open(path,"rt",encoding="utf-8") as stream:
                for line in stream:
                    expanded+=len(line)
                    require(expanded<=64*1024**2,"Input chunk exceeds its decompressed-byte budget.")
                    require(len(line)<=8*1024**2,"An individual source row is too large.")
                    row=json.loads(line);count+=1
                    require(count<=MAX_ROWS and isinstance(row,list) and len(row)==len(manifest["columns"]),"Source rows exceed their budget or column contract.")
                    for role,binding in selected.items():
                        value=row[columns[binding["columnId"]]]
                        cells+=len(value) if isinstance(value,list) else 1
                        require(cells<=MAX_CELLS,"The selected input exceeds the cell budget.")
                        inputs[role].append(value)
        require(count==manifest["rowCount"] and count==source["rowCount"],"Source chunk counts do not match the reviewed manifest.")
    return inputs,units


def seismic_section(path, parameters, options, cancelled=lambda:False):
    """Explicit full-resolution section from an immutable original, with no preview resampling."""
    import numpy as np
    from scientific_core import integer,number
    first=integer(parameters,"firstTrace",0,249999);count=integer(parameters,"traceCount",1,512)
    start=integer(parameters,"firstSample",0,1000000);samples=integer(parameters,"sampleCount",1,4096)
    require(count*samples<=MAX_CELLS,"Selected seismic section exceeds the cell budget.")
    selection=parameters["selection"];require(selection in ("trace-range","inline","crossline"),"Choose a seismic section selection mode.")
    kind=path.suffix.lower();headers=[]
    if kind in (".sgy",".segy",".segy2",".su"):
        import segyio
        opener=segyio.su.open if kind==".su" else segyio.open
        with opener(str(path),"r",strict=False,ignore_geometry=True,endian=options.get("endian","big")) as source:
            require(start+samples<=len(source.samples),"Selected sample range exceeds the source trace length.")
            if selection=="trace-range":indices=list(range(first,min(source.tracecount,first+count)))
            else:
                require(source.tracecount<=250000,"Header-section lookup exceeds 250,000 traces; prepare a bounded section or use trace-range.")
                key=options.get("headerBytes",{}).get(selection,189 if selection=="inline" else 193);value=integer(parameters,"sectionValue",-2**31,2**31-1)
                found=[]
                for i in range(source.tracecount):
                    if i%1000==0:require(not cancelled(),"Calculation cancelled.","cancelled")
                    if source.header[i][int(key)]==value:found.append(i)
                indices=found[first:first+count]
            require(len(indices)==count,"Requested trace count is unavailable in this section; select a smaller range.")
            traces=[]
            for i in indices:
                require(not cancelled(),"Calculation cancelled.","cancelled")
                traces.append(np.asarray(source.trace[i][start:start+samples],dtype=float));h=source.header[i]
                headers.append(dict(trace=i,inline=int(h[189]),crossline=int(h[193]),cdp=int(h[21])))
            return np.asarray(traces),dict(traceHeaders=headers,sampleAxis=list(map(float,source.samples[start:start+samples])),sourceFormat=kind)
    if kind in (".zgy",".sgz"):
        if kind==".zgy":from pyzgy.read import SeismicReader as Reader
        else:from seismic_zfp.read import SgzReader as Reader
        with Reader(str(path)) as source:
            ilines=list(map(int,source.ilines));xlines=list(map(int,source.xlines));axis=getattr(source,"samples",getattr(source,"zslices",[]))
            require(start+samples<=len(axis),"Selected samples exceed the source axis.")
            require(selection in ("inline","crossline"),"Select an inline or crossline for ZGY/SGZ.")
            value=integer(parameters,"sectionValue",-2**31,2**31-1);labels=ilines if selection=="inline" else xlines
            require(value in labels,"The requested section is not in this survey.")
            # Reader section allocation is bounded before invoking its native operation.
            perpendicular=len(xlines) if selection=="inline" else len(ilines)
            require(perpendicular*len(axis)<=MAX_CELLS,"The native full section exceeds memory limits; export a bounded SEG-Y section.")
            section=source.read_inline(labels.index(value)) if selection=="inline" else source.read_crossline(labels.index(value))
            require(first+count<=len(section),"Requested traces exceed this section.")
            return np.asarray(section[first:first+count,start:start+samples],float),dict(sourceFormat=kind,section=selection,sectionValue=value,firstTrace=first,sampleAxis=list(map(float,axis[start:start+samples])))
    raise ScienceProblem("source_format","Full-resolution seismic processing requires a supported SEG-Y/SU/ZGY/SGZ original; decimated previews cannot be calculated as source samples.")


def write_result(output, prefix, rid, result, sources, configuration):
    output.mkdir(parents=True,exist_ok=True)
    groups={}
    for key,values in result["series"].items():
        groups.setdefault(len(values),[]).append((key,values))
    datasets=[]
    for count,items in groups.items():
        if not count:continue
        cols=[column(key,result["units"].get(key,"unconfirmed"),i) for i,(key,_) in enumerate(items)]
        rows=([values[index] for _,values in items] for index in range(count))
        ds=output_dataset(output,"Calculation "+rid+" · "+str(count)+" rows",cols,rows,
                          metadata=dict(scientificMethod=result["method"],methodVersion=result["methodVersion"]))
        ds["manifest"]=prefix+"/"+ds["id"]+".json"
        # IDs are unique across runs even when result shape/names repeat.
        original_id=ds["id"];ds["id"]="sci-"+rid[4:20]+"-"+str(len(datasets))
        ds.update(well=next(iter({s.get("well","") for s in sources.values()}),"") if len({s.get("well","") for s in sources.values()})==1 else "",family="derived",references={"userConfirmedInputs":True},mapping={})
        if any(key == "depth" for key,_ in items) and configuration.get("scope"):
            ds["indexColumnId"] = cols[next(i for i,(key,_) in enumerate(items) if key == "depth")]["id"]
            ds["references"].update(depthReference=configuration["scope"]["reference"], depthUnit="m")
        (output/(original_id+".json")).write_text(json.dumps(ds,allow_nan=False),encoding="utf-8")
        datasets.append(ds)
    preview={key:values[:min(2000,len(values))] if not values or not isinstance(values[0],list) else [row[:512] for row in values[:256]] for key,values in result["series"].items()}
    manifest={k:v for k,v in result.items() if k!="series"}
    manifest.update(datasets=datasets,preview=preview,previewNotice="Display preview only; complete values are retained in chunked artifacts.",provenance=dict(configuration=configuration,sources=[{k:s.get(k) for k in ("id","sourceSha256","parserVersion","fingerprint")} for s in sources.values()]))
    payload=json.dumps(manifest,allow_nan=False)
    if len(payload.encode())>2*1024**2:
        manifest["preview"]={};manifest["previewNotice"]="Open individual chunk artifacts; this result exceeds the inline preview budget."
        for ds in datasets:ds["preview"]=ds["preview"][:10]
        payload=json.dumps(manifest,allow_nan=False)
    require(len(payload.encode())<=2*1024**2,"Result manifest exceeds its bounded size.")
    (output/"manifest.json").write_text(payload,encoding="utf-8")
    total=sum(p.stat().st_size for p in output.iterdir() if p.is_file())
    require(total<=ARTIFACT_BUDGET,"Result artifacts exceed the reserved capacity.")
    return total,dict(summary=result["summary"],warnings=result["warnings"],datasetCount=len(datasets))


def scoped_inputs(inputs, units, selection):
    """Use exact reviewed source rows, retaining the real index alongside derived values."""
    import numpy as np
    if not selection:return inputs,units,None
    raw=inputs.pop("__canvas_index")
    units.pop("__canvas_index",None)
    depth=np.asarray(raw,dtype=float)*unit_factor("length",selection["unit"])
    mask=np.ones(len(depth),dtype=bool)
    if selection.get("top") is not None:mask &= np.isfinite(depth)&(depth>=selection["top"])&(depth<=selection["base"])
    if selection.get("rowRanges") is not None:
        rows=np.zeros(len(depth),bool)
        for item in selection["rowRanges"]:
            lo,hi=(item["start"],item["end"]) if isinstance(item,dict) else item
            rows[lo:hi+1]=True
        mask &= rows
    require(bool(mask.any()),"The selected interval/brush contains no finite source-index samples.","empty_selection")
    for role,values in inputs.items():
        require(len(values)==len(depth),"Canvas interval inputs do not have a common stored row index.","scope_alignment")
        inputs[role]=np.asarray(values)[mask].tolist()
    return inputs,units,depth[mask]


def run():
    uid,pid,rid,dispatch=[os.environ[k] for k in ("SCIENCE_UID","SCIENCE_PROJECT","SCIENCE_RUN","SCIENCE_DISPATCH")]
    require(all(re.fullmatch(r"[\w-]{1,128}",v,re.ASCII) for v in (uid,pid,rid,dispatch)),"Invalid execution scope.")
    db=firestore.Client(project=os.environ.get("GOOGLE_CLOUD_PROJECT","project-9afac"))
    project=db.collection("stratax_projects").document(uid).collection("records").document(pid)
    ref=project.collection("scienceRuns").document(rid)
    capacity=db.collection("stratax_science_runtime").document("capacity")
    record=restore_value(ref.get().to_dict())
    if not record or record.get("dispatch")!=dispatch or record["status"] not in ("queued","cancelling"):return
    project_root=Path(os.environ.get("DERIVED_MOUNT","/derived"))/"owners"/uid/"projects"/pid
    relative_prefix=f"owners/{uid}/projects/{pid}/science/{rid}/{dispatch}"
    output=Path(os.environ.get("DERIVED_MOUNT","/derived"))/relative_prefix
    status,message,extra="failed",None,None
    try:
        require(record["status"]!="cancelling","Calculation cancelled.","cancelled")
        ref.update(dict(status="running"))
        def cancelled():return ref.get().to_dict().get("status")=="cancelling"
        for did,source in record["inputSnapshots"].items():
            latest=project.collection("datasets").document(did).get().to_dict()
            require(latest and latest.get("active") and fingerprint(latest)==source["fingerprint"],"An input version changed. Submit a new calculation.","stale_inputs")
            prefix=f"owners/{uid}/projects/{pid}/"
            require(source["manifest"].startswith(prefix),"Input artifact leaves the authenticated project.","unsafe_artifact")
        extra_geometry=None
        if record["method"]=="seismic-attributes":
            binding=record["configuration"]["bindings"]["traces"];ds=record["inputSnapshots"][binding["datasetId"]]
            require(ds.get("family")=="seismic","Select an imported seismic dataset with an immutable original.")
            current_project=project.get().to_dict();original=next((f for f in current_project["workspace"]["files"] if f["id"]==ds["sourceId"]),None)
            require(original is not None,"The seismic original is not retained in this project.")
            source_id=ds["sourceId"];require(re.fullmatch(r"[\w-]{1,100}",source_id,re.ASCII),"Invalid seismic source reference.")
            raw=Path(os.environ.get("RAW_MOUNT","/raw"))/"owners"/uid/"projects"/pid/"originals"/source_id
            import tempfile
            with tempfile.TemporaryDirectory() as scratch:
                linked=Path(scratch)/("source"+Path(original["name"]).suffix.lower());linked.symlink_to(raw)
                source_import=project.collection("imports").document(ds["importId"]).get().to_dict()
                traces,extra_geometry=seismic_section(linked,record["parameters"],source_import.get("options",{}),cancelled)
            inputs={"traces":traces};units={"traces":binding["unit"]}
        else:
            bindings=dict(record["configuration"]["bindings"])
            selection=record["configuration"].get("scope")
            if selection:bindings["__canvas_index"]={k:selection[k] for k in ("datasetId","columnId","unit")}
            inputs,units=read_inputs(project_root,{k:dict(v,manifest=v["manifest"].removeprefix(f"owners/{uid}/projects/{pid}/")) for k,v in record["inputSnapshots"].items()},bindings,cancelled)
            inputs,units,index=scoped_inputs(inputs,units,selection)
        require(not cancelled(),"Calculation cancelled.","cancelled")
        result=evaluate(record["method"],inputs,record["parameters"],units)
        if not extra_geometry and record["configuration"].get("scope"):
            if any(len(values)==len(index) for values in result["series"].values()):
                if "depth" not in result["series"]:result["series"]={"depth":clean(index),**result["series"]}
                result["units"]["depth"]="m"
            result["summary"]["canvasScope"]={"sourceRows":len(index),"reference":record["configuration"]["scope"]["reference"],"selection":"Exact retained source rows; no resampling"}
        if extra_geometry:result["summary"].update(extra_geometry)
        require(not cancelled(),"Calculation cancelled.","cancelled")
        total,extra=write_result(output,relative_prefix,rid,result,record["inputSnapshots"],record["configuration"])
        status="completed"
    except ScienceProblem as error:
        status="cancelled" if error.code=="cancelled" else "failed"
        message=str(error)
        logger.warning(json.dumps(dict(event="science_blocked",run=rid,code=error.code)))
    except Exception as error:
        message="Calculation did not finish. Your source data and configuration are retained."
        logger.error(json.dumps(dict(event="science_failed",run=rid,kind=type(error).__name__)))
    finally:
        actual=sum(p.stat().st_size for p in output.rglob("*") if p.is_file()) if output.exists() else 0
        settle_run(db,project,ref,capacity,dispatch,status,actual,message,extra)


if __name__=="__main__":run()
