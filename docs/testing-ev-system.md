# Testing the EVA system locally

This guide covers starting dependencies, environment variables, the API, and how to read **similarity search vs LLM routing** in responses.

## What you are testing

1. **Chunk index** — Skill knowledge is split into chunks and stored in Redis (or in-memory if Redis is unavailable). The index rebuilds when registry or knowledge files change.
2. **`POST /api/eva/skill-resolution`** — **Stage 1 only:** vector similarity → **skill router LLM** → `EVASkillResolutionResponse` (routing metadata; no full UI orchestration).
3. **`POST /api/eva/chat`** — **Full governed turn:** runs **stage 1** (same as skill-resolution: vector search + skill-router LLM) **in-process**, then **stage 2** — the **orchestrator** LLM — which turns routing + capsule context into **`conversation`**, **`outputPanel`** (`render.blocks`, `rightPanel`, same shape as request **`inputPanel`**), and **`metadata.display`** (explicit left vs right panel instructions for the host). Same request body as skill-resolution (`EVAClientRequest`). Stage 2 is the extension point for injecting more context later without changing the HTTP contract.
4. **Optional debug** — `GET /api/eva/knowledge/chunks` lists indexed chunks when enabled.

`POST /api/eva/message` is **retired** (returns **410** with pointers to the endpoints above).

---

## Prerequisites

