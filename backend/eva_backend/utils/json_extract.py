from __future__ import annotations

import json
import re
from typing import Any, Dict, Optional


def extract_json_object(text: str) -> Optional[Dict[str, Any]]:
    """Parse first JSON object from model output (handles optional markdown fences)."""
    t = text.strip()
    if t.startswith("```"):
        t = re.sub(r"^```[a-zA-Z0-9_-]*\s*", "", t).strip()
        if t.endswith("```"):
            t = t[:-3].strip()
    try:
        out = json.loads(t)
        return out if isinstance(out, dict) else None
    except json.JSONDecodeError:
        pass
    start = t.find("{")
    end = t.rfind("}")
    if start < 0 or end <= start:
        return None
    try:
        out = json.loads(t[start : end + 1])
        return out if isinstance(out, dict) else None
    except json.JSONDecodeError:
        return None
