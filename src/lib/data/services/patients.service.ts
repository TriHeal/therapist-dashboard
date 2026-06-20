import type { Patient } from "@/types";
import { patients } from "../mock/patients.mock";
import { simulateNetworkDelay } from "./_delay";

export async function getPatients(): Promise<Patient[]> {
  await simulateNetworkDelay();
  return patients;
}

export async function getPatient(patientId: string): Promise<Patient | null> {
  await simulateNetworkDelay();
  return patients.find((p) => p.id === patientId) ?? null;
}
