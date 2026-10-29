export function interpretationTarget(project,workspace){
 const flows=project?.workflows||['petrophysics'];
 if(!flows.includes('petrophysics'))return 'seismic';
 return flows.includes('seismic')&&workspace?.lastInterpretationMode==='seismic'?'seismic':'interpretation';
}
export function workspaceNavigation(project,workspace){
 return [['overview','Overview','overview'],['data','Data','data'],['map','Map','map'],
  ...(project?.workflows?.includes('seismic')?[['processing','Processing','settings']]:[]),
  [interpretationTarget(project,workspace),'Interpretation','logs'],['reports','Reports','reports']];
}
export function processingModes(route){
 return `<nav class="sw-mode-tabs" aria-label="Processing workspace"><button data-go="processing" aria-pressed="${route==='processing'}">Processing graphs</button><button data-go="seismic-qi" aria-pressed="${route==='seismic-qi'}">Seismic engines</button></nav>`;
}
export function interpretationModes(project,route){
 if(!project?.workflows?.includes('petrophysics')||!project.workflows.includes('seismic'))return '';
 return `<nav class="interpretation-modes" aria-label="Interpretation mode"><button data-go="interpretation" aria-pressed="${route!=='seismic'}">Petrophysics</button><button data-go="seismic" aria-pressed="${route==='seismic'}">Seismic</button></nav>`;
}
