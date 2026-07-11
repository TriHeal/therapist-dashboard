import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEVERITY_BADGE_VARIANT } from "@/lib/constants";
import { getFlaggedKeywordAlerts } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";
import { markAlertReviewed } from "@/lib/actions/alerts.actions";

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const unreviewedOnly = filter === "unreviewed";

  const [{ dict, locale }, allAlerts] = await Promise.all([getDictionary(), getFlaggedKeywordAlerts()]);
  const dateLocale = locale === "he" ? "he-IL" : "en-US";
  const alerts = unreviewedOnly ? allAlerts.filter((a) => !a.reviewed) : allAlerts;

  return (
    <>
      <AppHeader title={dict.alertsPage.title} description={dict.alertsPage.description} />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <Button
            render={<Link href="/therapist/alerts" />}
            size="sm"
            variant={!unreviewedOnly ? "default" : "outline"}
          >
            {dict.alertsPage.filterAll}
          </Button>
          <Button
            render={<Link href="/therapist/alerts?filter=unreviewed" />}
            size="sm"
            variant={unreviewedOnly ? "default" : "outline"}
          >
            {dict.alertsPage.filterUnreviewed}
          </Button>
        </div>

        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.alertsPage.noAlerts}</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <Card key={a.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <Link
                    href={`/therapist/patients/${a.patientId}/sessions/${a.sessionId}`}
                    className="flex-1 hover:underline"
                  >
                    <p className="text-sm font-medium">{a.patientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.keyword} {a.category && `· ${a.category}`}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <Badge variant={SEVERITY_BADGE_VARIANT[a.severity]}>{dict.severity[a.severity]}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.flaggedAt).toLocaleDateString(dateLocale)}
                    </span>
                    {a.reviewed ? (
                      <Badge variant="outline">{dict.alertsPage.reviewed}</Badge>
                    ) : (
                      <form action={markAlertReviewed}>
                        <input type="hidden" name="alertId" value={a.id} />
                        <Button type="submit" size="sm" variant="outline">
                          {dict.alertsPage.markReviewed}
                        </Button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
