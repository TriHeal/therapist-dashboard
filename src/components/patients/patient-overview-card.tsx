import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PatientStatusBadge } from "@/components/patients/patient-status-badge";
import type { Patient } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function PatientOverviewCard({
  patient,
  dict,
  locale,
}: {
  patient: Patient;
  dict: Dictionary;
  locale: "he" | "en";
}) {
  const dateLocale = locale === "he" ? "he-IL" : "en-US";
  const parentCount = patient.parentIds ? patient.parentIds.length : 0;

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
        <p className="mt-1 text-sm text-muted-foreground">
          {parentCount} {dict.parentSection.linkedCountLabel}
        </p>
      </div>
      <div className="text-end text-sm text-muted-foreground">
        <p>{dict.common.lastSession}</p>
        <p className="font-medium text-foreground">
          {patient.lastSessionAt
            ? new Date(patient.lastSessionAt).toLocaleDateString(dateLocale)
            : dict.common.notAvailable}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {patient.childUid
            ? (dict.patientOverview?.childConnected ?? "Child app: connected")
            : (dict.patientOverview?.childNotConnected ??
              "Child app: not connected")}
        </p>
        <p className="text-sm text-muted-foreground">
          {dict.common.parentSharing}:{" "}
          {patient.parentSharingEnabled
            ? dict.common.enabled
            : dict.common.disabled}
        </p>
      </div>
    </div>
  );
}
