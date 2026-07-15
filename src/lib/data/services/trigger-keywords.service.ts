import { apiFetch, USE_API } from "@/lib/api/client";
import type { TriggerKeyword } from "@/types";
import { triggerKeywords } from "../mock/trigger-keywords.mock";

export async function getTriggerKeywordsForSession(sessionId: string): Promise<TriggerKeyword[]> {
  if (USE_API) return apiFetch<TriggerKeyword[]>(`/sessions/${sessionId}/keywords`);
  return triggerKeywords.filter((kw) => kw.sessionId === sessionId);
}
