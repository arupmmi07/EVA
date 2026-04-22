from __future__ import annotations

import logging

from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from eva_backend.contracts.message_models import EVAClientRequest
from eva_backend.errors import AppError
from eva_backend.services.eva_message_handler import handle_eva_client_request

logger = logging.getLogger(__name__)
bp = Blueprint("eva_message", __name__)


@bp.post("/eva/message")
def eva_message() -> tuple[dict, int]:
    """Governed EVA turn: EVAClientRequest → EVAServiceResponse (HTTP POST, no streaming)."""
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
        resp = handle_eva_client_request(req)
    except Exception as exc:  # pragma: no cover
        logger.exception("eva message failure")
        err = AppError(
            "eva_error",
            "EVA failed to process the request.",
            500,
            details={"reason": str(exc)},
        )
        return jsonify(err.to_dict()), err.status_code

    return jsonify(resp.model_dump(mode="json")), 200
