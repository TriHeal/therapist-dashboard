import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { logMissionPractice } from "@/lib/actions/missions.actions";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { Mission } from "@/types";

const STATUS_VARIANT = {
  active: "default",
  completed: "outline",
  paused: "secondary",
} as const;

export async function MissionCard({ mission }: { mission: Mission }) {
  const { dict } = await getDictionary();
  const percent = Math.round((mission.completedCount / mission.targetCount) * 100);

  return (
    <Card>
      <CardContent className="space-y-3 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{mission.title}</p>
            <p className="text-sm text-muted-foreground">{dict.missions.type[mission.type]}</p>
          </div>
          <Badge variant={STATUS_VARIANT[mission.status]}>{dict.missions.status[mission.status]}</Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{dict.missions.progress}</span>
            <span>
              {mission.completedCount}/{mission.targetCount}
            </span>
          </div>
          <Progress value={percent} />
        </div>
        {mission.status === "active" && (
          <form action={logMissionPractice}>
            <input type="hidden" name="missionId" value={mission.id} />
            <input type="hidden" name="patientId" value={mission.patientId} />
            <Button type="submit" size="sm" variant="outline">
              {dict.missions.logPractice}
            </Button>
          </form>
        )}
        {mission.status === "completed" && mission.completedAt && (
          <p className="text-xs text-muted-foreground">
            {dict.missions.completedOn} {new Date(mission.completedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
