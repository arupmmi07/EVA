from __future__ import annotations

from flask import Blueprint, jsonify

from eva_backend import __version__
from eva_backend.state import get_redis_client

bp = Blueprint("health", __name__)


@bp.get("/health")
def health() -> tuple[dict, int]:
    redis = get_redis_client()
    redis_ok = redis.ping()
    return (
        jsonify(
            {
                "status": "ok",
                "service": "eva-backend",
                "version": __version__,
                "redis": "ok" if redis_ok else "skipped_or_down",
            }
        ),
        200,
    )
