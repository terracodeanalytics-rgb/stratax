/** Integration contracts. UI drafts must never be treated as scientific outputs. */
export type EvidenceRole = 'measured' | 'imported_interpretation' | 'conditioned' | 'reconstructed';
export type ReviewState = 'draft' | 'in_review' | 'accepted' | 'rejected' | 'stale';
export type DepthReference = 'MD' | 'TVD' | 'TVDSS' | 'TST';
export interface EvidenceReference { projectId:string; sourceId:string; sourceVersion:string; checksum:string; page?:number; curveVersionId?:string; role:EvidenceRole; }
export interface Curve { id:string; version:string; mnemonic:string; originalUnit:string; effectiveUnit?:string; depthReference:DepthReference; nullValue:number|null; evidence:EvidenceReference[]; review:ReviewState; }
export interface Configuration { id:string; version:number; moduleId:string; wellIds:string[]; inputVersions:EvidenceReference[]; methodId:string; methodVersion:string; parameters:Record<string,unknown>; review:ReviewState; parentId?:string; }
export interface CalculationResult { id:string; configurationId:string; inputFingerprint:string; dataUri:string; units:Record<string,string>; validMaskUri:string; diagnostics:string[]; calculatedAt:string; review:ReviewState; isSynthetic:false; }
export interface SpatialReference { horizontalEPSG:number; verticalDatum:string; sourceNote:string; reviewedBy:string; reviewedAt:string; }
export interface ProjectLayer { id:string; type:'vector'|'raster'|'wms'|'wmts'|'xyz'; source:EvidenceReference; crs:SpatialReference; visible:boolean; opacity:number; order:number; }
export interface BackendAdapter { listCurves(projectId:string,wellId:string):Promise<Curve[]>; saveConfiguration(config:Configuration):Promise<Configuration>; run(config:Configuration):Promise<{jobId:string}>; getResult(jobId:string):Promise<CalculationResult>; }
