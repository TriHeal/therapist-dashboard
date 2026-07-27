"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  startLiveSessionActivity,
  stopLiveSessionActivity,
} from "@/lib/actions/live-session-activities.actions";
import type { LiveSessionActivityRun } from "@/lib/data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

function hasRunContent(run: LiveSessionActivityRun): boolean {
  const hasEventTitle = Boolean(run.details.eventTitle?.trim());

  const hasFacts = Boolean(
    run.details.facts?.some((value) => value.trim().length > 0),
  );

  const hasThoughts = Boolean(
    run.details.thoughts?.some((value) => value.trim().length > 0),
  );

  return hasEventTitle || hasFacts || hasThoughts;
}

export function EventProcessingRunsTable({
  patientId,
  sessionId,
  runs,
  sessionInProgress,
  dict,
  locale,
}: {
  patientId: string;
  sessionId: string;
  runs: LiveSessionActivityRun[];
  sessionInProgress: boolean;
  dict: Dictionary;
  locale: Locale;
}) {
  const router = useRouter();

  const [starting, setStarting] = useState(false);
  const [stoppingRunId, setStoppingRunId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  // Empty completed runs represent activities that were cancelled before approval.
  const visibleRuns = runs.filter(
    (run) => run.status === "active" || hasRunContent(run),
  );

  const sortedRuns = [...visibleRuns].sort(
    (first, second) =>
      new Date(second.startedAt).getTime() -
      new Date(first.startedAt).getTime(),
  );

  const hasActiveRun = runs.some((run) => run.status === "active");
  const isBusy = starting || stoppingRunId !== null;

  const runHref = (runId: string) =>
    `/therapist/patients/${patientId}/sessions/${sessionId}` +
    `/activities/event-processing/runs/${runId}`;

  async function handleNewActivity() {
    setStarting(true);
    setError(null);

    const result = await startLiveSessionActivity(
      sessionId,
      patientId,
      "event_processing",
    );

    if ("error" in result) {
      setError(result.error);
      setStarting(false);
      return;
    }

    router.push(runHref(result.activityId));
  }

  async function handleStopRun(runId: string) {
    setStoppingRunId(runId);
    setError(null);

    const result = await stopLiveSessionActivity(sessionId, patientId);

    if ("error" in result) {
      setError(result.error);
      setStoppingRunId(null);
      return;
    }

    setStoppingRunId(null);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight">
          {dict.rocksFlow.previousActivities}
        </h2>

        {sessionInProgress ? (
          <Button
            type="button"
            className="w-full sm:w-auto"
            disabled={isBusy || hasActiveRun}
            onClick={handleNewActivity}
          >
            {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {dict.rocksFlow.newActivity}
          </Button>
        ) : null}
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>{dict.liveDetail.activityUpdateError}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {sortedRuns.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {dict.rocksFlow.noActivities}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[80px]">
                  {dict.rocksFlow.eventLabel}
                </TableHead>

                <TableHead>{dict.rocksFlow.whatHappened}</TableHead>

                <TableHead className="w-[210px]">
                  {dict.rocksFlow.startedAt}
                </TableHead>

                <TableHead className="w-[130px]">
                  {dict.rocksFlow.statusLabel}
                </TableHead>

                <TableHead className="w-[260px]">
                  {dict.sessionsTable.actions}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedRuns.map((run, index) => {
                const eventTitle = run.details.eventTitle?.trim();
                const approved = hasRunContent(run);
                const isStopping = stoppingRunId === run.id;

                return (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">
                      #{sortedRuns.length - index}
                    </TableCell>

                    <TableCell
                      className="max-w-md truncate"
                      title={eventTitle || undefined}
                    >
                      {eventTitle || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {new Date(run.startedAt).toLocaleString(dateLocale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          run.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {run.status === "completed"
                          ? dict.liveDetail.activityCompleted
                          : dict.liveDetail.activityActive}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {run.status === "completed" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          nativeButton={false}
                          render={
                            <Link href={runHref(run.id)}>
                              {dict.rocksFlow.viewActivity}
                            </Link>
                          }
                        />
                      ) : approved ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            nativeButton={false}
                            disabled={isBusy}
                            render={
                              <Link href={runHref(run.id)}>
                                {dict.rocksFlow.viewActivity}
                              </Link>
                            }
                          />

                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={isBusy}
                            onClick={() => handleStopRun(run.id)}
                          >
                            {isStopping ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}

                            {dict.rocksFlow.stopActivity}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            nativeButton={false}
                            disabled={isBusy}
                            render={
                              <Link href={runHref(run.id)}>
                                {dict.rocksFlow.continueActivity}
                              </Link>
                            }
                          />

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isBusy}
                            onClick={() => handleStopRun(run.id)}
                          >
                            {isStopping ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}

                            {dict.common.cancel}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}