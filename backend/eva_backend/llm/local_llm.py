"""Backward-compatible export; prefer ``openai_compatible`` or ``factory.get_default_llm_provider``."""

from eva_backend.llm.openai_compatible import OpenAICompatibleLLMProvider

# Historical name used across the codebase
LocalHttpLLMProvider = OpenAICompatibleLLMProvider

__all__ = ["LocalHttpLLMProvider", "OpenAICompatibleLLMProvider"]
