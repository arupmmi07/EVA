from __future__ import annotations

import logging

from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from eva_backend.contracts.message_models import EVAClientRequest
from eva_backend.errors import AppError
from eva_backend.services.eva_message_handler import handle_skill_resolution_request

logger = logging.getLogger(__name__)
bp = Blueprint("eva_skill_resolution", __name__)


@bp.post("/eva/skill-resolution")
def eva_skill_resolution() -> tuple[dict, int]:
    """
    Skill resolution (OpenAPI-style sub-resource): one HTTP request → one ``EVASkillResolutionResponse``.

    Semantics: **resolve** which skill applies (vector retrieval + skill-router LLM), not a chat session.
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
        resp = handle_skill_resolution_request(req)
    except Exception as exc:  # pragma: no cover
        logger.exception("eva skill-resolution failure")
        err = AppError(
            "eva_error",
            "EVA failed to run skill resolution.",
            500,
            details={"reason": str(exc)},
        )
        return jsonify(err.to_dict()), err.status_code

    return jsonify(resp.model_dump(mode="json")), 200


@bp.post("/eva/message")
def eva_message_retired() -> tuple[dict, int]:
    """Retired: use POST /api/eva/skill-resolution and POST /api/eva/chat."""
    return (
        jsonify(
            {
                "error": "gone",
                "message": "POST /api/eva/message is retired. Use POST /api/eva/skill-resolution for skill resolution (EVASkillResolutionResponse) and POST /api/eva/chat for the full governed turn (EVAServiceResponse).",
                "skill_resolution": "/api/eva/skill-resolution",
                "chat": "/api/eva/chat",
            }
        ),
        410,
    )
