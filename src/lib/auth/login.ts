"use client";

import { signInWithCustomToken, signOut } from "firebase/auth";
import { getFirebaseAuth } from "./firebase-client";
import type { Role } from "@/types/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3003";

type LoginResponse = { token: string; role: Role };

export async function login(id: string, password: string): Promise<Role> {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const { token }: LoginResponse = await res.json();

  const auth = getFirebaseAuth();
  const credential = await signInWithCustomToken(auth, token);
  const idToken = await credential.user.getIdToken();

  const sessionRes = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!sessionRes.ok) {
    throw new Error("Failed to establish session");
  }

  const { role } = (await sessionRes.json()) as { role: Role };
  return role;
}

export async function logout(): Promise<void> {
  const auth = getFirebaseAuth();
  await Promise.all([signOut(auth), fetch("/api/session", { method: "DELETE" })]);
}
