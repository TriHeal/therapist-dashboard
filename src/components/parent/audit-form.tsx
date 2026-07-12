"use client";

import { useId, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider, SliderValue } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { submitParentAudit } from "@/lib/actions/parent-audits.actions";
import { TRIGGER_TYPES, type TriggerType } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function AuditForm({ sessionId, dict }: { sessionId?: string; dict: Dictionary }) {
  const formRef = useRef<HTMLFormElement>(null);
  const triggerLabelId = useId();
  const scoreLabelId = useId();
  const t = dict.parentAuditPage;

  // Controlled so a native form.reset() actually clears the Base UI slider/radio, so we can
  // enforce the mandatory fields client-side, and so an untouched slider isn't recorded as a
  // deliberate score.
  const [triggerType, setTriggerType] = useState<TriggerType | "">("");
  const [score, setScore] = useState(50);
  const [scoreTouched, setScoreTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSubmit = triggerType !== "" && scoreTouched && !submitting;

  async function handleSubmit(formData: FormData) {
    // Belt-and-suspenders: the button is disabled until valid, but never trust the client.
    if (triggerType === "" || !scoreTouched) return;
    setSubmitting(true);
    setSaved(false);
    const res = await submitParentAudit(formData);
    setSubmitting(false);
    if (res.ok) {
      setTriggerType("");
      setScore(50);
      setScoreTouched(false);
      formRef.current?.reset(); // clears the uncontrolled note field
      setSaved(true);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      {sessionId && <input type="hidden" name="sessionId" value={sessionId} />}

      {/* Trigger Type — mandatory (AC #2), rendered as a button list */}
      <div className="space-y-2">
        <Label id={triggerLabelId}>{t.triggerLabel}</Label>
        <RadioGroup
          name="triggerType"
          aria-labelledby={triggerLabelId}
          value={triggerType}
          onValueChange={(value) => {
            setTriggerType(value as TriggerType);
            setSaved(false);
          }}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {TRIGGER_TYPES.map((type) => (
            <Label
              key={type}
              className="cursor-pointer justify-start rounded-lg border border-input px-3 py-2 font-normal transition-colors hover:bg-muted has-data-checked:border-primary has-data-checked:bg-primary/5"
            >
              <RadioGroupItem value={type} />
              <span>{t.triggerTypes[type]}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Sync Score — mandatory (AC #2), via slider. aria-labelledby names the thumb accessibly. */}
      <div className="space-y-2">
        <Slider
          name="syncScore"
          min={0}
          max={100}
          step={1}
          value={score}
          aria-labelledby={scoreLabelId}
          onValueChange={(value) => {
            setScore(Array.isArray(value) ? value[0] : (value as number));
            setScoreTouched(true);
            setSaved(false);
          }}
        >
          <div className="flex items-center justify-between">
            <Label id={scoreLabelId}>{t.scoreLabel}</Label>
            <SliderValue />
          </div>
        </Slider>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.scoreLow}</span>
          <span>{t.scoreHigh}</span>
        </div>
      </div>

      {/* Note — optional (AC #3) */}
      <div className="space-y-2">
        <Label htmlFor="note" className="font-normal">
          <span className="font-medium">{t.noteLabel}</span>
          <span className="text-muted-foreground">({t.noteOptional})</span>
        </Label>
        <Textarea id="note" name="note" rows={3} />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? t.saving : t.submit}
        </Button>
        {!canSubmit && !submitting && (
          <span className="text-xs text-muted-foreground">{t.requiredHint}</span>
        )}
        <span aria-live="polite" className="text-xs font-medium text-foreground">
          {saved ? t.saved : ""}
        </span>
      </div>
    </form>
  );
}
