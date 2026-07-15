import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LiveSessionSimulator } from "@/components/live/live-session-simulator";
import { getPatient } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function LiveSessionDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const [{ dict }, patient] = await Promise.all([getDictionary(), getPatient(patientId)]);
  if (!patient) notFound();

  return (
    <>
      <AppHeader
        title={dict.liveDetail.title}
        description={`${dict.liveDetail.sessionLabel} ${patient.displayName}`}
      />
      <div className="p-6 space-y-6">
        <Alert>
          <AlertTitle>{dict.liveDetail.comingSoonTitle}</AlertTitle>
          <AlertDescription>{dict.liveDetail.comingSoonDesc}</AlertDescription>
        </Alert>
        <LiveSessionSimulator dict={dict} />
      </div>
    </>
  );
}
