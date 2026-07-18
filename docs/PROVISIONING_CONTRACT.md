# Parent Provisioning — Backend Contract

The therapist dashboard provides a flow for creating a parent account for a specific patient.

The dashboard collects:

- Parent email
- Parent phone number
- Patient ID

When `NEXT_PUBLIC_API_BASE_URL` is configured, the dashboard calls the NestJS backend. Sensitive operations must remain in the backend:

- Creating the Firebase Auth user
- Generating activation credentials
- Persisting the parent account
- Linking the parent to the patient
- Sending SMS or email invitations

Frontend caller:

- `src/lib/actions/provisioning.actions.ts` → `createParentAccount`

Shared type:

- `src/types/parent-account.ts`

---

## `POST /parent-accounts`

Create a parent account, associate it with a patient, and send the parent an activation invitation.

### Request body

```json
{
  "email": "parent@example.com",
  "phone": "0501234567",
  "childId": "patient-id"
}

email must be validated and normalized.
phone must be validated and converted to E.164 format before sending SMS.
childId is required and identifies the patient associated with the parent.
Server responsibilities
Verify that the authenticated therapist owns the patient.
Create or locate the parent Firebase Auth user.
Create the parent account record.
Associate the parent account with the patient.
Generate a secure activation credential.
Persist the credential with an expiration time.
Send the activation invitation through Twilio or SendGrid.
Return the created parent account without exposing the activation credential.
Response
{
  "id": "parent-account-id",
  "email": "parent@example.com",
  "phone": "0501234567",
  "childId": "patient-id",
  "status": "invited",
  "createdAt": "2026-07-15T10:00:00.000Z"
}
Errors
400 — invalid email, phone, or request body
401 — unauthenticated request
403 or 404 — therapist does not own the selected patient
409 — parent account already exists, when applicable
500 — unexpected provisioning or delivery failure

The child live-session code flow is handled separately through the existing backend OTP and therapy-session APIs.
```
