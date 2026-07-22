import { getDictionary } from "@/lib/i18n/get-locale";
import SetParentPasswordForm from "./set-password-client";

export default async function ParentSetPasswordPage() {
  const { dict } = await getDictionary();

  return <SetParentPasswordForm dict={dict} />;
}
