from __future__ import annotations

import logging
from typing import Any, Protocol

from eva_backend.config import get_settings

logger = logging.getLogger(__name__)


class RedisClient(Protocol):
    """Minimal Redis surface for POC; extend for cache, session, vectors."""

    def ping(self) -> bool: ...
    def get(self, key: str) -> bytes | None: ...
    def set(self, key: str, value: str | bytes, ex: int | None = None) -> bool: ...


class _NoRedis:
    def ping(self) -> bool:
        return False

    def get(self, key: str) -> bytes | None:
        return None

    def set(self, key: str, value: str | bytes, ex: int | None = None) -> bool:
        return False


class _RedisAdapter:
    """Thin wrapper exposing a few primitives used by session + skill vector POC."""

    def __init__(self, client: Any) -> None:
        self._c = client

    def ping(self) -> bool:
        try:
            return bool(self._c.ping())
        except Exception as exc:  # pragma: no cover - defensive for POC
            logger.warning("redis ping failed: %s", exc)
            return False

    def get(self, key: str) -> bytes | None:
        return self._c.get(key)

    def set(self, key: str, value: str | bytes, ex: int | None = None) -> bool:
        return bool(self._c.set(key, value, ex=ex))

    def delete(self, *keys: str) -> int:
        return int(self._c.delete(*keys))

    def hset(self, name: str, mapping: dict[str, str | bytes]) -> int:
        return int(self._c.hset(name, mapping=mapping))

    def hgetall(self, name: str) -> dict[bytes, bytes]:
        raw = self._c.hgetall(name)
        return dict(raw) if raw else {}

    def sadd(self, key: str, *members: str) -> int:
        return int(self._c.sadd(key, *members))

    def smembers(self, key: str) -> set[str]:
        raw = self._c.smembers(key)
        out: set[str] = set()
        for m in raw or []:
            if isinstance(m, bytes):
                out.add(m.decode("utf-8", errors="replace"))
            else:
                out.add(str(m))
        return out


def redis_adapter_or_none() -> _RedisAdapter | None:
    """Return real adapter for skill/index code, or None when stub/no URL."""
    c = get_redis_client()
    return c if isinstance(c, _RedisAdapter) else None


_client: RedisClient | None = None


def get_redis_client() -> RedisClient:
    """Lazy singleton. Returns no-op stub when REDIS_URL is unset."""
    global _client
    if _client is not None:
        return _client
    url = get_settings().redis_url
    if not url:
        logger.info("REDIS_URL not set; using in-memory no-op Redis stub")
        _client = _NoRedis()
        return _client
    try:
        import redis

        _client = _RedisAdapter(redis.Redis.from_url(url, decode_responses=False))
    except Exception as exc:  # pragma: no cover
        logger.warning("redis init failed (%s); using stub", exc)
        _client = _NoRedis()
    return _client


def reset_redis_client_for_tests() -> None:
    global _client
    _client = None
