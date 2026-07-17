import { apiFetch, USE_API } from "@/lib/api/client";
import type { ParentReflectionLog } from "@/types";
import { parentReflections } from "../mock/parent-reflections.mock";

export async function getParentReflectionForSession(
  sessionId: string
): Promise<ParentReflectionLog | null> {
  if (USE_API) return apiFetch<ParentReflectionLog | null>(`/sessions/${sessionId}/reflection`);
  return parentReflections.find((r) => r.sessionId === sessionId) ?? null;
}
