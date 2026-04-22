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

## Request flow (chat)

1. Client `POST /api/eva/chat` with `{ "message": "...", "session_id": "optional" }`.
2. Route validates input and calls `EvaOrchestrator.handle_chat_turn`.
3. Orchestrator loads system prompt from `prompts/templates`, optionally touches Redis, builds `LLMCompletionRequest`.
4. `LLMProvider.complete` returns text (live HTTP or stub when unset).
5. JSON response returns `reply`, `session_id`, and `redis_ok` for observability in POC.

## POC vs later scope

See [project overview](../project-overview.md) for phased bullets. Architecture keeps interfaces small so vector search, tools, and alternate LLMs can slot in without rewriting the API layer.
