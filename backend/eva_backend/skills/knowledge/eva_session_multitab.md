# Skill: Eva session context—tabs, scribe, and history

## Purpose
Describe how **Eva stays tied to each patient context** when therapists use **multiple chart tabs**, **parallel work**, and **documentation / scribe** features—so questions and answers do not bleed across patients.

## Multi‑patient / multi‑tab behavior
- Each **patient chart tab** should carry its own **context id** (patient, visit, tab). Eva answers **only** for the tab that sent the request.
- When the same therapist has **Patient A in room 1** and **Patient B in room 2**, switching tabs switches Eva’s grounding; the client must send the **correct tab’s** chart snapshot with each message.

## Scribe pause and resume
- Therapists may **pause documentation**, **pause scribe**, or **pause dictation / voice capture** for **Patient A** while actively documenting **Patient B** in another room or tab.
- **Resume scribe** (or resume dictation) picks up only for the tab that is focused; Eva should respect **scribe state** flags from the client (paused vs active) and must **not** imply the microphone is on when **scribe is paused**.
- **Resume** for Patient 2 should not replay Patient 1 audio or text unless the client explicitly routes that content (normally it does not).

## Routing phrases (embedding helpers)
Pause scribe, resume scribe, scribe paused, dictation off, two patients open, separate tabs per patient, multitab EMR, do not mix charts, wrong patient context.

## Historical questions (“I asked this last week”)
- When the product stores **per‑patient (and per‑clinic) question history**, Eva can reference **prior authorized Q&A** to give consistent answers. Without that store, Eva can only work from **current** context and should say history is unavailable.

## Typical therapist questions (examples)
- “Continue what we discussed for this patient yesterday.”
- “I paused scribe—are you still listening?”
- “Don’t mix this with my other open chart.”

## POC limitations
Conversation memory is **not** implemented server‑side unless the client sends thread history in the payload.
