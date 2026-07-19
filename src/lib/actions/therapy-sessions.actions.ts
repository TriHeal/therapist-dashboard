"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { sessions } from "@/lib/data/mock/sessions.mock";
import type { Session } from "@/types";

export async function createTherapySession(
  patientId: string,
  activityTypes: string[],
  notes?: string
): Promise<Session | { error: string }> {
  try {
    let newSession: Session;

    if (USE_API) {
      newSession = await apiFetch<Session>(`/therapy-sessions`, {
        method: "POST",
        body: {
          patientId,
          notes,
          activities: activityTypes.map((type, index) => ({
            type,
            order: index + 1,
          })),
        },
      });
    } else {
      newSession = {
        id: `s-mock-${sessions.length + 1}`,
        patientId,
        type: "clinic",
        status: "in_progress",
        startedAt: new Date().toISOString(),
        ediEventIds: [],
        triggerKeywordIds: [],
        notes,
        activities: activityTypes.map((type, index) => ({
          type,
          order: index + 1,
          status: "pending",
        })),
      };
      sessions.unshift(newSession);
    }

    revalidatePath(`/therapist/patients/${patientId}/sessions`);
    revalidatePath(`/therapist/patients/${patientId}/live`);
    return newSession;
  } catch (err: unknown) {
    console.error("Failed to create therapy session:", err);
    const msg = err instanceof Error ? err.message : "Failed to create therapy session";
    return { error: msg };
  }
}

export async function endTherapySession(
  sessionId: string,
  patientId: string,
  notes?: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    if (USE_API) {
      await apiFetch(`/therapy-sessions/${sessionId}/end`, {
        method: "POST",
      });
    } else {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        return { error: "Session not found" };
      }
      session.status = "completed";
      session.notes = notes;
      session.endedAt = new Date().toISOString();
    }

    revalidatePath(`/therapist/patients/${patientId}/sessions`);
    revalidatePath(`/therapist/patients/${patientId}/live`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to end therapy session:", err);
    const msg = err instanceof Error ? err.message : "Failed to end therapy session";
    return { error: msg };
  }
}
