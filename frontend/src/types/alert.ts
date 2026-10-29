import { Notice } from "./notice";

export interface MatchReason {
  districtMatch?: string;
  cropMatch?: string[];
  categoryMatch?: string;
  explanationEn: string;
  explanationHi?: string;
  explanationMr: string;
}

export interface FarmerAlert {
  id: string;
  farmerId: string;
  noticeId: string;
  notice: Notice;
  matchReason: MatchReason;
  createdAt: string;
  isRead: boolean;
}
