from __future__ import annotations

import hashlib
import json
import logging
from dataclasses import dataclass
from typing import List

from eva_backend.config import get_settings
from eva_backend.skills.hashing_embed import cosine, hashing_embed, pack_f32, unpack_f32
from eva_backend.skills.registry_loader import SkillRegistryEntry, load_registry, load_skill_corpus
from eva_backend.state.redis_client import redis_adapter_or_none

logger = logging.getLogger(__name__)

SIG_KEY = "eva:skills:sig"
IDS_KEY = "eva:skills:all"


@dataclass(frozen=True)
class SkillCandidate:
    skill_id: str
    display_name: str
    score: float
    corpus_excerpt: str


def _registry_signature() -> str:
    from eva_backend.skills.registry_loader import registry_path

    body = registry_path().read_bytes()
    return hashlib.sha256(body).hexdigest()


def _hash_key(skill_id: str) -> str:
    return f"eva:skill:doc:{skill_id}"


def ensure_skills_indexed() -> None:
    """Load registry + knowledge into Redis vectors (hashing embed). No-op if Redis unavailable."""
    adapter = redis_adapter_or_none()
    if adapter is None:
        logger.info("skills index skipped (no Redis); using in-memory search at query time")
        return
    sig = _registry_signature()
    try:
        existing = adapter.get(SIG_KEY)
        if existing and existing.decode("utf-8") == sig:
            return
    except Exception as exc:  # pragma: no cover
        logger.warning("skills sig read failed: %s", exc)

    dim = get_settings().embedding_dim
    _, entries = load_registry()
    old_ids = list(adapter.smembers(IDS_KEY))
    for sid in old_ids:
        adapter.delete(_hash_key(sid))
    adapter.delete(IDS_KEY)

    for e in entries:
        corpus = load_skill_corpus(e)
        text_for_vec = f"{e.display_name}\n{e.description}\n{corpus}"[:12000]
        vec = hashing_embed(text_for_vec, dim=dim)
        blob = pack_f32(vec)
        key = _hash_key(e.skill_id)
        adapter.delete(key)
        adapter.hset(
            key,
            {
                b"embedding": blob,
                b"name": e.display_name.encode("utf-8"),
                b"corpus": corpus.encode("utf-8", errors="replace")[:65000],
            },
        )
        adapter.sadd(IDS_KEY, e.skill_id)
    adapter.set(SIG_KEY, sig.encode("utf-8"))
    logger.info("skills index rebuilt (%d skills, dim=%d)", len(entries), dim)


def _memory_search(query: str, top_k: int, dim: int) -> List[SkillCandidate]:
    _, entries = load_registry()
    qv = hashing_embed(query, dim=dim)
    scored: List[tuple] = []
    for e in entries:
        corpus = load_skill_corpus(e)
        cv = hashing_embed(f"{e.display_name}\n{e.description}\n{corpus}"[:12000], dim=dim)
        scored.append((cosine(qv, cv), e, corpus[:600]))
    scored.sort(key=lambda x: x[0], reverse=True)
    out: List[SkillCandidate] = []
    for score, e, excerpt in scored[:top_k]:
        out.append(
            SkillCandidate(
                skill_id=e.skill_id,
                display_name=e.display_name,
                score=score,
                corpus_excerpt=excerpt,
            )
        )
    return out


def search_skills(query: str, top_k: int = 5) -> List[SkillCandidate]:
    dim = get_settings().embedding_dim
    adapter = redis_adapter_or_none()
    if adapter is None:
        return _memory_search(query, top_k, dim)

    ensure_skills_indexed()
    ids = adapter.smembers(IDS_KEY)
    if not ids:
        ensure_skills_indexed()
        ids = adapter.smembers(IDS_KEY)
    if not ids:
        return _memory_search(query, top_k, dim)

    qv = hashing_embed(query, dim=dim)
    scored: List[tuple] = []
    for sid in ids:
        data = adapter.hgetall(_hash_key(sid))
        if not data:
            continue
        emb = data.get(b"embedding")
        name_b = data.get(b"name", b"")
        corp_b = data.get(b"corpus", b"")
        if not emb:
            continue
        vec = unpack_f32(emb)
        if len(vec) != dim:
            continue
        c = cosine(qv, vec)
        name = name_b.decode("utf-8", errors="replace")
        excerpt = corp_b.decode("utf-8", errors="replace")[:600]
        scored.append((c, sid, name, excerpt))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [
        SkillCandidate(skill_id=sid, display_name=name, score=score, corpus_excerpt=ex)
        for score, sid, name, ex in scored[:top_k]
    ]


def skill_json_catalog() -> str:
    """Compact registry listing for prompts (no full knowledge)."""
    ver, entries = load_registry()
    rows = [
        {
            "skill_id": e.skill_id,
            "display_name": e.display_name,
            "description": e.description,
            "tags": list(e.tags),
        }
        for e in entries
    ]
    return json.dumps({"registry_version": ver, "skills": rows}, indent=2)
