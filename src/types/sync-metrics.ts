export type SyncMetricsSample = {
  tSeconds: number;
  syncPercent: number;
};

export type SyncMetrics = {
  id: string;
  sessionId: string;
  breathingSyncPercent: number;
  tapSyncPercent: number;
  timeToSyncSeconds: number;
  syncAttempts: number;
  desyncEvents: number;
  samples?: SyncMetricsSample[];
};

export type SyncTrendPoint = {
  sessionId: string;
  date: string;
  type: import("./session").SessionType;
  breathingSyncPercent: number;
  tapSyncPercent: number;
};
