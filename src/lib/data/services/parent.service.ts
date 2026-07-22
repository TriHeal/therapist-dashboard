import { cookies } from "next/headers";
import { PARENT_PATIENT_COOKIE } from "@/lib/auth/session";
import type { Patient, Activity, ParentReflectionLog } from "@/types";
import { activities } from "../mock/activities.mock";
import { parentReflections } from "../mock/parent-reflections.mock";
import { sessions } from "../mock/sessions.mock";
import { simulateNetworkDelay } from "./_delay";

type ConnectedChild = Pick<Patient, "id" | "displayName" | "age" | "avatarUrl">;

const MOCK_SOURCE_PATIENT_ID = "p1";

async function readConnectedChild(): Promise<ConnectedChild | null> {
  const encodedPatient = (await cookies()).get(PARENT_PATIENT_COOKIE)?.value;

  if (!encodedPatient) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(encodedPatient, "base64url").toString("utf8"),
    ) as ConnectedChild;
  } catch {
    return null;
  }
}

export async function getMyChild(): Promise<ConnectedChild | null> {
  await simulateNetworkDelay();
  return readConnectedChild();
}

export async function getMyChildActivities(): Promise<Activity[]> {
  await simulateNetworkDelay();

  const child = await readConnectedChild();

  if (!child) {
    return [];
  }

  return activities
    .filter((activity) => activity.patientId === MOCK_SOURCE_PATIENT_ID)
    .map((activity) => ({
      ...activity,
      patientId: child.id,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export async function getMyChildReflections(): Promise<ParentReflectionLog[]> {
  await simulateNetworkDelay();

  const child = await readConnectedChild();

  if (!child) {
    return [];
  }

  const mockSessionIds = new Set(
    sessions
      .filter((session) => session.patientId === MOCK_SOURCE_PATIENT_ID)
      .map((session) => session.id),
  );

  return parentReflections
    .filter((reflection) => mockSessionIds.has(reflection.sessionId))
    .sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
    );
}
