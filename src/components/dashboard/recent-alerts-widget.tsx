import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_BADGE_VARIANT } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { FlaggedAlert } from "@/types";

export async function RecentAlertsWidget({ alerts }: { alerts: FlaggedAlert[] }) {
  const { dict } = await getDictionary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.home.recentAlerts}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.home.noAlertsRecent}</p>
        ) : (
          alerts.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={`/patients/${a.patientId}/sessions/${a.sessionId}`}
              className="flex items-center justify-between rounded-md border p-2 hover:bg-accent/50"
            >
              <span className="text-sm">
                <span className="font-medium">{a.patientName}</span>{" "}
                <span className="text-muted-foreground">{a.keyword}</span>
              </span>
              <Badge variant={SEVERITY_BADGE_VARIANT[a.severity]}>{dict.severity[a.severity]}</Badge>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
