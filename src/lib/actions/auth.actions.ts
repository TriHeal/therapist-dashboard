"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE, SESSION_COOKIE } from "@/lib/auth/session";

/**
 * Sets the Firebase ID token in an HttpOnly cookie so Server Components
 * can authenticate API requests to NestJS.
 */
export async function loginWithToken(idToken: string) {
  (await cookies()).set(SESSION_COOKIE, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

/**
 * Clears the session + role cookies and logs the user out.
 */
export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ROLE_COOKIE);
  redirect("/login");
}
