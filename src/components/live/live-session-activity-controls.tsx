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
import type { Dictionary } from "@/lib/i18n/dictionaries";

type SessionActivity = {
  type: string;
  order: number;
  status: string;
};

export function LiveSessionActivityControls({
  sessionId,
  patientId,
  activities,
  dict,
}: {
  sessionId: string;
  patientId: string;
  activities: SessionActivity[];
  dict: Dictionary;
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
                disabled={isBusy}
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
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
