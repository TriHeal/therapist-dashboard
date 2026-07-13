import { apiFetch, USE_API } from "@/lib/api/client";
import type { EDIStepperEvent } from "@/types";
import { ediEvents } from "../mock/edi-events.mock";

export async function getEdiEventsForSession(sessionId: string): Promise<EDIStepperEvent[]> {
  if (USE_API) return apiFetch<EDIStepperEvent[]>(`/sessions/${sessionId}/edi`);
  return ediEvents
    .filter((e) => e.sessionId === sessionId)
    .sort((a, b) => a.sequence - b.sequence);
}
