# Bootstrap prompts (reuse in Cursor)

## A. Project bootstrap

Using the existing EVA project context and Cursor rules, extend or verify the monorepo POC structure. Keep backend-first boundaries, Redis and LLM placeholders, and deployment scaffolding minimal.

## B. Backend scaffold

When adding backend features, use the app factory, thin blueprints, services for orchestration, `prompts/` for text, and adapters for Redis/LLM. Avoid embedding prompt strings in route handlers.

## C. Architecture planning

Before large changes, summarize components, request flow, folder layout, and mark POC must-have vs phase 2 vs future.

## D. Cursor-safe implementation

Inspect the repository and align with existing patterns. Propose minimal diffs, then implement only the requested task.

## E. Rule refinement

Periodically review `.cursor/rules/` for duplication, missing Flask conventions, or unclear agent/memory boundaries; propose concrete edits.
