from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


def _env(key: str, default: str | None = None) -> str | None:
    val = os.environ.get(key)
    if val is None or val == "":
        return default
    return val


@dataclass(frozen=True)
class Settings:
    """Environment-driven configuration. No secrets committed to code."""

    flask_env: str
    secret_key: str
    redis_url: str | None
    llm_base_url: str | None
    llm_model: str | None
    llm_provider: str
    log_level: str
    embedding_dim: int


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    ed_raw = _env("EMBEDDING_DIM", "128") or "128"
    try:
        embedding_dim = max(32, min(1024, int(ed_raw)))
    except ValueError:
        embedding_dim = 128
    return Settings(
        flask_env=_env("FLASK_ENV", "development") or "development",
        secret_key=_env("SECRET_KEY", "dev-change-me") or "dev-change-me",
        redis_url=_env("REDIS_URL"),
        llm_base_url=_env("LLM_BASE_URL"),
        llm_model=_env("LLM_MODEL", "llama3.2"),
        llm_provider=(_env("LLM_PROVIDER", "auto") or "auto").strip().lower(),
        log_level=_env("LOG_LEVEL", "INFO") or "INFO",
        embedding_dim=embedding_dim,
    )
