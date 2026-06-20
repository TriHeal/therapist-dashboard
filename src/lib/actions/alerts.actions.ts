"use server";

import { revalidatePath } from "next/cache";
import { triggerKeywords } from "@/lib/data/mock/trigger-keywords.mock";

export async function markAlertReviewed(formData: FormData) {
  const alertId = String(formData.get("alertId") ?? "");
  const keyword = triggerKeywords.find((kw) => kw.id === alertId);
  if (!keyword) return;

  keyword.reviewed = true;

  revalidatePath("/alerts");
  revalidatePath("/");
}
