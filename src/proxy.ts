import { NextResponse, type NextRequest } from "next/server";
import {
  decodeSession,
  PARENT_DEMO_SESSION_COOKIE,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { Role } from "@/types/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/parent/activate") {
    return NextResponse.next();
  }

  const hasParentDemoSession = Boolean(
    request.cookies.get(PARENT_DEMO_SESSION_COOKIE)?.value,
  );

  if (pathname.startsWith("/parent") && hasParentDemoSession) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? decodeSession(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const home = session.role === Role.Parent ? "/parent" : "/therapist/patients";

  if (pathname.startsWith("/parent") && session.role !== Role.Parent) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname.startsWith("/therapist") && session.role !== Role.Therapist) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/therapist/:path*", "/parent/:path*", "/"],
};
