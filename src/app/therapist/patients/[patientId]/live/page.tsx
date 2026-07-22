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

  const getActivityName = (type: string) =>
    (dict.newSessionDialog as Record<string, string>)[type] || type;

  const getActivityStatus = (status: string) => {
    switch (status) {
      case "pending":
        return dict.liveDetail.activityPending;
      case "active":
        return dict.liveDetail.activityActive;
      case "completed":
        return dict.liveDetail.activityCompleted;
      default:
        return status;
    }
  };

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
                    <p className="break-all text-base font-semibold">
                      {activeSession.id}
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

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    {dict.liveDetail.plannedActivities}
                  </h3>

                  {activeSession.activities?.length ? (
                    <ul className="space-y-2">
                      {[...activeSession.activities]
                        .sort((a, b) => a.order - b.order)
                        .map((activity) => (
                          <li
                            key={`${activity.type}-${activity.order}`}
                            className="flex items-center justify-between rounded-lg border px-3 py-2"
                          >
                            <span>{getActivityName(activity.type)}</span>
                            <span className="text-sm text-muted-foreground">
                              {getActivityStatus(activity.status)}
                            </span>
                          </li>
                        ))}
                    </ul>
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
