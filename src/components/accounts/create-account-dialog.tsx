"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
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
import { createParentAccount } from "@/lib/actions/provisioning.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ParentRelationship } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+972|0)5\d{8}$/;

function normalizePhone(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export function CreateAccountDialog({
  dict,
  patientId,
  patientName,
}: {
  dict: Dictionary;
  patientId: string;
  patientName: string;
}) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] =
    useState<ParentRelationship>("mother");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedEmail = email.trim();
  const normalizedPhone = normalizePhone(phone);

  const emailValid = EMAIL_RE.test(normalizedEmail);
  const phoneValid =
    normalizedPhone.length === 0 || PHONE_RE.test(normalizedPhone);

  const canSubmit =
    fullName.trim().length > 0 && emailValid && phoneValid && !loading;

  function reset() {
    setFullName("");
    setRelationship("mother");
    setEmail("");
    setPhone("");
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

    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    const result = await createParentAccount({
      patientId,
      fullName,
      relationship,
      email: normalizedEmail || null,
      phone: normalizedPhone || null,
      requestAppAccess: true,
    });

    setLoading(false);

    if ("error" in result) {
      setError(
        result.error === "INVALID_EMAIL"
          ? dict.provisioning.errorInvalidEmail
          : result.error === "INVALID_PHONE"
            ? dict.provisioning.errorInvalidPhone
            : result.error === "SMS_FAILED"
              ? dict.provisioning.errorSmsFailed
              : dict.provisioning.errorGeneric,
      );
      return;
    }

    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <UserPlus className="size-4" />
        {dict.parentSection.addButton}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{dict.addParent.dialogTitle}</DialogTitle>
            <DialogDescription>
              {dict.addParent.dialogDescription.replace(
                "{patientName}",
                patientName,
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label htmlFor="parent-full-name">
                {dict.addParent.fields.fullName}
              </Label>
              <Input
                id="parent-full-name"
                value={fullName}
                placeholder={dict.addParent.fields.fullNamePlaceholder}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setError(null);
                }}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>{dict.addParent.fields.relationship}</Label>
              <Select
                value={relationship}
                onValueChange={(value) =>
                  setRelationship(value as ParentRelationship)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mother">
                    {dict.parentSection.relationshipLabels.mother}
                  </SelectItem>
                  <SelectItem value="father">
                    {dict.parentSection.relationshipLabels.father}
                  </SelectItem>
                  <SelectItem value="guardian">
                    {dict.parentSection.relationshipLabels.guardian}
                  </SelectItem>
                  <SelectItem value="other">
                    {dict.parentSection.relationshipLabels.other}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parent-email">
                {dict.addParent.fields.email}
              </Label>
              <Input
                id="parent-email"
                type="email"
                inputMode="email"
                required
                dir="ltr"
                value={email}
                placeholder={dict.addParent.fields.emailPlaceholder}
                aria-invalid={email.length > 0 && !emailValid}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parent-phone">
                {dict.addParent.fields.phone}
              </Label>
              <Input
                id="parent-phone"
                type="tel"
                inputMode="tel"
                dir="ltr"
                value={phone}
                placeholder={dict.addParent.fields.phonePlaceholder}
                aria-invalid={phone.length > 0 && !phoneValid}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setError(null);
                }}
              />
            </div>

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
            <Button type="submit" disabled={!canSubmit}>
              {loading ? dict.provisioning.sending : dict.common.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
