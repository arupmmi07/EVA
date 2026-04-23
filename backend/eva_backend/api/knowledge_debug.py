from __future__ import annotations

from flask import Blueprint, jsonify

from eva_backend.config import get_settings
from eva_backend.skills.knowledge_chunks import list_indexed_chunks_for_debug

bp = Blueprint("knowledge_debug", __name__)


@bp.get("/eva/knowledge/chunks")
def knowledge_chunks() -> tuple[dict, int]:
    """
    Local inspection: list all indexed knowledge chunks (previews + Redis keys).
    Enable with EVA_EXPOSE_KNOWLEDGE_API=1 in .env
    """
    if not get_settings().expose_knowledge_api:
        return jsonify({"error": "disabled", "hint": "Set EVA_EXPOSE_KNOWLEDGE_API=1 in .env"}), 404
    return jsonify(list_indexed_chunks_for_debug()), 200
