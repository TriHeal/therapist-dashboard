import { apiFetch, USE_API } from "@/lib/api/client";

export type RocksBreakFlowDetails = {
  eventTitle?: string;
  facts?: string[];
  thoughts?: string[];
};

export type LiveSessionActivityRun = {
  id: string;
  patientId: string;
  therapistId: string;
  sessionId: string;
  activityCategory: "clinic" | "practice" | "distress";
  activityType: string;
  status: "active" | "completed";
  startedAt: string;
  completedAt: string | null;
  durationSeconds: number | null;
  details: RocksBreakFlowDetails;
};

export async function getLiveSessionActivityRuns(
  sessionId: string,
): Promise<LiveSessionActivityRun[]> {
  if (!USE_API) return [];

  const runs = await apiFetch<LiveSessionActivityRun[]>(
    `/activities/sessions/${sessionId}/runs`,
  );

  return [...runs].sort(
    (first, second) =>
      new Date(first.startedAt).getTime() -
      new Date(second.startedAt).getTime(),
  );
}

export async function getLiveSessionActivityRun(
  sessionId: string,
  activityId: string,
): Promise<LiveSessionActivityRun | null> {
  const runs = await getLiveSessionActivityRuns(sessionId);

  return runs.find((run) => run.id === activityId) ?? null;
}
