"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  startLiveSessionActivity,
  stopLiveSessionActivity,
} from "@/lib/actions/live-session-activities.actions";
import Link from "next/link";
import type { LiveSessionActivityRun } from "@/lib/data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

type SessionActivity = {
  type: string;
  order: number;
  status: string;
};

export function LiveSessionActivityControls({
  sessionId,
  patientId,
  activities,
  activityRuns,
  dict,
  locale,
  canStartActivities,
}: {
  sessionId: string;
  patientId: string;
  activities: SessionActivity[];
  activityRuns: LiveSessionActivityRun[];
  dict: Dictionary;
  locale: Locale;
  canStartActivities: boolean;
}) {
  const router = useRouter();
  const [loadingActivity, setLoadingActivity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sortedActivities = [...activities].sort(
    (first, second) => first.order - second.order,
  );

  const hasActiveActivity = sortedActivities.some(
    (activity) => activity.status === "active",
  );

  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  const activeEventProcessingRun = activityRuns.find(
    (run) => run.activityType === "event_processing" && run.status === "active",
  );

  const completedEventProcessingRuns = activityRuns
    .filter(
      (run) =>
        run.activityType === "event_processing" && run.status === "completed",
    )
    .sort(
      (first, second) =>
        new Date(second.startedAt).getTime() -
        new Date(first.startedAt).getTime(),
    );

  const getActivityName = (type: string) =>
    (dict.newSessionDialog as Record<string, string>)[type] || type;

  const getActivityStatus = (status: string) => {
    switch (status) {
      case "pending":
        return dict.liveDetail.activityPending;
      case "active":
        return dict.liveDetail.activityActive;
      case "completed":
        return dict.liveDetail.activityCompleted;
      default:
        return status;
    }
  };

  async function handleStart(activityType: string) {
    setLoadingActivity(`start-${activityType}`);
    setError(null);

    const result = await startLiveSessionActivity(
      sessionId,
      patientId,
      activityType,
    );

    if ("error" in result) {
      setError(result.error);
    } else if (activityType === "event_processing") {
      router.push(
        `/therapist/patients/${patientId}/sessions/${sessionId}/activities/${result.activityId}`,
      );
    } else {
      router.refresh();
    }

    setLoadingActivity(null);
  }

  async function handleStop(activityType: string) {
    setLoadingActivity(`stop-${activityType}`);
    setError(null);

    const result = await stopLiveSessionActivity(sessionId, patientId);

    if ("error" in result) {
      setError(result.error);
    } else {
      router.refresh();
    }

    setLoadingActivity(null);
  }

  return (
    <div className="space-y-3">
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{dict.liveDetail.activityUpdateError}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {sortedActivities.map((activity) => {
        const isStarting = loadingActivity === `start-${activity.type}`;
        const isStopping = loadingActivity === `stop-${activity.type}`;
        const isBusy = loadingActivity !== null;

        return (
          <div
            key={`${activity.type}-${activity.order}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-3"
          >
            <div>
              <p className="font-medium">{getActivityName(activity.type)}</p>
              <p className="text-sm text-muted-foreground">
                {getActivityStatus(activity.status)}
              </p>
            </div>

            {(activity.status === "pending" ||
              activity.status === "completed") &&
            !hasActiveActivity ? (
              <Button
                size="sm"
                disabled={isBusy || !canStartActivities}
                onClick={() => handleStart(activity.type)}
              >
                {isStarting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {dict.liveDetail.startingActivity}
                  </>
                ) : activity.status === "completed" ? (
                  dict.liveDetail.startActivityAgain
                ) : (
                  dict.liveDetail.startActivity
                )}
              </Button>
            ) : null}

            {activity.status === "active" ? (
              activity.type === "event_processing" &&
              activeEventProcessingRun ? (
                <Button
                  size="sm"
                  render={
                    <Link
                      href={`/therapist/patients/${patientId}/sessions/${sessionId}/activities/${activeEventProcessingRun.id}`}
                    >
                      {dict.rocksFlow.openActivity}
                    </Link>
                  }
                />
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isBusy}
                  onClick={() => handleStop(activity.type)}
                >
                  {isStopping ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {dict.liveDetail.stoppingActivity}
                    </>
                  ) : (
                    dict.liveDetail.stopActivity
                  )}
                </Button>
              )
            ) : null}
          </div>
        );
      })}

      {completedEventProcessingRuns.length > 0 ? (
        <div className="space-y-3 border-t pt-4">
          <h4 className="text-sm font-semibold">
            {dict.rocksFlow.previousActivities}
          </h4>

          {completedEventProcessingRuns.map((run, index) => (
            <div
              key={run.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-3"
            >
              <div>
                <p className="font-medium">
                  {dict.rocksFlow.eventLabel}{" "}
                  {completedEventProcessingRuns.length - index}
                </p>

                <p className="text-sm text-muted-foreground">
                  {new Date(run.startedAt).toLocaleString(dateLocale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                render={
                  <Link
                    href={`/therapist/patients/${patientId}/sessions/${sessionId}/activities/${run.id}`}
                  >
                    {dict.rocksFlow.viewActivity}
                  </Link>
                }
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
