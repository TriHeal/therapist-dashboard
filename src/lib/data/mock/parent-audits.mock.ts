import type { ParentAuditEntry } from "@/types";

// Mutable in-memory mock store (resets on server restart) — stands in for a future
// database table. The server action in lib/actions/parent-audits.actions.ts pushes to this
// array so the parent "Optional Home Journal" flow persists across requests. Seeded with a
// couple of entries for the demo child (p1) so the recent-entries list isn't empty.
export const parentAudits: ParentAuditEntry[] = [
  {
    id: "pa-1",
    patientId: "p1",
    sessionId: "s-p1-1",
    triggerType: "transition",
    syncScore: 62,
    note: "המעבר מהמסך לארוחת ערב היה קשה, אבל המשחק עזר להירגע יחד.",
    loggedAt: "2026-07-06T18:30:00.000Z",
  },
  {
    id: "pa-2",
    patientId: "p1",
    sessionId: "s-p1-2",
    triggerType: "loud-noise",
    syncScore: 78,
    loggedAt: "2026-07-09T19:10:00.000Z",
  },
];

let auditIdCounter = parentAudits.length;

export function nextAuditId() {
  auditIdCounter += 1;
  return `pa-${auditIdCounter}`;
}
