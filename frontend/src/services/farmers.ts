import { FarmerProfile } from "../types/farmer";
import { FarmerAlert } from "../types/alert";
import { request } from "./http";
import { SAMPLE_ALERTS, SAMPLE_PROFILE } from "../mocks/sampleData";

export async function getFarmerProfile(id = "farmer-01"): Promise<FarmerProfile> {
  try {
    return await request<FarmerProfile>(`/api/farmers/${id}`);
  } catch {
    const saved = localStorage.getItem("farmer_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to sample
      }
    }
    return SAMPLE_PROFILE;
  }
}

export async function updateFarmerProfile(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
  try {
    return await request<FarmerProfile>(`/api/farmers/${profile.id || "farmer-01"}`, {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  } catch {
    const current = await getFarmerProfile(profile.id || "farmer-01");
    const updated: FarmerProfile = {
      ...current,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("farmer_profile", JSON.stringify(updated));
    return updated;
  }
}

export async function getFarmerAlerts(farmerId = "farmer-01"): Promise<FarmerAlert[]> {
  try {
    return await request<FarmerAlert[]>(`/api/farmers/${farmerId}/alerts`);
  } catch {
    return SAMPLE_ALERTS;
  }
}

export async function markAlertRead(alertId: string): Promise<void> {
  try {
    await request<void>(`/api/alerts/${alertId}/read`, { method: "POST" });
  } catch {
    // Local state handles read toggle
  }
}

