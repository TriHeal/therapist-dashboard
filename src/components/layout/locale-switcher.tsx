"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/dictionaries";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  function setLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <div className="flex gap-1 px-2 py-3">
      <Button
        size="sm"
        variant={locale === "he" ? "default" : "ghost"}
        onClick={() => setLocale("he")}
        className="flex-1"
      >
        עברית
      </Button>
      <Button
        size="sm"
        variant={locale === "en" ? "default" : "ghost"}
        onClick={() => setLocale("en")}
        className="flex-1"
      >
        English
      </Button>
    </div>
  );
}
