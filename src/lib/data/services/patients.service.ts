import { apiFetch, USE_API } from "@/lib/api/client";
import { patients } from "../mock/patients.mock";
import type { Patient } from "@/types";

function mapBackendPatient(bp: any): Patient {
  return {
    id: bp.id,
    displayName: bp.displayName,
    age: bp.age,
    avatarUrl: bp.avatarUrl || undefined,
    status: bp.status,
    primaryTherapistId: bp.therapistId,
    enrolledAt: bp.createdAt ? new Date(bp.createdAt).toISOString() : new Date().toISOString(),
    parentSharingEnabled: true, // Default to true
  };
}

export async function getPatients(): Promise<Patient[]> {
  if (USE_API) {
    const data = await apiFetch<any[]>("/patients");
    return data.map(mapBackendPatient);
  }
  return patients;
}

export async function getPatient(patientId: string): Promise<Patient | null> {
  if (USE_API) {
    const data = await apiFetch<any>(`/patients/${patientId}`);
    return data ? mapBackendPatient(data) : null;
  }
  return patients.find((p) => p.id === patientId) ?? null;
}

