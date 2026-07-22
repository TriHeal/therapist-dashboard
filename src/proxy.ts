import { NextResponse, type NextRequest } from "next/server";
import {
  decodeSession,
  PARENT_DEMO_SESSION_COOKIE,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { Role } from "@/types/auth";

const PUBLIC_PARENT_ROUTES = new Set([
  "/parent/activate",
  "/parent/set-password",
  "/parent/login",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PARENT_ROUTES.has(pathname)) {
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

  if (pathname === "/" && hasParentDemoSession && !session) {
    return NextResponse.redirect(new URL("/parent", request.url));
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const home =
    session.role === Role.Parent ? "/parent" : "/therapist/patients";

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
