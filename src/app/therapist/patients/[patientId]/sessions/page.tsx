import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { SessionSummaryCard } from "@/components/sessions/session-summary-card";
import { getPatient, getPatientSessions } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientSessionsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict }, patient] = await Promise.all([getDictionary(), getPatient(patientId)]);
  if (!patient) notFound();

  const sessions = await getPatientSessions(patientId);

  return (
    <>
      <AppHeader title={`${patient.displayName} — ${dict.patientSubnav.sessions}`} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.sessionsPage.noSessions}</p>
        ) : (
          sessions.map((session) => <SessionSummaryCard key={session.id} session={session} />)
        )}
      </div>
    </>
  );
}
