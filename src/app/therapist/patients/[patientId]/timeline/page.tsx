import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { SessionSummaryCard } from "@/components/sessions/session-summary-card";
import { getPatient, getPatientSessions } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";
import { getPatientActivities } from "@/lib/data/services/activities.service";
import { getPatientAudits } from "@/lib/data/services/parent-audits.service";

export default async function PatientTimelinePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict }, patient] = await Promise.all([getDictionary(), getPatient(patientId)]);
  if (!patient) notFound();

  const [sessions, activities, audits] = await Promise.all([
    getPatientSessions(patientId),
    getPatientActivities(patientId),
    getPatientAudits(patientId)
  ]);

  // Transform to a unified timeline
  const timelineEvents: any[] = [];
  
  sessions.forEach(s => {
    timelineEvents.push({
      type: "session",
      date: new Date(s.startedAt),
      data: s
    });
  });

  activities.filter(m => m.status === "completed" && m.completedAt).forEach(m => {
    timelineEvents.push({
      type: "activity",
      date: new Date(m.completedAt!),
      data: m
    });
  });

  audits.forEach(a => {
    timelineEvents.push({
      type: "audit",
      date: new Date(a.loggedAt),
      data: a
    });
  });

  // Sort descending (newest first)
  timelineEvents.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <>
      <AppHeader title={`${patient.displayName} — ${dict.patientSubnav.timeline}`} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-3">
        {timelineEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.sessionsPage.noSessions}</p>
        ) : (
          <div className="relative border-l border-muted pl-4 ml-4 space-y-6">
            {timelineEvents.map((event, i) => {
              if (event.type === "session") {
                return (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                    <SessionSummaryCard session={event.data} />
                  </div>
                );
              }
              if (event.type === "activity") {
                return (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                    <div className="p-4 border rounded-lg shadow-sm bg-card">
                      <p className="text-xs text-muted-foreground mb-1">
                        {event.date.toLocaleDateString()}
                      </p>
                      <h4 className="font-semibold text-sm">Activity Completed: {event.data.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Type: {dict.activities.type[event.data.type as keyof typeof dict.activities.type] || event.data.type}
                      </p>
                    </div>
                  </div>
                );
              }
              if (event.type === "audit") {
                return (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 mt-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-background" />
                    <div className="p-4 border rounded-lg shadow-sm bg-card">
                      <p className="text-xs text-muted-foreground mb-1">
                        {event.date.toLocaleDateString()}
                      </p>
                      <h4 className="font-semibold text-sm">Parent Journal Entry</h4>
                      <p className="text-sm mt-1">
                        <span className="text-muted-foreground">Trigger:</span> {dict.parentAuditPage.triggerTypes[event.data.triggerType as keyof typeof dict.parentAuditPage.triggerTypes] || event.data.triggerType}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Note:</span> {event.data.note || "-"}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </>
  );
}
