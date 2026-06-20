export type SessionType = "clinic" | "routine" | "flooding";
export type SessionStatus = "completed" | "in_progress" | "scheduled" | "abandoned";

export type Session = {
  id: string;
  patientId: string;
  type: SessionType;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
  timeToSyncSeconds?: number;
  syncMetricsId?: string;
  ediEventIds: string[];
  triggerKeywordIds: string[];
  parentReflectionId?: string;
  notes?: string;
};
