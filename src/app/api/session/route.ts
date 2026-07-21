import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ROLE_COOKIE, SESSION_COOKIE, getTokenUid, isRole } from "@/lib/auth/session";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60,
};

export async function POST(request: Request) {
  const { idToken, role } = (await request.json()) as {
    idToken?: string;
    role?: string;
  };

  // The Firebase token carries the uid but NOT the role (backend-heal doesn't set
  // a role claim), so validate the token by its uid and take the role from the body.
  if (!idToken || !getTokenUid(idToken)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  if (!isRole(role)) {
    return NextResponse.json({ error: "A valid role is required" }, { status: 400 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, idToken, COOKIE_OPTS);
  store.set(ROLE_COOKIE, role, COOKIE_OPTS);

  return NextResponse.json({ role });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ROLE_COOKIE);
  return NextResponse.json({ ok: true });
}
