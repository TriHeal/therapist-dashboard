"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

/**
 * Client-side layout wrapper that conditionally renders the sidebar.
 * The `/login` page renders without the sidebar or navigation chrome.
 * All other pages render with the standard sidebar layout.
 */
export function ClientLayout({
  children,
  dict,
  locale,
}: {
  children: React.ReactNode;
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar dict={dict} locale={locale} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
