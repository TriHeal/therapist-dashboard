import { Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { PatientRosterSearch } from "@/components/patients/patient-roster-search";
import { buttonVariants } from "@/components/ui/button";
import { getPatients } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function PatientsPage() {
  const [{ dict, locale }, patients] = await Promise.all([getDictionary(), getPatients()]);

  return (
    <>
      <AppHeader title={dict.patientsPage.title} description={dict.patientsPage.description}>
        {/* Placeholder button for PR 6: Add Patient Modal */}
        <button className={buttonVariants({ variant: "default" })} disabled>
          <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {dict.home.addPatient}
        </button>
      </AppHeader>
      <div className="p-6">
        <PatientRosterSearch patients={patients} dict={dict} locale={locale} />
      </div>
    </>
  );
}
