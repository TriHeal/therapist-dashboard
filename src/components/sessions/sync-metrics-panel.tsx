import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { SyncMetrics } from "@/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

export async function SyncMetricsPanel({ metrics }: { metrics: SyncMetrics }) {
  const { dict } = await getDictionary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.syncMetrics.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label={dict.syncMetrics.breathingSync} value={`${metrics.breathingSyncPercent}%`} />
        <Stat label={dict.syncMetrics.tapSync} value={`${metrics.tapSyncPercent}%`} />
        <Stat
          label={dict.syncMetrics.timeToSync}
          value={`${metrics.timeToSyncSeconds} ${dict.common.seconds}`}
        />
        <Stat label={dict.syncMetrics.desyncEvents} value={`${metrics.desyncEvents}`} />
      </CardContent>
    </Card>
  );
}
