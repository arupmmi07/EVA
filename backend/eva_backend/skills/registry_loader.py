from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Tuple


@dataclass(frozen=True)
class SkillRegistryEntry:
    skill_id: str
    display_name: str
    description: str
    category: str
    tags: Tuple[str, ...]
    knowledge_files: Tuple[str, ...]


def registry_path() -> Path:
    return Path(__file__).resolve().parent / "registry" / "skills.json"


def load_registry() -> Tuple[str, List[SkillRegistryEntry]]:
    raw = json.loads(registry_path().read_text(encoding="utf-8"))
    version = str(raw.get("version", "1.0"))
    skills: List[SkillRegistryEntry] = []
    for row in raw.get("skills", []):
        skills.append(
            SkillRegistryEntry(
                skill_id=str(row["skill_id"]),
                display_name=str(row.get("display_name", "")),
                description=str(row.get("description", "")),
                category=str(row.get("category", "")),
                tags=tuple(str(t) for t in row.get("tags", []) if t),
                knowledge_files=tuple(str(f) for f in row.get("knowledge_files", []) if f),
            )
        )
    return version, skills


def find_entry(skill_id: str) -> Optional[SkillRegistryEntry]:
    _, entries = load_registry()
    for e in entries:
        if e.skill_id == skill_id:
            return e
    return None


def load_skill_corpus(entry: SkillRegistryEntry) -> str:
    base = Path(__file__).resolve().parent / "knowledge"
    parts = [entry.display_name, entry.description, " ".join(entry.tags)]
    for name in entry.knowledge_files:
        p = base / name
        if p.is_file():
            parts.append(p.read_text(encoding="utf-8"))
    return "\n\n".join(parts)
