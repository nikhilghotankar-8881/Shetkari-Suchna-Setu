import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminSources,
  getAdminMetrics,
  verifyNotice,
  markNoticeConflicting,
} from "../services/admin";
import { Notice } from "../types/notice";

export function useAdminSources() {
  return useQuery({
    queryKey: ["adminSources"],
    queryFn: getAdminSources,
  });
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: ["adminMetrics"],
    queryFn: getAdminMetrics,
  });
}

export function useVerifyNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noticeId,
      updatedFields,
    }: {
      noticeId: string;
      updatedFields: Partial<Notice>;
    }) => verifyNotice(noticeId, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice"] });
      queryClient.invalidateQueries({ queryKey: ["farmerAlerts"] });
    },
  });
}

export function useMarkConflicting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noticeId, reason }: { noticeId: string; reason: string }) =>
      markNoticeConflicting(noticeId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice"] });
    },
  });
}

