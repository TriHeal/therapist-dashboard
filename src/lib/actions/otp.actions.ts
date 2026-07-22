"use server";

import { apiFetch, USE_API } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export type OtpGenerationResult =
  { code: string; expiresAt: number } | { error: string };

export async function generateChildConnectionCode(
  patientId: string,
): Promise<OtpGenerationResult> {
  const normalizedPatientId = patientId.trim();

  if (!normalizedPatientId) {
    return { error: "Patient ID is required" };
  }

  if (!USE_API) {
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    return { code, expiresAt };
  }

  try {
    return await apiFetch<{ code: string; expiresAt: number }>(
      "/auth/otp/generate",
      {
        method: "POST",
        body: { patientId: normalizedPatientId },
      },
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        error: error.message || "Unable to create child connection code.",
      };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Unable to create child connection code." };
  }
}
