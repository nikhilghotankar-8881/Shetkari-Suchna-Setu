export type SourceHealthState = "healthy" | "warning" | "error" | "offline";

export interface OfficialSource {
  id: string;
  name: string;
  nameHi?: string;
  nameMr: string;
  url: string;
  checkFrequencyHours: number;
  lastCheckedAt: string;
  lastSuccessfulRetrievalAt: string;
  status: SourceHealthState;
  detectedCount: number;
  errorMessage?: string;
  errorMessageHi?: string;
  errorMessageMr?: string;
}
