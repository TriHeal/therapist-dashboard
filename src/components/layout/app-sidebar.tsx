"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { logout } from "@/lib/auth/login";

export function AppSidebar({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();
  async function handleLogout() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  const params = useParams();
  const patientId = params.patientId as string | undefined;

  let navItems;

  if (patientId) {
    navItems = [
      { href: "/therapist/patients", label: "← " + dict.nav.patients },
      {
        href: `/therapist/patients/${patientId}/timeline`,
        label: dict.patientSubnav?.timeline || "Timeline",
      },
    ];
  } else {
    navItems = [
      { href: "/therapist/patients", label: dict.nav.patients },
      { href: "/therapist/settings", label: dict.nav.settings },
    ];
  }

  return (
    <aside className="w-56 shrink-0 border-e bg-sidebar h-full flex flex-col">
      <div className="px-4 py-5 text-lg font-semibold">{dict.nav.appName}</div>
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const active =
            item.href === "/therapist"
              ? pathname === "/therapist"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2 p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md px-3 py-2 text-start text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50"
        >
          {dict.nav.logout}
        </button>

        <LocaleSwitcher locale={locale} />
      </div>
    </aside>
  );
}
