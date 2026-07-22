import { NextResponse, type NextRequest } from "next/server";
import {
  PARENT_DEMO_SESSION_COOKIE,
  ROLE_COOKIE,
  SESSION_COOKIE,
  isRole,
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

  // The role is held in its own cookie (the Firebase token has no role claim),
  // so gate on the session token + role cookie without decoding the JWT here —
  // this runs in the Edge runtime where Buffer-based decoding isn't available.
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const roleValue = request.cookies.get(ROLE_COOKIE)?.value;
  const role = token && isRole(roleValue) ? roleValue : null;

  if (pathname === "/" && hasParentDemoSession && !role) {
    return NextResponse.redirect(new URL("/parent", request.url));
  }

  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const home = role === Role.Parent ? "/parent" : "/therapist/patients";

  if (pathname.startsWith("/parent") && role !== Role.Parent) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname.startsWith("/therapist") && role !== Role.Therapist) {
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
