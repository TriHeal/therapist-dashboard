import type { Patient, Activity, ParentReflectionLog } from "@/types";
import { patients } from "../mock/patients.mock";
import { activities } from "../mock/activities.mock";
import { parentReflections } from "../mock/parent-reflections.mock";
import { sessions } from "../mock/sessions.mock";
import { simulateNetworkDelay } from "./_delay";

// The logged-in parent's linked child. No parent<->child account linkage exists in the
// backend yet, so this mocks a single fixed relationship for the demo dashboard.
const MY_CHILD_PATIENT_ID = "p1";

export async function getMyChild(): Promise<Patient | null> {
  await simulateNetworkDelay();
  return patients.find((p) => p.id === MY_CHILD_PATIENT_ID) ?? null;
}

export async function getMyChildActivities(): Promise<Activity[]> {
  await simulateNetworkDelay();
  return activities
    .filter((m) => m.patientId === MY_CHILD_PATIENT_ID)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getMyChildReflections(): Promise<ParentReflectionLog[]> {
  await simulateNetworkDelay();
  const mySessionIds = new Set(
    sessions.filter((s) => s.patientId === MY_CHILD_PATIENT_ID).map((s) => s.id)
  );
  return parentReflections
    .filter((r) => mySessionIds.has(r.sessionId))
    .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
}
