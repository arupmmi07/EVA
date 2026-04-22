# EVA Medical Assistant

EVA Medical Assistant is an early-stage POC for an AI-powered medical assistant platform intended to support an EMR-embedded assistant experience.

## Current Scope

This repository contains both frontend and backend foundations in a single project, with the backend as the current implementation focus.

## Initial Tech Direction

- Python
- Flask
- Redis
- Local LLM
- Agentic orchestration for EVA main agent

## Current Goals

- establish the monorepo structure
- scaffold the EVA backend service
- prepare for frontend integration
- support local development and basic deployment

## Status

POC / foundation phase

## Repository layout

| Path | Responsibility |
|------|----------------|
| `backend/eva_backend/` | Flask app factory, API blueprints, services, LLM adapter, Redis placeholder, prompts |
| `frontend/` | Vite + React demo shell; set `VITE_EVA_USE_BACKEND=1` to call the EVA API via proxy |
| `deploy/` | Docker / compose scaffolding for local and simple deployment |
| `docs/` | Overview, architecture notes, bootstrap prompts, ADRs |
| `.cursor/rules/` | Cursor agent rules aligned with POC constraints |

## Quick start (backend)

See [backend/README.md](backend/README.md).

### EVA message contract (POC)

- `POST /api/eva/message` — body `EVAClientRequest` (`query` + `inputPanel` with `render` and `rightPanel`). Response: `EVAServiceResponse` with `render.blocks` and `rightPanel` hints.
- Legacy: `POST /api/eva/chat` (simple `message` string) remains for smoke tests.

### Frontend + backend together

1. Start Redis Stack: `docker compose -f deploy/docker-compose.yml up -d redis` (optional; without Redis, skill vectors run in-process).
2. Root `.env`: set `REDIS_URL` and optional `LLM_BASE_URL` (e.g. Ollama OpenAI-compatible).
3. Terminal A — backend: follow `backend/README.md` (`flask run` on port **5000**).
4. Terminal B — frontend: `cd frontend && cp .env.example .env` then set `VITE_EVA_USE_BACKEND=1` in `.env`, `npm install`, `npm run dev`. Vite proxies `/api` → `http://127.0.0.1:5000`.

### Full stack in Docker

`docker compose -f deploy/docker-compose.yml up --build` starts **redis** + **api** (gunicorn on **8000**). Point a reverse proxy or temporary FE env at `http://localhost:8000/api` if not using Vite proxy.

## Configuration

Copy `.env.example` to `.env` at the repository root and adjust. The backend loads `.env` from the repo root when present.

## Documentation

- [Project overview](docs/project-overview.md)
- [POC architecture](docs/architecture/poc-architecture.md)
- [Bootstrap prompts](docs/prompts/bootstrap-prompts.md)
- [ADR 0001: monorepo POC](docs/decisions/0001-monorepo-poc.md)
# EVA
