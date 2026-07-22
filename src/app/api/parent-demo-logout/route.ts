import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  PARENT_DEMO_SESSION_COOKIE,
  PARENT_PATIENT_COOKIE,
} from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();

  for (const cookieName of [
    PARENT_DEMO_SESSION_COOKIE,
    PARENT_PATIENT_COOKIE,
  ]) {
    cookieStore.set(cookieName, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return NextResponse.json({ ok: true });
}
