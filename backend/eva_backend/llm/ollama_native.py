from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from dataclasses import asdict

from eva_backend.config import get_settings
from eva_backend.llm.base import LLMCompletionRequest, LLMProvider

logger = logging.getLogger(__name__)


class OllamaNativeLLMProvider:
    """
    Native Ollama chat API: POST /api/chat
    See https://github.com/ollama/ollama/blob/main/docs/api.md
    """

    def __init__(self, base_url: str | None = None, model: str | None = None) -> None:
        s = get_settings()
        self._base = (base_url or s.llm_base_url or "").rstrip("/")
        self._model = model or s.llm_model or "llama3.2"

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
            "stream": False,
            "options": {"num_predict": req.max_tokens},
        }
        try:
            data = json.dumps(payload).encode("utf-8")
            http_req = urllib.request.Request(
                f"{self._base}/api/chat",
                data=data,
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(http_req, timeout=120) as resp:
                body = json.loads(resp.read().decode("utf-8"))
            msg = body.get("message") or {}
            content = msg.get("content")
            if content is not None:
                return str(content)
            return str(body.get("response", "")) or "[EVA] empty Ollama response"
        except urllib.error.URLError as exc:
            logger.warning("Ollama native LLM request failed: %s", exc)
            return f"[EVA POC] Ollama unreachable ({exc}). Payload keys: {list(asdict(req).keys())}"
