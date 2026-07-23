"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateChildConnectionCode } from "@/lib/actions/otp.actions";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

export function ChildConnectionCodeCard({
  patientId,
  dict,
  locale,
  onCodeGenerated,
}: {
  patientId: string;
  dict: Dictionary;
  locale: Locale;
  onCodeGenerated?: () => void;
}) {
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerateCode() {
    setIsLoading(true);
    setError(null);
    setCopied(false);

    const result = await generateChildConnectionCode(patientId);

    if ("error" in result) {
      setCode(null);
      setExpiresAt(null);
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setCode(result.code);
    setExpiresAt(result.expiresAt);
    onCodeGenerated?.();
    setIsLoading(false);
  }

  async function handleCopyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{dict.liveDetail.childConnectionTitle}</CardTitle>
        <CardDescription>
          {dict.liveDetail.childConnectionDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>{dict.liveDetail.childConnectionErrorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {!code ? (
          <Button
            onClick={handleGenerateCode}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading
              ? dict.liveDetail.generatingCode
              : dict.liveDetail.getChildCode}
          </Button>
        ) : (
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {dict.liveDetail.connectionCode}
              </p>
              <p className="text-4xl font-semibold tracking-[0.3em] text-foreground">
                {code}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>
                {dict.liveDetail.codeExpiresAt}{" "}
                {new Date(expiresAt ?? Date.now()).toLocaleString(
                  locale === "he" ? "he-IL" : "en-US",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  },
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2" dir="auto">
              <Button onClick={handleCopyCode} variant="outline">
                {copied ? dict.liveDetail.codeCopied : dict.liveDetail.copyCode}
              </Button>
              <Button
                onClick={handleGenerateCode}
                variant="secondary"
                disabled={isLoading}
              >
                {isLoading
                  ? dict.liveDetail.generatingCode
                  : dict.liveDetail.generateNewCode}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
