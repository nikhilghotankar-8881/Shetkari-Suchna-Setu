import { Notice, NoticeVersion, VerificationLog } from "../types/notice";
import { OfficialSource, SourceHealthState } from "../types/source";
import { ImpactMetrics } from "../types/metrics";
import { FarmerProfile } from "../types/farmer";
import { FarmerAlert } from "../types/alert";
import { VerificationStatus } from "../utils/status";

// ── Backend Schema Definitions ──────────────────────────────────────────

export interface BackendSchemeCard {
  id: string;
  notice_id: string;
  version_id: string;
  scheme_name: string;
  department: string;
  eligibility: string;
  benefits: string;
  deadline: string;
  deadline_is_verified: boolean;
  documents: string[];
  official_application_link: string | null;
  source_name: string;
  source_url: string;
  last_verified_at: string | null;
  verification_badge: string;
  change_type: string;
  diff_text: string | null;
}

export interface BackendSource {
  id: string;
  name: string;
  url: string;
  kind: "html" | "pdf" | "rss";
  mode: "auto" | "manual";
  poll_minutes: number;
  robots_ok: boolean;
  health: string;
  last_error: string | null;
  last_checked_at: string | null;
  last_changed_at: string | null;
  created_at: string;
}

export interface BackendProfileResponse {
  id: string;
  district: string;
  taluka?: string | null;
  crops: string[];
  lang: string;
  created_at: string;
  last_seen_at: string;
  token?: string | null;
}

export interface BackendAlertResponse {
  id: string;
  kind: string;
  notice_version_id: string;
  title: string;
  department?: string | null;
  change_summary?: string | null;
  deadline_text?: string | null;
  created_at: string;
  read_at?: string | null;
  is_read: boolean;
}

export interface BackendMetricsResponse {
  total_sources: number;
  healthy_sources: number;
  total_notices: number;
  total_profiles: number;
  review_queue_length: number;
}

// ── Adapters ─────────────────────────────────────────────────────────────

export function adaptSchemeCardToNotice(card: BackendSchemeCard): Notice {
  const statusMap: Record<string, VerificationStatus> = {
    Verified: "verified",
    "Auto-checked": "pending_review",
    "Needs review": "conflicting",
    Superseded: "superseded",
    Rejected: "conflicting",
    Pending: "pending_review",
  };
  const status: VerificationStatus = statusMap[card.verification_badge] || "pending_review";

  let category: Notice["category"] = "subsidy";
  const lowerName = (card.scheme_name || "").toLowerCase();
  if (lowerName.includes("bima") || lowerName.includes("insurance") || lowerName.includes("विमा")) {
    category = "insurance";
  } else if (lowerName.includes("tractor") || lowerName.includes("mechan") || lowerName.includes("यांत्रिकीकरण")) {
    category = "subsidy";
  } else if (lowerName.includes("pond") || lowerName.includes("water") || lowerName.includes("शेततळे")) {
    category = "financial";
  } else if (lowerName.includes("organic") || lowerName.includes("fertilizer") || lowerName.includes("जैविक")) {
    category = "input";
  }

  const docs = Array.isArray(card.documents)
    ? card.documents.map((d: string, idx: number) => ({
        id: `doc-${idx + 1}`,
        name: d,
        nameMr: d,
        isMandatory: true,
      }))
    : [];

  const versions: NoticeVersion[] = [];
  if (card.diff_text) {
    versions.push({
      versionId: card.version_id || "v-1",
      retrievedAt: card.last_verified_at || new Date().toISOString(),
      summary: card.benefits || card.scheme_name,
      changeSummary: card.diff_text,
    });
  }

  const verificationHistory: VerificationLog[] = [];
  if (card.last_verified_at) {
    verificationHistory.push({
      status,
      timestamp: card.last_verified_at,
      reviewedBy: card.verification_badge === "Verified" ? "Verified Officer" : "Automated Engine",
      notes: card.verification_badge === "Verified"
        ? "Human-approved against published official notice."
        : "Automated extraction; pending human review.",
    });
  }

  return {
    id: card.notice_id || card.id,
    title: card.scheme_name,
    titleMr: card.scheme_name,
    department: card.department,
    departmentMr: card.department,
    category,
    sourceName: card.source_name || "Maharashtra Krishi Vibhag",
    sourceNameMr: card.source_name || "कृषी विभाग महाराष्ट्र शासन",
    sourceUrl: card.source_url || card.official_application_link || "",
    publishedAt: card.last_verified_at || null,
    lastCheckedAt: card.last_verified_at || new Date().toISOString(),
    status,
    isDeadlineVerified: Boolean(card.deadline_is_verified),
    applicationStartDate: null,
    applicationClosingDate:
      card.deadline_is_verified && card.deadline !== "Not yet verified" ? card.deadline : null,
    summary: card.benefits || card.eligibility || card.scheme_name,
    summaryMr: card.benefits || card.eligibility || card.scheme_name,
    applicableDistricts: ["all"],
    applicableCrops: ["all"],
    eligibilityConditions: card.eligibility ? [card.eligibility] : [],
    eligibilityConditionsMr: card.eligibility ? [card.eligibility] : [],
    requiredDocuments: docs,
    officialPortalUrl: card.official_application_link || card.source_url || "",
    versions: versions.length ? versions : undefined,
    verificationHistory: verificationHistory.length ? verificationHistory : undefined,
  };
}

