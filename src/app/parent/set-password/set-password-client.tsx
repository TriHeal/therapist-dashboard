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
  hashParentPassword,
  isValidParentEmail,
  normalizeParentEmail,
} from "@/lib/auth/parent-demo-auth";

export default function SetParentPasswordForm({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = normalizeParentEmail(email);

    if (!isValidParentEmail(normalizedEmail)) {
      setError(dict.parentAuth.invalidEmail);
      return;
    }

    if (password.length < 6) {
      setError(dict.parentAuth.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(dict.parentAuth.passwordsMustMatch);
      return;
    }

    setIsSubmitting(true);

    try {
      // Presentation-only mocked authentication: password state is stored locally.
      const passwordHash = await hashParentPassword(password);
      localStorage.setItem(
        PARENT_DEMO_CREDENTIALS_KEY,
        JSON.stringify({ email: normalizedEmail, passwordHash }),
      );

      router.push("/parent");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : dict.parentAuth.savePasswordError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{dict.parentAuth.setPasswordTitle}</CardTitle>
          <CardDescription>
            {dict.parentAuth.setPasswordDescription}
          </CardDescription>
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
                autoComplete="new-password"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">
                {dict.parentAuth.confirmPassword}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? dict.parentAuth.saving : dict.parentAuth.submit}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
