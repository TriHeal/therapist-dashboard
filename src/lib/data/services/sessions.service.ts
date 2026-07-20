import { apiFetch, USE_API } from "@/lib/api/client";
import type { Session } from "@/types";
import { sessions } from "../mock/sessions.mock";

function parseBackendDate(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === "object" && (val._seconds !== undefined || val.seconds !== undefined)) {
    const secs = val._seconds ?? val.seconds;
    return new Date(secs * 1000).toISOString();
  }
  return new Date(val).toISOString();
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function mapBackendSession(s: any): Session {
  return {
    id: s.id,
    patientId: s.patientId,
    type: "clinic", // Default type since backend doesn't have it
    status: s.status === "active" ? "in_progress" : "completed",
    startedAt: parseBackendDate(s.createdAt),
    endedAt: (s.status === "ended" || s.status === "completed") ? parseBackendDate(s.updatedAt || s.endedAt) : undefined,
    ediEventIds: [],
    triggerKeywordIds: [],
    notes: s.notes,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    activities: s.activities ? s.activities.map((act: any) => ({
      type: act.type,
      order: Number(act.order),
      status: act.status
    })) : undefined
  };
}

export async function getPatientSessions(patientId: string): Promise<Session[]> {
  if (USE_API) {
    const data = await apiFetch<any[]>("/therapy-sessions");
    return data
      .map(mapBackendSession)
      .filter((s) => s.patientId === patientId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }
  return sessions
    .filter((s) => s.patientId === patientId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getSession(sessionId: string): Promise<Session | null> {
  if (USE_API) {
    const data = await apiFetch<any>(`/therapy-sessions/${sessionId}`);
    return data ? mapBackendSession(data) : null;
  }
  return sessions.find((s) => s.id === sessionId) ?? null;
}

export async function getRecentSessions(limit = 5): Promise<Session[]> {
  if (USE_API) {
    const data = await apiFetch<any[]>("/therapy-sessions");
    return data
      .map(mapBackendSession)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }
  return [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit);
}

export async function getUpcomingSessions(limit = 5): Promise<Session[]> {
  if (USE_API) return [];
  return sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .slice(0, limit);
}

