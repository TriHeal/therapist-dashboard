import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  PARENT_DEMO_SESSION_COOKIE,
  ROLE_COOKIE,
  SESSION_COOKIE,
  isRole,
} from "@/lib/auth/session";
import { Role } from "@/types/auth";

export default async function RootPage() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const role = store.get(ROLE_COOKIE)?.value;
  const parentDemoToken = store.get(PARENT_DEMO_SESSION_COOKIE)?.value;

  if (token && isRole(role)) {
    redirect(role === Role.Parent ? "/parent" : "/therapist/patients");
  }

  if (parentDemoToken) {
    redirect("/parent");
  }

  redirect("/login");
}
