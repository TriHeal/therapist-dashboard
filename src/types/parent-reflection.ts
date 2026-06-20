export type ParentReflectionLog = {
  id: string;
  sessionId: string;
  loggedAt: string;
  whatHappened: string;
  timeToSyncEstimateSeconds?: number;
  parentNotes?: string;
};
