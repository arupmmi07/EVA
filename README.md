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

### EVA governed API (POC)

- `POST /api/eva/chat` — body `EVAClientRequest` (`query` + `inputPanel`). Response: `EVAServiceResponse` (`conversation` + **`outputPanel`** with `render.blocks` and `rightPanel`, mirroring the request shape). Runs skill routing, then the **agent orchestrator** LLM for the final structured turn.
- `POST /api/eva/skill-resolution` — same body; response: `EVASkillResolutionResponse` (skill resolution: retrieval + classifier LLM; not a chat resource).
- `POST /api/eva/message` — **retired** (HTTP 410); use `skill-resolution` + `chat` above.
- `POST /api/eva/chat/legacy` — simple `{ "message": "..." }` smoke test (non-governed).

### Run everything locally (Redis + LLM + Flask + Vite)

1. **Redis Stack (vector-ready Redis)** — from repo root:

   ```bash
   docker compose -f deploy/docker-compose.yml pull redis
   docker compose -f deploy/docker-compose.yml up -d redis
   ```

   Redis is on **`localhost:6379`**. In root **`.env`** set `REDIS_URL=redis://127.0.0.1:6379/0` (see `.env.example`).

2. **LLM** — choose one (values go in root **`.env`**; never commit real keys):

   - **Ollama (recommended for local):** install [Ollama](https://ollama.com), run `ollama serve`, then `ollama pull llama3.2` (or your tag). Set `LLM_BASE_URL=http://127.0.0.1:11434`, `LLM_PROVIDER=ollama`, `LLM_MODEL=llama3.2`.
   - **OpenAI:** set `LLM_BASE_URL=https://api.openai.com/v1`, `LLM_PROVIDER=openai_compatible`, `LLM_MODEL=gpt-4o-mini`, `OPENAI_API_KEY=sk-...`.
   - **Other OpenAI-compatible** gateways: same as OpenAI; set `OPENAI_API_KEY` only if that server expects a `Bearer` token.

3. **Backend** — Python **3.9+** venv (`python3 -m venv .venv`; use `python3.11` only if that binary exists), install deps, run Flask on **5000**:

   ```bash
   cd backend && python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   cd ..   # repo root so .env is found (optional, for copying .env)
   cd backend && python -m flask --app eva_backend.wsgi:app run --reload --port 5000
   ```
   If you prefer `flask run`, set `export FLASK_APP=eva_backend.wsgi:app` first (from `backend/`). Without **`eva_backend.wsgi:app`**, Flask reports it cannot find the application.

4. **Frontend** — optional live API:

   ```bash
   cd frontend && cp .env.example .env
   # set VITE_EVA_USE_BACKEND=1 in frontend/.env
   npm install && npm run dev
   ```

   Vite proxies **`/api` → `http://127.0.0.1:5000`**.

Without Redis, the app still runs; skill vectors use an in-memory fallback.

### Full stack in Docker (API + Redis only)

`docker compose -f deploy/docker-compose.yml up --build` starts **redis** + **api** on **http://localhost:8000** (pass `LLM_*` and `OPENAI_API_KEY` via env or a compose override file). The Vite app is not in this compose file; use local `npm run dev` + proxy, or point the FE at `:8000/api`.

## Configuration

Copy **`.env.example`** to **`.env`** at the repository root and adjust. The backend loads **`.env`** from the repo root when present.

## Documentation

- [Testing the EVA system locally (servers, env, Postman, pipeline metadata)](docs/testing-ev-system.md)
- [Project overview](docs/project-overview.md)
- [POC architecture](docs/architecture/poc-architecture.md)
- [Bootstrap prompts](docs/prompts/bootstrap-prompts.md)
- [ADR 0001: monorepo POC](docs/decisions/0001-monorepo-poc.md)
