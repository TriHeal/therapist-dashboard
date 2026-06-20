import type { Mission } from "@/types";
import { patients } from "./patients.mock";

// Mutable in-memory mock store (resets on server restart) — stands in for a future
// database table. Server actions in lib/actions/missions.actions.ts mutate this array
// directly so the demo flows (assign mission, log practice) feel real across requests.
export const missions: Mission[] = patients
  .filter((p) => p.status === "active")
  .flatMap((patient, idx) => {
    const created: Mission[] = [
      {
        id: `m-${patient.id}-1`,
        patientId: patient.id,
        title: "3 הפלגות שבועיות של 5 דקות",
        type: "routine",
        status: "active",
        targetCount: 3,
        completedCount: idx % 3,
        createdAt: patient.enrolledAt,
      },
    ];
    if (idx % 2 === 0) {
      created.push({
        id: `m-${patient.id}-2`,
        patientId: patient.id,
        title: "תרגול היכונות לרעשים פתאומיים",
        type: "flooding-prep",
        status: idx % 4 === 0 ? "completed" : "active",
        targetCount: 4,
        completedCount: idx % 4 === 0 ? 4 : 2,
        createdAt: patient.enrolledAt,
        completedAt: idx % 4 === 0 ? patient.lastSessionAt : undefined,
      });
    }
    return created;
  });

let missionIdCounter = missions.length + 1;

export function nextMissionId() {
  missionIdCounter += 1;
  return `m-custom-${missionIdCounter}`;
}
