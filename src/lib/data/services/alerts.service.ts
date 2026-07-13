import { apiFetch, USE_API } from "@/lib/api/client";
import type { FlaggedAlert } from "@/types";
import { triggerKeywords } from "../mock/trigger-keywords.mock";
import { sessions } from "../mock/sessions.mock";
import { patients } from "../mock/patients.mock";

export async function getFlaggedKeywordAlerts(opts?: { sinceDays?: number }): Promise<FlaggedAlert[]> {
  if (USE_API) {
    const query = opts?.sinceDays ? `?sinceDays=${opts.sinceDays}` : "";
    return apiFetch<FlaggedAlert[]>(`/alerts${query}`);
  }

  const cutoff = opts?.sinceDays
    ? Date.now() - opts.sinceDays * 24 * 60 * 60 * 1000
    : null;

  return triggerKeywords
    .filter((kw) => !cutoff || new Date(kw.flaggedAt).getTime() >= cutoff)
    .map((kw) => {
      const session = sessions.find((s) => s.id === kw.sessionId);
      const patient = session ? patients.find((p) => p.id === session.patientId) : undefined;
      return {
        ...kw,
        patientId: patient?.id ?? "unknown",
        patientName: patient?.displayName ?? "Unknown",
      };
    })
    .sort((a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime());
}
