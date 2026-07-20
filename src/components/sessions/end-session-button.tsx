"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { endTherapySession } from "@/lib/actions/therapy-sessions.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function EndSessionButton({
  sessionId,
  patientId,
  dict,
}: {
  sessionId: string;
  patientId: string;
  dict: Dictionary;
}) {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const router = useRouter();

  const handleEndSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await endTherapySession(sessionId, patientId, notes);
      if ("error" in res) {
        alert(res.error);
      } else {
        router.push(`/therapist/patients/${patientId}/sessions`);
      }
    } catch (err) {
      console.error("Error ending therapy session:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">{dict.liveDetail.endSession}</CardTitle>
        <CardDescription>{dict.liveDetail.endSessionDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEndSession} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">{dict.newSessionDialog.notes}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={dict.newSessionDialog.notes}
              className="resize-none h-24"
            />
          </div>
          <Button
            type="submit"
            variant="destructive"
            disabled={loading}
            className="w-full gap-2 cursor-pointer"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {dict.liveDetail.endSessionSubmit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
