// Matches SEISMIC_BACKEND_CHECKLIST.md: availability means implementation complete,
// independently of the still-pending scientific/frontend testing.
const processing=new Set(['detrend','mute','amplitude-balance','spike-decon','bandpass','resample',
 'sweep-correlate','static-shift','nmo','stack','designature','deghost','receiver-deghost','srme-subtract']);
export const processingToolReady=id=>processing.has(id);
export const engineToolReady=id=>id==='slice';
export const interpretationToolReady=id=>!['geometry','new-volume','new-interpretation','track','export'].includes(id);
export const unfinishedText='Implementation incomplete. This tool is not available to run yet.';
export const unavailableAttributes=(ready)=>ready?'':`disabled title="${unfinishedText}" aria-disabled="true"`;
