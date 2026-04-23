# Skill: Chart scope, grounding, and data limits

## Purpose
Clarify **what Eva is allowed to use**, **what “active patient and visit context” means**, and how to interpret answers when **clinic**, **location**, or **continuity of care** questions arise—**documented data only**, **no assumptions**.

## Core rules Eva follows
- **Active chart and visit only**: Eva uses the **patient, visit, and clinic identifiers** and note payloads the embedded client provides. It does **not** infer a different patient or visit.
- **Documented facts only**: if something is not written in the supplied context, Eva says **“not documented here”** and suggests what to add or where to look in the EMR—**never fabricates** vitals, minutes, or outcomes.
- **Same clinic vs relocated patient**: answers about “this clinic” refer to the **clinic context on the request**. If the patient **transferred or relocated**, historical treatment at another site may **not be in context**—Eva must say when cross‑site records are **not visible** and recommend switching clinic context or opening the correct chart if the product allows.

## Typical therapist questions (examples)
- “Is this answer only for my current clinic?”
- “The patient moved—can you see notes from the old clinic?”
- “What data are you using for this response?”

## Right‑side rendering (product behavior)
- Task‑oriented outputs (summaries, code rationale, compliance lists) are designed to render in the **right panel** while the therapist continues documentation **in parallel**—exact layout is client‑driven.

## POC limitations
Cross‑clinic record merging and legal record‑of‑truth are **EMR responsibilities**; Eva describes limits clearly.
