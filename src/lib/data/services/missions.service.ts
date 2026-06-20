import type { Mission } from "@/types";
import { missions } from "../mock/missions.mock";
import { simulateNetworkDelay } from "./_delay";

export async function getPatientMissions(patientId: string): Promise<Mission[]> {
  await simulateNetworkDelay();
  return missions
    .filter((m) => m.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getActiveMissionsAcrossPatients(limit = 5): Promise<Mission[]> {
  await simulateNetworkDelay();
  return missions
    .filter((m) => m.status === "active")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
