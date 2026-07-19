# Implementation Plan: Therapy Sessions Table & Creation Flow

This plan outlines the steps for adding a **Therapy Sessions** tab under the therapist's patient view. This tab will display a table containing historical therapeutic sessions and a "+ New Session" button. Clicking the button opens a multi-step dialog where the therapist selects which activities to include, adds clinical notes, and starts the session (calling the backend and redirecting to the live view).

The entire feature is nested specifically under the dynamic patient route (i.e. `/therapist/patients/[patientId]/sessions`), meaning it is accessed on a per-patient basis. To avoid collision with authentication or login sessions, we will use the name `therapySession` / `TherapySession` everywhere in the codebase (types, files, actions).

---

## Technical Alignment & Gotchas

### 1. Activity Type Enum Discrepancy
There is a naming discrepancy in the NestJS backend between the static catalog and the database entities:
- **Catalog Endpoint (`GET /activities/catalog`) returns:** `breathing`, `event_decomposition`, `memory_book`, `tree_forest`, `leaf_on_water`.
- **Session DB Entity/DTO (`POST /therapy-sessions`) expects:** `breathing`, `event_processing`, `memory_lake`, `bonding_forest`, `leaf_on_water`.

**Resolution:**
We will use the **Session DB Entity** naming convention (`breathing`, `event_processing`, `memory_lake`, `bonding_forest`, `leaf_on_water`) for frontend state and API payloads to prevent NestJS DTO validation errors (400 Bad Request).

---

## PR 1: Types, Localization, Subnav Tab, and Page Shell

### Proposed Changes

#### [MODIFY] [session.ts](file:///c:/Users/david/PTSD/therapist-dashboard/src/types/session.ts)
- Extend the `Session` type to include an optional `activities` array field matching the updated Firestore sub-collection database schema:
  ```typescript
  activities?: { type: string; order: number; status: string }[];
  ```

#### [MODIFY] [dictionaries.ts](file:///c:/Users/david/PTSD/therapist-dashboard/src/lib/i18n/dictionaries.ts)
- Update the `Dictionary` type definition (specifically the `patientSubnav` object type) to support `sessions: string`.

#### [MODIFY] [he.json](file:///c:/Users/david/PTSD/therapist-dashboard/src/lib/i18n/locales/he.json)
- Add translation keys for the Therapy Sessions table and dialog elements so the interface translates dynamically (Hebrew/English) without hardcoded strings:
  ```json
  "patientSubnav.sessions": "סשנים",
  "sessionsTable.id": "מזהה",
  "sessionsTable.date": "תאריך",
  "sessionsTable.type": "סוג",
  "sessionsTable.status": "סטטוס",
  "sessionsTable.activities": "פעילויות",
  "sessionsTable.notes": "הערות",
  "sessionsTable.newSession": "סשן חדש",
  "sessionsTable.noSessions": "אין סשנים טיפוליים רשומים למטופל זה.",
  "newSessionDialog.title": "יצירת סשן טיפולי חדש",
  "newSessionDialog.description": "בחר את הפעילויות שברצונך לכלול בסשן הטיפולי הנוכחי.",
  "newSessionDialog.date": "תאריך ושעה",
  "newSessionDialog.notes": "הערות קליניות",
  "newSessionDialog.selectActivities": "בחר פעילויות לסשן",
  "newSessionDialog.submit": "התחל סשן",
  "newSessionDialog.breathing": "נשימה וויסות",
  "newSessionDialog.event_processing": "פירוק אירוע",
  "newSessionDialog.memory_lake": "ספר הזיכרונות",
  "newSessionDialog.bonding_forest": "יער הקשר",
  "newSessionDialog.leaf_on_water": "עלה על המים"
  ```

#### [MODIFY] [en.json](file:///c:/Users/david/PTSD/therapist-dashboard/src/lib/i18n/locales/en.json)
- Add matching English translation keys to support localization.

