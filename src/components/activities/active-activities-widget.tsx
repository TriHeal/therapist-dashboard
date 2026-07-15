import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { Activity, Patient } from "@/types";

export async function ActiveActivitiesWidget({
  activities,
  patientsById,
  title,
  emptyText,
}: {
  activities: Activity[];
  patientsById?: Map<string, Patient>;
  title?: string;
  emptyText?: string;
}) {
  const { dict } = await getDictionary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? dict.home.activeActivitiesWidget}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText ?? dict.home.noActiveActivities}</p>
        ) : (
          activities.map((m) => {
            const percent = Math.round((m.completedCount / m.targetCount) * 100);
            return (
              <div key={m.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {patientsById ? patientsById.get(m.patientId)?.displayName : null} {m.title}
                  </span>
                  <span className="text-muted-foreground">
                    {m.completedCount}/{m.targetCount}
                  </span>
                </div>
                <Progress value={percent} />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
