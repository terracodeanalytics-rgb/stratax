export function interpretationTarget(project,workspace){
 const flows=project?.workflows||['petrophysics'];
 if(!flows.includes('petrophysics'))return 'seismic';
 return flows.includes('seismic')&&workspace?.lastInterpretationMode==='seismic'?'seismic':'interpretation';
}
export function workspaceNavigation(project,workspace){
 return [['overview','Overview','overview'],['data','Data','data'],['map','Map','map'],
  ...(project?.workflows?.includes('seismic')?[['processing','Processing','settings'],['seismic-qi','Seismic engines','models']]:[]),
  [interpretationTarget(project,workspace),'Interpretation','logs'],['reports','Reports','reports']];
}
export function interpretationModes(project,route){
 if(!project?.workflows?.includes('petrophysics')||!project.workflows.includes('seismic'))return '';
 return `<nav class="interpretation-modes" aria-label="Interpretation mode"><button data-go="interpretation" aria-pressed="${route!=='seismic'}">Petrophysics</button><button data-go="seismic" aria-pressed="${route==='seismic'}">Seismic</button></nav>`;
}
