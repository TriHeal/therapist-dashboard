"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { activities, nextActivityId } from "@/lib/data/mock/activities.mock";
import type { ActivityType } from "@/types";

export async function assignActivity(formData: FormData) {
  const patientId = String(formData.get("patientId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "routine") as ActivityType;
  const targetCount = Number(formData.get("targetCount") ?? 3);

  if (!patientId || !title) return;

  if (USE_API) {
    try {
      await apiFetch(`/activities`, {
        method: "POST",
        body: { patientId, title, type, targetCount: Math.max(1, targetCount) },
      });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 501)) {
        console.warn("Failed to assign activity via API, falling back to mock database:", err);
        activities.push({
          id: nextActivityId(),
          patientId,
          title,
          type,
          status: "active",
          targetCount: Math.max(1, targetCount),
          completedCount: 0,
          createdAt: new Date().toISOString(),
        });
      } else {
        throw err;
      }
    }
  } else {
    activities.push({
      id: nextActivityId(),
      patientId,
      title,
      type,
      status: "active",
      targetCount: Math.max(1, targetCount),
      completedCount: 0,
      createdAt: new Date().toISOString(),
    });
  }

  revalidatePath(`/patients/${patientId}/activities`);
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/");
}

export async function logActivityPractice(formData: FormData) {
  const missionId = String(formData.get("missionId") ?? "");
  const patientId = String(formData.get("patientId") ?? "");
  
  if (USE_API) {
    try {
      await apiFetch(`/activities/${missionId}/log-practice`, {
        method: "POST",
      });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 404 || err.status === 501)) {
        console.warn("Failed to log activity practice via API, falling back to mock database:", err);
        const activity = activities.find((m) => m.id === missionId);
        if (!activity) return;

        activity.completedCount = Math.min(activity.targetCount, activity.completedCount + 1);
        if (activity.completedCount >= activity.targetCount) {
          activity.status = "completed";
          activity.completedAt = new Date().toISOString();
        }
      } else {
        throw err;
      }
    }
  } else {
    const activity = activities.find((m) => m.id === missionId);
    if (!activity) return;

    activity.completedCount = Math.min(activity.targetCount, activity.completedCount + 1);
    if (activity.completedCount >= activity.targetCount) {
      activity.status = "completed";
      activity.completedAt = new Date().toISOString();
    }
  }

  revalidatePath(`/patients/${patientId}/activities`);
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/");
}
