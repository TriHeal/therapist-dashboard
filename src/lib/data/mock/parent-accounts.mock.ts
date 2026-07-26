import type { ParentAccount } from "@/types/parent-account";

export const parentAccounts: ParentAccount[] = [
  {
    id: "pa1",
    therapistId: "t1",
    firebaseUid: null,
    fullName: "ורד כהן",
    email: "vered@example.com",
    phone: "+972501234567",
    relationship: "mother",
    canAccessApp: false,
    patientIds: ["p1"],
    createdAt: "2026-01-12T08:00:00.000Z",
    updatedAt: "2026-01-12T08:00:00.000Z",
  },
  {
    id: "pa2",
    therapistId: "t1",
    firebaseUid: "uid_abc123",
    fullName: "דוד לוין",
    email: "david.levin@example.com",
    phone: null,
    relationship: "father",
    canAccessApp: true,
    patientIds: ["p2"],
    createdAt: "2026-02-03T09:00:00.000Z",
    updatedAt: "2026-06-01T12:00:00.000Z",
  },
];

export default parentAccounts;
