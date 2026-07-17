export type ActivityType = "routine" | "flooding-prep" | "custom";
export type ActivityStatus = "active" | "completed" | "paused";

export type Activity = {
  id: string;
  patientId: string;
  title: string;
  type: ActivityType;
  status: ActivityStatus;
  targetCount: number;
  completedCount: number;
  createdAt: string;
  completedAt?: string;
};
