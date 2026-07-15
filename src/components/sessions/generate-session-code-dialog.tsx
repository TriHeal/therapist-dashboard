"use client";

import { useEffect, useState } from "react";
import { KeyRound, Copy, Check, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateSessionCode } from "@/lib/actions/session-codes.actions";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function GenerateSessionCodeDialog({
  patientId,
  dict,
}: {
  patientId: string;
  dict: Dictionary;
}) {
  const t = dict.sessionCode;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    setCopied(false);
    const result = await generateSessionCode({ patientId });
    setLoading(false);
    if ("error" in result) {
      setError(t.errorGeneric);
      return;
    }
    setCode(result.code);
    setExpiresAt(new Date(result.expiresAt).getTime());
  }

  // Tick the countdown once per second while a code is live.
  useEffect(() => {
    if (expiresAt == null) return;
    const tick = () => setRemaining(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setCode(null);
      setExpiresAt(null);
      setError(null);
      setCopied(false);
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be unavailable — no-op */
    }
  }

  const expired = expiresAt != null && remaining <= 0;
  const mm = Math.floor(remaining / 60).toString();
  const ss = (remaining % 60).toString().padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <KeyRound className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
        {t.generate}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>{t.dialogTitle}</DialogTitle>
          <DialogDescription>{t.dialogDescription}</DialogDescription>
        </DialogHeader>

        {code ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              dir="ltr"
              className={cn(
                "font-mono text-4xl font-semibold tracking-[0.35em]",
                expired && "text-muted-foreground line-through",
              )}
            >
              {code}
            </div>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {expired ? t.expired : `${t.expiresIn} ${mm}:${ss}`}
            </p>
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={generate}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0", loading && "animate-spin")}
                />
                {t.regenerate}
              </Button>
              <Button type="button" className="flex-1" onClick={copyCode} disabled={expired}>
                {copied ? (
                  <Check className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                ) : (
                  <Copy className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                )}
                {copied ? t.copied : t.copy}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <Button type="button" onClick={generate} disabled={loading}>
              <KeyRound className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {loading ? t.generating : t.generate}
            </Button>
            {error && (
              <p className="text-sm text-destructive" aria-live="polite">
                {error}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
