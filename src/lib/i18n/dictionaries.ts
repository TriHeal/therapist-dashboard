import type { PatientStatus, SessionStatus, SessionType, TriggerSeverity, MissionType, MissionStatus } from "@/types";
import { unflatten } from "./unflatten";
import he from "./locales/he.json";
import en from "./locales/en.json";

export type Locale = "he" | "en";
export const LOCALE_COOKIE = "locale";

export type Dictionary = {
  nav: { appName: string; dashboard: string; patients: string; schedule: string; live: string; alerts: string; settings: string };
  common: {
    age: string;
    enrolled: string;
    lastSession: string;
    parentSharing: string;
    enabled: string;
    disabled: string;
    notAvailable: string;
    seconds: string;
    cancel: string;
    save: string;
    close: string;
  };
  patientStatus: Record<PatientStatus, string>;
  sessionStatus: Record<SessionStatus, string>;
  sessionType: Record<SessionType, string>;
  severity: Record<TriggerSeverity, string>;
  patientsPage: {
    title: string;
    description: string;
    searchPlaceholder: string;
    filterAllStatuses: string;
    noResults: string;
  };
  patientTable: { name: string; age: string; status: string; lastSession: string; parentSharing: string };
  patientSubnav: { overview: string; sessions: string; progress: string; missions: string };
  patientOverview: { noCompletedSessions: string; missionsTitle: string; noActiveMissions: string };
  sessionsPage: { noSessions: string };
  syncMetrics: { title: string; breathingSync: string; tapSync: string; timeToSync: string; desyncEvents: string };
  sessionSummary: { timeToSync: string };
  sessionDetail: {
    title: string;
    ediHistory: string;
    triggerKeywords: string;
    parentReflection: string;
    parentEstimatedTime: string;
    note: string;
  };
  edi: { fact: string; interpretation: string; separate: string; step: string; noEvents: string };
  triggerKeywords: { none: string };
  progressPage: {
    title: string;
    syncImprovementTitle: string;
    notEnoughData: string;
    comparisonTitle: string;
  };
  home: {
    title: string;
    description: string;
    activePatients: string;
    sessionsThisWeek: string;
    openAlerts: string;
    upcomingSessions: string;
    noScheduled: string;
    recentAlerts: string;
    noAlertsRecent: string;
    activeMissionsWidget: string;
    noActiveMissions: string;
    viewSchedule: string;
  };
  alertsPage: {
    title: string;
    description: string;
    noAlerts: string;
    markReviewed: string;
    reviewed: string;
    filterAll: string;
    filterUnreviewed: string;
  };
  livePage: {
    title: string;
    description: string;
    noActiveTitle: string;
    noActiveDesc: string;
    startSessionWith: string;
    availablePatients: string;
  };
  liveDetail: {
    title: string;
    sessionLabel: string;
    comingSoonTitle: string;
    comingSoonDesc: string;
    breathingSyncLive: string;
    awaitingConnection: string;
    startSync: string;
    stopSync: string;
    syncing: string;
    ediCurrent: string;
    noActiveStep: string;
    factLabel: string;
    factPlaceholder: string;
    interpretationLabel: string;
    interpretationPlaceholder: string;
    recordFact: string;
    recordInterpretation: string;
    separateButton: string;
    resetStepper: string;
    stepperComplete: string;
    boatProgress: string;
  };
  settingsPage: { title: string; description: string; sharingTitle: string; sharingDesc: string };
  missions: {
    title: string;
    assignNew: string;
    dialogTitle: string;
    dialogDescription: string;
    fieldTitle: string;
    fieldTitlePlaceholder: string;
    fieldType: string;
    fieldTarget: string;
    submit: string;
    progress: string;
    logPractice: string;
    statusActive: string;
    statusCompleted: string;
    statusPaused: string;
    typeRoutine: string;
    typeFloodingPrep: string;
    typeCustom: string;
    noMissions: string;
    completedOn: string;
  } & { status: Record<MissionStatus, string> } & { type: Record<MissionType, string> };
  schedule: { title: string; description: string; noUpcoming: string };
  locale: { hebrew: string; english: string };
  parentNav: { appName: string; home: string; missions: string; reflections: string };
  parentHome: {
    title: string;
    description: string;
    childCard: string;
    activeMissionsTitle: string;
    noActiveMissions: string;
    recentReflectionsTitle: string;
    noReflections: string;
  };
  parentMissionsPage: { title: string; description: string; noMissions: string };
  parentReflectionsPage: { title: string; description: string; noReflections: string };
};

function buildDictionary(flat: Record<string, string>): Dictionary {
  const nested = unflatten(flat) as Omit<Dictionary, "missions"> & {
    missions: Omit<Dictionary["missions"], "status" | "type">;
  };

  return {
    ...nested,
    missions: {
      ...nested.missions,
      status: {
        active: nested.missions.statusActive,
        completed: nested.missions.statusCompleted,
        paused: nested.missions.statusPaused,
      },
      type: {
        routine: nested.missions.typeRoutine,
        "flooding-prep": nested.missions.typeFloodingPrep,
        custom: nested.missions.typeCustom,
      },
    },
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  he: buildDictionary(he),
  en: buildDictionary(en),
};
