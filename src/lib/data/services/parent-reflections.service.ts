import type { ParentReflectionLog } from "@/types";
import { parentReflections } from "../mock/parent-reflections.mock";
import { simulateNetworkDelay } from "./_delay";

export async function getParentReflectionForSession(
  sessionId: string
): Promise<ParentReflectionLog | null> {
  await simulateNetworkDelay();
  return parentReflections.find((r) => r.sessionId === sessionId) ?? null;
}
