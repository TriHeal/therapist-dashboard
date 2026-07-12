// Parent-submitted "Optional Home Journal" audit (ticket TH-116). A quick post-session
// check-in a parent fills out after a home game session. Deliberately NOT named "EDI" in
// code: "EDI" already refers to the therapist's Fact/Interpretation/Separate stepper
// (see edi-stepper.ts).

export const TRIGGER_TYPES = ["loud-noise", "transition", "demand", "other"] as const;
export type TriggerType = (typeof TRIGGER_TYPES)[number];

export type ParentAuditEntry = {
  id: string;
  patientId: string;
  sessionId?: string; // the completed home session this entry follows (mirrors ParentReflectionLog)
  triggerType: TriggerType; // mandatory (AC #2)
  syncScore: number; // mandatory 0–100 (AC #2), same 0–100 scale as SyncMetrics.*SyncPercent
  note?: string; // optional free text (AC #3)
  loggedAt: string; // ISO timestamp
};