export function adaptBackendSourceToFrontend(src: BackendSource): OfficialSource {
  let status: SourceHealthState = "healthy";
  if (src.health === "red") status = "error";
  else if (src.health === "yellow") status = "warning";
  else if (src.health === "offline") status = "offline";

  return {
    id: src.id,
    name: src.name,
    nameMr: src.name,
    url: src.url,
    checkFrequencyHours: Math.round((src.poll_minutes || 360) / 60) || 6,
    lastCheckedAt: src.last_checked_at || src.created_at || new Date().toISOString(),
    lastSuccessfulRetrievalAt:
      src.last_changed_at || src.last_checked_at || src.created_at || new Date().toISOString(),
    status,
    detectedCount: 1,
    errorMessage: src.last_error || undefined,
  };
}

export function adaptBackendMetricsToFrontend(
  backendMetrics: BackendMetricsResponse,
  fallback: ImpactMetrics
): ImpactMetrics {
  const healthyPct =
    backendMetrics.total_sources > 0
      ? Math.round((backendMetrics.healthy_sources / backendMetrics.total_sources) * 100)
      : fallback.sourceTraceability.value;

  return {
    ...fallback,
    sourceTraceability: {
      ...fallback.sourceTraceability,
      value: healthyPct,
      sampleSize: backendMetrics.total_sources,
      descriptionEn: `${backendMetrics.healthy_sources} of ${backendMetrics.total_sources} government sources active and healthy`,
      descriptionMr: `${backendMetrics.total_sources} पैकी ${backendMetrics.healthy_sources} शासकीय स्रोत सक्रिय व सुरक्षित`,
    },
    farmerRelevance: {
      ...fallback.farmerRelevance,
      sampleSize: backendMetrics.total_profiles || fallback.farmerRelevance.sampleSize,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function adaptBackendProfileToFrontend(p: BackendProfileResponse): FarmerProfile {
  return {
    id: p.id,
    district: (p.district || "pune").toLowerCase(),
    crops: Array.isArray(p.crops) ? p.crops.map((c: string) => c.toLowerCase()) : [],
    interests: ["schemes", "insurance"],
    preferredLanguage: (p.lang === "hi" ? "hi" : p.lang === "en" ? "en" : "mr") as "mr" | "hi" | "en",
    hasGivenConsent: true,
    contactChannel: "in_app",
    updatedAt: p.last_seen_at || p.created_at || new Date().toISOString(),
  };
}

export function adaptBackendAlertToFrontend(a: BackendAlertResponse, allNotices: Notice[]): FarmerAlert {
  const matched = allNotices.find((n) => n.id === a.notice_version_id || n.id === a.id);
  const notice: Notice = matched || {
    id: a.notice_version_id || a.id,
    title: a.title,
    titleMr: a.title,
    department: a.department || "कृषी विभाग, महाराष्ट्र शासन",
    category: "subsidy",
    sourceName: "Official Government Portal",
    sourceUrl: "https://krishi.maharashtra.gov.in",
    publishedAt: a.created_at,
    lastCheckedAt: a.created_at,
    status: a.kind === "CHANGED" ? "verified" : "pending_review",
    isDeadlineVerified: Boolean(a.deadline_text && a.deadline_text !== "Not yet verified"),
    applicationStartDate: null,
    applicationClosingDate: a.deadline_text !== "Not yet verified" ? a.deadline_text : null,
    summary: a.change_summary || a.title,
    applicableDistricts: ["all"],
    applicableCrops: ["all"],
    eligibilityConditions: ["Refer to official circular"],
    requiredDocuments: [],
    officialPortalUrl: "https://mahadbt.maharashtra.gov.in",
  };

  return {
    id: a.id,
    farmerId: "farmer-01",
    noticeId: a.notice_version_id || a.id,
    notice,
    matchReason: {
      explanationEn: a.change_summary || "Relevant to your district and registered crops.",
      explanationMr: a.change_summary || "आपल्या पिकांसाठी आणि जिल्ह्यासाठी सुसंगत शासकीय सूचना.",
    },
    createdAt: a.created_at,
    isRead: Boolean(a.is_read || a.read_at),
  };
}

