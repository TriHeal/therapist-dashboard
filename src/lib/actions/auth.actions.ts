"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Sets the Firebase ID token in an HttpOnly cookie so Server Components
 * can authenticate API requests to NestJS.
 */
export async function loginWithToken(idToken: string) {
  (await cookies()).set("session", idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

/**
 * Clears the session cookie and logs the user out.
 */
export async function logoutAction() {
  (await cookies()).delete("session");
  redirect("/login");
}
