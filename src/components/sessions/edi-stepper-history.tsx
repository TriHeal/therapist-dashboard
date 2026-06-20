import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { EDIStepperEvent } from "@/types";

export async function EdiStepperHistory({ events }: { events: EDIStepperEvent[] }) {
  const { dict } = await getDictionary();

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">{dict.edi.noEvents}</p>;
  }

  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="rounded-md border p-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{dict.edi[event.phase]}</Badge>
            <span className="text-xs text-muted-foreground">
              {dict.edi.step} {event.sequence}
            </span>
          </div>
          {event.factText && (
            <p className="text-sm">
              <span className="text-muted-foreground">{dict.edi.fact}: </span>
              {event.factText}
            </p>
          )}
          {event.interpretationText && (
            <p className="text-sm">
              <span className="text-muted-foreground">{dict.edi.interpretation}: </span>
              {event.interpretationText}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
