import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { SessionsTableContainer } from "@/components/sessions/sessions-table-container";
import { getPatient, getPatientSessions } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientSessionsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict, locale }, patient, sessions] = await Promise.all([
    getDictionary(),
    getPatient(patientId),
    getPatientSessions(patientId),
  ]);

  if (!patient) notFound();

  return (
    <>
      <AppHeader title={`${patient.displayName} — ${dict.patientSubnav.sessions}`} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-6">
        <SessionsTableContainer
          sessions={sessions}
          patientId={patientId}
          dict={dict}
          locale={locale}
        />
      </div>
    </>
  );
}
