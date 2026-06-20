import type { TriggerKeyword } from "@/types";
import { triggerKeywords } from "../mock/trigger-keywords.mock";
import { simulateNetworkDelay } from "./_delay";

export async function getTriggerKeywordsForSession(sessionId: string): Promise<TriggerKeyword[]> {
  await simulateNetworkDelay();
  return triggerKeywords.filter((kw) => kw.sessionId === sessionId);
}
