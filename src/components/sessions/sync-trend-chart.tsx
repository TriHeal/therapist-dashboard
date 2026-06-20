"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { SyncTrendPoint } from "@/types";

export function SyncTrendChart({
  data,
  dict,
  locale,
}: {
  data: SyncTrendPoint[];
  dict: Dictionary;
  locale: Locale;
}) {
  const chartConfig: ChartConfig = {
    breathingSyncPercent: { label: dict.syncMetrics.breathingSync, color: "var(--chart-1)" },
    tapSyncPercent: { label: dict.syncMetrics.tapSync, color: "var(--chart-2)" },
  };

  const dateLocale = locale === "he" ? "he-IL" : "en-US";
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString(dateLocale, { month: "short", day: "numeric" }),
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
          dataKey="breathingSyncPercent"
          stroke="var(--color-breathingSyncPercent)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="tapSyncPercent"
          stroke="var(--color-tapSyncPercent)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
