export type MissionType = "routine" | "flooding-prep" | "custom";
export type MissionStatus = "active" | "completed" | "paused";

export type Mission = {
  id: string;
  patientId: string;
  title: string;
  type: MissionType;
  status: MissionStatus;
  targetCount: number;
  completedCount: number;
  createdAt: string;
  completedAt?: string;
};
