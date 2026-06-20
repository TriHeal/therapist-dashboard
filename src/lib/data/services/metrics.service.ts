import type { SyncMetrics, SyncTrendPoint, RoutineVsFloodingPoint, SessionType } from "@/types";
import { syncMetrics } from "../mock/sync-metrics.mock";
import { sessions } from "../mock/sessions.mock";
import { simulateNetworkDelay } from "./_delay";

export async function getSyncMetrics(sessionId: string): Promise<SyncMetrics | null> {
  await simulateNetworkDelay();
  return syncMetrics.find((m) => m.sessionId === sessionId) ?? null;
}

export async function getSyncTrend(patientId: string): Promise<SyncTrendPoint[]> {
  await simulateNetworkDelay();
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
  await simulateNetworkDelay();
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
