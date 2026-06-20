import type {
  Session,
  SessionType,
  SyncMetrics,
  EDIStepperEvent,
  TriggerKeyword,
  ParentReflectionLog,
} from "@/types";
import { patients } from "./patients.mock";

// Deterministic pseudo-random generator (mulberry32) so mock data is stable across reloads.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FACTS = [
  "החברה שלי לא ענתה להודעה",
  "אזעקת האש נשמעה בבית הספר",
  "אמא הרימה את הקול בזמן הארוחה",
  "הפלתי את המגש בקפיטריה",
  "הכלב נבח בקול רם בבית השכן",
  "אבא יצא לעבודה מוקדם",
];
const INTERPRETATIONS = [
  "אף אחד לא אוהב אותי",
  "קורה משהו רע",
  "היא כועסת עליי לתמיד",
  "כולם צוחקים עליי",
  "זה אומר שמתקרבת סכנה",
  "הוא עוזב ולא יחזור",
];
const KEYWORD_CATEGORIES: { keyword: string; category: string }[] = [
  { keyword: "רעש חזק", category: "רעש חזק" },
  { keyword: "הרמת קול", category: "דמות סמכות" },
  { keyword: "פרידה", category: "חרדת נטישה" },
  { keyword: "תנועה פתאומית", category: "הבהלה" },
  { keyword: "קהל", category: "חברתי" },
];

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

type SeedResult = {
  sessions: Session[];
  syncMetrics: SyncMetrics[];
  ediEvents: EDIStepperEvent[];
  triggerKeywords: TriggerKeyword[];
  parentReflections: ParentReflectionLog[];
};

function buildSeed(): SeedResult {
  const sessions: Session[] = [];
  const syncMetrics: SyncMetrics[] = [];
  const ediEvents: EDIStepperEvent[] = [];
  const triggerKeywords: TriggerKeyword[] = [];
  const parentReflections: ParentReflectionLog[] = [];

  patients.forEach((patient, pIdx) => {
    const rand = mulberry32(1000 + pIdx * 37);
    const sessionCount = 5 + Math.floor(rand() * 5); // 5-9 sessions
    let cursorDate = patient.enrolledAt;
    // baseline sync improving over time
    let baseBreathing = 35 + Math.floor(rand() * 10);
    let baseTap = 30 + Math.floor(rand() * 10);

    for (let i = 0; i < sessionCount; i++) {
      cursorDate = addDays(cursorDate, 4 + Math.floor(rand() * 5));
      const isLast = i === sessionCount - 1;
      const typeRoll = rand();
      const type: SessionType =
        i === 0 ? "clinic" : typeRoll < 0.4 ? "clinic" : typeRoll < 0.75 ? "routine" : "flooding";
      const status: Session["status"] =
        isLast && patient.status === "active" ? "scheduled" : "completed";

      const sessionId = `s-${patient.id}-${i + 1}`;
      baseBreathing = Math.min(95, baseBreathing + Math.floor(rand() * 8));
      baseTap = Math.min(95, baseTap + Math.floor(rand() * 7));
      const timeToSync = Math.max(8, 90 - i * 6 - Math.floor(rand() * 10));

      const ediIdsForSession: string[] = [];
      const keywordIdsForSession: string[] = [];
      let parentReflectionId: string | undefined;

      if (status === "completed") {
        if (type === "clinic") {
          const cycles = 1 + Math.floor(rand() * 2);
          for (let c = 0; c < cycles; c++) {
            const factIdx = Math.floor(rand() * FACTS.length);
            const factEventId = `edi-${sessionId}-${c}-fact`;
            const interpEventId = `edi-${sessionId}-${c}-interp`;
            const sepEventId = `edi-${sessionId}-${c}-sep`;
            const factTime = addDays(cursorDate, 0);
            ediEvents.push({
              id: factEventId,
              sessionId,
              sequence: c * 3 + 1,
              phase: "fact",
              factText: FACTS[factIdx],
              completedAt: factTime,
            });
            ediEvents.push({
              id: interpEventId,
              sessionId,
              sequence: c * 3 + 2,
              phase: "interpretation",
              factText: FACTS[factIdx],
              interpretationText: INTERPRETATIONS[Math.floor(rand() * INTERPRETATIONS.length)],
              completedAt: factTime,
            });
            ediEvents.push({
              id: sepEventId,
              sessionId,
              sequence: c * 3 + 3,
              phase: "separate",
              factText: FACTS[factIdx],
              interpretationText: INTERPRETATIONS[Math.floor(rand() * INTERPRETATIONS.length)],
              separatedAt: factTime,
              completedAt: factTime,
            });
            ediIdsForSession.push(factEventId, interpEventId, sepEventId);
          }
        }

        if (type !== "clinic" && rand() < 0.6) {
          const numKw = 1 + Math.floor(rand() * 2);
          for (let k = 0; k < numKw; k++) {
            const kw = KEYWORD_CATEGORIES[Math.floor(rand() * KEYWORD_CATEGORIES.length)];
            const kwId = `kw-${sessionId}-${k}`;
            const severity = type === "flooding" ? (rand() < 0.5 ? "high" : "medium") : "low";
            triggerKeywords.push({
              id: kwId,
              sessionId,
              keyword: kw.keyword,
              category: kw.category,
              flaggedAt: cursorDate,
              severity,
              reviewed: rand() < 0.3,
            });
            keywordIdsForSession.push(kwId);
          }
        }

        if (type !== "clinic") {
          parentReflectionId = `pr-${sessionId}`;
          parentReflections.push({
            id: parentReflectionId,
            sessionId,
            loggedAt: addDays(cursorDate, 0),
            whatHappened:
              type === "flooding"
                ? "הילד/ה נבהל/ה והלכנו ישר לסירה ביחד עד שהתאזן/ה."
                : "עשינו את הפלגת התרגול הרגילה שלנו ביחד לפני השינה.",
            timeToSyncEstimateSeconds: timeToSync + Math.floor(rand() * 15),
            parentNotes: rand() < 0.4 ? "הרגיש קל יותר מבפעם הקודמת." : undefined,
          });
        }

        const metricsId = `sm-${sessionId}`;
        syncMetrics.push({
          id: metricsId,
          sessionId,
          breathingSyncPercent: baseBreathing,
          tapSyncPercent: baseTap,
          timeToSyncSeconds: timeToSync,
          syncAttempts: 2 + Math.floor(rand() * 4),
          desyncEvents: Math.floor(rand() * 3),
          samples: Array.from({ length: 6 }, (_, sIdx) => ({
            tSeconds: sIdx * 15,
            syncPercent: Math.min(100, Math.max(0, baseBreathing - 20 + sIdx * 6 + Math.floor(rand() * 10))),
          })),
        });

        sessions.push({
          id: sessionId,
          patientId: patient.id,
          type,
          status,
          startedAt: cursorDate,
          endedAt: addDays(cursorDate, 0),
          durationSeconds: 300 + Math.floor(rand() * 600),
          timeToSyncSeconds: timeToSync,
          syncMetricsId: metricsId,
          ediEventIds: ediIdsForSession,
          triggerKeywordIds: keywordIdsForSession,
          parentReflectionId,
        });
      } else {
        sessions.push({
          id: sessionId,
          patientId: patient.id,
          type,
          status,
          startedAt: cursorDate,
          ediEventIds: [],
          triggerKeywordIds: [],
        });
      }
    }
  });

  return { sessions, syncMetrics, ediEvents, triggerKeywords, parentReflections };
}

export const seed = buildSeed();
