# Skill: Scheduler & calendar view

## Purpose
Help users **read** and **navigate** the scheduler UI: day view, unconfirmed appointments, filters, and high-level schedule questions.

## Typical guidance
- Explain what each **panel** or **accordion** represents (unconfirmed vs schedule changes vs today’s patients).
- For “what’s next” questions, tie answers to **current right panel screen** from `inputPanel.rightPanel` when provided.
- Prefer **highlight** or **open** right-panel hints over narrating every navigation (aligns with governed UX).

## Edge cases
- If the user asks about a patient not visible in the current filter → ask them to select the row or widen the filter.
- If `hasUnsavedWork` is true and navigation is requested → use `prompt_before_navigate` in a future contract version; POC may mention saving first in text.

## POC limitations
No live schedule data; responses describe what the UI would show once connected to the scheduler service.
