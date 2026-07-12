import { apiFetch, USE_API } from "@/lib/api/client";
import type { SyncMetrics, SyncTrendPoint, RoutineVsFloodingPoint, SessionType } from "@/types";
import { syncMetrics } from "../mock/sync-metrics.mock";
import { sessions } from "../mock/sessions.mock";

export async function getSyncMetrics(sessionId: string): Promise<SyncMetrics | null> {
  if (USE_API) return apiFetch<SyncMetrics | null>(`/sessions/${sessionId}/metrics`);
  return syncMetrics.find((m) => m.sessionId === sessionId) ?? null;
}

export async function getSyncTrend(patientId: string): Promise<SyncTrendPoint[]> {
  if (USE_API) return apiFetch<SyncTrendPoint[]>(`/patients/${patientId}/metrics/trend`);
  const patientSessions = sessions
    .filter((s) => s.patientId === patientId && s.status === "completed")
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  return patientSessions
    .map((s) => {
      const m = syncMetrics.find((sm) => sm.sessionId === s.id);
      if (!m) return null;
      return {
        sessionId: s.id,
        date: s.startedAt,
        type: s.type,
        breathingSyncPercent: m.breathingSyncPercent,
        tapSyncPercent: m.tapSyncPercent,
      };
    })
    .filter((p): p is SyncTrendPoint => p !== null);
}

export async function getRoutineVsFloodingComparison(
  patientId: string
): Promise<RoutineVsFloodingPoint[]> {
  if (USE_API) return apiFetch<RoutineVsFloodingPoint[]>(`/patients/${patientId}/metrics/comparison`);
  const types: SessionType[] = ["clinic", "routine", "flooding"];
  return types.map((type) => {
    const matching = sessions.filter(
      (s) => s.patientId === patientId && s.type === type && s.timeToSyncSeconds != null
    );
    const avg =
      matching.length === 0
        ? 0
        : Math.round(
            matching.reduce((sum, s) => sum + (s.timeToSyncSeconds ?? 0), 0) / matching.length
          );
    return { type, avgTimeToSyncSeconds: avg };
  });
}
