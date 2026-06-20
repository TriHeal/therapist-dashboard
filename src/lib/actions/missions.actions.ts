"use server";

import { revalidatePath } from "next/cache";
import { missions, nextMissionId } from "@/lib/data/mock/missions.mock";
import type { MissionType } from "@/types";

export async function assignMission(formData: FormData) {
  const patientId = String(formData.get("patientId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "routine") as MissionType;
  const targetCount = Number(formData.get("targetCount") ?? 3);

  if (!patientId || !title) return;

  missions.push({
    id: nextMissionId(),
    patientId,
    title,
    type,
    status: "active",
    targetCount: Math.max(1, targetCount),
    completedCount: 0,
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/patients/${patientId}/missions`);
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/");
}

export async function logMissionPractice(formData: FormData) {
  const missionId = String(formData.get("missionId") ?? "");
  const patientId = String(formData.get("patientId") ?? "");
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) return;

  mission.completedCount = Math.min(mission.targetCount, mission.completedCount + 1);
  if (mission.completedCount >= mission.targetCount) {
    mission.status = "completed";
    mission.completedAt = new Date().toISOString();
  }

  revalidatePath(`/patients/${patientId}/missions`);
  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/");
}
