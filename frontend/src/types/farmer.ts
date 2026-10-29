export interface FarmerProfile {
  id: string;
  name?: string;
  district: string;
  crops: string[];
  interests: string[];
  preferredLanguage: "mr" | "hi" | "en";
  hasGivenConsent: boolean;
  contactChannel?: "sms" | "whatsapp" | "in_app";
  contactValue?: string; // phone number (optional)
  updatedAt: string;
}
