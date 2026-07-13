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
