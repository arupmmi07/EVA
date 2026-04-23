# EVA Backend (POC)

Flask API for the EVA Medical Assistant service layer.

## Quick start

Use **Python 3.9+** on your machine (`python3 --version`). If `python3.11` exists you may use it; otherwise **`python3 -m venv .venv`** is fine.

Run commands from the **`backend/`** directory so Python can import the `eva_backend` package.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd .. && cp .env.example .env   # optional: edit values at repo root
cd backend
```

Start the server (pick **one**):

```bash
# Option A — explicit app (works in zsh/bash without exporting FLASK_APP)
python -m flask --app eva_backend.wsgi:app run --reload --port 5000

# Option B — classic env var
export FLASK_APP=eva_backend.wsgi:app
flask run --reload --port 5000
```

If you see **“Could not locate a Flask application”**, you are missing **`eva_backend.wsgi:app`** — do not use `--app app` or `--app eva_backend` alone; the entry module is **`eva_backend.wsgi`** and the variable name is **`app`**.

Health check: `GET http://127.0.0.1:5000/api/health`

Governed turn: `POST http://127.0.0.1:5000/api/eva/chat` with JSON `EVAClientRequest` → `EVAServiceResponse` (`outputPanel` + `metadata`).  
Skill resolution: `POST http://127.0.0.1:5000/api/eva/skill-resolution` → `EVASkillResolutionResponse`.  
Retired: `POST /api/eva/message` (410). Legacy smoke: `POST /api/eva/chat/legacy`.

Full local test flow (Redis, Ollama, env, comparing vector hits vs LLM router): [../docs/testing-ev-system.md](../docs/testing-ev-system.md).

## Layout

- `eva_backend/app.py` — application factory
- `eva_backend/api/` — HTTP blueprints (thin)
- `eva_backend/contracts/` — Pydantic models for `EVAClientRequest` / `EVAServiceResponse`
- `eva_backend/services/` — EVA orchestration (`eva_message_handler`, legacy `eva_orchestrator`)
- `eva_backend/skills/` — JSON registry + markdown knowledge + Redis-backed embedding index (hashing POC)
- `eva_backend/llm/` — LLM provider abstraction
- `eva_backend/state/` — Redis client (extended hash/set ops for skills)
- `eva_backend/prompts/` — prompt templates (not embedded in routes)
- `eva_backend/config/` — environment-based settings

## Assumptions

- **Redis**: optional; when `REDIS_URL` is set, skill vectors are stored in Redis hashes and searched with cosine similarity (deterministic hashing embeddings until you plug in a real embedder).
- **LLM**: with Ollama/OpenAI-compatible chat, skill routing + agent orchestrator run live; configure `LLM_*` in `.env`.
