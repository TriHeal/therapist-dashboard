"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function RefreshOnFocus() {
  const router = useRouter();
  const wasHidden = useRef(false);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        wasHidden.current = true;
        return;
      }

      if (wasHidden.current) {
        wasHidden.current = false;
        router.refresh();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [router]);

  return null;
}