import { Badge } from "@/components/ui/badge";
import { SEVERITY_BADGE_VARIANT } from "@/lib/constants";
import type { TriggerKeyword } from "@/types";

export function TriggerKeywordBadge({ keyword }: { keyword: TriggerKeyword }) {
  return <Badge variant={SEVERITY_BADGE_VARIANT[keyword.severity]}>{keyword.keyword}</Badge>;
}
