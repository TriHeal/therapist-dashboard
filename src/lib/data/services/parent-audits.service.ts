import type { ParentAuditEntry, Session } from "@/types";
import { parentAudits } from "../mock/parent-audits.mock";
import { sessions } from "../mock/sessions.mock";
import { simulateNetworkDelay } from "./_delay";

// The logged-in parent's linked child (mirrors parent.service.ts). No real parent<->child
// account linkage exists yet, so this is a fixed demo relationship.
const MY_CHILD_PATIENT_ID = "p1";

export async function getMyChildAudits(): Promise<ParentAuditEntry[]> {
  return getPatientAudits(MY_CHILD_PATIENT_ID);
}

// Therapist-side read (Clinical Insights): all audit entries for a given patient, newest
// first. Returns [] for patients with no parent journal entries.
export async function getPatientAudits(patientId: string): Promise<ParentAuditEntry[]> {
  await simulateNetworkDelay();
  return parentAudits
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
}

// Gates access to the audit form (AC #1: available only after a completed home game
// session) and supplies the sessionId to link the new entry to. "Home game session" =
// a completed session that isn't an in-clinic one.
export async function getMyChildLatestCompletedSession(): Promise<Session | null> {
  await simulateNetworkDelay();
  const completedHomeSessions = sessions
    .filter(
      (s) =>
        s.patientId === MY_CHILD_PATIENT_ID &&
        s.status === "completed" &&
        s.type !== "clinic"
    )
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  return completedHomeSessions[0] ?? null;
}
