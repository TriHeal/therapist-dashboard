export type PatientStatus = "active" | "paused" | "completed";
export type PatientSex = "male" | "female" | "unspecified";

export type Patient = {
  id: string;
  displayName: string;
  age: number;
  sex: PatientSex;
  avatarUrl?: string | null;
  status: PatientStatus;
  primaryTherapistId: string;
  enrolledAt: string;
  lastSessionAt?: string;
  parentSharingEnabled: boolean;
  parentIds: string[];
  childUid: string | null;
  createdAt?: string;
  updatedAt?: string;
};
