# EVA Backend (POC)

Flask API for the EVA Medical Assistant service layer.

## Quick start

Use **Python 3.11+** for the venv (`python3.11 -m venv .venv`).

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd .. && cp .env.example .env   # optional: edit values at repo root
cd backend
export FLASK_APP=eva_backend.wsgi:app
flask run --reload
```

Health check: `GET http://127.0.0.1:5000/api/health`

Governed turn: `POST http://127.0.0.1:5000/api/eva/message` with JSON `EVAClientRequest`.

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
- **LLM**: optional; without `LLM_BASE_URL`, skill routing falls back to top similarity candidate; with Ollama/OpenAI-compatible chat, JSON skill selection + answer refinement run live.
