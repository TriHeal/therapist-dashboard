import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/layout/auth-guard";
import { ClientLayout } from "@/components/layout/client-layout";
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
          <AuthGuard>
            <ClientLayout dict={dict} locale={locale}>
              {children}
            </ClientLayout>
          </AuthGuard>
        </TooltipProvider>
      </body>
    </html>
  );
}
