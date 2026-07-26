import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";
import { EditAccountDialog } from "@/components/accounts/edit-account-dialog";
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
  parentsList,
  dict,
  locale,
}: {
  patientId: string;
  patientName: string;
  parentIds?: string[];
  parentsList?: ParentAccount[];
  dict: Dictionary;
  locale: "he" | "en";
}) {
  const displayParents =
    parentsList ||
    (USE_API
      ? []
      : mockParents.filter((parent) => parent.patientIds.includes(patientId)));

  const count = displayParents.length || parentIds.length;

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
        {displayParents.length === 0 ? (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              {dict.parentSection.emptyDescription}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {displayParents.length} {dict.parentSection.linkedCountLabel}
            </p>

            {displayParents.map((parent) => (
              <Card key={parent.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{parent.fullName}</p>
                      <EditAccountDialog
                        dict={dict}
                        parent={parent}
                        patientId={patientId}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {
                        dict.parentSection.relationshipLabels[
                          parent.relationship
                        ] || parent.relationship
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
            ))}
          </div>
        )}
      </div>

      <Separator className="my-6" />
    </section>
  );
}
