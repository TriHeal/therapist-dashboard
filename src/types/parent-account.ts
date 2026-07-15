export type ParentAccountStatus = "invited" | "active";

/** A parent login account provisioned by a therapist. */
export type ParentAccount = {
  id: string;
  email: string;
  phone: string;
  /** Optional link to the child (patient) this parent belongs to. Not yet wired to a real backend relation. */
  childId?: string;
  status: ParentAccountStatus;
  createdAt: string;
};

export type CreateParentAccountInput = {
  email: string;
  phone: string;
  childId?: string;
};
