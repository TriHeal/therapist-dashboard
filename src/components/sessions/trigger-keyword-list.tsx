import { TriggerKeywordBadge } from "@/components/sessions/trigger-keyword-badge";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { TriggerKeyword } from "@/types";

export async function TriggerKeywordList({ keywords }: { keywords: TriggerKeyword[] }) {
  const { dict } = await getDictionary();

  if (keywords.length === 0) {
    return <p className="text-sm text-muted-foreground">{dict.triggerKeywords.none}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw) => (
        <TriggerKeywordBadge key={kw.id} keyword={kw} />
      ))}
    </div>
  );
}
