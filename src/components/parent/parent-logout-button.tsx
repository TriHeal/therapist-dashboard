"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ParentLogoutButton({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
        setIsLoggingOut(true);

        try {
        const response = await fetch("/api/parent-demo-logout", {
            method: "POST",
            });

            if (!response.ok) {
            throw new Error("Logout failed");
            }

            router.replace("/parent/login");
            router.refresh();
        } finally {
            setIsLoggingOut(false);
        }
    }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? "..." : dict.nav.logout}
    </Button>
  );
}
