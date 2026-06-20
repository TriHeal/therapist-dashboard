import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getDictionary } from "@/lib/i18n/get-locale";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-noto-hebrew",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "קשר מרפא — לוח בקרה למטפל",
  description: "לוח בקרה קליני למעקב מפגשים בזמן אמת",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getDictionary();
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansHebrew.variable} h-full antialiased`}
    >
      <body className="min-h-full font-[family-name:var(--font-noto-hebrew)]">
        <TooltipProvider>
          <div className="flex h-screen">
            <AppSidebar dict={dict} locale={locale} />
            <div className="flex-1 overflow-y-auto">{children}</div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
