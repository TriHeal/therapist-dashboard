import twilio from "twilio";

// Server-only. Reads secrets at call time so the module can be imported even when
// Twilio isn't configured (the caller falls back to simulating the send).
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

/** True when the Twilio account SID, auth token, and sender number are all configured. */
export const SMS_CONFIGURED = Boolean(ACCOUNT_SID && AUTH_TOKEN && FROM_NUMBER);

/**
 * Text the parent their activation code via Twilio SMS.
 * `toPhoneE164` must be in E.164 form (e.g. +972501234567).
 * Throws if Twilio isn't configured or the API call fails — the caller decides how to surface it.
 */
export async function sendInviteSms(toPhoneE164: string, code: string): Promise<void> {
  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
    throw new Error(
      "Twilio is not configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER).",
    );
  }

  const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
  const body = `קוד ההפעלה שלך לקשר מרפא: ${code}\nYour Kesher Marpe activation code: ${code}`;
  await client.messages.create({ to: toPhoneE164, from: FROM_NUMBER, body });
}
