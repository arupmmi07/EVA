# Project overview

EVA Medical Assistant is a POC monorepo for an EMR-oriented AI assistant. The backend exposes a small HTTP API intended for a future chat client and EMR embedding scenarios.

## Phases

**POC must-have**

- Monorepo layout with backend-first implementation
- Flask app factory, thin routes, orchestration service boundary
- Environment-based configuration
- Redis and LLM integration points (stubs or minimal adapters)
- Prompt text separated from transport code
- Basic container deployment path

**Phase 2**

- Real local LLM wiring (Ollama, vLLM, etc.) behind the provider interface
- Redis-backed session history and vector search (Redis stack modules or alternative)
- Structured tool execution module with governance hooks
- Authentication and tenant boundaries

**Future ideas**

- Full MFE shell and module federation
- EMR-specific context providers and audit pipelines
- Multi-environment Helm charts and managed Redis
