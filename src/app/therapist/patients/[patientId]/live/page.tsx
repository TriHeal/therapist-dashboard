import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { LiveSessionControls } from "@/components/live/live-session-controls";
import { EndSessionButton } from "@/components/sessions/end-session-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getLiveSessionActivityRuns,
  getPatient,
  getPatientSessions,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function LiveSessionDetailPage({
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

  if (!patient) {
    notFound();
  }

  const activeSession = sessions.find(
    (session) => session.status === "in_progress",
  );

  const activityRuns = activeSession
    ? await getLiveSessionActivityRuns(activeSession.id)
    : [];

    const hasActiveActivity =
    activeSession?.activities?.some(
      (activity) => activity.status === "active",
    ) ||
    activityRuns.some((run) => run.status === "active");
    
  const activeSessionIndex = activeSession
    ? sessions.findIndex((session) => session.id === activeSession.id)
    : -1;

  const activeSessionNumber =
    activeSessionIndex >= 0 ? sessions.length - activeSessionIndex : null;

  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  const sessionsHref = `/therapist/patients/${patientId}/sessions`;

  return (
    <>
      <AppHeader
        title={dict.liveDetail.title}
        description={`${dict.liveDetail.sessionLabel} ${patient.displayName}`}
      />

      <div className="space-y-6 p-6">
        {activeSession ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{patient.displayName}</CardTitle>

                <CardDescription>
                  {dict.liveDetail.sessionLabel} {patient.displayName}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {dict.liveDetail.sessionLabel}
                    </p>

                    <p className="text-base font-semibold">
                      #{activeSessionNumber}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {new Date(activeSession.startedAt).toLocaleString(
                        dateLocale,
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        },
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {dict.liveDetail.sessionStatus}
                    </p>

                    <p className="text-base font-semibold">
                      {dict.sessionStatus.in_progress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <LiveSessionControls
              sessionId={activeSession.id}
              patientId={patientId}
              activities={activeSession.activities ?? []}
              activityRuns={activityRuns}
              dict={dict}
              locale={locale}
            />

            <div className="space-y-4">
              <EndSessionButton
                sessionId={activeSession.id}
                patientId={patientId}
                dict={dict}
                hasActiveActivity={hasActiveActivity}
              />

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={
                    <Link href={sessionsHref}>
                      {dict.rocksFlow.backToSessions}
                    </Link>
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <Alert>
            <AlertTitle>{dict.liveDetail.noActiveSessionTitle}</AlertTitle>

            <AlertDescription>
              {dict.liveDetail.noActiveSessionDescription}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}