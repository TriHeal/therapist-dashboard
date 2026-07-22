export const PARENT_DEMO_PROFILE_KEY = "triheal_parent_demo_profile";
export const PARENT_DEMO_CREDENTIALS_KEY = "triheal_parent_demo_credentials";

export type ParentDemoProfile = {
  parentId: string;
  patient: {
    id: string;
    displayName: string;
    age: number;
    avatarUrl: string | null;
  };
};

export type ParentDemoCredentials = {
  email: string;
  passwordHash: string;
};

export function normalizeParentEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidParentEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeParentEmail(email));
}

export async function hashParentPassword(password: string) {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
