"use client";

import { getIdTokenResult, signInWithCustomToken, signOut } from "firebase/auth";
import { getFirebaseAuth } from "./firebase-client";
import type { Role } from "@/types/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3003";

type LoginResponse = { customToken: string; role: Role };

export async function login(id: string, password: string): Promise<Role> {
  console.log("1. calling backend login");

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ israeliId: id, password }),
  });

  console.log("2. backend login status", res.status);

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const { customToken, role: loginRole }: LoginResponse = await res.json();

  console.log("3. got custom token and role", {
  hasCustomToken: Boolean(customToken),
  loginRole,
});

  const auth = getFirebaseAuth();

  console.log("4. got firebase auth");

  const credential = await signInWithCustomToken(auth, customToken);

  console.log("5. signed in with firebase", credential.user.uid);

  const idToken = await credential.user.getIdToken(true);

  const tokenResult = await getIdTokenResult(credential.user, true);
  console.log("Firebase ID token claims", tokenResult.claims);

  console.log("6. got id token", Boolean(idToken));

  const sessionRes = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  console.log("7. session response", sessionRes.status);
  if (!sessionRes.ok) {
    throw new Error("Failed to establish session");
  }

  const { role: sessionRole } = (await sessionRes.json()) as { role?: Role };

  return sessionRole ?? loginRole;
}

export async function logout(): Promise<void> {
  const auth = getFirebaseAuth();
  await Promise.all([signOut(auth), fetch("/api/session", { method: "DELETE" })]);
}
