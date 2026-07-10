import { ParentSidebar } from "@/components/layout/parent-sidebar";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getDictionary();

  return (
    <div className="flex h-screen">
      <ParentSidebar dict={dict} locale={locale} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
