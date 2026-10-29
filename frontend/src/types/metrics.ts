export interface MetricItem {
  key: string;
  labelEn: string;
  labelHi?: string;
  labelMr: string;
  value: number;
  unit: "%" | "hours" | "minutes" | "count";
  sampleSize: number;
  descriptionEn: string;
  descriptionHi?: string;
  descriptionMr: string;
}

export interface ImpactMetrics {
  detectionDelayHours: MetricItem;
  extractionAccuracy: MetricItem;
  falseAlertRate: MetricItem;
  sourceTraceability: MetricItem;
  farmerRelevance: MetricItem;
  discoveryTimeMinutes: MetricItem;
  actionabilityRate: MetricItem;
  lastUpdated: string;
}
