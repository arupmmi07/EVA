"""
Chunked skill knowledge in Redis (vector hashes per chunk) + in-memory fallback.

Inspect locally: GET /api/eva/knowledge/chunks (when EVA_EXPOSE_KNOWLEDGE_API=1).
"""

from __future__ import annotations

import hashlib
import json
import logging
import uuid
from dataclasses import dataclass
from typing import Any, List, Optional

from eva_backend.config import get_settings
from eva_backend.skills.chunking import chunk_text
from eva_backend.skills.hashing_embed import cosine, hashing_embed, pack_f32, unpack_f32
from eva_backend.skills.registry_loader import SkillRegistryEntry, find_entry, load_registry, load_skill_corpus
from eva_backend.state.redis_client import redis_adapter_or_none

logger = logging.getLogger(__name__)

CHUNK_IDS_KEY = "eva:chunks:ids"
SIG_CHUNKS_KEY = "eva:chunks:sig"


def _content_signature() -> str:
    """Change when registry or any knowledge file content changes."""
    from eva_backend.skills.registry_loader import registry_path

    parts: list[str] = [registry_path().read_text(encoding="utf-8")]
    _, entries = load_registry()
    for e in entries:
        corpus = load_skill_corpus(e)
        parts.append(f"{e.skill_id}\0{corpus}")
    raw = "\n---\n".join(parts).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _chunk_redis_key(skill_id: str, chunk_index: int) -> str:
    return f"eva:chunk:{skill_id}:{chunk_index}"


@dataclass(frozen=True)
class KnowledgeHit:
    """One similarity hit: chunk text + skill registry context for the router LLM."""

    redis_key: str
    skill_id: str
    chunk_index: int
    score: float
    chunk_text: str
    skill_display_name: str
    skill_description: str
    skill_tags: tuple[str, ...]

    def to_router_dict(self) -> dict[str, Any]:
        return {
            "skill_id": self.skill_id,
            "chunk_index": self.chunk_index,
            "similarity_score": round(self.score, 6),
            "skill_display_name": self.skill_display_name,
            "skill_description": self.skill_description,
            "skill_tags": list(self.skill_tags),
            "chunk_text": self.chunk_text,
        }

    def preview(self, n: int = 220) -> dict[str, Any]:
        return {
            "redis_key": self.redis_key,
            "skill_id": self.skill_id,
            "chunk_index": self.chunk_index,
            "score": round(self.score, 6),
            "text_preview": self.chunk_text[:n] + ("…" if len(self.chunk_text) > n else ""),
            "skill_display_name": self.skill_display_name,
        }


_memory_records: list[dict[str, Any]] = []


def _build_memory_records() -> list[dict[str, Any]]:
    dim = get_settings().embedding_dim
    out: list[dict[str, Any]] = []
    _, entries = load_registry()
    for e in entries:
        corpus = load_skill_corpus(e)
        chunks = chunk_text(corpus, max_chars=650, overlap=90)
        for i, ch in enumerate(chunks):
            vec = hashing_embed(f"{e.skill_id}\n{ch}", dim=dim)
            out.append(
                {
                    "redis_key": _chunk_redis_key(e.skill_id, i),
                    "skill_id": e.skill_id,
                    "chunk_index": i,
                    "text": ch,
                    "vec": vec,
                    "display_name": e.display_name,
                    "description": e.description,
                    "tags": e.tags,
                }
            )
    return out


def ensure_knowledge_indexed() -> None:
    """Rebuild chunk vectors in Redis when signature changes."""
    global _memory_records
    sig = _content_signature()
    adapter = redis_adapter_or_none()
    if adapter is None:
        _memory_records = _build_memory_records()
        logger.info("knowledge chunk index in-memory (%d chunks)", len(_memory_records))
        return

    try:
        cur = adapter.get(SIG_CHUNKS_KEY)
        if cur and cur.decode("utf-8") == sig:
            return
    except Exception as exc:  # pragma: no cover
        logger.warning("chunk sig read failed: %s", exc)

    dim = get_settings().embedding_dim
    old_ids = list(adapter.smembers(CHUNK_IDS_KEY))
    if old_ids:
        adapter.delete(*old_ids)
    adapter.delete(CHUNK_IDS_KEY)
    adapter.delete(SIG_CHUNKS_KEY)

    _, entries = load_registry()
    count = 0
    for e in entries:
        corpus = load_skill_corpus(e)
        chunks = chunk_text(corpus, max_chars=650, overlap=90)
        for i, ch in enumerate(chunks):
            key = _chunk_redis_key(e.skill_id, i)
            vec = hashing_embed(f"{e.skill_id}\n{ch}", dim=dim)
            blob = pack_f32(vec)
            meta = json.dumps(
                {
                    "display_name": e.display_name,
                    "description": e.description,
                    "tags": list(e.tags),
                }
            )
            adapter.hset(
                key,
                {
                    b"embedding": blob,
                    b"text": ch.encode("utf-8", errors="replace")[:32000],
                    b"skill_id": e.skill_id.encode("utf-8"),
                    b"chunk_index": str(i).encode("ascii"),
                    b"meta": meta.encode("utf-8"),
                },
            )
            adapter.sadd(CHUNK_IDS_KEY, key)
            count += 1
    adapter.set(SIG_CHUNKS_KEY, sig.encode("utf-8"))
    logger.info("knowledge chunk index rebuilt in Redis (%d chunks, dim=%d)", count, dim)


