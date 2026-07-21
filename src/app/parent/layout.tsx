import { ParentLayoutShell } from "@/components/layout/parent-layout-shell";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getDictionary();

  return (
    <ParentLayoutShell dict={dict} locale={locale}>
      {children}
    </ParentLayoutShell>
  );
}
