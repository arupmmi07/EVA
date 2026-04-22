from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from dataclasses import asdict

from eva_backend.config import get_settings
from eva_backend.llm.base import LLMCompletionRequest, LLMProvider

logger = logging.getLogger(__name__)


class OpenAICompatibleLLMProvider:
    """OpenAI-style chat completions (`POST /v1/chat/completions`)."""

    def __init__(self, base_url: str | None = None, model: str | None = None) -> None:
        s = get_settings()
        self._base = (base_url or s.llm_base_url or "").rstrip("/")
        self._model = model or s.llm_model or "gpt-4o-mini"

    def complete(self, req: LLMCompletionRequest) -> str:
        if not self._base:
            logger.info("LLM_BASE_URL not set; returning stub completion")
            return (
                "[EVA POC stub] Configure LLM_BASE_URL for live responses. "
                f"Echo user: {req.user_message[:200]}"
            )
        payload = {
            "model": self._model,
            "messages": [
                {"role": "system", "content": req.system_prompt},
                {"role": "user", "content": req.user_message},
            ],
            "max_tokens": req.max_tokens,
        }
        try:
            data = json.dumps(payload).encode("utf-8")
            http_req = urllib.request.Request(
                f"{self._base}/v1/chat/completions",
                data=data,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(http_req, timeout=120) as resp:
                body = json.loads(resp.read().decode("utf-8"))
            choices = body.get("choices") or []
            if not choices:
                return "[EVA] empty LLM response"
            msg = choices[0].get("message") or {}
            content = msg.get("content")
            return str(content) if content is not None else str(choices[0])
        except urllib.error.URLError as exc:
            logger.warning("OpenAI-compatible LLM request failed: %s", exc)
            return f"[EVA POC] LLM unreachable ({exc}). Payload keys: {list(asdict(req).keys())}"
