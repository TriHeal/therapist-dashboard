import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PatientStatusBadge } from "@/components/patients/patient-status-badge";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { Patient } from "@/types";

export async function PatientOverviewCard({ patient }: { patient: Patient }) {
  const { dict, locale } = await getDictionary();
  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Avatar className="h-12 w-12">
        <AvatarFallback>{patient.displayName.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{patient.displayName}</h2>
          <PatientStatusBadge status={patient.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {dict.common.age} {patient.age} · {dict.common.enrolled}{" "}
          {new Date(patient.enrolledAt).toLocaleDateString(dateLocale)}
        </p>
      </div>
      <div className="text-end text-sm text-muted-foreground">
        <p>{dict.common.lastSession}</p>
        <p className="font-medium text-foreground">
          {patient.lastSessionAt
            ? new Date(patient.lastSessionAt).toLocaleDateString(dateLocale)
            : dict.common.notAvailable}
        </p>
      </div>
    </div>
  );
}
