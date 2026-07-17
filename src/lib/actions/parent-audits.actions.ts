"use server";

import { revalidatePath } from "next/cache";
import { parentAudits, nextAuditId } from "@/lib/data/mock/parent-audits.mock";
import { TRIGGER_TYPES, type TriggerType } from "@/types";

// The logged-in parent's linked child (mirrors parent.service.ts).
const MY_CHILD_PATIENT_ID = "p1";

export async function submitParentAudit(formData: FormData): Promise<{ ok: boolean }> {
  const triggerType = String(formData.get("triggerType") ?? "");
  const syncScore = Number(formData.get("syncScore") ?? NaN);
  const note = String(formData.get("note") ?? "").trim();
  const sessionId = String(formData.get("sessionId") ?? "") || undefined;

  // Trigger Type and Sync Score are mandatory (AC #2); the note is optional (AC #3).
  // Return { ok: false } (rather than a silent void) so the client can surface feedback.
  if (!TRIGGER_TYPES.includes(triggerType as TriggerType)) return { ok: false };
  if (Number.isNaN(syncScore)) return { ok: false };

  parentAudits.push({
    id: nextAuditId(),
    patientId: MY_CHILD_PATIENT_ID,
    sessionId,
    triggerType: triggerType as TriggerType,
    syncScore: Math.min(100, Math.max(0, syncScore)),
    note: note || undefined,
    loggedAt: new Date().toISOString(),
  });

  revalidatePath("/parent/audit");
  revalidatePath("/parent");
  // Surface the new entry on the therapist's Clinical Insights (Progress) page (AC #4).
  revalidatePath(`/therapist/patients/${MY_CHILD_PATIENT_ID}/progress`);
  revalidatePath(`/therapist/patients/${MY_CHILD_PATIENT_ID}`);
  return { ok: true };
}
