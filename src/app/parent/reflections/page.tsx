import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { getMyChildReflections } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-locale";

export default async function ParentReflectionsPage() {
  const [{ dict, locale }, reflections] = await Promise.all([
    getDictionary(),
    getMyChildReflections(),
  ]);

  return (
    <>
      <AppHeader
        title={dict.parentReflectionsPage.title}
        description={dict.parentReflectionsPage.description}
      />
      <div className="p-6 space-y-4">
        {reflections.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {dict.parentReflectionsPage.noReflections}
          </p>
        ) : (
          reflections.map((r) => (
            <Card key={r.id} size="sm">
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(r.loggedAt).toLocaleDateString(locale)}
                </p>
                <p className="text-sm">{r.whatHappened}</p>
                {r.parentNotes && (
                  <p className="text-sm text-muted-foreground">{r.parentNotes}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
