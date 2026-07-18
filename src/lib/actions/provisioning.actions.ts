"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, USE_API } from "@/lib/api/client";
import { parentAccounts } from "@/lib/data/mock/parent-accounts.mock";
import { generateNumericCode } from "@/lib/crypto/codes";
import { SMS_CONFIGURED, sendInviteSms } from "@/lib/sms/twilio";
import type { CreateParentAccountInput, ParentAccount } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Israeli mobile: optional +972 or leading 0, then 5X and 7 more digits.
const PHONE_RE = /^(?:\+972|0)5\d{8}$/;

export type CreateParentAccountResult =
  // `code` is only returned when the send was SIMULATED (Twilio not configured), so a real
  // activation code is never surfaced in the UI once it has actually been texted to the parent.
  | { account: ParentAccount; sent: true; code?: string }
  | {
      error: "INVALID_EMAIL" | "INVALID_PHONE" | "SMS_FAILED" | "CREATE_FAILED";
    };

function normalizePhone(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

/** Convert a validated Israeli mobile (05XXXXXXXX or +9725XXXXXXXX) to E.164 for Twilio. */
function toE164(phone: string): string {
  return phone.startsWith("+") ? phone : phone.replace(/^0/, "+972");
}

export async function createParentAccount(
  input: CreateParentAccountInput,
): Promise<CreateParentAccountResult> {
  const email = (input.email ?? "").trim().toLowerCase();
  const phone = normalizePhone(input.phone ?? "");

  // Never trust the client — re-validate server-side even though the UI also guards.
  if (!EMAIL_RE.test(email)) return { error: "INVALID_EMAIL" };
  if (!PHONE_RE.test(phone)) return { error: "INVALID_PHONE" };

  try {
    if (USE_API) {
      // Backend (backend-heal) creates the Firebase auth user, mints the activation code,
      // and texts it via Twilio. It returns the account WITHOUT the code.
      const account = await apiFetch<ParentAccount>(`/parent-accounts`, {
        method: "POST",
        body: { email, phone, childId: input.childId },
      });
      revalidatePath("/therapist/patients");
      return { account, sent: true };
    }

    // No backend configured: create the account locally. If Twilio is configured, actually
    // text the activation code; otherwise fall back to simulating the dispatch.
    const code = generateNumericCode(6);

    if (SMS_CONFIGURED) {
      try {
        await sendInviteSms(toE164(phone), code);
      } catch (err) {
        console.error("Twilio send failed:", err);
        return { error: "SMS_FAILED" };
      }
    } else {
      console.log(
        `[mock Twilio] Would SMS activation code to ${toE164(phone)}: ${code}`,
      );
    }

    const account: ParentAccount = {
      id: `pa${parentAccounts.length + 1}`,
      email,
      phone,
      childId: input.childId,
      status: "invited",
      createdAt: new Date().toISOString(),
    };
    parentAccounts.unshift(account);

    revalidatePath("/therapist/patients");
    // Only reveal the code when it was NOT actually texted (dev/simulated mode).
    return SMS_CONFIGURED
      ? { account, sent: true }
      : { account, sent: true, code };
  } catch (err) {
    console.error("Failed to create parent account:", err);
    return { error: "CREATE_FAILED" };
  }
}
