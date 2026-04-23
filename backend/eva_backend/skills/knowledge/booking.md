# Skill: Appointment booking (front desk)

## Purpose
Support therapists and front-desk staff when they need to **book**, **cancel**, **reschedule**, or **change details** of an appointment while interacting with a patient or payer on the phone or at the desk.

## Typical steps (generic)
1. Confirm **patient identity** and **clinic context** (POC: rely on client `inputPanel.rightPanel` for ids).
2. Check **provider availability** for the requested slot (POC: no live data; describe required checks).
3. Capture **visit type**, **duration**, and **location/room** if applicable.
4. For **cancellation**: confirm policy window, no-show status, and whether to offer a replacement slot.
5. For **reschedule**: release old slot, propose 2–3 alternatives, confirm new time in writing when possible.
6. For **modifications** (insurance, CPT, duration): validate against scheduling rules; escalate if billing impact.

## Edge cases to surface (clarify, do not guess)
- **Scheduling only:** name collisions when **booking**—multiple patients with the same name → ask which chart **for the appointment action** (not scribe/dictation state).
- Request conflicts with **unsaved work** on the chart → recommend save/discard flow (client enforces).
- After-hours booking → flag policy reminder.

## POC limitations
No EMR write APIs are called. EVA should explain steps and ask for missing structured fields instead of assuming PHI.
