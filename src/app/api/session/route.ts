import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { idToken } = (await request.json()) as { idToken?: string };
  if (!idToken) {
    return NextResponse.json({ error: "idToken is required" }, { status: 400 });
  }

  const session = decodeSession(idToken);
  if (!session) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  return NextResponse.json({ role: session.role });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
