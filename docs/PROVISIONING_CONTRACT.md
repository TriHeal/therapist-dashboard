# Parent Provisioning Contract

## Endpoint

`POST /parent-accounts`

## Request body

```json
{
  "patientId": "string",
  "fullName": "string",
  "relationship": "mother|father|guardian|other",
  "email": "string|null",
  "phone": "string|null",
  "requestAppAccess": true
}
Field rules
patientId — required
fullName — required
relationship — required
email — optional
phone — optional
requestAppAccess — optional; represents the therapist’s request to initiate account provisioning or send an invitation

requestAppAccess is a request-only field. It is not stored on the parent record and must not be treated as canAccessApp.

Backend responsibilities

The backend must perform these operations atomically:

Create or update the parent record.
Add the parent ID to patient.parentIds.
Add the patient ID to parent.patientIds.
Initiate provisioning or invitation when requestAppAccess is true.

The backend determines the resulting values of:

firebaseUid
canAccessApp
Success response

Return the created or updated parent:

{
  "id": "string",
  "therapistId": "string",
  "firebaseUid": "string|null",
  "fullName": "string",
  "email": "string|null",
  "phone": "string|null",
  "relationship": "mother|father|guardian|other",
  "canAccessApp": false,
  "patientIds": ["patientId"],
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
Errors

For 4xx and 5xx responses, return a descriptive error body.

The frontend must surface the error and must not silently fall back to mock mode.

Parent read contract

Until the backend exposes parent details for read operations, the frontend uses patient.parentIds.length as the linked-parent count.

In API mode, it must not display an empty parent list as though no parents exist when only the detailed read endpoint is missing.
