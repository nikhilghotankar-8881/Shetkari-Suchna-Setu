import { OfficialSource } from "../types/source";
import { ImpactMetrics } from "../types/metrics";
import { Notice } from "../types/notice";
import { request } from "./http";
import { SAMPLE_NOTICES, SAMPLE_SOURCES, SAMPLE_METRICS } from "../mocks/sampleData";

export async function getAdminSources(): Promise<OfficialSource[]> {
  try {
    return await request<OfficialSource[]>("/api/admin/sources");
  } catch {
    return SAMPLE_SOURCES;
  }
}

export async function getAdminMetrics(): Promise<ImpactMetrics> {
  try {
    return await request<ImpactMetrics>("/api/admin/metrics");
  } catch {
    return SAMPLE_METRICS;
  }
}

export async function verifyNotice(
  noticeId: string,
  updatedFields: Partial<Notice>
): Promise<Notice> {
  try {
    return await request<Notice>(`/api/admin/notices/${noticeId}/verify`, {
      method: "POST",
      body: JSON.stringify(updatedFields),
    });
  } catch {
    const noticeIndex = SAMPLE_NOTICES.findIndex((n) => n.id === noticeId);
    if (noticeIndex >= 0) {
      SAMPLE_NOTICES[noticeIndex] = {
        ...SAMPLE_NOTICES[noticeIndex],
        ...updatedFields,
        status: "verified",
        lastCheckedAt: new Date().toISOString(),
      };
      return SAMPLE_NOTICES[noticeIndex];
    }
    throw new Error("Notice not found");
  }
}

export async function markNoticeConflicting(
  noticeId: string,
  reason: string
): Promise<Notice> {
  try {
    return await request<Notice>(`/api/admin/notices/${noticeId}/conflict`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  } catch {
    const notice = SAMPLE_NOTICES.find((n) => n.id === noticeId);
    if (notice) {
      notice.status = "conflicting";
      return notice;
    }
    throw new Error("Notice not found");
  }
}

