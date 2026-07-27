"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveRocksBreakFlow } from "@/lib/actions/rocks-break-flow.actions";
import type { RocksBreakFlowDetails } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function RocksBreakFlowForm({
  sessionId,
  patientId,
  dict,
  initialDetails,
}: {
  sessionId: string;
  patientId: string;
  dict: Dictionary;
  initialDetails?: RocksBreakFlowDetails;
}) {
  const router = useRouter();

  const activitiesHref =
    `/therapist/patients/${patientId}/sessions/${sessionId}` +
    "/activities/event-processing";

  const [whatHappened, setWhatHappened] = useState(
    initialDetails?.eventTitle ?? "",
  );

  const [facts, setFacts] = useState(
    initialDetails?.facts?.length ? initialDetails.facts : [""],
  );

  const [interpretations, setInterpretations] = useState(
    initialDetails?.thoughts?.length ? initialDetails.thoughts : [""],
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateList(
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) {
    setValues(
      values.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function removeListItem(
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
  ) {
    if (values.length === 1) return;

    setValues(values.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleApprove() {
    setSubmitting(true);
    setError(null);

    const result = await saveRocksBreakFlow(
      sessionId,
      whatHappened,
      facts,
      interpretations,
    );

    if ("error" in result) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    router.replace(activitiesHref);
  }

  function handleCancel() {
    router.push(activitiesHref);
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>{dict.rocksFlow.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-7 pt-6">
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>{dict.rocksFlow.errorTitle}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="what-happened">
              {dict.rocksFlow.whatHappened}
            </Label>

            <Textarea
              id="what-happened"
              value={whatHappened}
              onChange={(event) => setWhatHappened(event.target.value)}
              className="min-h-32 resize-y"
            />
          </div>

          <div className="space-y-3">
            <Label>{dict.rocksFlow.facts}</Label>

            {facts.map((fact, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={fact}
                  onChange={(event) =>
                    updateList(facts, setFacts, index, event.target.value)
                  }
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={facts.length === 1 || submitting}
                  onClick={() => removeListItem(facts, setFacts, index)}
                  aria-label={dict.rocksFlow.removeFact}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() => setFacts((current) => [...current, ""])}
            >
              <Plus className="h-4 w-4" />
              {dict.rocksFlow.addFact}
            </Button>
          </div>

          <div className="space-y-3">
            <Label>{dict.rocksFlow.interpretations}</Label>

            {interpretations.map((interpretation, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={interpretation}
                  onChange={(event) =>
                    updateList(
                      interpretations,
                      setInterpretations,
                      index,
                      event.target.value,
                    )
                  }
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={interpretations.length === 1 || submitting}
                  onClick={() =>
                    removeListItem(interpretations, setInterpretations, index)
                  }
                  aria-label={dict.rocksFlow.removeInterpretation}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() =>
                setInterpretations((current) => [...current, ""])
              }
            >
              <Plus className="h-4 w-4" />
              {dict.rocksFlow.addInterpretation}
            </Button>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={handleCancel}
            >
              {dict.common.cancel}
            </Button>

            <Button
              type="button"
              disabled={submitting}
              onClick={handleApprove}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}

              {dict.rocksFlow.save}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}