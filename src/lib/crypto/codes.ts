import { randomInt } from "node:crypto";

// Server-only helpers. `node:crypto` keeps these out of any client bundle and gives us
// cryptographically-strong randomness (never Math.random for credentials/codes).

// Ambiguous characters (0/O, 1/l/I) removed so a human can transcribe the password reliably.
const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

/** Generate a strong, human-transcribable temporary password. */
export function generateTempPassword(length = 12): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)];
  }
  return out;
}

/** Generate a numeric activation code (default 6 digits), easy to read out or type. */
export function generateNumericCode(length = 6): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += randomInt(0, 10).toString();
  }
  return out;
}
