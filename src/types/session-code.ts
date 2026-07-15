export type ActivationCodeStatus = "active" | "used" | "expired";

/**
 * A short, expiring code a therapist generates for a specific child/session so the
 * parent or child can activate their account / complete first login.
 */
export type ActivationCode = {
  code: string;
  patientId: string;
  purpose: "activation";
  createdAt: string;
  expiresAt: string;
  status: ActivationCodeStatus;
};
