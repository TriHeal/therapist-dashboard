import Link from "next/link";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PatientRosterSearch } from "@/components/patients/patient-roster-search";
import { buttonVariants } from "@/components/ui/button";
import {
  getPatients,
  getRecentSessions,
  getFlaggedKeywordAlerts,
} from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function DashboardHomePage() {
  const [{ dict, locale }, patients, recentSessions, alerts] = await Promise.all([
    getDictionary(),
    getPatients(),
    getRecentSessions(50),
    getFlaggedKeywordAlerts({ sinceDays: 14 }),
  ]);

  const activePatients = patients.filter((p) => p.status === "active").length;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sessionsThisWeek = recentSessions.filter(
    (s) => new Date(s.startedAt).getTime() >= weekAgo
  ).length;

  return (
    <>
      <AppHeader title={dict.home.title} description={dict.home.description} />
      <div className="p-6 space-y-8">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">{dict.patientsPage.title}</h2>
            <Link href="/therapist/patients/new" className={buttonVariants({ variant: "default" })}>
              <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {dict.home.addPatient}
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4">
            <PatientRosterSearch patients={patients} dict={dict} locale={locale} />
          </div>
        </div>
      </div>
    </>
  );
}
