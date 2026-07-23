import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RocksBreakFlowDetails } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function RocksBreakFlowReadOnly({
  details,
  dict,
}: {
  details: RocksBreakFlowDetails;
  dict: Dictionary;
}) {
  const facts = details.facts ?? [];
  const interpretations = details.thoughts ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.rocksFlow.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold">
            {dict.rocksFlow.whatHappened}
          </h2>
          <div className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
            {details.eventTitle || "—"}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">{dict.rocksFlow.facts}</h2>

          {facts.length > 0 ? (
            <ul className="space-y-2">
              {facts.map((fact, index) => (
                <li
                  key={`${fact}-${index}`}
                  className="rounded-lg border bg-muted/30 px-4 py-3 text-sm"
                >
                  {fact}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold">
            {dict.rocksFlow.interpretations}
          </h2>

          {interpretations.length > 0 ? (
            <ul className="space-y-2">
              {interpretations.map((interpretation, index) => (
                <li
                  key={`${interpretation}-${index}`}
                  className="rounded-lg border bg-muted/30 px-4 py-3 text-sm"
                >
                  {interpretation}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">—</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
