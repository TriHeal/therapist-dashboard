import { Patient } from "./patient";

export type ParentRelationship =
  | "mother"
  | "father"
  | "guardian"
  | "other";

export type ParentAccount = {
  id: string;
  therapistId: string;
  firebaseUid: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  relationship: ParentRelationship;
  canAccessApp: boolean;
  patientIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateParentAccountInput = {
  patientId: string;
  fullName: string;
  relationship: ParentRelationship;
  email?: string | null;
  phone?: string | null;
  requestAppAccess: boolean;
};
