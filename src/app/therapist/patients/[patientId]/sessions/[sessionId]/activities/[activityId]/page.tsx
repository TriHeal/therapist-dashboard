import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { RocksBreakFlowForm } from "@/components/live/rocks-break-flow-form";
import { RocksBreakFlowReadOnly } from "@/components/live/rocks-break-flow-read-only";
import { Button } from "@/components/ui/button";
import { getLiveSessionActivityRun, getPatient, getSession } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function EventProcessingActivityPage({
  params,
}: {
  params: Promise<{
    patientId: string;
    sessionId: string;
    activityId: string;
  }>;
}) {
  const { patientId, sessionId, activityId } = await params;

  const [{ dict }, patient, session, activityRun] = await Promise.all([
    getDictionary(),
    getPatient(patientId),
    getSession(sessionId),
    getLiveSessionActivityRun(sessionId, activityId),
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

  const isEditable =
    session.status === "in_progress" && activityRun.status === "active";

  const backHref =
    session.status === "in_progress"
      ? `/therapist/patients/${patientId}/live`
      : `/therapist/patients/${patientId}/sessions`;

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
        <RocksBreakFlowReadOnly details={activityRun.details} dict={dict} />
      )}
      <div className="flex w-full justify-end pt-2 pl-4">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={backHref}>{dict.rocksFlow.backToSession}</Link>}
        />
      </div>
    </>
  );
}
