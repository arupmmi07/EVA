from __future__ import annotations

import logging

from eva_backend.config import get_settings
from eva_backend.llm.base import LLMProvider
from eva_backend.llm.ollama_native import OllamaNativeLLMProvider
from eva_backend.llm.openai_compatible import OpenAICompatibleLLMProvider

logger = logging.getLogger(__name__)


def _looks_like_ollama_host(url: str) -> bool:
    u = url.lower()
    return "11434" in u or "ollama" in u


def get_default_llm_provider() -> LLMProvider:
    """
    LLM_PROVIDER:
      - openai_compatible — POST /v1/chat/completions (OpenAI, LiteLLM, vLLM OpenAI mode, etc.)
      - ollama — POST /api/chat (native Ollama)
      - auto — ollama if URL looks like local Ollama (:11434 or hostname ollama), else openai_compatible
    """
    s = get_settings()
    if not (s.llm_base_url or "").strip():
        return OpenAICompatibleLLMProvider()

    mode = (s.llm_provider or "auto").strip().lower()
    if mode == "auto":
        mode = "ollama" if _looks_like_ollama_host(s.llm_base_url or "") else "openai_compatible"

    if mode == "ollama":
        logger.info("LLM mode=ollama (native /api/chat) base=%s model=%s", s.llm_base_url, s.llm_model)
        return OllamaNativeLLMProvider()
    if mode == "openai_compatible":
        logger.info(
            "LLM mode=openai_compatible (/v1/chat/completions) base=%s model=%s",
            s.llm_base_url,
            s.llm_model,
        )
        return OpenAICompatibleLLMProvider()

    logger.warning("Unknown LLM_PROVIDER=%s; falling back to openai_compatible", mode)
    return OpenAICompatibleLLMProvider()
