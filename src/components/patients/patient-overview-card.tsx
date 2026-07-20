"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Baby, Pencil} from "lucide-react";
import { PatientAvatar } from "@/components/patients/patient-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PATIENT_STATUS_BADGE_VARIANT } from "@/lib/constants";
import { updatePatient } from "@/lib/actions/patients.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type {
  Patient,
  PatientSex,
  PatientStatus,
} from "@/types";

export function PatientOverviewCard({
  patient,
  dict,
  locale,
}: {
  patient: Patient;
  dict: Dictionary;
  locale: "he" | "en";
}) {
  const router = useRouter();
  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(patient.displayName);
  const [age, setAge] = useState(String(patient.age));
  const [sex, setSex] = useState<PatientSex>(patient.sex);
  const [status, setStatus] = useState<PatientStatus>(patient.status);
  const [parentSharingEnabled, setParentSharingEnabled] = useState(
    patient.parentSharingEnabled,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parentCount = patient.parentIds.length;

  function cancelEditing() {
    setDisplayName(patient.displayName);
    setAge(String(patient.age));
    setSex(patient.sex);
    setStatus(patient.status);
    setParentSharingEnabled(patient.parentSharingEnabled);
    setError(null);
    setEditing(false);
  }

  async function savePatient() {
    const parsedAge = Number(age);

    if (
      !displayName.trim() ||
      !Number.isInteger(parsedAge) ||
      parsedAge < 0
    ) {
      setError(dict.provisioning.errorGeneric);
      return;
    }

    setSaving(true);
    setError(null);

    const result = await updatePatient(patient.id, {
      displayName: displayName.trim(),
      age: parsedAge,
      sex,
      status,
      parentSharingEnabled,
    });

    setSaving(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <section className="rounded-lg border p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{patient.displayName}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="patient-name">
              {dict.patientForm.fullName}
            </Label>
            <Input
              id="patient-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="patient-age">
              {dict.patientForm.age}
            </Label>
            <Input
              id="patient-age"
              type="number"
              min={0}
              step={1}
              value={age}
              onChange={(event) => setAge(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>{dict.patientForm.sex}</Label>
            <Select
              value={sex}
              onValueChange={(value) => setSex(value as PatientSex)}
            >
              <SelectTrigger className="w-full">
                <span>
                  {sex === "male"
                    ? dict.patientForm.sexMale
                    : sex === "female"
                      ? dict.patientForm.sexFemale
                      : dict.patientForm.sexUnspecified}
                </span>
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

          <div className="grid gap-2">
            <Label>{dict.patientTable.status}</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as PatientStatus)
              }
            >
              <SelectTrigger className="w-full">
                <span>{dict.patientStatus[status]}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {dict.patientStatus.active}
                </SelectItem>
                <SelectItem value="paused">
                  {dict.patientStatus.paused}
                </SelectItem>
                <SelectItem value="completed">
                  {dict.patientStatus.completed}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
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
          <p className="mt-4 text-sm text-destructive">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={cancelEditing}
          >
            {dict.common.cancel}
          </Button>

          <Button
            type="button"
            disabled={saving}
            onClick={savePatient}
          >
            {saving ? "..." : dict.common.save}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border p-5">
      <div className="flex items-start gap-4">
        <PatientAvatar
          sex={patient.sex}
          avatarUrl={patient.avatarUrl}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">
              {patient.displayName}
            </h2>
            <Badge variant={PATIENT_STATUS_BADGE_VARIANT[patient.status]}>
              {dict.patientStatus[patient.status]}
            </Badge>
          </div>

          <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
            <p>
              {dict.common.age} {patient.age}
            </p>
            <p>
              {dict.common.enrolled}{" "}
              {new Date(patient.enrolledAt).toLocaleDateString(
                dateLocale,
              )}
            </p>
            <p>
              {parentCount} {dict.parentSection.linkedCountLabel}
            </p>
            <p>
              {dict.common.parentSharing}:{" "}
              {patient.parentSharingEnabled
                ? dict.common.enabled
                : dict.common.disabled}
            </p>
            <p>
              {patient.childUid
                ? dict.patientOverview.childConnected
                : dict.patientOverview.childNotConnected}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-4" />
          {dict.common.edit}
        </Button>
      </div>
    </section>
  );
}