def _search_memory_hits(qv: list[float], top_k: int) -> List[KnowledgeHit]:
    scored: list[tuple[float, dict[str, Any]]] = []
    for rec in _memory_records:
        c = cosine(qv, rec["vec"])
        scored.append((c, rec))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [_record_to_hit(r, s) for s, r in scored[:top_k]]


def search_knowledge_chunks(query: str, top_k: int = 10) -> List[KnowledgeHit]:
    ensure_knowledge_indexed()
    dim = get_settings().embedding_dim
    qv = hashing_embed(query, dim=dim)
    adapter = redis_adapter_or_none()

    if adapter is None:
        return _search_memory_hits(qv, top_k)

    ids = adapter.smembers(CHUNK_IDS_KEY)
    if not ids:
        ensure_knowledge_indexed()
        ids = adapter.smembers(CHUNK_IDS_KEY)
    if not ids:
        global _memory_records
        _memory_records = _build_memory_records()
        return _search_memory_hits(qv, top_k)

    scored2: list[tuple[float, str, dict[bytes, bytes]]] = []
    for key in ids:
        data = adapter.hgetall(key)
        if not data or b"embedding" not in data:
            continue
        vec = unpack_f32(data[b"embedding"])
        if len(vec) != dim:
            continue
        scored2.append((cosine(qv, vec), key, data))
    scored2.sort(key=lambda x: x[0], reverse=True)

    hits: list[KnowledgeHit] = []
    for score, key, data in scored2[:top_k]:
        text = data.get(b"text", b"").decode("utf-8", errors="replace")
        sid = data.get(b"skill_id", b"").decode("utf-8", errors="replace")
        idx_raw = data.get(b"chunk_index", b"0")
        try:
            idx = int(idx_raw.decode("ascii", errors="replace"))
        except ValueError:
            idx = 0
        meta_raw = data.get(b"meta", b"{}")
        try:
            meta = json.loads(meta_raw.decode("utf-8"))
        except json.JSONDecodeError:
            meta = {}
        hits.append(
            KnowledgeHit(
                redis_key=key,
                skill_id=sid,
                chunk_index=idx,
                score=score,
                chunk_text=text,
                skill_display_name=str(meta.get("display_name", "")),
                skill_description=str(meta.get("description", "")),
                skill_tags=tuple(str(t) for t in meta.get("tags", []) if t),
            )
        )
    return hits


def _record_to_hit(rec: dict[str, Any], score: float) -> KnowledgeHit:
    return KnowledgeHit(
        redis_key=rec["redis_key"],
        skill_id=rec["skill_id"],
        chunk_index=int(rec["chunk_index"]),
        score=score,
        chunk_text=rec["text"],
        skill_display_name=rec["display_name"],
        skill_description=rec["description"],
        skill_tags=tuple(rec["tags"]),
    )


def list_indexed_chunks_for_debug(*, text_preview_chars: int = 280) -> dict[str, Any]:
    """Return all chunks (previews) for local inspection."""
    ensure_knowledge_indexed()
    adapter = redis_adapter_or_none()
    if adapter is None:
        return {
            "storage": "memory",
            "chunk_count": len(_memory_records),
            "chunks": [
                {
                    "redis_key": r["redis_key"],
                    "skill_id": r["skill_id"],
                    "chunk_index": r["chunk_index"],
                    "text_preview": (r["text"][:text_preview_chars] + "…")
                    if len(r["text"]) > text_preview_chars
                    else r["text"],
                    "skill_display_name": r["display_name"],
                }
                for r in _memory_records
            ],
        }

    ids = sorted(adapter.smembers(CHUNK_IDS_KEY))
    rows: list[dict[str, Any]] = []
    for key in ids:
        data = adapter.hgetall(key)
        if not data:
            continue
        text = data.get(b"text", b"").decode("utf-8", errors="replace")
        sid = data.get(b"skill_id", b"").decode("utf-8", errors="replace")
        idx_raw = data.get(b"chunk_index", b"0")
        try:
            idx = int(idx_raw.decode("ascii", errors="replace"))
        except ValueError:
            idx = 0
        rows.append(
            {
                "redis_key": key,
                "skill_id": sid,
                "chunk_index": idx,
                "text_preview": (text[:text_preview_chars] + "…")
                if len(text) > text_preview_chars
                else text,
                "char_length": len(text),
            }
        )
    return {"storage": "redis", "chunk_count": len(rows), "chunks": rows, "signature": _content_signature()[:16] + "…"}
