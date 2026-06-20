import type { EDIStepperEvent } from "@/types";
import { ediEvents } from "../mock/edi-events.mock";
import { simulateNetworkDelay } from "./_delay";

export async function getEdiEventsForSession(sessionId: string): Promise<EDIStepperEvent[]> {
  await simulateNetworkDelay();
  return ediEvents
    .filter((e) => e.sessionId === sessionId)
    .sort((a, b) => a.sequence - b.sequence);
}
