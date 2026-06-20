export type PatientStatus = "active" | "paused" | "completed";

export type Patient = {
  id: string;
  displayName: string;
  age: number;
  avatarUrl?: string;
  status: PatientStatus;
  primaryTherapistId: string;
  enrolledAt: string;
  lastSessionAt?: string;
  parentSharingEnabled: boolean;
};
