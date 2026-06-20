import { Badge } from "@/components/ui/badge";
import { PATIENT_STATUS_BADGE_VARIANT } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { PatientStatus } from "@/types";

export async function PatientStatusBadge({ status }: { status: PatientStatus }) {
  const { dict } = await getDictionary();
  return <Badge variant={PATIENT_STATUS_BADGE_VARIANT[status]}>{dict.patientStatus[status]}</Badge>;
}