#### [MODIFY] [patient-subnav.tsx](file:///c:/Users/david/PTSD/therapist-dashboard/src/components/patients/patient-subnav.tsx)
- Add the Sessions tab link `/therapist/patients/${patientId}/sessions` between `Overview` and `Timeline` (nested inside the specific patient view).

#### [NEW] [page.tsx](file:///c:/Users/david/PTSD/therapist-dashboard/src/app/therapist/patients/[patientId]/sessions/page.tsx)
- Create a server page nested under a specific patient route. It retrieves patient details and their sessions from the backend/mock DB and renders the layout shell.

---

## PR 2: Server Action & Therapy Sessions Table Component

> [!WARNING]
> **Git Workflow Reminder:** PR 2 requires the changes of PR 1 to run and be verified locally. For development, implement/keep PR 1 changes in your local branch. **BEFORE pushing to Git**, you must revert/delete the PR 1 changes from this branch/commit to prevent conflicts and code duplication.

### Proposed Changes

#### [NEW] [therapy-sessions.actions.ts](file:///c:/Users/david/PTSD/therapist-dashboard/src/lib/actions/therapy-sessions.actions.ts)
- Create Server Action `createTherapySession(patientId: string, activityTypes: string[])`:
  - POSTs to backend `/therapy-sessions` with NestJS CreateTherapySessionDto format.
  - Gracefully falls back to mock `sessions` array if API returns 404/501.
  - Revalidates path cache to update views.

#### [MODIFY] [sessions.service.ts](file:///c:/Users/david/PTSD/therapist-dashboard/src/lib/data/services/sessions.service.ts)
- Update `mapBackendSession` to read and map the `activities` array if returned by backend.

#### [NEW] [sessions-table-container.tsx](file:///c:/Users/david/PTSD/therapist-dashboard/src/components/sessions/sessions-table-container.tsx)
- Create client component rendering the historical list table and placeholder button.

---

## PR 3: Create Session Dialog & Activity Selection Grid

> [!WARNING]
> **Git Workflow Reminder:** PR 3 requires the changes of PR 1 and PR 2 to run and be verified locally. For development, implement/keep PR 1 and PR 2 changes in your local branch. **BEFORE pushing to Git**, you must revert/delete the PR 1 and PR 2 changes from this branch/commit to prevent conflicts and code duplication.

### Proposed Changes

#### [NEW] [create-session-dialog.tsx](file:///c:/Users/david/PTSD/therapist-dashboard/src/components/sessions/create-session-dialog.tsx)
- Build a beautiful modal/dialog containing:
  - Form fields for clinical notes (`clinicalNotes`).
  - An interactive grid of activity selection cards (Breathing, Event Processing, Memory Lake, Bonding Forest, Leaf on Water) with Lucide icons.
  - Integration to call `createTherapySession` and redirect to `/therapist/patients/${patientId}/live`.

---

## PR 4: End Session Button & Status Update Flow

### Proposed Changes

#### [MODIFY] [therapy-sessions.actions.ts](file:///c:/Users/david/PTSD/therapist-dashboard/src/lib/actions/therapy-sessions.actions.ts)
- Add Server Action `endTherapySession(sessionId: string)`:
  - Call backend PATCH or POST to update session status to `completed` / `inactive`.
  - Revalidate cache for the patient's sessions path.

#### [NEW] [end-session-button.tsx](file:///c:/Users/david/PTSD/therapist-dashboard/src/components/sessions/end-session-button.tsx)
- Build a client component for the "End Session" button.
- Integrate it into the Live Session view `/therapist/patients/[patientId]/live`.
- Trigger `endTherapySession` server action and redirect the therapist back to the `/therapist/patients/[patientId]/sessions` page upon success.

---

## Verification Plan

### Automated Tests
- Run production build check: `yarn build`
- Run lint and syntax check: `yarn lint`

### Manual Verification
- Access the new `/therapist/patients/[patientId]/sessions` route in both Hebrew and English.
- Confirm "+ New Session" dialog operates, submits successfully, redirects, and updates the table.
- Verify the "End Session" button successfully updates the session status and redirects back to the sessions list.

