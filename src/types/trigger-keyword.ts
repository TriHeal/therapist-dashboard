export type TriggerSeverity = "low" | "medium" | "high";

export type TriggerKeyword = {
  id: string;
  sessionId: string;
  keyword: string;
  category?: string;
  flaggedAt: string;
  severity: TriggerSeverity;
  reviewed: boolean;
};
