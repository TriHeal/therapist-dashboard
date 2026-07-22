import type { Session } from "@/types/auth";
import { Role } from "@/types/auth";

export const SESSION_COOKIE = "session";
export const PARENT_DEMO_SESSION_COOKIE = "parent_demo_session";
export const PARENT_PATIENT_COOKIE = "parent_patient";

function isRole(value: unknown): value is Role {
  return value === Role.Therapist || value === Role.Parent || value === Role.Child;
}

/**
 * Decodes the role/uid claims out of a Firebase ID token without verifying
 * its signature. Signature verification happens server-side in backend-heal
 * (FirebaseAuthGuard); this decode is only used for client-side route
 * gating (proxy.ts), not for authorizing API calls.
 */
export function decodeSession(idToken: string): Session | null {
  try {
    const [, payload] = idToken.split(".");
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    if (typeof json.user_id !== "string" && typeof json.sub !== "string") return null;
    if (!isRole(json.role)) return null;
    return { uid: json.user_id ?? json.sub, role: json.role };
  } catch {
    return null;
  }
}
