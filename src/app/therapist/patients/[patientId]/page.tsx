import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { PatientOverviewCard } from "@/components/patients/patient-overview-card";
import { SyncMetricsPanel } from "@/components/sessions/sync-metrics-panel";
import { ActivityCard } from "@/components/activities/activity-card";
import { AssignActivityDialog } from "@/components/activities/assign-activity-dialog";
import { getPatient, getPatientSessions, getSyncMetrics, getPatientActivities } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientOverviewPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict }, patient] = await Promise.all([getDictionary(), getPatient(patientId)]);
  if (!patient) notFound();

  const [sessions, activities] = await Promise.all([
    getPatientSessions(patientId),
    getPatientActivities(patientId),
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
        
        {/* Activities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">{dict.activities.title}</h2>
            <AssignActivityDialog patientId={patientId} dict={dict} />
          </div>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">{dict.activities.noActivities}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>

        {/* Sync Metrics Section */}
        {latestMetrics ? (
          <SyncMetricsPanel metrics={latestMetrics} dict={dict} />
        ) : (
          <p className="text-sm text-muted-foreground">{dict.patientOverview.noCompletedSessions}</p>
        )}
      </div>
    </>
  );
}
