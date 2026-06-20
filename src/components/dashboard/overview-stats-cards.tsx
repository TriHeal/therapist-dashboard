import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/get-locale";

export async function OverviewStatsCards({
  activePatients,
  sessionsThisWeek,
  openAlerts,
}: {
  activePatients: number;
  sessionsThisWeek: number;
  openAlerts: number;
}) {
  const { dict } = await getDictionary();

  const stats = [
    { label: dict.home.activePatients, value: activePatients },
    { label: dict.home.sessionsThisWeek, value: sessionsThisWeek },
    { label: dict.home.openAlerts, value: openAlerts },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
