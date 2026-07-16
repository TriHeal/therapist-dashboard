import { AppHeader } from "@/components/layout/app-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getMyChildActivities } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentActivitiesPage() {
  const [{ dict }, activities] = await Promise.all([getDictionary(), getMyChildActivities()]);

  return (
    <>
      <AppHeader
        title={dict.parentActivitiesPage.title}
        description={dict.parentActivitiesPage.description}
      />
      <div className="p-6 space-y-4">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.parentActivitiesPage.noActivities}</p>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} size="sm">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{activity.title}</CardTitle>
                <Badge variant={activity.status === "active" ? "default" : "secondary"}>
                  {dict.activities.status[activity.status]}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={(activity.completedCount / activity.targetCount) * 100} />
                <p className="text-xs text-muted-foreground">
                  {activity.completedCount}/{activity.targetCount}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
