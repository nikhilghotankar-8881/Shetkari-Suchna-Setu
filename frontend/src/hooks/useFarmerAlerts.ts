import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFarmerAlerts,
  getFarmerProfile,
  updateFarmerProfile,
  markAlertRead,
} from "../services/farmers";
import { FarmerProfile } from "../types/farmer";

export function useFarmerAlerts(farmerId = "farmer-01") {
  return useQuery({
    queryKey: ["farmerAlerts", farmerId],
    queryFn: () => getFarmerAlerts(farmerId),
  });
}

export function useFarmerProfile(farmerId = "farmer-01") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["farmerProfile", farmerId],
    queryFn: () => getFarmerProfile(farmerId),
  });

  const mutation = useMutation({
    mutationFn: (newProfile: Partial<FarmerProfile>) => updateFarmerProfile(newProfile),
    onSuccess: (updated) => {
      queryClient.setQueryData(["farmerProfile", farmerId], updated);
      queryClient.invalidateQueries({ queryKey: ["farmerAlerts"] });
    },
  });

  return {
    ...query,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => markAlertRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farmerAlerts"] });
    },
  });
}

