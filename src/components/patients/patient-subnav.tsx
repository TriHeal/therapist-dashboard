"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function PatientSubnav({ patientId, dict }: { patientId: string; dict: Dictionary }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/therapist/patients/${patientId}`, label: dict.patientSubnav.overview },
    { href: `/therapist/patients/${patientId}/sessions`, label: dict.patientSubnav.sessions },
    { href: `/therapist/patients/${patientId}/timeline`, label: dict.patientSubnav.timeline },
    { href: `/therapist/patients/${patientId}/progress`, label: dict.patientSubnav.progress },
  ];

  return (
    <div className="flex gap-1 border-b px-6">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-3 py-2 text-sm border-b-2 -mb-px",
              active
                ? "border-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
