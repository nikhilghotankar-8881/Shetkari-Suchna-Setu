import { VerificationStatus } from "../utils/status";

export interface NoticeVersion {
  versionId: string;
  retrievedAt: string;
  closingDate?: string | null;
  openingDate?: string | null;
  summary: string;
  summaryHi?: string;
  summaryMr?: string;
  changeSummary?: string;
  changeSummaryHi?: string;
  changeSummaryMr?: string;
}

export interface VerificationLog {
  status: VerificationStatus;
  reviewedBy?: string;
  timestamp: string;
  notes?: string;
  notesHi?: string;
  notesMr?: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  isMandatory: boolean;
  notes?: string;
}

export interface Notice {
  id: string;
  title: string;
  titleHi?: string;
  titleMr?: string;
  department: string;
  departmentHi?: string;
  departmentMr?: string;
  category: "insurance" | "subsidy" | "financial" | "input" | "other";
  sourceName: string;
  sourceNameHi?: string;
  sourceNameMr?: string;
  sourceUrl: string;
  publishedAt: string | null;
  lastCheckedAt: string;
  status: VerificationStatus;
  isDeadlineVerified: boolean;
  applicationStartDate: string | null;
  applicationClosingDate: string | null;
  summary: string;
  summaryHi?: string;
  summaryMr?: string;
  applicableDistricts: string[]; // district IDs or ['all']
  applicableCrops: string[];     // crop IDs or ['all']
  eligibilityConditions: string[];
  eligibilityConditionsHi?: string[];
  eligibilityConditionsMr?: string[];
  requiredDocuments: DocumentRequirement[];
  officialPortalUrl: string;
  versions?: NoticeVersion[];
  verificationHistory?: VerificationLog[];
  isManualImport?: boolean;
}
