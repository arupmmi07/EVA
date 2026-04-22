# ADR 0001: Monorepo POC layout

## Status

Accepted (POC)

## Context

EVA needs a single repository that holds frontend and backend during the foundation phase, with backend as the primary implementation focus and future micro-frontend flexibility.

## Decision

Use a monorepo with:

- `backend/` — Python package `eva_backend` and Flask entrypoint
- `frontend/` — placeholder only until MFE work begins
- `deploy/` — Docker-based scaffolding
- `docs/` — lightweight written architecture and prompts

## Consequences

- Clear separation: backend must not import frontend code.
- Frontend contributors can work in parallel using stable HTTP contracts.
- CI/CD can start with backend-only pipelines without blocking on UI.
