import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { SessionTypeBadge } from "@/components/sessions/session-type-badge";
import { getUpcomingSessions, getPatients } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function SchedulePage() {
  const [{ dict, locale }, sessions, patients] = await Promise.all([
    getDictionary(),
    getUpcomingSessions(50),
    getPatients(),
  ]);
  const dateLocale = locale === "he" ? "he-IL" : "en-US";
  const patientsById = new Map(patients.map((p) => [p.id, p]));

  return (
    <>
      <AppHeader title={dict.schedule.title} description={dict.schedule.description} />
      <div className="p-6 space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.schedule.noUpcoming}</p>
        ) : (
          sessions.map((s) => (
            <Link key={s.id} href={`/therapist/patients/${s.patientId}`}>
              <Card className="hover:bg-accent/50 transition-colors">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{patientsById.get(s.patientId)?.displayName}</span>
                    <SessionTypeBadge type={s.type} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(s.startedAt).toLocaleDateString(dateLocale, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
