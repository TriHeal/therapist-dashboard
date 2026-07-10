export const Role = {
  Therapist: "therapist",
  Parent: "parent",
  Child: "child",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export type Session = {
  uid: string;
  role: Role;
};
