from __future__ import annotations

import logging

from flask import Blueprint, jsonify, request

from eva_backend.errors import AppError
from eva_backend.services.eva_orchestrator import EvaOrchestrator

logger = logging.getLogger(__name__)
bp = Blueprint("eva_chat", __name__)

_orchestrator = EvaOrchestrator()


@bp.post("/eva/chat")
def eva_chat() -> tuple[dict, int]:
    """Placeholder EVA chat contract; stable JSON for future MFE / EMR clients."""
    body = request.get_json(silent=True) or {}
    message = body.get("message")
    if not message or not isinstance(message, str):
        err = AppError(
            code="invalid_request",
            message="Field 'message' (string) is required.",
            status_code=400,
        )
        return jsonify(err.to_dict()), err.status_code
    session_id = body.get("session_id")
    if session_id is not None and not isinstance(session_id, str):
        err = AppError(
            code="invalid_request",
            message="Field 'session_id' must be a string when provided.",
            status_code=400,
        )
        return jsonify(err.to_dict()), err.status_code

    try:
        result = _orchestrator.handle_chat_turn(
            user_message=message,
            session_id=session_id,
        )
    except Exception as exc:  # pragma: no cover - safety net for POC
        logger.exception("eva chat failure")
        err = AppError(
            code="eva_error",
            message="EVA failed to process the request.",
            status_code=500,
            details={"reason": str(exc)},
        )
        return jsonify(err.to_dict()), err.status_code

    return (
        jsonify(
            {
                "reply": result.reply,
                "session_id": result.session_id,
                "redis_ok": result.redis_ok,
            }
        ),
        200,
    )
