import type { Session } from "@/types";
import { sessions } from "../mock/sessions.mock";
import { simulateNetworkDelay } from "./_delay";

export async function getPatientSessions(patientId: string): Promise<Session[]> {
  await simulateNetworkDelay();
  return sessions
    .filter((s) => s.patientId === patientId)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export async function getSession(sessionId: string): Promise<Session | null> {
  await simulateNetworkDelay();
  return sessions.find((s) => s.id === sessionId) ?? null;
}

export async function getRecentSessions(limit = 5): Promise<Session[]> {
  await simulateNetworkDelay();
  return [...sessions]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, limit);
}

export async function getUpcomingSessions(limit = 5): Promise<Session[]> {
  await simulateNetworkDelay();
  return sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .slice(0, limit);
}
