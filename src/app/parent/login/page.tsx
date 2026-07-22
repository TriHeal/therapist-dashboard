import { getDictionary } from "@/lib/i18n/get-locale";
import ParentLoginForm from "./login-client";

export default async function ParentLoginPage() {
  const { dict } = await getDictionary();

  return <ParentLoginForm dict={dict} />;
}
