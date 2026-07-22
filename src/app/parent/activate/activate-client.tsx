"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { PARENT_DEMO_PROFILE_KEY } from "@/lib/auth/parent-demo-auth";

export default function ActivateParentInvitation({
  dict,
}: {
  dict: Dictionary;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function activateParentAccess() {
    if (!token) {
      setError(dict.parentAuth.activationFailed);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/parent-activation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result?.parentId || !result?.patient) {
        throw new Error(result?.error ?? dict.parentAuth.activationFailed);
      }

      localStorage.setItem(
        PARENT_DEMO_PROFILE_KEY,
        JSON.stringify({
          parentId: result.parentId,
          patient: result.patient,
        }),
      );

      router.replace("/parent/set-password");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : dict.parentAuth.activationFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{dict.parentAuth.activateTitle}</CardTitle>
          <CardDescription>
            {dict.parentAuth.activateDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            onClick={activateParentAccess}
            disabled={isSubmitting || !token}
          >
            {isSubmitting
              ? dict.parentAuth.activating
              : dict.parentAuth.activationSubmit}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
