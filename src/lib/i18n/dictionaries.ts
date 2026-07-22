import type {
  PatientStatus,
  SessionStatus,
  SessionType,
  TriggerSeverity,
  ActivityType,
  ActivityStatus,
  TriggerType,
} from "@/types";
import { unflatten } from "./unflatten";
import he from "./locales/he.json";
import en from "./locales/en.json";

export type Locale = "he" | "en";
export const LOCALE_COOKIE = "locale";

export type Dictionary = {
  nav: {
    appName: string;
    dashboard: string;
    patients: string;
    schedule: string;
    live: string;
    alerts: string;
    settings: string;
    logout: string;
  };
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
    edit: string;
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
  patientTable: {
    name: string;
    age: string;
    status: string;
    lastSession: string;
    parentSharing: string;
  };
  patientForm: {
    dialogDescription: string;
    fullName: string;
    fullNamePlaceholder: string;
    age: string;
    agePlaceholder: string;
    sex: string;
    sexMale: string;
    sexFemale: string;
    sexUnspecified: string;
    parentSharingEnabled: string;
  };
  patientSubnav: {
    overview: string;
    sessions: string;
    timeline: string;
    progress: string;
    activities: string;
  };
  sessionsTable: {
    id: string;
    date: string;
    type: string;
    status: string;
    activities: string;
    notes: string;
    newSession: string;
    noSessions: string;
  };
  newSessionDialog: {
    title: string;
    description: string;
    date: string;
    notes: string;
    selectActivities: string;
    submit: string;
    breathing: string;
    event_processing: string;
    memory_lake: string;
    bonding_forest: string;
    leaf_on_water: string;
  };
  patientOverview: {
    noCompletedSessions: string;
    missionsTitle: string;
    noActiveActivities: string;
    childConnected?: string;
    childNotConnected?: string;
  };
  parentSection: {
    sectionTitle: string;
    emptyDescription: string;
    addButton: string;
    linkedCountLabel: string;
    linkedCountHelp: string;
    relationshipLabels: {
      mother: string;
      father: string;
      guardian: string;
      other: string;
    };
    accessEnabled: string;
    accessDisabled: string;
    accountLinked: string;
    invited: string;
    waitingForActivation: string;
    resendInvitation: string;
    resendingInvitation: string;
    resendSuccess: string;
    resendError: string;
    editTitle: string;
    editDescription: string;
    saveError: string;
  };
  addParent: {
    dialogTitle: string;
    dialogDescription: string;
    fields: {
      fullName: string;
      fullNamePlaceholder?: string;
      relationship: string;
      email: string;
      emailPlaceholder?: string;
      phone: string;
      phonePlaceholder?: string;
      requestAppAccess: string;
    };
  };
  sessionsPage: { noSessions: string };
  syncMetrics: {
    title: string;
    breathingSync: string;
    tapSync: string;
    timeToSync: string;
    desyncEvents: string;
    explanations: {
      breathingSync: string;
      tapSync: string;
      timeToSync: string;
      desyncEvents: string;
    };
    status: {
      stable: string;
      needsPractice: string;
      attention: string;
    };
  };
  syncMetricsInsights: {
    breathingHigh: string;
    breathingLow: string;
    timeToSyncFast: string;
    timeToSyncSlow: string;
    desyncHigh: string;
    overallGood: string;
  };
  sessionSummary: { timeToSync: string };
  sessionDetail: {
    title: string;
    ediHistory: string;
    triggerKeywords: string;
    parentReflection: string;
    parentEstimatedTime: string;
    note: string;
  };
  edi: {
    fact: string;
    interpretation: string;
    separate: string;
    step: string;
    noEvents: string;
  };
  triggerKeywords: { none: string };
  progressPage: {
    title: string;
    syncImprovementTitle: string;
    notEnoughData: string;
    comparisonTitle: string;
    auditTrendTitle: string;
    auditScoreLabel: string;
    auditListTitle: string;
    noAudits: string;
  };
  home: {
    title: string;
    description: string;
    addPatient: string;
    activePatients: string;
    sessionsThisWeek: string;
    openAlerts: string;
    upcomingSessions: string;
    noScheduled: string;
    recentAlerts: string;
    noAlertsRecent: string;
    activeActivitiesWidget: string;
    noActiveActivities: string;
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
  settingsPage: {
    title: string;
    description: string;
    sharingTitle: string;
    sharingDesc: string;
  };
  activities: {
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
    noActivities: string;
    completedOn: string;
  } & { status: Record<ActivityStatus, string> } & {
    type: Record<ActivityType, string>;
  };
  schedule: { title: string; description: string; noUpcoming: string };
  locale: { hebrew: string; english: string };
  parentNav: {
    appName: string;
    home: string;
    activities: string;
    reflections: string;
    audit: string;
  };
  parentHome: {
    title: string;
    description: string;
    childCard: string;
    activeActivitiesTitle: string;
    viewActivities: string;
    noActiveActivities: string;
    recentReflectionsTitle: string;
    noReflections: string;
  };
  parentAuth: {
    activateTitle: string;
    activateDescription: string;
    activationCode: string;
    activationSubmit: string;
    activating: string;
    activationFailed: string;
    setPasswordTitle: string;
    setPasswordDescription: string;
    loginTitle: string;
    loginDescription: string;
    email: string;
    password: string;
    confirmPassword: string;
    submit: string;
    loginSubmit: string;
    loggingIn: string;
    invalidEmail: string;
    passwordTooShort: string;
    passwordsMustMatch: string;
    invalidCredentials: string;
    noProfileFound: string;
    savePasswordError: string;
    saving: string;
  };
  parentActivitiesPage: {
    title: string;
    description: string;
    noActivities: string;
  };
  parentReflectionsPage: {
    title: string;
    description: string;
    noReflections: string;
  };
  parentAuditPage: {
    title: string;
    description: string;
    noCompletedSession: string;
    triggerLabel: string;
    triggerTypes: Record<TriggerType, string>;
    scoreLabel: string;
    scoreLow: string;
    scoreHigh: string;
    noteLabel: string;
    noteOptional: string;
    submit: string;
    saving: string;
    saved: string;
    requiredHint: string;
    recentTitle: string;
    noEntries: string;
  };
  provisioning: {
    createAccount: string;
    dialogTitle: string;
    dialogDescription: string;
    parentEmail: string;
    parentPhone: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    submit: string;
    sending: string;
    inviteSentTitle: string;
    inviteSentDesc: string;
    mockNotice: string;
    copyCode: string;
    copied: string;
    createAnother: string;
    errorInvalidEmail: string;
    errorInvalidPhone: string;
    errorSmsFailed: string;
    errorGeneric: string;
  };
};

function buildDictionary(flat: Record<string, string>): Dictionary {
  const nested = unflatten(flat) as Omit<Dictionary, "activities"> & {
    activities: Omit<Dictionary["activities"], "status" | "type">;
  };

  return {
    ...nested,
    activities: {
      ...nested.activities,
      status: {
        active: nested.activities.statusActive,
        completed: nested.activities.statusCompleted,
        paused: nested.activities.statusPaused,
      },
      type: {
        routine: nested.activities.typeRoutine,
        "flooding-prep": nested.activities.typeFloodingPrep,
        custom: nested.activities.typeCustom,
      },
    },
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  he: buildDictionary(he),
  en: buildDictionary(en),
};
