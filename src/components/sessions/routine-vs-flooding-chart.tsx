"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { RoutineVsFloodingPoint } from "@/types";

export function RoutineVsFloodingChart({
  data,
  dict,
}: {
  data: RoutineVsFloodingPoint[];
  dict: Dictionary;
}) {
  const chartConfig: ChartConfig = {
    avgTimeToSyncSeconds: { label: dict.syncMetrics.timeToSync, color: "var(--chart-3)" },
  };

  const chartData = data.map((d) => ({ ...d, typeLabel: dict.sessionType[d.type] }));

  return (
    <ChartContainer config={chartConfig} className="h-[240px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="typeLabel" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} orientation="right" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="avgTimeToSyncSeconds" fill="var(--color-avgTimeToSyncSeconds)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
