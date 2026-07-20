import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ParentAccount } from "@/types/parent-account";
import { USE_API } from "@/lib/api/client";

let mockParents: ParentAccount[] = [];

if (!USE_API) {
  mockParents =
    require("@/lib/data/mock/parent-accounts.mock").parentAccounts;
}

export default function ParentsSection({
  patientId,
  patientName,
  parentIds = [],
  dict,
  locale,
}: {
  patientId: string;
  patientName: string;
  parentIds?: string[];
  dict: Dictionary;
  locale: "he" | "en";
}) {
  const count = parentIds.length;

  return (
    <section
      data-locale={locale}
      aria-label={dict.parentSection.sectionTitle}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {dict.parentSection.sectionTitle}
        </h2>

        <CreateAccountDialog
          patientId={patientId}
          patientName={patientName}
          dict={dict}
        />
      </div>

      <div className="mt-4">
        {count === 0 ? (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              {dict.parentSection.emptyDescription}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {count} {dict.parentSection.linkedCountLabel}
            </p>

            {USE_API ? (
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">
                  {dict.parentSection.linkedCountHelp}
                </p>
              </Card>
            ) : (
              mockParents
                .filter((parent) =>
                  parent.patientIds.includes(patientId),
                )
                .map((parent) => (
                  <Card key={parent.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{parent.fullName}</p>

                        <p className="text-sm text-muted-foreground">
                          {
                            dict.parentSection.relationshipLabels[
                              parent.relationship
                            ]
                          }
                        </p>

                        {(parent.email || parent.phone) && (
                          <p
                            className="mt-1 text-sm text-muted-foreground"
                            dir="ltr"
                          >
                            {[parent.email, parent.phone]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>

                      <div className="text-end text-sm">
                        <p>
                          {parent.canAccessApp
                            ? dict.parentSection.accessEnabled
                            : dict.parentSection.accessDisabled}
                        </p>

                        <p className="text-muted-foreground">
                          {parent.firebaseUid
                            ? dict.parentSection.accountLinked
                            : dict.parentSection.invited}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
            )}
          </div>
        )}
      </div>

      <Separator className="my-6" />
    </section>
  );
}
