"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "@/lib/firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Login page — therapist enters T.Z. (ID number) + password.
 *
 * Flow:
 * 1. POST { tz, password } → NestJS `/auth/login`
 * 2. Backend verifies credentials and returns a Firebase custom token
 * 3. Frontend calls `signInWithCustomToken` to establish the Firebase session
 * 4. Redirect to dashboard
 */

export default function LoginPage() {
  const router = useRouter();
  const [tz, setTz] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tz, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "שם משתמש או סיסמה שגויים");
      }

      const { customToken } = await res.json();
      await signIn(customToken);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">קשר מרפא</CardTitle>
          <CardDescription>התחברות למערכת</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tz">תעודת זהות</Label>
              <Input
                id="tz"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                required
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "מתחבר…" : "התחברות"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
