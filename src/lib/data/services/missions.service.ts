import { apiFetch, USE_API } from "@/lib/api/client";
import type { Mission } from "@/types";
import { missions } from "../mock/missions.mock";

export async function getPatientMissions(patientId: string): Promise<Mission[]> {
  if (USE_API) return apiFetch<Mission[]>(`/patients/${patientId}/missions`);
  return missions
    .filter((m) => m.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getActiveMissionsAcrossPatients(limit = 5): Promise<Mission[]> {
  if (USE_API) return apiFetch<Mission[]>(`/missions?status=active&limit=${limit}`);
  return missions
    .filter((m) => m.status === "active")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
