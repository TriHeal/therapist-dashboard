import { getDictionary } from "@/lib/i18n/get-locale";
import { ParentLayoutShell } from "@/components/layout/parent-layout-shell";

export default async function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { dict, locale } = await getDictionary();

  return (
    <ParentLayoutShell dict={dict} locale={locale}>
      {children}
    </ParentLayoutShell>
  );
}
