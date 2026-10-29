export const escapeUi=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={
 graph:'M4 4h7v5H4z M13 15h7v5h-7z M7.5 9v8H13 M14 6h6 M17 3v6',
 wave:'M2 12h3l2-7 4 14 3-12 3 5h5',
 velocity:'M4 20V4 M4 20h16 M7 17l4-2 2-7 5-4',
 fault:'m5 3 5 6-3 5 4 7 M13 3l-2 4 5 6-2 4 4 4',
 spectrum:'M4 20V12 M8 20V5 M12 20V9 M16 20V3 M20 20V14',
 section:'M3 4h18v16H3z M8 4v16 M8 10h13 M12 6l3 3-2 4 4 5',
 cube:'m12 2 9 5v10l-9 5-9-5V7z M3 7l9 5 9-5 M12 12v10',
 pick:'M4 4v16h16 M7 14l4-5 4 3 5-6 M9 9h4 M11 7v4',
 target:'M3 12h18 M12 3v18 M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12',
 undo:'M9 4 4 9l5 5 M4 9h10a6 6 0 0 1 0 12',
 redo:'m15 4 5 5-5 5 M20 9H10a6 6 0 0 0 0 12'
};
export const seismicIcon=name=>`<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="${paths[name]||paths.wave}"/></svg>`;
export function ribbonGroup(label,content){return `<div class="sw-ribbon-group"><div class="sw-ribbon-commands" role="group" aria-label="${escapeUi(label)}">${content}</div><span class="sw-ribbon-caption">${escapeUi(label)}</span></div>`;}
export function bindRibbon(root){
 if(!root)return;
 root.querySelectorAll('details.sp-menu').forEach(menu=>{
  menu.ontoggle=()=>{if(menu.open){root.querySelectorAll('details.sp-menu').forEach(other=>{if(other!==menu)other.open=false;});menu.classList.remove('opens-left');const panel=menu.querySelector(':scope > div');if(panel&&panel.getBoundingClientRect().right>window.innerWidth-16)menu.classList.add('opens-left');}};
  menu.onkeydown=event=>{if(event.key==='Escape'){event.preventDefault();menu.open=false;menu.querySelector('summary').focus();}};
 });
}
export const parameterLabel=key=>({dt:'Sample interval (s)',start:'Recording start (s)',maxLagSamples:'Maximum lag (samples)',sampleCount:'Sample count',sampleInterval:'Sample interval (s)',waveletDt:'Wavelet interval (s)',noiseFloor:'Stabilisation',frequencyHz:'Frequency (Hz)',durationSeconds:'Duration (s)',phaseDegrees:'Phase rotation (°)',regularization:'Regularisation',minimumCorrelation:'Minimum correlation',maxStretch:'Maximum NMO stretch',minimumVelocity:'Minimum velocity (m/s)',midpointSpacing:'Midpoint spacing (m)',traceSpacing:'Trace spacing (m)',ghostDelaySeconds:'Ghost delay (s)',bubblePeriodSeconds:'Bubble period (s)',timeHighpassHz:'Time high-pass (Hz)',spaceHighpass:'Spatial high-pass (cycles/trace)',operatorLength:'Operator length (samples)',nmoConfirmed:'Input has NMO correction',amplitudeReview:'Amplitude history reviewed',referencesConfirmed:'Coordinate and time references reviewed'}[key]||key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase()));
