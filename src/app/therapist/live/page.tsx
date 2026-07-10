import Link from "next/link";
import { AppHeader } from "@/components/layout/app-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getActiveLiveSessions, getPatients } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function LiveSessionsPage() {
  const [{ dict }, liveSessions, patients] = await Promise.all([
    getDictionary(),
    getActiveLiveSessions(),
    getPatients(),
  ]);
  const activePatients = patients.filter((p) => p.status === "active");

  return (
    <>
      <AppHeader title={dict.livePage.title} description={dict.livePage.description} />
      <div className="p-6 space-y-6">
        {liveSessions.length === 0 && (
          <Alert>
            <AlertTitle>{dict.livePage.noActiveTitle}</AlertTitle>
            <AlertDescription>{dict.livePage.noActiveDesc}</AlertDescription>
          </Alert>
        )}

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            {dict.livePage.availablePatients}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activePatients.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <span className="font-medium">{patient.displayName}</span>
                  <Button render={<Link href={`/therapist/live/${patient.id}`} />} size="sm">
                    {dict.livePage.startSessionWith} {patient.displayName}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
