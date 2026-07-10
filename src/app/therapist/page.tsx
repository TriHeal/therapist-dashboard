import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { OverviewStatsCards } from "@/components/dashboard/overview-stats-cards";
import { UpcomingSessionsWidget } from "@/components/dashboard/upcoming-sessions-widget";
import { RecentAlertsWidget } from "@/components/dashboard/recent-alerts-widget";
import { ActiveMissionsWidget } from "@/components/missions/active-missions-widget";
import {
  getPatients,
  getUpcomingSessions,
  getRecentSessions,
  getFlaggedKeywordAlerts,
  getActiveMissionsAcrossPatients,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function DashboardHomePage() {
  const [{ dict }, patients, upcoming, recentSessions, alerts, activeMissions] = await Promise.all([
    getDictionary(),
    getPatients(),
    getUpcomingSessions(5),
    getRecentSessions(50),
    getFlaggedKeywordAlerts({ sinceDays: 14 }),
    getActiveMissionsAcrossPatients(5),
  ]);

  const activePatients = patients.filter((p) => p.status === "active").length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = recentSessions.filter(
    (s) => new Date(s.startedAt).getTime() >= weekAgo
  ).length;

  const patientsById = new Map(patients.map((p) => [p.id, p]));

  return (
    <>
      <AppHeader title={dict.home.title} description={dict.home.description} />
      <div className="p-6 space-y-6">
        <OverviewStatsCards
          activePatients={activePatients}
          sessionsThisWeek={sessionsThisWeek}
          openAlerts={alerts.filter((a) => !a.reviewed).length}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UpcomingSessionsWidget sessions={upcoming} patientsById={patientsById} />
          <RecentAlertsWidget alerts={alerts} />
          <ActiveMissionsWidget missions={activeMissions} patientsById={patientsById} />
        </div>
        <Link href="/therapist/schedule" className="text-sm text-primary hover:underline">
          {dict.home.viewSchedule}
        </Link>
      </div>
    </>
  );
}
