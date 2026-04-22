from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass

from eva_backend.llm.base import LLMCompletionRequest, LLMProvider
from eva_backend.llm.factory import get_default_llm_provider
from eva_backend.prompts import load_text_prompt
from eva_backend.state import get_redis_client

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class EvaTurnResult:
    reply: str
    session_id: str
    redis_ok: bool


class EvaOrchestrator:
    """
    Main EVA orchestration entry for the POC.
    Coordinates prompts, optional Redis session keying, and LLM calls.
    """

    def __init__(self, llm: LLMProvider | None = None) -> None:
        self._llm: LLMProvider = llm or get_default_llm_provider()

    def handle_chat_turn(
        self,
        *,
        user_message: str,
        session_id: str | None = None,
    ) -> EvaTurnResult:
        sid = session_id or str(uuid.uuid4())
        system_prompt = load_text_prompt("eva_system")
        redis = get_redis_client()
        redis_ok = redis.ping()
        if redis_ok:
            try:
                redis.set(f"eva:session:{sid}:last_user", user_message[:4000], ex=86400)
            except Exception as exc:  # pragma: no cover
                logger.warning("redis set failed: %s", exc)
                redis_ok = False

        req = LLMCompletionRequest(
            system_prompt=system_prompt,
            user_message=user_message,
        )
        reply = self._llm.complete(req)
        return EvaTurnResult(reply=reply, session_id=sid, redis_ok=redis_ok)
