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
import { updateParentAccount } from "@/lib/actions/provisioning.actions";
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
    parent.relationship || "mother"
  );
  const [email, setEmail] = useState(parent.email || "");
  const [phone, setPhone] = useState(parent.phone || "");
  const [loading, setLoading] = useState(false);
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
    !loading;

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          <Pencil className="h-3.5 w-3.5" />
          {dict.common?.edit || "עריכה"}
        </Button>
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
                {dict.createAccountDialog.fullNameLabel}
              </Label>
              <Input
                id="edit-fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={dict.createAccountDialog.fullNamePlaceholder}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-relationship">
                {dict.createAccountDialog.relationshipLabel}
              </Label>
              <Select
                value={relationship}
                onValueChange={(val) => setRelationship(val as ParentRelationship)}
              >
                <SelectTrigger id="edit-relationship">
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
              <Label htmlFor="edit-email">
                {dict.createAccountDialog.emailLabel}
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.createAccountDialog.emailPlaceholder}
                dir="ltr"
              />
              {!emailValid && (
                <p className="text-xs text-destructive">
                  {dict.createAccountDialog.invalidEmail}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-phone">
                {dict.createAccountDialog.phoneLabel}
              </Label>
              <Input
                id="edit-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={dict.createAccountDialog.phonePlaceholder}
                dir="ltr"
              />
              {!phoneValid && (
                <p className="text-xs text-destructive">
                  {dict.createAccountDialog.invalidPhone}
                </p>
              )}
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {dict.common?.cancel || "ביטול"}
            </Button>
            <Button type="submit" disabled={!canSubmit || loading}>
              {loading
                ? dict.common?.saving || "שומר..."
                : dict.common?.save || "שמירה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
