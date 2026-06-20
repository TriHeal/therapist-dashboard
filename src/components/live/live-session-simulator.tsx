"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type EdiStep = "idle" | "fact" | "interpretation" | "separate" | "done";

export function LiveSessionSimulator({ dict }: { dict: Dictionary }) {
  const [syncing, setSyncing] = useState(false);
  const [syncPercent, setSyncPercent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [step, setStep] = useState<EdiStep>("idle");
  const [fact, setFact] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [boatProgress, setBoatProgress] = useState(0);

  useEffect(() => {
    if (syncing) {
      intervalRef.current = setInterval(() => {
        setSyncPercent((prev) => {
          const next = prev + (Math.random() * 12 - 3);
          return Math.max(0, Math.min(100, next));
        });
      }, 600);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [syncing]);

  function handleRecordFact() {
    if (!fact.trim()) return;
    setStep("interpretation");
  }

  function handleRecordInterpretation() {
    if (!interpretation.trim()) return;
    setStep("separate");
  }

  function handleSeparate() {
    setStep("done");
    setBoatProgress((prev) => Math.min(100, prev + 25));
  }

  function handleReset() {
    setStep("idle");
    setFact("");
    setInterpretation("");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dict.liveDetail.breathingSyncLive}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <Button onClick={() => setSyncing((s) => !s)} variant={syncing ? "secondary" : "default"}>
              {syncing ? dict.liveDetail.stopSync : dict.liveDetail.startSync}
            </Button>
            <span className="text-sm text-muted-foreground">
              {syncing ? dict.liveDetail.syncing : dict.liveDetail.awaitingConnection}
            </span>
          </div>
          <Progress value={syncPercent} />
          <p className="text-sm text-muted-foreground">{Math.round(syncPercent)}%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dict.liveDetail.ediCurrent}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "idle" && (
            <div className="space-y-2">
              <Label htmlFor="fact">{dict.liveDetail.factLabel}</Label>
              <Input
                id="fact"
                value={fact}
                onChange={(e) => setFact(e.target.value)}
                placeholder={dict.liveDetail.factPlaceholder}
              />
              <Button size="sm" onClick={handleRecordFact}>
                {dict.liveDetail.recordFact}
              </Button>
            </div>
          )}

          {step === "interpretation" && (
            <div className="space-y-3">
              <p className="text-sm">
                <Badge variant="outline">{dict.edi.fact}</Badge> {fact}
              </p>
              <Label htmlFor="interpretation">{dict.liveDetail.interpretationLabel}</Label>
              <Input
                id="interpretation"
                value={interpretation}
                onChange={(e) => setInterpretation(e.target.value)}
                placeholder={dict.liveDetail.interpretationPlaceholder}
              />
              <Button size="sm" onClick={handleRecordInterpretation}>
                {dict.liveDetail.recordInterpretation}
              </Button>
            </div>
          )}

          {step === "separate" && (
            <div className="space-y-3">
              <p className="text-sm">
                <Badge variant="outline">{dict.edi.fact}</Badge> {fact}
              </p>
              <p className="text-sm">
                <Badge variant="outline">{dict.edi.interpretation}</Badge> {interpretation}
              </p>
              <Button size="sm" onClick={handleSeparate}>
                {dict.liveDetail.separateButton}
              </Button>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{dict.liveDetail.stepperComplete}</p>
              <Button size="sm" variant="outline" onClick={handleReset}>
                {dict.liveDetail.resetStepper}
              </Button>
            </div>
          )}

          {step === "idle" && boatProgress === 0 ? null : (
            <div className="space-y-1 pt-2">
              <p className="text-xs text-muted-foreground">{dict.liveDetail.boatProgress}</p>
              <Progress value={boatProgress} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
