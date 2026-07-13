"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { patients } from "@/lib/data/mock/patients.mock";
import type { Patient } from "@/types";

export async function createPatient(data: {
  displayName: string;
  age: number;
  avatarUrl?: string;
}): Promise<Patient | { error: string }> {
  try {
    let newPatient: Patient;

    if (USE_API) {
      newPatient = await apiFetch<Patient>(`/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      newPatient = {
        id: `p${patients.length + 1}`,
        displayName: data.displayName,
        age: data.age,
        status: "active",
        primaryTherapistId: "t1",
        enrolledAt: new Date().toISOString().split("T")[0],
        parentSharingEnabled: false,
      };
      patients.unshift(newPatient); // Add to beginning of mock list
    }

    revalidatePath("/therapist/patients");
    return newPatient;
  } catch (err: any) {
    console.error("Failed to create patient:", err);
    return { error: err.message || "Failed to create patient" };
  }
}
