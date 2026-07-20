"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { generateNumericCode } from "@/lib/crypto/codes";
import { parentAccounts } from "@/lib/data/mock/parent-accounts.mock";
import { patients } from "@/lib/data/mock/patients.mock";
import { SMS_CONFIGURED, sendInviteSms } from "@/lib/sms/twilio";
import type {
  CreateParentAccountInput,
  ParentAccount,
  ParentRelationship,
} from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+972|0)5\d{8}$/;

const RELATIONSHIPS: ParentRelationship[] = [
  "mother",
  "father",
  "guardian",
  "other",
];

export type CreateParentAccountError =
  | "INVALID_NAME"
  | "INVALID_RELATIONSHIP"
  | "INVALID_EMAIL"
  | "INVALID_PHONE"
  | "PATIENT_NOT_FOUND"
  | "SMS_FAILED"
  | "CREATE_FAILED";

export type CreateParentAccountResult =
  | {
      account: ParentAccount;
      code?: string;
    }
  | {
      error: CreateParentAccountError;
    };

function normalizePhone(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

function toE164(phone: string): string {
  return phone.startsWith("+") ? phone : phone.replace(/^0/, "+972");
}

export async function createParentAccount(
  input: CreateParentAccountInput,
): Promise<CreateParentAccountResult> {
  const fullName = input.fullName.trim();
  const email = input.email?.trim().toLowerCase() || null;
  const phone = input.phone ? normalizePhone(input.phone) : null;

  if (!fullName) {
    return { error: "INVALID_NAME" };
  }

  if (!RELATIONSHIPS.includes(input.relationship)) {
    return { error: "INVALID_RELATIONSHIP" };
  }

  if (email && !EMAIL_RE.test(email)) {
    return { error: "INVALID_EMAIL" };
  }

  if (phone && !PHONE_RE.test(phone)) {
    return { error: "INVALID_PHONE" };
  }

  try {
    if (USE_API) {
      const account = await apiFetch<ParentAccount>("/parent-accounts", {
        method: "POST",
        body: {
          patientId: input.patientId,
          fullName,
          relationship: input.relationship,
          email,
          phone,
          requestAppAccess: input.requestAppAccess,
        },
      });

      revalidatePath(`/therapist/patients/${input.patientId}`);
      return { account };
    }

    const patient = patients.find(
      (candidate) => candidate.id === input.patientId,
    );

    if (!patient) {
      return { error: "PATIENT_NOT_FOUND" };
    }

    let activationCode: string | undefined;

    if (input.requestAppAccess && phone) {
      const code = generateNumericCode(6);

      if (SMS_CONFIGURED) {
        try {
          await sendInviteSms(toE164(phone), code);
        } catch (error) {
          console.error("Twilio send failed:", error);
          return { error: "SMS_FAILED" };
        }
      } else {
        console.log(
          `[mock Twilio] Would SMS activation code to ${toE164(phone)}: ${code}`,
        );
        activationCode = code;
      }
    }

    const now = new Date().toISOString();
    const account: ParentAccount = {
      id: `pa${parentAccounts.length + 1}`,
      therapistId: patient.primaryTherapistId,
      firebaseUid: null,
      fullName,
      email,
      phone,
      relationship: input.relationship,
      canAccessApp: false,
      patientIds: [input.patientId],
      createdAt: now,
      updatedAt: now,
    };

    parentAccounts.unshift(account);

    patient.parentIds ??= [];
    if (!patient.parentIds.includes(account.id)) {
      patient.parentIds.push(account.id);
    }
    patient.updatedAt = now;

    revalidatePath(`/therapist/patients/${input.patientId}`);

    return {
      account,
      code: activationCode,
    };
  } catch (error) {
    console.error("Failed to create parent account:", error);
    return { error: "CREATE_FAILED" };
  }
}

export async function getParentAccounts(
  patientId: string
): Promise<ParentAccount[]> {
  if (USE_API) {
    try {
      return await apiFetch<ParentAccount[]>(
        `/parent-accounts?patientId=${patientId}`
      );
    } catch (err) {
      console.error("Failed to fetch parent accounts:", err);
      return [];
    }
  }
  return parentAccounts.filter((p) => p.patientIds.includes(patientId));
}

export async function updateParentAccount(
  parentId: string,
  patientId: string,
  input: {
    fullName?: string;
    relationship?: ParentRelationship;
    email?: string | null;
    phone?: string | null;
  }
): Promise<{ success: boolean } | { error: string }> {
  try {
    if (USE_API) {
      await apiFetch<ParentAccount>(`/parent-accounts/${parentId}`, {
        method: "PATCH",
        body: input,
      });
    } else {
      const parent = parentAccounts.find((p) => p.id === parentId);
      if (parent) {
        if (input.fullName) parent.fullName = input.fullName;
        if (input.relationship) parent.relationship = input.relationship;
        if (input.email !== undefined) parent.email = input.email;
        if (input.phone !== undefined) parent.phone = input.phone;
      }
    }
    revalidatePath(`/therapist/patients/${patientId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update parent account:", err);
    return { error: "UPDATE_FAILED" };
  }
}
