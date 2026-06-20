import type { LiveSessionStub } from "@/types";
import { simulateNetworkDelay } from "./_delay";

// Future seam: replace these mock-backed functions with a SignalR client connection
// (e.g. lib/realtime/signalr-client.ts using @microsoft/signalr) feeding a client-side
// store consumed by the app/live/* Client Components. Call sites and types stay the same.

export async function getActiveLiveSessions(): Promise<LiveSessionStub[]> {
  await simulateNetworkDelay();
  return [];
}

export async function getLiveSession(_sessionId: string): Promise<LiveSessionStub | null> {
  await simulateNetworkDelay();
  return null;
}
