import { apiFetch, USE_API } from "@/lib/api/client";
import { patients } from "../mock/patients.mock";
import type { Patient } from "@/types";

function parseBackendDate(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === "object" && (val._seconds !== undefined || val.seconds !== undefined)) {
    const secs = val._seconds ?? val.seconds;
    return new Date(secs * 1000).toISOString();
  }
  return new Date(val).toISOString();
}

function mapBackendPatient(bp: any): Patient {
  return {
    id: bp.id,
    displayName: bp.displayName,
    age: bp.age,
    sex: bp.sex ?? "unspecified",
    avatarUrl: bp.avatarUrl ?? null,
    status: bp.status ?? "active",
    primaryTherapistId: bp.therapistId,
    enrolledAt: parseBackendDate(bp.createdAt),
    parentSharingEnabled: bp.parentSharingEnabled ?? false,
    parentIds: bp.parentIds ?? [],
    childUid: bp.childUid ?? null,
    createdAt: parseBackendDate(bp.createdAt),
    updatedAt: parseBackendDate(bp.updatedAt),
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

