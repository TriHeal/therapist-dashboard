"use server";

import { apiFetch, USE_API } from "@/lib/api/client";
import { activationCodes } from "@/lib/data/mock/session-codes.mock";
import { generateNumericCode } from "@/lib/crypto/codes";

const CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export type GenerateSessionCodeResult =
  | { code: string; expiresAt: string }
  | { error: "MISSING_PATIENT" | "GENERATE_FAILED" };

export async function generateSessionCode(input: {
  patientId: string;
}): Promise<GenerateSessionCodeResult> {
  const patientId = (input.patientId ?? "").trim();
  if (!patientId) return { error: "MISSING_PATIENT" };

  try {
    if (USE_API) {
      // Backend persists the code against the account with an expiry and invalidates
      // any prior active code for this patient. Returns { code, expiresAt }.
      return await apiFetch<{ code: string; expiresAt: string }>(
        `/patients/${patientId}/activation-code`,
        { method: "POST" }
      );
    }

    // Mock: invalidate any prior active code for this patient, then mint a new one.
    const now = Date.now();
    for (const c of activationCodes) {
      if (c.patientId === patientId && c.status === "active") c.status = "expired";
    }
    const createdAt = new Date(now).toISOString();
    const expiresAt = new Date(now + CODE_TTL_MS).toISOString();
    const code = generateNumericCode(6);
    activationCodes.unshift({
      code,
      patientId,
      purpose: "activation",
      createdAt,
      expiresAt,
      status: "active",
    });
    return { code, expiresAt };
  } catch (err) {
    console.error("Failed to generate session code:", err);
    return { error: "GENERATE_FAILED" };
  }
}
