export type PatientStatus = "active" | "paused" | "completed";

export type Patient = {
  id: string;
  displayName: string;
  age: number;
  avatarUrl?: string;
  status: PatientStatus;
  primaryTherapistId: string; // existing field used throughout the app
  enrolledAt: string;
  lastSessionAt?: string;
  parentSharingEnabled: boolean;
  // New fields for parent provisioning and child app linking
  parentIds?: string[]; // list of linked ParentAccount ids
  childUid?: string | null; // linked child app Firebase UID, or null if not connected
  createdAt?: string;
  updatedAt?: string;
};
