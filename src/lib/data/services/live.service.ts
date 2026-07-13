import { ref, get } from "firebase/database";
import { getDb } from "@/lib/firebase/rtdb";
import type { LiveSessionStub } from "@/types";

const USE_RTDB = !!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

export async function getActiveLiveSessions(): Promise<LiveSessionStub[]> {
  if (!USE_RTDB) return [];

  const snapshot = await get(ref(getDb(), "liveSessions"));
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  const sessions: LiveSessionStub[] = Object.values(data);
  return sessions.filter(s => s.status === "active");
}

export async function getLiveSession(sessionId: string): Promise<LiveSessionStub | null> {
  if (!USE_RTDB) return null;

  const snapshot = await get(ref(getDb(), `liveSessions/${sessionId}`));
  if (!snapshot.exists()) return null;

  return snapshot.val() as LiveSessionStub;
}
