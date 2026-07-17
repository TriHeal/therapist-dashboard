"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { assignActivity } from "@/lib/actions/activities.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ActivityType } from "@/types";

export function AssignActivityDialog({ patientId, dict }: { patientId: string; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await assignActivity(formData);
    setOpen(false);
    formRef.current?.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>{dict.activities.assignNew}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.activities.dialogTitle}</DialogTitle>
          <DialogDescription>{dict.activities.dialogDescription}</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="patientId" value={patientId} />
          <div className="space-y-2">
            <Label htmlFor="title">{dict.activities.fieldTitle}</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder={dict.activities.fieldTitlePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{dict.activities.fieldType}</Label>
            <RadioGroup name="type" defaultValue="routine" className="flex flex-col gap-2">
              {(["routine", "flooding-prep", "custom"] as ActivityType[]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <RadioGroupItem value={type} id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="font-normal">
                    {dict.activities.type[type]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCount">{dict.activities.fieldTarget}</Label>
            <Input id="targetCount" name="targetCount" type="number" min={1} defaultValue={3} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {dict.common.cancel}
            </Button>
            <Button type="submit">{dict.activities.submit}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
