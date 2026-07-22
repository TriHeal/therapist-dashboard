import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PARENT_DEMO_SESSION_COOKIE,
  PARENT_PATIENT_COOKIE,
} from "@/lib/auth/session";

type ParentDemoLoginBody = {
  parentId?: unknown;
  patient?: {
    id?: unknown;
    displayName?: unknown;
    age?: unknown;
    avatarUrl?: unknown;
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as ParentDemoLoginBody;

  const { parentId, patient } = body;

  if (typeof parentId !== "string" || parentId.trim() === "") {
    return NextResponse.json({ error: "Invalid parentId" }, { status: 400 });
  }

  if (
    !patient ||
    typeof patient.id !== "string" ||
    typeof patient.displayName !== "string" ||
    typeof patient.age !== "number" ||
    !(patient.avatarUrl === null || typeof patient.avatarUrl === "string")
  ) {
    return NextResponse.json(
      { error: "Invalid patient data" },
      { status: 400 },
    );
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  const store = await cookies();
  const encodedPatient = Buffer.from(JSON.stringify(patient), "utf8").toString(
    "base64url",
  );

  store.set(PARENT_DEMO_SESSION_COOKIE, parentId, cookieOptions);
  store.set(PARENT_PATIENT_COOKIE, encodedPatient, cookieOptions);

  return NextResponse.json({ ok: true });
}
