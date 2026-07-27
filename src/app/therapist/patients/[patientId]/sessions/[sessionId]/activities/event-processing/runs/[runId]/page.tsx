import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { RocksBreakFlowForm } from "@/components/live/rocks-break-flow-form";
import { RocksBreakFlowReadOnly } from "@/components/live/rocks-break-flow-read-only";
import { Button } from "@/components/ui/button";
import {
  getLiveSessionActivityRun,
  getPatient,
  getSession,
  type RocksBreakFlowDetails,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

function hasApprovedContent(details: RocksBreakFlowDetails): boolean {
  const hasEventTitle = Boolean(details.eventTitle?.trim());

  const hasFacts = Boolean(
    details.facts?.some((value) => value.trim().length > 0),
  );

  const hasThoughts = Boolean(
    details.thoughts?.some((value) => value.trim().length > 0),
  );

  return hasEventTitle || hasFacts || hasThoughts;
}

export default async function EventProcessingActivityRunPage({
  params,
}: {
  params: Promise<{
    patientId: string;
    sessionId: string;
    runId: string;
  }>;
}) {
  const { patientId, sessionId, runId } = await params;

  const [{ dict }, patient, session, activityRun] = await Promise.all([
    getDictionary(),
    getPatient(patientId),
    getSession(sessionId),
    getLiveSessionActivityRun(sessionId, runId),
  ]);

  if (
    !patient ||
    !session ||
    !activityRun ||
    session.patientId !== patientId ||
    activityRun.patientId !== patientId ||
    activityRun.sessionId !== sessionId ||
    activityRun.activityType !== "event_processing"
  ) {
    notFound();
  }

  const approved = hasApprovedContent(activityRun.details);

  const isEditable =
    session.status === "in_progress" &&
    activityRun.status === "active" &&
    !approved;

  const activitiesHref =
    `/therapist/patients/${patientId}/sessions/${sessionId}` +
    "/activities/event-processing";

  return (
    <>
      <AppHeader
        title={dict.rocksFlow.title}
        description={patient.displayName}
      />

      {isEditable ? (
        <RocksBreakFlowForm
          sessionId={sessionId}
          patientId={patientId}
          dict={dict}
          initialDetails={activityRun.details}
        />
      ) : (
        <div className="mx-auto w-full max-w-5xl space-y-4 p-4 md:p-6">
          <RocksBreakFlowReadOnly
            details={activityRun.details}
            dict={dict}
          />

          <div className="flex justify-end border-t pt-4">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link href={activitiesHref}>
                  {dict.rocksFlow.backToActivities}
                </Link>
              }
            />
          </div>
        </div>
      )}
    </>
  );
}