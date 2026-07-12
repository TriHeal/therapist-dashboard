import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { MissionCard } from "@/components/missions/mission-card";
import { AssignMissionDialog } from "@/components/missions/assign-mission-dialog";
import { getPatient, getPatientMissions } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientMissionsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict }, patient] = await Promise.all([getDictionary(), getPatient(patientId)]);
  if (!patient) notFound();

  const missions = await getPatientMissions(patientId);

  return (
    <>
      <AppHeader title={`${patient.displayName} — ${dict.missions.title}`} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <AssignMissionDialog patientId={patientId} dict={dict} />
        </div>
        {missions.length === 0 ? (
          <p className="text-sm text-muted-foreground">{dict.missions.noMissions}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
