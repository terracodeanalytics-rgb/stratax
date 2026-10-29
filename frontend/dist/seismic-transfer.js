// Rebind an independent copy only where the reimport retained the same source bytes.
export function remapSeismicCopy(context,originalWorkspace,datasetIds,resources,originProjectId){
 const versions=new Map(resources.map(r=>[r.id,r])),old=new Map((originalWorkspace.ingestion?.datasets||[]).map(d=>[d.id,d]));
 const remapBook=b=>{
  for(const v of b.views||[])v.datasetId=datasetIds[v.datasetId]||v.datasetId;
  b.trackingProposal=null;
  for(const i of b.interpretations||[]){
   const previous=i.datasetId,next=datasetIds[previous],resource=versions.get(next),source=old.get(previous);
   i.copiedFrom={projectId:originProjectId,datasetId:previous,sourceVersion:i.sourceVersion};
   i.datasetId=next||previous;i.revision=0;i.dirty=true;
   if(resource&&source?.sourceSha256&&resource.sourceSha256===source.sourceSha256){i.sourceVersion=resource.sourceVersion;i.stale=false;if(i.assistance)i.assistance.sourceVersion=resource.sourceVersion;}
   else i.stale=true;
  }
 };
 for(const b of context.seismicWorkspace?.books||[])remapBook(b);
 for(const v of context.seismicWorkspace?.versions||[])remapBook(v.state);
 for(const b of context.seismicProcessing?.books||[]){
  const previous=b.graph.sourceId,next=datasetIds[previous],resource=versions.get(next);
  b.copiedFrom={projectId:originProjectId,sourceId:previous,sourceVersion:b.graph.sourceVersion};
  b.graph.sourceId=next||previous;b.graph.sourceVersion=resource?.sourceVersion||b.graph.sourceVersion;b.graph.revision=0;b.graph.domainConfirmed=false;
  b.dirty=true;delete b.validation;delete b.estimate;delete b.run;delete b.submissionKey;
 }
}
