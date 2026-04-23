# POC backend architecture

## Overview

The backend follows a layered layout: HTTP API → application services (EVA orchestration) → LLM and state adapters → configuration.

## Main components

| Layer | Location | Role |
|-------|----------|------|
| API | `eva_backend/api/` | Blueprints, request/response JSON, minimal validation |
| Orchestration | `eva_backend/services/eva_orchestrator.py` | EVA turn handling, prompt assembly, coordination |
| LLM | `eva_backend/llm/` | Provider protocol and local HTTP adapter stub |
| State | `eva_backend/state/` | Redis client wrapper with safe no-op fallback |
| Prompts | `eva_backend/prompts/` | Packaged templates loaded by name |
| Config | `eva_backend/config/` | Dataclass settings from environment variables |
| Infrastructure | `deploy/` | Docker image and compose for Redis + API |

## Request flow (governed EVA)

1. Client `POST /api/eva/chat` with **`EVAClientRequest`** (`query`, `inputPanel` with `render` + `rightPanel`).
2. `handle_eva_chat_request` runs **skill resolution** (chunk vector search + skill-router LLM), then the **EVA agent orchestrator** LLM (`eva_agent_orchestrator_system.txt`) which emits JSON for assistant text, `render_blocks`, and `rightPanel` (mapped server-side into **`outputPanel`**).
3. Response is **`EVAServiceResponse`** for EMR / MFE rendering (`conversation` + **`outputPanel`** + `metadata`). Metadata includes nested `pipeline.routing` and `pipeline.orchestrator`.

**Stage 1 only:** `POST /api/eva/skill-resolution` with the same body → **`EVASkillResolutionResponse`** (skill resolution metadata, no orchestrator).

**Legacy smoke:** `POST /api/eva/chat/legacy` with `{ "message": "...", "session_id": "optional" }` → `EvaOrchestrator.handle_chat_turn` → `{ reply, session_id, redis_ok }`.

**Retired:** `POST /api/eva/message` returns **410** (use `skill-resolution` + `chat` above).

## POC vs later scope

See [project overview](../project-overview.md) for phased bullets. Architecture keeps interfaces small so vector search, tools, and alternate LLMs can slot in without rewriting the API layer.
