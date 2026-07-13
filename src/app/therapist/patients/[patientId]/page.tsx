import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { PatientOverviewCard } from "@/components/patients/patient-overview-card";
import { SyncMetricsPanel } from "@/components/sessions/sync-metrics-panel";
import { MissionCard } from "@/components/missions/mission-card";
import { AssignMissionDialog } from "@/components/missions/assign-mission-dialog";
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

  return (
    <>
      <AppHeader title={patient.displayName} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-8">
        <PatientOverviewCard patient={patient} />
        
        {/* Missions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">{dict.missions.title}</h2>
            <AssignMissionDialog patientId={patientId} dict={dict} />
          </div>
          {missions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{dict.missions.noMissions}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          )}
        </div>

        {/* Sync Metrics Section */}
        {latestMetrics ? (
          <SyncMetricsPanel metrics={latestMetrics} />
        ) : (
          <p className="text-sm text-muted-foreground">{dict.patientOverview.noCompletedSessions}</p>
        )}
      </div>
    </>
  );
}
