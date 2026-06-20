import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionTypeBadge } from "@/components/sessions/session-type-badge";
import { SyncMetricsPanel } from "@/components/sessions/sync-metrics-panel";
import { EdiStepperHistory } from "@/components/sessions/edi-stepper-history";
import { TriggerKeywordList } from "@/components/sessions/trigger-keyword-list";
import {
  getPatient,
  getSession,
  getSyncMetrics,
  getEdiEventsForSession,
  getTriggerKeywordsForSession,
  getParentReflectionForSession,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ patientId: string; sessionId: string }>;
}) {
  const { patientId, sessionId } = await params;
  const [{ dict, locale }, patient, session] = await Promise.all([
    getDictionary(),
    getPatient(patientId),
    getSession(sessionId),
  ]);
  if (!patient || !session || session.patientId !== patientId) notFound();

  const [metrics, ediEvents, keywords, parentReflection] = await Promise.all([
    session.syncMetricsId ? getSyncMetrics(session.id) : Promise.resolve(null),
    getEdiEventsForSession(session.id),
    getTriggerKeywordsForSession(session.id),
    getParentReflectionForSession(session.id),
  ]);

  return (
    <>
      <AppHeader title={`${patient.displayName} — ${dict.sessionDetail.title}`} />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <SessionTypeBadge type={session.type} />
          <span className="text-sm text-muted-foreground">
            {new Date(session.startedAt).toLocaleString(locale === "he" ? "he-IL" : "en-US")}
          </span>
          <span className="text-sm text-muted-foreground">{dict.sessionStatus[session.status]}</span>
        </div>

        {metrics && <SyncMetricsPanel metrics={metrics} />}

        <Card>
          <CardHeader>
            <CardTitle>{dict.sessionDetail.ediHistory}</CardTitle>
          </CardHeader>
          <CardContent>
            <EdiStepperHistory events={ediEvents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dict.sessionDetail.triggerKeywords}</CardTitle>
          </CardHeader>
          <CardContent>
            <TriggerKeywordList keywords={keywords} />
          </CardContent>
        </Card>

        {parentReflection && (
          <Card>
            <CardHeader>
              <CardTitle>{dict.sessionDetail.parentReflection}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm">{parentReflection.whatHappened}</p>
              {parentReflection.timeToSyncEstimateSeconds != null && (
                <p className="text-sm text-muted-foreground">
                  {dict.sessionDetail.parentEstimatedTime}: {parentReflection.timeToSyncEstimateSeconds}{" "}
                  {dict.common.seconds}
                </p>
              )}
              {parentReflection.parentNotes && (
                <p className="text-sm text-muted-foreground">
                  {dict.sessionDetail.note}: {parentReflection.parentNotes}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
