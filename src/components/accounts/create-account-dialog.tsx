"use client";

import { useState } from "react";
import { UserPlus, Copy, Check, MessageSquareText } from "lucide-react";
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
import { createParentAccount } from "@/lib/actions/provisioning.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Mirror the server-side rules so the button gates before we ever hit the network.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+972|0)5\d{8}$/;

function normalizePhone(raw: string) {
  return raw.replace(/[\s-]/g, "");
}

export function CreateAccountDialog({
  dict,
  patientId,
}: {
  dict: Dictionary;
  patientId: string;
}) {
  const t = dict.provisioning;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    phone: string;
    code?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());
  const phoneValid = PHONE_RE.test(normalizePhone(phone));
  const canSubmit = emailValid && phoneValid && !loading;

  function reset() {
    setEmail("");
    setPhone("");
    setError(null);
    setSuccess(null);
    setCopied(false);
    setLoading(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  async function handleSubmit(formData: FormData) {
    if (!canSubmit) return; // never trust the client — the action re-validates too.
    setLoading(true);
    setError(null);

    const result = await createParentAccount({
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      childId: patientId,
    });

    setLoading(false);
    if ("error" in result) {
      setError(
        result.error === "INVALID_EMAIL"
          ? t.errorInvalidEmail
          : result.error === "INVALID_PHONE"
            ? t.errorInvalidPhone
            : result.error === "SMS_FAILED"
              ? t.errorSmsFailed
              : t.errorGeneric,
      );
      return;
    }
    setSuccess({ phone: result.account.phone, code: result.code });
  }

  async function copyCode() {
    if (!success?.code) return;
    try {
      await navigator.clipboard.writeText(success.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable — no-op */
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <UserPlus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
        {t.createAccount}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {success ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-primary" />
                {t.inviteSentTitle}
              </DialogTitle>
              <DialogDescription>{t.inviteSentDesc}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 text-sm">
              <p className="font-medium" dir="ltr">
                {success.phone}
              </p>
              {success.code && (
                <div className="space-y-2 rounded-lg border border-dashed border-input bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">
                    {t.mockNotice}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <code
                      dir="ltr"
                      className="font-mono text-xl font-semibold tracking-[0.25em]"
                    >
                      {success.code}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copyCode}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
                      )}
                      {copied ? t.copied : t.copyCode}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={reset}>
                {t.createAnother}
              </Button>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                {dict.common.close}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form action={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t.dialogTitle}</DialogTitle>
              <DialogDescription>{t.dialogDescription}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="parent-email">{t.parentEmail}</Label>
                <Input
                  id="parent-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  dir="ltr"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  aria-invalid={email.length > 0 && !emailValid}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent-phone">{t.parentPhone}</Label>
                <Input
                  id="parent-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  placeholder={t.phonePlaceholder}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError(null);
                  }}
                  aria-invalid={phone.length > 0 && !phoneValid}
                  required
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
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                {dict.common.cancel}
              </Button>
              <Button type="submit" disabled={!canSubmit}>
                {loading ? t.sending : t.submit}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
