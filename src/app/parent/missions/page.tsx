import { AppHeader } from "@/components/layout/app-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getMyChildMissions } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentMissionsPage() {
  const [{ dict }, missions] = await Promise.all([getDictionary(), getMyChildMissions()]);

  return (
    <>
      <AppHeader
        title={dict.parentMissionsPage.title}
        description={dict.parentMissionsPage.description}
      />
      <div className="p-6 space-y-4">
        {missions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.parentMissionsPage.noMissions}</p>
        ) : (
          missions.map((mission) => (
            <Card key={mission.id} size="sm">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{mission.title}</CardTitle>
                <Badge variant={mission.status === "active" ? "default" : "secondary"}>
                  {dict.missions.status[mission.status]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={(mission.completedCount / mission.targetCount) * 100} />
                <p className="text-xs text-muted-foreground">
                  {mission.completedCount}/{mission.targetCount}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
