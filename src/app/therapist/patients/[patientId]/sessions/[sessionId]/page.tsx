import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLiveSessionActivityRuns,
  getPatient,
  getPatientSessions,
  getSession,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<{
    patientId: string;
    sessionId: string;
  }>;
}) {
  const { patientId, sessionId } = await params;

  const [{ dict, locale }, patient, session, sessions, activityRuns] =
    await Promise.all([
      getDictionary(),
      getPatient(patientId),
      getSession(sessionId),
      getPatientSessions(patientId),
      getLiveSessionActivityRuns(sessionId),
    ]);

  if (!patient || !session || session.patientId !== patientId) {
    notFound();
  }

  if (session.status === "in_progress") {
    redirect(`/therapist/patients/${patientId}/live`);
  }

  const dateLocale = locale === "he" ? "he-IL" : "en-US";
  const sessionIndex = sessions.findIndex((item) => item.id === sessionId);
  const sessionNumber =
    sessionIndex >= 0 ? sessions.length - sessionIndex : null;

  const getActivityName = (type: string) =>
    (dict.newSessionDialog as Record<string, string>)[type] || type;

  return (
    <>
      <AppHeader
        title={`${dict.sessionDetails.title} #${sessionNumber ?? ""}`}
        description={patient.displayName}
      />

      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>{dict.sessionDetails.summary}</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {dict.sessionsTable.date}
              </p>
              <p className="font-medium">
                {new Date(session.startedAt).toLocaleString(dateLocale, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {dict.sessionsTable.status}
              </p>
              <Badge>{dict.sessionStatus.completed}</Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {dict.sessionsTable.activities}
              </p>
              <p className="font-medium">{activityRuns.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dict.sessionDetails.activityRuns}</CardTitle>
          </CardHeader>

          <CardContent>
            {activityRuns.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {dict.sessionDetails.noActivityRuns}
              </p>
            ) : (
              <div className="space-y-3">
                {activityRuns.map((run, index) => (
                  <div
                    key={run.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        #{index + 1} {getActivityName(run.activityType)}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(run.startedAt).toLocaleString(dateLocale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>

                      {run.durationSeconds !== null ? (
                        <p className="text-sm text-muted-foreground">
                          {run.durationSeconds} {dict.common.seconds}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {run.status === "completed"
                          ? dict.liveDetail.activityCompleted
                          : dict.liveDetail.activityActive}
                      </Badge>

                      {run.activityType === "event_processing" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          render={
                            <Link
                              href={`/therapist/patients/${patientId}/sessions/${sessionId}/activities/${run.id}`}
                            >
                              {dict.rocksFlow.viewActivity}
                            </Link>
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex pt-2">
          <Button
            variant="outline"
            className="mr-auto"
            render={
              <Link href={`/therapist/patients/${patientId}/sessions`}>
                {dict.sessionDetails.backToSessions}
              </Link>
            }
          />
        </div>
      </div>
    </>
  );
}
