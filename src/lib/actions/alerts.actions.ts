"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { triggerKeywords } from "@/lib/data/mock/trigger-keywords.mock";

export async function markAlertReviewed(formData: FormData) {
  const alertId = String(formData.get("alertId") ?? "");
  
  if (USE_API) {
    await apiFetch(`/alerts/${alertId}/reviewed`, {
      method: "PATCH",
    });
  } else {
    const keyword = triggerKeywords.find((kw) => kw.id === alertId);
    if (!keyword) return;

    keyword.reviewed = true;
  }

  revalidatePath("/alerts");
  revalidatePath("/");
}
