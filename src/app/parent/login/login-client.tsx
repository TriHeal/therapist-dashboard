"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import {
  PARENT_DEMO_CREDENTIALS_KEY,
  PARENT_DEMO_PROFILE_KEY,
  hashParentPassword,
  normalizeParentEmail,
} from "@/lib/auth/parent-demo-auth";

export default function ParentLoginForm({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const normalizedEmail = normalizeParentEmail(email);
      const serializedCredentials = localStorage.getItem(
        PARENT_DEMO_CREDENTIALS_KEY,
      );
      const credentials = serializedCredentials
        ? (JSON.parse(serializedCredentials) as {
            email: string;
            passwordHash: string;
          })
        : null;

      if (!credentials) {
        throw new Error(dict.parentAuth.invalidCredentials);
      }

      const passwordHash = await hashParentPassword(password);
      if (
        normalizeParentEmail(credentials.email) !== normalizedEmail ||
        credentials.passwordHash !== passwordHash
      ) {
        throw new Error(dict.parentAuth.invalidCredentials);
      }

      const serializedProfile = localStorage.getItem(PARENT_DEMO_PROFILE_KEY);
      const profile = serializedProfile ? JSON.parse(serializedProfile) : null;

      if (!profile) {
        throw new Error(dict.parentAuth.noProfileFound);
      }

      const response = await fetch("/api/parent-demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.error ?? dict.parentAuth.invalidCredentials);
      }

      router.push("/parent");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : dict.parentAuth.invalidCredentials,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{dict.parentAuth.loginTitle}</CardTitle>
          <CardDescription>{dict.parentAuth.loginDescription}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">{dict.parentAuth.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">{dict.parentAuth.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? dict.parentAuth.loggingIn
                : dict.parentAuth.loginSubmit}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
