from __future__ import annotations

import math
import re
from typing import List, Sequence


_TOKEN = re.compile(r"[a-z0-9]+")


def tokenize(text: str) -> List[str]:
    return _TOKEN.findall(text.lower())


def hashing_embed(text: str, dim: int = 128) -> List[float]:
    """
    Deterministic bag-of-tokens embedding (POC, no external API).
    Replace with Ollama/OpenAI embeddings when ready.
    """
    vec = [0.0] * dim
    for w in tokenize(text):
        h = hash(w) % dim
        vec[h] += 1.0
    norm = math.sqrt(sum(x * x for x in vec)) or 1.0
    return [x / norm for x in vec]


def cosine(a: Sequence[float], b: Sequence[float]) -> float:
    if len(a) != len(b):
        return 0.0
    return sum(x * y for x, y in zip(a, b))


def pack_f32(vec: Sequence[float]) -> bytes:
    import struct

    return struct.pack(f"{len(vec)}f", *vec)


def unpack_f32(blob: bytes) -> List[float]:
    import struct

    n = len(blob) // 4
    return list(struct.unpack(f"{n}f", blob))
