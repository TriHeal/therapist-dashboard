import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncTrendChart } from "@/components/sessions/sync-trend-chart";
import { RoutineVsFloodingChart } from "@/components/sessions/routine-vs-flooding-chart";
import { AuditSyncTrendChart } from "@/components/audit/audit-sync-trend-chart";
import { AuditEntryCard } from "@/components/audit/audit-entry-card";
import {
  getPatient,
  getSyncTrend,
  getRoutineVsFloodingComparison,
  getPatientAudits,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientProgressPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict, locale }, patient] = await Promise.all([getDictionary(), getPatient(patientId)]);
  if (!patient) notFound();

  const [trend, comparison, audits] = await Promise.all([
    getSyncTrend(patientId),
    getRoutineVsFloodingComparison(patientId),
    getPatientAudits(patientId),
  ]);

  return (
    <>
      <AppHeader title={`${patient.displayName} — ${dict.patientSubnav.progress}`} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{dict.progressPage.syncImprovementTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {trend.length > 0 ? (
              <SyncTrendChart data={trend} dict={dict} locale={locale} />
            ) : (
              <p className="text-sm text-muted-foreground">{dict.progressPage.notEnoughData}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{dict.progressPage.comparisonTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <RoutineVsFloodingChart data={comparison} dict={dict} />
          </CardContent>
        </Card>

        {/* AC #4: parent "Optional Home Journal" audits surfaced as a trend line + list. */}
        <Card>
          <CardHeader>
            <CardTitle>{dict.progressPage.auditTrendTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {audits.length > 0 ? (
              <AuditSyncTrendChart data={audits} dict={dict} locale={locale} />
            ) : (
              <p className="text-sm text-muted-foreground">{dict.progressPage.noAudits}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{dict.progressPage.auditListTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audits.length === 0 ? (
              <p className="text-sm text-muted-foreground">{dict.progressPage.noAudits}</p>
            ) : (
              audits.map((a) => (
                <AuditEntryCard
                  key={a.id}
                  entry={a}
                  dict={dict}
                  locale={locale}
                  scoreLabel={dict.progressPage.auditScoreLabel}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
