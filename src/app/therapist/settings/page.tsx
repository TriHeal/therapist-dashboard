import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPatients } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function SettingsPage() {
  const [{ dict }, patients] = await Promise.all([getDictionary(), getPatients()]);

  return (
    <>
      <AppHeader title={dict.settingsPage.title} description={dict.settingsPage.description} />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>{dict.settingsPage.sharingTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground mb-2">{dict.settingsPage.sharingDesc}</p>
            {patients.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md border p-2">
                <span className="text-sm font-medium">{p.displayName}</span>
                <Badge variant={p.parentSharingEnabled ? "default" : "secondary"}>
                  {p.parentSharingEnabled ? dict.common.enabled : dict.common.disabled}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
