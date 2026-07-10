import { NextResponse, type NextRequest } from "next/server";
// import { decodeSession, SESSION_COOKIE } from "@/lib/auth/session";
// import { Role } from "@/types/auth";

// TODO: login is temporarily disabled (backend /auth/login is broken).
// Restore the session/role checks below once it's fixed.
export function proxy(_request: NextRequest) {
  return NextResponse.next();

  // const { pathname } = request.nextUrl;
  //
  // const token = request.cookies.get(SESSION_COOKIE)?.value;
  // const session = token ? decodeSession(token) : null;
  //
  // if (!session) {
  //   const loginUrl = new URL("/login", request.url);
  //   return NextResponse.redirect(loginUrl);
  // }
  //
  // const home = session.role === Role.Parent ? "/parent" : "/therapist";
  //
  // if (pathname.startsWith("/parent") && session.role !== Role.Parent) {
  //   return NextResponse.redirect(new URL(home, request.url));
  // }
  //
  // if (pathname.startsWith("/therapist") && session.role !== Role.Therapist) {
  //   return NextResponse.redirect(new URL(home, request.url));
  // }
  //
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL(home, request.url));
  // }
  //
  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api/session|_next|favicon.ico).*)"],
};
