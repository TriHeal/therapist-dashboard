import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { PatientOverviewCard } from "@/components/patients/patient-overview-card";
import { SyncMetricsPanel } from "@/components/sessions/sync-metrics-panel";
import { ActiveMissionsWidget } from "@/components/missions/active-missions-widget";
import { getPatient, getPatientSessions, getSyncMetrics, getPatientMissions } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientOverviewPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict }, patient] = await Promise.all([getDictionary(), getPatient(patientId)]);
  if (!patient) notFound();

  const [sessions, missions] = await Promise.all([
    getPatientSessions(patientId),
    getPatientMissions(patientId),
  ]);
  const latestCompleted = sessions.find((s) => s.status === "completed" && s.syncMetricsId);
  const latestMetrics = latestCompleted?.syncMetricsId
    ? await getSyncMetrics(latestCompleted.id)
    : null;
  const activeMissions = missions.filter((m) => m.status === "active");

  return (
    <>
      <AppHeader title={patient.displayName} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-6">
        <PatientOverviewCard patient={patient} />
        {latestMetrics ? (
          <SyncMetricsPanel metrics={latestMetrics} />
        ) : (
          <p className="text-sm text-muted-foreground">{dict.patientOverview.noCompletedSessions}</p>
        )}
        <ActiveMissionsWidget
          missions={activeMissions}
          title={dict.patientOverview.missionsTitle}
          emptyText={dict.patientOverview.noActiveMissions}
        />
      </div>
    </>
  );
}
