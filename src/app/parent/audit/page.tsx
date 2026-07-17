import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { AuditForm } from "@/components/parent/audit-form";
import { AuditEntryCard } from "@/components/audit/audit-entry-card";
import { getMyChildAudits, getMyChildLatestCompletedSession } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentAuditPage() {
  const [{ dict, locale }, latestSession, audits] = await Promise.all([
    getDictionary(),
    getMyChildLatestCompletedSession(),
    getMyChildAudits(),
  ]);

  const t = dict.parentAuditPage;

  return (
    <>
      <AppHeader title={t.title} description={t.description} />
      <div className="p-6 space-y-6">
        {/* AC #1: the journal is available only after a home game session is completed. */}
        {!latestSession ? (
          <p className="text-sm text-muted-foreground">{t.noCompletedSession}</p>
        ) : (
          <>
            <Card>
              <CardContent className="py-5">
                <AuditForm sessionId={latestSession.id} dict={dict} />
              </CardContent>
            </Card>

            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">{t.recentTitle}</h2>
              {audits.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.noEntries}</p>
              ) : (
                <div className="space-y-3">
                  {audits.map((a) => (
                    <AuditEntryCard
                      key={a.id}
                      entry={a}
                      dict={dict}
                      locale={locale}
                      scoreLabel={t.scoreLabel}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
