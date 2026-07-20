"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { patients } from "@/lib/data/mock/patients.mock";
import type {
  Patient,
  PatientSex,
  PatientStatus,
} from "@/types";

export type CreatePatientInput = {
  displayName: string;
  age: number;
  sex: PatientSex;
  avatarUrl?: string | null;
  parentSharingEnabled: boolean;
};

export type UpdatePatientInput = {
  displayName?: string;
  age?: number;
  sex?: PatientSex;
  avatarUrl?: string | null;
  status?: PatientStatus;
  parentSharingEnabled?: boolean;
};

export async function createPatient(
  data: CreatePatientInput,
): Promise<Patient | { error: string }> {
  try {
    let newPatient: Patient;

    if (USE_API) {
      newPatient = await apiFetch<Patient>("/patients", {
        method: "POST",
        body: data,
      });
    } else {
      const now = new Date().toISOString();

      newPatient = {
        id: `p${patients.length + 1}`,
        displayName: data.displayName,
        age: data.age,
        sex: data.sex,
        avatarUrl: data.avatarUrl ?? null,
        status: "active",
        primaryTherapistId: "t1",
        enrolledAt: now,
        parentSharingEnabled: data.parentSharingEnabled,
        parentIds: [],
        childUid: null,
        createdAt: now,
        updatedAt: now,
      };

      patients.unshift(newPatient);
    }

    revalidatePath("/therapist/patients");
    return newPatient;
  } catch (error) {
    console.error("Failed to create patient:", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create patient",
    };
  }
}

export async function updatePatient(
  patientId: string,
  data: UpdatePatientInput,
): Promise<Patient | { error: string }> {
  try {
    let updatedPatient: Patient;

    if (USE_API) {
      updatedPatient = await apiFetch<Patient>(
        `/patients/${patientId}`,
        {
          method: "PATCH",
          body: data,
        },
      );
    } else {
      const patient = patients.find(
        (candidate) => candidate.id === patientId,
      );

      if (!patient) {
        return { error: "Patient not found" };
      }

      Object.assign(patient, data, {
        updatedAt: new Date().toISOString(),
      });

      updatedPatient = patient;
    }

    revalidatePath(`/therapist/patients/${patientId}`);
    revalidatePath("/therapist/patients");

    return updatedPatient;
  } catch (error) {
    console.error("Failed to update patient:", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update patient",
    };
  }
}
