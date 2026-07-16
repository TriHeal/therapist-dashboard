import { AppHeader } from "@/components/layout/app-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getMyChild, getMyChildActivities, getMyChildReflections } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentHomePage() {
  const [{ dict }, child, activities, reflections] = await Promise.all([
    getDictionary(),
    getMyChild(),
    getMyChildActivities(),
    getMyChildReflections(),
  ]);

  const activeActivities = activities.filter((m) => m.status === "active");

  return (
    <>
      <AppHeader title={dict.parentHome.title} description={dict.parentHome.description} />
      <div className="p-6 space-y-6">
        {child && (
          <Card size="sm">
            <CardHeader>
              <CardTitle>{dict.parentHome.childCard}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {child.displayName} · {dict.common.age} {child.age}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>{dict.parentHome.activeActivitiesTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {dict.parentHome.noActiveActivities}
                </p>
              ) : (
                activeActivities.map((activity) => (
                  <div key={activity.id} className="space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <Progress
                      value={(activity.completedCount / activity.targetCount) * 100}
                    />
                    <p className="text-xs text-muted-foreground">
                      {activity.completedCount}/{activity.targetCount}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>{dict.parentHome.recentReflectionsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reflections.length === 0 ? (
                <p className="text-sm text-muted-foreground">{dict.parentHome.noReflections}</p>
              ) : (
                reflections.slice(0, 3).map((r) => (
                  <p key={r.id} className="text-sm text-muted-foreground line-clamp-2">
                    {r.whatHappened}
                  </p>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
