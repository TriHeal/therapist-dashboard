import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SessionTypeBadge } from "@/components/sessions/session-type-badge";
import { getDictionary } from "@/lib/i18n/get-locale";
import type { Session } from "@/types";

export async function SessionSummaryCard({ session }: { session: Session }) {
  const { dict, locale } = await getDictionary();
  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  return (
    <Link href={`/patients/${session.patientId}/sessions/${session.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <SessionTypeBadge type={session.type} />
            <span className="text-sm text-muted-foreground">
              {new Date(session.startedAt).toLocaleDateString(dateLocale)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {session.timeToSyncSeconds != null && (
              <span className="text-muted-foreground">
                {dict.sessionSummary.timeToSync}:{" "}
                <span className="font-medium text-foreground">
                  {session.timeToSyncSeconds} {dict.common.seconds}
                </span>
              </span>
            )}
            <span className="text-muted-foreground">{dict.sessionStatus[session.status]}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
