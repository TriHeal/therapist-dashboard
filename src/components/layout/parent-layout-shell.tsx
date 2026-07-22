"use client";

import { usePathname } from "next/navigation";
import { ParentSidebar } from "@/components/layout/parent-sidebar";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export function ParentLayoutShell({
  children,
  dict,
  locale,
}: {
  children: React.ReactNode;
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();

  const hideSidebarRoutes = [
    "/parent/activate",
    "/parent/login",
    "/parent/set-password",
  ];

  if (hideSidebarRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <ParentSidebar dict={dict} locale={locale} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
