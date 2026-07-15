import type { SyncMetrics } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function getMetricsInsights(metrics: SyncMetrics, dict: Dictionary): string[] {
  const insights: string[] = [];
  const { syncMetricsInsights } = dict;
  let hasIssues = false;

  // Breathing Sync
  if (metrics.breathingSyncPercent >= 80) {
    insights.push(syncMetricsInsights.breathingHigh);
  } else if (metrics.breathingSyncPercent < 50) {
    insights.push(syncMetricsInsights.breathingLow);
    hasIssues = true;
  }

  // Time to Sync
  if (metrics.timeToSyncSeconds <= 30) {
    insights.push(syncMetricsInsights.timeToSyncFast);
  } else if (metrics.timeToSyncSeconds > 120) {
    insights.push(syncMetricsInsights.timeToSyncSlow);
    hasIssues = true;
  }

  // Desync Events
  if (metrics.desyncEvents >= 3) {
    insights.push(syncMetricsInsights.desyncHigh);
    hasIssues = true;
  }

  // General positive feedback if everything is fine
  if (!hasIssues && insights.length > 0) {
    insights.push(syncMetricsInsights.overallGood);
  }

  return insights;
}
