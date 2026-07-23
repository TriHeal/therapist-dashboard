"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { sessions } from "@/lib/data/mock/sessions.mock";

type StartActivityActionResult =
  { success: true; activityId: string } | { error: string };

type StopActivityActionResult = { success: true } | { error: string };

function revalidateSessionPages(patientId: string) {
  revalidatePath(`/therapist/patients/${patientId}/live`);
  revalidatePath(`/therapist/patients/${patientId}/sessions`);
}

export async function startLiveSessionActivity(
  sessionId: string,
  patientId: string,
  activityType: string,
): Promise<StartActivityActionResult> {
  try {
    let activityId: string;
    if (USE_API) {
      const activity = await apiFetch<{ id: string }>(
        `/activities/sessions/${sessionId}/start`,
        {
          method: "POST",
          body: {
            activityType,
            activityCategory: "clinic",
          },
        },
      );

      activityId = activity.id;
    } else {
      const session = sessions.find(
        (item) => item.id === sessionId && item.patientId === patientId,
      );

      if (!session) return { error: "Session not found" };

      if (
        session.activities?.some((activity) => activity.status === "active")
      ) {
        return { error: "Another activity is already active" };
      }

      const activity = session.activities?.find(
        (item) => item.type === activityType,
      );

      if (!activity) return { error: "Activity not found" };
      if (activity.status !== "pending") {
        return { error: "Activity has already been started" };
      }

      activity.status = "active";
      activityId = `activity-mock-${Date.now()}`;
    }

    revalidateSessionPages(patientId);
    return { success: true, activityId };
  } catch (error: unknown) {
    console.error("Failed to start live-session activity:", error);

    return {
      error:
        error instanceof Error ? error.message : "Unable to start activity",
    };
  }
}

export async function stopLiveSessionActivity(
  sessionId: string,
  patientId: string,
): Promise<StopActivityActionResult> {
  try {
    if (USE_API) {
      await apiFetch(`/activities/sessions/${sessionId}/stop`, {
        method: "POST",
        body: {},
      });
    } else {
      const session = sessions.find(
        (item) => item.id === sessionId && item.patientId === patientId,
      );

      if (!session) return { error: "Session not found" };

      const activity = session.activities?.find(
        (item) => item.status === "active",
      );

      if (!activity) return { error: "No activity is currently active" };

      activity.status = "completed";
    }

    revalidateSessionPages(patientId);
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to stop live-session activity:", error);

    return {
      error: error instanceof Error ? error.message : "Unable to stop activity",
    };
  }
}
