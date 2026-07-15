# Parent Provisioning & Activation Codes — Backend Contract

The therapist dashboard ships the full UI + server actions for three features:

1. **Create parent account** (email + phone)
2. **Automated invite** — a short activation code delivered to the parent by SMS (Twilio)
3. **Session / activation code** — a short, expiring code a therapist generates per child

Today these run in **mock mode**: the frontend generates the codes in-memory and simulates the
SMS send (`console.log`). When `NEXT_PUBLIC_API_BASE_URL` is set (`USE_API`), the same server
actions call the endpoints below on the NestJS backend (`backend-heal`) instead.
This document is the contract that backend must implement to make the `USE_API` path real.

All requests are authenticated with the therapist's Firebase ID token as `Authorization: Bearer <token>`
(the frontend attaches this automatically via `src/lib/api/client.ts`). Sensitive work — creating auth
users, minting codes, sending SMS, persisting codes — must happen server-side; **no admin secrets
live in the frontend**.

Frontend callers:

- `src/lib/actions/provisioning.actions.ts` → `createParentAccount`
- `src/lib/actions/session-codes.actions.ts` → `generateSessionCode`

Shared types: `src/types/parent-account.ts`, `src/types/session-code.ts`.

---

## 1. `POST /parent-accounts`

Create a parent login account and text them a short activation code.

**Request body**

```json
{
  "email": "parent@example.com",
  "phone": "0501234567",
  "childId": "p1"
}
```

- `email` — validated + lowercased by the frontend; re-validate server-side.
- `phone` — normalized (spaces/dashes stripped) by the frontend; re-validate server-side. Convert to
  E.164 before texting (the frontend mock maps a leading `0` to `+972`).
- `childId` — optional; may be omitted until real parent↔child linkage exists.

**Server responsibilities**

1. Create a Firebase Auth user (Admin SDK) for `email` if one does not already exist.
2. Generate a short activation code (do **not** accept one from the client) and persist it with an expiry.
3. Send the code to `phone` via **Twilio SMS**.
4. Persist a `ParentAccount` record with `status: "invited"`.

**Response `200`** — the account **without** the code:

```json
{
  "id": "pa_abc123",
  "email": "parent@example.com",
  "phone": "0501234567",
  "childId": "p1",
  "status": "invited",
  "createdAt": "2026-07-15T10:00:00.000Z"
}
```

> The activation code is **never** returned to the therapist in `USE_API` mode — it only reaches
> the parent via SMS. (In mock mode the frontend surfaces it on-screen precisely because no SMS is sent.)

**Errors** — return a non-2xx status; the frontend maps any failure to a generic error message.
Consider `409` if the email already has an account.

---

## 2. `POST /patients/:id/activation-code`

Mint a short activation code for a specific child/session.

**Request** — no body; `:id` is the patient id.

**Server responsibilities**

1. Generate a **6-digit numeric** code.
2. Persist it against the patient/account with an expiry (frontend mock uses **15 minutes**).
3. Invalidate any prior **active** code for the same patient (single active code at a time).

**Response `200`**

```json
{ "code": "042915", "expiresAt": "2026-07-15T10:15:00.000Z" }
```

`expiresAt` must be an ISO-8601 timestamp; the UI renders a live countdown from it.

---

## 3. `POST /activation-codes/:code/redeem` *(out of scope for this dashboard)*

Consumed by the **parent/child app**, not the therapist dashboard — documented here for completeness.

- Validate the code exists, is `active`, and is not past `expiresAt`.
- Mark the associated `ParentAccount` `active` and the code `used`.
- Return the session/credentials the client app needs to complete first login.

---

## Notes

- `apiFetch` (`src/lib/api/client.ts`) serializes the request body with a single `JSON.stringify`
  and sets `Content-Type: application/json` — send/accept plain JSON objects.
- Keep response field names aligned with `ParentAccount` / `ActivationCode` in `src/types` so the
  frontend consumes responses without transformation.
