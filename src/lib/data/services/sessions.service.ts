import { apiFetch, USE_API } from "@/lib/api/client";
import type { Session } from "@/types";
import { sessions } from "../mock/sessions.mock";

export async function getPatientSessions(patientId: string): Promise<Session[]> {
  if (USE_API) return apiFetch<Session[]>(`/patients/${patientId}/sessions`);
  return sessions
    .filter((s) => s.patientId === patientId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getSession(sessionId: string): Promise<Session | null> {
  if (USE_API) return apiFetch<Session | null>(`/sessions/${sessionId}`);
  return sessions.find((s) => s.id === sessionId) ?? null;
}

export async function getRecentSessions(limit = 5): Promise<Session[]> {
  if (USE_API) return apiFetch<Session[]>(`/sessions?sort=desc&limit=${limit}`);
  return [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit);
}

export async function getUpcomingSessions(limit = 5): Promise<Session[]> {
  if (USE_API) return apiFetch<Session[]>(`/sessions?status=scheduled&sort=asc&limit=${limit}`);
  return sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .slice(0, limit);
}
