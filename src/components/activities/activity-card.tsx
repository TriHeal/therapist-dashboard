import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { logActivityPractice } from "@/lib/actions/activities.actions";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { Activity } from "@/types";

const STATUS_VARIANT = {
  active: "default",
  completed: "outline",
  paused: "secondary",
} as const;

export async function ActivityCard({ activity }: { activity: Activity }) {
  const { dict } = await getDictionary();
  const percent = Math.round((activity.completedCount / activity.targetCount) * 100);

  return (
    <Card>
      <CardContent className="space-y-3 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{dict.activities.type[activity.type]}</p>
          </div>
          <Badge variant={STATUS_VARIANT[activity.status]}>{dict.activities.status[activity.status]}</Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{dict.activities.progress}</span>
            <span>
              {activity.completedCount}/{activity.targetCount}
            </span>
          </div>
          <Progress value={percent} />
        </div>
        {activity.status === "active" && (
          <form action={logActivityPractice}>
            <input type="hidden" name="missionId" value={activity.id} />
            <input type="hidden" name="patientId" value={activity.patientId} />
            <Button type="submit" size="sm" variant="outline">
              {dict.activities.logPractice}
            </Button>
          </form>
        )}
        {activity.status === "completed" && activity.completedAt && (
          <p className="text-xs text-muted-foreground">
            {dict.activities.completedOn} {new Date(activity.completedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
