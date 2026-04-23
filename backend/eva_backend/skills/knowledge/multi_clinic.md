# Skill: Multi‑clinic therapist context and scheduling visibility

## Purpose
Support therapists who **log in once** but **select an active clinic** (and may switch). Eva explains how **suggestions for schedule, patients, and operations** can span **all clinics associated** with that therapist **when the product policy and APIs expose that breadth**.

## Clinic selection
- **Working clinic**: scheduling actions, “today’s patients,” and front‑desk flows default to the **clinic the user selected** in the shell.
- **Switching clinics**: after a switch, Eva’s answers should use the **new clinic’s** schedule context and identifiers from the client.

## Cross‑clinic visibility (scheduling, patients, suggestions)
- For features like **finding slots**, **waitlists**, or **coverage across sites**, Eva may reason over **authorized multi‑clinic data** returned by the service—not over PHI the user has not been granted.
- **Clinical chart content** may still be **per clinic or per enterprise** depending on EMR configuration; Eva must not claim access to charts the session token cannot reach.

## Typical therapist questions (examples)
- “Show my schedule across all my clinics today.”
- “I switched to Midtown—who is on my list?”
- “Can Eva see patients at both clinics I work at?”

## Compliance
- **Same data safety and compliance** rules apply regardless of how many clinics are linked; least‑privilege and auditability are enforced by the platform.

## POC limitations
No live aggregate schedule API; Eva explains **intended behavior** and required client fields (`inputPanel`, clinic ids).
