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
import { assignMission } from "@/lib/actions/missions.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { MissionType } from "@/types";

export function AssignMissionDialog({ patientId, dict }: { patientId: string; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await assignMission(formData);
    setOpen(false);
    formRef.current?.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>{dict.missions.assignNew}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.missions.dialogTitle}</DialogTitle>
          <DialogDescription>{dict.missions.dialogDescription}</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="patientId" value={patientId} />
          <div className="space-y-2">
            <Label htmlFor="title">{dict.missions.fieldTitle}</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder={dict.missions.fieldTitlePlaceholder}
            />
          </div>
          <div className="space-y-2">
            <Label>{dict.missions.fieldType}</Label>
            <RadioGroup name="type" defaultValue="routine" className="flex flex-col gap-2">
              {(["routine", "flooding-prep", "custom"] as MissionType[]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <RadioGroupItem value={type} id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="font-normal">
                    {dict.missions.type[type]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetCount">{dict.missions.fieldTarget}</Label>
            <Input id="targetCount" name="targetCount" type="number" min={1} defaultValue={3} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {dict.common.cancel}
            </Button>
            <Button type="submit">{dict.missions.submit}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
