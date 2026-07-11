import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ParentAuditEntry } from "@/types";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";

// Shared presentational card for one parent "Optional Home Journal" entry. Rendered on both
// the parent's recent-entries list and the therapist's Clinical Insights (Progress) page.
// The score label is passed in (rather than read from a fixed namespace) so each surface can
// use its own wording — the warm parent copy vs. the therapist's neutral "Sync score" — and
// stay consistent with the label on that page's chart. Trigger-type names are canonical and
// shared, so they come straight from the dictionary.
export function AuditEntryCard({
  entry,
  dict,
  locale,
  scoreLabel,
}: {
  entry: ParentAuditEntry;
  dict: Dictionary;
  locale: Locale;
  scoreLabel: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {dict.parentAuditPage.triggerTypes[entry.triggerType]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {scoreLabel}:{" "}
              <span className="font-medium tabular-nums text-foreground">{entry.syncScore}</span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(entry.loggedAt).toLocaleDateString(locale)}
          </span>
        </div>
        {entry.note && <p className="text-sm">{entry.note}</p>}
      </CardContent>
    </Card>
  );
}
