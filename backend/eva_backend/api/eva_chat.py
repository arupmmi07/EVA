from __future__ import annotations

import logging

from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from eva_backend.contracts.message_models import EVAClientRequest
from eva_backend.errors import AppError
from eva_backend.services.eva_message_handler import handle_eva_chat_request
from eva_backend.services.eva_orchestrator import EvaOrchestrator

logger = logging.getLogger(__name__)
bp = Blueprint("eva_chat", __name__)

_legacy_orchestrator = EvaOrchestrator()


@bp.post("/eva/chat")
def eva_chat() -> tuple[dict, int]:
    """
    Governed EVA turn: EVAClientRequest (query + inputPanel) → EVAServiceResponse.
    Runs skill routing, then the agent orchestrator LLM; response uses outputPanel (render + rightPanel) plus metadata.
    """
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        err = AppError("invalid_request", "JSON body required.", 400)
        return jsonify(err.to_dict()), err.status_code
    try:
        req = EVAClientRequest.model_validate(body)
    except ValidationError as ve:
        err = AppError(
            "invalid_request",
            "Request does not match EVAClientRequest schema.",
            400,
            details={"errors": ve.errors()},
        )
        return jsonify(err.to_dict()), err.status_code

    try:
        resp = handle_eva_chat_request(req)
    except Exception as exc:  # pragma: no cover
        logger.exception("eva chat failure")
        err = AppError(
            "eva_error",
            "EVA failed to process the request.",
            500,
            details={"reason": str(exc)},
        )
        return jsonify(err.to_dict()), err.status_code

    return jsonify(resp.model_dump(mode="json")), 200


@bp.post("/eva/chat/legacy")
def eva_chat_legacy() -> tuple[dict, int]:
    """Smoke test: simple { \"message\": \"...\", \"session_id\": optional } → reply JSON."""
    body = request.get_json(silent=True) or {}
    message = body.get("message")
    if not message or not isinstance(message, str):
        err = AppError("invalid_request", "Field 'message' (string) is required.", 400)
        return jsonify(err.to_dict()), err.status_code
    session_id = body.get("session_id")
    if session_id is not None and not isinstance(session_id, str):
        err = AppError("invalid_request", "Field 'session_id' must be a string when provided.", 400)
        return jsonify(err.to_dict()), err.status_code

    try:
        result = _legacy_orchestrator.handle_chat_turn(
            user_message=message,
            session_id=session_id,
        )
    except Exception as exc:  # pragma: no cover
        logger.exception("eva chat legacy failure")
        err = AppError(
            "eva_error",
            "EVA failed to process the request.",
            500,
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
