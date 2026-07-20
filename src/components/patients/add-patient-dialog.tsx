"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPatient } from "@/lib/actions/patients.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { PatientSex } from "@/types";

export function AddPatientDialog({ dict }: { dict: Dictionary }) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [sex, setSex] = useState<PatientSex>("unspecified");
  const [parentSharingEnabled, setParentSharingEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setSex("unspecified");
    setParentSharingEnabled(false);
    setLoading(false);
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      reset();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const displayName = String(formData.get("displayName") ?? "").trim();
    const age = Number(formData.get("age"));

    if (!displayName || !Number.isInteger(age) || age < 0) {
      setError(dict.provisioning.errorGeneric);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createPatient({
      displayName,
      age,
      sex,
      parentSharingEnabled,
    });

    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    handleOpenChange(false);
    router.push(`/therapist/patients/${result.id}`);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
        {dict.home.addPatient}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{dict.home.addPatient}</DialogTitle>
            <DialogDescription>
              {dict.patientForm.dialogDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-5">
            <div className="grid gap-2">
              <Label htmlFor="patient-display-name">
                {dict.patientForm.fullName}
              </Label>
              <Input
                id="patient-display-name"
                name="displayName"
                placeholder={dict.patientForm.fullNamePlaceholder}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="patient-age">
                {dict.patientForm.age}
              </Label>
              <Input
                id="patient-age"
                name="age"
                type="number"
                min={0}
                step={1}
                placeholder={dict.patientForm.agePlaceholder}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>{dict.patientForm.sex}</Label>

              <Select
                value={sex}
                onValueChange={(value) => setSex(value as PatientSex)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="male">
                    {dict.patientForm.sexMale}
                  </SelectItem>
                  <SelectItem value="female">
                    {dict.patientForm.sexFemale}
                  </SelectItem>
                  <SelectItem value="unspecified">
                    {dict.patientForm.sexUnspecified}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={parentSharingEnabled}
                onChange={(event) =>
                  setParentSharingEnabled(event.target.checked)
                }
                className="size-4 rounded border-input accent-primary"
              />

              <span>{dict.patientForm.parentSharingEnabled}</span>
            </label>

            {error && (
              <p className="text-sm text-destructive" aria-live="polite">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
            >
              {dict.common.cancel}
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "..." : dict.common.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
