import { useQuery } from "@tanstack/react-query";
import { getNotices, getNoticeById, getNoticeHistory } from "../services/notices";

export function useNotices(filter?: {
  district?: string;
  crop?: string;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["notices", filter],
    queryFn: () => getNotices(filter),
  });
}

export function useNotice(id: string) {
  return useQuery({
    queryKey: ["notice", id],
    queryFn: () => getNoticeById(id),
    enabled: Boolean(id),
  });
}

export function useNoticeHistory(id: string) {
  return useQuery({
    queryKey: ["noticeHistory", id],
    queryFn: () => getNoticeHistory(id),
    enabled: Boolean(id),
  });
}

