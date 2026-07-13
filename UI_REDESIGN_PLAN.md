# TriHeal — Dashboard UI/UX Redesign Plan

> **Date:** 2026-07-12
> **Scope:** Refactor the frontend UI and UX to simplify the therapist's workflow.
> **Constraint:** These PRs should only be started AFTER the API Migration (`PR_PLAN.md`) is fully complete.
> **Important Note:** Do not delete data fetching, metrics calculations, or backend logic just because they are removed from the UI. Keep the data collection intact and focus *only* on cleaning up the visual display.

---

## Architecture & Conceptual Shift

The current application relies heavily on a "Sessions Diary" approach. The new paradigm shifts the focus to a continuous **Activity Timeline** and task management (Missions). 

| Concern | Old Workflow | New Workflow |
|---|---|---|
| Dashboard | Complex widgets, recent alerts, upcoming sessions | Clean list of patients with a clear `+` button |
| Patient Overview | Focused on past sessions | Focused on active/completed Missions |
| Sync Metrics | Raw data and graphs only | Textual insights translating metrics into therapist instructions |
| History | Session-by-session records | Continuous Activity Timeline |

---

## PR Dependency Graph

```
PR 1  Dashboard Simplification
 └─ PR 2  Patient Overview (Missions Focus)
     ├─ PR 3  Sync Metrics Textual Insights
     └─ PR 4  Activity Timeline (Replace Session Diary)
```

---

## PR 1 — Dashboard Simplification

**Branch:** `feat/ui-dashboard-main`

### Changes
- Remove complex widgets (alerts, upcoming sessions) from the main page (`/`).
- Implement a clean roster view listing all patient names.
- Add a prominent `+` button for adding a new patient.

---

## PR 2 — Patient Overview (Missions Focus)

**Branch:** `feat/ui-patient-overview`

### Changes
- Refactor the main patient page (`/patients/[patientId]`).
- Move active and completed missions to the forefront.
- Clearly display the progress and status of each mission.

---

## PR 3 — Sync Metrics Textual Insights

**Branch:** `feat/ui-metrics-insights`

### Changes
- Enhance the existing sync metrics charts.
- Add a logic layer to translate raw metrics into human-readable instructions (e.g., *"There is an improvement of X in sync between missions"*).
- Keep the visual charts but surround them with textual context.

---

## PR 4 — Activity Timeline (Replace Session Diary)

**Branch:** `feat/ui-timeline`

### Changes
- Transition the concept of the "Sessions Diary" into an "Activity Timeline".
- Aggregate events (app logins, mission completions, session logs, sync loss) onto a unified timeline based on time rather than isolated meetings.
- Reduces double-documentation overhead for the therapist.

---

## Summary Table

| PR | Branch | Scope |
|---|---|---|
| 1 | `feat/ui-dashboard-main` | Clean main dashboard with patient list and `+` button |
| 2 | `feat/ui-patient-overview` | Focus patient page on missions |
| 3 | `feat/ui-metrics-insights` | Translate sync metrics into textual insights |
| 4 | `feat/ui-timeline` | Replace Sessions Diary with an Activity Timeline |

---

## Phase 2: Patient-Centric Architecture (Tree Navigation)

| PR | Branch | Scope |
|---|---|---|
| 5 | `feat/pr-dashboard-merge` | Merge Dashboard into Patients list |
| 6 | `feat/pr-add-patient-form` | "Add Patient" Modal Dialog & Server Action (Mocks + API) |
| 7 | `feat/pr-remove-globals` | Delete global Schedule and Live Sessions screens |
| 8 | `feat/pr-patient-tree` | Sidebar becomes a Patient Tree; move Live Session into patient routes |

---

## PR 5 — Merge Dashboard & Patients List

**Branch:** `feat/pr-dashboard-merge`

### Changes
- Delete the old `/therapist` Dashboard page.
- Set the root `/therapist` path to redirect directly to `/therapist/patients`.
- Move the `+` "Add Patient" button into the Patients roster view.

---

## PR 6 — Add Patient Form & Action

**Branch:** `feat/pr-add-patient-form`

### Changes
- Convert the `+` button into a trigger for a "Add Patient" Modal (Dialog) instead of navigating to a new page.
- Build a cute, user-friendly form inside the Dialog with `displayName` and `age` fields.
- Implement a Server Action (`createPatient`) in `src/lib/actions/patients.actions.ts`.
- The action will support both Mock Data and real Backend POST to `/patients` (using `USE_API`), consistent with existing data services.

---

## PR 7 — Remove Global Modules

**Branch:** `feat/pr-remove-globals`

### Changes
- Delete the `Schedule` module entirely.
- Delete the global `Live Sessions` page (`/therapist/live`).

---

## PR 8 — Patient-Centric Sidebar (The Tree)

**Branch:** `feat/pr-patient-tree`

### Changes
- Modify `<AppSidebar>` to read the `patientId` from the URL.
- If in a patient context, the sidebar replaces global links with a "Patient Tree":
  - **Live Session:** (Moved to `/therapist/patients/[patientId]/live`)
  - **Timeline & Review:** (`/therapist/patients/[patientId]/timeline`)
  - **Back to Patients:** Escape hatch back to the global list.
