import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionTypeBadge } from "@/components/sessions/session-type-badge";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { Patient, Session } from "@/types";

export async function UpcomingSessionsWidget({
  sessions,
  patientsById,
}: {
  sessions: Session[];
  patientsById: Map<string, Patient>;
}) {
  const { dict, locale } = await getDictionary();
  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.home.upcomingSessions}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.home.noScheduled}</p>
        ) : (
          sessions.map((s) => (
            <Link
              key={s.id}
              href={`/patients/${s.patientId}`}
              className="flex items-center justify-between rounded-md border p-2 hover:bg-accent/50"
            >
              <span className="text-sm font-medium">
                {patientsById.get(s.patientId)?.displayName ?? "—"}
              </span>
              <div className="flex items-center gap-2">
                <SessionTypeBadge type={s.type} />
                <span className="text-xs text-muted-foreground">
                  {new Date(s.startedAt).toLocaleDateString(dateLocale)}
                </span>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
