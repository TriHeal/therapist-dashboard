"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// TODO: real login is temporarily disabled (backend /auth/login is broken).
// This is a placeholder role picker so the app is usable until it's fixed.
// See src/lib/auth/login.ts and proxy.ts for the original login flow.

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>קשר מרפא</CardTitle>
          <CardDescription>בחרו תצוגה</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => router.push("/therapist")}>
            תצוגת מטפל/ת
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => router.push("/parent")}
          >
            תצוגת הורה
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* Original login form (disabled until backend login is fixed):

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { login } from "@/lib/auth/login";
import { Role } from "@/types/auth";

const DEV_USERS = [
  { label: "מטפל/ת", id: "therapist1", password: "Passw0rd!" },
  { label: "הורה", id: "parent1", password: "Passw0rd!" },
];

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const role = await login(id, password);
      router.push(role === Role.Parent ? "/parent" : "/therapist");
      router.refresh();
    } catch {
      setError("שם משתמש או סיסמה שגויים");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>קשר מרפא</CardTitle>
          <CardDescription>התחברות למערכת</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="id">שם משתמש</Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "מתחבר..." : "התחברות"}
            </Button>
          </CardFooter>
        </form>
        {process.env.NODE_ENV !== "production" && (
          <CardContent className="border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              משתמשי דמו (סביבת פיתוח בלבד)
            </p>
            <div className="flex flex-col gap-1.5">
              {DEV_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setId(user.id);
                    setPassword(user.password);
                  }}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-xs text-start hover:bg-muted/50 transition-colors"
                >
                  <span className="text-muted-foreground">{user.label}</span>
                  <span className="font-mono" dir="ltr">
                    {user.id} / {user.password}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

*/
