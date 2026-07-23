"use server";

import { apiFetch, USE_API } from "@/lib/api/client";

type SaveRocksBreakFlowResult = { success: true } | { error: string };

export async function saveRocksBreakFlow(
  sessionId: string,
  whatHappened: string,
  facts: string[],
  interpretations: string[],
): Promise<SaveRocksBreakFlowResult> {
  const normalizedWhatHappened = whatHappened.trim();
  const normalizedFacts = facts.map((value) => value.trim()).filter(Boolean);
  const normalizedInterpretations = interpretations
    .map((value) => value.trim())
    .filter(Boolean);

  if (!sessionId.trim()) {
    return { error: "Session ID is required" };
  }

  if (!normalizedWhatHappened) {
    return { error: "What happened is required" };
  }

  if (normalizedFacts.length === 0) {
    return { error: "At least one fact is required" };
  }

  if (normalizedInterpretations.length === 0) {
    return { error: "At least one interpretation is required" };
  }

  try {
    if (USE_API) {
      await apiFetch(`/therapy-sessions/${sessionId}/rocks-break-flow`, {
        method: "POST",
        body: {
          eventTitle: normalizedWhatHappened,
          facts: normalizedFacts,
          thoughts: normalizedInterpretations,
        },
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to save Rocks Flow:", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to save event processing data",
    };
  }
}
