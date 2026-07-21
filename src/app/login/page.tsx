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
import { login } from "@/lib/auth/login";

const DEV_USERS = [
  { label: "מטפל/ת", id: "123456789", password: "test1234!" },
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
      await login(id, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהתחברות");
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
              <Label htmlFor="id">תעודת זהות</Label>
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

          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "מתחבר..." : "התחברות"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/parent")}
            >
              מעבר למסך הורה (זמני, ללא התחברות)
            </Button>
          </CardFooter>
        </form>

        {process.env.NODE_ENV !== "production" && (
          <CardContent className="border-t pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              משתמשי דמו — סביבת פיתוח בלבד
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
                  className="flex flex-col items-start gap-1 rounded-md border px-3 py-2 text-xs text-start hover:bg-muted/50 transition-colors"
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
