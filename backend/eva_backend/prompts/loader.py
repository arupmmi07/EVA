from __future__ import annotations

from importlib import resources


def load_text_prompt(name: str) -> str:
    """
    Load a packaged prompt file from eva_backend.prompts.templates.
    Keeps prompt text out of route handlers and services.
    """
    pkg = "eva_backend.prompts.templates"
    return resources.files(pkg).joinpath(f"{name}.txt").read_text(encoding="utf-8")
