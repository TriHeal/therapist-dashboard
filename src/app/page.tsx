import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ROLE_COOKIE, SESSION_COOKIE, isRole } from "@/lib/auth/session";
import { Role } from "@/types/auth";

export default async function RootPage() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const role = store.get(ROLE_COOKIE)?.value;

  if (!token || !isRole(role)) {
    redirect("/login");
  }

  redirect(role === Role.Parent ? "/parent" : "/therapist/patients");
}
