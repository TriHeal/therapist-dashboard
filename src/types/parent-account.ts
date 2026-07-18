export type ParentAccountStatus = "invited" | "active";

/** A parent login account provisioned by a therapist. */
export type ParentAccount = {
  id: string;
  email: string;
  phone: string;
  childId: string;
  status: ParentAccountStatus;
  createdAt: string;
};

export type CreateParentAccountInput = {
  email: string;
  phone: string;
  childId: string;
};
