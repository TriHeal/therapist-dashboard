import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { ChildConnectionCodeCard } from "@/components/live/child-connection-code-card";
import { EndSessionButton } from "@/components/sessions/end-session-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPatient, getPatientSessions } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";
import { LiveSessionActivityControls } from "@/components/live/live-session-activity-controls";

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

  if (!patient) notFound();

  const activeSession = sessions.find(
    (session) => session.status === "in_progress",
  );

  const activeSessionIndex = activeSession
    ? sessions.findIndex((session) => session.id === activeSession.id)
    : -1;

  const activeSessionNumber =
    activeSessionIndex >= 0 ? sessions.length - activeSessionIndex : null;

  const dateLocale = locale === "he" ? "he-IL" : "en-US";

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

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">
                    {dict.liveDetail.plannedActivities}
                  </h3>

                  {activeSession.activities?.length ? (
                    <LiveSessionActivityControls
                      sessionId={activeSession.id}
                      patientId={patientId}
                      activities={activeSession.activities}
                      dict={dict}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {dict.liveDetail.noPlannedActivities}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <ChildConnectionCodeCard
              patientId={patient.id}
              dict={dict}
              locale={locale}
            />

            <EndSessionButton
              sessionId={activeSession.id}
              patientId={patientId}
              dict={dict}
            />
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
