export type EDIStepperPhase = "fact" | "interpretation" | "separate";

export type EDIStepperEvent = {
  id: string;
  sessionId: string;
  sequence: number;
  phase: EDIStepperPhase;
  factText?: string;
  interpretationText?: string;
  separatedAt?: string;
  completedAt?: string;
};
