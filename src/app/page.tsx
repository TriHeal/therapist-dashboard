import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  decodeSession,
  PARENT_DEMO_SESSION_COOKIE,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { Role } from "@/types/auth";

export default async function RootPage() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const parentDemoToken = store.get(PARENT_DEMO_SESSION_COOKIE)?.value;
  const session = token ? decodeSession(token) : null;

  if (session) {
    redirect(session.role === Role.Parent ? "/parent" : "/therapist/patients");
  }

  if (parentDemoToken) {
    redirect("/parent");
  }

  redirect("/login");
}
