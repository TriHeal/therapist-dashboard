import type { SessionType, TriggerSeverity, PatientStatus } from "@/types";

export const SESSION_TYPE_BADGE_VARIANT: Record<SessionType, "default" | "secondary" | "destructive"> = {
  clinic: "default",
  routine: "secondary",
  flooding: "destructive",
};

export const SEVERITY_BADGE_VARIANT: Record<TriggerSeverity, "secondary" | "default" | "destructive"> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
};

export const PATIENT_STATUS_BADGE_VARIANT: Record<PatientStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
};

export const CHART_COLORS = {
  breathing: "var(--chart-1)",
  tap: "var(--chart-2)",
  clinic: "var(--chart-1)",
  routine: "var(--chart-2)",
  flooding: "var(--chart-5)",
};
