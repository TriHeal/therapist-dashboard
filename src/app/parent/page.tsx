import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getMyChild,
  getMyChildActivities,
  getMyChildReflections,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentHomePage() {
  const [{ dict, locale }, child, activities, reflections] = await Promise.all([
    getDictionary(),
    getMyChild(),
    getMyChildActivities(),
    getMyChildReflections(),
  ]);

  const activeActivities = activities.filter((m) => m.status === "active");
  const latestActivity = activeActivities[0];
  const latestReflection = reflections[0];

  return (
    <>
      <AppHeader
        title={dict.parentHome.title}
        description={dict.parentHome.description}
      />
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

        <Card size="sm">
          <CardHeader className="flex items-center justify-between gap-4">
            <CardTitle>{dict.parentHome.activeActivitiesTitle}</CardTitle>
            <Link
              href="/parent/activities"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {dict.parentHome.viewActivities}
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {!latestActivity ? (
              <p className="text-sm text-muted-foreground">
                {dict.parentHome.noActiveActivities}
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium">{latestActivity.title}</p>
                <Progress
                  value={
                    (latestActivity.completedCount /
                      latestActivity.targetCount) *
                    100
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {latestActivity.completedCount}/{latestActivity.targetCount}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>{dict.parentHome.recentReflectionsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!latestReflection ? (
              <p className="text-sm text-muted-foreground">
                {dict.parentHome.noReflections}
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(latestReflection.loggedAt).toLocaleDateString(
                    locale,
                  )}
                </p>
                <p className="text-sm">{latestReflection.whatHappened}</p>
                {latestReflection.parentNotes ? (
                  <p className="text-sm text-muted-foreground">
                    {latestReflection.parentNotes}
                  </p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
