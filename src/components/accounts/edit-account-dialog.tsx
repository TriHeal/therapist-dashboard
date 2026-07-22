"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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
import {
  resendParentInvitation,
  updateParentAccount,
} from "@/lib/actions/provisioning.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ParentAccount, ParentRelationship } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+972|0)5\d{8}$/;

function normalizePhone(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export function EditAccountDialog({
  dict,
  parent,
  patientId,
}: {
  dict: Dictionary;
  parent: ParentAccount;
  patientId: string;
}) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(parent.fullName || "");
  const [relationship, setRelationship] = useState<ParentRelationship>(
    parent.relationship || "mother",
  );
  const [email, setEmail] = useState(parent.email || "");
  const [phone, setPhone] = useState(parent.phone || "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedEmail = email.trim();
  const normalizedPhone = normalizePhone(phone);

  const emailValid =
    normalizedEmail.length === 0 || EMAIL_RE.test(normalizedEmail);
  const phoneValid =
    normalizedPhone.length === 0 || PHONE_RE.test(normalizedPhone);

  const hasContactInfo =
    normalizedEmail.length > 0 || normalizedPhone.length > 0;
  const canSubmit =
    fullName.trim().length > 0 &&
    emailValid &&
    phoneValid &&
    hasContactInfo &&
    !loading &&
    !resending;

  const canResend =
    normalizedEmail.length > 0 && emailValid && !loading && !resending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    const res = await updateParentAccount(parent.id, patientId, {
      fullName: fullName.trim(),
      relationship,
      email: normalizedEmail || null,
      phone: normalizedPhone || null,
    });

    setLoading(false);

    if ("error" in res) {
      setError(dict.parentSection.saveError || "נכשלה שמירת הנתונים");
    } else {
      setOpen(false);
    }
  }

  async function handleResendInvitation() {
    if (!canResend) return;

    setResending(true);
    setError(null);
    setResendSuccess(false);

    const updateResult = await updateParentAccount(parent.id, patientId, {
      fullName: fullName.trim(),
      relationship,
      email: normalizedEmail || null,
      phone: normalizedPhone || null,
    });

    if ("error" in updateResult) {
      setError(dict.parentSection.saveError);
      setResending(false);
      return;
    }

    const resendResult = await resendParentInvitation(parent.id, patientId);

    setResending(false);

    if ("error" in resendResult) {
      setError(dict.parentSection.resendError);
      return;
    }

    setResendSuccess(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" />
        }
      >
        <Pencil className="h-3.5 w-3.5" />
        {dict.common.edit}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {dict.parentSection.editTitle || "עריכת פרטי הורה"}
            </DialogTitle>
            <DialogDescription>
              {dict.parentSection.editDescription ||
                "עדכן את פרטי ההורה הרשום במערכת."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-fullName">
                {dict.addParent.fields.fullName}
              </Label>
              <Input
                id="edit-fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={dict.addParent.fields.fullNamePlaceholder}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-relationship">
                {dict.addParent.fields.relationship}
              </Label>
              <Select
                value={relationship}
                onValueChange={(val) =>
                  setRelationship(val as ParentRelationship)
                }
              >
                <SelectTrigger id="edit-relationship">
                  <SelectValue>
                    {dict.parentSection.relationshipLabels[relationship]}
                  </SelectValue>
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
              <Label htmlFor="edit-email">{dict.addParent.fields.email}</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.addParent.fields.emailPlaceholder}
                dir="ltr"
              />
              {!emailValid && (
                <p className="text-xs text-destructive">
                  {dict.provisioning.errorInvalidEmail}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-phone">{dict.addParent.fields.phone}</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={dict.addParent.fields.phonePlaceholder}
                dir="ltr"
              />
              {!phoneValid && (
                <p className="text-xs text-destructive">
                  {dict.provisioning.errorInvalidPhone}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
          {!parent.canAccessApp && (
            <div className="rounded-md border p-3">
              <p className="mb-3 text-sm text-muted-foreground">
                {dict.parentSection.waitingForActivation}
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendInvitation}
                disabled={!canResend}
              >
                {resending
                  ? dict.parentSection.resendingInvitation
                  : dict.parentSection.resendInvitation}
              </Button>

              {resendSuccess && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {dict.parentSection.resendSuccess}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading || resending}
            >
              {dict.common?.cancel || "ביטול"}
            </Button>
            <Button type="submit" disabled={!canSubmit || loading || resending}>
              {loading ? dict.provisioning.sending : dict.common.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
