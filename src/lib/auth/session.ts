import { Role } from "@/types/auth";

export const SESSION_COOKIE = "session";
export const ROLE_COOKIE = "role";

export function isRole(value: unknown): value is Role {
  return value === Role.Therapist || value === Role.Parent || value === Role.Child;
}

/**
 * Extracts the Firebase uid from an ID token payload without verifying its
 * signature (the backend's FirebaseAuthGuard does the real verification).
 *
 * NOTE: the user's ROLE is intentionally NOT read from the token. backend-heal
 * does not set a role custom claim — it returns the role in the /auth/login
 * response, which we persist in a separate `role` cookie (see /api/session).
 * So token decoding here only needs the uid.
 *
 * Uses Buffer, so it must run in the Node runtime (the /api/session route) —
 * it is never called from the Edge proxy.
 */
export function getTokenUid(idToken: string): string | null {
  try {
    const [, payload] = idToken.split(".");
    if (!payload) return null;
    const json = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
    const uid = json.user_id ?? json.sub;
    return typeof uid === "string" ? uid : null;
  } catch {
    return null;
  }
}
