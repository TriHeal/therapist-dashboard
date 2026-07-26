"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { endTherapySession } from "@/lib/actions/therapy-sessions.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function EndSessionButton({
  sessionId,
  patientId,
  dict,
  hasActiveActivity,
}: {
  sessionId: string;
  patientId: string;
  dict: Dictionary;
  hasActiveActivity: boolean;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleEndSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hasActiveActivity) {
      setError(dict.liveDetail.activeActivityMustBeStopped);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await endTherapySession(
        sessionId,
        patientId,
        notes,
      );

      if ("error" in result) {
        setError(
          result.error === "active_activity"
            ? dict.liveDetail.activeActivityMustBeStopped
            : dict.liveDetail.endSessionError,
        );
        return;
      }

      router.replace(`/therapist/patients/${patientId}/sessions`);
    } catch (caughtError) {
      console.error("Error ending therapy session:", caughtError);
      setError(dict.liveDetail.endSessionError);
    } finally {
      setLoading(false);
    }
  }

  const displayedError = hasActiveActivity
    ? dict.liveDetail.activeActivityMustBeStopped
    : error;

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">
          {dict.liveDetail.endSession}
        </CardTitle>

        <CardDescription>
          {dict.liveDetail.endSessionDesc}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleEndSession} className="space-y-4">
          {displayedError ? (
            <Alert variant="destructive">
              <AlertTitle>{dict.liveDetail.endSession}</AlertTitle>
              <AlertDescription>
                {displayedError}
              </AlertDescription>
            </Alert>
          ) : null}

          {(error || hasActiveActivity) ? (
            <Alert variant="destructive">
              <AlertTitle>{dict.common.error}</AlertTitle>
              <AlertDescription>
                {hasActiveActivity
                  ? dict.liveDetail.activeActivityMustBeStopped
                  : error}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="notes">
              {dict.newSessionDialog.notes}
            </Label>

            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={dict.newSessionDialog.notes}
              className="h-24 resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            disabled={loading || hasActiveActivity}
            className="w-full cursor-pointer gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}

            {dict.liveDetail.endSessionSubmit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}