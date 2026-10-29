import { Notice } from "../types/notice";
import { request } from "./http";
import { SAMPLE_NOTICES } from "../mocks/sampleData";

export async function getNotices(filter?: {
  district?: string;
  crop?: string;
  status?: string;
  search?: string;
}): Promise<Notice[]> {
  try {
    const params = new URLSearchParams();
    if (filter?.district) params.append("district", filter.district);
    if (filter?.crop) params.append("crop", filter.crop);
    if (filter?.status) params.append("status", filter.status);
    if (filter?.search) params.append("q", filter.search);

    const query = params.toString() ? `?${params.toString()}` : "";
    return await request<Notice[]>(`/api/notices${query}`);
  } catch {
    // Graceful demo fallback
    let list = [...SAMPLE_NOTICES];
    if (filter?.status && filter.status !== "all") {
      list = list.filter((n) => n.status === filter.status);
    }
    if (filter?.district && filter.district !== "all") {
      list = list.filter(
        (n) => n.applicableDistricts.includes("all") || n.applicableDistricts.includes(filter.district!)
      );
    }
    if (filter?.crop && filter.crop !== "all") {
      list = list.filter(
        (n) => n.applicableCrops.includes("all") || n.applicableCrops.includes(filter.crop!)
      );
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.titleHi && n.titleHi.toLowerCase().includes(q)) ||
          (n.titleMr && n.titleMr.toLowerCase().includes(q)) ||
          n.summary.toLowerCase().includes(q) ||
          (n.summaryHi && n.summaryHi.toLowerCase().includes(q)) ||
          (n.summaryMr && n.summaryMr.toLowerCase().includes(q))
      );
    }
    return list;
  }
}

export async function getNoticeById(id: string): Promise<Notice | null> {
  try {
    return await request<Notice>(`/api/notices/${id}`);
  } catch {
    const notice = SAMPLE_NOTICES.find((n) => n.id === id);
    return notice || null;
  }
}

export async function getNoticeHistory(id: string) {
  try {
    return await request<Notice["versions"]>(`/api/notices/${id}/history`);
  } catch {
    const notice = SAMPLE_NOTICES.find((n) => n.id === id);
    return notice?.versions || [];
  }
}

