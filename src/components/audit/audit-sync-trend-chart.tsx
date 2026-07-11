"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { ParentAuditEntry } from "@/types";

// Parent-reported Sync Score over time — the "trend line" half of AC #4. Modeled on
// sessions/sync-trend-chart.tsx (single line instead of two).
export function AuditSyncTrendChart({
  data,
  dict,
  locale,
}: {
  data: ParentAuditEntry[];
  dict: Dictionary;
  locale: Locale;
}) {
  const chartConfig: ChartConfig = {
    syncScore: { label: dict.progressPage.auditScoreLabel, color: "var(--chart-1)" },
  };

  const dateLocale = locale === "he" ? "he-IL" : "en-US";
  const chartData = [...data]
    .sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime())
    .map((d) => ({
      ...d,
      dateLabel: new Date(d.loggedAt).toLocaleDateString(dateLocale, {
        month: "short",
        day: "numeric",
      }),
    }));

  return (
    <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} orientation="right" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="syncScore"
          stroke="var(--color-syncScore)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
