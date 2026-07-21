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

export default function ParentActivationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activateParentAccess() {
    if (!token) {
      setError("The invitation link is invalid.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/parent-activation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("The invitation is invalid, expired, or already used.");
      }

      router.replace("/parent");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The invitation could not be accepted.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Tri-Heal</CardTitle>
          <CardDescription>
            Activate your invitation to enter the parent dashboard.
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
            disabled={loading || !token}
          >
            {loading ? "Activating…" : "Activate parent access"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}