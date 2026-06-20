import { Badge } from "@/components/ui/badge";
import { SESSION_TYPE_BADGE_VARIANT } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { SessionType } from "@/types";

export async function SessionTypeBadge({ type }: { type: SessionType }) {
  const { dict } = await getDictionary();
  return <Badge variant={SESSION_TYPE_BADGE_VARIANT[type]}>{dict.sessionType[type]}</Badge>;
}
