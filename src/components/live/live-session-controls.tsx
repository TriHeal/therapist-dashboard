"use client";

import { ChildConnectionCodeCard } from "@/components/live/child-connection-code-card";
import { LiveSessionActivityControls } from "@/components/live/live-session-activity-controls";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { LiveSessionActivityRun } from "@/lib/data";

type SessionActivity = {
  type: string;
  order: number;
  status: string;
};

export function LiveSessionControls({
  sessionId,
  patientId,
  activities,
  activityRuns,
  dict,
  locale,
}: {
  sessionId: string;
  patientId: string;
  activities: SessionActivity[];
  activityRuns: LiveSessionActivityRun[];
  dict: Dictionary;
  locale: Locale;
}) {
  const storageKey = `triheal-child-code-generated:${sessionId}`;
  const [canStartActivities, setCanStartActivities] = useState(false);

  useEffect(() => {
    setCanStartActivities(sessionStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  function handleCodeGenerated() {
    sessionStorage.setItem(storageKey, "true");
    setCanStartActivities(true);
  }

  return (
    <div className="space-y-6">
      <ChildConnectionCodeCard
        patientId={patientId}
        dict={dict}
        locale={locale}
        onCodeGenerated={handleCodeGenerated}
      />

      <Card>
        <CardHeader>
          <CardTitle>{dict.liveDetail.plannedActivities}</CardTitle>
        </CardHeader>

        <CardContent>
          {activities.length > 0 ? (
            <LiveSessionActivityControls
              sessionId={sessionId}
              patientId={patientId}
              activities={activities}
              activityRuns={activityRuns}
              dict={dict}
              locale={locale}
              canStartActivities={canStartActivities}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {dict.liveDetail.noPlannedActivities}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
