import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PARENT_DEMO_SESSION_COOKIE,
  PARENT_PATIENT_COOKIE,
} from "@/lib/auth/session";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: Request) {
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Backend URL is not configured" },
      { status: 500 },
    );
  }

  const { token } = (await request.json()) as { token?: string };

  if (!token) {
    return NextResponse.json(
      { error: "Invitation token is required" },
      { status: 400 },
    );
  }

  const response = await fetch(`${BASE_URL}/parent-invitations/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();

    return NextResponse.json(
      { error: message || "Invitation could not be accepted" },
      { status: response.status },
    );
  }

  const result = (await response.json()) as {
    parentId: string;
    patientIds: string[];
    patient: {
      id: string;
      displayName: string;
      age: number;
      avatarUrl: string | null;
    };
  };

  if (!result.patient?.id) {
    return NextResponse.json(
      { error: "No child is connected to this parent" },
      { status: 400 },
    );
  }

  const store = await cookies();

  store.set(PARENT_DEMO_SESSION_COOKIE, result.parentId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const encodedPatient = Buffer.from(
    JSON.stringify(result.patient),
    "utf8",
  ).toString("base64url");

  store.set(PARENT_PATIENT_COOKIE, encodedPatient, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json(result);
}
