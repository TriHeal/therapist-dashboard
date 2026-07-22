import { getDictionary } from "@/lib/i18n/get-locale";
import ActivateParentInvitation from "./activate-client";

export default async function ParentActivationPage() {
  const { dict } = await getDictionary();

  return <ActivateParentInvitation dict={dict} />;
}
