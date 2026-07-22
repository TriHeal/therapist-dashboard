"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ParentLogoutButton } from "@/components/parent/parent-logout-button";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export function ParentSidebar({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/parent", label: dict.parentNav.home },
    { href: "/parent/activities", label: dict.parentNav.activities },
  ];

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-e bg-sidebar">
      <div className="px-4 py-5 text-lg font-semibold">
        {dict.parentNav.appName}
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const active =
            item.href === "/parent"
              ? pathname === "/parent"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3 px-2 py-4">
        <ParentLogoutButton dict={dict} />
        <LocaleSwitcher locale={locale} />
      </div>
    </aside>
  );
}
