import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { PatientSubnav } from "@/components/patients/patient-subnav";
import { getPatient } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientSessionsPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict }, patient] = await Promise.all([
    getDictionary(),
    getPatient(patientId),
  ]);

  if (!patient) notFound();

  return (
    <>
      <AppHeader title={`${patient.displayName} — ${dict.patientSubnav.sessions}`} />
      <PatientSubnav patientId={patientId} dict={dict} />
      <div className="p-6 space-y-6">
        <div className="border border-dashed rounded-lg p-8 text-center bg-card shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{dict.patientSubnav.sessions}</h3>
          <p className="text-sm text-muted-foreground">
            Therapy Sessions Table and Creation Flow will be implemented in PR 2 & 3.
          </p>
        </div>
      </div>
    </>
  );
}
