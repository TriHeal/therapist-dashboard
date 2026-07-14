"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { SyncMetrics } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { getMetricsInsights } from "./metrics-insights";
import { Lightbulb, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface ExtendedSyncMetricsDict {
  title: string;
  breathingSync: string;
  tapSync: string;
  timeToSync: string;
  desyncEvents: string;
  explanations?: {
    breathingSync?: string;
    tapSync?: string;
    timeToSync?: string;
    desyncEvents?: string;
  };
  status?: {
    stable?: string;
    needsPractice?: string;
    attention?: string;
  };
}

function Stat({
  label,
  value,
  tooltipText,
}: {
  label: string;
  value: string;
  tooltipText: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground/60 hover:text-muted-foreground cursor-help focus:outline-none">
            <HelpCircle className="w-3.5 h-3.5" />
          </TooltipTrigger>
          <TooltipContent side="top">
            <span className="text-xs">{tooltipText || "Explanation not available"}</span>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export function SyncMetricsPanel({
  metrics,
  dict,
}: {
  metrics: SyncMetrics;
  dict: Dictionary;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const insights = getMetricsInsights(metrics, dict);
  
  // Cast syncMetrics to the extended type to prevent TypeScript compilation errors
  // on this branch while PR 1 translations are not yet merged to main.
  const syncMetricsDict = dict.syncMetrics as unknown as ExtendedSyncMetricsDict;

  const breathing = metrics.breathingSyncPercent;
  let statusText = syncMetricsDict.status?.stable || "Stable";
  let statusColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";

  if (breathing < 50) {
    statusText = syncMetricsDict.status?.attention || "Attention Needed";
    statusColor = "bg-destructive/10 text-destructive border-destructive/20";
  } else if (breathing < 80) {
    statusText = syncMetricsDict.status?.needsPractice || "Needs Practice";
    statusColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle>{syncMetricsDict.title}</CardTitle>
            <Badge variant="outline" className={statusColor}>
              {statusText}
            </Badge>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer focus:outline-none"
          >
            {isExpanded ? (
              <>
                Hide Details <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show Details <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
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

          {isExpanded && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-4 border-t animate-in fade-in duration-200">
              <Stat
                label={syncMetricsDict.breathingSync}
                value={`${metrics.breathingSyncPercent}%`}
                tooltipText={syncMetricsDict.explanations?.breathingSync || ""}
              />
              <Stat
                label={syncMetricsDict.tapSync}
                value={`${metrics.tapSyncPercent}%`}
                tooltipText={syncMetricsDict.explanations?.tapSync || ""}
              />
              <Stat
                label={syncMetricsDict.timeToSync}
                value={`${metrics.timeToSyncSeconds} ${dict.common.seconds}`}
                tooltipText={syncMetricsDict.explanations?.timeToSync || ""}
              />
              <Stat
                label={syncMetricsDict.desyncEvents}
                value={`${metrics.desyncEvents}`}
                tooltipText={syncMetricsDict.explanations?.desyncEvents || ""}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
