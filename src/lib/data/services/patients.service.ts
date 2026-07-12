import { apiFetch, USE_API } from "@/lib/api/client";
import { patients } from "../mock/patients.mock";
import type { Patient } from "@/types";

export async function getPatients(): Promise<Patient[]> {
  if (USE_API) return apiFetch<Patient[]>("/patients");
  return patients;
}

export async function getPatient(patientId: string): Promise<Patient | null> {
  if (USE_API) return apiFetch<Patient | null>(`/patients/${patientId}`);
  return patients.find((p) => p.id === patientId) ?? null;
}
