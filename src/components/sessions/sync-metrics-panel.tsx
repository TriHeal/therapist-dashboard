import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { SyncMetrics } from "@/types";
import { getMetricsInsights } from "./metrics-insights";
import { Lightbulb } from "lucide-react";

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
  const insights = getMetricsInsights(metrics, dict);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.syncMetrics.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {insights.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-4 border space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Insights
            </div>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              {insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label={dict.syncMetrics.breathingSync} value={`${metrics.breathingSyncPercent}%`} />
          <Stat label={dict.syncMetrics.tapSync} value={`${metrics.tapSyncPercent}%`} />
          <Stat
            label={dict.syncMetrics.timeToSync}
            value={`${metrics.timeToSyncSeconds} ${dict.common.seconds}`}
          />
          <Stat label={dict.syncMetrics.desyncEvents} value={`${metrics.desyncEvents}`} />
        </div>
      </CardContent>
    </Card>
  );
}
