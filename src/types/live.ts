export type LiveSessionStub = {
  sessionId: string;
  patientId: string;
  patientName: string;
  type: import("./session").SessionType;
  startedAt: string;
  currentPhase?: string;
};
