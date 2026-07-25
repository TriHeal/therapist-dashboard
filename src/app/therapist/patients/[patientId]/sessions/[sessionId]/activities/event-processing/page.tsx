import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { EventProcessingRunsTable } from "@/components/live/event-processing-runs-table";
import { Button } from "@/components/ui/button";
import {
  getLiveSessionActivityRuns,
  getPatient,
  getSession,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function EventProcessingPage({
  params,
}: {
  params: Promise<{
    patientId: string;
    sessionId: string;
  }>;
}) {
  const { patientId, sessionId } = await params;

  const [{ dict, locale }, patient, session, allRuns] = await Promise.all([
    getDictionary(),
    getPatient(patientId),
    getSession(sessionId),
    getLiveSessionActivityRuns(sessionId),
  ]);

  if (!patient || !session || session.patientId !== patientId) {
    notFound();
  }

  const runs = allRuns.filter(
    (run) =>
      run.patientId === patientId &&
      run.sessionId === sessionId &&
      run.activityType === "event_processing",
  );

  const backHref =
    session.status === "in_progress"
      ? `/therapist/patients/${patientId}/live`
      : `/therapist/patients/${patientId}/sessions/${sessionId}`;

  return (
    <>
      <AppHeader
        title={dict.rocksFlow.title}
        description={patient.displayName}
      />

      <div className="space-y-6 p-4 md:p-6">
        <EventProcessingRunsTable
          patientId={patientId}
          sessionId={sessionId}
          runs={runs}
          sessionInProgress={session.status === "in_progress"}
          dict={dict}
          locale={locale}
        />

        <div className="flex justify-end border-t pt-4">
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link href={backHref}>{dict.rocksFlow.backToSession}</Link>
            }
          />
        </div>
      </div>
    </>
  );
}