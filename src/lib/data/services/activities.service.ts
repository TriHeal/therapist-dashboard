import { apiFetch, USE_API } from "@/lib/api/client";
import type { Activity } from "@/types";
import { activities } from "../mock/activities.mock";

export async function getPatientActivities(patientId: string): Promise<Activity[]> {
  // Keep under local mock fallback until backend implements them
  // if (USE_API) return apiFetch<Activity[]>(`/patients/${patientId}/activities`);
  return activities
    .filter((m) => m.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getActiveActivitiesAcrossPatients(limit = 5): Promise<Activity[]> {
  // Keep under local mock fallback until backend implements them
  // if (USE_API) return apiFetch<Activity[]>(`/activities?status=active&limit=${limit}`);
  return activities
    .filter((m) => m.status === "active")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
