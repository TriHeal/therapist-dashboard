import { AppHeader } from "@/components/layout/app-header";
import { PatientRosterSearch } from "@/components/patients/patient-roster-search";
import { AddPatientDialog } from "@/components/patients/add-patient-dialog";
import { getPatients } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientsPage() {
  const [{ dict, locale }, patients] = await Promise.all([getDictionary(), getPatients()]);

  return (
    <>
      <AppHeader title={dict.patientsPage.title} description={dict.patientsPage.description}>
        <AddPatientDialog dict={dict} />
      </AppHeader>
      <div className="p-6">
        <PatientRosterSearch patients={patients} dict={dict} locale={locale} />
      </div>
    </>
  );
}
