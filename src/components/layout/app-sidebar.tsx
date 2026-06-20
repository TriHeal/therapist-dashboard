"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export function AppSidebar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: dict.nav.dashboard },
    { href: "/patients", label: dict.nav.patients },
    { href: "/schedule", label: dict.nav.schedule },
    { href: "/live", label: dict.nav.live },
    { href: "/alerts", label: dict.nav.alerts },
    { href: "/settings", label: dict.nav.settings },
  ];

  return (
    <aside className="w-56 shrink-0 border-e bg-sidebar h-full flex flex-col">
      <div className="px-4 py-5 text-lg font-semibold">{dict.nav.appName}</div>
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <LocaleSwitcher locale={locale} />
      </div>
    </aside>
  );
}