- **Python 3.9+** on your PATH as `python3` (3.11+ is optional; use `python3.11 -m venv` only if `python3.11` exists)
- **Docker** (optional, for Redis Stack)
- **Ollama** (optional, for local LLM) — [ollama.com](https://ollama.com)

---

## 1. Environment file

From the **repository root**:

```bash
cp .env.example .env
```

Edit **`.env`**. Important variables:

| Variable | Purpose |
|----------|---------|
| `REDIS_URL` | e.g. `redis://127.0.0.1:6379/0` — enables Redis-backed chunk storage |
| `LLM_BASE_URL` | Ollama: `http://127.0.0.1:11434` |
| `LLM_MODEL` | e.g. `llama3.2` |
| `LLM_PROVIDER` | `ollama` or `openai_compatible` or `auto` |
| `OPENAI_API_KEY` | Required only for OpenAI-compatible providers that expect Bearer auth |
| `EMBEDDING_DIM` | Default `128` — keep stable after indexing; changing it requires reindex |
| `EVA_EXPOSE_KNOWLEDGE_API` | Set to `1` to enable `GET /api/eva/knowledge/chunks` |

**Do not duplicate** `LLM_BASE_URL` / `LLM_MODEL` / `LLM_PROVIDER` blocks in the same file; in dotenv the **last** value wins and can silently point the app at the wrong provider.

---

## 2. Start Redis (recommended)

From repo root:

```bash
docker compose -f deploy/docker-compose.yml pull redis
docker compose -f deploy/docker-compose.yml up -d redis
```

Confirm `REDIS_URL` in `.env` matches the compose service (default `localhost:6379`).

If Redis is not running, the backend still starts; chunk search uses an **in-memory** fallback.

---

## 3. Start Ollama (local LLM)

In a separate terminal:

```bash
ollama serve
```

Then pull a model (match `LLM_MODEL` in `.env`):

```bash
ollama pull llama3.2
```

---

## 4. Start the Flask API

The app loads **`.env` from the repository root** when you run Flask from `backend/` (see `eva_backend` package for load path).

Stay in the **`backend/`** directory when you run Flask (so `import eva_backend` resolves).

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m flask --app eva_backend.wsgi:app run --reload --port 5000
```

Equivalent: `export FLASK_APP=eva_backend.wsgi:app` then `flask run --reload --port 5000`.

**Common error:** `Could not locate a Flask application` — you must pass **`eva_backend.wsgi:app`** (the `wsgi` module exposes `app = create_app()`), not `--app app` or `--app eva_backend`.

Smoke test:

```bash
curl -s http://127.0.0.1:5000/api/health
```

---

## 5. Optional: inspect chunks

Set `EVA_EXPOSE_KNOWLEDGE_API=1` in root `.env`, restart Flask, then:

```bash
curl -s http://127.0.0.1:5000/api/eva/knowledge/chunks | head -c 2000
```

You should see `chunk_count`, `chunks` (previews), and `storage` (`redis` or `memory`).

---

## 6. Test the governed APIs

Send an `EVAClientRequest`. Use **`"debug": true`** if you want **full chunk text** per hit inside routing metadata (large JSON).

Example file: `examples/eva_client_request.sample.json`

**Stage 1 — skill resolution** (`EVASkillResolutionResponse`):

```bash
curl -s -X POST http://127.0.0.1:5000/api/eva/skill-resolution \
  -H "Content-Type: application/json" \
  -d @examples/eva_client_request.sample.json
```

**Full turn — chat + right panel** (`EVAServiceResponse`):

```bash
curl -s -X POST http://127.0.0.1:5000/api/eva/chat \
  -H "Content-Type: application/json" \
  -d @examples/eva_client_request.sample.json
```

### Postman example: `POST /api/eva/chat`

Use this when the Flask API is running on port **5000** (see §4).

1. **New** → **HTTP** request.
2. **Method:** `POST`
3. **URL:** `http://127.0.0.1:5000/api/eva/chat`
4. **Headers:** add `Content-Type` = `application/json`
5. **Body** → **raw** → type **JSON**. Paste the sample below (same shape as `examples/eva_client_request.sample.json` in the repo).

```json
{
  "messageType": "EVAClientRequest",
  "version": "1.0",
  "requestId": "req_postman_001",
  "timestamp": "2026-04-22T12:00:00Z",
  "query": {
    "type": "text",
    "rawInput": "How do I see unconfirmed appointments in the scheduler?"
  },
  "inputPanel": {
    "render": {
      "activeTab": "eva"
    },
    "rightPanel": {
      "screen": "scheduler",
      "subScreen": "todaysPatients",
      "hasUnsavedWork": false
    }
  },
  "debug": true
}
```

6. **Send** — expect **200** and JSON with `messageType`: `EVAServiceResponse`. Inspect **`outputPanel`** (UI tree + right-panel hints), **`metadata.pipeline`** (`routing` snapshot + **`orchestrator`** trace on success), and **`metadata.display`** (EMR UX hints).

**Skill resolution only:** same steps, but URL `http://127.0.0.1:5000/api/eva/skill-resolution` and response `messageType`: `EVASkillResolutionResponse`.

---

## 7. Vector search vs LLM skill selection (`vectorSearch`, `skillRouter`, `comparison`)

### Why “router”? Isn’t it just vector + LLM?

Yes: **step 1** = math similarity over chunks (**no LLM**). **Step 2** = one **LLM call** that reads those ranked passages and outputs JSON (`use_skill` / `no_match` / `ambiguous`, `skill_id`, rationale).

In agent / NLU products, **“router”** means **“direct this request to the right handler”**—here the handler is a **skill** (capability), not an HTTP server. So **skill router** = the **LLM step that maps user text → best skill** (same idea as “intent router”). The code still uses the historical name **`skillRouter`** for that step’s trace object.

### What is `skillRouter` in the pipeline?

`metadata.pipeline.skillRouter` (and under chat: `…routing.skillRouter`) holds **only the skill-selection LLM**:

| Key | Meaning |
|-----|--------|
| **`parsed`** | Structured result after we parse the model’s JSON: `decision`, `skill_id`, `rationale`, `clarifying_question`. |
| **`rawLlm`** | Truncated raw text from the model for debugging. |

So: **`vectorSearch`** = retrieval; **`skillRouter`** = the **classifier LLM** that chooses among what retrieval returned.

### Skill ids: one canonical + one trace field

There is **one** LLM that picks the skill today, so duplicating the same id twice was confusing. Now:

| Field | Where | Meaning |
|-------|--------|--------|
| **`chosen_skill_id`** | Top-level on `EVASkillResolutionResponse`; `metadata.chosen_skill_id` on `EVAServiceResponse` | **Product field:** which skill this resolution / reply is grounded on (same as the LLM pick when `use_skill`). |
| **`llm_chosen_skill_id`** | **Only** inside `metadata.pipeline…comparison` (and `…routing.comparison` on chat) | **Trace field:** the skill id from the skill-selection LLM after validation (`null` unless `use_skill`). |

There is **no** separate `router_chosen_skill_id` anymore—use **`llm_chosen_skill_id`** in `comparison` for “what did the selection LLM output?”

### Skill resolution response (`EVASkillResolutionResponse`)

Top-level: `router_decision`, `chosen_skill_id`, `router_rationale`, `clarify_prompt` (when applicable). Full trace: `metadata.pipeline` → `vectorSearch`, `skillRouter`, `comparison`.

### Chat response (`EVAServiceResponse`)

**`outputPanel`** — mirrors **`inputPanel`** on the request: **`outputPanel.render`** (`layoutMode`, `blocks`) and **`outputPanel.rightPanel`** (declarative hints). The EMR should treat this as the governed UI payload for the turn.

Use **`metadata.chosen_skill_id`** for the skill tied to the rendered answer when stage 1 returned `use_skill` (may be absent for `ambiguous` / `no_match`). Full stage-1 trace: `metadata.pipeline.routing`.

Under **`metadata.pipeline`** (chat):

- **`routing`** — nested object: `version` (`skill-resolution-v1`), `vectorSearch`, `skillRouter`, `comparison` (stage 1 snapshot, same shape as skill-resolution).
- **`orchestrator`** — on a normal chat turn after successful indexing: `rawLlm`, `parsed` (model JSON including `assistant_text`, `render_blocks`, `rightPanel`, `display`, …), `parse_ok`. The canonical **`display`** for the client is **`metadata.display`** (same content, without duplicating it again under `orchestrator`). **`skipped`: true** appears only when the orchestrator **LLM call failed** (see `error`); it does **not** mean “ambiguous routing skipped the agent.” Ambiguous and no-match turns still run the orchestrator so the client gets chips, copy, and **`metadata.display`**.
- **`version`** — e.g. `eva-chat-v1` on the outer pipeline object.

If stage 1 fails hard (**no indexed chunks** / `routing` incomplete), the handler returns **`status`: `error`** with **`metadata.display`** for that scenario and **no** `orchestrator` block (nothing to orchestrate).

Use **`metadata.pipeline.routing.comparison`** the same way you used the flat `comparison` object on the old single endpoint.

### `metadata.display` (EMR left vs right panel)

Populated on **`/api/eva/chat`** so the host app can align chrome without inferring from free text. Typical keys (server merges model output with safe defaults):

| Key | Meaning |
|-----|--------|
| `scenario` | `success` \| `clarify` \| `no_match` \| `error` — coarse UX mode. |
| `left_panel_instruction` | What to emphasize in EVA chat / left rail (e.g. “lead with the clarifying question; then show suggested chips”). Complements **`outputPanel.render`** (actual blocks), not a substitute. |
| `right_panel_instruction` | How the host should treat application chrome vs **`outputPanel.rightPanel`** (e.g. “apply highlight if `action` is not `none`”). |
| `suggested_chip_labels` | Short labels; may also appear as **`actionChips`** in **`outputPanel.render.blocks`** when the model did not emit chips itself. |

The orchestrator system prompt requires the model to fill **`display`**; see `backend/eva_backend/prompts/templates/eva_agent_orchestrator_system.txt`.

### After similarity search only (vector retrieval)

Under **`metadata.pipeline.routing.vectorSearch`** (chat) or **`metadata.pipeline.vectorSearch`** (resolution endpoint only):

| Field | Meaning |
|-------|---------|
| `distinct_skill_ids` | Unique `skill_id` values among the top chunk hits, **in rank order** (best chunk first). |
| `skills_ranked` | Same information as objects: `rank`, `skill_id`, `skill_display_name`, `best_chunk_similarity`, `chunk_hits_in_passages`. |
| `top_similarity_skill_id` | The `skill_id` of the **single highest-scoring** chunk. |
| `hits` | Short previews per chunk (score, preview text). |
| `hits_full_text` | Present only when **`debug`: true** — full chunk bodies. |

### After the skill-selection LLM (`skillRouter`)

Under **`metadata.pipeline.routing.skillRouter`** (chat) or **`metadata.pipeline.skillRouter`** (resolution endpoint only):

- `parsed` — JSON from the model: `decision` (`use_skill` \| `no_match` \| `ambiguous`), `skill_id`, `rationale`, `clarifying_question`.
- `rawLlm` — Truncated raw model output for troubleshooting.

### Side-by-side summary

Under **`metadata.pipeline.routing.comparison`** (chat) or **`metadata.pipeline.comparison`** (resolution endpoint only):

| Field | Meaning |
|-------|---------|
| `vector_top_similarity_skill_id` | Same as `vectorSearch.top_similarity_skill_id`. |
| `vector_ranked_skill_ids` | Same order as `vectorSearch.distinct_skill_ids`. |
| `router_decision` | Outcome of the skill-selection LLM: `use_skill` \| `no_match` \| `ambiguous`. |
| `llm_chosen_skill_id` | Skill id the selection LLM chose (`null` for `no_match` / `ambiguous`). |
| `router_matches_vector_top` | Whether that skill equals the top vector hit (name kept for backward compatibility). |

**How to read it:** If `router_matches_vector_top` is `false` but `llm_chosen_skill_id` appears later in `vector_ranked_skill_ids`, the LLM preferred a lower-ranked but more fitting skill. If `ambiguous`, compare `vector_ranked_skill_ids` to see competing skills.

### Orchestrator (chat only)

`metadata.pipeline.orchestrator` holds the **stage 2** agent LLM trace: `rawLlm`, `parsed`, `parse_ok`. The server maps `parsed` into **`outputPanel`** and coerces **`metadata.display`**. This is the structured “what we respond to the client” step; you can add more fields to the orchestrator input later without changing **`EVAClientRequest`**.

**Two LLM calls on `/api/eva/chat` when routing succeeds:** (1) skill-selection JSON from passages, (2) orchestrator JSON for UI + **`metadata.display`**. Vector search alone is not an LLM call.

---

## 8. Optional: frontend against the same API

```bash
cd frontend
cp .env.example .env
# Set VITE_EVA_USE_BACKEND=1
npm install && npm run dev
```

Vite proxies `/api` to `http://127.0.0.1:5000` (see `frontend/vite.config.ts`).

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| 500 on `/api/eva/chat` or `/api/eva/skill-resolution` | Ollama running? `LLM_*` correct? `ollama pull <model>`. |
| 410 on `/api/eva/message` | Expected — use `/api/eva/chat` or `/api/eva/skill-resolution`. |
| Empty or nonsense router JSON | Model too small or not instruction-tried; inspect `skillRouter.rawLlm`. |
| Chunks API 404 | `EVA_EXPOSE_KNOWLEDGE_API=1` and restart Flask. |
| Old skills after editing markdown | Restart Flask so `ensure_knowledge_indexed()` runs; signature change rebuilds Redis keys. |
| Wrong provider | Remove duplicate `LLM_*` lines in `.env`. |

---

## Related files

- Contracts: `backend/eva_backend/contracts/message_models.py`
- Pipeline: `backend/eva_backend/services/eva_message_handler.py`
- Routes: `backend/eva_backend/api/eva_chat.py`, `backend/eva_backend/api/eva_skill_resolution.py`
- Orchestrator prompt: `backend/eva_backend/prompts/templates/eva_agent_orchestrator_system.txt`
- Chunk index: `backend/eva_backend/skills/knowledge_chunks.py`
- Registry: `backend/eva_backend/skills/registry/skills.json`
- Sample request: `examples/eva_client_request.sample.json`
