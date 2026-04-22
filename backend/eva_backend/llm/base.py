from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class LLMCompletionRequest:
    system_prompt: str
    user_message: str
    max_tokens: int = 512


class LLMProvider(Protocol):
    """Swap implementations (local HTTP, Ollama, vLLM, etc.) without touching EVA core."""

    def complete(self, req: LLMCompletionRequest) -> str: ...
